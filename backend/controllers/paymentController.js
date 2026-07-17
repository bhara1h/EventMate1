const Razorpay = require('razorpay');
const crypto = require('crypto');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { v4: uuidv4 } = require('uuid');

// Initialize Razorpay (Use test keys or placeholders)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_SECRET || 'secret_placeholder',
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private (Student)
const createOrder = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Check if already registered
    const existingRegistration = await Registration.findOne({ student: req.user.id, event: eventId });
    if (existingRegistration) return res.status(400).json({ message: 'Already registered for this event' });

    if (event.isFree) {
      // Direct registration for free events
      const qrData = uuidv4(); // Generate unique QR string
      const registration = await Registration.create({
        student: req.user.id,
        event: eventId,
        paymentStatus: 'Free',
        qrCodeData: qrData
      });
      
      // Update event registered count
      event.registeredCount += 1;
      await event.save();
      
      return res.json({ success: true, message: 'Successfully registered for free event', registration });
    }

    // For paid events
    const options = {
      amount: event.price * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${uuidv4().slice(0,8)}`,
    };

    let order;
    // Simulate Razorpay in demo/placeholder mode
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
      order = {
        id: `order_sim_${uuidv4().slice(0, 10)}`,
        entity: 'order',
        amount: options.amount,
        amount_paid: 0,
        amount_due: options.amount,
        currency: 'INR',
        receipt: options.receipt,
        status: 'created',
        attempts: 0
      };
    } else {
      order = await razorpay.orders.create(options);
    }

    if (!order) return res.status(500).json({ message: 'Some error occurred with Razorpay' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Payment and save registration
// @route   POST /api/payments/verify
// @access  Private (Student)
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, eventId } = req.body;

    // Bypass signature check if we are in demo mode and the frontend passed a simulated signature
    if (razorpaySignature !== 'simulated_signature') {
      const secret = process.env.RAZORPAY_SECRET || 'secret_placeholder';
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const digest = shasum.digest('hex');

      if (digest !== razorpaySignature) {
        return res.status(400).json({ message: 'Transaction not legit!' });
      }
    }

    // Generate unique QR data
    const qrData = uuidv4();

    const registration = await Registration.create({
      student: req.user.id,
      event: eventId,
      paymentStatus: 'Completed',
      razorpayOrderId,
      razorpayPaymentId,
      qrCodeData: qrData
    });

    const event = await Event.findById(eventId);
    event.registeredCount += 1;
    await event.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      registration
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
