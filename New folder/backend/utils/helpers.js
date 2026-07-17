import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  )
}

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const getTransporter = () => {
  const host = process.env.EMAIL_HOST
  const port = process.env.EMAIL_PORT
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

  if (!host || !port || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: process.env.EMAIL_SECURE === 'true' || Number(port) === 465,
    auth: {
      user,
      pass,
    },
  })
}

export const sendEmail = async (to, subject, html) => {
  const transporter = getTransporter()

  if (!transporter) {
    console.warn(
      'Email configuration is incomplete. Falling back to console output.'
    )
    console.log(`Email to ${to} | subject: ${subject} | body: ${html}`)
    return false
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`Email sent: ${info.messageId}`)
    return info
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export const detectFraud = (data) => {
  const suspiciousPatterns = []

  // Check for unusual registration patterns
  if (data.registrationsInLastHour > 10) {
    suspiciousPatterns.push('Unusual registration pattern')
  }

  // Check for suspicious event details
  if (data.eventTitle && data.eventTitle.includes('FREE') && data.fee > 0) {
    suspiciousPatterns.push('Misleading event information')
  }

  return suspiciousPatterns
}
