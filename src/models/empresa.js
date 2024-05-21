const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('empresa', {
    businessid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'USER',
        key: 'userid'
      }
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
    tableName: 'empresa',
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
        name: "pk_empresa",
        unique: true,
        fields: [
          { name: "businessid" },
        ]
      },
      {
        name: "userempresa_fk",
        fields: [
          { name: "userid" },
        ]
      },
    ]
  });
};
