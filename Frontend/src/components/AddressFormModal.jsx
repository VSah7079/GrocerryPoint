import React, { useState, useEffect } from 'react';

const AddressFormModal = ({ isOpen, onClose, onSave, address }) => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    if (address) {
      setFormData({
        type: address.type || '',
        name: address.name || '',
        address: address.address || '',
        phone: address.phone || '',
      });
    } else {
      // Reset for "Add New"
      setFormData({ type: 'Home', name: '', address: '', phone: '' });
    }
  }, [address, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...address, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in-fast">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-transform duration-300 scale-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{address && address.id ? 'Edit Address' : 'Add New Address'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold text-slate-700">Type (e.g., Home, Work)</label>
            <input type="text" name="type" value={formData.type} onChange={handleChange} required className="w-full p-3 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="font-semibold text-slate-700">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="font-semibold text-slate-700">Full Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" className="w-full p-3 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
          </div>
          <div>
            <label className="font-semibold text-slate-700">Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-3 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">Save Address</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal; 