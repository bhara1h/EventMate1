import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'

// Context
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'

// Pages
import Landing from './pages/Landing'
import RoleSelection from './pages/RoleSelection'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyOTP from './pages/auth/VerifyOTP'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import EventDiscovery from './pages/student/EventDiscovery'
import EventDetails from './pages/student/EventDetails'
import RegisteredEvents from './pages/student/RegisteredEvents'
import SavedEvents from './pages/student/SavedEvents'
import StudentProfile from './pages/student/Profile'
import NotificationsCenter from './pages/student/NotificationsCenter'
import Certificates from './pages/student/Certificates'

// Organizer Pages
import OrganizerDashboard from './pages/organizer/Dashboard'
import CreateEvent from './pages/organizer/CreateEvent'
import ManageEvents from './pages/organizer/ManageEvents'
import EditEvent from './pages/organizer/EditEvent'
import EventAnalytics from './pages/organizer/Analytics'
import AttendanceTracker from './pages/organizer/AttendanceTracker'
import OrganizerProfile from './pages/organizer/Profile'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import EventVerification from './pages/admin/EventVerification'
import UserManagement from './pages/admin/UserManagement'
import PlatformAnalytics from './pages/admin/Analytics'
import FraudDetection from './pages/admin/FraudDetection'

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
              <Route path="/auth/verify-otp" element={<VerifyOTP />} />

              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/discover" element={<EventDiscovery />} />
                <Route path="/student/event/:id" element={<EventDetails />} />
                <Route path="/student/registered-events" element={<RegisteredEvents />} />
                <Route path="/student/saved-events" element={<SavedEvents />} />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/certificates" element={<Certificates />} />
              </Route>

              {/* Common Notifications Route */}
              <Route element={<ProtectedRoute allowedRoles={['student', 'organizer', 'admin']} />}>
                <Route path="/notifications" element={<NotificationsCenter />} />
              </Route>

              {/* Organizer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
                <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                <Route path="/organizer/create-event" element={<CreateEvent />} />
                <Route path="/organizer/manage-events" element={<ManageEvents />} />
                <Route path="/organizer/edit-event/:id" element={<EditEvent />} />
                <Route path="/organizer/analytics" element={<EventAnalytics />} />
                <Route path="/organizer/attendance/:eventId" element={<AttendanceTracker />} />
                <Route path="/organizer/profile" element={<OrganizerProfile />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/verify-events" element={<EventVerification />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/analytics" element={<PlatformAnalytics />} />
                <Route path="/admin/fraud-detection" element={<FraudDetection />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
