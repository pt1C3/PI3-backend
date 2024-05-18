const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('images', {
    imageid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    productid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'produto',
        key: 'productid'
      }
    }
  }, {
    sequelize,
    tableName: 'images',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "imagens_do_produto_fk",
        fields: [
          { name: "productid" },
        ]
      },
      {
        name: "images_pk",
        unique: true,
        fields: [
          { name: "imageid" },
        ]
      },
      {
        name: "pk_images",
        unique: true,
        fields: [
          { name: "imageid" },
        ]
      },
    ]
  });
};
