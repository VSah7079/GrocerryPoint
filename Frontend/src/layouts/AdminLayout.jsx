import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Package, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, emoji: '📊', color: 'bg-blue-500' },
  { to: '/admin/products', label: 'Fresh Products', icon: <Package size={20} />, emoji: '🥬', color: 'bg-green-500' },
  { to: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={20} />, emoji: '🛍️', color: 'bg-orange-500' },
  { to: '/admin/customers', label: 'Customers', icon: <Users size={20} />, emoji: '👥', color: 'bg-purple-500' },
  { to: '/admin/settings', label: 'Settings', icon: <Settings size={20} />, emoji: '⚙️', color: 'bg-gray-500' },
];

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        // Check if user is authenticated and is an admin
        if (!user || user.role !== 'admin') {
            navigate('/admin/login');
        }
    }, [user, navigate]);

    // If not authenticated or not admin, don't render the layout
    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-emerald-800 via-emerald-900 to-green-900 text-white flex flex-col shadow-2xl relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-400 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-emerald-400 to-transparent rounded-full"></div>
                </div>
                
                {/* Brand/Logo */}
                <div className="relative flex items-center justify-between p-6 border-b border-emerald-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl">🏪</span>
                        </div>
                        {sidebarOpen && (
                            <div>
                                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">
                                    GrocerryPoint
                                </span>
                                <div className="text-xs text-emerald-300 font-medium">Admin Panel</div>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className="ml-2 p-2 rounded-lg hover:bg-emerald-700/50 focus:outline-none transition-colors duration-200 bg-emerald-800/50"
                    >
                        <Menu size={20} className="text-emerald-200" />
                    </button>
                </div>
                {/* Navigation */}
                <nav className="flex-grow mt-6 px-4 relative">
                    <div className="space-y-2">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`group relative flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105
                                    ${location.pathname.startsWith(link.to) 
                                        ? 'bg-gradient-to-r from-green-400/20 to-emerald-400/20 text-green-200 shadow-lg border-l-4 border-green-400' 
                                        : 'hover:bg-emerald-700/30 hover:text-green-200 text-emerald-100'
                                    }`}
                            >
                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                                    ${location.pathname.startsWith(link.to) 
                                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg' 
                                        : 'bg-emerald-800/50 group-hover:bg-emerald-700/50'
                                    }`}>
                                    {sidebarOpen ? (
                                        <span className="text-lg">{link.emoji}</span>
                                    ) : (
                                        <span className="text-white">{link.icon}</span>
                                    )}
                                </div>
                                {sidebarOpen && (
                                    <div className="flex-1">
                                        <span className="font-semibold text-sm tracking-wide">{link.label}</span>
                                        {location.pathname.startsWith(link.to) && (
                                            <div className="w-2 h-2 bg-green-400 rounded-full absolute right-4 top-1/2 transform -translate-y-1/2 animate-pulse"></div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Hover Effect */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                        ))}
                    </div>
                    
                    {/* Decorative Element */}
                    {sidebarOpen && (
                        <div className="mt-8 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-emerald-600/20">
                            <div className="text-center">
                                <div className="text-2xl mb-2">🌱</div>
                                <div className="text-xs text-emerald-300 font-medium">Fresh & Organic</div>
                                <div className="text-xs text-emerald-400">Quality Groceries</div>
                            </div>
                        </div>
                    )}
                </nav>
                {/* User Profile & Logout */}
                <div className="relative p-6 border-t border-emerald-700/50 bg-gradient-to-r from-emerald-800/50 to-green-800/50">
                    {sidebarOpen && (
                        <div className="flex items-center gap-4 mb-4 p-3 bg-emerald-700/30 rounded-xl border border-emerald-600/30">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg border-2 border-green-300/50">
                                    <span className="text-white font-bold text-lg">
                                        {user?.name?.charAt(0) || 'A'}
                                    </span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-emerald-900 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-green-200 leading-tight">{user?.name || 'Admin'}</div>
                                <div className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                                    <span>👑</span> Store Manager
                                </div>
                            </div>
                        </div>
                    )}
                    <button 
                        onClick={() => {
                            navigate('/admin/login');
                        }} 
                        className="group w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <div className="w-8 h-8 bg-red-500/30 rounded-lg flex items-center justify-center group-hover:bg-red-400/30 transition-colors">
                            <LogOut size={16} />
                        </div>
                        {sidebarOpen && <span>Logout</span>}
                        {sidebarOpen && (
                            <div className="ml-auto">
                                <div className="w-2 h-2 bg-red-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-green-600">🏪</span>
                                GrocerryPoint Admin
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">Manage your fresh grocery store</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Store Online
                            </div>
                            <div className="text-sm text-gray-500">
                                {new Date().toLocaleDateString('en-IN', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout; 