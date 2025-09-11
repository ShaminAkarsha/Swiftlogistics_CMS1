const RabbitMQProducer = require('../rabbitmq/producer');

const producer = new RabbitMQProducer();

// Initialize RabbitMQ connection when server starts
const initializeRabbitMQ = async () => {
  try {
    await producer.connect();
  } catch (error) {
    console.error('Failed to initialize RabbitMQ:', error);
  }
};

const sendMessageToQueue = async (req, res) => {
  try {
    const { queueName, message } = req.body;

    if (!queueName || !message) {
      return res.status(400).json({
        success: false,
        error: 'queueName and message are required'
      });
    }

    const sent = await producer.sendMessage(queueName, message);
    
    if (sent) {
      res.status(200).json({
        success: true,
        message: 'Message sent successfully',
        data: { queueName, message }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send message'
      });
    }
  } catch (error) {
    console.error('Error in sendMessageToQueue:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const sendMessageToExchange = async (req, res) => {
  try {
    const { exchangeName, routingKey, message, exchangeType = 'direct' } = req.body;

    if (!exchangeName || !routingKey || !message) {
      return res.status(400).json({
        success: false,
        error: 'exchangeName, routingKey, and message are required'
      });
    }

    const published = await producer.sendToExchange(exchangeName, routingKey, message, exchangeType);
    
    if (published) {
      res.status(200).json({
        success: true,
        message: 'Message published successfully',
        data: { exchangeName, routingKey, message, exchangeType }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to publish message'
      });
    }
  } catch (error) {
    console.error('Error in sendMessageToExchange:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Example controller for sending logistics data
const sendLogisticsData = async (req, res) => {
  try {
    const logisticsData = {
      orderId: req.body.orderId || `ORDER_${Date.now()}`,
      customerName: req.body.customerName,
      pickup: req.body.pickup,
      delivery: req.body.delivery,
      status: req.body.status || 'pending',
      timestamp: new Date().toISOString(),
      priority: req.body.priority || 'normal'
    };

    const sent = await producer.sendMessage('logistics_queue', logisticsData);
    
    if (sent) {
      res.status(200).json({
        success: true,
        message: 'Logistics data sent successfully',
        data: logisticsData
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send logistics data'
      });
    }
  } catch (error) {
    console.error('Error in sendLogisticsData:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  initializeRabbitMQ,
  sendMessageToQueue,
  sendMessageToExchange,
  sendLogisticsData
};