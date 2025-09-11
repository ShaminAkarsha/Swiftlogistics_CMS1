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

  // Mock data for initial development
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD001',
        trackingNumber: 'ST2024001',
        pickupAddress: '123 Galle Road, Colombo 03',
        deliveryAddress: '456 Kandy Road, Kandy',
        packageInfo: '2kg Electronics',
        status: 'in-transit',
        createdAt: '2024-01-15',
        estimatedDelivery: '2024-01-16',
        cost: 'LKR 500'
      },
      {
        id: 'ORD002',
        trackingNumber: 'ST2024002',
        pickupAddress: '789 Negombo Road, Negombo',
        deliveryAddress: '321 Main Street, Gampaha',
        packageInfo: '1kg Documents',
        status: 'delivered',
        createdAt: '2024-01-14',
        estimatedDelivery: '2024-01-15',
        cost: 'LKR 350'
      },
      {
        id: 'ORD003',
        trackingNumber: 'ST2024003',
        pickupAddress: '555 Parliament Road, Battaramulla',
        deliveryAddress: '777 Baseline Road, Colombo 09',
        packageInfo: '5kg Books',
        status: 'processing',
        createdAt: '2024-01-16',
        estimatedDelivery: '2024-01-17',
        cost: 'LKR 750'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }

      // Add the new order to local state
      setOrders(prev => [result.order, ...prev]);
      
      return {
        success: true,
        order: result.order
      };
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Fallback to mock data if API fails (for development)
      if (process.env.NODE_ENV === 'development') {
        const newOrder = {
          id: `ORD${Date.now()}`,
          trackingNumber: `ST${Date.now()}`,
          ...orderData,
          status: 'submitted',
          createdAt: new Date().toISOString().split('T')[0],
          cost: calculateCost(orderData.packageInfo, orderData.serviceType)
        };
        
        setOrders(prev => [newOrder, ...prev]);
        return { success: true, order: newOrder };
      }
      
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  const calculateCost = (packageInfo, serviceType) => {
    // Simple cost calculation logic
    const baseRate = serviceType === 'express' ? 800 : 500;
    const weight = parseFloat(packageInfo.split('kg')[0]) || 1;
    return `LKR ${Math.round(baseRate * weight)}`;
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const searchOrders = (query) => {
    return orders.filter(order => 
      order.trackingNumber.toLowerCase().includes(query.toLowerCase()) ||
      order.pickupAddress.toLowerCase().includes(query.toLowerCase()) ||
      order.deliveryAddress.toLowerCase().includes(query.toLowerCase())
    );
  };

  const value = {
    orders,
    loading,
    createOrder,
    getOrdersByStatus,
    searchOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};