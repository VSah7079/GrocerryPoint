import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Package, Menu, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, emoji: '📊' },
  { to: '/admin/products', label: 'Products', icon: <Package size={20} />, emoji: '🥬' },
  { to: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={20} />, emoji: '🛍️' },
  { to: '/admin/customers', label: 'Customers', icon: <Users size={20} />, emoji: '👥' },
];

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
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
            
            {/* Sidebar - lighter, compact and searchable */}
            <div className={`fixed lg:relative inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-72' : isLargeScreen ? 'w-20' : 'w-0'} bg-white border-r border-gray-100 shadow-sm flex flex-col overflow-hidden`}>
                {/* Sidebar Header */}
                <div className="relative flex items-center justify-between p-4 border-b bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-2xl">🛒</span>
                        </div>
                        {(sidebarOpen || isLargeScreen) && (
                            <div className="text-gray-900">
                                <h1 className="text-lg font-semibold tracking-tight">GrocerryPoint</h1>
                                <p className="text-xs text-gray-500">Admin</p>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className="ml-2 p-2 rounded-md hover:bg-gray-100 focus:outline-none transition-all duration-150 text-gray-600"
                        aria-label="Toggle sidebar"
                    >
                        <Menu size={18} />
                    </button>
                </div>

                {/* Search (shown when expanded) */}
                {sidebarOpen && (
                    <div className="p-3 border-b">
                        <input
                            type="search"
                            placeholder="Search menu..."
                            className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            aria-label="Search sidebar links"
                        />
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="flex-grow pt-4 px-3">
                    <div className="mb-2 px-1">
                        {(sidebarOpen || isLargeScreen) && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">Main</p>}
                    </div>
                    <div className="space-y-1">
                        {navLinks.map((link) => {
                            const active = location.pathname.startsWith(link.to);
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`group flex items-center gap-3 py-3 px-3 rounded-lg transition-colors duration-150 ${active ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                    title={link.label}
                                >
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-md ${active ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                                        {(!sidebarOpen && isLargeScreen) ? link.icon : <span className="text-lg">{link.emoji}</span>}
                                    </div>
                                    {(sidebarOpen || (!isLargeScreen && sidebarOpen)) && (
                                        <div className="flex-1 min-w-0">
                                            <span className={`font-medium text-sm truncate`}>{link.label}</span>
                                            {active && <div className="text-xs text-green-500 mt-1">Active</div>}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* (Removed duplicate Sign Out button - use profile Sign Out below) */}
                </nav>

                {/* Profile & Sign out */}
                <div className="p-3 border-t bg-white">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-lg">{user?.name?.charAt(0) || 'A'}</div>
                        {(sidebarOpen || isLargeScreen) && (
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Admin User'}</h3>
                                <p className="text-xs text-gray-500">Store Manager</p>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => { logout(); navigate('/admin/login'); }}
                        className="w-full flex items-center gap-3 py-2 px-3 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={16} />
                        {(sidebarOpen || isLargeScreen) && <span className="text-sm font-medium">Sign Out</span>}
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