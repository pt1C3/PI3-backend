var Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'PI3',
    'postgres',
    '123',
    {
        host: 'localhost',
        port: '5432',
        dialect: 'postgres'
    }
);
sequelize.sync();
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;