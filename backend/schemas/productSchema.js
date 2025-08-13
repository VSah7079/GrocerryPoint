// Product database with realistic Indian grocery products
const productDatabase = [
  {
    category: 'Fruits & Vegetables',
    products: [
      { name: 'Fresh Tomatoes', basePrice: [20, 35], unit: 'kg', organic: false },
      { name: 'Red Onions', basePrice: [15, 25], unit: 'kg', organic: false },
      { name: 'Green Capsicum', basePrice: [40, 60], unit: 'kg', organic: false },
      { name: 'Fresh Spinach', basePrice: [15, 25], unit: 'kg', organic: true },
      { name: 'Cauliflower', basePrice: [25, 40], unit: 'kg', organic: false },
      { name: 'Fresh Carrots', basePrice: [30, 45], unit: 'kg', organic: true },
      { name: 'Green Beans', basePrice: [35, 50], unit: 'kg', organic: false },
      { name: 'Fresh Lemons', basePrice: [40, 60], unit: 'kg', organic: false },
      { name: 'Bananas', basePrice: [30, 50], unit: 'dozen', organic: false },
      { name: 'Fresh Apples', basePrice: [80, 120], unit: 'kg', organic: true },
      { name: 'Pomegranates', basePrice: [100, 150], unit: 'kg', organic: false },
      { name: 'Fresh Oranges', basePrice: [60, 90], unit: 'kg', organic: false },
      { name: 'Potatoes', basePrice: [12, 20], unit: 'kg', organic: false },
      { name: 'Fresh Ginger', basePrice: [80, 120], unit: 'kg', organic: true },
      { name: 'Green Chillies', basePrice: [40, 70], unit: 'kg', organic: false }
    ]
  },
  {
    category: 'Dairy & Eggs',
    products: [
      { name: 'Fresh Milk', basePrice: [25, 35], unit: 'liter', brand: 'Amul', organic: false },
      { name: 'Paneer', basePrice: [80, 120], unit: 'pack', weight: 200, brand: 'Mother Dairy', organic: false },
      { name: 'Curd/Yogurt', basePrice: [30, 45], unit: 'pack', weight: 400, brand: 'Amul', organic: false },
      { name: 'Butter', basePrice: [45, 65], unit: 'pack', weight: 100, brand: 'Amul', organic: false },
      { name: 'Cheese Slices', basePrice: [80, 110], unit: 'pack', weight: 200, brand: 'Britannia', organic: false },
      { name: 'Fresh Eggs', basePrice: [80, 120], unit: 'dozen', brand: 'Keggs', organic: false },
      { name: 'Ghee', basePrice: [150, 200], unit: 'pack', weight: 200, brand: 'Amul', organic: true },
      { name: 'Cream', basePrice: [35, 50], unit: 'pack', weight: 200, brand: 'Amul', organic: false },
      { name: 'Lassi', basePrice: [25, 35], unit: 'bottle', weight: 200, brand: 'Amul', organic: false },
      { name: 'Cottage Cheese', basePrice: [60, 90], unit: 'pack', weight: 200, brand: 'Mother Dairy', organic: true }
    ]
  },
  {
    category: 'Grains & Cereals',
    products: [
      { name: 'Basmati Rice', basePrice: [120, 180], unit: 'kg', brand: 'India Gate', organic: false },
      { name: 'Wheat Flour', basePrice: [35, 50], unit: 'kg', brand: 'Aashirvaad', organic: false },
      { name: 'Toor Dal', basePrice: [80, 120], unit: 'kg', brand: 'Tata Sampann', organic: false },
      { name: 'Chana Dal', basePrice: [70, 100], unit: 'kg', brand: 'Tata Sampann', organic: false },
      { name: 'Moong Dal', basePrice: [90, 130], unit: 'kg', brand: 'Tata Sampann', organic: true },
      { name: 'Masoor Dal', basePrice: [75, 110], unit: 'kg', brand: 'Tata Sampann', organic: false },
      { name: 'Quinoa', basePrice: [200, 300], unit: 'pack', weight: 500, brand: 'Organic India', organic: true },
      { name: 'Oats', basePrice: [80, 120], unit: 'pack', weight: 500, brand: 'Quaker', organic: false },
      { name: 'Brown Rice', basePrice: [60, 90], unit: 'kg', brand: 'Fortune', organic: true },
      { name: 'Besan (Gram Flour)', basePrice: [50, 80], unit: 'kg', brand: 'Everest', organic: false },
      { name: 'Semolina (Rava)', basePrice: [40, 60], unit: 'kg', brand: 'Pillsbury', organic: false },
      { name: 'Poha (Flattened Rice)', basePrice: [35, 55], unit: 'kg', brand: 'Patanjali', organic: false }
    ]
  },
  {
    category: 'Snacks & Beverages',
    products: [
      { name: 'Green Tea', basePrice: [150, 250], unit: 'pack', weight: 100, brand: 'Tetley', organic: true },
      { name: 'Coffee Powder', basePrice: [200, 300], unit: 'pack', weight: 200, brand: 'Bru', organic: false },
      { name: 'Biscuits', basePrice: [20, 40], unit: 'pack', weight: 150, brand: 'Parle-G', organic: false },
      { name: 'Namkeen Mix', basePrice: [60, 100], unit: 'pack', weight: 200, brand: 'Haldirams', organic: false },
      { name: 'Coconut Water', basePrice: [25, 40], unit: 'bottle', weight: 200, brand: 'Real', organic: false },
      { name: 'Fruit Juice', basePrice: [35, 55], unit: 'bottle', weight: 200, brand: 'Real', organic: false },
      { name: 'Dark Chocolate', basePrice: [80, 150], unit: 'bar', weight: 100, brand: 'Amul', organic: true },
      { name: 'Nuts Mix', basePrice: [300, 500], unit: 'pack', weight: 200, brand: 'Nutraj', organic: true },
      { name: 'Dry Fruits', basePrice: [400, 700], unit: 'pack', weight: 250, brand: 'Happilo', organic: true },
      { name: 'Energy Drink', basePrice: [15, 25], unit: 'bottle', weight: 250, brand: 'Glucon-D', organic: false }
    ]
  },
  {
    category: 'Meat & Seafood',
    products: [
      { name: 'Chicken Breast', basePrice: [180, 250], unit: 'kg', organic: false },
      { name: 'Mutton', basePrice: [400, 600], unit: 'kg', organic: false },
      { name: 'Fish (Rohu)', basePrice: [150, 220], unit: 'kg', organic: false },
      { name: 'Prawns', basePrice: [300, 450], unit: 'kg', organic: false },
      { name: 'Chicken Wings', basePrice: [120, 180], unit: 'kg', organic: false },
      { name: 'Fish (Pomfret)', basePrice: [250, 400], unit: 'kg', organic: false },
      { name: 'Crab', basePrice: [200, 350], unit: 'kg', organic: false },
      { name: 'Chicken Drumsticks', basePrice: [140, 200], unit: 'kg', organic: false }
    ]
  }
];

