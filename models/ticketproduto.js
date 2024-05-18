const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ticketproduto', {
    ticketid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'support_ticket',
        key: 'ticketid'
      }
    },
    productid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'produto',
        key: 'productid'
      }
    }
  }, {
    sequelize,
    tableName: 'ticketproduto',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_ticketproduto",
        unique: true,
        fields: [
          { name: "ticketid" },
          { name: "productid" },
        ]
      },
      {
        name: "ticketproduto2_fk",
        fields: [
          { name: "ticketid" },
        ]
      },
      {
        name: "ticketproduto_fk",
        fields: [
          { name: "productid" },
        ]
      },
      {
        name: "ticketproduto_pk",
        unique: true,
        fields: [
          { name: "ticketid" },
          { name: "productid" },
        ]
      },
    ]
  });
};
