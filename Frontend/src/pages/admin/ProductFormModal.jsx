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
  // Initialize categories with fallback data immediately
  const [categories, setCategories] = useState([
    { _id: 'fruits', name: 'Fruits' },
    { _id: 'vegetables', name: 'Vegetables' },
    { _id: 'dairy', name: 'Dairy' },
    { _id: 'grains', name: 'Grains' },
    { _id: 'beverages', name: 'Beverages' },
    { _id: 'snacks', name: 'Snacks' },
    { _id: 'bakery', name: 'Bakery' },
    { _id: 'meat', name: 'Meat & Seafood' },
    { _id: 'frozen', name: 'Frozen Foods' },
    { _id: 'household', name: 'Household Items' }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to fetch categories from backend, but use fallback if fails
    const fetchCategories = async () => {
      try {
        const response = await CategoryAPI.getAllCategories();
        if (response.success && response.data.categories && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Keep the default categories that are already set
      }
    };
    
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      console.log('Loading product for edit:', product);
      setFormData({
        name: product.name || '',
        category: typeof product.category === 'object' ? product.category._id : product.category || 'fruits',
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
      // Reset for "Add New" - use safe default
      setFormData({ 
        name: '', 
        category: Array.isArray(categories) && categories.length > 0 ? categories[0]._id : 'fruits', 
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

  // Show loading if categories are not loaded yet
  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-sm w-full">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-green-600 mb-3"></div>
            <span className="text-sm sm:text-lg font-medium text-slate-700">Loading categories...</span>
            <span className="text-xs sm:text-sm text-slate-500 mt-1">Please wait</span>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle image URL validation
    if (name === 'image' && value) {
      // Accept both regular URLs and base64 data URLs
      const isValidUrl = value.startsWith('http') || value.startsWith('data:image/');
      if (!isValidUrl && value.trim() !== '') {
        console.warn('Invalid image URL format');
      }
    }
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Product name is required');
    if (!formData.price || parseFloat(formData.price) <= 0) errors.push('Valid price is required');
    if (!formData.stock || parseInt(formData.stock) < 0) errors.push('Valid stock quantity is required');
    if (!formData.image.trim()) errors.push('Product image is required');
    if (formData.description && formData.description.length > 500) errors.push('Description must be under 500 characters');
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'));
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Submitting product data:', {
        ...formData,
        imageLength: formData.image.length,
        isBase64: formData.image.startsWith('data:image/')
      });
      
      // Prepare data for API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discount: parseFloat(formData.discount || 0),
        tags: Array.isArray(formData.tags) ? formData.tags : []
      };
      
      // If editing existing product, include the ID
      if (product && product._id) {
        productData._id = product._id;
      }
      
      console.log('Final product data for API:', productData);
      
      // Call the parent's save function
      await onSave(productData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in-fast p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full transform transition-transform duration-300 scale-100 max-h-[95vh] overflow-y-auto
                      max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl
                      p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <div className="mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          {product && (
            <p className="text-xs sm:text-sm text-blue-600 mt-1 break-all">
              Editing: <span className="font-medium">{product.name}</span>
              {product._id && <span className="text-gray-500 ml-1 sm:ml-2 block sm:inline">(ID: {product._id})</span>}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-6">
          
          {/* Name and Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                Product Name *
              </label>
              <input 
                name="name" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter product name" 
                required 
                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                Price (₹) *
              </label>
              <input 
                name="price" 
                id="price" 
                type="number" 
                step="0.01"
                min="0"
                value={formData.price} 
                onChange={handleChange} 
                placeholder="0.00" 
                required 
                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              />
            </div>
          </div>

          {/* Category and Stock Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="category" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                Category *
              </label>
              <select 
                name="category" 
                id="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map(cat => (
                    <option key={cat._id || cat.name} value={cat._id || cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="">Loading categories...</option>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="stock" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                Stock Quantity *
              </label>
              <input 
                name="stock" 
                id="stock" 
                type="number" 
                min="0"
                value={formData.stock} 
                onChange={handleChange} 
                placeholder="0" 
                required 
                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              />
            </div>
          </div>
          
          {/* Unit, Discount and Featured Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label htmlFor="unit" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                Unit
              </label>
              <select 
                name="unit" 
                id="unit" 
                value={formData.unit} 
                onChange={handleChange} 
                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="piece">Piece</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="l">Liter (l)</option>
                <option value="ml">Milliliter (ml)</option>
                <option value="pack">Pack</option>
                <option value="box">Box</option>
                <option value="bottle">Bottle</option>
                <option value="can">Can</option>
              </select>
            </div>
            <div>
              <label htmlFor="discount" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                Discount (%)
              </label>
              <input 
                name="discount" 
                id="discount" 
                type="number" 
                min="0" 
                max="100" 
                step="0.01"
                value={formData.discount} 
                onChange={handleChange} 
                placeholder="0" 
                className="w-full p-2 sm:p-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              />
            </div>
            <div className="flex items-center justify-center sm:justify-start lg:justify-center h-full pt-4 sm:pt-6 lg:pt-8">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  name="isFeatured" 
                  id="isFeatured" 
                  checked={formData.isFeatured} 
                  onChange={handleChange}
                  className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 focus:ring-green-500 border-slate-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 text-xs sm:text-sm font-semibold text-slate-700">
                  Featured Product
                </label>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div>
            <label htmlFor="image" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
              Product Image *
            </label>
            {formData.image && (
              <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative">
                  <img 
                    src={formData.image} 
                    alt="Product preview" 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-slate-200" 
                    onError={(e) => {
                      e.target.src = '/api/placeholder/80/80';
                      e.target.alt = 'Image failed to load';
                    }}
                  />
                  {formData.image.startsWith('data:image/') && (
                    <span className="absolute -top-1 -right-1 px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                      Base64
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  <p className="font-medium">Current Image Preview</p>
                  <p className="break-all">
                    {formData.image.startsWith('data:image/') 
                      ? `Base64 image (${(formData.image.length / 1024).toFixed(1)}KB)`
                      : formData.image.length > 40 ? formData.image.substring(0, 40) + '...' : formData.image
                    }
                  </p>
                </div>
              </div>
            )}
            <input 
              name="image" 
              id="image" 
              type="text"
              value={formData.image} 
              onChange={handleChange} 
              placeholder="https://example.com/image.jpg or data:image/jpeg;base64,..." 
              required 
              className="w-full p-2 sm:p-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
            <div className="flex flex-col sm:flex-row gap-2 mt-1">
              <p className="text-xs text-slate-500">
                Supports: HTTP URLs or Base64 data URLs
              </p>
              {formData.image.startsWith('data:image/') && formData.image.length > 100000 && (
                <p className="text-xs text-yellow-600">
                  ⚠️ Large base64 image may cause performance issues
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
              Product Description
            </label>
            <textarea 
              name="description" 
              id="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Describe your product features, benefits, and specifications..." 
              rows="3" 
              className="w-full p-2 sm:p-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical min-h-[80px]"
            ></textarea>
            <p className="text-xs text-slate-500 mt-1">{formData.description.length}/500 characters</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 
                        transition-colors disabled:opacity-50 border border-slate-300 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-green-600 text-white font-semibold 
                        hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal; 