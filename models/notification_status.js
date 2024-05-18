const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notification_status', {
    nstatusid: {
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
    tableName: 'notification_status',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "notification_status_pk",
        unique: true,
        fields: [
          { name: "nstatusid" },
        ]
      },
      {
        name: "pk_notification_status",
        unique: true,
        fields: [
          { name: "nstatusid" },
        ]
      },
    ]
  });
};
