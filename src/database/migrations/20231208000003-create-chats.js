'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Chats', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            ulid: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            botId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Bots',
                    key: 'id'
                }
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
        await queryInterface.dropTable('Chats');
    }
};