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
  
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Draft'], 
    default: 'Pending' 
  },
  
  tags: [{ type: String }],
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
