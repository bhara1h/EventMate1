const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Student', 'Organizer', 'Admin'], 
    default: 'Student' 
  },
  profileImage: { type: String, default: '' },
  
  // Organizer specific fields
  organizationName: { type: String }, // Legacy
  department: { type: String },
  isVerifiedOrganizer: { type: Boolean, default: false },
  
  // Student specific fields
  college: { type: String },
  studentId: { type: String },
  
  createdAt: { type: Date, default: Date.now },
  isSuspended: { type: Boolean, default: false },
  
  // Auth Extensions
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
