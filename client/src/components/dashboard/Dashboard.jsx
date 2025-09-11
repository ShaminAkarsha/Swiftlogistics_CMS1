import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardHome from './DashboardHome';
import OrderManagement from '../orders/OrderManagement';
import BillingDashboard from '../billing/BillingDashboard';
import ProfileSettings from '../profile/ProfileSettings';
import NotificationPanel from '../notifications/NotificationPanel';
import SupportTickets from '../support/SupportTickets';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'orders':
        return <OrderManagement />;
      case 'billing':
        return <BillingDashboard />;
      case 'profile':
        return <ProfileSettings />;
      case 'notifications':
        return <NotificationPanel />;
      case 'support':
        return <SupportTickets />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;