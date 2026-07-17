import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [pendingEvents, setPendingEvents] = useState([]);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      const res = await api.get('/admin/events/pending');
      setPendingEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/admin/events/${id}/status`, { status });
      // Remove from list
      setPendingEvents(pendingEvents.filter(e => e._id !== id));
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Verification Center</h1>
          <p className="text-slate-600">Review and approve new events submitted by organizers.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800">Pending Approvals</h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
              {pendingEvents.length} Events
            </span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {pendingEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                All caught up! No pending events to review.
              </div>
            ) : (
              pendingEvents.map(event => (
                <div key={event._id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-slate-50 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">{event.category}</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">{event.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                      <div><strong className="block text-slate-400 text-xs uppercase mb-1">Organizer</strong> {event.organizer?.name}</div>
                      <div><strong className="block text-slate-400 text-xs uppercase mb-1">Date</strong> {new Date(event.date).toLocaleDateString()} at {event.time}</div>
                      <div><strong className="block text-slate-400 text-xs uppercase mb-1">Location</strong> {event.location}</div>
                      <div><strong className="block text-slate-400 text-xs uppercase mb-1">Capacity/Price</strong> {event.capacity} pax • {event.isFree ? 'Free' : `₹${event.price}`}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => handleStatusUpdate(event._id, 'Approved')}
                      className="flex-1 md:w-32 bg-green-50 text-green-700 hover:bg-green-100 font-medium py-2 px-4 rounded-lg border border-green-200 transition"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(event._id, 'Rejected')}
                      className="flex-1 md:w-32 bg-red-50 text-red-700 hover:bg-red-100 font-medium py-2 px-4 rounded-lg border border-red-200 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
