const express = require('express');
const { getAddresses, addAddress, deleteAddress } = require('../controllers/addressController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', protect, getAddresses);
router.post('/', protect, addAddress);
router.delete('/:id', protect, deleteAddress);

module.exports = router; 