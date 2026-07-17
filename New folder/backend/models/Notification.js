import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['registration', 'update', 'reminder', 'verification', 'message'],
      required: true,
    },
    title: String,
    message: String,
    read: {
      type: Boolean,
      default: false,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    actionUrl: String,
  },
  { timestamps: true }
)

export default mongoose.model('Notification', notificationSchema)
