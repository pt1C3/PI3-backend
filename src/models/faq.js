const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('faq', {
    questionid: {
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
    question: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'faq',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "faq_pk",
        unique: true,
        fields: [
          { name: "questionid" },
        ]
      },
      {
        name: "faqs_do_pacote_fk",
        fields: [
          { name: "packageid" },
        ]
      },
      {
        name: "faqs_do_produto_fk",
        fields: [
          { name: "productid" },
        ]
      },
      {
        name: "pk_faq",
        unique: true,
        fields: [
          { name: "questionid" },
        ]
      },
    ]
  });
};
