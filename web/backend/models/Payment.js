const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  registration: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true },
  registrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true }, // e.g. 'UPI', 'Credit Card', etc.
  paymentStatus: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  paymentDate: { type: Date, default: Date.now },
  refundStatus: { type: String, enum: ['N/A', 'Pending', 'Refunded'], default: 'N/A' },
  screenshotUrl: { type: String }
});

paymentSchema.pre('save', function() {
  if (this.registration) this.registrationId = this.registration;
  if (this.student) this.studentId = this.student;
  if (this.event) this.eventId = this.event;
});

module.exports = mongoose.model('Payment', paymentSchema);
