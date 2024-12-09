const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ChatMessage extends Model {
        static associate(models) {
            ChatMessage.belongsTo(models.Chat, { foreignKey: 'chatId' });
        }
    }

    ChatMessage.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        chatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Chats',
                key: 'id'
            }
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        isBot: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'ChatMessage',
        tableName: 'ChatMessages'
    });

    return ChatMessage;
};