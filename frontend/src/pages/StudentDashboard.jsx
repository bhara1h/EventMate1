import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import EventChat from '../components/EventChat';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discover'); // 'discover', 'tickets', 'history'
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeChatEvent, setActiveChatEvent] = useState(null);

  useEffect(() => {
    fetchApprovedEvents();
    fetchMyTickets();
  }, []);

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
    try {
      // 1. Create order
      const { data: orderOrRegistration } = await api.post('/payments/create-order', { eventId: event._id });
      
      if (orderOrRegistration.success && orderOrRegistration.registration) {
        alert('Successfully registered for free event! QR ticket generated.');
        fetchMyTickets(); // Refresh tickets after registration
        setActiveTab('tickets');
        return;
      }

      // 2. Open Razorpay Checkout for Paid events
      const rzpKey = 'rzp_test_placeholder'; // Should be env var in production

      if (rzpKey === 'rzp_test_placeholder') {
        // SIMULATE PAYMENT FOR DEMO PURPOSES
        const simulatePayment = confirm("Demo Mode: Simulating Razorpay Payment. Click OK to complete payment.");
        if (simulatePayment) {
          const verifyData = {
            razorpayOrderId: orderOrRegistration.id,
            razorpayPaymentId: `pay_sim_${Math.random().toString(36).substring(7)}`,
            razorpaySignature: 'simulated_signature', // Will need to bypass backend check
            eventId: event._id
          };
          
          const result = await api.post('/payments/verify', verifyData);
          if(result.data.success) {
            alert('Payment successful! Your QR ticket is ready.');
            fetchMyTickets();
            setActiveTab('tickets');
          }
        }
        return;
      }

      const options = {
        key: rzpKey,
        amount: orderOrRegistration.amount,
        currency: orderOrRegistration.currency,
        name: 'EventMate',
        description: `Registration for ${event.title}`,
        order_id: orderOrRegistration.id,
        handler: async function (response) {
          // 3. Verify Payment
          const verifyData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            eventId: event._id
          };
          
          const result = await api.post('/payments/verify', verifyData);
          if(result.data.success) {
            alert('Payment successful! Your QR ticket is ready.');
            fetchMyTickets(); // Refresh tickets after successful payment
            setActiveTab('tickets');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#2563eb'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error initiating payment');
    }
  };

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
        </div>

        {/* Tab Contents */}
        {activeTab === 'discover' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <p className="text-slate-500">No upcoming events found.</p>
            ) : (
              events.map(event => (
                <div key={event._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition">
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
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="flex items-center text-sm text-slate-600 mb-2">
                      <span className="mr-2">📅</span>
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    <div className="flex items-center text-sm text-slate-600 mb-4">
                      <span className="mr-2">📍</span>
                      {event.location}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
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
              tickets.filter(t => !t.hasAttended).map(ticket => (
                <div key={ticket._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                  <div className="bg-blue-600 p-4 text-white">
                    <h3 className="font-bold text-xl truncate">{ticket.event.title}</h3>
                    <p className="text-blue-100 text-sm">{new Date(ticket.event.date).toLocaleDateString()} • {ticket.event.time}</p>
                  </div>
                  <div className="p-6 flex flex-col items-center border-b border-slate-100 border-dashed">
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 mb-4">
                      <QRCodeSVG value={ticket.qrCodeData} size={160} />
                    </div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Ticket ID: {ticket.qrCodeData.slice(0, 8)}</p>
                  </div>
                  <div className="p-4 bg-slate-50 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600 truncate mr-2">{ticket.event.location}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setActiveChatEvent(ticket.event)}
                        className="text-xs px-3 py-1.5 rounded-lg font-bold bg-purple-100 text-purple-700 hover:bg-purple-200 transition shrink-0"
                      >
                        💬 Chat
                      </button>
                      <span className="text-xs px-2 py-1 rounded-full font-bold bg-yellow-100 text-yellow-700 shrink-0">
                        Valid
                      </span>
                    </div>
                  </div>
                </div>
              ))
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
                    <th className="px-6 py-4">Payment ID</th>
                    <th className="px-6 py-4 text-right">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No registration history found.</td>
                    </tr>
                  ) : (
                    tickets.map(ticket => (
                      <tr key={ticket._id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-medium text-slate-900">{ticket.event.title}</td>
                        <td className="px-6 py-4">{new Date(ticket.registeredAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            ticket.paymentStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                            ticket.paymentStatus === 'Free' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ticket.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          {ticket.razorpayPaymentId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            ticket.hasAttended ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {ticket.hasAttended ? 'Attended' : 'Missed / Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
