import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const InvoicePage = () => {
  const location = useLocation();
  const { order } = location.state || {};

  if (!order) {
    // If no order data is passed, redirect to order history or show an error
    return <Navigate to="/account/orders" />;
  }
  
  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = order.total - subtotal;

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 print:hidden">
            <Link to="/account/orders" className="text-slate-600 hover:text-slate-900 font-semibold">
                &larr; Back to Order History
            </Link>
            <button 
                onClick={() => window.print()}
                className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
                Print Invoice
            </button>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg" id="invoice-content">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-800">GrocerryPoint</h1>
                    <p className="text-slate-500">123 Fresh Avenue, Farmville</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-slate-700">INVOICE</h2>
                    <p className="text-slate-500">#<span className="font-semibold">{order.id}</span></p>
                </div>
            </div>

            {/* Billing Info */}
            <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                    <h3 className="font-bold text-slate-600 mb-2">Billed To:</h3>
                    <p className="font-semibold text-slate-800">{order.shippingAddress.split(',')[0]}</p>
                    <p className="text-slate-600">{order.shippingAddress}</p>
                </div>
                <div className="text-right">
                    <p className="text-slate-500"><strong>Invoice Date:</strong> {order.date}</p>
                    <p className="text-slate-500"><strong>Order Status:</strong> {order.status}</p>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left mb-10">
                <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase text-sm">
                        <th className="p-4">Item</th>
                        <th className="p-4 text-center">Qty</th>
                        <th className="p-4 text-right">Price</th>
                        <th className="p-4 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map(item => (
                        <tr key={item.id} className="border-b">
                            <td className="p-4 font-semibold text-slate-800">{item.name}</td>
                            <td className="p-4 text-center text-slate-600">{item.quantity}</td>
                            <td className="p-4 text-right text-slate-600">₹{item.price.toFixed(2)}</td>
                            <td className="p-4 text-right font-semibold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-3">
                     <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-slate-600">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl text-slate-800 border-t pt-3">
                        <span>Grand Total</span>
                        <span>₹{order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-slate-500 text-sm mt-12 border-t pt-6">
                <p>Thank you for your business!</p>
                <p>GrocerryPoint | contact@grocerrypoint.com</p>
            </div>
        </div>
      </div>
       <style jsx global>{`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print\\:hidden {
              display: none;
            }
            #invoice-content {
              box-shadow: none;
              border-radius: 0;
              padding: 0;
            }
          }
      `}</style>
    </div>
  );
};

export default InvoicePage; 