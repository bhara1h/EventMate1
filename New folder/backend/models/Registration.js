import mongoose from 'mongoose'

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'no-show', 'cancelled'],
      default: 'registered',
    },
    qrCode: String,
    ticketId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentId: String,
    amountPaid: Number,
    checkedInAt: Date,
  },
  { timestamps: true }
)

export default mongoose.model('Registration', registrationSchema)
