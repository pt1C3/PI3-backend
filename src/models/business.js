const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('business', {
    businessid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    website: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'business',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "empresa_pk",
        unique: true,
        fields: [
          { name: "businessid" },
        ]
      },
      {
        name: "pk_business",
        unique: true,
        fields: [
          { name: "businessid" },
        ]
      },
    ]
  });
};
