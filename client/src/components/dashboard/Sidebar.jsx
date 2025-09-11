import React from 'react';
import { 
  Truck, 
  LayoutDashboard, 
  Package, 
  CreditCard, 
  Bell, 
  User, 
  HelpCircle, 
  X,
  BarChart3,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Order Management', icon: Package },
    // { id: 'tracking', label: 'Live Tracking', icon: MapPin },
    // { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
    // { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
    // { id: 'profile', label: 'Profile & Settings', icon: User },
    // { id: 'support', label: 'Support Center', icon: HelpCircle }
  ];

  const handleMenuClick = (itemId) => {
    setActiveTab(itemId);
    setIsOpen(false); // Close sidebar on mobile
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-2 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SwiftTrack</h1>
                <p className="text-xs text-blue-600">Client Portal</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>SwiftTrack v2.1.0</p>
              <p>© 2025 Swift Logistics</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;