const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_type', {
    utypeid: {
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
    tableName: 'user_type',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_user_type",
        unique: true,
        fields: [
          { name: "utypeid" },
        ]
      },
      {
        name: "user_type_pk",
        unique: true,
        fields: [
          { name: "utypeid" },
        ]
      },
    ]
  });
};
