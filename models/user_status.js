const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_status', {
    ustatusid: {
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
    tableName: 'user_status',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_user_status",
        unique: true,
        fields: [
          { name: "ustatusid" },
        ]
      },
      {
        name: "user_status_pk",
        unique: true,
        fields: [
          { name: "ustatusid" },
        ]
      },
    ]
  });
};
