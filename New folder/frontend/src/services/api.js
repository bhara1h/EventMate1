import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resetPassword: (token, newPassword) =>
    api.post('/auth/reset-password', { token, newPassword }),
}

// Event APIs
export const eventAPI = {
  getEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  getOrganizerEvents: () => api.get('/events/organizer'),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  registerForEvent: (eventId) => api.post(`/events/${eventId}/register`),
  getMyRegistrations: () => api.get('/events/user/registrations'),
  getEventParticipants: (eventId) => api.get(`/events/${eventId}/participants`),
}

// Upload APIs
export const uploadAPI = {
  uploadImage: (formData) =>
    api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

// User APIs
export const userAPI = {
  updateProfile: (data) => api.patch('/auth/me', data),
  getSavedEvents: () => api.get('/auth/me/saved-events'),
  saveEvent: (eventId) => api.post(`/auth/me/saved-events/${eventId}`),
  unsaveEvent: (eventId) => api.delete(`/auth/me/saved-events/${eventId}`),
}

// Certificate APIs
export const certificateAPI = {
  getMyCertificates: () => api.get('/certificates/me'),
}

// Notification APIs
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
}

export const adminAPI = {
  getPendingEvents: () => api.get('/admin/events/pending'),
  approveEvent: (eventId) => api.post(`/admin/events/${eventId}/approve`),
  rejectEvent: (eventId, reason) =>
    api.post(`/admin/events/${eventId}/reject`, { reason }),
  getUsers: () => api.get('/admin/users'),
  suspendUser: (userId) => api.post(`/admin/users/${userId}/suspend`),
  unsuspendUser: (userId) => api.post(`/admin/users/${userId}/unsuspend`),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getPlatformStats: () => api.get('/admin/stats'),
  getSuspiciousActivities: () => api.get('/admin/fraud/suspicious-activities'),
  reportSuspiciousActivity: (data) =>
    api.post('/admin/fraud/report', data),
}

export default api
