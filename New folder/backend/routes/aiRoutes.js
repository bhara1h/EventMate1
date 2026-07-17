import express from 'express'
import { protect } from '../middleware/auth.js'
import { getRecommendations, generateDescription, chatReply } from '../controllers/aiController.js'

const router = express.Router()

router.get('/recommendations', protect, getRecommendations)
router.post('/description', protect, generateDescription)
router.post('/chat', protect, chatReply)

export default router
