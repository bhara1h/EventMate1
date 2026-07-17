import express from 'express'
import multer from 'multer'
import { uploadImage } from '../controllers/uploadController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/image', protect, upload.single('image'), uploadImage)

export default router
