const { Op, fn, col, literal } = require('sequelize');
var sequelize = require('../models/database');
const initModels = require('../models/init-models');
const { product, addon, product_status, version, version_status, price, plan } = initModels(sequelize);

const controller = {}
sequelize.sync(); //Sincroniza com a DB
controller.admin_list_addon = async (req, res) => {
    const search = req.params.search || '';
    const productid = req.params.productid;
    const fetchAddons = async () => {
        try {
            const addons = await addon.findAll({
                attributes: [
                    'addonid',
                    'name',
                    'description'
                ],
                where: {
                    name: {
                        [Op.like]: `%${search}%` // Use % for wildcard matching
                    },
                    productid: productid
                },
                include: [
                    {
                        model: product_status,
                        as: 'status_product_status',
                        attributes: ['designation']
                    },
                    {
                        model: product,
                        as: 'product',
                        attributes: ['name']
                    },
                    {
                        model: price,
                        as: 'prices',
                        attributes: [
                            'priceid',
                            [fn('ROUND', col('price'), 2), 'price'], // Format price to 2 decimal points
                        ],
                        where: {
                            custom: {
                                [Op.or]: [false, null] // Ensure correct boolean condition
                            }
                        },
                        include: [
                            {
                                model: plan,
                                as: 'plans',
                                attributes: ['planid'], // Include a minimal set of attributes to ensure proper join
                                required: false // Use false if you want to include products even if they have no active plans
                            }
                        ]
                    },
                    {
                        model: version,
                        as: 'versions',
                        attributes: ['version', 'releasedate'],
                        where: {
                            releasedate: {
                                [Op.eq]: literal(`(
                                    SELECT MAX(releasedate) 
                                    FROM version AS v 
                                    WHERE v.addonid = versions.addonid
                                )`)
                            }
                        },
                    }
                ]
            });

            return addons;
        } catch (err) {
            console.error('Error fetching products:', err);
            throw err; // Rethrow the error to be caught later
        }
    };

    // Execute the fetchProducts function
    fetchAddons()
        .then(async (addons) => {
            // Process each product to calculate plan counts
            const processedAddons = await Promise.all(addons.map(async (addon) => {
                // Calculate total plan count for each product
                const totalPlans = addon.prices.reduce((accumulator, price) => {
                    return accumulator + (price.plans ? price.plans.length : 0);
                }, 0);

                // Return the product data along with total plan count and full attributes of version and price
                return {
                    addonid: addon.addonid,
                    name: addon.name,
                    product_name: addon.product.name,
                    description: addon.description,
                    status: addon.status_product_status ? addon.status_product_status.designation : null,
                    versions: addon.versions.map(version => ({
                        ...version.dataValues
                    })),
                    prices: addon.prices.map(price => ({
                        ...price.dataValues
                    })),
                    totalPlans: totalPlans
                };
            }));

            // Send the processed products as JSON response
            res.json(processedAddons);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred' });
        });
}

controller.admin_versions_addon = async (req, res) => {
    const addonid = req.params.addonid;

    await version.findAll({
        where: {
            addonid: addonid
        },
        include: [{
            model: version_status,
            as: "status"
        }, {
            model: addon,
            as: "addon",
            attributes: ['name', 'productid'],
            include: {
                model: product,
                as: "product"
            }
        }]
    }).then(data => { res.json(data) });
}
controller.add_addon = async (req, res) => {
    const { name, status, description, productid, priceVal, discount_percentage, versionNum, vstatusid, download, releasenotes } = req.body;
    try {
        const addonid = await addon.create({
            name: name,
            status: status,
            description: description,
            productid: productid
        }).then(item => { return item.addonid })

        await price.create({
            addonid: addonid,
            price: priceVal,
            discount_percentage: discount_percentage,
            change_date: new Date()
        })
       
        await version.create({
            version: versionNum,
            statusid: vstatusid,
            downloadlink: download,
            releasenotes: releasenotes,
            addonid: addonid,
            releasedate: new Date(),
        })
        res.json({ success: true, message: "Addon added." });

    }
    catch (e) {
        res.json({ success: false, message: e })

    }
}
controller.edit_addon = async (req, res) => {
    const { addonid, name, status, description, productid, priceid, priceVal, discount_percentage } = req.body;


    try {
        // Find and update the addon
        const addonItem = await addon.findOne({ where: { addonid: addonid } });
        if (!addonItem) {
            return res.json({ success: false, message: "Addon not found." });
        }
        addonItem.name = name;
        addonItem.status = status;
        addonItem.description = description;
        addonItem.productid = productid;
        await addonItem.save();

        // Find and update the price
        const priceItem = await price.findOne({ where: { priceid: priceid } });
        if (!priceItem) {
            return res.json({ success: false, message: "Price not found." });
        }
        priceItem.price = priceVal;
        priceItem.discount_percentage = discount_percentage;
        priceItem.change_date = new Date();
        await priceItem.save();

        // If both operations were successful
        res.json({ success: true, message: "Addon edited." });
    } catch (e) {
        res.json({ success: false, message: e.message || e.toString() });
    }
}
controller.single_addon = async (req, res) => {
    const { addonid } = req.params;
    await addon.findOne({
        where: { addonid: addonid },
        include: {
            model: price,
            as: 'prices',
            attributes: [
                'priceid',
                [fn('ROUND', col('price'), 2), 'price'], // Format price to 2 decimal points
                'discount_percentage'
            ],
            limit: 1
        },
    }).then(data => res.json(data));
}
module.exports = controller;