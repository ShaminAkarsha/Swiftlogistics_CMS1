import React, { useState } from 'react';
import { HelpCircle, Plus, MessageSquare, Clock, CheckCircle, AlertCircle, Search } from 'lucide-react';
import CreateTicketModal from './CreateTicketModal';

const SupportTickets = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock support tickets data
  const tickets = [
    {
      id: 'TICKET001',
      title: 'Delayed Delivery for Order ST2024001',
      description: 'My package was supposed to be delivered yesterday but still shows in transit.',
      status: 'open',
      priority: 'high',
      category: 'delivery-issue',
      createdAt: '2024-01-16',
      lastResponse: '2024-01-16',
      responseCount: 2
    },
    {
      id: 'TICKET002',
      title: 'Invoice Discrepancy',
      description: 'There seems to be an error in my latest invoice calculation.',
      status: 'resolved',
      priority: 'medium',
      category: 'billing',
      createdAt: '2024-01-14',
      lastResponse: '2024-01-15',
      responseCount: 4
    },
    {
      id: 'TICKET003',
      title: 'API Integration Support',
      description: 'Need help integrating our e-commerce platform with SwiftTrack API.',
      status: 'in-progress',
      priority: 'medium',
      category: 'technical',
      createdAt: '2024-01-13',
      lastResponse: '2024-01-16',
      responseCount: 6
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { color: 'bg-blue-100 text-blue-800', label: 'Open', icon: AlertCircle },
      'in-progress': { color: 'bg-yellow-100 text-yellow-800', label: 'In Progress', icon: Clock },
      'resolved': { color: 'bg-green-100 text-green-800', label: 'Resolved', icon: CheckCircle },
      'closed': { color: 'bg-gray-100 text-gray-800', label: 'Closed', icon: CheckCircle }
    };
    
    const config = statusConfig[status] || statusConfig['open'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'low': { color: 'bg-gray-100 text-gray-600', label: 'Low' },
      'medium': { color: 'bg-yellow-100 text-yellow-700', label: 'Medium' },
      'high': { color: 'bg-red-100 text-red-700', label: 'High' },
      'urgent': { color: 'bg-red-200 text-red-800', label: 'Urgent' }
    };
    
    const config = priorityConfig[priority] || priorityConfig['medium'];
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600">Get help with your deliveries and account</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-orange-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Support Ticket</span>
        </button>
      </div>

      {/* Quick Help */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Need Quick Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <HelpCircle className="h-8 w-8 mb-3" />
            <h3 className="font-medium mb-2">Track Your Order</h3>
            <p className="text-sm text-blue-100">Get real-time updates on your deliveries</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <MessageSquare className="h-8 w-8 mb-3" />
            <h3 className="font-medium mb-2">Live Chat</h3>
            <p className="text-sm text-blue-100">Chat with our support team instantly</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <HelpCircle className="h-8 w-8 mb-3" />
            <h3 className="font-medium mb-2">FAQ</h3>
            <p className="text-sm text-blue-100">Find answers to common questions</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{ticket.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span><strong>Ticket ID:</strong> {ticket.id}</span>
                    <span><strong>Created:</strong> {ticket.createdAt}</span>
                    <span><strong>Last Response:</strong> {ticket.lastResponse}</span>
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{ticket.responseCount} responses</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                    View Details
                  </button>
                  {!ticket.read && (
                    <button
                      onClick={() => markAsRead(ticket.id)}
                      className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-12">
          <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first support ticket if you need help'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Support Ticket
            </button>
          )}
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <CreateTicketModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default SupportTickets;