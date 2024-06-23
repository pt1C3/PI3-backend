const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('payment', {
    paymentid: {
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
    pstatusid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'payment_status',
        key: 'pstatusid'
      }
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'payment',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "payment_pk",
        unique: true,
        fields: [
          { name: "paymentid" },
        ]
      },
      {
        name: "paymentstatus_fk",
        fields: [
          { name: "pstatusid" },
        ]
      },
      {
        name: "pk_payment",
        unique: true,
        fields: [
          { name: "paymentid" },
        ]
      },
      {
        name: "precisa_de_fk",
        fields: [
          { name: "planid" },
        ]
      },
    ]
  });
};
