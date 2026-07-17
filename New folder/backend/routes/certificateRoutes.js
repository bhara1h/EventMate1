import express from 'express'
import { getMyCertificates } from '../controllers/certificateController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/me', protect, getMyCertificates)

export default router
