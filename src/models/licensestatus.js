const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('licensestatus', {
    lstatusid: {
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
    tableName: 'licensestatus',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "licensestatus_pk",
        unique: true,
        fields: [
          { name: "lstatusid" },
        ]
      },
      {
        name: "pk_licensestatus",
        unique: true,
        fields: [
          { name: "lstatusid" },
        ]
      },
    ]
  });
};
