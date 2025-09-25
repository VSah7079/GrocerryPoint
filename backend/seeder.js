// Seeder script for GrocerryPoint
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');

const sampleCategories = [
  { name: 'Fruits', description: 'Fresh fruits' },
  { name: 'Vegetables', description: 'Fresh vegetables' },
  { name: 'Dairy', description: 'Milk, cheese, and more' },
  { name: 'Grains', description: 'Rice, wheat, and cereals' },
  { name: 'Beverages', description: 'Juices, soft drinks, and more' },
];

const sampleProducts = [
  // Fruits
  { 
    name: 'Apple', 
    description: 'Fresh red apples', 
    price: 120, 
    stock: 100, 
    isFeatured: true, 
    ratings: 4.5, 
    numReviews: 25,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&q=80'
  },
  { 
    name: 'Banana', 
    description: 'Organic bananas', 
    price: 60, 
    stock: 150, 
    ratings: 4.2, 
    numReviews: 30,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&q=80'
  },
  { 
    name: 'Orange', 
    description: 'Sweet oranges', 
    price: 80, 
    stock: 80, 
    isFeatured: true, 
    ratings: 4.3, 
    numReviews: 20,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&q=80'
  },
  { 
    name: 'Mango', 
    description: 'Alphonso mangoes', 
    price: 200, 
    stock: 50, 
    isFeatured: true, 
    ratings: 4.8, 
    numReviews: 40,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&q=80'
  },
  
  // Vegetables
  { 
    name: 'Tomato', 
    description: 'Fresh tomatoes', 
    price: 40, 
    stock: 200, 
    ratings: 4.0, 
    numReviews: 15,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80'
  },
  { 
    name: 'Onion', 
    description: 'Red onions', 
    price: 30, 
    stock: 300, 
    ratings: 3.8, 
    numReviews: 10,
    image: 'https://images.unsplash.com/photo-1580201092675-a0a6a4d36963?w=300&q=80'
  },
  { 
    name: 'Potato', 
    description: 'Fresh potatoes', 
    price: 25, 
    stock: 250, 
    ratings: 4.1, 
    numReviews: 12,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&q=80'
  },
  { 
    name: 'Carrot', 
    description: 'Organic carrots', 
    price: 50, 
    stock: 120, 
    isFeatured: true, 
    ratings: 4.4, 
    numReviews: 18,
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&q=80'
  },
  
  // Dairy
  { 
    name: 'Milk', 
    description: '1L full cream milk', 
    price: 65, 
    stock: 50, 
    ratings: 4.6, 
    numReviews: 35,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80'
  },
  { 
    name: 'Yogurt', 
    description: 'Fresh yogurt', 
    price: 40, 
    stock: 40, 
    ratings: 4.3, 
    numReviews: 22,
    image: 'https://images.unsplash.com/photo-1571212515416-cd2d1b4d8dd8?w=300&q=80'
  },
  { 
    name: 'Cheese', 
    description: 'Processed cheese', 
    price: 150, 
    stock: 30, 
    isFeatured: true, 
    ratings: 4.7, 
    numReviews: 28,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&q=80'
  },
  
  // Grains
  { 
    name: 'Rice', 
    description: 'Basmati rice 1kg', 
    price: 80, 
    stock: 100, 
    ratings: 4.2, 
    numReviews: 45,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80'
  },
  { 
    name: 'Wheat Flour', 
    description: 'Whole wheat flour 1kg', 
    price: 60, 
    stock: 80, 
    ratings: 4.0, 
    numReviews: 32,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80'
  },
  
  // Beverages
  { 
    name: 'Orange Juice', 
    description: 'Fresh orange juice 1L', 
    price: 120, 
    stock: 60, 
    isFeatured: true, 
    ratings: 4.5, 
    numReviews: 24,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&q=80'
  },
  { 
    name: 'Cola', 
    description: 'Cola soft drink 500ml', 
    price: 35, 
    stock: 200, 
    ratings: 3.9, 
    numReviews: 50,
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&q=80'
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data');
    
    // Create categories
    const categories = await Category.insertMany(sampleCategories);
    console.log('Created categories:', categories.map(c => c.name));
    
    // Map category names to IDs
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    
    // Assign categories to products
    const productsWithCategories = sampleProducts.map(product => {
      let categoryName;
      if (['Apple', 'Banana', 'Orange', 'Mango'].includes(product.name)) {
        categoryName = 'Fruits';
      } else if (['Tomato', 'Onion', 'Potato', 'Carrot'].includes(product.name)) {
        categoryName = 'Vegetables';
      } else if (['Milk', 'Yogurt', 'Cheese'].includes(product.name)) {
        categoryName = 'Dairy';
      } else if (['Rice', 'Wheat Flour'].includes(product.name)) {
        categoryName = 'Grains';
      } else if (['Orange Juice', 'Cola'].includes(product.name)) {
        categoryName = 'Beverages';
      }
      
      return {
        ...product,
        category: categoryMap[categoryName]
      };
    });
    
    // Create products
    await Product.insertMany(productsWithCategories);
    console.log('Created products:', productsWithCategories.length);
    
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
