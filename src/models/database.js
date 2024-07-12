var Sequelize = require('sequelize');
const sequelize = new Sequelize(

  'pi3_sjgj',
  'pi3_sjgj_user',
  'DCc7o211liCAVBNTpPpBayD5xcCb44T8',
  {
    host: 'dpg-cq8kr0tds78s73dle740-a',
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