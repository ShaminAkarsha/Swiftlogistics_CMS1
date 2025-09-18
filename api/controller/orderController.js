const RabbitMQProducer = require('../rabbitmq/producer');
const orderStorage = require('../utils/orderStorage');

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
      source: {
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
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // Additional logistics data
      priority: urgency === 'urgent' ? 'high' : urgency === 'high' ? 'medium' : 'normal',
      
      // Frontend display fields (matching your OrderManagement component)
      pickupAddress,
      deliveryAddress: sourceAddress,
      packageInfo: `${packageWeight}kg ${packageDescription}`,
      cost: `LKR ${shippingCost.toFixed(2)}`,
      estimatedDelivery: new Date(estimatedDelivery).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };

    // Store order in temporary storage for frontend display
    const storedOrder = orderStorage.addOrder(orderData);

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
        ...storedOrder,
        trackingNumber,
        status: 'submitted',
        estimatedDelivery: new Date(estimatedDelivery).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        shippingCost
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
    
    // Get order from storage
    const order = orderStorage.getOrderByTrackingNumber(trackingNumber);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error('Error querying order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to query order'
    });
  }
};

// Get all orders with filtering
const getAllOrders = async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    
    let orders = orderStorage.getAllOrders();
    
    // Apply status filter
    if (status && status !== 'all') {
      orders = orderStorage.getOrdersByStatus(status);
    }
    
    // Apply search filter
    if (search) {
      orders = orderStorage.searchOrders(search);
    }
    
    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = orders.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      orders: paginatedOrders,
      total: orders.length,
      hasMore: endIndex < orders.length
    });
    
  } catch (error) {
    console.error('Error querying orders:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to query orders'
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
    
    // Update in storage
    const updatedOrder = orderStorage.updateOrderStatus(trackingNumber, status, notes, location);
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Send to RabbitMQ for processing
    const updateData = {
      trackingNumber,
      status,
      location: location || '',
      notes: notes || '',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system'
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
      message: 'Order status updated successfully',
      order: updatedOrder
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
  getAllOrders,
  updateOrderStatus
};