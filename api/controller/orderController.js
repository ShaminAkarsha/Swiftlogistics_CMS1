const RabbitMQProducer = require('../rabbitmq/producer');

const producer = new RabbitMQProducer();

// Generate tracking number
const generateTrackingNumber = () => {
  const prefix = 'SL';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

// Calculate estimated delivery date
const calculateEstimatedDelivery = (serviceType) => {
  const today = new Date();
  let deliveryDays;
  
  switch (serviceType) {
    case 'same-day':
      deliveryDays = 0;
      break;
    case 'express':
      deliveryDays = 1;
      break;
    case 'standard':
    default:
      deliveryDays = 2;
      break;
  }
  
  const estimatedDate = new Date(today);
  estimatedDate.setDate(today.getDate() + deliveryDays);
  return estimatedDate.toISOString();
};

// Calculate shipping cost
const calculateShippingCost = (weight, serviceType, urgency = 'normal') => {
  let baseRate;
  
  switch (serviceType) {
    case 'same-day':
      baseRate = 1200;
      break;
    case 'express':
      baseRate = 800;
      break;
    case 'standard':
    default:
      baseRate = 350;
      break;
  }
  
  let cost = parseFloat(weight) * baseRate;
  
  // Apply urgency multiplier
  switch (urgency) {
    case 'urgent':
      cost *= 1.5;
      break;
    case 'high':
      cost *= 1.25;
      break;
    case 'normal':
    default:
      break;
  }
  
  return Math.round(cost * 100) / 100; // Round to 2 decimal places
};

const createOrder = async (req, res) => {
  try {
    const {
      pickupAddress,
      pickupContact,
      pickupPhone,
      sourceAddress,
      sourceContact,
      sourcePhone,
      packageDescription,
      packageWeight,
      packageValue,
      serviceType = 'standard',
      sourceInstructions = '',
      urgency = 'normal'
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'pickupAddress', 'pickupContact', 'pickupPhone',
      'sourceAddress', 'sourceContact', 'sourcePhone',
      'packageDescription', 'packageWeight', 'packageValue'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields
      });
    }

    // Generate tracking number and calculate values
    const trackingNumber = generateTrackingNumber();
    const estimatedDelivery = calculateEstimatedDelivery(serviceType);
    const shippingCost = calculateShippingCost(packageWeight, serviceType, urgency);

    // Create order object
    const orderData = {
      // Order identifiers
      trackingNumber,
      orderId: trackingNumber,
      
      // Pickup information
      pickup: {
        address: pickupAddress,
        contact: pickupContact,
        phone: pickupPhone
      },
      
      // Delivery information (using source fields from your frontend)
      delivery: {
        address: sourceAddress,
        contact: sourceContact,
        phone: sourcePhone,
        instructions: sourceInstructions
      },
      
      // Package information
      package: {
        description: packageDescription,
        weight: parseFloat(packageWeight),
        declaredValue: parseFloat(packageValue),
        packageInfo: `${packageWeight}kg ${packageDescription}`
      },
      
      // Service information
      service: {
        type: serviceType,
        urgency,
        shippingCost,
        estimatedDelivery
      },
      
      // Order status and metadata
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // Additional logistics data
      priority: urgency === 'urgent' ? 'high' : urgency === 'high' ? 'medium' : 'normal'
    };

    // Send to RabbitMQ queue
    const queueSent = await producer.sendMessage('logistics_orders', orderData);
    
    if (!queueSent) {
      throw new Error('Failed to queue order for processing');
    }

    // Also send to notification queue for real-time updates
    const notificationData = {
      type: 'order_created',
      trackingNumber,
      message: `New order ${trackingNumber} created successfully`,
      timestamp: new Date().toISOString(),
      priority: orderData.priority
    };
    
    await producer.sendMessage('notifications', notificationData);

    // Send success response (matching your frontend expected format)
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        trackingNumber,
        status: 'pending',
        estimatedDelivery,
        shippingCost,
        ...orderData
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order'
    });
  }
};

// Get order by tracking number
const getOrder = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    
    // In a real application, you would fetch from database
    // For now, we'll send a message to get order status
    const queryData = {
      action: 'get_order',
      trackingNumber,
      timestamp: new Date().toISOString()
    };
    
    await producer.sendMessage('order_queries', queryData);
    
    res.status(200).json({
      success: true,
      message: 'Order query sent for processing',
      trackingNumber
    });
    
  } catch (error) {
    console.error('Error querying order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to query order'
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { status, location, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }
    
    const updateData = {
      trackingNumber,
      status,
      location: location || '',
      notes: notes || '',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system' // You can get this from authentication
    };
    
    await producer.sendMessage('order_updates', updateData);
    
    // Send notification about status update
    const notificationData = {
      type: 'status_update',
      trackingNumber,
      message: `Order ${trackingNumber} status updated to ${status}`,
      timestamp: new Date().toISOString(),
      priority: 'normal'
    };
    
    await producer.sendMessage('notifications', notificationData);
    
    res.status(200).json({
      success: true,
      message: 'Order status update sent for processing',
      data: updateData
    });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update order status'
    });
  }
};

module.exports = {
  createOrder,
  getOrder,
  updateOrderStatus
};