const mongoose = require('mongoose');
const Category = require('./models/Category');

// Default categories for grocery store
const defaultCategories = [
  {
    name: 'Fruits',
    description: 'Fresh fruits including apples, bananas, oranges, and seasonal produce',
    isActive: true
  },
  {
    name: 'Vegetables', 
    description: 'Fresh vegetables including leafy greens, root vegetables, and organic produce',
    isActive: true
  },
  {
    name: 'Dairy',
    description: 'Milk, cheese, yogurt, butter and other dairy products',
    isActive: true
  },
  {
    name: 'Meat & Seafood',
    description: 'Fresh meat, poultry, and seafood products',
    isActive: true
  },
  {
    name: 'Bakery',
    description: 'Fresh bread, pastries, cakes and baked goods',
    isActive: true
  },
  {
    name: 'Pantry',
    description: 'Rice, pasta, cereals, oils, spices and pantry staples',
    isActive: true
  },
  {
    name: 'Beverages',
    description: 'Juices, soft drinks, tea, coffee and beverages',
    isActive: true
  },
  {
    name: 'Snacks',
    description: 'Chips, cookies, nuts and healthy snack options',
    isActive: true
  },
  {
    name: 'Frozen',
    description: 'Frozen vegetables, fruits, ready meals and ice cream',
    isActive: true
  },
  {
    name: 'Personal Care',
    description: 'Toiletries, hygiene products and personal care items',
    isActive: true
  }
];

const seedCategories = async () => {
  try {
    console.log('🌱 Starting category seeding...');
    
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/grocerrypoint');
    }
    
    // Check existing categories
    const existingCategories = await Category.find();
    console.log(`📦 Found ${existingCategories.length} existing categories`);
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const categoryData of defaultCategories) {
      try {
        // Check if category already exists (case insensitive)
        const existingCategory = await Category.findOne({ 
          name: { $regex: new RegExp('^' + categoryData.name + '$', 'i') } 
        });
        
        if (existingCategory) {
          console.log(`⏭️  Category "${categoryData.name}" already exists, skipping...`);
          skippedCount++;
        } else {
          const category = new Category(categoryData);
          await category.save();
          console.log(`✅ Created category: "${categoryData.name}"`);
          createdCount++;
        }
      } catch (error) {
        console.error(`❌ Error creating category "${categoryData.name}":`, error.message);
      }
    }
    
    console.log(`🎉 Category seeding completed!`);
    console.log(`📊 Summary: ${createdCount} created, ${skippedCount} skipped`);
    
    // List all categories
    const allCategories = await Category.find().sort({ name: 1 });
    console.log(`📋 Total categories in database: ${allCategories.length}`);
    allCategories.forEach(cat => {
      console.log(`   • ${cat.name} (${cat._id})`);
    });
    
  } catch (error) {
    console.error('❌ Category seeding error:', error);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedCategories().then(() => {
    console.log('👋 Category seeding script finished');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Fatal error in category seeder:', error);
    process.exit(1);
  });
}

module.exports = { seedCategories, defaultCategories };