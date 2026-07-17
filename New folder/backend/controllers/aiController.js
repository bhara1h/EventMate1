import Event from '../models/Event.js'

export const getRecommendations = async (req, res, next) => {
  try {
    const trendingEvents = await Event.find({ status: 'approved' })
      .sort({ registrations: -1 })
      .limit(6)

    const recommendations = trendingEvents.map((event) => ({
      _id: event._id,
      title: event.title,
      category: event.category,
      date: event.date,
      location: event.location,
      poster: event.poster,
      score: Math.min(100, event.registrations + 10),
    }))

    res.status(200).json({ success: true, recommendations })
  } catch (error) {
    next(error)
  }
}

export const generateDescription = async (req, res, next) => {
  try {
    const { title, category, keywords } = req.body

    const description = `Join us at ${title}, a premium ${category} event tailored for students who want to learn, network, and build future-ready skills. Expect hands-on sessions, expert mentors, and a powerful community experience shaped around ${keywords || 'innovation and collaboration'}.` 

    res.status(200).json({ success: true, description })
  } catch (error) {
    next(error)
  }
}

export const chatReply = async (req, res, next) => {
  try {
    const { message } = req.body
    const normalized = message?.toLowerCase() || ''

    let reply = 'I can help you find events, generate ideas, or answer questions about EventMate.'

    if (normalized.includes('recommend')) {
      reply = 'Based on your interests, I recommend checking out the latest tech workshops and social mixers happening this month.'
    } else if (normalized.includes('payment')) {
      reply = 'For paid events, I will help you secure your spot with Razorpay payment checkout and then deliver your QR ticket instantly.'
    } else if (normalized.includes('qr')) {
      reply = 'Your QR ticket will be generated after registration. Organizers can scan it to check you in instantly.'
    }

    res.status(200).json({ success: true, reply })
  } catch (error) {
    next(error)
  }
}
