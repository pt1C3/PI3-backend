const { Op, fn, col, literal } = require('sequelize');
var sequelize = require('../models/database');
const initModels = require('../models/init-models');
const { USER, plan, payment, product, category, price, business } = initModels(sequelize);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');


const controller = {}
sequelize.sync(); //Sincroniza com a DB

//Listagem dos filmes
controller.users_list = async (req, res) => {
    await USER.findAll().then(data => { res.json(data) });
}
controller.login = async (req, res) => {
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
    }
    var user = await USER.findOne({ where: { email: email } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            console.log("Error: " + error);
            return error;
        })
    if (password === null || typeof password === "undefined") {
        res.status(403).json({
            success: false,
            message: 'Please check your email and password.'
        });
    } else {
        if (req.body.email && req.body.password && user) {
            const isMatch = bcrypt.compareSync(password, user.password);
            if (req.body.email === user.email && isMatch) {
                let token = jwt.sign({ email: req.body.email }, config.jwtSecret,
                    {
                        expiresIn: '1h' //expira em 1 hora
                    });
                res.json({ success: true, message: 'Authentication succeded', token: token, data: user });
            } else {
                res.status(403).json({ success: false, message: 'Authentication failed. Please check your email and password.' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Error trying to login. Try again later.' });
        }
    }

}



controller.user_plans = async (req, res) => {
    const businessid = req.params.businessid;

    try {
        const plans = await plan.findAll({
            attributes: [[fn('DATE', col('sale_date')), 'sale_date'], 'planid', 'planstatusid'],
            where: { businessid: businessid },
            order: [['planstatusid', 'DESC']],
            include: [
                {
                    model: price,
                    as: 'price',
                    attributes: [
                        [fn('ROUND', col('price'), 2), 'price'], // Format price to 2 decimal points
                        'number_of_licenses',
                        'priceid'
                    ],
                    include: [
                        {
                            model: product,
                            as: 'product'
                        }
                    ]
                },
                {
                    model: payment,
                    as: 'payments',
                    attributes: [
                        'payment_date',
                        [fn('DATE', col('due_date')), 'due_date'],
                        'pstatusid'
                    ], order: [['due_date', 'DESC']], // Get the latest payment first
                    limit: 1 // Limit to one latest payment
                }
            ]
        });

        // Process plans to create a new payment with updated due_date
        const processedPlans = await Promise.all(plans.map(async (item) => {
            const latestPayment = item.payments[0]; // Assuming payments are ordered by due_date DESC

            if (latestPayment && latestPayment.payment_date) {
                const previousDueDate = latestPayment.due_date;
                const newDueDate = new Date(previousDueDate);
                newDueDate.setMonth(newDueDate.getMonth() + 1); // Add one month to the previous due_date

                // Create a new payment with extended due_date and null payment_date
                const createdPayment = await payment.create({
                    planid: item.planid,
                    pstatusid: 1,
                    payment_date: null,
                    due_date: newDueDate
                });

                // Return plan with updated payment information
                return {
                    ...item.toJSON(),
                    product: item.price.product.toJSON(),

                };
            } else {
                // No previous payment or payment not paid yet
                return {
                    ...item.toJSON(),
                    product: item.price.product.toJSON(),
                };
            }
        }));

        res.json(processedPlans);
    } catch (error) {
        console.error('Error fetching user plans:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching user plans.',
            error: error.message
        });
    }
};



controller.create_user = async (req, res) => {
    const { firstname, lastname, email, password, country, phone_number, businessNew } = req.body;
    const existingUser = await USER.findOne({ where: { email: email } });
    if (existingUser) {
        res.json({
            success: false,
            message: "Email already in use."
        });
    }
    else {


        const createdUser = await USER.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            country: country,
            phone_number: phone_number,
            image: 'https://pi3-backend.onrender.com/images/users/1.png',
            utypeid: 1,
            ustatusid: 2
        }
        ).then(function (data) {
            return data;
        }
        ).catch(error => {
            console.log("Erro: " + error);
            res.json({
                success: false,
                message: error
            });
        })

        if (businessNew) {
            const createdBusiness = await business.create({
                userid: createdUser.userid,
                name: businessNew.name,
                website: businessNew.website
            }).then(data => { return data })
            createdUser.businessid = createdBusiness.businessid;
            createdUser.utypeid = 3;
            await createdUser.save();
            res.json({
                success: true,
                message: "Registered as owner",
                data: createdUser
            });
        }
        else {
            res.json({
                success: true,
                message: "Registered without business",
                data: createdUser
            });
        }
    }
}

controller.free_users_list = async (req, res) => {
    await USER.findAll({
        where: {
            businessid: {
                [Op.is]: null
            },
            utypeid: 1
        }
    }).then(data => { res.json(data) });
}

