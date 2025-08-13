const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const path = require('path');

// NOTE: This data is copied from frontend/src/data/products.js
// If the frontend data changes, this needs to be updated.
const products = [
  {
    id: 1,
    name: 'Fresh Apples',
    category: 'Fruits',
    price: 2.5,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&crop=center',
    images: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&crop=center'
    ],
    rating: 4.5,
    reviews: 120,
    description: 'Fresh, juicy apples perfect for snacking and baking.'
  },
  {
    id: 2,
    name: 'Organic Carrots',
    category: 'Vegetables',
    price: 1.8,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1447175008436-170170753d52?w=400&h=400&fit=crop&crop=center',
    rating: 4.8,
    reviews: 95,
    description: 'Organic carrots, rich in nutrients and delicious.'
  },
  {
    id: 3,
    name: 'Milk Bottle',
    category: 'Dairy',
    price: 1.2,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&crop=center',
    rating: 4.2,
    reviews: 210,
    description: 'Fresh, creamy milk from trusted sources.'
  },
  {
    id: 4,
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    price: 3.0,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&crop=center',
    rating: 4.6,
    reviews: 150,
    description: 'Whole wheat bread, a healthy choice for your breakfast.'
  },
  {
    id: 5,
    name: 'Fresh Bananas',
    category: 'Fruits',
    price: 1.9,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&crop=center',
    rating: 4.7,
    reviews: 180,
    description: 'Sweet, ripe bananas, perfect for smoothies and baking.'
  },
  {
    id: 6,
    name: 'Spinach Bunch',
    category: 'Vegetables',
    price: 2.0,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&crop=center',
    rating: 4.9,
    reviews: 110,
    description: 'Fresh spinach, a great addition to salads and smoothies.'
  },
  {
    id: 7,
    name: 'Cheddar Cheese',
    category: 'Dairy',
    price: 4.5,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop&crop=center',
    rating: 4.4,
    reviews: 90,
    description: 'Creamy cheddar cheese, ideal for sandwiches and melting.'
  },
  {
    id: 8,
    name: 'Dozen Eggs',
    category: 'Dairy',
    price: 2.8,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&h=400&fit=crop&crop=center',
    rating: 4.8,
    reviews: 250,
    description: 'Fresh, high-quality eggs for your cooking and baking.'
  },
  {
    id: 9,
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: 1.5,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=400&fit=crop&crop=center',
    rating: 4.6,
    reviews: 140,
    description: 'Juicy, fresh tomatoes, perfect for salads and sauces.'
  },
  {
    id: 10,
    name: 'Organic Strawberries',
    category: 'Fruits',
    price: 3.2,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&crop=center',
    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&crop=center'
    ],
    rating: 4.9,
    reviews: 200,
    description: 'Sweet, juicy organic strawberries, perfect for desserts and smoothies.'
  },
  {
    id: 11,
    name: 'Fresh Yogurt',
    category: 'Dairy',
    price: 2.1,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&crop=center',
    rating: 4.3,
    reviews: 160,
    description: 'Creamy, fresh yogurt, a great source of protein.'
  },
  {
    id: 12,
    name: 'Artisan Sourdough',
    category: 'Bakery',
    price: 4.0,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=400&fit=crop&crop=center',
    rating: 4.7,
    reviews: 120,
    description: 'Delicious artisan sourdough bread, perfect for sandwiches.'
  },
  {
    id: 13,
    name: 'Premium Alphonso Mangoes',
    category: 'Fruits',
    price: 6.5,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&crop=center',
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&crop=center'
    ],
    rating: 4.9,
    reviews: 320,
    description: 'Delicious, ripe Alphonso mangoes, a tropical treat.'
  },
  {
    id: 14,
    name: 'Basmati Rice 5kg',
    category: 'Food Grains',
    price: 12.0,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400&h=400&fit=crop&crop=center',
    rating: 4.8,
    reviews: 210,
    description: 'High-quality basmati rice, perfect for Indian dishes.'
  },
  {
    id: 15,
    name: 'Instant Noodles Pack',
    category: 'Packaged Food',
    price: 2.2,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=400&fit=crop&crop=center',
    rating: 4.5,
    reviews: 180,
    description: 'Quick and easy instant noodles, perfect for a quick meal.'
  },
  {
    id: 16,
    name: 'Brown Bread Loaf',
    category: 'Bakery',
    price: 2.5,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=400&fit=crop&crop=center',
    rating: 4.4,
    reviews: 90,
    description: 'Classic brown bread loaf, a staple for any kitchen.'
  },
  {
    id: 17,
    name: 'Potato Chips',
    category: 'Snacks',
    price: 1.5,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&crop=center',
    rating: 4.6,
    reviews: 130,
    description: 'Crispy potato chips, a favorite snack for any occasion.'
  },
  {
    id: 18,
    name: 'Herbal Shampoo',
    category: 'Personal Care',
    price: 3.8,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&crop=center',
    rating: 4.3,
    reviews: 75,
    description: 'Gentle herbal shampoo, suitable for all hair types.'
  },
  {
    id: 19,
    name: 'Liquid Detergent',
    category: 'Household Essentials',
    price: 5.0,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=400&fit=crop&crop=center',
    rating: 4.7,
    reviews: 110,
    description: 'Effective liquid detergent, suitable for all types of laundry.'
  },
  {
    id: 20,
    name: 'Dog Food 1kg',
    category: 'Dog Food',
    price: 7.5,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop&crop=center',
    rating: 4.5,
    reviews: 60,
    description: 'Nutritious dog food, suitable for all breeds.'
  },
  {
    id: 21,
    name: 'Baby Diapers (Pack of 20)',
    category: 'Diapers',
    price: 9.0,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=400&fit=crop&crop=center',
    rating: 4.6,
    reviews: 95,
    description: 'Soft, comfortable baby diapers, perfect for little ones.'
  },
  {
    id: 22,
    name: 'Multivitamin Tablets',
    category: 'Vitamins',
    price: 8.5,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=400&fit=crop&crop=center',
    rating: 4.8,
    reviews: 140,
    description: 'Complete multivitamin tablets, supporting overall health.'
  },
  {
    id: 23,
    name: 'Frozen Peas 500g',
    category: 'Frozen Vegetables',
    price: 3.0,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop&crop=center',
    rating: 4.7,
    reviews: 80,
    description: 'Fresh, frozen peas, a healthy addition to any meal.'
  },
  {
    id: 24,
    name: 'Camphor Tablets',
    category: 'Camphor',
    price: 1.2,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&crop=center',
    rating: 4.2,
    reviews: 50,
    description: 'Pure camphor tablets, used for various purposes.'
  },
  {
    id: 25,
    name: 'Rock Salt 1kg',
    category: 'Rock Salt',
    price: 2.0,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=400&fit=crop&crop=center',
    rating: 4.5,
    reviews: 70,
    description: 'Natural rock salt, a versatile seasoning.'
  },
];

