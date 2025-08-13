import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
const DashboardWelcome = () => {
  const { user } = useAuth();
  const { get } = useApi();
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    savedAddresses: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await get('/orders/my');
        const orders = ordersResponse.orders || [];
        
        // Fetch wishlist
        const wishlistResponse = await get('/wishlist');
        const wishlistItems = wishlistResponse.items || [];
        
        // Fetch addresses
        const addressesResponse = await get('/addresses');
        const addresses = addressesResponse.addresses || [];
        // Update stats
        setStats({
          totalOrders: orders.length,
          wishlistItems: wishlistItems.length,
          savedAddresses: addresses.length
        });
        
        // Create recent activity from orders
        const activity = orders.slice(0, 3).map(order => ({
          action: "Placed an order",
          details: `#${order._id.slice(-8).toUpperCase()}`,
          time: new Date(order.createdAt).toLocaleDateString(),
          link: "/account/orders",
          icon: "📦",
          orderData: order
        }));
        
        setRecentActivity(activity);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Keep default values (zeros) on error
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, get]);
  const quickActions = [
      { to: "/products", text: "Continue Shopping", icon: "🛒", style: "bg-green-600 text-white hover:bg-green-700" },
      { to: "/account/profile", text: "Update Profile", icon: "👤", style: "bg-slate-800 text-white hover:bg-black" },
      { to: "/track-order", text: "Track Recent Order", icon: "🚚", style: "bg-slate-200 text-slate-800 hover:bg-slate-300" },
  ];
  const recentOrder = recentActivity.find(activity => activity.orderData)?.orderData;

  const statsData = [
    { value: stats.totalOrders, label: 'Total Orders', link: '/account/orders', icon: '📦', color: 'bg-blue-100 text-blue-600' },
    { value: stats.wishlistItems, label: 'In Wishlist', link: '/account/wishlist', icon: '❤️', color: 'bg-red-100 text-red-600' },
    { value: stats.savedAddresses, label: 'Saved Addresses', link: '/account/addresses', icon: '🏠', color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <h2 className="text-4xl font-extrabold text-slate-800 mb-2">
            Welcome back, <span className="text-green-600">{user?.name || 'User'}</span>!
        </h2>
        <p className="text-lg text-slate-600">Here's a quick overview of your account and recent activity.</p>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map(stat => (
          <Link to={stat.link} key={stat.label} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4">
            <div className={`p-4 rounded-full ${stat.color}`}>
                <span className="text-3xl">{stat.icon}</span>
            </div>
            <div>
                <p className="text-4xl font-extrabold text-slate-800">{stat.value}</p>
                <p className="text-slate-600 font-semibold">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-md">
           <h3 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h3>
           <div className="flex flex-col space-y-4">
             {quickActions.map(action => {
                if (action.to === '/track-order' && recentOrder) {
                    return (
                        <Link key={action.text} to={action.to} state={{ order: recentOrder }} className={`flex items-center justify-center font-semibold py-3 px-5 rounded-lg transition-colors text-center ${action.style}`}>
                            <span className="mr-2 text-xl">{action.icon}</span>
                            {action.text}
                        </Link>
                    )
                }
                return (
                    <Link key={action.text} to={action.to} className={`flex items-center justify-center font-semibold py-3 px-5 rounded-lg transition-colors text-center ${action.style}`}>
                        <span className="mr-2 text-xl">{action.icon}</span>
                        {action.text}
                    </Link>
                );
             })}
           </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Recent Activity</h3>
            {recentActivity.length > 0 ? (
              <ul className="space-y-4">
                  {recentActivity.map((activity, index) => (
                      <li key={index} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                          <div className="p-3 bg-white rounded-full shadow-sm">
                              <span className="text-2xl">{activity.icon}</span>
                          </div>
                          <div className="flex-grow">
                              <p className="font-semibold text-slate-700">{activity.action}</p>
                              <p className="text-sm text-slate-500">{activity.details}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-sm text-slate-500">{activity.time}</p>
                               <Link to={activity.link} state={activity.orderData ? { order: activity.orderData } : {}} className="text-sm font-semibold text-green-600 hover:underline">View</Link>
                          </div>
                      </li>
                  ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">No recent activity yet.</p>
                <Link to="/products" className="text-green-600 hover:underline font-semibold">Start shopping!</Link>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcome; 