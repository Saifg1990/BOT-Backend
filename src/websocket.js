const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const clients = new Map();

function setupWebSocket(wss) {
  wss.on('connection', (ws) => {
    const clientId = uuidv4();
    clients.set(clientId, ws);

    console.log(`Client connected: ${clientId}`);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        handleMessage(clientId, data);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(clientId);
      console.log(`Client disconnected: ${clientId}`);
    });
  });
}

function handleMessage(clientId, data) {
  // Handle different message types
  switch (data.type) {
    case 'text':
    case 'audio':
    case 'transcription':
    case 'full_audio':
      broadcastMessage(clientId, data);
      break;
    default:
      console.log(`Unknown message type: ${data.type}`);
  }
}

function broadcastMessage(senderId, data) {
  clients.forEach((client, clientId) => {
    if (clientId !== senderId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

function sendToClient(clientId, data) {
  const client = clients.get(clientId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}

module.exports = {
  setupWebSocket,
  sendToClient,
  broadcastMessage
};