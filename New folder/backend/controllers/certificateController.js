import Certificate from '../models/Certificate.js'

export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate('event', 'title date')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      certificates,
    })
  } catch (error) {
    next(error)
  }
}
