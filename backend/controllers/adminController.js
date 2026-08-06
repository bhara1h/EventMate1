const Event = require('../models/Event');
const User = require('../models/User');

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

// @desc    Get all users (Organizers/Students)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'Admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle User Suspension
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (Admin)
const toggleUserSuspend = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isSuspended = !user.isSuspended;
    await user.save();
    
    res.json({ success: true, message: `User ${user.isSuspended ? 'suspended' : 'unsuspended'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Organizer Account
// @route   PUT /api/admin/users/:id/verify
// @access  Private (Admin)
const verifyOrganizer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'Organizer') return res.status(404).json({ message: 'Organizer not found' });

    user.isVerifiedOrganizer = true;
    await user.save();
    
    res.json({ success: true, message: 'Organizer verified successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Event
// @route   DELETE /api/admin/events/:id
// @access  Private (Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPendingEvents,
  updateEventStatus,
  getAllUsers,
  toggleUserSuspend,
  verifyOrganizer,
  deleteEvent
};
