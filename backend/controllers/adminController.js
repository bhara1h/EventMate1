const Event = require('../models/Event');

// @desc    Get all pending events
// @route   GET /api/admin/events/pending
// @access  Private (Admin)
const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'Pending' }).populate('organizer', 'name organizationName email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event status (Approve/Reject)
// @route   PUT /api/admin/events/:id/status
// @access  Private (Admin)
const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = status;
    await event.save();
    
    // Emit real-time notification via Socket.io
    if (status === 'Approved') {
      const io = req.app.get('io');
      if (io) {
        io.emit('event_approved', {
          message: `New event approved: ${event.title}`,
          event: event
        });
      }
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPendingEvents,
  updateEventStatus
};
