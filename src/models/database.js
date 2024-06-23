var Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'pi3_h6fb',
    'pi3_h6fb_user',
    'KOk0OGUYIHbmVRgau1eioao2ZT6Z5m1s',
    {
        host: 'dpg-cps6jg08fa8c7392h0e0-a',
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