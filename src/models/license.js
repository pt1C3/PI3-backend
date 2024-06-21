const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('license', {
    licenseid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    planid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'plan',
        key: 'planid'
      }
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'USER',
        key: 'userid'
      }
    },
    lstatusid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'license_status',
        key: 'lstatusid'
      }
    },
    key: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'license',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "license_pk",
        unique: true,
        fields: [
          { name: "licenseid" },
        ]
      },
      {
        name: "licensestatus_fk",
        fields: [
          { name: "lstatusid" },
        ]
      },
      {
        name: "managerlicense_fk",
        fields: [
          { name: "userid" },
        ]
      },
      {
        name: "pk_license",
        unique: true,
        fields: [
          { name: "licenseid" },
        ]
      },
      {
        name: "tem_tipos_de_fk",
        fields: [
          { name: "planid" },
        ]
      },
    ]
  });
};
