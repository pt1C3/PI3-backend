var Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'pi3_logicleap_db',
    'user',
    'Yodqao0zoPNMbaOJTCTUEmbn1VXWOiEt',
    {
        host: 'dpg-cp66cq6n7f5s73a82f20-a',
        port: '5432',
        dialect: 'postgres',
        logging: false
    }
);
module.exports = sequelize;