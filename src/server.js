const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const serveStatic = require('serve-static');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { setupWebSocket } = require('./websocket');
const aiRoutes = require('./routes/ai.routes');
const authRoutes = require('./routes/auth.routes');
const botSettingsRoutes = require('./routes/bot-settings.routes');
const errorHandler = require('./middleware/error.middleware');
const db = require('./models');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, 'docs/swagger.yaml'));

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(serveStatic(path.join(__dirname, '../public')));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// WebSocket setup
setupWebSocket(wss);

// Routes
app.use('/api', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bot-settings', botSettingsRoutes);

// Error handling
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

// Sync database and start server
function startServer() {
  db.sequelize.sync().then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  }).catch(err => {
    console.error('Failed to sync database:', err);
    setTimeout(startServer, 5000); // Retry after 5 seconds
  });
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  setTimeout(startServer, 5000); // Restart server after 5 seconds
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  setTimeout(startServer, 5000); // Restart server after 5 seconds
});

startServer();