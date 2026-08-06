const express = require('express');
const router = express.Router();
const { getPendingEvents, updateEventStatus, getAllUsers, toggleUserSuspend, verifyOrganizer, deleteEvent } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('Admin'));

router.get('/events/pending', getPendingEvents);
router.put('/events/:id/status', updateEventStatus);
router.delete('/events/:id', deleteEvent);

router.get('/users', getAllUsers);
router.put('/users/:id/suspend', toggleUserSuspend);
router.put('/users/:id/verify', verifyOrganizer);

module.exports = router;
