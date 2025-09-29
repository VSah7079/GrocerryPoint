const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch categories'
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    res.json({
      success: true,
      data: category
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch category'
    });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists'
      });
    }
    
    const category = await Category.create({
      name: name.trim(),
      description: description?.trim(),
      image
    });
    
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to create category'
    });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Admin
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    // Check if name is being changed and if new name already exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          error: 'Category name already exists'
        });
      }
    }
    
    // Update fields
    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description?.trim();
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;
    
    await category.save();
    
    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to update category'
    });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    // Check if category is being used by products
    const Product = require('../models/Product');
    const productsUsingCategory = await Product.countDocuments({ 
      category: req.params.id 
    });
    
    if (productsUsingCategory > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete category. ${productsUsingCategory} products are using this category.`
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to delete category'
    });
  }
};
