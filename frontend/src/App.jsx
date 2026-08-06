import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
import StudentDashboard from './pages/StudentDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Payment from './pages/Payment';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import AttendanceScanner from './pages/AttendanceScanner';
import AIChatbot from './components/AIChatbot';

const LandingPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="glassmorphism p-10 rounded-2xl text-center max-w-2xl">
      <h1 className="text-5xl font-bold mb-4 text-gradient">EventMate</h1>
      <p className="text-xl text-slate-600 mb-8">Smart College Event Planner & Discovery Platform</p>
      <div className="flex justify-center gap-4">
        <Link to="/auth" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">Explore Events</Link>
        <Link to="/auth" className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition font-medium">Sign In</Link>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen font-sans bg-slate-50 text-slate-900">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verifyemail/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/payment/:eventId" element={<Payment />} />
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/scanner" element={<AttendanceScanner />} />
          </Routes>
          <AIChatbot />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
