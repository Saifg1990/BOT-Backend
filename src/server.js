const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const serveStatic = require('serve-static');
const { setupWebSocket } = require('./websocket');
const aiRoutes = require('./routes/ai.routes');
const errorHandler = require('./middleware/error.middleware');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(serveStatic(path.join(__dirname, '../public')));

// WebSocket setup
setupWebSocket(wss);

// Routes
app.use('/api', aiRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});