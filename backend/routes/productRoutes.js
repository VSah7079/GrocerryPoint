const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/top-rated', productController.getTopRatedProducts);
router.post('/search', productController.searchProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);
router.get('/:id/suggestions', productController.getProductSuggestions);

// Admin routes
router.post('/', protect, admin, productController.createProduct);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

// Inventory management routes (Admin only)
router.put('/:id/stock', protect, admin, productController.updateStock);
router.get('/inventory/low-stock', protect, admin, productController.getLowStockProducts);
router.get('/inventory/summary', protect, admin, productController.getInventorySummary);
router.get('/:id/stock-history', protect, admin, productController.getStockHistory);
router.put('/inventory/bulk-update', protect, admin, productController.bulkUpdateStock);

module.exports = router;
