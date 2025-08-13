import React, { useState, useEffect } from 'react';

const ProductFormModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: '',
  });
  const [categories, setCategories] = useState([
    'Fruits',
    'Vegetables',
    'Dairy & Alternatives',
    'Bakery',
    'Pantry',
  ]);

  useEffect(() => {
    // Fetch categories from backend
    fetch('/api/products/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      });
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price || '',
        stock: product.stock || 100, // Default stock
        image: product.image || '',
        description: product.description || '',
      });
    } else {
      // Reset for "Add New"
      setFormData({ name: '', category: categories[0] || '', price: '', stock: '', image: '', description: '' });
    }
    // eslint-disable-next-line
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...product, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in-fast">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl m-4 transform transition-transform duration-300 scale-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
              <input name="name" id="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-1">Price (₹)</label>
              <input name="price" id="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
              <select name="category" id="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-semibold text-slate-700 mb-1">Stock Quantity</label>
              <input name="stock" id="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock Quantity" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
            {formData.image && (
              <div className="mb-2 flex items-center gap-3">
                <img src={formData.image} alt="Product preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                <span className="text-xs text-slate-500">Current Image</span>
              </div>
            )}
            <input name="image" id="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1">Product Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} placeholder="Product Description" rows="4" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal; 