const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('version', {
    versionid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    productid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'product',
        key: 'productid'
      }
    },
    addonid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'addon',
        key: 'addonid'
      }
    },
    version: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    statusid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'version_status',
        key: 'vstatusid'
      }
    },
    releasenotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    releasedate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    downloadlink: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reqid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'requirements',
        key: 'reqid'
      }
    }
  }, {
    sequelize,
    tableName: 'version',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_version",
        unique: true,
        fields: [
          { name: "versionid" },
        ]
      },
      {
        name: "possue_fk",
        fields: [
          { name: "reqid" },
        ]
      },
      {
        name: "status_da_versao_fk",
        fields: [
          { name: "statusid" },
        ]
      },
      {
        name: "varias_versoes_fk",
        fields: [
          { name: "addonid" },
        ]
      },
      {
        name: "version_pk",
        unique: true,
        fields: [
          { name: "versionid" },
        ]
      },
      {
        name: "versoes_do_produto_fk",
        fields: [
          { name: "productid" },
        ]
      },
    ]
  });
};
