const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_status', {
    pstatusid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'product_status',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "licensestatus_pk2",
        unique: true,
        fields: [
          { name: "pstatusid" },
        ]
      },
      {
        name: "pk_product_status",
        unique: true,
        fields: [
          { name: "pstatusid" },
        ]
      },
    ]
  });
};
