const { Op } = require('sequelize'); //O Op serve para criar queries mais complexas usando o sequelize
var sequelize = require('../models/database');
const initModels = require('../models/init-models');
const { category } = initModels(sequelize);

const controller = {}
sequelize.sync(); //Sincroniza com a DB

//Listagem dos filmes
controller.category_list = async (req, res) => {
    await category.findAll().then(data => {
        res.json(data);
    });
}
//Criar filme
controller.category_add = async (req, res) => {
    category.create({ //Criamos o item com a informação do request
        designation: req.body.designation
    }).then(item => {
        res.json(item); //Finalmente devolvemos o item criado
    })
}

module.exports = controller;