controller.plans_list = async (req, res) => {
    await plan.findAll().then(data => { res.json(data) });
}
controller.payments = async (req, res) => {
    await payment.findAll().then(data => { res.json(data) })
}
/*
controller.apenasum = async (req, res) => {
    sequelize.query(`UPDATE "USER" SET BUSINESSID = 1, UTYPEID = 3 WHERE USERID=1;
UPDATE "USER" SET BUSINESSID = 2, UTYPEID = 3 WHERE USERID=2;
UPDATE "USER" SET BUSINESSID = 3, UTYPEID = 3 WHERE USERID=3;
UPDATE "USER" SET BUSINESSID = 4, UTYPEID = 3 WHERE USERID=4;
UPDATE "USER" SET BUSINESSID = 5, UTYPEID = 3 WHERE USERID=5;
UPDATE "USER" SET BUSINESSID = 5, UTYPEID = 2 WHERE USERID=6;
`).then(() => { res.send("foi?") });
};

controller.apenasum = async (req, res) =>{
    sequelize.query(`INSERT INTO PRODUCT (CATEGORYID, NAME, DESCRIPTION, STATUSID, ICON, FEATURES) VALUES (1, 'DesignSphere', 'Unleash your creativity with DesignSphere, the ultimate platform for graphic design and visual communication. Whether you''re crafting stunning visuals, designing logos, or creating intricate layouts, DesignSphere empowers you to bring your ideas to life with ease and precision.', 2, 'https://pi3-backend.onrender.com/images/products/icon/6.png', 'DesignSphere offers a comprehensive suite of tools tailored for graphic designers and visual storytellers. Dive into a seamless design experience with intuitive features that enhance your creative workflow.[p]Craft eye-catching graphics and logos effortlessly using DesignSphere''s robust tools and dynamic workspace. Explore a rich palette of colors, shapes, and textures to create visually stunning masterpieces that captivate your audience.[p]Enhance collaboration with seamless file-sharing and integration with popular design formats. DesignSphere''s secure cloud storage ensures your projects are safely backed up and accessible from anywhere, allowing you to work on multiple devices without missing a beat.[p]Customize your design environment with personalized themes and layouts that suit your creative style. From beginners to seasoned professionals, DesignSphere adapts to your needs with intuitive navigation and real-time collaboration features.[p]Stay organized with advanced project management tools and integration with popular productivity apps. DesignSphere supports seamless scheduling and synchronization with calendar applications, ensuring you never miss a deadline.[p]Whether you''re designing for print or digital media, DesignSphere empowers you to unleash your creativity and elevate your design process to new heights.');
`).then(()=>res.send('foi?'))
}
 
 
 
 
 
//Editar o filme
controller.filme_update = async (req, res) => {
    const itemId = req.params.id; //Recebemos o id atraves dos parametros
 
    filmes.findByPk(itemId) //Procuramos o ficheiro pela Primary Key
        .then(item => { //Então...
            if (item) { //Verificamos se a pesquisa encontrou algo, se sim edita com a informação introduzida pelo utilizador.
                item.descricao = req.body.descricao;
                item.titulo = req.body.titulo;
                (req.file) ? item.foto = req.file.filename : item.foto = item.foto; //Verificamos se o multer fez upload de algum ficheiro, se sim altera o item.foto, se não o item.foto mantém-se o mesmo
                item.generoid = req.body.generoid;
                return item.save();
            }
        })
        .then(item => {
            if (item) { //Se o item for encontrado no "findByPk" e passar pelo return...
                res.json(item); //Devolvemo-lo, com as novas informações
            }
        })
}
 
//Remover o filme
controller.filme_delete = (req, res) => {
    const itemId = req.params.id; //Procura o ID nos parametros
    filmes.destroy({ //Apaga o filme que...
        where: {
            id: itemId //...tiver o id igual ao parametro
        }
    }).then(res.send()) //Devolve o código 200 (de sucesso)
}
 
//Contagem dos filmes
controller.filmes_count = async (req, res) => {
    await filmes.count() //Conta quantos filmes existem na base de dados
        .then(count => {
            res.send(count.toString()); //Devolve a contagem
        })
}
 
//Contagem dos filmes por géneros
controller.filme_genero_count = async (req, res) => {
    await filmes.findAll({
        attributes: ['generoid', [sequelize.fn('COUNT', sequelize.col('*')), 'filme_count']], //Faz a contagem de generoid para a coluna "filme_count"
        group: ['generoid', 'genero.id'], //Agrupa por género
        include: [{
            model: generos,
            attributes: ['id', 'designacao'], //Inclui o nome e o id do género
        }]
    }).then(data => {
        res.json(data); //Devolve todas as contagens, mas apenas os generos que têm filmes, para os géneros sem filmes é feita outra query em home.js (frontend)
    })
}
    */
module.exports = controller;