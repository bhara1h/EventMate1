const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/create-order', protect, authorize('Student'), createOrder);
router.post('/verify', protect, authorize('Student'), verifyPayment);

module.exports = router;
