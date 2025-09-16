// Mock Products Data - Complete product catalog for frontend-only mode

const mockProducts = [
  {
    _id: "prod001",
    name: "Basmati Rice",
    description: "Premium quality basmati rice with long grains and aromatic fragrance. Perfect for biryanis and daily meals.",
    price: 120,
    originalPrice: 150,
    category: "Grains & Rice",
    subcategory: "Rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400"
    ],
    inStock: true,
    quantity: 50,
    unit: "kg",
    brand: "India Gate",
    rating: 4.5,
    reviews: 234,
    discount: 20,
    isOrganic: false,
    nutritionInfo: {
      calories: "130 per 100g",
      protein: "2.7g",
      carbs: "28g",
      fat: "0.3g"
    },
    tags: ["basmati", "rice", "premium", "aromatic"],
    isFeatured: true,
    bestseller: true
  },
  {
    _id: "prod002", 
    name: "Whole Wheat Flour",
    description: "100% whole wheat flour (atta) ground from selected wheat grains. Rich in fiber and nutrients.",
    price: 45,
    originalPrice: 50,
    category: "Grains & Rice",
    subcategory: "Flour",
    image: "https://images.unsplash.com/photo-1549068106-b024baf5062d?w=400",
    images: [
      "https://images.unsplash.com/photo-1549068106-b024baf5062d?w=400",
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
    ],
    inStock: true,
    quantity: 100,
    unit: "kg",
    brand: "Aashirvaad",
    rating: 4.3,
    reviews: 567,
    discount: 10,
    isOrganic: false,
    nutritionInfo: {
      calories: "340 per 100g",
      protein: "12g",
      carbs: "72g",
      fat: "1.5g",
      fiber: "12g"
    },
    tags: ["wheat", "flour", "atta", "healthy"],
    isFeatured: true,
    bestseller: false
  },
  {
    _id: "prod003",
    name: "Sunflower Cooking Oil",
    description: "Pure and refined sunflower oil for healthy cooking. Light taste and heart-friendly.",
    price: 180,
    originalPrice: 200,
    category: "Oil & Ghee",
    subcategory: "Cooking Oil",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"
    ],
    inStock: true,
    quantity: 30,
    unit: "L",
    brand: "Fortune",
    rating: 4.2,
    reviews: 345,
    discount: 10,
    isOrganic: false,
    nutritionInfo: {
      calories: "884 per 100ml",
      fat: "100g",
      vitaminE: "41.08mg"
    },
    tags: ["sunflower", "oil", "cooking", "refined"],
    isFeatured: true,
    bestseller: true
  },
  {
    _id: "prod004",
    name: "Organic Turmeric Powder",
    description: "Pure organic turmeric powder with high curcumin content. Perfect for cooking and health benefits.",
    price: 85,
    originalPrice: 100,
    category: "Spices",
    subcategory: "Powder Spices",
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400",
    images: [
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400",
      "https://images.unsplash.com/photo-1609501676725-7186f32a6c50?w=400"
    ],
    inStock: true,
    quantity: 25,
    unit: "g",
    brand: "Organic India",
    rating: 4.7,
    reviews: 189,
    discount: 15,
    isOrganic: true,
    nutritionInfo: {
      calories: "312 per 100g",
      protein: "9.68g",
      carbs: "67.14g",
      curcumin: "3-5%"
    },
    tags: ["turmeric", "organic", "spice", "curcumin", "healthy"],
    isFeatured: true,
    bestseller: false
  },
  {
    _id: "prod005",
    name: "Fresh Milk",
    description: "Farm fresh full cream milk, pasteurized and homogenized. Rich in calcium and proteins.",
    price: 60,
    originalPrice: 65,
    category: "Dairy Products",
    subcategory: "Milk",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
    images: [
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400"
    ],
    inStock: true,
    quantity: 40,
    unit: "L",
    brand: "Amul",
    rating: 4.4,
    reviews: 678,
    discount: 8,
    isOrganic: false,
    nutritionInfo: {
      calories: "60 per 100ml",
      protein: "3.2g",
      carbs: "4.6g",
      fat: "3.2g",
      calcium: "113mg"
    },
    tags: ["milk", "dairy", "fresh", "calcium", "protein"],
    isFeatured: false,
    bestseller: true
  },
  {
    _id: "prod006",
    name: "Mixed Dal Pack",
    description: "Combo pack of 4 essential dals - Toor, Moong, Masoor, and Chana dal. Perfect for daily nutrition.",
    price: 320,
    originalPrice: 380,
    category: "Pulses & Lentils",
    subcategory: "Dal Combo",
    image: "https://images.unsplash.com/photo-1583225214464-9296029427aa?w=400",
    images: [
      "https://images.unsplash.com/photo-1583225214464-9296029427aa?w=400",
      "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400"
    ],
    inStock: true,
    quantity: 20,
    unit: "kg",
    brand: "Tata Sampann",
    rating: 4.6,
    reviews: 423,
    discount: 16,
    isOrganic: false,
    nutritionInfo: {
      calories: "340 per 100g",
      protein: "23g",
      carbs: "60g",
      fiber: "18g"
    },
    tags: ["dal", "lentils", "protein", "combo", "healthy"],
    isFeatured: true,
    bestseller: false
  },
  {
    _id: "prod007",
    name: "Green Tea Bags",
    description: "Premium green tea bags with natural antioxidants. Refreshing and healthy beverage option.",
    price: 250,
    originalPrice: 300,
    category: "Beverages",
    subcategory: "Tea",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400"
    ],
    inStock: true,
    quantity: 60,
    unit: "pcs",
    brand: "Tetley",
    rating: 4.1,
    reviews: 234,
    discount: 17,
    isOrganic: true,
    nutritionInfo: {
      calories: "2 per bag",
      antioxidants: "High",
      caffeine: "25mg"
    },
    tags: ["green tea", "antioxidants", "healthy", "organic", "beverage"],
    isFeatured: false,
    bestseller: false
  },
  {
    _id: "prod008",
    name: "Honey (Raw & Unprocessed)",
    description: "100% pure and natural honey, raw and unprocessed. Perfect sweetener with health benefits.",
    price: 450,
    originalPrice: 500,
    category: "Sweeteners",
    subcategory: "Natural Sweeteners",
    image: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400",
    images: [
      "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400",
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400"
    ],
    inStock: true,
    quantity: 15,
    unit: "kg",
    brand: "Dabur",
    rating: 4.8,
    reviews: 567,
    discount: 10,
    isOrganic: true,
    nutritionInfo: {
      calories: "304 per 100g",
      carbs: "82.4g",
      sugars: "82.12g",
      vitamins: "B6, C, niacin"
    },
    tags: ["honey", "natural", "organic", "raw", "sweetener", "healthy"],
    isFeatured: true,
    bestseller: true
  }
];

