import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Truck,
  Search,
  Eye,
  Edit3,
  MoreVertical,
  Calendar,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';

const EnhancedOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [stockAlerts, setStockAlerts] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: '',
    customerId: '',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    order: 'desc'
  });
  
  // Modal states
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch order statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/orders/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch filtered orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams(filters);
      
      const response = await fetch(`/api/orders/admin/filtered?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/orders/admin/analytics?period=30', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Fetch stock alerts
  const fetchStockAlerts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/orders/admin/stock-alerts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setStockAlerts(data.data);
      }
    } catch (error) {
      console.error('Error fetching stock alerts:', error);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus, trackingNumber = '', notes = '') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber,
          notes
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchOrders(); // Refresh orders
        fetchStats(); // Refresh stats
        alert('Order status updated successfully!');
      } else {
        alert('Error updating order status: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
    }
  };

  // Bulk update orders
  const bulkUpdateOrders = async (status, notes = '') => {
    if (selectedOrders.length === 0) {
      alert('Please select orders to update');
      return;
    }

    if (!confirm(`Are you sure you want to update ${selectedOrders.length} orders to ${status}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/orders/admin/bulk-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderIds: selectedOrders,
          status,
          notes
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSelectedOrders([]);
        fetchOrders();
        fetchStats();
        alert(data.message);
      } else {
        alert('Error updating orders: ' + data.error);
      }
    } catch (error) {
      console.error('Error bulk updating orders:', error);
      alert('Error updating orders');
    }
  };

  // Export orders
  const exportOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        status: filters.status
      });
      
      const response = await fetch(`/api/orders/admin/export?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        // Convert to CSV and download
        const csvContent = convertToCSV(data.data);
        downloadCSV(csvContent, 'orders-export.csv');
        alert('Orders exported successfully!');
      }
    } catch (error) {
      console.error('Error exporting orders:', error);
      alert('Error exporting orders');
    }
  };

  // Helper function to convert data to CSV
  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  // Helper function to download CSV
  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      processing: <RefreshCw className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      refunded: <DollarSign className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  useEffect(() => {
    fetchStats();
    fetchOrders();
    fetchAnalytics();
    fetchStockAlerts();
  }, [filters]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive order tracking and analytics</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button
            onClick={exportOrders}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => {
              fetchOrders();
              fetchStats();
              fetchAnalytics();
              fetchStockAlerts();
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview?.totalOrders || 0}</p>
              <p className="text-green-600 text-sm mt-1">
                +{stats.overview?.todayOrders || 0} today
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(stats.overview?.totalRevenue || 0).toLocaleString()}
              </p>
              <p className="text-green-600 text-sm mt-1">
                +₹{(stats.overview?.todayRevenue || 0).toLocaleString()} today
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{Math.round(stats.overview?.averageOrderValue || 0)}
              </p>
              <p className="text-blue-600 text-sm mt-1">
                {stats.overview?.monthlyOrders || 0} this month
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Stock Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{stockAlerts.length}</p>
              <p className="text-orange-600 text-sm mt-1">
                {stockAlerts.filter(alert => alert.severity === 'critical').length} critical
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <h3 className="text-lg font-semibold mb-4">Order Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(stats.statusStats || {}).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                {getStatusIcon(status)}
                <span className="ml-2 capitalize">{status}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Alerts */}
      {stockAlerts.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
            Stock Alerts
          </h3>
          <div className="space-y-3">
            {stockAlerts.slice(0, 5).map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                'bg-yellow-50 border-yellow-500'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.product.name}</h4>
                    <p className="text-sm text-gray-600">
                      Only {alert.currentStock} left • {alert.estimatedDaysLeft} days of stock remaining
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <div className="flex items-center gap-3">
              {selectedOrders.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedOrders.length} selected
                  </span>
                  <button
                    onClick={() => setShowBulkActions(true)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200"
                  >
                    Bulk Actions
                  </button>
                </div>
              )}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(orders.map(order => order._id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders([...selectedOrders, order._id]);
                          } else {
                            setSelectedOrders(selectedOrders.filter(id => id !== order._id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </div>
                      {order.invoiceNumber && (
                        <div className="text-xs text-gray-500">{order.invoiceNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const newStatus = prompt('Enter new status (pending, confirmed, processing, shipped, delivered, cancelled):');
                            if (newStatus) {
                              updateOrderStatus(order._id, newStatus);
                            }
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Status Update Buttons */}
      {selectedOrders.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white p-4 rounded-xl shadow-lg border">
          <p className="text-sm font-medium text-gray-900 mb-3">
            Quick Actions ({selectedOrders.length} orders)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => bulkUpdateOrders('confirmed')}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Confirm
            </button>
            <button
              onClick={() => bulkUpdateOrders('processing')}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
            >
              Process
            </button>
            <button
              onClick={() => bulkUpdateOrders('shipped')}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
            >
              Ship
            </button>
            <button
              onClick={() => bulkUpdateOrders('delivered')}
              className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
            >
              Deliver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedOrderManagement;