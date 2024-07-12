const { Op, fn, col, literal } = require('sequelize');
var sequelize = require('../models/database');
const initModels = require('../models/init-models');
const { USER, plan, payment, payment_status, product, category, price, business, addon } = initModels(sequelize);
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
            where: { businessid: businessid , planstatusid: 2 },
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
                    where: {
                        addonid: null
                    },
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

controller.user_addon_plans = async (req, res) => {
    const businessid = req.params.businessid;

    try {
        const plans = await plan.findAll({
            attributes: [[fn('DATE', col('sale_date')), 'sale_date'], 'planid', 'planstatusid'],
            where: { businessid: businessid, planstatusid: 2 },
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
                    where: {
                        productid: null
                    },
                    include: [
                        {
                            model: addon,
                            as: 'addon'
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
                    addon: item.price.addon.toJSON(),

                };
            } else {
                // No previous payment or payment not paid yet
                return {
                    ...item.toJSON(),
                    addon: item.price.addon.toJSON(),
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await USER.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
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
controller.payment_history = async (req, res) => {
    const businessid = req.params.businessid;

    try {
        const userPlans = await plan.findAll({ where: { businessid: businessid } }).then(data => { return data });
        const planIds = userPlans.map(plan => plan.planid);
        await payment.findAll(
            {
                where: { planid: { [Op.in]: planIds } },
                include: [
                    {
                        model: plan,
                        as: "plan",
                        include: [
                            {
                                model: price,
                                as: "price",
                                include: [
                                    {
                                        model: product,
                                        as: "product",
                                        include: [
                                            {
                                                model: category,
                                                as: "category"
                                            }
                                        ]
                                    },
                                    {
                                        model: addon,
                                        as: "addon",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: payment_status,
                        as: "pstatus"
                    }
                ]
            }
        ).then(data => {
            res.json(data)
        })
    }
    catch (e) {
        res.json({ success: false, message: e.message })
    }
}
controller.encrypt_passwords = async (req, res) => {
    try {
        // Start a transaction
        const transaction = await sequelize.transaction();

        // Fetch all users
        const users = await USER.findAll({ transaction });

        // Iterate over each user
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            await user.save({ transaction });
        }

        // Commit the transaction
        await transaction.commit();
        console.log('Passwords encrypted successfully.');
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.error('Error encrypting passwords:', error);
    }
}
module.exports = controller;