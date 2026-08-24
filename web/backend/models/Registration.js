const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed', 'Free', 'Paid', 'Payment Pending', 'Success'], 
    default: 'Pending' 
  },
  
  registrationStatus: {
    type: String,
    enum: ['Pending', 'Active', 'Cancelled', 'Payment Pending', 'Payment Failed'],
    default: 'Pending'
  },
  
  refundStatus: {
    type: String,
    enum: ['N/A', 'Refunded'],
    default: 'N/A'
  },
  
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  
  qrCodeData: { type: String }, // Removed unique constraint to allow multiple pending registrations
  qrCode: { type: String }, // duplicate of qrCodeData
  hasAttended: { type: Boolean, default: false },
  
  registeredAt: { type: Date, default: Date.now },
  certificateUrl: { type: String },
  certificateRole: { type: String, enum: ['Participant', 'Winner', 'Runner-Up'] }
});

registrationSchema.pre('save', function() {
  if (this.student) this.studentId = this.student;
  if (this.event) this.eventId = this.event;
  if (this.qrCodeData) this.qrCode = this.qrCodeData;
});

module.exports = mongoose.model('Registration', registrationSchema);
