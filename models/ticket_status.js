const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ticket_status', {
    tstatusid: {
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
    tableName: 'ticket_status',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_ticket_status",
        unique: true,
        fields: [
          { name: "tstatusid" },
        ]
      },
      {
        name: "ticket_status_pk",
        unique: true,
        fields: [
          { name: "tstatusid" },
        ]
      },
    ]
  });
};
