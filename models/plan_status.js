const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('plan_status', {
    planstatusid: {
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
    tableName: 'plan_status',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_plan_status",
        unique: true,
        fields: [
          { name: "planstatusid" },
        ]
      },
      {
        name: "plan_status_pk",
        unique: true,
        fields: [
          { name: "planstatusid" },
        ]
      },
    ]
  });
};
