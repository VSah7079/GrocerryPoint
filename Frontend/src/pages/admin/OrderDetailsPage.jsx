import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Truck, XCircle, Package } from 'lucide-react';

// Mock order data
const mockOrders = {
  'GROCERY12345': {
    id: 'GROCERY12345',
    customer: {
      name: 'Alex Fresh',
      email: 'alex.fresh@example.com',
      phone: '+91 98765 43210',
      address: '123 Green Valley, Fresh Fields, Meadowville, 45678',
    },
    date: '2024-06-25',
    status: 'Delivered',
    total: 325.00,
    items: [
      { name: 'Organic Apples', qty: 2, price: 120 },
      { name: 'Fresh Milk', qty: 1, price: 85 },
    ],
  },
  'GROCERY12344': {
    id: 'GROCERY12344',
    customer: {
      name: 'Samantha Green',
      email: 's.green@example.com',
      phone: '+91 98765 43212',
      address: '456 Garden Lane, Bloom City, 54321',
    },
    date: '2024-06-26',
    status: 'Processing',
    total: 150.50,
    items: [
      { name: 'Brown Bread', qty: 1, price: 50 },
      { name: 'Eggs (Dozen)', qty: 1, price: 100.5 },
    ],
  },
  'GROCERY12343': {
    id: 'GROCERY12343',
    customer: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '+91 98765 43213',
      address: '789 Concrete Blvd, Metro City, 67890',
    },
    date: '2024-06-26',
    status: 'Shipped',
    total: 89.00,
    items: [
      { name: 'Rice 5kg', qty: 1, price: 89 },
    ],
  },
  'GROCERY12342': {
    id: 'GROCERY12342',
    customer: {
      name: 'Jane Smith',
      email: 'jane.s@example.com',
      phone: '+91 98765 43214',
      address: '101 Sky High Apts, Cloud City, 11223',
    },
    date: '2024-06-24',
    status: 'Delivered',
    total: 512.20,
    items: [
      { name: 'Olive Oil 1L', qty: 2, price: 256.1 },
    ],
  },
  'GROCERY12341': {
    id: 'GROCERY12341',
    customer: {
      name: 'Peter Jones',
      email: 'peter.jones@example.com',
      phone: '+91 98765 43215',
      address: '202 River Road, Lake Town, 33445',
    },
    date: '2024-06-23',
    status: 'Cancelled',
    total: 45.00,
    items: [
      { name: 'Bananas', qty: 3, price: 45 },
    ],
  },
};

const statusConfig = {
  Delivered: { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={16} /> },
  Processing: { color: 'bg-yellow-100 text-yellow-800', icon: <Package size={16} /> },
  Shipped: { color: 'bg-blue-100 text-blue-800', icon: <Truck size={16} /> },
  Cancelled: { color: 'bg-red-100 text-red-800', icon: <XCircle size={16} /> },
};

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const order = mockOrders[orderId];

  if (!order) {
    return (
      <div className="bg-slate-50 p-8 min-h-screen text-center">
        <h1 className="text-2xl font-bold text-red-600">Order not found</h1>
        <Link to="/admin/orders" className="mt-4 inline-block text-blue-600 hover:underline">&larr; Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-8 min-h-screen">
      <div className="mb-8">
        <Link to="/admin/orders" className="flex items-center text-slate-600 hover:text-slate-900 font-semibold transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Orders
        </Link>
      </div>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Order #{order.id}</h1>
        <div className="flex items-center mb-6">
          <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${statusConfig[order.status].color}`}>
            {statusConfig[order.status].icon}
            {order.status}
          </span>
          <span className="ml-6 text-slate-500">Placed on {order.date}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Customer Info */}
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Customer Info</h2>
            <div className="text-slate-700 space-y-1">
              <div><span className="font-semibold">Name:</span> {order.customer.name}</div>
              <div><span className="font-semibold">Email:</span> {order.customer.email}</div>
              <div><span className="font-semibold">Phone:</span> {order.customer.phone}</div>
              <div><span className="font-semibold">Address:</span> {order.customer.address}</div>
            </div>
          </div>
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Order Summary</h2>
            <div className="text-slate-700 space-y-1">
              <div><span className="font-semibold">Order ID:</span> {order.id}</div>
              <div><span className="font-semibold">Order Date:</span> {order.date}</div>
              <div><span className="font-semibold">Total:</span> <span className="text-green-600 font-bold">₹{order.total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
        {/* Items Table */}
        <div>
          <h2 className="text-xl font-bold text-slate-700 mb-4">Items</h2>
          <table className="w-full text-left mb-4">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase text-sm">
                <th className="p-3">Product</th>
                <th className="p-3">Quantity</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-3 font-semibold text-slate-800">{item.name}</td>
                  <td className="p-3">{item.qty}</td>
                  <td className="p-3 text-right">₹{item.price.toFixed(2)}</td>
                  <td className="p-3 text-right font-semibold">₹{(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right text-lg font-bold text-green-700">
            Grand Total: ₹{order.total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage; 