const { Op } = require('sequelize'); //O Op serve para criar queries mais complexas usando o sequelize
var sequelize = require('../models/database');
const initModels = require('../models/init-models');
const { version, version_status, requirements } = initModels(sequelize);

const controller = {}
sequelize.sync(); //Sincroniza com a DB


controller.single_version = async (req, res) => {
    const { versionid } = req.params;
    await version.findOne({ where: { versionid: versionid }, include: { model: requirements, as: "req" } }).then(data => res.json(data));
}
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
controller.edit_version_product = async (req, res) => {

    const { versionid, productid, versionNum, statusid, downloadlink, releasenotes, reqNew } = req.body;
    try {
        if (!reqNew) {
            await version.findOne({ where: { versionid: versionid } }).then(item => {
                item.version = versionNum;
                item.statusid = statusid;
                item.downloadlink = downloadlink;
                item.releasenotes = releasenotes;
                item.save();
                res.json({ success: true, message: "Version Edited." })
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
            await version.findOne({ where: { versionid: versionid } }).then(item => {
                item.version = versionNum;
                item.statusid = statusid;
                item.downloadlink = downloadlink;
                item.releasenotes = releasenotes;
                item.reqid = reqId;
                item.save();
                res.json({ success: true, message: "Version edited with new requirements." })

            })
        }

    }
    catch (e) {
        res.json({ success: false, message: e })

    }
}
controller.add_version_addon = async (req, res) => {
    const { addonid, versionNum, statusid, downloadlink, releasenotes } = req.body;
    try {
        await version.create({
            version: versionNum,
            statusid: statusid,
            downloadlink: downloadlink,
            releasenotes: releasenotes,
            addonid: addonid,
            releasedate: new Date(),
        }).then(data => {
            res.json({ success: true, message: "Version added." })
        });
    }
    catch (e) {
        res.json({ success: false, message: e })

    }
}
controller.edit_version_addon = async (req, res) => {
    const { versionNum, statusid, downloadlink, releasenotes, versionid } = req.body;
    try {
        await version.findOne({ where: { versionid: versionid } })
            .then(item => {
                item.version = versionNum;
                item.statusid = statusid;
                item.downloadlink = downloadlink;
                item.releasenotes = releasenotes;
                item.save();
                res.json({ success: true, message: "Version edited." })
            })
    }
    catch (e) {
        res.json({ success: false, message: e })

    }
}
controller.delete_version = async (req, res) => {
    const { versionid } = req.params;
    const transaction = await sequelize.transaction();

    try {
        await version.destroy({ where: { versionid: versionid } }, { transaction });
        await transaction.commit();
        res.json({ success: true, message: "Version deleted." });
    } catch (e) {
        await transaction.rollback();
        res.json({ success: false, message: e.message });
    }
}
controller.get_status = async (req, res) => {
    await version_status.findAll().then(data => { res.json(data) })
}
module.exports = controller;