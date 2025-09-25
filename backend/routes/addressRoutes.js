const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, addressController.getAddresses);
router.get('/:id', protect, addressController.getAddressById);
router.post('/', protect, addressController.createAddress);
router.put('/:id', protect, addressController.updateAddress);
router.delete('/:id', protect, addressController.deleteAddress);

module.exports = router;
