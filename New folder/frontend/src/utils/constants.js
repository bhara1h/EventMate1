// API and URLs
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Event Categories
export const EVENT_CATEGORIES = [
  'Technology',
  'Entertainment',
  'Sports',
  'Academic',
  'Cultural',
  'Workshop',
  'Seminar',
  'Competition',
  'Social',
  'Other',
]

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
}

// Event Status
export const EVENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
}

// Registration Status
export const REGISTRATION_STATUS = {
  REGISTERED: 'registered',
  ATTENDED: 'attended',
  NO_SHOW: 'no-show',
  CANCELLED: 'cancelled',
}

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
}

// Fraud Severity
export const FRAUD_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
}

// Fraud Type
export const FRAUD_TYPE = {
  UNUSUAL_REGISTRATION: 'unusual_registration',
  FAKE_EVENT: 'fake_event',
  SPAM: 'spam',
  SUSPICIOUS_PAYMENT: 'suspicious_payment',
  OTHER: 'other',
}

// Notification Types
export const NOTIFICATION_TYPES = {
  REGISTRATION: 'registration',
  UPDATE: 'update',
  REMINDER: 'reminder',
  VERIFICATION: 'verification',
  MESSAGE: 'message',
}

// Colors
export const COLORS = {
  PRIMARY: '#8b5cf6',
  SECONDARY: '#0284c7',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
}

// Pagination
export const ITEMS_PER_PAGE = 10
export const MAX_ITEMS_PER_PAGE = 100

// Validation Rules
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 5000,
  MAX_FILE_SIZE: 5242880, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
}

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  NOTIFICATIONS: 'notifications',
  PREFERENCES: 'preferences',
}

// Time Constants (in milliseconds)
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
}

// Default Filter Options
export const DEFAULT_FILTERS = {
  CATEGORY: 'all',
  SORT: 'date',
  ORDER: 'asc',
  LIMIT: 10,
}

// Routes
export const ROUTES = {
  HOME: '/',
  ROLE_SELECTION: '/role-selection',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_OTP: '/auth/verify-otp',
  RESET_PASSWORD: '/auth/reset-password',
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_DISCOVERY: '/student/discovery',
  STUDENT_REGISTERED: '/student/registered-events',
  STUDENT_SAVED: '/student/saved-events',
  STUDENT_NOTIFICATIONS: '/student/notifications',
  STUDENT_CERTIFICATES: '/student/certificates',
  STUDENT_PROFILE: '/student/profile',
  ORGANIZER_DASHBOARD: '/organizer/dashboard',
  ORGANIZER_CREATE: '/organizer/create-event',
  ORGANIZER_MANAGE: '/organizer/manage-events',
  ORGANIZER_ANALYTICS: '/organizer/analytics',
  ORGANIZER_ATTENDANCE: '/organizer/attendance',
  ORGANIZER_PROFILE: '/organizer/profile',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_VERIFY: '/admin/verify-events',
  ADMIN_USERS: '/admin/users',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_FRAUD: '/admin/fraud-detection',
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_EXISTS: 'User with this email already exists.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase and number.',
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  REQUIRED_FIELD: 'This field is required.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully.',
  SIGNUP_SUCCESS: 'Account created successfully.',
  PASSWORD_RESET: 'Password reset successfully.',
  EVENT_CREATED: 'Event created successfully.',
  REGISTRATION_SUCCESS: 'Registered for event successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
}
