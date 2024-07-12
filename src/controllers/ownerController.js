const { Op, fn, col, literal } = require('sequelize');
var sequelize = require('../models/database');
const initModels = require('../models/init-models');
const { USER, plan, payment, product, category, price, business, license } = initModels(sequelize);
const config = require('../config');

const controller = {}
sequelize.sync(); //Sincroniza com a DB

controller.users_list = async (req, res) => {
    const businessid = req.params.businessid;
    const search = req.params.search;
    if (!search) {
        await USER.findAll({
            where: { businessid: businessid, utypeid: 2 },
        }).then(data => { res.json(data) });
    }
    else {
        await USER.findAll({
            where: {
                businessid: businessid,
                utypeid: 2,
                email: {
                    [Op.like]: `%${search}%` // Use % for wildcard matching
                }
            },
        }).then(data => { res.json(data) });
    }

}

controller.licenses_list = async (req, res) => {
    const businessid = req.params.businessid;
    try {
        await plan.findAll({
            where: { businessid: businessid, planstatusid: 2 },
            include: [{
                model: license,
                as: "licenses",
            },
            {
                model: price,
                as: "price",
                include: [{
                    model: product,
                    as: "product"
                }]
            }
            ]
        }).then(data => {res.json(data); });
    }
    catch (e) {
        res.json(e);
    }

};

controller.payment_plan_add = async (req, res) => {
    function generateRandomKey() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            if (i < 2) result += '-';
        }

        return result;
    }

    /* try {*/
    const nowDate = new Date();
    // Create the plan
    const createdPlan = await plan.create({
        priceid: req.body.priceid,
        sale_date: nowDate,
        businessid: req.body.businessid,
        planstatusid: 2
    }).then(data => { return data });

    // Create the payment
    const createdPayment = await payment.create({
        planid: createdPlan.planid,
        pstatusid: 1,
        payment_date: nowDate,
        due_date: nowDate
    }).then(data => { return data });
    const nLicenses = await price.findByPk(createdPlan.priceid,
        { attributes: ['number_of_licenses'] }
    ).then(data => { return data.number_of_licenses });

    for (let i = 0; i < nLicenses; i++) {
        await license.create({
            planid: createdPlan.planid,
            lstatusid: 2,
            key: generateRandomKey()
        })
    }
    // Respond with both created items
    res.json({
        success: true,
        plan: createdPlan,
        payment: createdPayment,
        nLicenses: nLicenses
    });
    /*} catch (error) {
        // Handle errors and send an error response
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the payment plan.',
            error: error.message
        });
    }*/
};

controller.cancel_plan = async (req, res) => {
    const planid = req.params.planid;
    try {
        const selectedPlan = plan.findByPk(planid) //Procuramos o ficheiro pela Primary Key
            .then(item => { //Então...
                if (item) { //Verificamos se a pesquisa encontrou algo, se sim edita com a informação introduzida pelo utilizador.
                    item.planstatusid = 1;
                    return item.save();
                }
            })
            .then(item => {
                if (item) { //Se o item for encontrado no "findByPk" e passar pelo return...
                    return (item); //Devolvemo-lo, com as novas informações
                }
            })
        const latestPayment = await payment.findOne({
            where: {
                planid: planid,
                payment_date: null
            },
            order: [['due_date', 'DESC']] // Assuming you want the latest payment first
        }).then(data => {
            if (data) {
                // Delete the payment
                data.destroy();
                return "deleted";
            }
        });
        const licenses = await license.destroy(
            {
                where: {
                    planid: planid
                }
            }).then(() => {
                return "deleted"
            })

        res.json({ message: "Plan deactivated" + "(payment " + latestPayment + ") (licenses " + licenses + ")", success: true })
    }
    catch (error) {
        res.send(error)
    }
}

controller.licenses = async (req, res) => {
    await license.findAll().then(data => res.json(data));
}

