const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('package', {
    packageid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    categoryid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'category',
        key: 'categoryid'
      }
    },
    pstatusid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'product_status',
        key: 'pstatusid'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    icon: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    feature: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'package',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "categoria_do_pacote_fk",
        fields: [
          { name: "categoryid" },
        ]
      },
      {
        name: "package_pk",
        unique: true,
        fields: [
          { name: "packageid" },
        ]
      },
      {
        name: "pk_package",
        unique: true,
        fields: [
          { name: "packageid" },
        ]
      },
    ]
  });
};
