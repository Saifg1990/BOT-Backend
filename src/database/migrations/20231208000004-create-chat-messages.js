'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ChatMessages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            chatId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Chats',
                    key: 'id'
                }
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            isBot: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    down: async (queryInterface, _Sequelize) => {
        await queryInterface.dropTable('ChatMessages');
    }
};