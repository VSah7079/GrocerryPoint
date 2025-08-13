import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Package, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/admin/products', label: 'Products', icon: <Package size={20} /> },
  { to: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
  { to: '/admin/customers', label: 'Customers', icon: <Users size={20} /> },
  { to: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
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
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white flex flex-col`}>
                {/* Brand/Logo */}
                <div className="flex items-center justify-between p-5 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <img src="/vite.svg" alt="Logo" className="w-8 h-8" />
                        {sidebarOpen && <span className="text-2xl font-bold tracking-tight">Admin Panel</span>}
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-2 p-2 rounded hover:bg-gray-800 focus:outline-none">
                        <Menu size={22} />
                    </button>
                </div>
                {/* Navigation */}
                <nav className="flex-grow mt-4">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-3 py-2.5 px-4 my-1 rounded-lg transition-colors duration-200 mx-2
                                ${location.pathname.startsWith(link.to) ? 'bg-gray-800 text-green-400 font-semibold' : 'hover:bg-gray-800 hover:text-green-300'}`}
                        >
                            {link.icon}
                            {sidebarOpen && <span>{link.label}</span>}
                        </Link>
                    ))}
                </nav>
                {/* User Profile & Logout */}
                <div className="p-5 border-t border-gray-800 flex flex-col gap-3">
                    {sidebarOpen && (
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full border-2 border-green-400 bg-green-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {user?.name?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <div>
                                <div className="font-bold text-white leading-tight">{user?.name || 'Admin'}</div>
                                <div className="text-xs text-gray-400">Administrator</div>
                            </div>
                        </div>
                    )}
                    <button 
                        onClick={() => {
                            navigate('/admin/login');
                        }} 
                        className="flex items-center gap-2 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                    >
                        <LogOut size={18} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout; 