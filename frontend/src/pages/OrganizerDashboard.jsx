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
  const [stats, setStats] = useState(null);
  const [activeChatEvent, setActiveChatEvent] = useState(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingPayments, setPendingPayments] = useState([]);
  const [assigningCert, setAssigningCert] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Technical', 
    date: '', time: '', location: '', capacity: '', price: 0, isFree: true,
    contactEmail: '', contactPhone: '', posterImage: '', chiefGuest: '', 
    registrationDeadline: '', prizeDetails: '', certificateAvailable: false,
    paymentQrCode: '', paymentPhone: ''
  });

  useEffect(() => {
    fetchMyEvents();
    fetchStats();
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const res = await api.get('/payments/pending');
      setPendingPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/events/organizer/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewRegistrations = async (eventId) => {
    try {
      const res = await api.get(`/events/${eventId}/registrations`);
      setViewingRegistrations({ eventId, data: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignCertificate = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/events/registrations/${assigningCert.registrationId}/certificate`, {
        certificateUrl: assigningCert.url,
        certificateRole: assigningCert.role
      });
      alert('Certificate assigned successfully!');
      setAssigningCert(null);
      handleViewRegistrations(viewingRegistrations.eventId);
    } catch (err) {
      alert(`Error assigning certificate: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleVerifyPayment = async (paymentId, status) => {
    try {
      await api.post(`/payments/${paymentId}/verify-manual`, { status });
      alert(`Payment ${status}d successfully!`);
      fetchPendingPayments();
      fetchStats();
      fetchMyEvents();
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

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
        contactEmail: '', contactPhone: '', posterImage: '', chiefGuest: '', 
        registrationDeadline: '', prizeDetails: '', certificateAvailable: false,
        paymentQrCode: '', paymentPhone: ''
      });
      fetchMyEvents();
    } catch (error) {
      alert(`Error creating event: ${error.response?.data?.message || error.message}`);
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

        <div className="flex space-x-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'dashboard' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'profile' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              activeTab === 'payments' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Pending Payments
            {pendingPayments.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingPayments.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 font-medium">Total Registrations</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalRegistrations}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 font-medium">Free Tickets</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalFree}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 font-medium">Paid Tickets</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalPaid}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue}</p>
            </div>
          </div>
        )}

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
                <label className="block text-sm font-medium mb-1">Chief Guest (Optional)</label>
                <input type="text" name="chiefGuest" value={formData.chiefGuest} onChange={handleChange} placeholder="Dr. John Doe" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registration Deadline</label>
                <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prize Details (Optional)</label>
              <input type="text" name="prizeDetails" value={formData.prizeDetails} onChange={handleChange} placeholder="1st Prize: ₹5000, 2nd Prize: ₹3000" className="w-full px-3 py-2 border rounded-lg" />
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

            {/* Extras */}
            <div className="flex items-center gap-2 mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <input type="checkbox" name="certificateAvailable" checked={formData.certificateAvailable} onChange={handleChange} id="certificateAvailable" className="w-4 h-4 text-blue-600" />
              <label htmlFor="certificateAvailable" className="text-sm font-bold text-slate-800">Certificates provided to attendees</label>
            </div>

            {/* Pricing Details */}
            <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} id="isFree" className="w-4 h-4 text-blue-600" />
                <label htmlFor="isFree" className="text-sm font-bold text-slate-800">This is a free event</label>
              </div>
              {!formData.isFree && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} min="1" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">UPI Phone Number</label>
                      <input type="text" name="paymentPhone" value={formData.paymentPhone} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. 9876543210" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">UPI QR Code URL</label>
                      <input type="url" name="paymentQrCode" value={formData.paymentQrCode} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" placeholder="https://imgur.com/qrcode.jpg" />
                    </div>
                  </div>
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
                        <button 
                          onClick={() => handleViewRegistrations(event._id)}
                          className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          📋 Registrations
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
          </>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto mt-4">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-3xl text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
                <p className="text-slate-500 font-medium">{user?.role} Portal</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-500 font-bold tracking-wide uppercase mb-1">Email Address</p>
                <p className="text-slate-800 font-medium text-lg">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-bold tracking-wide uppercase mb-1">Phone Number</p>
                <p className="text-slate-800 font-medium text-lg">{user?.phone || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-bold tracking-wide uppercase mb-1">College Name</p>
                <p className="text-slate-800 font-medium text-lg">{user?.college || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-bold tracking-wide uppercase mb-1">Department</p>
                <p className="text-slate-800 font-medium text-lg">{user?.department || user?.organizationName || 'Not Provided'}</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => alert('Editing profile requires a backend updateProfile endpoint.')}
                className="bg-blue-50 text-blue-700 font-medium px-6 py-2.5 rounded-lg hover:bg-blue-100 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-lg">💳</span>
              Pending Payments
            </h2>

            {pendingPayments.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg font-medium">No pending payments.</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-sm border-b">
                      <th className="p-4 font-medium">Student</th>
                      <th className="p-4 font-medium">Event</th>
                      <th className="p-4 font-medium">Method</th>
                      <th className="p-4 font-medium">Transaction ID</th>
                      <th className="p-4 font-medium">Proof</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingPayments.map(payment => (
                      <tr key={payment._id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{payment.student?.name}</p>
                          <p className="text-xs text-slate-500">{payment.student?.email}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-slate-800">{payment.event?.title}</p>
                          <p className="text-xs font-bold text-slate-500">₹{payment.amount}</p>
                        </td>
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">
                            {payment.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-sm">{payment.transactionId}</td>
                        <td className="p-4">
                          {payment.screenshotUrl ? (
                            <a href={payment.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm font-bold hover:underline">
                              View Proof
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs">No screenshot</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleVerifyPayment(payment._id, 'Approve')}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerifyPayment(payment._id, 'Reject')}
                            className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded transition"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Render EventChat Modal */}
      {activeChatEvent && (
        <EventChat 
          eventId={activeChatEvent._id} 
          eventTitle={activeChatEvent.title} 
          onClose={() => setActiveChatEvent(null)} 
        />
      )}

      {/* Registrations Modal */}
      {viewingRegistrations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Event Registrations</h2>
              <button onClick={() => setViewingRegistrations(null)} className="text-slate-500 hover:text-slate-700">
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1 border border-slate-200 rounded-lg">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Attendee</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Payment Status</th>
                    <th className="px-4 py-3">Tx ID</th>
                    <th className="px-4 py-3">Attendance</th>
                    <th className="px-4 py-3 text-right">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewingRegistrations.data.length === 0 ? (
                    <tr><td colSpan="7" className="px-4 py-4 text-center">No registrations found.</td></tr>
                  ) : (
                    viewingRegistrations.data.map(reg => (
                      <tr key={reg._id}>
                        <td className="px-4 py-3 font-medium text-slate-900">{reg.student?.name || 'Unknown'}</td>
                        <td className="px-4 py-3">{reg.student?.email || 'N/A'}</td>
                        <td className="px-4 py-3">{reg.student?.phone || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            ['Completed', 'Paid', 'Success'].includes(reg.paymentStatus) ? 'bg-green-100 text-green-800' :
                            reg.paymentStatus === 'Free' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {['Completed', 'Success'].includes(reg.paymentStatus) ? 'Paid' : reg.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{reg.transactionId || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            reg.hasAttended ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {reg.hasAttended ? 'Attended' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {reg.certificateUrl ? (
                            <span className="text-green-600 font-bold text-xs flex flex-col items-end">
                              Issued ({reg.certificateRole})
                            </span>
                          ) : (
                            reg.hasAttended && (
                              <button
                                onClick={() => setAssigningCert({ registrationId: reg._id, url: '', role: 'Participant' })}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded text-xs font-bold transition"
                              >
                                Assign
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Assign Certificate Modal */}
      {assigningCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Assign Certificate</h3>
            <form onSubmit={handleAssignCertificate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role/Award</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  value={assigningCert.role}
                  onChange={(e) => setAssigningCert({...assigningCert, role: e.target.value})}
                  required
                >
                  <option value="Participant">Participant</option>
                  <option value="Winner">Winner</option>
                  <option value="Runner-Up">Runner-Up</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Certificate URL (Drive/Cloudinary)</label>
                <input 
                  type="url"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  value={assigningCert.url}
                  onChange={(e) => setAssigningCert({...assigningCert, url: e.target.value})}
                  required
                  placeholder="https://link-to-certificate.pdf"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setAssigningCert(null)}
                  className="px-4 py-2 text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
