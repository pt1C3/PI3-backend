const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('version_status', {
    vstatusid: {
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
    tableName: 'version_status',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_version_status",
        unique: true,
        fields: [
          { name: "vstatusid" },
        ]
      },
      {
        name: "version_status_pk",
        unique: true,
        fields: [
          { name: "vstatusid" },
        ]
      },
    ]
  });
};
