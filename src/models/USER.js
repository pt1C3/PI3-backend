const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('USER', {
    userid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    businessid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'business',
        key: 'businessid'
      }
    },
    ustatusid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user_status',
        key: 'ustatusid'
      }
    },
    utypeid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user_type',
        key: 'utypeid'
      }
    },
    firstname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'USER',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_user",
        unique: true,
        fields: [
          { name: "userid" },
        ]
      },
      {
        name: "tem_fk",
        fields: [
          { name: "ustatusid" },
        ]
      },
      {
        name: "user_pk",
        unique: true,
        fields: [
          { name: "userid" },
        ]
      },
      {
        name: "user_type_fk",
        fields: [
          { name: "utypeid" },
        ]
      },
      {
        name: "userempresa2_fk",
        fields: [
          { name: "businessid" },
        ]
      },
    ],
    hooks: {
      beforeCreate: async (user, options) => {
        try {
          const hash = await bcrypt.hash(user.password, 10);
          user.password = hash;
        } catch (err) {
          throw new Error(err);
        }
      }
    }
  });

  return User;
};
