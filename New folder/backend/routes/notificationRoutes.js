import express from 'express'
import { protect } from '../middleware/auth.js'
import { getNotifications, markNotificationRead, createNotification } from '../controllers/notificationController.js'

const router = express.Router()

router.use(protect)
router.get('/', getNotifications)
router.post('/', createNotification)
router.patch('/:notificationId/read', markNotificationRead)

export default router
