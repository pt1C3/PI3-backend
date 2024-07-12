var Sequelize = require('sequelize');
const sequelize = new Sequelize(

  'pi3_chth',
  'pi3_chth_user',
  'S8u1QAsOaO1iwNdy6b2mnLhRukYdOhdN',
  {
    host: 'dpg-cq8lv4l6l47c73d0g1rg-a',
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