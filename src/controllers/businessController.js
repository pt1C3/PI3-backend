const { Op } = require('sequelize'); //O Op serve para criar queries mais complexas usando o sequelize
var sequelize = require('../models/database');
const initModels = require('../models/init-models');
const { business, USER } = initModels(sequelize);

const controller = {}
sequelize.sync(); //Sincroniza com a DB



//Listagem dos filmes
controller.add_business = async (req, res) => {
    const { name, website, userid } = req.body;
    try {
        const createdBusiness = await business.create({
            name: name,
            website: website,
            userid: userid,
        }).then(data => {
            return data
        });
        const updatedUser = await USER.findByPk(userid).then(data => {
            data.businessid = createdBusiness.businessid;
            data.utypeid = 3;
            data.save()
            return data;
        })
        res.json({ success: true, message: "Business created and user set as Owner" })
    }
    catch (e) {
        res.json({ success: false, message: e })

    }
}

module.exports = controller;