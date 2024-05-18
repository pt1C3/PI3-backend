const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('requeriments', {
    reqid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    os: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    processor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ram: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hard_disk_space: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    graphic_card: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    internet_conection: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'requeriments',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_requeriments",
        unique: true,
        fields: [
          { name: "reqid" },
        ]
      },
      {
        name: "requeriments_pk",
        unique: true,
        fields: [
          { name: "reqid" },
        ]
      },
    ]
  });
};
