const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  getMyEvents, 
  getMyTickets, 
  scanAttendance,
  getOrganizerStats,
  getEventRegistrations,
  assignCertificate
} = require('../controllers/eventController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, authorize('Organizer', 'Admin'), createEvent);

router.get('/organizer/stats', protect, authorize('Organizer'), getOrganizerStats);
router.get('/myevents', protect, authorize('Organizer'), getMyEvents);
router.get('/mytickets', protect, authorize('Student'), getMyTickets);
router.get('/:eventId/registrations', protect, authorize('Organizer'), getEventRegistrations);
router.post('/scan-attendance', protect, authorize('Organizer', 'Admin'), scanAttendance);
router.post('/registrations/:registrationId/certificate', protect, authorize('Organizer'), assignCertificate);

router.route('/:id')
  .get(getEventById);

module.exports = router;
