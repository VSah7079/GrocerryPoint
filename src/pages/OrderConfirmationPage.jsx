import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderConfirmationPage = () => {
    const location = useLocation();
    const orderDetails = location.state?.orderDetails;

    if (!orderDetails) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold text-gray-800">No Order Details Found</h1>
                <p className="text-lg text-gray-600 my-4">Please complete the checkout process to see your order confirmation.</p>
                <Link to="/products" className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-all duration-300">
                    Continue Shopping
                </Link>
            </div>
        );
    }
    
    const { items, grandTotal, deliveryTime, paymentMethod, shippingAddress } = orderDetails;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <span className="text-5xl text-green-600">✓</span>
                            </div>
                            <div className="absolute top-0 -right-4 w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center animate-bounce">
                                <span className="text-xl">🎉</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mt-6">Thank You!</h1>
                        <p className="text-lg text-gray-600 mt-2">Your order has been placed successfully.</p>
                        <p className="text-gray-800 mt-2">Order ID: <span className="font-semibold text-green-600">#{Math.floor(Math.random() * 900000) + 100000}</span></p>
                    </div>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-lg p-6 my-8 text-left">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping & Payment */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700">Shipping Address</h3>
                                    <p className="text-gray-600">{shippingAddress.name}, {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Delivery Slot</h3>
                                    <p className="text-gray-600">{deliveryTime}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Payment Method</h3>
                                    <p className="text-gray-600">{paymentMethod}</p>
                                </div>
                            </div>
                            {/* Items & Total */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700">Items Ordered ({items.length})</h3>
                                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 mt-2">
                                        {items.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span>{item.name} x {item.quantity}</span>
                                                <span className="font-medium">₹{((item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price) * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-bold text-xl text-gray-800">
                                        <span>Grand Total</span>
                                        <span>₹{grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-10">
                        <p className="text-gray-600 mb-6">You will receive an email confirmation with tracking details shortly.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/account/orders" className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-all duration-300">
                                Track Your Order
                            </Link>
                            <Link to="/" className="w-full sm:w-auto text-green-600 font-bold py-3 px-8 rounded-full border-2 border-green-600 hover:bg-green-50 transition-all duration-300">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage; 