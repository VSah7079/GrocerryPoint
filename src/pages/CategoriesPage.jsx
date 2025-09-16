import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductAPI } from '../services/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await ProductAPI.getAllProducts();
        const products = response.data.products || [];
        
        // Create category data with product counts
        const categoryMap = {};
        products.forEach(product => {
          if (!categoryMap[product.category]) {
            categoryMap[product.category] = {
              name: product.category,
              count: 0,
              products: []
            };
          }
          categoryMap[product.category].count++;
          categoryMap[product.category].products.push(product);
        });
        
        setCategories(Object.values(categoryMap));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Category icons mapping
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Grains & Rice': '🍚',
      'Oil & Ghee': '🛢️',
      'Spices': '🌶️',
      'Dairy Products': '🥛',
      'Pulses & Lentils': '🫘',
      'Beverages': '☕',
      'Sweeteners': '🍯'
    };
    return iconMap[categoryName] || '📦';
  };

  // Category colors mapping
  const getCategoryColor = (categoryName) => {
    const colorMap = {
      'Grains & Rice': 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
      'Oil & Ghee': 'bg-orange-100 hover:bg-orange-200 border-orange-300',
      'Spices': 'bg-red-100 hover:bg-red-200 border-red-300',
      'Dairy Products': 'bg-blue-100 hover:bg-blue-200 border-blue-300',
      'Pulses & Lentils': 'bg-green-100 hover:bg-green-200 border-green-300',
      'Beverages': 'bg-purple-100 hover:bg-purple-200 border-purple-300',
      'Sweeteners': 'bg-amber-100 hover:bg-amber-200 border-amber-300'
    };
    return colorMap[categoryName] || 'bg-gray-100 hover:bg-gray-200 border-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop by Category</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Browse our carefully curated categories to find exactly what you need for your kitchen and home
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className={`group block p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${getCategoryColor(category.name)}`}
            >
              <div className="text-center">
                {/* Category Icon */}
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {getCategoryIcon(category.name)}
                </div>
                
                {/* Category Name */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {category.name}
                </h3>
                
                {/* Product Count */}
                <p className="text-gray-600 mb-4">
                  {category.count} {category.count === 1 ? 'product' : 'products'}
                </p>
                
                {/* Sample Products */}
                <div className="text-sm text-gray-500 mb-4">
                  {category.products.slice(0, 2).map((product, index) => (
                    <span key={product._id}>
                      {product.name}
                      {index < Math.min(category.products.length - 1, 1) && ', '}
                    </span>
                  ))}
                  {category.products.length > 2 && <span>...</span>}
                </div>
                
                {/* Browse Button */}
                <div className="inline-flex items-center text-green-600 font-semibold group-hover:text-green-700">
                  Browse Category
                  <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Products Link */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-6">Browse all our products or use our search feature</p>
          <Link
            to="/products"
            className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-colors duration-300 transform hover:scale-105 shadow-lg"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;