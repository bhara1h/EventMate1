const Event = require('../models/Event');
const Registration = require('../models/Registration');
// @desc    Get all approved events (public)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'Approved' }).populate('organizer', 'name organizationName');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name organizationName');
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private (Organizer)
const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, location, isOnline, capacity, price, isFree, contactEmail, contactPhone, posterImage } = req.body;

    const event = new Event({
      title,
      description,
      category,
      date,
      time,
      location,
      isOnline,
      capacity,
      price,
      isFree,
      contactEmail,
      contactPhone,
      posterImage,
      organizer: req.user.id, // from authMiddleware
      status: 'Pending' // Requires admin approval
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in organizer's events
// @route   GET /api/events/myevents
// @access  Private (Organizer)
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in student's tickets
// @route   GET /api/events/mytickets
// @access  Private (Student)
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Registration.find({ student: req.user.id }).populate('event');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Scan QR Code for Attendance
// @route   POST /api/events/scan-attendance
// @access  Private (Organizer)
const scanAttendance = async (req, res) => {
  try {
    const { qrCodeData } = req.body;
    
    if (!qrCodeData) {
      return res.status(400).json({ message: 'QR Code data is required' });
    }

    const registration = await Registration.findOne({ qrCodeData }).populate('event');
    
    if (!registration) {
      return res.status(404).json({ message: 'Invalid Ticket: Registration not found' });
    }

    // Check if the user scanning is the organizer of the event
    if (registration.event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to scan tickets for this event' });
    }

    if (registration.hasAttended) {
      return res.status(400).json({ message: 'Ticket already scanned! Attendee already marked present.' });
    }

    registration.hasAttended = true;
    await registration.save();

    res.json({ message: 'Attendance marked successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  getMyEvents,
  getMyTickets,
  scanAttendance
};