// Dynamic Product Generator Class
class DynamicProductGenerator {
  constructor() {
    this.brands = ['Fresh Market', 'Organic Valley', 'Farm Fresh', 'Green Choice', 'Pure & Natural'];
    this.descriptions = [
      'Premium quality product sourced directly from farms',
      'Fresh and nutritious, perfect for daily consumption',
      'Carefully selected for maximum freshness and taste',
      'Rich in nutrients and flavor, ideal for healthy cooking',
      'Handpicked quality ensuring the best taste and nutrition'
    ];
  }

  generateRandomProduct() {
    const categories = productDatabase;
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomProduct = randomCategory.products[Math.floor(Math.random() * randomCategory.products.length)];
    
    const basePrice = Array.isArray(randomProduct.basePrice) 
      ? Math.floor(Math.random() * (randomProduct.basePrice[1] - randomProduct.basePrice[0]) + randomProduct.basePrice[0])
      : randomProduct.basePrice;

    return {
      id: this.generateId(),
      name: randomProduct.name + (randomProduct.weight ? ` (${randomProduct.weight}${randomProduct.unit})` : ` (1${randomProduct.unit})`),
      category: randomCategory.category,
      price: basePrice,
      originalPrice: Math.floor(basePrice * (1 + Math.random() * 0.3)), // 0-30% markup
      unit: randomProduct.unit,
      brand: randomProduct.brand || this.brands[Math.floor(Math.random() * this.brands.length)],
      description: this.descriptions[Math.floor(Math.random() * this.descriptions.length)],
      image: this.generateImageUrl(randomProduct.name),
      stock: Math.floor(Math.random() * 100) + 10, // 10-110 items
      isOrganic: randomProduct.organic || Math.random() < 0.3, // 30% chance for organic
      isFeatured: Math.random() < 0.25, // 25% chance for featured
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)), // 3.5-5.0 rating
      reviewCount: Math.floor(Math.random() * 200) + 10, // 10-210 reviews
      discount: Math.floor(Math.random() * 25), // 0-25% discount
      tags: this.generateTags(randomCategory.category, randomProduct.organic),
      nutritionInfo: this.generateNutritionInfo(randomCategory.category),
      expiryDate: this.generateExpiryDate(randomCategory.category),
      sales: Math.floor(Math.random() * 500) + 50, // 50-550 sales
      revenue: 0, // Will be calculated
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      updatedAt: new Date()
    };
  }

  generateId() {
    return 'prod_' + Math.random().toString(36).substr(2, 9);
  }

  generateImageUrl(productName) {
    const slug = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center&q=80`;
  }

  generateTags(category, isOrganic) {
    const baseTags = ['fresh', 'healthy', 'nutritious'];
    const categoryTags = {
      'Fruits & Vegetables': ['farm-fresh', 'vitamin-rich', 'natural'],
      'Dairy & Eggs': ['protein-rich', 'calcium', 'fresh'],
      'Grains & Cereals': ['whole-grain', 'fiber-rich', 'energy'],
      'Snacks & Beverages': ['tasty', 'convenient', 'quick'],
      'Meat & Seafood': ['protein', 'lean', 'fresh']
    };
    
    let tags = [...baseTags, ...(categoryTags[category] || [])];
    if (isOrganic) tags.push('organic', 'chemical-free');
    
    return tags.slice(0, 5); // Return max 5 tags
  }

  generateNutritionInfo(category) {
    const nutritionTemplates = {
      'Fruits & Vegetables': { calories: 25, protein: 1, carbs: 6, fiber: 2, vitamin_c: 15 },
      'Dairy & Eggs': { calories: 150, protein: 8, carbs: 5, fat: 8, calcium: 200 },
      'Grains & Cereals': { calories: 350, protein: 12, carbs: 70, fiber: 8, iron: 4 },
      'Snacks & Beverages': { calories: 450, protein: 6, carbs: 55, fat: 20, sugar: 25 },
      'Meat & Seafood': { calories: 200, protein: 25, fat: 8, iron: 3, vitamin_b12: 2 }
    };

    return nutritionTemplates[category] || nutritionTemplates['Fruits & Vegetables'];
  }

  generateExpiryDate(category) {
    const daysToAdd = {
      'Fruits & Vegetables': 3 + Math.floor(Math.random() * 7), // 3-10 days
      'Dairy & Eggs': 5 + Math.floor(Math.random() * 10), // 5-15 days
      'Grains & Cereals': 30 + Math.floor(Math.random() * 335), // 30-365 days
      'Snacks & Beverages': 60 + Math.floor(Math.random() * 305), // 60-365 days
      'Meat & Seafood': 1 + Math.floor(Math.random() * 3) // 1-4 days
    };

    const days = daysToAdd[category] || 7;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
  }

  getTopSellingProducts(limit = 5) {
    const products = [];
    for (let i = 0; i < limit * 2; i++) {
      products.push(this.generateRandomProduct());
    }
    
    // Sort by sales and return top products
    return products
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit)
      .map(product => {
        product.revenue = product.sales * product.price;
        return product;
      });
  }

  getFeaturedProducts(limit = 6) {
    const products = [];
    for (let i = 0; i < limit * 3; i++) {
      const product = this.generateRandomProduct();
      if (product.isFeatured || Math.random() < 0.4) {
        product.isFeatured = true;
        products.push(product);
      }
    }
    
    return products.slice(0, limit);
  }

  generateBulkProducts(count = 50) {
    const products = [];
    for (let i = 0; i < count; i++) {
      const product = this.generateRandomProduct();
      product.revenue = product.sales * product.price;
      products.push(product);
    }
    return products;
  }

  getProductsByCategory(categoryName, limit = 10) {
    const categoryData = productDatabase.find(cat => 
      cat.category.toLowerCase() === categoryName.toLowerCase()
    );
    
    if (!categoryData) return [];
    
    return categoryData.products.slice(0, limit).map(template => {
      const product = this.generateRandomProduct();
      product.category = categoryData.category;
      product.name = template.name;
      return product;
    });
  }
}

// Create singleton instance
const productGenerator = new DynamicProductGenerator();

// Export functions and data
module.exports = {
  productDatabase,
  productGenerator,
  DynamicProductGenerator
};
