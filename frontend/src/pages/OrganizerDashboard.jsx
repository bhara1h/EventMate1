import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import EventChat from '../components/EventChat';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [activeChatEvent, setActiveChatEvent] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Technical', 
    date: '', time: '', location: '', capacity: '', price: 0, isFree: true,
    contactEmail: '', contactPhone: '', posterImage: ''
  });

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const res = await api.get('/events/myevents');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', formData);
      alert('Event submitted for admin approval!');
      setFormData({
        title: '', description: '', category: 'Technical', 
        date: '', time: '', location: '', capacity: '', price: 0, isFree: true,
        contactEmail: '', contactPhone: '', posterImage: ''
      });
      fetchMyEvents();
    } catch (error) {
      alert('Error creating event');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Organizer Dashboard</h1>
            <p className="text-slate-600">Welcome, {user?.name}</p>
          </div>
        </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Create Event Form */}
        <div className="xl:col-span-1 glassmorphism p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-bold mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" rows="3"></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                  <option>Technical</option>
                  <option>Cultural</option>
                  <option>Sports</option>
                  <option>Workshop</option>
                </select>
              </div>
            </div>

            {/* Poster & Contact Details */}
            <div>
              <label className="block text-sm font-medium mb-1">Poster Image URL (Optional)</label>
              <input type="url" name="posterImage" value={formData.posterImage} onChange={handleChange} placeholder="https://example.com/poster.jpg" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone</label>
                <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>

            {/* Pricing Details */}
            <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} id="isFree" className="w-4 h-4 text-blue-600" />
                <label htmlFor="isFree" className="text-sm font-bold text-slate-800">This is a free event</label>
              </div>
              {!formData.isFree && (
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} min="1" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold shadow-md">Create Event Request</button>
          </form>
        </div>

        {/* My Events List */}
        <div className="xl:col-span-2">
          <h2 className="text-xl font-bold mb-4">My Events</h2>
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-slate-500">You haven't created any events yet.</p>
            ) : (
              events.map(event => (
                <div key={event._id} className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center hover:shadow-md transition">
                  <div className="flex gap-4 items-center w-full md:w-auto">
                    {/* Display Poster if available */}
                    {event.posterImage ? (
                      <img src={event.posterImage} alt="Poster" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-2xl">🎟️</div>
                    )}
                    
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{event.title}</h3>
                      <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                          event.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          event.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-slate-100 text-slate-600">
                          {event.isFree ? 'Free' : `₹${event.price}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto md:text-right flex flex-col md:items-end gap-2">
                    <p className="text-sm font-medium text-slate-700">
                      <span className="text-blue-600 font-bold">{event.registeredCount}</span> / {event.capacity} Registered
                    </p>
                    
                    {event.status === 'Approved' && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        <button 
                          onClick={() => setActiveChatEvent(event)}
                          className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          💬 Live Chat
                        </button>
                        <button 
                          onClick={() => navigate('/scanner')}
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          📷 Scan Tickets
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Render EventChat Modal */}
      {activeChatEvent && (
        <EventChat 
          eventId={activeChatEvent._id} 
          eventTitle={activeChatEvent.title} 
          onClose={() => setActiveChatEvent(null)} 
        />
      )}
    </div>
  );
};

export default OrganizerDashboard;
