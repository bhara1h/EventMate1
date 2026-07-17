import express from 'express'
import {
  createEvent,
  getEvents,
  getEventById,
  getOrganizerEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getMyRegistrations,
  getEventParticipants,
} from '../controllers/eventController.js'
import { protect, authorize } from '../middleware/auth.js'
import {
  validateCreateEvent,
  handleValidationErrors,
} from '../middleware/validation.js'

const router = express.Router()

// Public routes
router.get('/', getEvents)

// Organizer routes
router.get('/organizer', protect, authorize('organizer'), getOrganizerEvents)
router.get('/:id', getEventById)

// Protected routes
router.post(
  '/',
  protect,
  authorize('organizer'),
  validateCreateEvent,
  handleValidationErrors,
  createEvent
)
router.put(
  '/:id',
  protect,
  authorize('organizer'),
  updateEvent
)
router.delete(
  '/:id',
  protect,
  authorize('organizer'),
  deleteEvent
)

// Registration routes
router.post('/:eventId/register', protect, registerForEvent)
router.get('/user/registrations', protect, getMyRegistrations)
router.get('/:eventId/participants', protect, authorize('organizer'), getEventParticipants)

export default router
