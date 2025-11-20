import React, { useState } from 'react';
import { ProductAPI } from '../services/realApi';

const ProductAddTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testProductAdd = async () => {
    setLoading(true);
    try {
      const testProduct = {
        name: `Test Product ${Date.now()}`,
        description: 'This is a test product to verify database integration',
        price: 99.99,
        category: '507f1f77bcf86cd799439011', // Default category ID
        stock: 50,
        image: 'https://via.placeholder.com/300x300?text=Test+Product',
        unit: 'piece',
        isFeatured: false,
        tags: ['test', 'demo']
      };

      console.log('🧪 Testing product creation with:', testProduct);
      const response = await ProductAPI.createProduct(testProduct);
      console.log('✅ Test response:', response);
      
      setResult({
        success: true,
        message: 'Product added successfully!',
        data: response
      });
    } catch (error) {
      console.error('❌ Test failed:', error);
      setResult({
        success: false,
        message: `Error: ${error.message}`,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 m-4">
      <h3 className="text-lg font-bold mb-4">🧪 Product Addition Test</h3>
      
      <button 
        onClick={testProductAdd}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Add Product'}
      </button>

      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-semibold">{result.success ? '✅' : '❌'} {result.message}</p>
          <pre className="text-xs mt-2 overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProductAddTest;