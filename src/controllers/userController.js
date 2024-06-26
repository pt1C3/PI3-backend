const { Op, fn, col, literal } = require('sequelize');
var sequelize = require('../models/database');
const initModels = require('../models/init-models');
const { USER } = initModels(sequelize);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');


const controller = {}
sequelize.sync(); //Sincroniza com a DB

//Listagem dos filmes
controller.users_list = async (req, res) => {
    await USER.findAll();
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
            console.log("Erro: " + error);
            return error;
        })
    if (password === null || typeof password === "undefined") {
        res.status(403).json({
            success: false,
            message: 'Campos em Branco'
        });
    } else {
        if (req.body.email && req.body.password && user) {
            const isMatch = bcrypt.compareSync(password, user.password);
            if (req.body.email === user.email && isMatch) {
                let token = jwt.sign({ email: req.body.email }, config.jwtSecret,
                    {
                        expiresIn: '1h' //expira em 1 hora
                    });
                res.json({ success: true, message: 'Autenticação realizada com sucesso!', token: token, data: user });
            } else {
                res.status(403).json({ success: false, message: 'Dados de autenticação inválidos.' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Erro no processo de autenticação. Tente de novo mais tarde.' });
        }
    }

}
controller.payment_add
    /*
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