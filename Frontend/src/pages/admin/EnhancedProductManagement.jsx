import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, Package, TrendingUp, AlertTriangle, 
  Star, Eye, RefreshCw, Download, Upload, Settings 
} from 'lucide-react';
import { ProductAPI } from '../../services/api';
import ProductFormModal from './ProductFormModal';

const EnhancedProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStock, setFilterStock] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Stock management
  const [stockModal, setStockModal] = useState({ open: false, product: null });
  
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 8000); // Keep error messages longer
      return () => clearTimeout(timer);
    }
  }, [error]);

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await fetch('http://localhost:5000/api/products');
      console.log('Connection test response:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
      }
      
      console.log('✅ Backend connection successful');
      return true;
    } catch (error) {
      console.error('❌ Backend connection failed:', error.message);
      setError(`Backend connection failed: ${error.message}. Please ensure the backend server is running on http://localhost:5000`);
      return false;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First test backend connection
      const connectionOk = await testBackendConnection();
      if (!connectionOk) {
        setLoading(false);
        return;
      }

      console.log('Fetching products and admin stats...');
      // Fetch products and admin stats in parallel
      const [productsRes, statsRes] = await Promise.all([
        ProductAPI.getAllProducts(),
        ProductAPI.getAdminProductStats()
      ]);
      
      console.log('Products response:', productsRes);
      console.log('Stats response:', statsRes);
      
      if (productsRes.success) {
        setProducts(productsRes.data.products);
      }
      
      if (statsRes.success) {
        setAdminStats(statsRes.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      let errorMsg = 'Failed to fetch data';
      
      if (err.code === 'NETWORK_ERROR' || !err.response) {
        errorMsg = 'Cannot connect to server. Please check if the backend is running on http://localhost:5000';
      } else if (err.response) {
        errorMsg = `Server error (${err.response.status}): ${err.response.data?.message || err.message}`;
      } else {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    console.log('Editing product:', product);
    setError(''); // Clear any previous errors
    setSuccessMessage('');
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await ProductAPI.deleteProduct(productId);
      setSuccessMessage('Product deleted successfully');
      fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to delete product: ' + err.message);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      setError('Please select products first');
      return;
    }

    try {
      switch (action) {
        case 'delete':
          if (!window.confirm(`Delete ${selectedProducts.length} products?`)) return;
          await Promise.all(selectedProducts.map(id => ProductAPI.deleteProduct(id)));
          setSuccessMessage(`${selectedProducts.length} products deleted`);
          break;
        
        case 'feature':
          await ProductAPI.bulkUpdateProducts(selectedProducts, { isFeatured: true });
          setSuccessMessage(`${selectedProducts.length} products featured`);
          break;
        
        case 'unfeature':
          await ProductAPI.bulkUpdateProducts(selectedProducts, { isFeatured: false });
          setSuccessMessage(`${selectedProducts.length} products unfeatured`);
          break;
      }
      
      setSelectedProducts([]);
      fetchData();
    } catch (err) {
      setError('Bulk action failed: ' + err.message);
    }
  };

  const handleStockUpdate = async (productId, quantity, type, reason) => {
    try {
      await ProductAPI.updateProductStock(productId, quantity, type, reason);
      setSuccessMessage('Stock updated successfully');
      setStockModal({ open: false, product: null });
      fetchData();
    } catch (err) {
      setError('Failed to update stock: ' + err.message);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      setError('');
      setSuccessMessage('');
      
      console.log('Saving product:', { editingProduct, productData });
      
      if (editingProduct && editingProduct._id) {
        console.log('Updating existing product:', editingProduct._id);
        // Update existing product
        const response = await ProductAPI.updateProduct(editingProduct._id, productData);
        console.log('Update response:', response);
        setSuccessMessage('Product updated successfully!');
      } else {
        console.log('Creating new product');
        // Create new product
        const response = await ProductAPI.createProduct(productData);
        console.log('Create response:', response);
        setSuccessMessage('Product created successfully!');
      }
      
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchData(); // Refresh the product list
    } catch (err) {
      console.error('Save product error:', err);
      
      // Enhanced error handling
      let errorMessage = 'Failed to save product';
      
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      if (err.response && err.response.status === 401) {
        errorMessage = 'Authentication failed. Please login as admin.';
      } else if (err.response && err.response.status === 403) {
        errorMessage = 'Access denied. Admin privileges required.';
      } else if (err.response && err.response.status === 404) {
        errorMessage = 'Product not found or API endpoint not available.';
      } else if (err.response && err.response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      }
      
      setError(errorMessage);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || 
                           (typeof product.category === 'object' ? 
                            product.category?.name === filterCategory : 
                            product.category === filterCategory);
    
    const matchesStock = filterStock === 'All' ||
                        (filterStock === 'In Stock' && product.stock > 0) ||
                        (filterStock === 'Low Stock' && product.stock > 0 && product.stock <= 10) ||
                        (filterStock === 'Out of Stock' && product.stock === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your store inventory dynamically</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={testBackendConnection}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Test Connection
            </button>
            <button
              onClick={handleCreateProduct}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>

        {/* Admin Statistics Cards */}
        {adminStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{adminStats.overview.totalProducts}</p>
                </div>
                <Package className="text-blue-500" size={24} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">₹{adminStats.overview.totalValue?.toLocaleString()}</p>
                </div>
                <TrendingUp className="text-green-500" size={24} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{adminStats.overview.lowStockProducts}</p>
                </div>
                <AlertTriangle className="text-yellow-500" size={24} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-gray-900">{adminStats.overview.featuredProducts}</p>
                </div>
                <Star className="text-purple-500" size={24} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="All">All Categories</option>
            {adminStats?.categoryStats?.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat._id} ({cat.count})
              </option>
            ))}
          </select>
          
          {/* Stock Filter */}
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="All">All Stock Levels</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock (≤10)</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          
          {/* Bulk Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('feature')}
              disabled={selectedProducts.length === 0}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 text-sm"
            >
              Feature
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={selectedProducts.length === 0}
              className="px-3 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={() => setError('')}
            className="text-red-500 hover:text-red-700 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
          <span>{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage('')}
            className="text-green-500 hover:text-green-700 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Products ({filteredProducts.length})</h3>
            <div className="text-sm text-gray-600">
              {selectedProducts.length > 0 && `${selectedProducts.length} selected`}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(filteredProducts.map(p => p._id));
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className={`border-t hover:bg-gray-50 ${editingProduct && editingProduct._id === product._id ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product._id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                          }
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || '/api/placeholder/40/40'}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{product.name}</p>
                            {editingProduct && editingProduct._id === product._id && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                                Editing
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{product.sku || 'No SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {typeof product.category === 'object' ? product.category?.name : product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">₹{product.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          product.stock === 0 ? 'bg-red-100 text-red-800' :
                          product.stock <= 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {product.stock}
                        </span>
                        <button
                          onClick={() => setStockModal({ open: true, product })}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {product.isFeatured && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Featured</span>
                        )}
                        {product.isActive && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onSave={handleSaveProduct}
        />
      )}

      {/* Stock Update Modal */}
      {stockModal.open && (
        <StockUpdateModal
          product={stockModal.product}
          onClose={() => setStockModal({ open: false, product: null })}
          onUpdate={handleStockUpdate}
        />
      )}
    </div>
  );
};

// Stock Update Modal Component
const StockUpdateModal = ({ product, onClose, onUpdate }) => {
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('add');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity || isNaN(quantity)) return;
    
    onUpdate(product._id, parseInt(quantity), type, reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Update Stock: {product.name}</h3>
        <p className="text-sm text-gray-600 mb-4">Current Stock: {product.stock}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Action</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="add">Add Stock</option>
              <option value="remove">Remove Stock</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Restock, Damaged, Sold"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedProductManagement;