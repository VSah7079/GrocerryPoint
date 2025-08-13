// Product Schema and Dynamic Product Generator
export const productSchema = {
  id: {
    type: 'string',
    required: true,
    format: 'PROD-####'
  },
  name: {
    type: 'string',
    required: true,
    maxLength: 100
  },
  category: {
    type: 'string',
    required: true,
    enum: ['Fruits & Vegetables', 'Dairy & Eggs', 'Snacks & Beverages', 'Meat & Seafood', 'Grains & Cereals', 'Personal Care', 'Household Items']
  },
  subcategory: {
    type: 'string',
    required: false
  },
  price: {
    type: 'number',
    required: true,
    min: 0
  },
  originalPrice: {
    type: 'number',
    required: false
  },
  discount: {
    type: 'number',
    default: 0,
    min: 0,
    max: 100
  },
  stock: {
    type: 'number',
    required: true,
    min: 0
  },
  unit: {
    type: 'string',
    required: true,
    enum: ['kg', 'g', 'L', 'ml', 'pieces', 'pack', 'dozen']
  },
  description: {
    type: 'string',
    maxLength: 500
  },
  image: {
    type: 'string',
    format: 'url'
  },
  brand: {
    type: 'string'
  },
  tags: {
    type: 'array',
    items: 'string'
  },
  nutritionalInfo: {
    type: 'object',
    properties: {
      calories: 'number',
      protein: 'number',
      carbs: 'number',
      fat: 'number',
      fiber: 'number'
    }
  },
  isOrganic: {
    type: 'boolean',
    default: false
  },
  isFeatured: {
    type: 'boolean',
    default: false
  },
  rating: {
    type: 'number',
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: 'number',
    default: 0
  },
  sales: {
    type: 'number',
    default: 0
  },
  revenue: {
    type: 'number',
    default: 0
  },
  status: {
    type: 'string',
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
  createdAt: {
    type: 'date',
    default: 'now'
  },
  updatedAt: {
    type: 'date',
    default: 'now'
  }
};

// Dynamic Product Database
export const productDatabase = [
  // Fruits & Vegetables
  {
    category: 'Fruits & Vegetables',
    products: [
      { name: 'Fresh Bananas', unit: 'kg', basePrice: [40, 60], organic: true },
      { name: 'Red Apples', unit: 'kg', basePrice: [120, 180], organic: true },
      { name: 'Fresh Tomatoes', unit: 'kg', basePrice: [30, 50], organic: false },
      { name: 'Green Capsicum', unit: 'kg', basePrice: [60, 90], organic: false },
      { name: 'Fresh Onions', unit: 'kg', basePrice: [25, 40], organic: false },
      { name: 'Organic Carrots', unit: 'kg', basePrice: [50, 80], organic: true },
      { name: 'Fresh Spinach', unit: 'kg', basePrice: [20, 35], organic: true },
      { name: 'Cucumber', unit: 'kg', basePrice: [30, 50], organic: false },
      { name: 'Fresh Lemons', unit: 'kg', basePrice: [60, 100], organic: false },
      { name: 'Potato', unit: 'kg', basePrice: [20, 35], organic: false }
    ]
  },
  // Dairy & Eggs
  {
    category: 'Dairy & Eggs',
    products: [
      { name: 'Full Cream Milk', unit: 'L', basePrice: [55, 70], brand: 'Mother Dairy' },
      { name: 'Fresh Paneer', unit: 'g', basePrice: [80, 120], weight: 200 },
      { name: 'Farm Fresh Eggs', unit: 'dozen', basePrice: [60, 90] },
      { name: 'Greek Yogurt', unit: 'g', basePrice: [40, 60], weight: 400 },
      { name: 'Mozzarella Cheese', unit: 'g', basePrice: [150, 220], weight: 200 },
      { name: 'Fresh Butter', unit: 'g', basePrice: [45, 65], weight: 100 },
      { name: 'Toned Milk', unit: 'L', basePrice: [50, 65], brand: 'Amul' },
      { name: 'Curd', unit: 'g', basePrice: [25, 40], weight: 400 }
    ]
  },
  // Snacks & Beverages
  {
    category: 'Snacks & Beverages',
    products: [
      { name: 'Potato Chips', unit: 'g', basePrice: [20, 40], weight: 50, brand: 'Lays' },
      { name: 'Chocolate Cookies', unit: 'g', basePrice: [30, 50], weight: 100, brand: 'Parle' },
      { name: 'Green Tea', unit: 'g', basePrice: [150, 250], weight: 100, brand: 'Twinings' },
      { name: 'Masala Chai', unit: 'g', basePrice: [80, 120], weight: 250, brand: 'Tata Tea' },
      { name: 'Mixed Nuts', unit: 'g', basePrice: [200, 350], weight: 200 },
      { name: 'Fruit Juice', unit: 'L', basePrice: [80, 120], brand: 'Real' },
      { name: 'Energy Drink', unit: 'ml', basePrice: [40, 60], weight: 250, brand: 'Red Bull' },
      { name: 'Biscuits', unit: 'g', basePrice: [25, 45], weight: 150, brand: 'Britannia' }
    ]
  },
  // Grains & Cereals
  {
    category: 'Grains & Cereals',
    products: [
      { name: 'Basmati Rice', unit: 'kg', basePrice: [120, 200], organic: true },
      { name: 'Whole Wheat Flour', unit: 'kg', basePrice: [40, 60], organic: false },
      { name: 'Brown Rice', unit: 'kg', basePrice: [80, 120], organic: true },
      { name: 'Quinoa', unit: 'g', basePrice: [200, 350], weight: 500, organic: true },
      { name: 'Oats', unit: 'g', basePrice: [80, 120], weight: 500, brand: 'Quaker' },
      { name: 'Chana Dal', unit: 'kg', basePrice: [80, 120] },
      { name: 'Masoor Dal', unit: 'kg', basePrice: [100, 150] },
      { name: 'Rajma', unit: 'kg', basePrice: [120, 180] }
    ]
  },
  // Meat & Seafood
  {
    category: 'Meat & Seafood',
    products: [
      { name: 'Fresh Chicken Breast', unit: 'kg', basePrice: [250, 350] },
      { name: 'Mutton Curry Cut', unit: 'kg', basePrice: [600, 800] },
      { name: 'Fresh Fish (Rohu)', unit: 'kg', basePrice: [200, 300] },
      { name: 'Prawns Medium', unit: 'kg', basePrice: [400, 600] },
      { name: 'Chicken Legs', unit: 'kg', basePrice: [180, 250] },
      { name: 'Fish Fillet', unit: 'kg', basePrice: [300, 450] }
    ]
  }
];

// Dynamic Product Generator
export class DynamicProductGenerator {
  constructor() {
    this.productCounter = 1000;
    this.productHistory = new Map();
  }

  generateProductId() {
    return `PROD-${String(this.productCounter++).padStart(4, '0')}`;
  }

  generateRandomProduct() {
    // Select random category
    const categoryData = productDatabase[Math.floor(Math.random() * productDatabase.length)];
    const productTemplate = categoryData.products[Math.floor(Math.random() * categoryData.products.length)];
    
    // Generate dynamic pricing
    const basePrice = Array.isArray(productTemplate.basePrice) 
      ? Math.floor(Math.random() * (productTemplate.basePrice[1] - productTemplate.basePrice[0]) + productTemplate.basePrice[0])
      : productTemplate.basePrice;
    
    const hasDiscount = Math.random() > 0.7;
    const discount = hasDiscount ? Math.floor(Math.random() * 30) + 5 : 0;
    const originalPrice = hasDiscount ? Math.floor(basePrice * (1 + discount / 100)) : basePrice;
    
    // Generate stock and sales data
    const stock = Math.floor(Math.random() * 100) + 10;
    const sales = Math.floor(Math.random() * 50) + 5;
    const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 - 5.0
    const reviews = Math.floor(Math.random() * 100) + 10;
    
    const product = {
      id: this.generateProductId(),
      name: `${productTemplate.name}${productTemplate.weight ? ` (${productTemplate.weight}${productTemplate.unit})` : ` (1${productTemplate.unit})`}`,
      category: categoryData.category,
      price: basePrice,
      originalPrice: hasDiscount ? originalPrice : null,
      discount: discount,
      stock: stock,
      unit: productTemplate.unit,
      description: `Fresh and high quality ${productTemplate.name.toLowerCase()}`,
      brand: productTemplate.brand || 'Fresh Market',
      isOrganic: productTemplate.organic || false,
      isFeatured: Math.random() > 0.8,
      rating: parseFloat(rating),
      reviews: reviews,
      sales: sales,
      revenue: sales * basePrice,
      status: stock > 5 ? 'active' : stock > 0 ? 'low_stock' : 'out_of_stock',
      tags: this.generateTags(productTemplate.name, categoryData.category),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };

    return product;
  }

  generateTags(productName, category) {
    const commonTags = ['fresh', 'quality', 'healthy'];
    const categoryTags = {
      'Fruits & Vegetables': ['natural', 'vitamin-rich', 'farm-fresh'],
      'Dairy & Eggs': ['protein-rich', 'calcium', 'fresh'],
      'Snacks & Beverages': ['tasty', 'convenient', 'quick'],
      'Grains & Cereals': ['nutritious', 'fiber-rich', 'energy'],
      'Meat & Seafood': ['protein', 'premium', 'fresh-cut']
    };
    
    return [
      ...commonTags.slice(0, Math.floor(Math.random() * 2) + 1),
      ...(categoryTags[category] || []).slice(0, Math.floor(Math.random() * 2) + 1)
    ];
  }

  generateMultipleProducts(count = 5) {
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push(this.generateRandomProduct());
    }
    return products.sort((a, b) => b.revenue - a.revenue);
  }

  updateProductSales(productId, additionalSales) {
    if (this.productHistory.has(productId)) {
      const product = this.productHistory.get(productId);
      product.sales += additionalSales;
      product.revenue = product.sales * product.price;
      product.updatedAt = new Date();
      return product;
    }
    return null;
  }

  getProductsByCategory(category) {
    const categoryData = productDatabase.find(cat => cat.category === category);
    if (!categoryData) return [];
    
    return categoryData.products.map(template => {
      const product = this.generateRandomProduct();
      product.category = category;
      return product;
    });
  }

  getFeaturedProducts(count = 3) {
    const products = this.generateMultipleProducts(count * 2);
    return products
      .filter(product => product.isFeatured || product.rating >= 4.0)
      .slice(0, count);
  }

  getLowStockProducts() {
    const products = this.generateMultipleProducts(10);
    return products.filter(product => product.stock <= 10 && product.stock > 0);
  }

  getTopSellingProducts(count = 5) {
    return this.generateMultipleProducts(count);
  }
}

// Export singleton instance
export const productGenerator = new DynamicProductGenerator();

// Validation function
export const validateProduct = (product) => {
  const errors = [];
  
  if (!product.name || product.name.length === 0) {
    errors.push('Product name is required');
  }
  
  if (!product.category) {
    errors.push('Category is required');
  }
  
  if (!product.price || product.price <= 0) {
    errors.push('Price must be greater than 0');
  }
  
  if (!product.stock || product.stock < 0) {
    errors.push('Stock cannot be negative');
  }
  
  if (product.discount && (product.discount < 0 || product.discount > 100)) {
    errors.push('Discount must be between 0 and 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  productSchema,
  productDatabase,
  DynamicProductGenerator,
  productGenerator,
  validateProduct
};
