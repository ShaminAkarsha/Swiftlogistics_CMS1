// Update your OrderContext.js file with this code

import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:3000/api/orders';

  // Fetch all orders from backend
  const fetchOrders = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status && filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      const response = await fetch(`${API_BASE_URL}?${queryParams}`);
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.orders);
        return result.orders;
      } else {
        console.error('Failed to fetch orders:', result.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create new order
  const createOrder = async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Add the new order to the local state
        setOrders(prevOrders => [result.order, ...prevOrders]);
        
        return {
          success: true,
          order: result.order
        };
      } else {
        throw new Error(result.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Get order by tracking number
  const getOrderByTrackingNumber = async (trackingNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${trackingNumber}`);
      const result = await response.json();
      
      if (result.success) {
        return result.order;
      } else {
        console.error('Failed to get order:', result.error);
        return null;
      }
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  };

  // Update order status
  const updateOrderStatus = async (trackingNumber, status, notes = '', location = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/${trackingNumber}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes, location })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update the order in local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.trackingNumber === trackingNumber 
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          )
        );
        
        return {
          success: true,
          order: result.order
        };
      } else {
        throw new Error(result.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Search orders locally (for immediate filtering)
  const searchOrders = (query) => {
    if (!query) return orders;
    
    const searchTerm = query.toLowerCase();
    return orders.filter(order => 
      order.trackingNumber.toLowerCase().includes(searchTerm) ||
      order.pickup?.contact?.toLowerCase().includes(searchTerm) ||
      order.delivery?.contact?.toLowerCase().includes(searchTerm) ||
      order.pickupAddress?.toLowerCase().includes(searchTerm) ||
      order.deliveryAddress?.toLowerCase().includes(searchTerm) ||
      order.package?.description?.toLowerCase().includes(searchTerm) ||
      order.packageInfo?.toLowerCase().includes(searchTerm)
    );
  };

  // Get orders by status locally
  const getOrdersByStatus = (status) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const contextValue = {
    orders,
    loading,
    createOrder,
    getOrderByTrackingNumber,
    updateOrderStatus,
    searchOrders,
    getOrdersByStatus,
    fetchOrders, // For manual refresh
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};