import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
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
    certificateUrl: String,
    issuedAt: Date,
    certificateId: String,
  },
  { timestamps: true }
)

export default mongoose.model('Certificate', certificateSchema)
