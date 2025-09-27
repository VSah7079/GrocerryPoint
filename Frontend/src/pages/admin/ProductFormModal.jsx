import React, { useState, useEffect } from 'react';
import { CategoryAPI } from '../../services/realApi';

const ProductFormModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    unit: 'piece',
    isFeatured: false,
    discount: 0,
    tags: []
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const response = await CategoryAPI.getAllCategories();
        if (response.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories
        setCategories([
          { _id: 'fruits', name: 'Fruits' },
          { _id: 'vegetables', name: 'Vegetables' },
          { _id: 'dairy', name: 'Dairy' },
          { _id: 'grains', name: 'Grains' },
          { _id: 'beverages', name: 'Beverages' }
        ]);
      }
    };
    
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: typeof product.category === 'object' ? product.category._id : product.category || '',
        price: product.price || '',
        stock: product.stock || 100,
        image: product.image || '',
        description: product.description || '',
        unit: product.unit || 'piece',
        isFeatured: product.isFeatured || false,
        discount: product.discount || 0,
        tags: product.tags || []
      });
    } else {
      // Reset for "Add New"
      setFormData({ 
        name: '', 
        category: categories[0]?._id || '', 
        price: '', 
        stock: '', 
        image: '', 
        description: '',
        unit: 'piece',
        isFeatured: false,
        discount: 0,
        tags: []
      });
    }
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data for API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discount: parseFloat(formData.discount)
      };
      
      // If editing existing product, include the ID
      if (product && product._id) {
        productData._id = product._id;
      }
      
      // Call the parent's save function
      await onSave(productData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
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
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-semibold text-slate-700 mb-1">Stock Quantity</label>
              <input name="stock" id="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock Quantity" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="unit" className="block text-sm font-semibold text-slate-700 mb-1">Unit</label>
              <select name="unit" id="unit" value={formData.unit} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="piece">Piece</option>
                <option value="kg">Kilogram</option>
                <option value="g">Gram</option>
                <option value="l">Liter</option>
                <option value="ml">Milliliter</option>
                <option value="pack">Pack</option>
              </select>
            </div>
            <div>
              <label htmlFor="discount" className="block text-sm font-semibold text-slate-700 mb-1">Discount (%)</label>
              <input name="discount" id="discount" type="number" min="0" max="100" value={formData.discount} onChange={handleChange} placeholder="0" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                name="isFeatured" 
                id="isFeatured" 
                checked={formData.isFeatured} 
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-300 rounded"
              />
              <label htmlFor="isFeatured" className="ml-2 text-sm font-semibold text-slate-700">
                Featured Product
              </label>
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
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              className="px-6 py-2 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal; 