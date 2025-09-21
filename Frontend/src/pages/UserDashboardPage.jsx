import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
    { to: "/account", text: "Dashboard", icon: "📊" },
    { to: "/account/orders", text: "Order History", icon: "📦" },
    { to: "/account/profile", text: "Profile Settings", icon: "👤" },
    { to: "/account/addresses", text: "Saved Addresses", icon: "🏠" },
    { to: "/account/wishlist", text: "Wishlist", icon: "❤️" },
];

const UserDashboardPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();

    useEffect(() => {
        // Check if user is authenticated
        if (!loading && !user) {
            navigate('/login');
        } else if (user) {
            // Fetch fresh user data
            const fetchUserData = async () => {
                try {
                    const response = await fetch('http://localhost:8080/api/users/me', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const data = await response.json();
                    if (data.success) {
                        login(data.user, localStorage.getItem('token'));
                    }
                } catch (err) {
                    console.error('Error fetching user data:', err);
                }
            };
            fetchUserData();
        }
    }, [user, loading, navigate]);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg h-full">
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-green-200 bg-green-600 text-white flex items-center justify-center text-3xl font-bold">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">{user.name || 'User'}</h2>
                                <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                            <nav className="flex flex-col space-y-2">
                                {navLinks.map(link => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        end={link.to === "/account"}
                                        className={({ isActive }) =>
                                            `flex items-center p-4 rounded-lg font-semibold transition-all duration-200 ${
                                            isActive
                                                ? 'bg-green-600 text-white shadow-md'
                                                : 'hover:bg-green-100 hover:text-green-800'
                                            }`
                                        }
                                    >
                                        <span className="mr-3 text-xl">{link.icon}</span>
                                        {link.text}
                                    </NavLink>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center p-4 mt-4 rounded-lg font-semibold text-red-600 hover:bg-red-100 transition-all duration-200"
                                >
                                    <span className="mr-3 text-xl">🚪</span>
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white p-8 rounded-xl shadow-lg min-h-[400px]">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage; 