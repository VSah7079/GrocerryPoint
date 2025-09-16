import React, { useState, useMemo, useEffect } from 'react';
import { Search, MoreVertical, UserPlus, UserX, X } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            try {
                const response = await fetch('/api/admin/customers', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                
                if (data.customers) {
                    // Transform API data to frontend format
                    const transformedCustomers = data.customers.map(customer => ({
                        id: customer._id,
                        name: customer.name,
                        email: customer.email,
                        avatar: `https://i.pravatar.cc/150?u=${customer.email}`,
                        joined: new Date(customer.createdAt).toISOString().split('T')[0],
                        orders: 0, // This would need to be calculated from orders
                        totalSpent: 0, // This would need to be calculated from orders
                        status: 'Active'
                    }));
                    setCustomers(transformedCustomers);
                }
            } catch (err) {
                setError('Failed to load customers');
                console.error('Error fetching customers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const handleStatusToggle = (id) => {
        setCustomers(customers.map(c => 
            c.id === id ? { ...c, status: c.status === 'Active' ? 'Suspended' : 'Active' } : c
        ));
        setOpenDropdown(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleAddCustomer = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
            setFormError('All fields are required.');
            return;
        }
        const newCustomer = {
            id: customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1,
            name: form.name,
            email: form.email,
            avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(form.email)}`,
            joined: new Date().toISOString().slice(0, 10),
            orders: 0,
            totalSpent: 0,
            status: form.status,
        };
        setCustomers([newCustomer, ...customers]);
        setShowModal(false);
        setForm({ name: '', email: '', phone: '', status: 'Active' });
        setFormError('');
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
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
                    <p className="text-gray-600">Manage customers and their accounts</p>
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
                                    <td className="py-4 px-6 text-gray-700">{customer.joined}</td>
                                    <td className="py-4 px-6 text-gray-700">{customer.orders}</td>
                                    <td className="py-4 px-6 text-gray-700">₹{customer.totalSpent.toFixed(2)}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[customer.status]}`}>
                                            {customer.status}
                                        </span>
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