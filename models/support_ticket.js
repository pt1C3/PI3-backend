const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('support_ticket', {
    ticketid: {
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
    tstatusid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ticket_status',
        key: 'tstatusid'
      }
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'support_ticket',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_support_ticket",
        unique: true,
        fields: [
          { name: "ticketid" },
        ]
      },
      {
        name: "podem_pedir_um_fk",
        fields: [
          { name: "userid" },
        ]
      },
      {
        name: "support_ticket_pk",
        unique: true,
        fields: [
          { name: "ticketid" },
        ]
      },
      {
        name: "ticket_status_fk",
        fields: [
          { name: "tstatusid" },
        ]
      },
    ]
  });
};
