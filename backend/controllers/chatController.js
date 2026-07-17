const Message = require('../models/Message');

// @desc    Get all messages for a specific event
// @route   GET /api/chat/:eventId
// @access  Private (Registered Students & Organizer)
const getEventMessages = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Fetch messages and populate sender details
    const messages = await Message.find({ event: eventId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 }); // Oldest first
      
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEventMessages
};
