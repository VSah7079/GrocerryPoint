import React, { useState, useEffect, useMemo } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';

const ProductListPage = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  // Add a mapping from broad categories to product categories
  const categoryMap = {
    'Fresh Produce': ['Fruits', 'Vegetables', 'Leafy Greens'],
    'Food Grains, Oil & Masala': ['Food Grains', 'Oil', 'Masala', 'Spices'],
    'Packaged Food': ['Packaged Food', 'Biscuits', 'Cookies', 'Noodles', 'Pasta', 'Breakfast Cereals', 'Pickles', 'Jams', 'Sauces', 'Ready-to-Eat Meals'],
    'Dairy & Bakery': ['Dairy', 'Bakery', 'Eggs'],
    'Snacks & Beverages': ['Snacks', 'Beverages', 'Chips', 'Namkeen', 'Cold Drinks', 'Juices', 'Tea', 'Coffee', 'Chocolates', 'Candies'],
    'Personal Care': ['Personal Care', 'Soap', 'Body Wash', 'Shampoo', 'Conditioner', 'Toothpaste', 'Oral Care', 'Sanitary Napkins', 'Diapers', 'Hair Oils', 'Creams'],
    'Household Essentials': ['Household Essentials', 'Cleaning Supplies', 'Detergents', 'Dishwash', 'Air Fresheners', 'Tissues', 'Napkins', 'Garbage Bags'],
    'Pet Care': ['Pet Care', 'Dog Food', 'Cat Food', 'Pet Shampoo', 'Pet Accessories'],
    'Baby Care': ['Baby Care', 'Baby Food', 'Diapers', 'Baby Lotion', 'Baby Powder'],
    'Health & Wellness': ['Health & Wellness', 'Ayurvedic Products', 'Vitamins', 'Supplements', 'Health Drinks'],
    'Frozen Food': ['Frozen Food', 'Frozen Snacks', 'Frozen Vegetables', 'Ice Creams'],
    'Pooja Essentials': ['Pooja Essentials', 'Agarbatti', 'Camphor', 'Matchsticks', 'Diyas', 'Ghee', 'Cotton Wicks'],
    'Salt, Sugar & Sweeteners': ['Salt', 'Sugar', 'Sweeteners', 'Jaggery', 'Table Salt', 'Rock Salt', 'Sugar-Free Tablets'],
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.category))];
    return cats;
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesCategory = selectedCategory === 'All';
      if (!matchesCategory) {
        // If selectedCategory is a broad category, check if product.category is in its mapped categories
        if (categoryMap[selectedCategory]) {
          matchesCategory = categoryMap[selectedCategory].some(cat => product.category === cat);
        } else {
          matchesCategory = product.category === selectedCategory;
        }
      }
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      default: // popularity (by reviews)
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  // Get price statistics
  const priceStats = useMemo(() => {
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, []);

  // Initialize price range with actual min and max
  useEffect(() => {
    if (priceStats.max > 0) {
      setPriceRange([priceStats.min, priceStats.max]);
    }
  }, [priceStats]);

  // Set selectedCategory from URL query param on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} of {products.length} products
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
        </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mr-3 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min={priceStats.min}
                      max={priceStats.max}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        min={priceStats.min}
                        max={priceStats.max}
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        min={priceStats.min}
                        max={priceStats.max}
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setPriceRange([0, priceStats.max]);
                    setSortBy('popularity');
                  }}
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="name">Name A-Z</option>
                      <option value="discount">Biggest Discount</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 border rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Active Filters Display */}
                <div className="flex flex-wrap gap-2">
                  {selectedCategory !== 'All' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {selectedCategory} ×
                    </span>
                  )}
                  {searchTerm && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      "{searchTerm}" ×
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-8">
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage; 