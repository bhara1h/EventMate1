import express from 'express'
import {
  getPendingEvents,
  approveEvent,
  rejectEvent,
  getUsers,
  suspendUser,
  unsuspendUser,
  deleteUser,
  getPlatformStats,
  getSuspiciousActivities,
  reportSuspiciousActivity,
} from '../controllers/adminController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'))

// Event verification routes
router.get('/events/pending', getPendingEvents)
router.post('/events/:eventId/approve', approveEvent)
router.post('/events/:eventId/reject', rejectEvent)

// User management routes
router.get('/users', getUsers)
router.post('/users/:userId/suspend', suspendUser)
router.post('/users/:userId/unsuspend', unsuspendUser)
router.delete('/users/:userId', deleteUser)

// Analytics routes
router.get('/stats', getPlatformStats)

// Fraud detection routes
router.get('/fraud/suspicious-activities', getSuspiciousActivities)
router.post('/fraud/report', reportSuspiciousActivity)

export default router
