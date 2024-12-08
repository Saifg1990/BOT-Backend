require('dotenv').config();

module.exports = {
  aiService: {
    baseURL: process.env.AI_SERVICE_URL || 'http://172.201.96.132:5000/chatbot',
    timeout: 30000,
    maxContentLength: 50 * 1024 * 1024, // 50MB
    maxBodyLength: 50 * 1024 * 1024 // 50MB
  }
};