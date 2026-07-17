import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

// Load environment variables
dotenv.config()

// Import routes
import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import certificateRoutes from './routes/certificateRoutes.js'

// Import middleware
import { errorHandler, notFound } from './middleware/errors.js'
import { connectDB } from './config/database.js'

// Initialize express app
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})

// Connect to database
connectDB()

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Routes
app.use('/auth', authRoutes)
app.use('/events', eventRoutes)
app.use('/admin', adminRoutes)
app.use('/upload', uploadRoutes)
app.use('/payments', paymentRoutes)
app.use('/ai', aiRoutes)
app.use('/notifications', notificationRoutes)
app.use('/certificates', certificateRoutes)

// Pass Socket.IO to request handlers
app.set('io', io)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' })
})

// 404 handler
app.use(notFound)

// Error handler
app.use(errorHandler)

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id)

  socket.on('join-room', (data) => {
    socket.join(data.roomId)
    socket.broadcast.to(data.roomId).emit('user-joined', {
      userId: data.userId,
      message: `${data.userName} joined the room`,
    })
  })

  socket.on('send-notification', (data) => {
    io.to(data.userId).emit('notification', data.notification)
  })

  socket.on('send-message', (data) => {
    io.to(data.roomId).emit('message', data)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Start server
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV}`)
})

export default app
