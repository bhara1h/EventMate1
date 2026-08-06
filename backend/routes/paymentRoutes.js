const express = require('express');
const router = express.Router();
const { createOrder, manualSubmitPayment, processRefund, verifyManualPayment, getOrganizerPendingPayments } = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/pending', protect, authorize('Organizer'), getOrganizerPendingPayments);
router.post('/create-order', protect, authorize('Student'), createOrder);
router.post('/manual-submit', protect, authorize('Student'), manualSubmitPayment);
router.post('/:paymentId/verify-manual', protect, authorize('Organizer'), verifyManualPayment);
router.post('/:registrationId/refund', protect, authorize('Organizer'), processRefund);

module.exports = router;
