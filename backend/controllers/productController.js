const { productGenerator, productDatabase } = require('../schemas/productSchema');

// Get all products with dynamic generation
exports.getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search, 
      sortBy = 'name', 
      sortOrder = 'asc',
      minPrice,
      maxPrice,
      isOrganic,
      isFeatured
    } = req.query;

    // Generate all products from database
    let allProducts = [];
    
    productDatabase.forEach(categoryData => {
      const categoryProducts = categoryData.products.map(template => {
        const product = productGenerator.generateRandomProduct();
        // Override with template data for consistency
        product.category = categoryData.category;
        product.name = template.name + (template.weight ? ` (${template.weight}${template.unit})` : ` (1${template.unit})`);
        product.unit = template.unit;
        product.brand = template.brand || 'Fresh Market';
        product.isOrganic = template.organic || false;
        
        // Set realistic price from template
        const basePrice = Array.isArray(template.basePrice) 
          ? Math.floor(Math.random() * (template.basePrice[1] - template.basePrice[0]) + template.basePrice[0])
          : template.basePrice;
        product.price = basePrice;
        
        return product;
      });
      allProducts = [...allProducts, ...categoryProducts];
    });

    // Apply filters
    let filteredProducts = allProducts;

    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (isOrganic !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.isOrganic === (isOrganic === 'true'));
    }

    if (isFeatured !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.isFeatured === (isFeatured === 'true'));
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredProducts.length / limit),
          totalProducts: filteredProducts.length,
          hasNext: endIndex < filteredProducts.length,
          hasPrev: startIndex > 0
        },
        filters: {
          categories: [...new Set(allProducts.map(p => p.category))],
          priceRange: {
            min: Math.min(...allProducts.map(p => p.price)),
            max: Math.max(...allProducts.map(p => p.price))
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Generate a specific product (in real app, this would fetch from database)
    const product = productGenerator.generateRandomProduct();
    product.id = id;
    
    res.json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Generate new product with provided data
    const newProduct = productGenerator.generateRandomProduct();
    Object.assign(newProduct, productData);
    newProduct.createdAt = new Date();
    newProduct.updatedAt = new Date();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product: newProduct
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};
// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Generate updated product
    const updatedProduct = productGenerator.generateRandomProduct();
    Object.assign(updatedProduct, updateData);
    updatedProduct.id = id;
    updatedProduct.updatedAt = new Date();
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product: updatedProduct
      }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: {
        deletedId: id
      }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = productDatabase.map(categoryData => ({
      name: categoryData.category,
      productCount: categoryData.products.length,
      products: categoryData.products.map(p => p.name)
    }));
    
    res.json({
      success: true,
      data: {
        categories,
        totalCategories: categories.length
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Get top selling products
exports.getTopSellingProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const topProducts = productGenerator.getTopSellingProducts(parseInt(limit));
    
    res.json({
      success: true,
      data: {
        products: topProducts,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top selling products',
      error: error.message
    });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const featuredProducts = productGenerator.getFeaturedProducts(parseInt(limit));
    
    res.json({
      success: true,
      data: {
        products: featuredProducts,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const categoryData = productDatabase.find(cat => 
      cat.category.toLowerCase() === category.toLowerCase()
    );

    if (!categoryData) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const products = categoryData.products.slice(0, limit).map(template => {
      const product = productGenerator.generateRandomProduct();
      product.category = categoryData.category;
      product.name = template.name + (template.weight ? ` (${template.weight}${template.unit})` : ` (1${template.unit})`);
      product.unit = template.unit;
      product.brand = template.brand || 'Fresh Market';
      product.isOrganic = template.organic || false;
      
      const basePrice = Array.isArray(template.basePrice) 
        ? Math.floor(Math.random() * (template.basePrice[1] - template.basePrice[0]) + template.basePrice[0])
        : template.basePrice;
      product.price = basePrice;
      
      return product;
    });
    res.json({
      success: true,
      data: {
        category: categoryData.category,
        products: products,
        totalCount: categoryData.products.length
      }
    });
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category products',
      error: error.message
    });
  }
};

// Get product statistics
exports.getProductStats = async (req, res) => {
  try {
    const allProducts = [];
    productDatabase.forEach(categoryData => {
      const categoryProducts = categoryData.products.map(() => 
        productGenerator.generateRandomProduct()
      );
      allProducts.push(...categoryProducts);
    });

    const totalProducts = allProducts.length;
    const totalCategories = productDatabase.length;
    const avgPrice = allProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts;
    const totalRevenue = allProducts.reduce((sum, p) => sum + p.revenue, 0);
    const totalSales = allProducts.reduce((sum, p) => sum + p.sales, 0);
    
    const categoryStats = productDatabase.map(categoryData => ({
      category: categoryData.category,
      productCount: categoryData.products.length,
      percentage: ((categoryData.products.length / totalProducts) * 100).toFixed(1)
    }));

    const stockStatus = {
      inStock: allProducts.filter(p => p.stock > 10).length,
      lowStock: allProducts.filter(p => p.stock <= 10 && p.stock > 0).length,
      outOfStock: allProducts.filter(p => p.stock === 0).length
    };

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalCategories,
          avgPrice: Math.round(avgPrice),
          totalRevenue,
          totalSales
        },
        categoryStats,
        stockStatus,
        priceRange: {
          min: Math.min(...allProducts.map(p => p.price)),
          max: Math.max(...allProducts.map(p => p.price))
        },
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching product stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product stats',
      error: error.message
    });
  }
}; 