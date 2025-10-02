import React, { useState, useMemo, useEffect } from 'react';
import { Search, MoreVertical, UserPlus, UserX, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminAPI } from '../../services/api';

const statusClasses = {
    Active: 'bg-green-100 text-green-800',
    Suspended: 'bg-red-100 text-red-800',
};

const CustomerManagementPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'Active',
    });
    const [formError, setFormError] = useState('');

    // Fetch customers from API
    useEffect(() => {
        const fetchCustomers = async () => {
            console.log('🔍 Fetching customers from database...');
            try {
                const response = await AdminAPI.getAllCustomers();
                console.log('📊 Customer API Response:', response);
                
                if (response.success && response.data && response.data.customers) {
                    console.log('✅ Found customers:', response.data.customers.length);
                    // Transform API data to frontend format
                    const transformedCustomers = response.data.customers.map(customer => ({
                        id: customer._id,
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone || 'Not provided',
                        role: customer.role || 'user', // Add role field
                        avatar: `https://i.pravatar.cc/150?u=${customer.email}`,
                        joined: new Date(customer.createdAt).toISOString().split('T')[0],
                        orders: customer.totalOrders || 0,
                        totalSpent: customer.totalSpent || 0,
                        status: customer.isActive ? 'Active' : 'Suspended',
                        verified: customer.isVerified ? 'Verified' : 'Unverified',
                        lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate).toISOString().split('T')[0] : 'No orders yet'
                    }));
                    console.log('🎯 Transformed customers:', transformedCustomers);
                    setCustomers(transformedCustomers);
                } else if (response.success && (!response.data || !response.data.customers)) {
                    console.log('📝 No customers found in database');
                    setError('No customers found in database. Database might be empty.');
                } else {
                    console.error('❌ Invalid response format:', response);
                    setError('Failed to load customers - Invalid response format');
                }
            } catch (err) {
                console.error('❌ Error fetching customers:', err);
                setError('Failed to load customers: ' + (err.message || 'Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const handleStatusToggle = async (id) => {
        try {
            const customer = customers.find(c => c.id === id);
            const newStatus = customer.status === 'Active' ? false : true;
            
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`/api/admin/customers/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isActive: newStatus,
                    reason: 'Status changed by admin'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setCustomers(customers.map(c => 
                    c.id === id ? { ...c, status: newStatus ? 'Active' : 'Suspended' } : c
                ));
                alert(data.message);
            } else {
                alert(data.message || 'Failed to update status');
            }
        } catch (err) {
            console.error('Error toggling status:', err);
            alert('Failed to update customer status');
        }
        setOpenDropdown(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
            setFormError('All fields are required.');
            return;
        }
        
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/customers', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                const newCustomer = {
                    id: data.data._id,
                    name: data.data.name,
                    email: data.data.email,
                    phone: data.data.phone,
                    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(data.data.email)}`,
                    joined: new Date(data.data.createdAt).toISOString().slice(0, 10),
                    orders: 0,
                    totalSpent: 0,
                    status: data.data.isActive ? 'Active' : 'Suspended',
                };
                setCustomers([newCustomer, ...customers]);
                setShowModal(false);
                setForm({ name: '', email: '', phone: '', status: 'Active' });
                setFormError('');
                alert('Customer created successfully!');
            } else {
                setFormError(data.message || 'Failed to create customer');
            }
        } catch (err) {
            console.error('Error creating customer:', err);
            setFormError('Failed to create customer. Please try again.');
        }
    };

    const filteredCustomers = useMemo(() => {
        return customers
            .filter(c => filterStatus === 'All' || c.status === filterStatus)
            .filter(c => 
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [customers, searchTerm, filterStatus]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Debug Section - Remove in production */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800">🐛 Debug Info:</h4>
                <p className="text-sm text-blue-600">
                    Customers loaded: {customers.length} | 
                    Filtered: {filteredCustomers.length} | 
                    Loading: {loading ? 'Yes' : 'No'} | 
                    Error: {error || 'None'}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                    Roles: {customers.map(c => c.role).join(', ') || 'No roles found'}
                </p>
                {customers.length > 0 && (
                    <details className="mt-2">
                        <summary className="text-sm text-blue-700 cursor-pointer">Sample Customer Data (with Role)</summary>
                        <pre className="text-xs bg-blue-100 p-2 mt-1 rounded overflow-auto">
                            {JSON.stringify(customers[0], null, 2)}
                        </pre>
                    </details>
                )}
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
                    <p className="text-gray-600">Manage customers and their accounts ({customers.length} total)</p>
                    <div className="flex gap-3 mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            👤 {customers.filter(c => c.role === 'user').length} Users
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✅ {customers.filter(c => c.status === 'Active').length} Active
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ✅ {customers.filter(c => c.verified === 'Verified').length} Verified
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                    <UserPlus size={20} />
                    Add Customer
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Customer Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Joined</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Orders</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Total Spent</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="border-b hover:bg-gray-50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={customer.avatar}
                                                alt={customer.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{customer.name}</p>
                                                <p className="text-sm text-gray-600">{customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            customer.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                        }`}>
                                            👤 {customer.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-700">{customer.joined}</td>
                                    <td className="py-4 px-6 text-gray-700">{customer.orders}</td>
                                    <td className="py-4 px-6 text-gray-700">₹{customer.totalSpent.toFixed(2)}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[customer.status]}`}>
                                            {customer.status}
                                        </span>
                                        {customer.verified && (
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                                customer.verified === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {customer.verified === 'Verified' ? '✅' : '❌'} {customer.verified}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenDropdown(openDropdown === customer.id ? null : customer.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                            {openDropdown === customer.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                                    <Link
                                                        to={`/admin/customers/${customer.id}`}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setOpenDropdown(null)}
                                                    >
                                                        View Details
                                                    </Link>
                                                    <button
                                                        onClick={() => handleStatusToggle(customer.id)}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        {customer.status === 'Active' ? 'Suspend' : 'Activate'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Customer Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Customer</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddCustomer}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                            {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
                            <div className="flex gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Add Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerManagementPage;