const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('category', {
    designation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    categoryid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'category',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "category_pk",
        unique: true,
        fields: [
          { name: "categoryid" },
        ]
      },
      {
        name: "pk_category",
        unique: true,
        fields: [
          { name: "categoryid" },
        ]
      },
    ]
  });
};
