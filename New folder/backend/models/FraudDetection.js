import mongoose from 'mongoose'

const fraudDetectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['unusual_registration', 'fake_event', 'spam', 'suspicious_payment', 'other'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    description: String,
    evidence: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'flagged', 'blocked', 'resolved'],
      default: 'pending',
    },
    actionTaken: String,
    actionDate: Date,
  },
  { timestamps: true }
)

export default mongoose.model('FraudDetection', fraudDetectionSchema)
