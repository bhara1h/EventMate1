import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = React.useState([]);
  const [showNotifications, setShowNotifications] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    
    const socket = io('http://localhost:5000');
    
    socket.on('event_approved', (data) => {
      setNotifications(prev => [{ id: Date.now(), ...data }, ...prev]);
    });

    return () => socket.disconnect();
  }, [user]);

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
          E
        </div>
        <span className="font-bold text-xl text-slate-800">EventMate</span>
        <span className="ml-4 px-2 py-1 bg-slate-100 text-xs font-medium text-slate-600 rounded-md uppercase">
          {user.role} Portal
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 mr-4">
          {user.role === 'Student' && (
            <Link to="/my-tickets" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
              My Tickets
            </Link>
          )}
          {user.role === 'Organizer' && (
            <Link to="/scanner" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
              Scan Tickets
            </Link>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition relative"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm">Notifications</span>
                <button 
                  onClick={() => setNotifications([])}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-500">No new notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition">
                      <p className="text-sm text-slate-800">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-sm border-l border-slate-200 pl-4">
          <p className="font-medium text-slate-800">{user.name}</p>
          <p className="text-slate-500 text-xs">{user.email}</p>
        </div>
        <button 
          onClick={logout}
          className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
