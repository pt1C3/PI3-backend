const { Op, fn, col, literal } = require('sequelize');
var sequelize = require('../models/database');
const initModels = require('../models/init-models');
const { product, category, price, images, version, faq, requirements, product_status, plan, version_status } = initModels(sequelize);
const bcrypt = require('bcrypt');

const controller = {}
sequelize.sync(); //Sincroniza com a DB

//Listagem dos filmes
controller.products_min_list = async (req, res) => {
    await product.findAll({
        attributes: [
            'productid',
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
                attributes: [
                    [fn('ROUND', col('price'), 2), 'price'], // Format price to 2 decimal points
                    'discount_percentage'
                ],
                where: {
                    price: {
                        [Op.eq]: sequelize.literal(`(
                            SELECT MIN(subPrice.price)
                            FROM price AS subPrice
                            WHERE subPrice.productid = prices.productid
                        )`)
                    },
                    custom: {
                        [Op.or]: [false, null]
                    }
                },
                required: true
            }
        ],
        where: {
            statusid: 2
        }
    }).then(data => {
        res.json(data);
    });

}

controller.single_product = async (req, res) => {
    const productId = req.params.id; // Assuming the product ID is passed as a route parameter
    await product.findByPk(productId, {
        attributes: ['productid', 'name', 'description', 'icon', 'features', 'statusid'],
        include: [
            {
                model: category,
                as: 'category',
            },
            {
                model: images,
                as: 'images',
                separate: true,
            },
            {
                model: faq,
                as: 'faqs',
                attributes: ['questionid', 'question', 'answer'],
                separate: true,
            },
            {
                model: price,
                as: 'prices',
                separate: true,
                where: {
                    custom: {
                        [Op.or]: [false, null]
                    }
                },
                attributes: [
                    [fn('ROUND', col('price'), 2), 'price'], // Format price to 2 decimal points
                    'discount_percentage',
                    'number_of_licenses',
                    'priceid'
                ],
                order: [['price', 'ASC']], // Order prices from lower to higher
            },
            {
                model: version,
                as: 'versions',
                include: [
                    {
                        model: requirements,
                        as: 'req',
                    }
                ],
                separate: true,
                attributes: [
                    [fn('DATE', col('releasedate')), 'releasedate'],
                    'versionid',
                    'version',
                    'statusid',
                    'releasenotes'

                ]
            }
        ]
    }).then(product => {
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }).catch(error => {
        console.error('Error fetching product details:', error);
        res.status(500).json({ message: 'An error occurred while fetching the product details.' });
    });
}

controller.search_products_list = async (req, res) => {
    const search = req.params.search;
    await product.findAll({
        attributes: [
            'productid',
            'name',
            'icon',
            'description'
        ],
        where: {
            name: {
                [Op.like]: `%${search}%` // Use % for wildcard matching
            },
            statusid: 2
        },
        include: [
            {
                model: category,
                as: 'category',
                attributes: ['designation']
            },
            {
                model: price,
                as: 'prices',
                attributes: [
                    [fn('ROUND', col('price'), 2), 'price'], // Format price to 2 decimal points
                    'discount_percentage'
                ],
                where: {
                    price: {
                        [Op.eq]: sequelize.literal(`(
                            SELECT MIN(subPrice.price)
                            FROM price AS subPrice
                            WHERE subPrice.productid = prices.productid
                        )`)
                    },
                    custom: {
                        [Op.or]: [false, null]
                    }
                },
                required: true
            }
        ]
    }).then(data => {
        res.json(data);
    });

}

