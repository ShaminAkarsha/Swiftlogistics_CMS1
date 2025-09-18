const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getOrder,
  getAllOrders,
  updateOrderStatus 
} = require('../controller/orderController');

// Create new order
router.post('/create', createOrder);

// Get all orders with filtering and search
router.get('/', getAllOrders);

// Get order by tracking number
router.get('/:trackingNumber', getOrder);

// Update order status
router.patch('/:trackingNumber/status', updateOrderStatus);

// Get all orders (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    const queryData = {
      action: 'get_all_orders',
      filters: {
        status: status || 'all',
        limit: parseInt(limit),
        offset: parseInt(offset)
      },
      timestamp: new Date().toISOString()
    };
    
    // In a real application, you would fetch from database
    // For now, send query to message queue for processing
    const RabbitMQProducer = require('../rabbitmq/producer');
    const producer = new RabbitMQProducer();
    
    await producer.sendMessage('order_queries', queryData);
    
    res.status(200).json({
      success: true,
      message: 'Orders query sent for processing',
      filters: queryData.filters
    });
    
  } catch (error) {
    console.error('Error querying orders:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to query orders'
    });
  }
});

module.exports = router;