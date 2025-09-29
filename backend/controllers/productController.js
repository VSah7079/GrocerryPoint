const Product = require('../models/Product');

// @desc    Get all products with advanced search and filtering
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search = '',
      category = '',
      minPrice = '',
      maxPrice = '',
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
      featured = '',
      inStock = '',
      tags = ''
    } = req.query;

    // Build query object
    const query = {};

    // Text search in name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Featured filter
    if (featured !== '') {
      query.isFeatured = featured === 'true';
    }

    // In stock filter
    if (inStock !== '') {
      if (inStock === 'true') {
        query.stock = { $gt: 0 };
      } else {
        query.stock = 0;
      }
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Sorting options
    const sortOptions = {};
    const validSortFields = ['name', 'price', 'createdAt', 'ratings', 'numReviews'];
    
    if (validSortFields.includes(sortBy)) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default sort
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with population
    const products = await Product.find(query)
      .populate('category', 'name description')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    // Calculate price range for frontend
    const priceAggregation = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    const priceRange = priceAggregation[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 };

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalProducts: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        limit: limitNum
      },
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        sortBy,
        order,
        featured,
        inStock,
        tags
      },
      priceRange: {
        min: Math.floor(priceRange.minPrice || 0),
        max: Math.ceil(priceRange.maxPrice || 1000),
        avg: Math.round(priceRange.avgPrice || 0)
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    
    // Add initial stock log entry
    if (product.stock > 0) {
      product.stockHistory = [{
        type: 'initial',
        quantity: product.stock,
        reason: 'Initial stock setup',
        performedBy: req.user._id,
        date: new Date()
      }];
    }
    
    await product.save();
    await product.populate('category');
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc    Search products with advanced filters
// @route   POST /api/products/search
// @access  Public
exports.searchProducts = async (req, res, next) => {
  try {
    const {
      query = '',
      filters = {},
      sort = { field: 'createdAt', order: 'desc' },
      page = 1,
      limit = 12
    } = req.body;

    const searchQuery = {};

    // Advanced text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Apply filters
    if (filters.category && filters.category.length > 0) {
      searchQuery.category = { $in: filters.category };
    }

    if (filters.priceRange) {
      searchQuery.price = {
        $gte: filters.priceRange.min || 0,
        $lte: filters.priceRange.max || 999999
      };
    }

    if (filters.rating) {
      searchQuery.ratings = { $gte: filters.rating };
    }

    if (filters.featured !== undefined) {
      searchQuery.isFeatured = filters.featured;
    }

    if (filters.inStock) {
      searchQuery.stock = { $gt: 0 };
    }

    if (filters.tags && filters.tags.length > 0) {
      searchQuery.tags = { $in: filters.tags };
    }

    // Sorting
    const sortOptions = {};
    const validSortFields = ['name', 'price', 'createdAt', 'ratings', 'numReviews'];
    
    if (validSortFields.includes(sort.field)) {
      sortOptions[sort.field] = sort.order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    // Add text search score for relevance sorting
    if (query) {
      sortOptions.score = { $meta: 'textScore' };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute search
    const products = await Product.find(searchQuery)
      .populate('category', 'name description image')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(searchQuery);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProducts: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      searchQuery: query,
      appliedFilters: filters
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 12, sort = 'createdAt', order = 'desc' } = req.query;

    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find({ category: categoryId })
      .populate('category', 'name description image')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments({ category: categoryId });

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProducts: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ isFeatured: true, stock: { $gt: 0 } })
      .populate('category', 'name description')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get product suggestions (related products)
// @route   GET /api/products/:id/suggestions
// @access  Public
exports.getProductSuggestions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 6 } = req.query;

    // Get current product to find related products
    const currentProduct = await Product.findById(id).populate('category');
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Find products in same category, excluding current product
    const suggestions = await Product.find({
      category: currentProduct.category._id,
      _id: { $ne: id },
      stock: { $gt: 0 }
    })
      .populate('category', 'name description')
      .sort({ ratings: -1, numReviews: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: suggestions,
      baseProduct: {
        id: currentProduct._id,
        name: currentProduct.name,
        category: currentProduct.category.name
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get top-rated products
// @route   GET /api/products/top-rated
// @access  Public
exports.getTopRatedProducts = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ ratings: { $gte: 4 }, numReviews: { $gt: 0 } })
      .populate('category', 'name description')
      .sort({ ratings: -1, numReviews: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (err) {
    next(err);
  }
};

// ==================== INVENTORY MANAGEMENT ====================

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Admin
exports.updateStock = async (req, res, next) => {
  try {
    const { quantity, type = 'manual', reason = 'Stock adjustment' } = req.body;
    const { id } = req.params;

    if (!quantity || quantity === 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity is required and cannot be zero'
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const previousStock = product.stock;
    let newStock = previousStock;

    // Handle different stock update types
    if (type === 'add') {
      newStock = previousStock + Math.abs(quantity);
    } else if (type === 'remove') {
      newStock = Math.max(0, previousStock - Math.abs(quantity));
    } else if (type === 'set') {
      newStock = Math.max(0, quantity);
    }

    product.stock = newStock;
    product.updatedAt = new Date();

    // Add to stock history
    if (!product.stockHistory) {
      product.stockHistory = [];
    }

    product.stockHistory.push({
      type: type,
      quantity: quantity,
      previousStock: previousStock,
      newStock: newStock,
      reason: reason,
      performedBy: req.user._id,
      date: new Date()
    });

    await product.save();

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        productId: product._id,
        productName: product.name,
        previousStock: previousStock,
        newStock: newStock,
        change: newStock - previousStock,
        lastUpdated: product.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get low stock products
// @route   GET /api/products/inventory/low-stock
// @access  Admin
exports.getLowStockProducts = async (req, res, next) => {
  try {
    const { threshold = 5, page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const lowStockProducts = await Product.find({
      stock: { $lte: parseInt(threshold) }
    })
      .populate('category', 'name')
      .sort({ stock: 1, updatedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments({ stock: { $lte: parseInt(threshold) } });

    res.json({
      success: true,
      data: lowStockProducts,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProducts: total,
        threshold: parseInt(threshold)
      },
      summary: {
        totalLowStockProducts: total,
        outOfStockProducts: await Product.countDocuments({ stock: 0 })
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get stock history for a product
// @route   GET /api/products/:id/stock-history
// @access  Admin
exports.getStockHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const product = await Product.findById(id)
      .select('name stock stockHistory')
      .populate('stockHistory.performedBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const stockHistory = product.stockHistory || [];
    const sortedHistory = stockHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedHistory = sortedHistory.slice(startIndex, endIndex);

    res.json({
      success: true,
      product: {
        id: product._id,
        name: product.name,
        currentStock: product.stock
      },
      data: paginatedHistory,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(stockHistory.length / limitNum),
        totalEntries: stockHistory.length
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Bulk stock update
// @route   PUT /api/products/inventory/bulk-update
// @access  Admin
exports.bulkUpdateStock = async (req, res, next) => {
  try {
    const { updates, reason = 'Bulk stock update' } = req.body;
    
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Updates array is required'
      });
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        const { productId, quantity, type = 'set' } = update;
        
        const product = await Product.findById(productId);
        if (!product) {
          errors.push({ productId, error: 'Product not found' });
          continue;
        }

        const previousStock = product.stock;
        let newStock = previousStock;

        if (type === 'add') {
          newStock = previousStock + Math.abs(quantity);
        } else if (type === 'remove') {
          newStock = Math.max(0, previousStock - Math.abs(quantity));
        } else if (type === 'set') {
          newStock = Math.max(0, quantity);
        }

        product.stock = newStock;

        // Add to stock history
        if (!product.stockHistory) {
          product.stockHistory = [];
        }

        product.stockHistory.push({
          type: type,
          quantity: quantity,
          previousStock: previousStock,
          newStock: newStock,
          reason: reason,
          performedBy: req.user._id,
          date: new Date()
        });

        await product.save();

        results.push({
          productId: product._id,
          productName: product.name,
          previousStock: previousStock,
          newStock: newStock,
          success: true
        });

      } catch (error) {
        errors.push({ 
          productId: update.productId, 
          error: error.message 
        });
      }
    }

    res.json({
      success: true,
      message: `Bulk update completed. ${results.length} products updated successfully.`,
      results: results,
      errors: errors,
      summary: {
        totalProcessed: updates.length,
        successful: results.length,
        failed: errors.length
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get inventory summary
// @route   GET /api/products/inventory/summary
// @access  Admin
exports.getInventorySummary = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ stock: { $gt: 0 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5, $gt: 0 } });

    // Get total inventory value
    const inventoryValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          totalStock: { $sum: '$stock' }
        }
      }
    ]);

    // Get top categories by stock
    const categoryStock = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$category',
          categoryName: { $first: '$categoryInfo.name' },
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      },
      { $sort: { totalStock: -1 } },
      { $limit: 5 }
    ]);

    const summary = {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      lowStockProducts,
      inventoryValue: inventoryValue[0]?.totalValue || 0,
      totalStockUnits: inventoryValue[0]?.totalStock || 0,
      stockPercentages: {
        inStock: Math.round((inStockProducts / totalProducts) * 100),
        outOfStock: Math.round((outOfStockProducts / totalProducts) * 100),
        lowStock: Math.round((lowStockProducts / totalProducts) * 100)
      },
      topCategories: categoryStock
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reserve stock for order (internal function)
// @access  Private (used by order system)
exports.reserveStock = async (orderItems, session = null) => {
  try {
    const reservations = [];
    
    for (const item of orderItems) {
      const product = await Product.findById(item.product).session(session);
      
      if (!product) {
        throw new Error(`Product ${item.product} not found`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
      }
      
      // Reserve stock
      product.stock -= item.quantity;
      
      // Add to stock history
      if (!product.stockHistory) {
        product.stockHistory = [];
      }
      
      product.stockHistory.push({
        type: 'reserved',
        quantity: -item.quantity,
        previousStock: product.stock + item.quantity,
        newStock: product.stock,
        reason: 'Stock reserved for order',
        date: new Date()
      });
      
      await product.save({ session });
      
      reservations.push({
        productId: product._id,
        quantity: item.quantity,
        newStock: product.stock
      });
    }
    
    return { success: true, reservations };
  } catch (error) {
    throw error;
  }
};
