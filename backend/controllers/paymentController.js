const crypto = require('crypto');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private (Student)
const createOrder = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Check event capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }
    
    // Check if already registered
    const existingRegistration = await Registration.findOne({ student: req.user.id, event: eventId });
    if (existingRegistration) {
      if (['Completed', 'Paid', 'Free'].includes(existingRegistration.paymentStatus)) {
        return res.status(400).json({ message: 'Already registered for this event' });
      }
      if (['Pending', 'Payment Pending'].includes(existingRegistration.paymentStatus)) {
        return res.status(400).json({ message: 'Registration is pending payment confirmation' });
      }
    }

    if (event.isFree) {
      // Direct registration for free events
      const qrData = uuidv4(); // Generate unique QR string
      const registration = await Registration.create({
        student: req.user.id,
        event: eventId,
        paymentStatus: 'Free',
        registrationStatus: 'Active',
        qrCodeData: qrData
      });
      
      // Update event registered count
      event.registeredCount += 1;
      await event.save();
      
      return res.json({ success: true, message: 'Successfully registered for free event', registration });
    }

    // For paid events (Gateway removed, frontend uses manual submit)
    return res.status(400).json({ message: 'Gateway removed. Paid events must use manual-submit endpoint.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manual Submit Payment
// @route   POST /api/payments/manual-submit
// @access  Private (Student)
const manualSubmitPayment = async (req, res) => {
  try {
    const { eventId, transactionId, screenshotUrl, paymentMethod } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check duplicate completed registration
    const existingRegistration = await Registration.findOne({ student: req.user.id, event: eventId });
    if (existingRegistration && ['Completed', 'Paid', 'Free'].includes(existingRegistration.paymentStatus)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Create or update registration as Pending
    let registration = existingRegistration;
    if (!registration) {
      registration = await Registration.create({
        student: req.user.id,
        event: eventId,
        paymentStatus: 'Pending',
        registrationStatus: 'Payment Pending'
      });
    } else {
      registration.paymentStatus = 'Pending';
      registration.registrationStatus = 'Payment Pending';
      await registration.save();
    }

    // Save payment record
    const payment = await Payment.create({
      registration: registration._id,
      student: req.user.id,
      event: eventId,
      transactionId: transactionId,
      amount: event.price || event.eventFee,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: 'Pending',
      screenshotUrl: screenshotUrl
    });

    res.json({
      success: true,
      message: 'Payment submitted for organizer verification.',
      registration,
      payment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process refund for a registration
// @route   POST /api/payments/:registrationId/refund
// @access  Private (Organizer)
const processRefund = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const registration = await Registration.findById(registrationId);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    
    const event = await Event.findById(registration.event);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to process refunds for this event' });
    }
    
    registration.refundStatus = 'Refunded';
    registration.registrationStatus = 'Cancelled';
    await registration.save();
    
    const payment = await Payment.findOne({ registration: registrationId });
    if (payment) {
      payment.refundStatus = 'Refunded';
      await payment.save();
    }
    
    // Decrement event registrations
    if (event.registeredCount > 0) {
      event.registeredCount -= 1;
      await event.save();
    }
    
    res.json({ success: true, message: 'Refund processed successfully', registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify/Reject Manual Payment (Organizer)
// @route   POST /api/payments/:paymentId/verify-manual
// @access  Private (Organizer)
const verifyManualPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body; // 'Approve' or 'Reject'
    
    const payment = await Payment.findById(paymentId).populate('event');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    
    if (payment.event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const registration = await Registration.findById(payment.registration);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    if (status === 'Approve') {
      payment.paymentStatus = 'Success';
      await payment.save();

      registration.paymentStatus = 'Completed';
      registration.registrationStatus = 'Active';
      registration.qrCodeData = uuidv4();
      await registration.save();
      
      const event = await Event.findById(payment.event._id);
      event.registeredCount += 1;
      await event.save();
      
      const io = req.app.get('io');
      if (io) {
        io.emit('event_approved', {
          id: Date.now(),
          message: `Your payment for ${event.title} was verified! Ticket generated.`
        });
      }
      
      res.json({ success: true, message: 'Payment verified and ticket generated.' });
    } else {
      payment.paymentStatus = 'Failed';
      await payment.save();

      registration.paymentStatus = 'Failed';
      registration.registrationStatus = 'Payment Failed';
      await registration.save();
      
      res.json({ success: true, message: 'Payment rejected.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending manual payments for Organizer
// @route   GET /api/payments/pending
// @access  Private (Organizer)
const getOrganizerPendingPayments = async (req, res) => {
  try {
    // Find all events owned by this organizer
    const events = await Event.find({ organizer: req.user.id }).select('_id');
    const eventIds = events.map(e => e._id);

    const pendingPayments = await Payment.find({
      event: { $in: eventIds },
      paymentStatus: 'Pending'
    })
      .populate('student', 'name email phone')
      .populate('event', 'title eventFee price')
      .sort({ createdAt: -1 });

    res.json(pendingPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  manualSubmitPayment,
  processRefund,
  verifyManualPayment,
  getOrganizerPendingPayments
};
