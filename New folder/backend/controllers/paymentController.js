import Razorpay from 'razorpay'
import crypto from 'crypto'
import Event from '../models/Event.js'
import Registration from '../models/Registration.js'
import QRCode from 'qrcode'

const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured')
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

export const createOrder = async (req, res, next) => {
  try {
    const client = getRazorpayClient()
    const { amount, currency = 'INR', receipt } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount is required' })
    }

    const order = await client.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    })

    res.status(201).json({ success: true, order })
  } catch (error) {
    next(error)
  }
}

export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      amountPaid,
    } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' })
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' })
    }

    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    if (event.registrations >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is full' })
    }

    const ticketId = `${eventId}-${req.user._id}-${Date.now()}`
    const qrCode = await QRCode.toDataURL(ticketId)

    const registration = new Registration({
      user: req.user._id,
      event: eventId,
      ticketId,
      qrCode,
      paymentStatus: 'completed',
      paymentId: razorpay_payment_id,
      amountPaid,
    })

    await registration.save()
    event.registrations += 1
    event.revenue += Number(amountPaid || event.fee)
    await event.save()

    const io = req.app.get('io')
    if (io) {
      io.to(req.user._id.toString()).emit('notification', {
        type: 'registration',
        title: 'Payment confirmed',
        message: `Your registration for ${event.title} is confirmed.`,
        event: event._id,
      })
    }

    res.status(200).json({ success: true, registration })
  } catch (error) {
    next(error)
  }
}
