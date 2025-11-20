const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

const createFeaturedProducts = async () => {
  try {
    console.log('🌟 Creating featured products...');
    
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/grocerrypoint');
    }

    // First, let's get or create some categories
    const categories = await Category.find();
    console.log(`📦 Found ${categories.length} categories`);

    let defaultCategoryId = null;
    if (categories.length > 0) {
      defaultCategoryId = categories[0]._id;
      console.log(`✅ Using category: ${categories[0].name} (${defaultCategoryId})`);
    } else {
      // Create a default category if none exist
      const defaultCategory = new Category({
        name: 'Fruits',
        description: 'Fresh fruits and organic produce',
        isActive: true
      });
      await defaultCategory.save();
      defaultCategoryId = defaultCategory._id;
      console.log(`✅ Created default category: ${defaultCategory.name}`);
    }

    // Sample featured products data
    const featuredProducts = [
      {
        name: 'Fresh Red Apples',
        description: 'Crispy, sweet red apples. Perfect for snacking and healthy eating. Rich in vitamins and fiber.',
        price: 180,
        category: defaultCategoryId,
        stock: 50,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&crop=center',
        unit: 'kg',
        isFeatured: true,
        discount: 0,
        tags: ['fresh', 'organic', 'healthy', 'vitamin-rich'],
        ratings: 4.5,
        numReviews: 23
      },
      {
        name: 'Organic Bananas',
        description: 'Sweet, ripe bananas packed with potassium and natural energy. Great for smoothies and snacks.',
        price: 80,
        category: defaultCategoryId,
        stock: 75,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&crop=center',
        unit: 'kg',
        isFeatured: true,
        discount: 10,
        tags: ['organic', 'potassium', 'energy', 'healthy'],
        ratings: 4.7,
        numReviews: 45
      },
      {
        name: 'Fresh Tomatoes',
        description: 'Juicy, vine-ripened tomatoes. Perfect for salads, cooking, and making sauces.',
        price: 60,
        category: defaultCategoryId,
        stock: 40,
        image: 'https://images.unsplash.com/photo-1546470427-e2c30f43b4b8?w=400&h=400&fit=crop&crop=center',
        unit: 'kg',
        isFeatured: true,
        discount: 15,
        tags: ['fresh', 'vine-ripened', 'cooking', 'salad'],
        ratings: 4.3,
        numReviews: 18
      },
      {
        name: 'Green Leafy Spinach',
        description: 'Fresh, tender spinach leaves. Rich in iron and nutrients. Perfect for salads and cooking.',
        price: 45,
        category: defaultCategoryId,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&crop=center',
        unit: 'kg',
        isFeatured: true,
        discount: 0,
        tags: ['fresh', 'iron-rich', 'nutrients', 'healthy'],
        ratings: 4.6,
        numReviews: 31
      },
      {
        name: 'Premium Basmati Rice',
        description: 'Long-grain premium basmati rice. Aromatic and perfect for biryanis and everyday meals.',
        price: 120,
        category: defaultCategoryId,
        stock: 100,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center',
        unit: 'kg',
        isFeatured: true,
        discount: 5,
        tags: ['premium', 'basmati', 'aromatic', 'long-grain'],
        ratings: 4.8,
        numReviews: 67
      },
      {
        name: 'Fresh Carrots',
        description: 'Crunchy, sweet carrots. High in beta-carotene and perfect for snacking and cooking.',
        price: 55,
        category: defaultCategoryId,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop&crop=center',
        unit: 'kg',
        isFeatured: true,
        discount: 0,
        tags: ['fresh', 'crunchy', 'beta-carotene', 'healthy'],
        ratings: 4.4,
        numReviews: 29
      }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const productData of featuredProducts) {
      try {
        // Check if product already exists
        const existingProduct = await Product.findOne({ name: productData.name });
        
        if (existingProduct) {
          // Update to make it featured if not already
          if (!existingProduct.isFeatured) {
            existingProduct.isFeatured = true;
            await existingProduct.save();
            console.log(`🔄 Updated "${productData.name}" to be featured`);
            createdCount++;
          } else {
            console.log(`⏭️  Product "${productData.name}" already exists and is featured`);
            skippedCount++;
          }
        } else {
          // Add stock history for new product
          productData.stockHistory = [{
            type: 'initial',
            quantity: productData.stock,
            previousStock: 0,
            newStock: productData.stock,
            reason: 'Initial stock setup - featured product',
            date: new Date()
          }];

          const product = new Product(productData);
          await product.save();
          console.log(`✅ Created featured product: "${productData.name}"`);
          createdCount++;
        }
      } catch (error) {
        console.error(`❌ Error creating product "${productData.name}":`, error.message);
      }
    }

    console.log(`🎉 Featured products setup completed!`);
    console.log(`📊 Summary: ${createdCount} created/updated, ${skippedCount} skipped`);

    // Verify featured products
    const allFeaturedProducts = await Product.find({ isFeatured: true }).populate('category');
    console.log(`🌟 Total featured products in database: ${allFeaturedProducts.length}`);
    
    allFeaturedProducts.forEach(product => {
      console.log(`   • ${product.name} - ₹${product.price} (Stock: ${product.stock})`);
    });

  } catch (error) {
    console.error('❌ Featured products setup error:', error);
  }
};

// Run if called directly
if (require.main === module) {
  createFeaturedProducts().then(() => {
    console.log('👋 Featured products setup finished');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Fatal error in featured products setup:', error);
    process.exit(1);
  });
}

module.exports = { createFeaturedProducts };