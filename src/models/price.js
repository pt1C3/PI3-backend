const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('price', {
    priceid: {
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
    packageid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'package',
        key: 'packageid'
      }
    },
    addonid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'addon',
        key: 'addonid'
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    discount_percentage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    change_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    number_of_licenses: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    custom: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'price',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_price",
        unique: true,
        fields: [
          { name: "priceid" },
        ]
      },
      {
        name: "preco_addon_fk",
        fields: [
          { name: "addonid" },
        ]
      },
      {
        name: "preco_do_pacote_fk",
        fields: [
          { name: "packageid" },
        ]
      },
      {
        name: "preco_do_produto_fk",
        fields: [
          { name: "productid" },
        ]
      },
      {
        name: "price_pk",
        unique: true,
        fields: [
          { name: "priceid" },
        ]
      },
    ]
  });
};
