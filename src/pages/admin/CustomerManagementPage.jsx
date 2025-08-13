import React, { useState, useMemo } from 'react';
import { Search, MoreVertical, UserPlus, UserX, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const initialCustomers = [
  {
    id: 1,
    name: 'Alex Fresh',
    email: 'alex.fresh@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    joined: '2024-05-10',
    orders: 12,
    totalSpent: 1234.50,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Samantha Green',
    email: 's.green@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    joined: '2024-04-22',
    orders: 5,
    totalSpent: 678.00,
    status: 'Active',
  },
  {
    id: 3,
    name: 'John Doe',
    email: 'johndoe@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    joined: '2024-03-15',
    orders: 2,
    totalSpent: 150.25,
    status: 'Suspended',
  },
   {
    id: 4,
    name: 'Jane Smith',
    email: 'jane.s@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
    joined: '2024-06-01',
    orders: 8,
    totalSpent: 980.00,
    status: 'Active',
  },
];

const statusClasses = {
    Active: 'bg-green-100 text-green-800',
    Suspended: 'bg-red-100 text-red-800',
};

const CustomerManagementPage = () => {
    const [customers, setCustomers] = useState(initialCustomers);
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

    const handleStatusToggle = (id) => {
        setCustomers(customers.map(c => 
            c.id === id ? { ...c, status: c.status === 'Active' ? 'Suspended' : 'Active' } : c
        ));
        setOpenDropdown(null); // Close dropdown after action
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

    return (
        <div className="bg-slate-50 p-8 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4 sm:mb-0">Customer Management</h1>
                <button 
                    className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    onClick={() => setShowModal(true)}
                >
                    <UserPlus size={20} className="mr-2"/>
                    Add New Customer
                </button>
            </div>

            {/* Add Customer Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-700" onClick={() => setShowModal(false)}>
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-slate-800">Add New Customer</h2>
                        {formError && <div className="mb-4 text-red-600 text-sm">{formError}</div>}
                        <form onSubmit={handleAddCustomer} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" name="name" value={form.name} onChange={handleFormChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleFormChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input type="tel" name="phone" value={form.phone} onChange={handleFormChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select name="status" value={form.status} onChange={handleFormChange} className="w-full p-3 border border-slate-300 rounded-lg">
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">Add Customer</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-12 border border-slate-300 rounded-lg"
                    />
                </div>
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full sm:w-auto p-3 border border-slate-300 rounded-lg"
                >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                </select>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
                <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-100 text-slate-600 uppercase text-sm">
                            <th className="p-4">Customer</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-center">Orders</th>
                            <th className="p-4 text-right">Total Spent</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map(customer => (
                            <tr key={customer.id} className="border-b hover:bg-slate-50">
                                <td className="p-4 flex items-center">
                                    <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full object-cover mr-4"/>
                                    <span className="font-semibold text-slate-800">{customer.name}</span>
                                </td>
                                <td className="p-4 text-slate-600">{customer.email}</td>
                                <td className="p-4 text-slate-600">{customer.joined}</td>
                                <td className="p-4 text-center text-slate-600">{customer.orders}</td>
                                <td className="p-4 text-right font-semibold text-green-600">₹{customer.totalSpent.toFixed(2)}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[customer.status]}`}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td className="p-4 text-center relative">
                                    <button 
                                        onClick={() => setOpenDropdown(openDropdown === customer.id ? null : customer.id)}
                                        className="p-2 text-slate-500 hover:text-slate-700 rounded-full transition-colors"
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    {openDropdown === customer.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border">
                                            <Link 
                                              to={`/admin/customers/${customer.id}`} 
                                              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                              onClick={() => setOpenDropdown(null)}
                                            >
                                                View Details
                                            </Link>
                                            <button 
                                                onClick={() => handleStatusToggle(customer.id)} 
                                                className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                            >
                                                {customer.status === 'Active' ? 'Suspend' : 'Activate'}
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredCustomers.length === 0 && (
                    <div className="text-center p-8 text-slate-500">
                        <p>No customers found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerManagementPage; 