const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('produto_status', {
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
    tableName: 'produto_status',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_produto_status",
        unique: true,
        fields: [
          { name: "pstatusid" },
        ]
      },
      {
        name: "produto_status_pk",
        unique: true,
        fields: [
          { name: "pstatusid" },
        ]
      },
    ]
  });
};
