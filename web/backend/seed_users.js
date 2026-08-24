const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seed = async () => {
  await mongoose.connect('mongodb://127.0.0.1:64060/');
  
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);
  
  await User.create({
    name: 'Test Student',
    email: 'student@test.com',
    phone: '1234567890',
    password: password,
    role: 'Student',
    college: 'Engineering College',
    studentId: 'STU001',
    isVerified: true
  });

  await User.create({
    name: 'Test Organizer',
    email: 'organizer@test.com',
    phone: '0987654321',
    password: password,
    role: 'Organizer',
    college: 'Engineering College',
    department: 'Computer Science',
    organizationName: 'Tech Club',
    isVerified: true
  });

  console.log('Seeded successfully!');
  process.exit(0);
};

seed();
