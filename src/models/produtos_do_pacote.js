const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('produtos_do_pacote', {
    packageid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'package',
        key: 'packageid'
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
    tableName: 'produtos_do_pacote',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_produtos_do_pacote",
        unique: true,
        fields: [
          { name: "packageid" },
          { name: "productid" },
        ]
      },
      {
        name: "produtos_do_pacote2_fk",
        fields: [
          { name: "productid" },
        ]
      },
      {
        name: "produtos_do_pacote_fk",
        fields: [
          { name: "packageid" },
        ]
      },
      {
        name: "produtos_do_pacote_pk",
        unique: true,
        fields: [
          { name: "packageid" },
          { name: "productid" },
        ]
      },
    ]
  });
};
