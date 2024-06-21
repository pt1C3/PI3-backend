const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('addon', {
    addonid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    productid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'product',
        key: 'productid'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'product_status',
        key: 'pstatusid'
      }
    },
    icon: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'addon',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "addon_pk",
        unique: true,
        fields: [
          { name: "addonid" },
        ]
      },
      {
        name: "addons_do_produto_fk",
        fields: [
          { name: "productid" },
        ]
      },
      {
        name: "pk_addon",
        unique: true,
        fields: [
          { name: "addonid" },
        ]
      },
    ]
  });
};