// List of all unique categories from the static product list
const allCategories = [
  'Fruits',
  'Vegetables',
  'Dairy',
  'Bakery',
  'Food Grains',
  'Packaged Food',
  'Snacks',
  'Personal Care',
  'Household Essentials',
  'Dog Food',
  'Diapers',
  'Vitamins',
  'Frozen Vegetables',
  'Camphor',
  'Salt',
];

// Add a dummy product for any missing category
allCategories.forEach(cat => {
  if (!products.some(p => p.category === cat)) {
    products.push({
      name: `Sample Product for ${cat}`,
      category: cat,
      price: 1.0,
      discount: 0,
      image: 'https://via.placeholder.com/400x400?text=Sample',
      images: ['https://via.placeholder.com/400x400?text=Sample'],
      rating: 0,
      reviews: 0,
      description: `This is a sample product for the ${cat} category.`
    });
  }
});

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/grocerypoint';

mongoose.connect(mongoUrl, {
  // useNewUrlParser: true, // Deprecated
  // useUnifiedTopology: true, // Deprecated
})
.then(() => console.log('✅ MongoDB connected for seeder'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

const importData = async () => {
  try {
    // Clear existing products
    await Product.deleteMany();
    console.log('🗑️  Existing products deleted');

    // Map data to match schema
    const productsToInsert = products.map(p => ({
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      discount: p.discount,
      description: p.description,
      isFeatured: p.rating > 4.5,
      stock: Math.floor(Math.random() * 100) + 1,
    }));
    
    await Product.insertMany(productsToInsert);
    console.log('✅✅ Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('🗑️🗑️ Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 