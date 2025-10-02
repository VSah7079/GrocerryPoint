import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductFormModal from './ProductFormModal';
import AuthDebugger from '../../components/AuthDebugger';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { ProductAPI } from '../../services/realApi';

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch products from backend
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Fetching products...');
            const response = await ProductAPI.getAllProducts();
            console.log('Fetch response:', response);
            
            if (response.success) {
                setProducts(response.data.products);
                console.log('Products loaded:', response.data.products.length);
            } else {
                setError('Failed to fetch products');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(`Failed to fetch products: ${err.message || 'Please check if the backend server is running.'}`);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (location.state?.openModal) {
            handleOpenModal();
        }
    }, [location.state]);

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
        setError(''); // Clear any previous errors
        setSuccessMessage(''); // Clear any previous success messages
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };
    
    const handleSaveProduct = async (savedProduct) => {
        try {
            console.log('Saving product:', savedProduct); // Debug log
            
            if (savedProduct._id) {
                // Update existing product
                console.log('Updating existing product with ID:', savedProduct._id);
                const response = await ProductAPI.updateProduct(savedProduct._id, savedProduct);
                console.log('Update response:', response); // Debug log
                
                if (response.success) {
                    setProducts(products.map(p => p._id === savedProduct._id ? response.data.product : p));
                    setError(''); // Clear any previous errors
                    setSuccessMessage('Product updated successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                } else {
                    setError('Failed to update product. Please try again.');
                }
            } else {
                // Create new product
                console.log('Creating new product');
                const response = await ProductAPI.createProduct(savedProduct);
                console.log('Create response:', response); // Debug log
                
                if (response.success) {
                    setProducts([...products, response.data.product]);
                    setError(''); // Clear any previous errors
                    setSuccessMessage('Product created successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                } else {
                    setError('Failed to create product. Please try again.');
                }
            }
            handleCloseModal();
            // Refresh the products list to ensure data consistency
            await fetchProducts();
        } catch (err) {
            console.error('Error saving product:', err);
            setError(`Failed to save product: ${err.message || 'Please try again.'}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await ProductAPI.deleteProduct(id);
                if (response.success) {
                    setProducts(products.filter(p => p._id !== id));
                    // Refresh the products list to ensure data consistency
                    await fetchProducts();
                }
            } catch (err) {
                console.error('Error deleting product:', err);
                setError('Failed to delete product. Please try again.');
            }
        }
    };

    const categories = ['All', ...Array.from(new Set(products.map(p => 
        typeof p.category === 'object' ? p.category.name : p.category
    )))];
    
    const filteredProducts = useMemo(() => {
        return products
            .filter(p => {
                const categoryName = typeof p.category === 'object' ? p.category.name : p.category;
                return filterCategory === 'All' || categoryName === filterCategory;
            })
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm, filterCategory]);

    return (
        <div className="bg-slate-50 p-8 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4 sm:mb-0">Product Management</h1>
                <button 
                    onClick={() => handleOpenModal()} 
                    className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    Add New Product
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    {successMessage}
                </div>
            )}

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                    <input 
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-12 border border-slate-300 rounded-lg"
                    />
                </div>
                <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full sm:w-auto p-3 border border-slate-300 rounded-lg"
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
                {loading ? (
                    <div className="text-center p-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        <p className="mt-2 text-slate-500">Loading products...</p>
                    </div>
                ) : (
                    <>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-100 text-slate-600 uppercase text-sm">
                                    <th className="p-4">Product</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product._id} className="border-b hover:bg-slate-50">
                                        <td className="p-4 flex items-center">
                                            <img 
                                                src={product.image} 
                                                alt={product.name} 
                                                className="w-12 h-12 rounded-lg object-cover mr-4"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                                                }}
                                            />
                                            <div>
                                                <span className="font-semibold text-slate-800">{product.name}</span>
                                                {product.isFeatured && (
                                                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            {typeof product.category === 'object' ? product.category.name : product.category}
                                        </td>
                                        <td className="p-4 font-semibold text-green-600">₹{product.price.toFixed(2)}</td>
                                        <td className="p-4 text-slate-600">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                product.stock > 10 ? 'bg-green-100 text-green-800' : 
                                                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {product.stock || 0} {product.unit || 'pcs'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => handleOpenModal(product)} 
                                                    className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                                                    title="Edit Product"
                                                >
                                                    <Edit size={18}/>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product._id)} 
                                                    className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredProducts.length === 0 && !loading && (
                            <div className="text-center p-8 text-slate-500">
                                <p>No products found. Try adjusting your search or filters.</p>
                                <button 
                                    onClick={() => handleOpenModal()} 
                                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Add Your First Product
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            
            <ProductFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveProduct}
                product={editingProduct}
            />
            
            {/* Debug component - remove in production */}
            <AuthDebugger />
        </div>
    );
};

export default ProductManagementPage; 