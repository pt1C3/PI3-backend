var Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'pi3_qpsn',
  'pi3_qpsn_user',
  'YHxHh12yMpPSSXJ34p7fPpZa8s3cnDOm',
  {
    host: 'dpg-cptcv056l47c73edk2pg-a',
    port: '5432',
    dialect: 'postgres'
  }
  /*
  'pi3',
  'postgres',
  '123',
  {
      host: 'localhost',
      port: '5432',
      dialect: 'postgres'
  }
      */
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