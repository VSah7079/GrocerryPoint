const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Product image uploads (Admin only)
router.post('/product', protect, admin, uploadController.uploadProductImage);
router.post('/product-gallery', protect, admin, uploadController.uploadProductGallery);

// Category image upload (Admin only)
router.post('/category', protect, admin, uploadController.uploadCategoryImage);

// User avatar upload (Authenticated users)
router.post('/avatar', protect, uploadController.uploadUserAvatar);

// File management (Admin only)
router.delete('/:filename', protect, admin, uploadController.deleteFile);
router.get('/list', protect, admin, uploadController.listFiles);

// Public file info
router.get('/info/:filename', uploadController.getFileInfo);

module.exports = router;