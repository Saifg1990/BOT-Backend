const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Bot, {
        as: 'Bot',
        foreignKey: 'userId'
      });
      User.hasMany(models.Chat, {
        as: 'Chats',
        foreignKey: 'userId'
      });
    }

    async comparePassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apiKey: {
      type: DataTypes.STRING,
      unique: true
    },
    apiSecret: {
      type: DataTypes.STRING,
      unique: true
    },
    ulid: {
      type: DataTypes.STRING,
      unique: true
    },
    ipAddress: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  return User;
}