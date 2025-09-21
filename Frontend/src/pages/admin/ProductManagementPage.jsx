import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductFormModal from './ProductFormModal';
import { Search, Edit, Trash2 } from 'lucide-react';

const API_URL = '/api/products';

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    // Fetch products from backend
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            // Optionally show error
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
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };
    
    const handleSaveProduct = async (savedProduct) => {
        if (savedProduct._id) {
            // Update
            const res = await fetch(`${API_URL}/${savedProduct._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(savedProduct)
            });
            const updated = await res.json();
            setProducts(products.map(p => p._id === updated._id ? updated : p));
        } else {
            // Add
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(savedProduct)
            });
            const created = await res.json();
            setProducts([...products, created]);
        }
        handleCloseModal();
    };

    const handleDelete = async (id) => {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        setProducts(products.filter(p => p._id !== id));
    };

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
    
    const filteredProducts = useMemo(() => {
        return products
            .filter(p => filterCategory === 'All' || p.category === filterCategory)
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm, filterCategory]);

    return (
        <div className="bg-slate-50 p-8 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4 sm:mb-0">Product Management</h1>
                <button onClick={() => handleOpenModal()} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    Add New Product
                </button>
            </div>

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
                                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover mr-4"/>
                                    <span className="font-semibold text-slate-800">{product.name}</span>
                                </td>
                                <td className="p-4 text-slate-600">{product.category}</td>
                                <td className="p-4 font-semibold text-green-600">₹{product.price.toFixed(2)}</td>
                                <td className="p-4 text-slate-600">{product.stock || 100}</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleOpenModal(product)} className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
                                        <Edit size={18}/>
                                    </button>
                                    <button onClick={() => handleDelete(product._id)} className="p-2 text-slate-500 hover:text-red-600 transition-colors">
                                        <Trash2 size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredProducts.length === 0 && (
                    <div className="text-center p-8 text-slate-500">
                        <p>No products found. Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
            
            <ProductFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveProduct}
                product={editingProduct}
            />
        </div>
    );
};

export default ProductManagementPage; 