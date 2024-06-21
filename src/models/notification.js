const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notification', {
    notificationid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nstatusid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'notification_status',
        key: 'nstatusid'
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'notification',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "notification_pk",
        unique: true,
        fields: [
          { name: "notificationid" },
        ]
      },
      {
        name: "notification_status_fk",
        fields: [
          { name: "nstatusid" },
        ]
      },
      {
        name: "pk_notification",
        unique: true,
        fields: [
          { name: "notificationid" },
        ]
      },
    ]
  });
};
