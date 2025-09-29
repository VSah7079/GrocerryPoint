import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Package, Menu, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, emoji: '📊' },
  { to: '/admin/products', label: 'Products', icon: <Package size={20} />, emoji: '🥬' },
  { to: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={20} />, emoji: '🛍️' },
  { to: '/admin/customers', label: 'Customers', icon: <Users size={20} />, emoji: '👥' },
  { to: '/admin/settings', label: 'Settings', icon: <Settings size={20} />, emoji: '⚙️' },
];

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    // Handle responsive behavior
    useEffect(() => {
        const checkScreenSize = () => {
            const isLarge = window.innerWidth >= 1024;
            setIsLargeScreen(isLarge);
            if (isLarge) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

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
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Overlay */}
            {sidebarOpen && !isLargeScreen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>
            )}
            
            {/* Responsive Green Sidebar */}
            <div className={`fixed lg:relative inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-80' : isLargeScreen ? 'w-20' : 'w-0'} bg-gradient-to-b from-emerald-800 via-emerald-900 to-green-900 shadow-2xl flex flex-col overflow-hidden`}>
                {/* Green Sidebar Header */}
                <div className="relative flex items-center justify-between p-6 border-b border-emerald-700/50 bg-gradient-to-r from-green-600 to-emerald-600">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                            <span className="text-2xl">🛒</span>
                        </div>
                        {(sidebarOpen || isLargeScreen) && (
                            <div className="text-white">
                                <h1 className="text-xl font-bold tracking-tight">
                                    GrocerryPoint
                                </h1>
                                <p className="text-sm text-green-100 font-medium">Admin Dashboard</p>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className="ml-2 p-2.5 rounded-xl hover:bg-white/10 focus:outline-none transition-all duration-200 text-white hover:text-green-100 lg:block"
                    >
                        <Menu size={20} />
                    </button>
                </div>
                {/* Green Navigation Menu */}
                <nav className="flex-grow pt-8 px-4">
                    {(sidebarOpen || isLargeScreen) && (
                        <div className="mb-6">
                            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider px-4">Main Menu</p>
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`group relative flex items-center gap-4 py-4 px-4 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5
                                    ${location.pathname.startsWith(link.to) 
                                        ? 'bg-gradient-to-r from-green-400/20 to-emerald-400/20 text-green-200 shadow-xl border-l-4 border-green-400' 
                                        : 'hover:bg-emerald-700/30 text-emerald-100 hover:text-green-200'
                                    }`}
                            >
                                <div className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 flex-shrink-0
                                    ${location.pathname.startsWith(link.to) 
                                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg' 
                                        : 'bg-emerald-800/50 group-hover:bg-emerald-700/50 text-emerald-200 group-hover:text-green-200'
                                    }`}>
                                    {(sidebarOpen && isLargeScreen) || (!isLargeScreen && sidebarOpen) ? (
                                        <span className="text-xl">{link.emoji}</span>
                                    ) : (
                                        <span className={location.pathname.startsWith(link.to) ? 'text-white' : 'text-emerald-200 group-hover:text-green-200'}>{link.icon}</span>
                                    )}
                                </div>
                                
                                {((sidebarOpen && isLargeScreen) || (!isLargeScreen && sidebarOpen)) && (
                                    <div className="flex-1 min-w-0">
                                        <span className="font-semibold text-base truncate block">{link.label}</span>
                                        {location.pathname.startsWith(link.to) && (
                                            <div className="flex items-center mt-1">
                                                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse mr-2"></div>
                                                <span className="text-xs text-green-200">Active</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Active Indicator */}
                                {location.pathname.startsWith(link.to) && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                        <div className="w-1 h-8 bg-green-300 rounded-full"></div>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                    
                    {/* Green Quick Stats Card */}
                    {(sidebarOpen || window.innerWidth >= 1024) && (
                        <div className="mt-8 p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-emerald-600/20">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                    <span className="text-white text-xl">📊</span>
                                </div>
                                <h4 className="text-sm font-bold text-green-200 mb-1">Store Analytics</h4>
                                <p className="text-xs text-emerald-300 leading-relaxed">Fresh products & happy customers</p>
                                <div className="flex justify-center mt-3">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-medium text-green-300">Live Data</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
                {/* Green User Profile Section */}
                <div className="p-4 border-t border-emerald-700/50 bg-gradient-to-r from-emerald-800/50 to-green-800/50">
                    {sidebarOpen && (
                        <div className="mb-4 p-4 bg-emerald-700/30 rounded-2xl border border-emerald-600/30">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg border-2 border-green-300/50">
                                        <span className="text-white font-bold text-xl">
                                            {user?.name?.charAt(0) || 'A'}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-emerald-900 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-green-200 text-base truncate">{user?.name || 'Admin User'}</h3>
                                    <p className="text-sm text-emerald-300 font-medium flex items-center gap-1">
                                        <span>👑</span> Store Manager
                                    </p>
                                    <p className="text-xs text-emerald-400">Online now</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <button 
                        onClick={() => {
                            navigate('/admin/login');
                        }} 
                        className="group w-full flex items-center gap-3 py-4 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                    >
                        <div className="w-10 h-10 bg-red-500/30 rounded-xl flex items-center justify-center group-hover:bg-red-400/30 transition-all duration-300">
                            <LogOut size={18} />
                        </div>
                        {sidebarOpen && (
                            <>
                                <span className="flex-1 text-left">Sign Out</span>
                                <div className="w-2 h-2 bg-red-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Responsive Main Content Area */}
            <div className={`flex-1 flex flex-col overflow-hidden bg-gray-50 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}`}>
                {/* Responsive Green Top Bar */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Mobile Menu Button */}
                            <button 
                                onClick={() => setSidebarOpen(!sidebarOpen)} 
                                className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <Menu size={20} className="text-gray-600" />
                            </button>
                            
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-lg">🏪</span>
                                </div>
                                <div>
                                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                                    <p className="text-sm text-gray-600 hidden sm:block">Manage your grocery store operations</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                            {/* Store Status */}
                            <div className="flex items-center space-x-4">
                                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm">
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                    Store Online
                                </div>
                                
                                {/* Notifications */}
                                <button className="relative p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 group">
                                    <Bell size={20} className="text-gray-600 group-hover:text-gray-800" />
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">3</span>
                                    </div>
                                </button>
                            </div>
                            
                            {/* Date & Time */}
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-800">
                                    {new Date().toLocaleDateString('en-IN', { 
                                        weekday: 'short',
                                        month: 'short', 
                                        day: 'numeric' 
                                    })}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {new Date().toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-8 py-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout; 