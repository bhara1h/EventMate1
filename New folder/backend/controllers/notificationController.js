import Notification from '../models/Notification.js'

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, notifications })
  } catch (error) {
    next(error)
  }
}

export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read: true },
      { new: true }
    )

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' })
    }

    res.status(200).json({ success: true, notification })
  } catch (error) {
    next(error)
  }
}

export const createNotification = async (req, res, next) => {
  try {
    const { userId, type, title, message, event, actionUrl } = req.body

    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      event,
      actionUrl,
    })

    const io = req.app.get('io')
    if (io) {
      io.to(userId).emit('notification', notification)
    }

    res.status(201).json({ success: true, notification })
  } catch (error) {
    next(error)
  }
}
