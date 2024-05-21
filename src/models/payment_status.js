const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payment_status', {
    pstatusid: {
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
    tableName: 'payment_status',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "payment_status_pk",
        unique: true,
        fields: [
          { name: "pstatusid" },
        ]
      },
      {
        name: "pk_payment_status",
        unique: true,
        fields: [
          { name: "pstatusid" },
        ]
      },
    ]
  });
};