controller.admin_list_products = async (req, res) => {
    const search = req.params.search || '';

    // Function to fetch products along with associated prices and plan counts
    const fetchProducts = async () => {
        try {
            const products = await product.findAll({
                attributes: [
                    'productid',
                    'name',
                    'icon',
                    'description',
                ],
                where: {
                    name: {
                        [Op.like]: `%${search}%` // Use % for wildcard matching
                    }
                },
                include: [
                    {
                        model: category,
                        as: 'category',
                        attributes: ['designation']
                    },
                    {
                        model: product_status,
                        as: 'status',
                        attributes: ['designation']
                    },
                    {
                        model: price,
                        as: 'prices',
                        attributes: [
                            'priceid',
                            [fn('ROUND', col('price'), 2), 'price'], // Format price to 2 decimal points
                            'number_of_licenses',
                            'custom'
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
                                    WHERE v.productid = versions.productid
                                )`)
                            }
                        }
                    }
                ]
            });

            return products;
        } catch (err) {
            console.error('Error fetching products:', err);
            throw err; // Rethrow the error to be caught later
        }
    };

    // Execute the fetchProducts function
    fetchProducts()
        .then(async (products) => {
            // Process each product to calculate plan counts
            const processedProducts = await Promise.all(products.map(async (product) => {
                // Calculate total plan count for each product
                const totalPlans = product.prices.reduce((accumulator, price) => {
                    return accumulator + (price.plans ? price.plans.length : 0);
                }, 0);

                // Return the product data along with total plan count and full attributes of version and price
                return {
                    productid: product.productid,
                    name: product.name,
                    icon: product.icon,
                    description: product.description,
                    category: product.category ? product.category.designation : null,
                    status: product.status ? product.status.designation : null,
                    versions: product.versions.map(version => ({
                        ...version.dataValues
                    })),
                    prices: product.prices.map(price => ({
                        ...price.dataValues
                    })),
                    totalPlans: totalPlans
                };
            }));

            // Send the processed products as JSON response
            res.json(processedProducts);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred' });
        });

}

controller.admin_versions_product = async (req, res) => {
    const productid = req.params.productid;

    await version.findAll({
        where: {
            productid: productid
        },
        include: [{
            model: version_status,
            as: "status"
        }, {
            model: product,
            as: "product",
            attributes: ['name']
        }]
    }).then(data => { res.json(data) });
}

controller.get_status = async (req, res) => {
    await product_status.findAll().then(data => res.json(data));
}
controller.get_categories = async (req, res) => {
    await category.findAll().then(data => { res.json(data) });
}
controller.product_add = async (req, res) => {
    const { name, description, statusid, features, categoryid, versionNum, vstatusid, downloadlink, releasenotes, reqNew, priceVal1, discount_percentage1, number_of_licenses1, priceVal2, discount_percentage2, number_of_licenses2, faq } = req.body;
    try {
        const productid = await product.create({
            name: name,
            description: description,
            statusid: statusid,
            icon: "https://pi3-backend.onrender.com/images/products/icon/1.png", //n muda a imagem
            features: features,
            categoryid: categoryid
        }).then(item => {
            return item.productid
        })
        await price.create({
            productid: productid,
            price: priceVal1,
            discount_percentage: discount_percentage1,
            number_of_licenses: number_of_licenses1,
            change_date: new Date()
        })
        await price.create({
            productid: productid,
            price: priceVal2,
            discount_percentage: discount_percentage2,
            number_of_licenses: number_of_licenses2,
            change_date: new Date()
        })
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
            statusid: vstatusid,
            downloadlink: downloadlink,
            releasenotes: releasenotes,
            productid: productid,
            releasedate: new Date(),
            reqid: reqId
        })
        await faq.map(item => {
            faq.create({
                productid: productid,
                question: item.question,
                answer: item.answer
            })
        })
        res.json({ success: true, message: "Product added." })
    }
    catch (e) {
        res.json({ success: false, message: e.message })
    }
}
controller.product_edit = async (req, res) => {
    const { productid, name, description, statusid, features, categoryid, priceid1, priceVal1, discount_percentage1, number_of_licenses1, priceid2, priceVal2, discount_percentage2, number_of_licenses2, faqs } = req.body;
    try {

        await product.findOne({ where: { productid: productid } }).then(item => {
            item.name = name;
            item.description = description;
            item.statusid = statusid;
            item.features = features;
            item.categoryid = categoryid;
            item.save();
        })
        await price.findOne({ where: { priceid: priceid1 } }).then(item => {
            item.price = priceVal1;
            item.discount_percentage = discount_percentage1;
            item.number_of_licenses = number_of_licenses1;
            item.save();
        })
        await price.findOne({ where: { priceid: priceid2 } }).then(item => {
            item.price = priceVal2;
            item.discount_percentage = discount_percentage2;
            item.number_of_licenses = number_of_licenses2;
            item.save();
        })
        /*
        await faqs.map(question => { //Edita as Faqs existentes
            faq.findOne({ where: { questionid: question.questionid } }).then(item => {
                item.question = question.question;
                item.answer = question.answer;
                item.save();
            })
        })*/
        // Fetch all existing FAQs for the specific productid from the database
        const existingFaqs = await faq.findAll({ where: { productid: productid } });


        // Process each incoming FAQ
        await faqs.map(question => {
            const existingFaq = existingFaqs.find(f => f.questionid === question.questionid);

            if (existingFaq) {
                // Update existing FAQ
                existingFaq.question = question.question;
                existingFaq.answer = question.answer;
                existingFaq.save();
            } else {
                // Create new FAQ
                faq.create({
                    productid: productid,
                    question: question.question,
                    answer: question.answer
                });
            }
        })

        // Determine which existing FAQs were not in the incoming list (i.e., should be deleted)
        const incomingQuestionIds = faqs.map(f => f.questionid);
        const faqsToDelete = existingFaqs.filter(f => !incomingQuestionIds.includes(f.questionid));

        // Perform the deletion operations
        if (faqsToDelete.length > 0) {
            const idsToDelete = faqsToDelete.map(f => f.questionid);
            await faq.destroy({ where: { questionid: { [Op.in]: idsToDelete } } });
        }

        res.json({ success: true, message: "Product edited." })
    }
    catch (e) {
        res.json({ success: false, message: e.message })
    }
}

module.exports = controller;