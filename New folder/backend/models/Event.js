import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Technology', 'Entertainment', 'Sports', 'Academic', 'Cultural', 'Workshop', 'Seminar', 'Competition', 'Social', 'Other'],
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: String,
    location: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    registrations: {
      type: Number,
      default: 0,
    },
    fee: {
      type: Number,
      default: 0,
    },
    poster: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    verificationReason: String,
    isFake: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    attendanceCount: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Event', eventSchema)
