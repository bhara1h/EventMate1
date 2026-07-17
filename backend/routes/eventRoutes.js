const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, getMyEvents, getMyTickets, scanAttendance } = require('../controllers/eventController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, authorize('Organizer', 'Admin'), createEvent);

router.get('/myevents', protect, authorize('Organizer'), getMyEvents);
router.get('/mytickets', protect, authorize('Student'), getMyTickets);
router.post('/scan-attendance', protect, authorize('Organizer', 'Admin'), scanAttendance);

router.route('/:id')
  .get(getEventById);

module.exports = router;
