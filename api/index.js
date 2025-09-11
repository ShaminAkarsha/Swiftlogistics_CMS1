const express = require('express');
const cors = require('cors');
const { initializeRabbitMQ } = require('./controller/messageController');
const messageRoute = require('./routes/messageRoute');
const orderRoute = require('./routes/orderRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for React frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Swift Logistics API is running with RabbitMQ');
});

// Message routes (for general messaging)
app.use('/api/messages', messageRoute);

// Order routes (for your React frontend)
app.use('/api/orders', orderRoute);

// Initialize RabbitMQ connection
const startServer = async () => {
  try {
    await initializeRabbitMQ();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log('RabbitMQ Producer is ready');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

startServer();