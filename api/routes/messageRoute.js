const express = require('express');
const router = express.Router();
const { 
  sendMessageToQueue, 
  sendMessageToExchange, 
  sendLogisticsData 
} = require('../controller/messageController');

// Route to send message to a specific queue
router.post('/send-to-queue', sendMessageToQueue);

// Route to send message to an exchange with routing key
router.post('/send-to-exchange', sendMessageToExchange);

// Route to send logistics-specific data
router.post('/send-logistics', sendLogisticsData);

module.exports = router;