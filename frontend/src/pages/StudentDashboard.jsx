import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import EventChat from '../components/EventChat';

const StudentDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'discover');
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeChatEvent, setActiveChatEvent] = useState(null);

  useEffect(() => {
    fetchApprovedEvents();
    fetchMyTickets();
  }, []);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const fetchApprovedEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyTickets = async () => {
    try {
      const res = await api.get('/events/mytickets');
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (event) => {
    if (event.isFree) {
      try {
        const { data } = await api.post('/payments/create-order', { eventId: event._id });
        if (data.success && data.registration) {
          alert('Registration Successful! QR ticket generated.');
          fetchMyTickets(); // Refresh tickets after registration
          setActiveTab('tickets');
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Error registering for free event');
      }
    } else {
      // Redirect paid events to Payment page
      navigate(`/payment/${event._id}`);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Student Portal</h1>
          <p className="text-slate-600">Welcome back, {user?.name}. Manage your event journey here.</p>
        </div>

        {/* Custom Tabs */}
        <div className="flex space-x-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'discover' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Discover Events
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'tickets' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            My Tickets
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'history' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            History & Payments
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
        </div>

        {/* Tab Contents */}
        {activeTab === 'discover' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <p className="text-slate-500">No upcoming events found.</p>
            ) : (
              events.map(event => (
                <div key={event._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="h-48 bg-slate-200 flex items-center justify-center relative overflow-hidden">
                      {event.posterImage ? (
                        <img src={event.posterImage} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-400">🎟️ Event</span>
                      )}
                      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                        {event.category}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-xl mb-1 text-slate-800">{event.title}</h3>
                      <p className="text-sm font-medium text-blue-600 mb-2">
                        {event.organizer?.college || 'Unknown College'} • {event.organizer?.department || event.organizer?.organizationName || 'Department'}
                      </p>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="flex items-center text-sm text-slate-600 mb-2">
                        <span className="mr-2">📅</span>
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>
                      <div className="flex items-center text-sm text-slate-600 mb-4">
                        <span className="mr-2">📍</span>
                        {event.location}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="font-bold text-lg text-slate-800">
                      {event.isFree ? 'Free' : `₹${event.price}`}
                    </div>
                    <button 
                      onClick={() => handleRegister(event)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.length === 0 ? (
              <p className="text-slate-500">You don't have any valid tickets yet.</p>
            ) : (
              tickets.filter(t => !t.hasAttended).map(ticket => {
                const isPaidOrFree = ['Completed', 'Paid', 'Free'].includes(ticket.paymentStatus);
                const isPending = ['Pending', 'Payment Pending'].includes(ticket.paymentStatus);

                return (
                  <div key={ticket._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="bg-blue-600 p-4 text-white">
                        <h3 className="font-bold text-xl truncate">{ticket.event?.title || 'Unknown Event'}</h3>
                        <p className="text-blue-100 text-sm">
                          {ticket.event ? `${new Date(ticket.event.date).toLocaleDateString()} • ${ticket.event.time}` : ''}
                        </p>
                      </div>

                      <div className="p-6 flex flex-col items-center border-b border-slate-100 border-dashed">
                        {isPaidOrFree ? (
                          <>
                            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 mb-4">
                              <QRCodeSVG value={ticket.qrCodeData || ticket.qrCode || ''} size={160} />
                            </div>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                              Ticket ID: {(ticket.qrCodeData || ticket.qrCode || '').slice(0, 8)}
                            </p>
                          </>
                        ) : (
                          <div className="h-[178px] w-full bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center p-4 text-center text-slate-500 mb-4">
                            <span className="text-3xl mb-2">⏳</span>
                            <p className="text-xs font-bold uppercase tracking-wide text-amber-600">Payment Pending</p>
                            <p className="text-[10px] text-slate-400 mt-1">Waiting for payment confirmation.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 space-y-3">
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span className="truncate max-w-[150px]">📍 {ticket.event?.location}</span>
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          isPaidOrFree ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ticket.paymentStatus === 'Completed' ? 'Paid' : ticket.paymentStatus}
                        </span>
                      </div>

                      {/* Transaction details & actions */}
                      <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-2 justify-between items-center">
                        <div className="text-[10px] text-slate-400 font-mono">
                          TxID: {ticket.razorpayPaymentId || ticket.transactionId || 'N/A'}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const receiptWindow = window.open('', '_blank');
                              receiptWindow.document.write(`
                                <html>
                                  <head>
                                    <title>Payment Receipt - EventMate</title>
                                    <style>
                                      body { font-family: sans-serif; padding: 40px; color: #333; }
                                      .receipt-box { border: 1px solid #eee; max-width: 600px; margin: auto; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
                                      .h { font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; color: #2563eb; }
                                      .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #fafafa; padding-bottom: 8px; }
                                      .label { font-weight: bold; color: #666; }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="receipt-box">
                                      <div class="h">EventMate Receipt</div>
                                      <div class="row"><span class="label">Event Name</span><span>${ticket.event?.title}</span></div>
                                      <div class="row"><span class="label">Attendee</span><span>${user?.name}</span></div>
                                      <div class="row"><span class="label">Payment Status</span><span>${ticket.paymentStatus}</span></div>
                                      <div class="row"><span class="label">Transaction ID</span><span>${ticket.razorpayPaymentId || ticket.transactionId || 'N/A'}</span></div>
                                      <div class="row"><span class="label">Amount Paid</span><span>₹${ticket.event?.price || 0}</span></div>
                                      <div class="row"><span class="label">Date</span><span>${new Date(ticket.registeredAt).toLocaleDateString()}</span></div>
                                    </div>
                                  </body>
                                </html>
                              `);
                            }}
                            className="text-[10px] px-2 py-1 rounded font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                          >
                            Receipt
                          </button>
                          {isPaidOrFree ? (
                            <button
                              onClick={() => {
                                alert(`Downloading Ticket for ${ticket.event?.title}...`);
                              }}
                              className="text-[10px] px-2 py-1 rounded font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                              Download Ticket
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/payment/${ticket.event?._id}`)}
                              className="text-[10px] px-2 py-1 rounded font-bold bg-amber-500 text-white hover:bg-amber-600 transition"
                            >
                              Retry Payment
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {tickets.filter(t => !t.hasAttended).length === 0 && tickets.length > 0 && (
              <p className="text-slate-500">All your tickets have been used. Check History for details.</p>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Registration Date</th>
                    <th className="px-6 py-4">Payment Status</th>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Receipt</th>
                    <th className="px-6 py-4">Attendance</th>
                    <th className="px-6 py-4 text-right">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No registration history found.</td>
                    </tr>
                  ) : (
                    tickets.map(ticket => (
                      <tr key={ticket._id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-medium text-slate-900">{ticket.event?.title}</td>
                        <td className="px-6 py-4">{new Date(ticket.registeredAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            ['Completed', 'Paid'].includes(ticket.paymentStatus) ? 'bg-green-100 text-green-800' :
                            ticket.paymentStatus === 'Free' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ticket.paymentStatus === 'Completed' ? 'Paid' : ticket.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          {ticket.razorpayPaymentId || ticket.transactionId || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              const receiptWindow = window.open('', '_blank');
                              receiptWindow.document.write(`
                                <html>
                                  <head>
                                    <title>Payment Receipt - EventMate</title>
                                    <style>
                                      body { font-family: sans-serif; padding: 40px; color: #333; }
                                      .receipt-box { border: 1px solid #eee; max-width: 600px; margin: auto; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
                                      .h { font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; color: #2563eb; }
                                      .row { display: flex; justify-content: justify; margin-bottom: 10px; border-bottom: 1px solid #fafafa; padding-bottom: 8px; }
                                      .label { font-weight: bold; color: #666; }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="receipt-box">
                                      <div class="h">EventMate Receipt</div>
                                      <div class="row"><span class="label">Event Name</span><span>${ticket.event?.title}</span></div>
                                      <div class="row"><span class="label">Attendee</span><span>${user?.name}</span></div>
                                      <div class="row"><span class="label">Payment Status</span><span>${ticket.paymentStatus}</span></div>
                                      <div class="row"><span class="label">Transaction ID</span><span>${ticket.razorpayPaymentId || ticket.transactionId || 'N/A'}</span></div>
                                      <div class="row"><span class="label">Amount Paid</span><span>₹${ticket.event?.price || 0}</span></div>
                                      <div class="row"><span class="label">Date</span><span>${new Date(ticket.registeredAt).toLocaleDateString()}</span></div>
                                    </div>
                                  </body>
                                </html>
                              `);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                          >
                            Print Receipt
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            ticket.hasAttended ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {ticket.hasAttended ? 'Attended' : 'Missed / Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {ticket.certificateUrl ? (
                            <a 
                              href={ticket.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded text-xs font-bold transition flex items-center justify-end gap-1"
                            >
                              <span>🏆</span>
                              {ticket.certificateRole}
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Not Issued</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
                <p className="text-sm text-slate-500 font-bold tracking-wide uppercase mb-1">College</p>
                <p className="text-slate-800 font-medium text-lg">{user?.college || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-bold tracking-wide uppercase mb-1">Student ID</p>
                <p className="text-slate-800 font-medium text-lg">{user?.studentId || 'Not Provided'}</p>
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

export default StudentDashboard;
