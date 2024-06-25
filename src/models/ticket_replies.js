const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ticket_replies', {
    treplyid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ticketid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'support_ticket',
        key: 'ticketid'
      }
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ticket_replies',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_ticket_replies",
        unique: true,
        fields: [
          { name: "treplyid" },
        ]
      },
      {
        name: "ticket_reply_pk",
        unique: true,
        fields: [
          { name: "treplyid" },
        ]
      },
    ]
  });
};
