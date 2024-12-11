const axios = require('axios');
const FormData = require('form-data');
const { APIError } = require('../utils/errors');
const config = require('../config/api.config');

class AIService {
  constructor() {
    this.client = axios.create({
      baseURL: config.aiService.baseURL,
      timeout: config.aiService.timeout,
      maxContentLength: config.aiService.maxContentLength,
      maxBodyLength: config.aiService.maxBodyLength
    });
  }

  async sendTextMessage(message) {
    try {
      return await this.client.post('', 
        {
          user_input: message,
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

  async sendAudioMessage(audioBuffer, mimeType, filename) {
    try {
      const formData = new FormData();
      formData.append('record_file', audioBuffer, {
        filename: filename || 'audio.wav',
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