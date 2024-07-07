const { Op } = require('sequelize'); //O Op serve para criar queries mais complexas usando o sequelize
var sequelize = require('../models/database');
const initModels = require('../models/init-models');
const { version, version_status, requirements } = initModels(sequelize);

const controller = {}
sequelize.sync(); //Sincroniza com a DB



//Listagem dos filmes
controller.add_version_product = async (req, res) => {

    const { productid, versionNum, statusid, downloadlink, releasenotes, reqNew } = req.body;
    try {
        if (!reqNew) {
            const lastReqId = await version.findOne({
                where: {
                    productid: productid
                },
                order: [['releasedate', 'DESC']] // Assuming you want the latest payment first

            }).then(data => { return data.reqid });

            await version.create({
                version: versionNum,
                statusid: statusid,
                downloadlink: downloadlink,
                releasenotes: releasenotes,
                productid: productid,
                releasedate: new Date(),
                reqid: lastReqId
            }).then(data => {
                res.json({ success: true, message: "Version added." })
            });
        }
        else {
            const reqId = await requirements.create({
                os: reqNew.os,
                processor: reqNew.processor,
                ram: reqNew.ram,
                hard_disk_space: reqNew.hard_disk_space,
                graphic_card: reqNew.graphic_card,
                internet_conection: reqNew.internet_conection
            }).then(data => {
                return data.reqid;
            })
            await version.create({
                version: versionNum,
                statusid: statusid,
                downloadlink: downloadlink,
                releasenotes: releasenotes,
                productid: productid,
                releasedate: new Date(),
                reqid: reqId
            }).then(data => {
                res.json({ success: true, message: "Version added with new requirements." })
            });
        }

    }
    catch (e) {
        res.json({ success: false, message: e })

    }
}
controller.get_status = async (req, res) => {
    await version_status.findAll().then(data => { res.json(data) })
}
module.exports = controller;