controller.remove_manager = async (req, res) => {
    const userid = req.params.userid;
    try {
        // Update USER model
        const user = await USER.findByPk(userid);
        if (user) {
            user.businessid = null;
            user.utypeid = 1;
            await user.save();
        }

        // Update licenses associated with the user
        const licenses = await license.findAll({
            where: {
                userid: userid
            }
        });

        for (let i = 0; i < licenses.length; i++) {
            const item = licenses[i];
            item.userid = null;
            item.lstatusid = 2;
            await item.save(); // Save each updated instance
        }

        res.json({ success: true, message: "Manager removed successfully" });
    } catch (error) {
        console.error('Error removing manager:', error);
        res.status(500).json({ success: false, message: "Failed to remove manager" });
    }
}

controller.add_managers = async (req, res) => {
    const users = req.body.users;
    const businessid = req.body.businessid;
    try {
        // Validate inputs or handle any initial checks

        // Update each user in parallel using map and async/await
        const updatePromises = users.map(async (user) => {
            // Find the user by user.id
            const foundUser = await USER.findByPk(user);

            if (foundUser) {
                // Update businessid and utypeid
                foundUser.businessid = businessid;
                foundUser.utypeid = 2;

                // Save the updated user
                await foundUser.save();
                return { success: true, message: `Business ID and Utype ID updated for user with id ${user}` };
            } else {
                // Handle case where user with user.id is not found
                console.error(`User with id ${user} not found.`);
                return { success: false, message: `User with id ${user} not found.` };
            }
        });

        // Execute all update promises concurrently
        const results = await Promise.all(updatePromises);

        // Respond with results
        res.status(200).json(results);
    } catch (error) {
        console.error('Error updating users:', error);
        res.status(500).json({ success: false, message: 'Failed to update users.' });
    }

}

controller.manage_licenses = async (req, res) => {
    const nLicenses = req.body.nLicenses;
    const managerid = req.body.userid;
    const isadd = req.body.isadd;
    const planid = req.body.planid;
    try {


        if (isadd) {
            //adiciona
            await license.findAll({
                where: {
                    planid: planid,
                    userid: {
                        [Op.is]: null
                    },
                    lstatusid: 2
                }
            }).then(async data => {
                // Check if there are enough licenses available
                if (data.length < nLicenses) {
                    return res.json({ success: false, message: "Not enough licenses available" });
                }

                for (var i = 0; i < nLicenses; i++) {
                    data[i].userid = managerid;
                    data[i].lstatusid = 1;
                    await data[i].save(); // Save each updated instance
                }

                res.json({ success: true, message: "The licenses were attributed" });
            })
        }
        else if (isadd === false) {
            //remove
            await license.findAll({
                where: {
                    planid: planid,
                    userid: managerid,
                    lstatusid: 1
                }
            }).then(async data => {
                // Check if there are enough licenses available
                if (data.length < nLicenses) {
                    return res.json({ success: false, message: "Not enough licenses available" });
                }

                for (var i = 0; i < nLicenses; i++) {
                    data[i].userid = null;
                    data[i].lstatusid = 2;
                    await data[i].save(); // Save each updated instance
                }

                res.json({ success: true, message: "The licenses were removed" });
            })
        }
    }
    catch (e) {
        res.json({ success: false, message: e });

    }
}

controller.get_products = async (req, res) => {
    const { businessid } = req.params;
    try {
        await plan.findAll(
            {
                where: { businessid: businessid, planstatusid: 2 },
                include: [
                    {
                        model: price,
                        as: "price",
                        include: [
                            {
                                model: product,
                                as: "product"
                            }
                        ]
                    },
                    
                ],

            }
        ).then(data => { res.json(data) })
    }
    catch (e) {
        res.json({ success: false, message: e.message })
    }
}
controller.plan_licenses = async (req, res) => {
    //ACABAR
    const businessid = req.params.businessid;
    try {
        await plan.findAll({
            where: { businessid: businessid, planstatusid: 2 },
            include: [{
                model: license,
                as: "licenses",
            }
            ]
        }).then(data => {  res.json(data); });
    }
    catch (e) {
        res.json(e);
    }

};
module.exports = controller;