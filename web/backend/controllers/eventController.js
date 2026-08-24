const Event = require('../models/Event');
const Registration = require('../models/Registration');
// @desc    Get all approved events (public)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'Approved' }).populate('organizer', 'name organizationName department college');
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
    const event = await Event.findById(req.params.id).populate('organizer', 'name organizationName department college');
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
    const { title, description, category, date, time, location, isOnline, capacity, price, isFree, contactEmail, contactPhone, posterImage, chiefGuest, registrationDeadline, prizeDetails, certificateAvailable, paymentPhone, paymentQrCode } = req.body;

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
      chiefGuest,
      registrationDeadline,
      prizeDetails,
      certificateAvailable,
      paymentPhone,
      paymentQrCode,
      organizer: req.user.id, // from authMiddleware
      status: 'Pending' // Requires admin approval
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error('Error in createEvent:', error);
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

// @desc    Get organizer dashboard stats (Total registrations, Free, Paid, Revenue)
// @route   GET /api/events/organizer/stats
// @access  Private (Organizer)
const getOrganizerStats = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    const eventIds = events.map(e => e._id);

    const registrations = await Registration.find({ event: { $in: eventIds } });
    const Payment = require('../models/Payment');
    const payments = await Payment.find({ event: { $in: eventIds }, paymentStatus: 'Success' });

    const totalFree = registrations.filter(r => r.paymentStatus === 'Free').length;
    const totalPaid = registrations.filter(r => ['Completed', 'Paid'].includes(r.paymentStatus)).length;
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalRegistrations: registrations.length,
      totalFree,
      totalPaid,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registrations/attendees for a specific event
// @route   GET /api/events/:eventId/registrations
// @access  Private (Organizer)
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to view registrations for this event' });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate('student', 'name email')
      .populate('event', 'title price isFree')
      .lean();
      
    // Find all payment records for these registrations
    const Payment = require('../models/Payment');
    const payments = await Payment.find({ event: eventId });

    // Map registrations with corresponding payment/transaction details
    const result = registrations.map(r => {
      const payment = payments.find(p => p.registration && p.registration.toString() === r._id.toString());
      return {
        _id: r._id,
        student: r.student,
        event: r.event,
        paymentStatus: r.paymentStatus,
        registrationStatus: r.registrationStatus,
        refundStatus: r.refundStatus,
        qrCode: r.qrCode,
        hasAttended: r.hasAttended,
        registeredAt: r.registeredAt,
        transactionId: payment ? payment.transactionId : 'N/A',
        paymentMethod: payment ? payment.paymentMethod : 'N/A'
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign certificate to a registration
// @route   POST /api/events/registrations/:registrationId/certificate
// @access  Private (Organizer)
const assignCertificate = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { certificateUrl, certificateRole } = req.body;

    const registration = await Registration.findById(registrationId).populate('event');
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    if (registration.event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to assign certificate for this event' });
    }

    if (!registration.hasAttended) {
      return res.status(400).json({ message: 'Cannot assign certificate to someone who has not attended' });
    }

    registration.certificateUrl = certificateUrl;
    registration.certificateRole = certificateRole;
    await registration.save();

    // Send notification via socket
    const io = req.app.get('io');
    if (io) {
      io.emit('event_approved', {
        id: Date.now(),
        message: `You have received a ${certificateRole} certificate for ${registration.event.title}!`
      });
    }

    res.json({ success: true, message: 'Certificate assigned successfully', registration });
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
  scanAttendance,
  getOrganizerStats,
  getEventRegistrations,
  assignCertificate
};
