import React, { useState, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

// Mapping text status to a numerical step for the stepper UI
const statusToStep = {
    'Order Placed': 0,
    'Processing': 1,
    'Shipped': 2,
    'Delivered': 3,
};

const OrderTrackingPage = () => {
    const location = useLocation();
    // Receive the order details from the link state
    const { order: orderDetails } = location.state || {};
    
    const [currentStatus, setCurrentStatus] = useState(0);

    useEffect(() => {
        if (orderDetails && orderDetails.status) {
            // Set the current step of the tracker based on the order's status
            setCurrentStatus(statusToStep[orderDetails.status] || 0);
        }
    }, [orderDetails]);
    
    // If no order details are passed, redirect to the main account page
    if (!orderDetails) {
        return <Navigate to="/account/orders" />;
    }

    const trackingSteps = [
        { status: 'Order Placed', time: orderDetails.date, icon: '📝' },
        { status: 'Processing', time: 'In Progress', icon: '⚙️' },
        { status: 'Shipped', time: 'In Progress', icon: '🚚' },
        { status: 'Delivered', time: 'Pending', icon: '🏠' },
    ];

    const getStatusClass = (index) => {
        if (index < currentStatus) return 'completed';
        if (index === currentStatus) return 'active';
        return 'pending';
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800">Track Your Order</h1>
                            <p className="text-slate-600">Order ID: <span className="font-semibold text-green-600">{orderDetails.id}</span></p>
                        </div>
                        <div className="text-left sm:text-right mt-4 sm:mt-0">
                            <p className="text-slate-600">Estimated Delivery</p>
                            <p className="text-xl font-bold text-slate-800">{orderDetails.estimatedDelivery}</p>
                        </div>
                    </div>
                    
                    {/* Stepper */}
                    <div className="flex flex-col sm:flex-row justify-between">
                        {trackingSteps.map((step, index) => (
                            <React.Fragment key={index}>
                                <div className="flex items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300
                                        ${getStatusClass(index) === 'completed' ? 'bg-green-600 text-white' : ''}
                                        ${getStatusClass(index) === 'active' ? 'bg-green-600 text-white ring-4 ring-green-200' : ''}
                                        ${getStatusClass(index) === 'pending' ? 'bg-slate-200 text-slate-500' : ''}
                                    `}>
                                        {getStatusClass(index) === 'completed' ? '✓' : step.icon}
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="font-bold text-slate-800">{step.status}</h2>
                                        <p className="text-sm text-slate-500">{getStatusClass(index) === 'completed' || getStatusClass(index) === 'active' ? step.time : 'Pending'}</p>
                                    </div>
                                </div>
                                {index < trackingSteps.length - 1 && (
                                     <div className={`h-1 sm:h-auto sm:w-full flex-1 mx-4 my-6 sm:my-auto border-t-2 sm:border-t-4 transition-colors duration-300
                                        ${getStatusClass(index) === 'completed' ? 'border-green-600' : 'border-slate-200 border-dashed'}`
                                     }></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Order Details & Address */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-800 border-b pb-4 mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            {orderDetails.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-700">{item.name}</p>
                                        <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-slate-800">₹{item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 mt-6 space-y-2">
                            <div className="flex justify-between font-semibold">
                                <span className="text-slate-600">Subtotal</span>
                                <span className="text-slate-800">₹{orderDetails.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span className="text-slate-600">Delivery</span>
                                <span className="text-slate-800">₹5.00</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl">
                                <span className="text-slate-800">Total</span>
                                <span className="text-green-600">₹{(orderDetails.total + 5).toFixed(2)}</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800 border-b pb-4 mb-6 mt-10">Shipping Address</h2>
                        <p className="text-slate-600 leading-relaxed">{orderDetails.shippingAddress}</p>
                    </div>

                    {/* Right: Map & Support */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                           <h2 className="text-2xl font-bold text-slate-800 mb-4">Live Location</h2>
                            <div className="aspect-w-16 aspect-h-9 bg-slate-200 rounded-lg overflow-hidden">
                                <img src="https://i.imgur.com/gK2x3cM.png" alt="Map of delivery route" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Need Help?</h2>
                            <p className="text-slate-600 mb-4">If you have any issues with your order, please contact us.</p>
                             <Link to="/contact" className="w-full inline-block bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-black transition-colors">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingPage; 