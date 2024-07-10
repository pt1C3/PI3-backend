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
        attributes: ['productid', 'name', 'description', 'icon', 'features'],
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

controller.product_add = async (req, res) => {
    product.create({ //Criamos o item com a informação do request
        name: req.body.name,
        description: req.body.description,
        statusid: req.body.status,
        //icon: req.file.filename, //O ficheiro é recebido através do multer no filmesRouter.js
        features: req.body.features,
        categoryid: req.body.categoryid
    }).then(item => {
        res.json(item); //Finalmente devolvemos o item criado
    })
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
                    'description'
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
        },{
            model: product,
            as: "product",
            attributes: ['name']
        }]
    }).then(data => { res.json(data) });
}
/*
controller.apenasum = async (req, res) =>{
    sequelize.query(`INSERT INTO PRODUCT (CATEGORYID, NAME, DESCRIPTION, STATUSID, ICON, FEATURES) VALUES (1, 'DesignSphere', 'Unleash your creativity with DesignSphere, the ultimate platform for graphic design and visual communication. Whether you''re crafting stunning visuals, designing logos, or creating intricate layouts, DesignSphere empowers you to bring your ideas to life with ease and precision.', 2, 'https://pi3-backend.onrender.com/images/products/icon/6.png', 'DesignSphere offers a comprehensive suite of tools tailored for graphic designers and visual storytellers. Dive into a seamless design experience with intuitive features that enhance your creative workflow.[p]Craft eye-catching graphics and logos effortlessly using DesignSphere''s robust tools and dynamic workspace. Explore a rich palette of colors, shapes, and textures to create visually stunning masterpieces that captivate your audience.[p]Enhance collaboration with seamless file-sharing and integration with popular design formats. DesignSphere''s secure cloud storage ensures your projects are safely backed up and accessible from anywhere, allowing you to work on multiple devices without missing a beat.[p]Customize your design environment with personalized themes and layouts that suit your creative style. From beginners to seasoned professionals, DesignSphere adapts to your needs with intuitive navigation and real-time collaboration features.[p]Stay organized with advanced project management tools and integration with popular productivity apps. DesignSphere supports seamless scheduling and synchronization with calendar applications, ensuring you never miss a deadline.[p]Whether you''re designing for print or digital media, DesignSphere empowers you to unleash your creativity and elevate your design process to new heights.');
`).then(()=>res.send('foi?'))
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