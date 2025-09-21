import React, { useState, useMemo } from 'react';
import { Search, MoreVertical, Package, CheckCircle, Truck, XCircle } from 'lucide-react';

const mockOrders = [
  {
    id: 'GROCERY12345',
    customer: { name: 'Alex Fresh', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    date: '2024-06-25',
    total: 325.00,
    status: 'Delivered',
  },
  {
    id: 'GROCERY12344',
    customer: { name: 'Samantha Green', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    date: '2024-06-26',
    total: 150.50,
    status: 'Processing',
  },
  {
    id: 'GROCERY12343',
    customer: { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    date: '2024-06-26',
    total: 89.00,
    status: 'Shipped',
  },
  {
    id: 'GROCERY12342',
    customer: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' },
    date: '2024-06-24',
    total: 512.20,
    status: 'Delivered',
  },
   {
    id: 'GROCERY12200',
    customer: { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    date: '2024-02-10',
    total: 61.25,
    status: 'Cancelled',
  },
];

const statusConfig = {
    Processing: { color: 'bg-yellow-100 text-yellow-800', icon: <Package size={14}/>, text: 'Processing' },
    Shipped: { color: 'bg-blue-100 text-blue-800', icon: <Truck size={14}/>, text: 'Shipped' },
    Delivered: { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={14}/>, text: 'Delivered' },
    Cancelled: { color: 'bg-red-100 text-red-800', icon: <XCircle size={14}/>, text: 'Cancelled' },
};

const OrderManagementPage = () => {
    const [orders, setOrders] = useState(mockOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
        setOpenDropdown(null);
    };

    const filteredOrders = useMemo(() => {
        return orders
            .filter(o => filterStatus === 'All' || o.status === filterStatus)
            .filter(o => 
                o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                o.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [orders, searchTerm, filterStatus]);
    
    return (
        <div className="bg-slate-50 p-8 min-h-screen">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-8">Order Management</h1>

            <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row gap-4">
                 <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                    <input 
                        type="text"
                        placeholder="Search by Order ID or Customer..."
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
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-100 text-slate-600 uppercase text-sm">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Total</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="border-b hover:bg-slate-50">
                                <td className="p-4 font-semibold text-blue-600">{order.id}</td>
                                <td className="p-4 flex items-center">
                                    <img src={order.customer.avatar} alt={order.customer.name} className="w-10 h-10 rounded-full object-cover mr-4"/>
                                    <span className="font-semibold text-slate-800">{order.customer.name}</span>
                                </td>
                                <td className="p-4 text-slate-600">{order.date}</td>
                                <td className="p-4 text-right font-semibold text-green-600">₹{order.total.toFixed(2)}</td>
                                <td className="p-4 text-center">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${statusConfig[order.status].color}`}>
                                        {statusConfig[order.status].icon}
                                        {statusConfig[order.status].text}
                                    </span>
                                </td>
                                <td className="p-4 text-center relative">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                                        className="p-2 text-slate-500 hover:text-slate-700 rounded-full transition-colors"
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    {openDropdown === order.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border">
                                            <div className="py-1">
                                                <span className="block px-4 py-2 text-sm text-slate-500">Change Status</span>
                                                {Object.keys(statusConfig).map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusChange(order.id, status)}
                                                        className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredOrders.length === 0 && (
                    <div className="text-center p-8 text-slate-500">
                        <p>No orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderManagementPage; 