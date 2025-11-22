import React, { useState } from 'react';
import { Mail, Phone, MapPin, Truck, Shield, Bell } from 'lucide-react';

// Helper components defined outside the main component to prevent re-creation on re-renders.
// This prevents the inputs from losing focus on every keystroke.
const ToggleSwitch = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-slate-600">{label}</span>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                enabled ? 'bg-green-600' : 'bg-slate-300'
            }`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
            }`}/>
        </button>
    </div>
);

const InputField = ({ icon, label, id, value, onChange, type = 'text', placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                {icon}
            </span>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
        </div>
    </div>
);

const SettingsPage = () => {
    // State for all settings, initialized with mock data
    const [settings, setSettings] = useState({
        general: {
            siteName: 'GrocerryPoint',
            contactEmail: 'support@grocerrypoint.com',
            phone: '+91 98765 43210',
            address: '123 Green Valley, Fresh Fields, Meadowville, 45678',
        },
        store: {
            currency: 'INR',
            paymentMethods: {
                cod: true,
                card: false,
                upi: false,
            }
        },
        shipping: {
            standardRate: 50.00,
            expressRate: 100.00,
            freeShippingThreshold: 500.00,
            expressEnabled: true,
        },
        notifications: {
            newOrder: true,
            orderStatusUpdate: true,
            lowStockWarning: true,
        },
        security: {
            twoFactorAuth: false,
        }
    });

    const handleInputChange = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };
    
    const handlePaymentChange = (method, value) => {
        setSettings(prev => ({
            ...prev,
            store: {
                ...prev.store,
                paymentMethods: {
                    ...prev.store.paymentMethods,
                    [method]: value
                }
            }
        }));
    };

    // Quick helper: enable only Cash on Delivery and disable other payment methods
    const handleEnableCODOnly = () => {
        setSettings(prev => ({
            ...prev,
            store: {
                ...prev.store,
                paymentMethods: {
                    cod: true,
                    card: false,
                    upi: false,
                }
            }
        }));
    };

    // Quick helper: enable only payment (COD) and delivery (standard), disable other payment methods and express shipping
    const handleEnablePayAndDeliveryOnly = () => {
        setSettings(prev => ({
            ...prev,
            store: {
                ...prev.store,
                paymentMethods: {
                    cod: true,
                    card: false,
                    upi: false,
                }
            },
            shipping: {
                ...prev.shipping,
                expressEnabled: false,
                expressRate: 0
            }
        }));
    };

    const [isSaving, setIsSaving] = useState(false);
    const handleSaveChanges = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings saved successfully!');
        }, 1500);
    };
    
    return (
        <div className="bg-slate-50 p-8 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4 sm:mb-0">Website Settings</h1>
                <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 disabled:bg-green-400 disabled:scale-100"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1 */}
                <div className="space-y-8">
                    {/* General Settings */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">General</h2>
                        <div className="space-y-4">
                            <InputField 
                                id="siteName"
                                label="Site Name"
                                value={settings.general.siteName}
                                onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                                placeholder="Your store's name"
                                icon={<Mail size={16}/>}
                            />
                            <InputField 
                                id="contactEmail"
                                label="Contact Email"
                                type="email"
                                value={settings.general.contactEmail}
                                onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                                placeholder="support@example.com"
                                icon={<Mail size={16}/>}
                            />
                             <InputField 
                                id="phone"
                                label="Support Phone"
                                type="tel"
                                value={settings.general.phone}
                                onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                                placeholder="+1 234 567 890"
                                icon={<Phone size={16}/>}
                            />
                            <InputField 
                                id="address"
                                label="Store Address"
                                value={settings.general.address}
                                onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                                placeholder="123 Main St, City, Country"
                                icon={<MapPin size={16}/>}
                            />
                        </div>
                    </div>
                    
                    {/* Shipping Settings */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Shipping</h2>
                         <div className="space-y-4">
                            <InputField 
                                id="standardRate"
                                label="Standard Rate (₹)"
                                type="number"
                                value={settings.shipping.standardRate}
                                onChange={(e) => handleInputChange('shipping', 'standardRate', parseFloat(e.target.value) || 0)}
                                icon={<Truck size={16}/>}
                            />
                             <InputField 
                                id="expressRate"
                                label="Express Rate (₹)"
                                type="number"
                                value={settings.shipping.expressRate}
                                onChange={(e) => handleInputChange('shipping', 'expressRate', parseFloat(e.target.value) || 0)}
                                icon={<Truck size={16}/>}
                            />
                             <InputField 
                                id="freeShippingThreshold"
                                label="Free Shipping Above (₹)"
                                type="number"
                                value={settings.shipping.freeShippingThreshold}
                                onChange={(e) => handleInputChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value) || 0)}
                                icon={<Truck size={16}/>}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Column 2 */}
                <div className="space-y-8">
                     {/* Store Settings */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Store</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                                <select 
                                    id="currency" 
                                    value={settings.store.currency}
                                    onChange={(e) => handleInputChange('store', 'currency', e.target.value)}
                                    className="w-full p-3 border border-slate-300 rounded-lg bg-white"
                                >
                                    <option value="INR">Indian Rupee (₹)</option>
                                    <option value="USD">US Dollar ($)</option>
                                    <option value="EUR">Euro (€)</option>
                                </select>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-sm text-slate-600">Quick action:</p>
                                <button
                                    type="button"
                                    onClick={handleEnableCODOnly}
                                    className="text-sm px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-md hover:bg-amber-100"
                                >
                                    Enable COD only
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Accepted Payment Methods</label>
                                <div className="divide-y divide-slate-200">
                                    <ToggleSwitch label="Cash on Delivery (COD)" enabled={settings.store.paymentMethods.cod} onChange={(val) => handlePaymentChange('cod', val)} />
                                    <ToggleSwitch label="Credit/Debit Card" enabled={settings.store.paymentMethods.card} onChange={(val) => handlePaymentChange('card', val)} />
                                    <ToggleSwitch label="UPI" enabled={settings.store.paymentMethods.upi} onChange={(val) => handlePaymentChange('upi', val)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Notification & Security */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Notifications & Security</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-slate-700 mb-1 flex items-center"><Bell size={18} className="mr-2"/>Email Notifications</h3>
                                <div className="divide-y divide-slate-200">
                                     <ToggleSwitch label="New Order Alert" enabled={settings.notifications.newOrder} onChange={(val) => handleInputChange('notifications', 'newOrder', val)} />
                                     <ToggleSwitch label="Order Status Updates" enabled={settings.notifications.orderStatusUpdate} onChange={(val) => handleInputChange('notifications', 'orderStatusUpdate', val)} />
                                     <ToggleSwitch label="Low Stock Warnings" enabled={settings.notifications.lowStockWarning} onChange={(val) => handleInputChange('notifications', 'lowStockWarning', val)} />
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold text-slate-700 mb-1 flex items-center"><Shield size={18} className="mr-2"/>Account Security</h3>
                                <div className="divide-y divide-slate-200">
                                    <ToggleSwitch label="Enable Two-Factor Authentication" enabled={settings.security.twoFactorAuth} onChange={(val) => handleInputChange('security', 'twoFactorAuth', val)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage; 