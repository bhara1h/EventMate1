const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  isOnline: { type: Boolean, default: false },
  meetingLink: { type: String },
  
  contactEmail: { type: String },
  contactPhone: { type: String },
  
  capacity: { type: Number, required: true },
  registeredCount: { type: Number, default: 0 },
  
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: true },
  
  posterImage: { type: String },
  galleryImages: [{ type: String }],
  
  chiefGuest: { type: String },
  registrationDeadline: { type: Date },
  prizeDetails: { type: String },
  certificateAvailable: { type: Boolean, default: false },
  
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Draft'], 
    default: 'Pending' 
  },
  
  tags: [{ type: String }],
  
  // Paid Event Registration System fields
  eventName: { type: String },
  eventType: { type: String, enum: ['Free', 'Paid'], default: 'Free' },
  eventFee: { type: Number, default: 0 },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  createdAt: { type: Date, default: Date.now }
});

eventSchema.pre('save', function() {
  if (this.title) this.eventName = this.title;
  this.eventType = this.isFree ? 'Free' : 'Paid';
  if (this.price !== undefined) this.eventFee = this.price;
  if (this.organizer) this.organizerId = this.organizer;
});

module.exports = mongoose.model('Event', eventSchema);
