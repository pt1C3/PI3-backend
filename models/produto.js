const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('produto', {
    productid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    categoryid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'category',
        key: 'categoryid'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    icon: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    features: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'produto',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "categoria_do_produto_fk",
        fields: [
          { name: "categoryid" },
        ]
      },
      {
        name: "pk_produto",
        unique: true,
        fields: [
          { name: "productid" },
        ]
      },
      {
        name: "produto_pk",
        unique: true,
        fields: [
          { name: "productid" },
        ]
      },
    ]
  });
};
