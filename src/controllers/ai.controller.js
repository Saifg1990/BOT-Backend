const aiService = require('../services/ai.service');
const StreamHandler = require('../utils/stream.utils');
const { broadcastMessage } = require('../websocket');
const ResponseHandler = require('../utils/response.utils');

async function handleTextChat(req, res) {
  try {
    const response = await aiService.sendTextMessage(req, req.body.message);
    const streamHandler = new StreamHandler(res, req.headers['client-id'], broadcastMessage);
    
    streamHandler.setupSSEHeaders();
    
    response.data.on('data', chunk => streamHandler.handleChunk(chunk));
    response.data.on('error', error => streamHandler.handleError(error));
    response.data.on('end', () => streamHandler.handleEnd());
  } catch (error) {
    ResponseHandler.error(res, error);
  }
}

async function handleAudioChat(req, res) {
  try {
    const response = await aiService.sendAudioMessage(
      req,
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );
    
    const streamHandler = new StreamHandler(res, req.headers['client-id'], broadcastMessage);
    
    streamHandler.setupSSEHeaders();
    
    response.data.on('data', chunk => streamHandler.handleChunk(chunk));
    response.data.on('error', error => streamHandler.handleError(error));
    response.data.on('end', () => streamHandler.handleEnd());
  } catch (error) {
    ResponseHandler.error(res, error);
  }
}

module.exports = {
  handleTextChat,
  handleAudioChat
};