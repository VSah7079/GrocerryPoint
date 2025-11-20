// Sample featured products data that can be used for testing
export const sampleFeaturedProducts = [
  {
    name: 'Fresh Red Apples',
    description: 'Crispy, sweet red apples. Perfect for snacking and healthy eating. Rich in vitamins and fiber.',
    price: 180,
    category: 'fruits', // Will be converted to ObjectId by backend
    stock: 50,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&crop=center',
    unit: 'kg',
    isFeatured: true,
    discount: 0,
    tags: ['fresh', 'organic', 'healthy', 'vitamin-rich']
  },
  {
    name: 'Organic Bananas',
    description: 'Sweet, ripe bananas packed with potassium and natural energy. Great for smoothies and snacks.',
    price: 80,
    category: 'fruits',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&crop=center',
    unit: 'kg',
    isFeatured: true,
    discount: 10,
    tags: ['organic', 'potassium', 'energy', 'healthy']
  },
  {
    name: 'Fresh Tomatoes',
    description: 'Juicy, vine-ripened tomatoes. Perfect for salads, cooking, and making sauces.',
    price: 60,
    category: 'vegetables',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1546470427-e2c30f43b4b8?w=400&h=400&fit=crop&crop=center',
    unit: 'kg',
    isFeatured: true,
    discount: 15,
    tags: ['fresh', 'vine-ripened', 'cooking', 'salad']
  },
  {
    name: 'Green Leafy Spinach',
    description: 'Fresh, tender spinach leaves. Rich in iron and nutrients. Perfect for salads and cooking.',
    price: 45,
    category: 'vegetables',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&crop=center',
    unit: 'kg',
    isFeatured: true,
    discount: 0,
    tags: ['fresh', 'iron-rich', 'nutrients', 'healthy']
  },
  {
    name: 'Premium Basmati Rice',
    description: 'Long-grain premium basmati rice. Aromatic and perfect for biryanis and everyday meals.',
    price: 120,
    category: 'grains',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center',
    unit: 'kg',
    isFeatured: true,
    discount: 5,
    tags: ['premium', 'basmati', 'aromatic', 'long-grain']
  },
  {
    name: 'Fresh Carrots',
    description: 'Crunchy, sweet carrots. High in beta-carotene and perfect for snacking and cooking.',
    price: 55,
    category: 'vegetables',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop&crop=center',
    unit: 'kg',
    isFeatured: true,
    discount: 0,
    tags: ['fresh', 'crunchy', 'beta-carotene', 'healthy']
  }
];

// Function to add sample products using the admin interface
export const addSampleFeaturedProducts = async (ProductAPI) => {
  console.log('🌟 Adding sample featured products...');
  
  const results = [];
  
  for (const productData of sampleFeaturedProducts) {
    try {
      const response = await ProductAPI.createProduct(productData);
      if (response.success) {
        console.log(`✅ Added featured product: ${productData.name}`);
        results.push({ success: true, product: productData.name });
      } else {
        console.error(`❌ Failed to add ${productData.name}:`, response);
        results.push({ success: false, product: productData.name, error: 'API call failed' });
      }
    } catch (error) {
      console.error(`❌ Error adding ${productData.name}:`, error);
      results.push({ success: false, product: productData.name, error: error.message });
    }
  }
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`🎉 Sample products addition completed: ${successful} successful, ${failed} failed`);
  return results;
};