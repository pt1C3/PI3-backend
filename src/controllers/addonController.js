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

module.exports = controller;