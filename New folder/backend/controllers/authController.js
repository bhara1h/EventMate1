import User from '../models/User.js'
import {
  generateToken,
  generateResetToken,
  generateOTP,
  sendEmail,
} from '../utils/helpers.js'

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    // Check if user exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || 'student',
    })

    await user.save()

    // Generate token
    const token = generateToken(user)

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check if suspended
    if (user.isSuspended) {
      return res.status(403).json({ message: 'Your account has been suspended' })
    }

    // Generate token
    const token = generateToken(user)

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        organization: user.organization,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateMe = async (req, res, next) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      bio: req.body.bio,
      location: req.body.location,
      organization: req.body.organization,
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        organization: user.organization,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getSavedEvents = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedEvents')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      success: true,
      savedEvents: user.savedEvents,
    })
  } catch (error) {
    next(error)
  }
}

export const saveEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.savedEvents.some((savedEvent) => savedEvent.toString() === eventId)) {
      return res.status(400).json({ message: 'Event already saved' })
    }

    user.savedEvents.push(eventId)
    await user.save()

    res.status(200).json({
      success: true,
      savedEvents: user.savedEvents,
    })
  } catch (error) {
    next(error)
  }
}

export const removeSavedEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.savedEvents = user.savedEvents.filter(
      (savedEvent) => savedEvent.toString() !== eventId
    )
    await user.save()

    res.status(200).json({
      success: true,
      savedEvents: user.savedEvents,
    })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Generate reset token and OTP
    const resetToken = generateResetToken()
    const otp = generateOTP()

    // Save to user document
    user.resetPasswordToken = resetToken
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    user.emailVerificationToken = otp
    await user.save()

    const subject = 'EventMate Password Reset OTP'
    const html = `
      <p>Hello,</p>
      <p>Use the following OTP to verify your password reset request:</p>
      <p><strong>${otp}</strong></p>
      <p>This OTP expires in 10 minutes.</p>
      <p>If you did not request a password reset, please ignore this message.</p>
    `

    const emailResult = await sendEmail(email, subject, html)
    const message = emailResult
      ? 'OTP sent to your email'
      : 'OTP generated. Email service is not configured; check server logs.'

    res.status(200).json({
      success: true,
      message,
    })
  } catch (error) {
    next(error)
  }
}

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.emailVerificationToken !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    if (new Date() > user.resetPasswordExpire) {
      return res.status(400).json({ message: 'OTP has expired' })
    }

    // Generate reset token for password reset
    const resetToken = user.resetPasswordToken

    res.status(200).json({
      success: true,
      resetToken,
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    })
  } catch (error) {
    next(error)
  }
}

export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
}
