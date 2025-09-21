import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';

const OrderHistory = () => {
  const { user } = useAuth();
  const { get } = useApi();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await get('/orders/my');
        setOrders(response.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        // Keep empty array on error
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, get]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Order History</h2>
        <Link
          to="/products"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-slate-600">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-lg font-bold text-slate-800">
                    ₹{calculateTotal(order.items).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🛒</span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-slate-800">{item.name}</h4>
                      <p className="text-slate-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-slate-200">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-slate-600">
                    <strong>Shipping Address:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.city}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Link
                    to={`/order-tracking/${order._id}`}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Track Order
                  </Link>
                  <Link
                    to={`/invoice/${order._id}`}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-black transition-colors"
                  >
                    View Invoice
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No Orders Yet</h3>
          <p className="text-slate-600 mb-6">Start shopping to see your order history here.</p>
          <Link
            to="/products"
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistory; 