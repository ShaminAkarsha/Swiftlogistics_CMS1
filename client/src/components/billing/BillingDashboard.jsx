import React, { useState } from 'react';
import { CreditCard, DollarSign, FileText, Download, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const BillingDashboard = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  // Mock billing data
  const billingData = {
    currentBalance: 12500,
    overdueAmount: 0,
    totalSpent: 45000,
    thisMonth: 8500,
    invoices: [
      {
        id: 'INV2024001',
        date: '2024-01-15',
        amount: 8500,
        status: 'paid',
        dueDate: '2024-01-30',
        description: 'Delivery Services - January 2024'
      },
      {
        id: 'INV2024002',
        date: '2024-01-01',
        amount: 6750,
        status: 'paid',
        dueDate: '2024-01-15',
        description: 'Delivery Services - December 2023'
      },
      {
        id: 'INV2023012',
        date: '2023-12-15',
        amount: 9250,
        status: 'overdue',
        dueDate: '2023-12-30',
        description: 'Delivery Services - November 2023'
      }
    ],
    serviceRates: {
      standard: { rate: 350, description: '2-3 business days' },
      express: { rate: 800, description: 'Next business day' },
      sameDay: { rate: 1200, description: 'Within 6 hours' }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'paid': { color: 'bg-green-100 text-green-800', label: 'Paid', icon: CheckCircle },
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: Calendar },
      'overdue': { color: 'bg-red-100 text-red-800', label: 'Overdue', icon: AlertCircle }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600">Manage your account balance and service charges</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="current">Current Period</option>
            <option value="last-month">Last Month</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="year-to-date">Year to Date</option>
          </select>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+5.2%</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Current Balance</p>
          <p className="text-2xl font-bold text-gray-900">LKR {billingData.currentBalance.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Due Now</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
          <p className="text-2xl font-bold text-gray-900">LKR {billingData.overdueAmount.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">This Month</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Monthly Spending</p>
          <p className="text-2xl font-bold text-gray-900">LKR {billingData.thisMonth.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">YTD</span>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900">LKR {billingData.totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Service Rates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Service Rates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(billingData.serviceRates).map(([type, info]) => (
            <div key={type} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 capitalize mb-2">
                {type === 'sameDay' ? 'Same Day' : type} Delivery
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">LKR {info.rate}/kg</p>
              <p className="text-sm text-gray-600">{info.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Your Tier:</strong> {user?.tier === 'premium' ? 'Premium' : 'Standard'} Plan
            {user?.tier === 'premium' && <span className="ml-2">(15% discount applied)</span>}
          </p>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Invoice History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billingData.invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{invoice.id}</div>
                    <div className="text-sm text-gray-500">{invoice.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    LKR {invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Download
                    </button>
                    {invoice.status !== 'paid' && (
                      <button className="text-green-600 hover:text-green-700 font-medium">
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
            Add Payment Method
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Bank Transfer</p>
              <p className="text-sm text-gray-600">Primary payment method</p>
            </div>
            <span className="text-sm font-medium text-green-600">Active</span>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 flex items-center space-x-4 opacity-50">
            <div className="bg-gray-100 p-3 rounded-lg">
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-600">Credit Card</p>
              <p className="text-sm text-gray-500">Not configured</p>
            </div>
            <span className="text-sm font-medium text-gray-400">Inactive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;