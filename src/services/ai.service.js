const axios = require('axios');
const FormData = require('form-data');
const { APIError } = require('../utils/errors');
const config = require('../config/api.config');
const { Bot,User } = require('../models');

class AIService {
  constructor() {
    this.client = axios.create({
      baseURL: config.aiService.baseURL,
      timeout: config.aiService.timeout,
      maxContentLength: config.aiService.maxContentLength,
      maxBodyLength: config.aiService.maxBodyLength
    });
  }

  async sendTextMessage(req,message) {
    const bot = await Bot.findOne({
      where: { userId: req.user.id },
    });
    try {
      return await this.client.post('',
        {
          user_input: message,
          company: bot.company_name,
          company_url: bot.company_website,
          language: bot.bot_language,
          info: bot.company_extra_informations,
          docs_path: '/shrd/' + bot.company_information_doc,
          response_format: 'stream'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
          },
          responseType: 'stream'
        }
      );
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async sendAudioMessage(req,audioBuffer, mimeType, filename) {
    const bot = await Bot.findOne({
      where: { userId: req.user.id },
    });
    try {
      const formData = new FormData();
      formData.append('record_file', audioBuffer, {
        filename: filename || 'audio.wav',
        company: bot.company_name,
        company_url: bot.company_website,
        language: bot.bot_language,
        info: bot.company_extra_informations,
        docs_path: '/shrd/' + bot.company_information_doc,
        contentType: mimeType
      });
      formData.append('response_format', 'stream');

      return await this.client.post('', formData, {
        headers: {
          ...formData.getHeaders(),
          'Accept': 'text/event-stream'
        },
        responseType: 'stream'
      });
    } catch (error) {
      throw this._handleError(error);
    }
  }

  _handleError(error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'AI service error';
    const details = error.response?.data || error.toString();
    
    return new APIError(message, status, details);
  }
}

module.exports = new AIService();