// Simple in-memory storage for orders (for demo purposes)
// In production, you would use a database

class OrderStorage {
  constructor() {
    this.orders = [];
  }

  // Add new order
  addOrder(order) {
    const orderWithId = {
      ...order,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.orders.unshift(orderWithId); // Add to beginning for latest first
    return orderWithId;
  }

  // Get all orders
  getAllOrders() {
    return this.orders;
  }

  // Get order by tracking number
  getOrderByTrackingNumber(trackingNumber) {
    return this.orders.find(order => order.trackingNumber === trackingNumber);
  }

  // Get orders by status
  getOrdersByStatus(status) {
    if (status === 'all') return this.orders;
    return this.orders.filter(order => order.status === status);
  }

  // Search orders
  searchOrders(query) {
    const searchTerm = query.toLowerCase();
    return this.orders.filter(order => 
      order.trackingNumber.toLowerCase().includes(searchTerm) ||
      order.pickup.contact.toLowerCase().includes(searchTerm) ||
      order.delivery.contact.toLowerCase().includes(searchTerm) ||
      order.pickup.address.toLowerCase().includes(searchTerm) ||
      order.delivery.address.toLowerCase().includes(searchTerm) ||
      order.package.description.toLowerCase().includes(searchTerm)
    );
  }

  // Update order status
  updateOrderStatus(trackingNumber, status, notes = '', location = '') {
    const orderIndex = this.orders.findIndex(order => order.trackingNumber === trackingNumber);
    if (orderIndex !== -1) {
      this.orders[orderIndex] = {
        ...this.orders[orderIndex],
        status,
        currentLocation: location,
        notes,
        updatedAt: new Date().toISOString()
      };
      return this.orders[orderIndex];
    }
    return null;
  }

  // Generate simple ID
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Clear all orders (for testing)
  clearAllOrders() {
    this.orders = [];
  }

  // Get orders count by status
  getOrdersCountByStatus() {
    const counts = {
      all: this.orders.length,
      submitted: 0,
      processing: 0,
      'in-transit': 0,
      delivered: 0
    };

    this.orders.forEach(order => {
      if (counts.hasOwnProperty(order.status)) {
        counts[order.status]++;
      }
    });

    return counts;
  }
}

// Create singleton instance
const orderStorage = new OrderStorage();

module.exports = orderStorage;