import express from 'express'
import {
  signup,
  login,
  logout,
  getMe,
  updateMe,
  getSavedEvents,
  saveEvent,
  removeSavedEvent,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import {
  validateSignup,
  validateLogin,
  handleValidationErrors,
} from '../middleware/validation.js'

const router = express.Router()

router.post('/signup', validateSignup, handleValidationErrors, signup)
router.post('/login', validateLogin, handleValidationErrors, login)
router.post('/logout', logout)
router.get('/me', protect, getMe)
router.patch('/me', protect, updateMe)
router.get('/me/saved-events', protect, getSavedEvents)
router.post('/me/saved-events/:eventId', protect, saveEvent)
router.delete('/me/saved-events/:eventId', protect, removeSavedEvent)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOTP)
router.post('/reset-password', resetPassword)

export default router
