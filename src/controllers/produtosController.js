const { Op } = require('sequelize'); //O Op serve para criar queries mais complexas usando o sequelize
var sequelize = require('../models/database');
const initModels = require('../models/init-models');
const { product, category, price } = initModels(sequelize);

const controller = {}
sequelize.sync(); //Sincroniza com a DB

//Listagem dos filmes
controller.produtos_min_list = async (req, res) => {
    await product.findAll({
        attributes: [
            'name',
            'icon',
            'description'
        ],
        include: [
            {
                model: category,
                as: 'category',
                attributes: ['designation']
            },
            {
                model: price,
                as: 'prices',
                attributes: ['price', 'discount_percentage'],
                where: {
                    price: {
                        [Op.eq]: sequelize.literal(`(
                            SELECT MIN(subPrice.price)
                            FROM price AS subPrice
                            WHERE subPrice.productid = prices.productid
                        )`)
                    }
                },
                required: true
            }
        ]
    }).then(data => {
        res.json(data);
    });



    
}
controller.produtos_add = async (req, res) => {
    product.create({ //Criamos o item com a informação do request
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        //icon: req.file.filename, //O ficheiro é recebido através do multer no filmesRouter.js
        features: req.body.features,
        categoryid: req.body.categoryid
    }).then(item => {
        res.json(item); //Finalmente devolvemos o item criado
    })
}
controller.apenasum = async (req,res) => {
    await sequelize.query(`
        INSERT INTO Users (firstName, lastName, email)
        VALUES ('John', 'Smith', 'john.smith@example.com')
      `);}
/*
controller.filme_detail = async (req, res) => { ////Precisa de async, pois a página front-end dá erro, se não tiver filmes para listar
    const itemId = req.params.id; //Id atribuido pelo parametro
    filmes.findOne({ //Encontra o primeiro que...
        where: {
            id: itemId //tenha o id igual ao do request
        },
        include: 'genero' //Inclui o género
    }).then(item => {
        if (item) res.json(item); //Se o filme existir, retorna o json. Isto previne erros quando o utilizador escreve o id direto no URL da página.
    })
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