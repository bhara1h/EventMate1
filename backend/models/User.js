const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Student', 'Organizer', 'Admin'], 
    default: 'Student' 
  },
  profileImage: { type: String, default: '' },
  
  // Organizer specific fields
  organizationName: { type: String },
  isVerifiedOrganizer: { type: Boolean, default: false },
  
  // Student specific fields
  college: { type: String },
  studentId: { type: String },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
