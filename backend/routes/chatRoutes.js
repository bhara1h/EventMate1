const express = require('express');
const router = express.Router();
const { getEventMessages } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

// Get all messages for a specific event
// We use 'protect' to ensure only logged-in users can view it.
// (In a production app, we would also verify if the user is registered or the organizer)
router.get('/:eventId', protect, getEventMessages);

module.exports = router;
