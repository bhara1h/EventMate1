const express = require('express');
const router = express.Router();
const { getPendingEvents, updateEventStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('Admin'));

router.get('/events/pending', getPendingEvents);
router.put('/events/:id/status', updateEventStatus);

module.exports = router;
