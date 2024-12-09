const { Model, DataTypes } = require('sequelize');
const { ulid } = require('ulid');

module.exports = (sequelize) => {
    class Chat extends Model {
        static associate(models) {
            Chat.belongsTo(models.User, { foreignKey: 'userId' });
            Chat.belongsTo(models.Bot, { foreignKey: 'botId' });
            Chat.hasMany(models.ChatMessage, { foreignKey: 'chatId' });
        }
    }

    Chat.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ulid: {
            type: DataTypes.STRING,
            unique: true,
            defaultValue: () => ulid()
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        botId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Bots',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Chat',
        tableName: 'Chats'
    });

    return Chat;
};