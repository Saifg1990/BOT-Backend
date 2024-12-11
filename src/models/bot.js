const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Bot extends Model {
        static associate(models) {
            Bot.hasMany(models.Chat, { foreignKey: 'botId' });
            Bot.belongsTo(models.User, { foreignKey: 'userId' });
        }

        // // Getter methods for file URLs
        // getCompanyLogoUrl() {
        //     return this.company_logo ? `${process.env.STORAGE_URL}/${this.company_logo}` : null;
        // }
        //
        // getCompanyInformationDocUrl() {
        //     return this.company_information_doc ? `${process.env.STORAGE_URL}/${this.company_information_doc}` : null;
        // }
        //
        // getBotAvatarUrl() {
        //     return this.bot_avatar ? `${process.env.STORAGE_URL}/${this.bot_avatar}` : null;
        // }
    }

    Bot.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        company_logo: {
            type: DataTypes.STRING,
            allowNull: true,
            // get() {
            //     return this.getCompanyLogoUrl();
            // }
        },
        company_website: {
            type: DataTypes.STRING,
            allowNull: true
        },
        company_information_doc: {
            type: DataTypes.STRING,
            allowNull: true,
            // get() {
            //     return this.getCompanyInformationDocUrl();
            // }
        },
        company_extra_informations: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        background_color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        primary_color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        secondary_color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        third_color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bot_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bot_avatar: {
            type: DataTypes.STRING,
            allowNull: true,
            // get() {
            //     return this.getBotAvatarUrl();
            // }
        },
        bot_language: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bot_greeting_message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Bot',
        tableName: 'Bots'
    });

    return Bot;
};