// Mock Product API Class
export class MockProductAPI {
  static async getAllProducts(params = {}) {
    // Simulate filtering and pagination
    let filteredProducts = [...mockProducts];
    
    // Filter by category
    if (params.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase().includes(params.category.toLowerCase())
      );
    }
    
    // Filter by search query
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by price range
    if (params.minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseInt(params.minPrice));
    }
    if (params.maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseInt(params.maxPrice));
    }
    
    // Filter by organic
    if (params.organic === 'true') {
      filteredProducts = filteredProducts.filter(product => product.isOrganic === true);
    }
    
    // Sort products
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // Default sort by featured and bestsellers
          filteredProducts.sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            if (a.bestseller && !b.bestseller) return -1;
            if (!a.bestseller && b.bestseller) return 1;
            return 0;
          });
      }
    }
    
    // Pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredProducts.length / limit),
          totalProducts: filteredProducts.length,
          hasNext: endIndex < filteredProducts.length,
          hasPrev: page > 1
        }
      }
    };
  }
  
  static async getProductById(id) {
    const product = mockProducts.find(p => p._id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    return {
      success: true,
      data: { product }
    };
  }
  
  static async getFeaturedProducts(limit = 6) {
    const featuredProducts = mockProducts
      .filter(product => product.isFeatured)
      .slice(0, limit);
    
    return {
      success: true,
      data: { products: featuredProducts }
    };
  }
  
  static async getProductsByCategory(category) {
    const categoryProducts = mockProducts.filter(product =>
      product.category.toLowerCase().includes(category.toLowerCase())
    );
    
    return {
      success: true,
      data: { products: categoryProducts }
    };
  }
  
  static async getProductStats() {
    const totalProducts = mockProducts.length;
    const categories = [...new Set(mockProducts.map(p => p.category))];
    const avgRating = mockProducts.reduce((sum, p) => sum + p.rating, 0) / totalProducts;
    const totalReviews = mockProducts.reduce((sum, p) => sum + p.reviews, 0);
    
    return {
      success: true,
      data: {
        totalProducts,
        totalCategories: categories.length,
        averageRating: avgRating.toFixed(1),
        totalReviews,
        categories
      }
    };
  }
}

export default mockProducts;