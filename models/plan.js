const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('plan', {
    planid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    priceid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'price',
        key: 'priceid'
      }
    },
    planstatusid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'plan_status',
        key: 'planstatusid'
      }
    },
    businessid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'empresa',
        key: 'businessid'
      }
    },
    sale_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'plan',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "myplans_fk",
        fields: [
          { name: "priceid" },
        ]
      },
      {
        name: "pk_plan",
        unique: true,
        fields: [
          { name: "planid" },
        ]
      },
      {
        name: "plan_pk",
        unique: true,
        fields: [
          { name: "planid" },
        ]
      },
      {
        name: "plan_status_fk",
        fields: [
          { name: "planstatusid" },
        ]
      },
      {
        name: "planosempresa_fk",
        fields: [
          { name: "businessid" },
        ]
      },
    ]
  });
};
