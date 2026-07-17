const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed', 'Free'], 
    default: 'Pending' 
  },
  
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  
  qrCodeData: { type: String, unique: true }, // Unique hash for QR code
  hasAttended: { type: Boolean, default: false },
  
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', registrationSchema);
