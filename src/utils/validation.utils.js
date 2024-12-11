const { ValidationError } = require('./errors');
const validator = require('validator');

async function validatePassword(password) {
    if (!password) {
        throw new ValidationError('Password is required');
    }

    if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters long');
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        throw new ValidationError('Password must contain uppercase, lowercase, number, and symbol');
    }

    return true;
}

async function validateBotSettings(data) {
    const errors = {};

    // Required string fields
    const requiredStringFields = [
        'company_name',
        'company_logo',
        'company_website',
        'company_information_doc',
        'company_extra_informations',
        'background_color',
        'primary_color',
        'secondary_color',
        'third_color',
        'bot_name',
        'bot_avatar',
        'bot_language',
        'bot_greeting_message'
    ];

    requiredStringFields.forEach(field => {
        if (!data[field] || !data[field].trim()) {
            errors[field] = 'This field is required';
        }
    });

    // Validate URL
    if (data.company_website && !validator.isURL(data.company_website)) {
        errors.company_website = 'Must be a valid URL';
    }

    // Validate IP address
    if (!data.ip_address || !validator.isIP(data.ip_address)) {
        errors.ip_address = 'Must be a valid IP address';
    }

    if (Object.keys(errors).length > 0) {
        throw new ValidationError('Validation failed', errors);
    }

    return data;
}

module.exports = {
    validatePassword,
    validateBotSettings
};