import React, { useState, useEffect } from 'react';
import AuthLayout from './components/auth/AuthLayout';
import Dashboard from './components/dashboard/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import { NotificationProvider } from './contexts/NotificationContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SwiftTrack...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthLayout />;
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <OrderProvider>
          <div className="App">
            <AppContent />
          </div>
        </OrderProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;