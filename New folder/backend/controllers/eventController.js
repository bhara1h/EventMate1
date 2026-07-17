import Event from '../models/Event.js'
import Registration from '../models/Registration.js'
import QRCode from 'qrcode'

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, category, date, time, location, capacity, fee, poster, tags } = req.body

    const event = new Event({
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      fee,
      poster,
      organizer: req.user._id,
      status: 'pending',
      tags,
    })

    await event.save()
    await event.populate('organizer', 'name email')

    res.status(201).json({
      success: true,
      event,
    })
  } catch (error) {
    next(error)
  }
}

export const getEvents = async (req, res, next) => {
  try {
    const { category, search, status } = req.query

    let filter = { status: 'approved' }

    if (category && category !== 'all') {
      filter.category = category
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    if (status) {
      filter.status = status
    }

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      events,
    })
  } catch (error) {
    next(error)
  }
}

export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email')

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.status(200).json({
      success: true,
      event,
    })
  } catch (error) {
    next(error)
  }
}

export const getOrganizerEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      events,
    })
  } catch (error) {
    next(error)
  }
}

export const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Check authorization
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' })
    }

    const { title, description, category, date, time, location, capacity, fee, poster, tags } = req.body

    const updateData = {
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      fee,
      tags,
    }

    if (poster !== undefined) {
      updateData.poster = poster
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('organizer', 'name email')

    res.status(200).json({
      success: true,
      event,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Check authorization
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' })
    }

    await Event.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Event deleted',
    })
  } catch (error) {
    next(error)
  }
}

export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params

    // Check if event exists
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Check if already registered
    const existingReg = await Registration.findOne({
      user: req.user._id,
      event: eventId,
    })

    if (existingReg) {
      return res.status(400).json({ message: 'Already registered for this event' })
    }

    // Check capacity
    if (event.registrations >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' })
    }

    // Create QR Code
    const ticketId = `${eventId}-${req.user._id}-${Date.now()}`
    const qrCode = await QRCode.toDataURL(ticketId)

    // Create registration
    const registration = new Registration({
      user: req.user._id,
      event: eventId,
      ticketId,
      qrCode,
      paymentStatus: event.fee === 0 ? 'completed' : 'pending',
    })

    await registration.save()

    // Update event registration count
    event.registrations += 1
    await event.save()

    res.status(201).json({
      success: true,
      registration,
    })
  } catch (error) {
    next(error)
  }
}

export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      registrations,
    })
  } catch (error) {
    next(error)
  }
}

export const getEventParticipants = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId)

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Check authorization
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const participants = await Registration.find({ event: req.params.eventId })
      .populate('user', 'name email')

    res.status(200).json({
      success: true,
      participants,
    })
  } catch (error) {
    next(error)
  }
}
