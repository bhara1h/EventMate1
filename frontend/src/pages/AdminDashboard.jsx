import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    fetchPendingEvents();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleDeleteEvent = async (id) => {
    if(!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/admin/events/${id}`);
      setPendingEvents(pendingEvents.filter(e => e._id !== id));
      alert('Event deleted');
    } catch (err) {
      alert('Error deleting event');
    }
  };

  const handleToggleSuspend = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/suspend`);
      setUsers(users.map(u => u._id === id ? res.data.user : u));
    } catch (err) {
      alert('Error suspending user');
    }
  };

  const handleVerifyOrganizer = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/verify`);
      setUsers(users.map(u => u._id === id ? res.data.user : u));
    } catch (err) {
      alert('Error verifying organizer');
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

        <div className="flex space-x-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'events' 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Pending Events
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'users' 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Manage Users
          </button>
        </div>

        {activeTab === 'events' && (
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
                        className="flex-1 md:w-32 bg-orange-50 text-orange-700 hover:bg-orange-100 font-medium py-2 px-4 rounded-lg border border-orange-200 transition"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(event._id)}
                        className="flex-1 md:w-32 bg-red-50 text-red-700 hover:bg-red-100 font-medium py-2 px-4 rounded-lg border border-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-lg text-slate-800">Platform Users</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
                {users.length} Users
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-800">{u.name}</td>
                      <td className="px-6 py-4 text-slate-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'Organizer' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.isSuspended ? (
                          <span className="text-red-600 font-bold text-xs">Suspended</span>
                        ) : (
                          <span className="text-green-600 font-bold text-xs">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                        {u.role === 'Organizer' && !u.isVerifiedOrganizer && (
                          <button onClick={() => handleVerifyOrganizer(u._id)} className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold text-xs hover:bg-green-200">
                            Verify Org
                          </button>
                        )}
                        <button 
                          onClick={() => handleToggleSuspend(u._id)} 
                          className={`px-3 py-1 rounded font-bold text-xs ${u.isSuspended ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                        >
                          {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
