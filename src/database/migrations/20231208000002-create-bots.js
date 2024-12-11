'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Bots', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            company_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            company_logo: {
                type: Sequelize.STRING,
                allowNull: true
            },
            company_website: {
                type: Sequelize.STRING,
                allowNull: true
            },
            company_information_doc: {
                type: Sequelize.STRING,
                allowNull: true
            },
            company_extra_informations: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            background_color: {
                type: Sequelize.STRING,
                allowNull: true
            },
            primary_color: {
                type: Sequelize.STRING,
                allowNull: true
            },
            secondary_color: {
                type: Sequelize.STRING,
                allowNull: true
            },
            third_color: {
                type: Sequelize.STRING,
                allowNull: true
            },
            bot_name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            bot_avatar: {
                type: Sequelize.STRING,
                allowNull: true
            },
            bot_language: {
                type: Sequelize.STRING,
                allowNull: true
            },
            bot_greeting_message: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
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
        await queryInterface.dropTable('Bots');
    }
};