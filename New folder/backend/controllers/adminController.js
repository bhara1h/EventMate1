import Event from '../models/Event.js'
import User from '../models/User.js'
import FraudDetection from '../models/FraudDetection.js'

export const getPendingEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: 'pending' })
      .populate('organizer', 'name email organization')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      events,
    })
  } catch (error) {
    next(error)
  }
}

export const approveEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      { status: 'approved' },
      { new: true }
    ).populate('organizer', 'name email')

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.status(200).json({
      success: true,
      event,
      message: 'Event approved',
    })
  } catch (error) {
    next(error)
  }
}

export const rejectEvent = async (req, res, next) => {
  try {
    const { reason } = req.body

    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      {
        status: 'rejected',
        verificationReason: reason,
      },
      { new: true }
    ).populate('organizer', 'name email')

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.status(200).json({
      success: true,
      event,
      message: 'Event rejected',
    })
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      users,
    })
  } catch (error) {
    next(error)
  }
}

export const suspendUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isSuspended: true },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      success: true,
      user,
      message: 'User suspended',
    })
  } catch (error) {
    next(error)
  }
}

export const unsuspendUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isSuspended: false },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      success: true,
      user,
      message: 'User unsuspended',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      success: true,
      message: 'User deleted',
    })
  } catch (error) {
    next(error)
  }
}

export const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalEvents = await Event.countDocuments()
    const pendingEvents = await Event.countDocuments({ status: 'pending' })
    const approvedEvents = await Event.countDocuments({ status: 'approved' })

    const students = await User.countDocuments({ role: 'student' })
    const organizers = await User.countDocuments({ role: 'organizer' })

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalEvents,
        pendingEvents,
        approvedEvents,
        students,
        organizers,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getSuspiciousActivities = async (req, res, next) => {
  try {
    const activities = await FraudDetection.find()
      .populate('user', 'name email')
      .populate('event', 'title')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      activities,
    })
  } catch (error) {
    next(error)
  }
}

export const reportSuspiciousActivity = async (req, res, next) => {
  try {
    const { type, severity, description, userId, eventId } = req.body

    const activity = new FraudDetection({
      type,
      severity,
      description,
      user: userId,
      event: eventId,
      status: 'pending',
    })

    await activity.save()

    res.status(201).json({
      success: true,
      activity,
    })
  } catch (error) {
    next(error)
  }
}
