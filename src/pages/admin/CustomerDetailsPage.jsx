import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';

// Mock data - in a real app, you'd fetch this based on the ID
const mockCustomers = {
  '1': {
    id: 1,
    name: 'Alex Fresh',
    email: 'alex.fresh@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    joined: '2024-05-10',
    orders: 12,
    totalSpent: 1234.50,
    status: 'Active',
    address: '123 Green Valley, Fresh Fields, Meadowville, 45678',
    phone: '+91 98765 43210',
    orderHistory: [
      { id: 'GROCERY12345', date: '2024-06-25', total: 325.00, status: 'Delivered' },
      { id: 'GROCERY12301', date: '2024-06-15', total: 150.75, status: 'Delivered' },
    ]
  },
  // Add other customers here if needed
  '2': {
    id: 2,
    name: 'Samantha Green',
    email: 's.green@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    joined: '2024-04-22',
    orders: 5,
    totalSpent: 678.00,
    status: 'Active',
    address: '456 Garden Lane, Bloom City, 54321',
    phone: '+91 98765 43212',
    orderHistory: [
       { id: 'GROCERY12344', date: '2024-06-26', total: 150.50, status: 'Processing' },
    ]
  },
   '3': {
    id: 3,
    name: 'John Doe',
    email: 'johndoe@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    joined: '2024-03-15',
    orders: 2,
    totalSpent: 150.25,
    status: 'Suspended',
    address: '789 Concrete Blvd, Metro City, 67890',
    phone: '+91 98765 43213',
    orderHistory: [
        { id: 'GROCERY12343', date: '2024-06-26', total: 89.00, status: 'Shipped' },
        { id: 'GROCERY12200', date: '2024-02-10', total: 61.25, status: 'Cancelled' },
    ]
  },
   '4': {
    id: 4,
    name: 'Jane Smith',
    email: 'jane.s@example.com',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
    joined: '2024-06-01',
    orders: 8,
    totalSpent: 980.00,
    status: 'Active',
    address: '101 Sky High Apts, Cloud City, 11223',
    phone: '+91 98765 43214',
    orderHistory: [
         { id: 'GROCERY12342', date: '2024-06-24', total: 512.20, status: 'Delivered' },
    ]
  }
};

const statusClasses = {
    Delivered: 'bg-green-100 text-green-800',
    Processing: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Cancelled: 'bg-red-100 text-red-800',
};

const CustomerDetailsPage = () => {
    const { customerId } = useParams();
    const customer = mockCustomers[customerId];

    if (!customer) {
        return (
            <div className="bg-slate-50 p-8 min-h-screen text-center">
                <h1 className="text-2xl font-bold text-red-600">Customer not found</h1>
                <Link to="/admin/customers" className="mt-4 inline-block text-blue-600 hover:underline">
                    &larr; Back to Customer List
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 p-8 min-h-screen">
            <div className="mb-8">
                <Link to="/admin/customers" className="flex items-center text-slate-600 hover:text-slate-900 font-semibold transition-colors">
                    <ArrowLeft size={20} className="mr-2"/>
                    Back to Customer List
                </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Customer Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                        <img src={customer.avatar} alt={customer.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-green-200" />
                        <h1 className="text-3xl font-extrabold text-slate-800">{customer.name}</h1>
                        <p className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {customer.status}
                        </p>
                        <div className="text-left mt-6 space-y-3 text-slate-600">
                            <p className="flex items-center"><Mail size={16} className="mr-3 text-slate-400"/>{customer.email}</p>
                            <p className="flex items-center"><Phone size={16} className="mr-3 text-slate-400"/>{customer.phone}</p>
                            <p className="flex items-center"><MapPin size={16} className="mr-3 text-slate-400"/>{customer.address}</p>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
                        <h3 className="font-bold text-slate-800 mb-4 text-xl">Customer Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between"><span className="font-semibold text-slate-600">Joined Date:</span><span>{customer.joined}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-slate-600">Total Orders:</span><span>{customer.orders}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-slate-600">Total Spent:</span><span className="font-bold text-green-600">₹{customer.totalSpent.toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order History */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                         <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center"><ShoppingBag size={24} className="mr-3 text-slate-500"/>Order History</h2>
                         <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-600 uppercase text-sm">
                                        <th className="p-4">Order ID</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4 text-right">Total</th>
                                        <th className="p-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customer.orderHistory.map(order => (
                                        <tr key={order.id} className="border-b hover:bg-slate-50">
                                            <td className="p-4 font-semibold text-blue-600">{order.id}</td>
                                            <td className="p-4 text-slate-600">{order.date}</td>
                                            <td className="p-4 text-right font-semibold text-slate-800">₹{order.total.toFixed(2)}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsPage; 