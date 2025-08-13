const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  getTopSellingProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getProductStats
} = require('../controllers/productController');

// Statistics and special endpoints (must come before /:id)
router.get('/stats', getProductStats);
router.get('/categories', getAllCategories);
router.get('/top-selling', getTopSellingProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);

// CRUD routes (/:id must come last)
router.get('/', getAllProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router; 