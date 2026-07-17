# EventMate - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Vite + React)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Components & Pages                     │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │ Student | Organizer | Admin Modules        │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ Auth Context │  │Theme Context │              │   │
│  │  └──────────────┘  └──────────────┘              │   │
│  └──────────────────────────────────────────────────────┘   │
│           ↓ Axios (API Calls) + Socket.io                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    HTTPS / WebSocket
                           ↓
┌─────────────────────────────────────────────────────────────┐
│             Backend (Express.js + Node.js)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Routes & Controllers                │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │ /auth  | /events | /admin | /registrations │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │  ┌──────────────────┐  ┌────────────────────┐      │   │
│  │  │ Middleware       │  │ Error Handling     │      │   │
│  │  │ - Auth (JWT)     │  │ - Validation       │      │   │
│  │  │ - Authorization  │  │ - Error Response   │      │   │
│  │  │ - Validation     │  │                    │      │   │
│  │  └──────────────────┘  └────────────────────┘      │   │
│  │  ┌──────────────────┐  ┌────────────────────┐      │   │
│  │  │ Utilities        │  │ Socket.io Events   │      │   │
│  │  │ - Tokens         │  │ - Notifications    │      │   │
│  │  │ - OTP            │  │ - Real-time Data   │      │   │
│  │  │ - Fraud Check    │  │                    │      │   │
│  │  └──────────────────┘  └────────────────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
│           ↓ Mongoose (ODM)                                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
                       MongoDB Atlas
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database (MongoDB)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collections                                         │   │
│  │  ┌─────────┐  ┌────────┐  ┌──────────────┐         │   │
│  │  │  Users  │  │ Events │  │ Registrations│         │   │
│  │  └─────────┘  └────────┘  └──────────────┘         │   │
│  │  ┌─────────────┐  ┌────────────┐  ┌──────────┐     │   │
│  │  │Notifications│  │Certificates│  │  Fraud   │     │   │
│  │  └─────────────┘  └────────────┘  └──────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

                      ↓ External Services
            ┌──────────┴──────────┬──────────────────┐
            ↓                     ↓                  ↓
         Cloudinary          Razorpay              Gmail SMTP
      (Image Upload)      (Payments)          (Email Notifications)
```

## Data Flow

### User Registration Flow
```
Frontend (Signup Form)
        ↓
Axios POST /auth/signup
        ↓
Backend authController.signup()
        ↓
Validate Input → Check Email Exists → Hash Password
        ↓
Create User in MongoDB
        ↓
Generate JWT Token
        ↓
Return Token + User Data
        ↓
Frontend (Save Token in localStorage)
        ↓
Redirect to Dashboard
```

### Event Registration Flow
```
Frontend (Event Discovery Page)
        ↓
User clicks "Register"
        ↓
Axios POST /events/:eventId/register
        ↓
Backend (Verify Authentication)
        ↓
Check Event Availability
        ↓
Create Registration Document
        ↓
Generate QR Code
        ↓
Update Event Registration Count
        ↓
Return Registration with QR Ticket
        ↓
Frontend (Display QR Code)
```

### Real-time Notification Flow
```
Backend (Admin approves event)
        ↓
Emit Socket event: "notification"
        ↓
Socket.io broadcasts to user room
        ↓
Frontend (Receives event)
        ↓
Update NotificationContext
        ↓
Display Toast Notification
        ↓
Update Notification Bell Count
```

## Authentication & Authorization

### JWT Token Structure
```javascript
{
  userId: ObjectId,
  iat: timestamp,
  exp: timestamp + 30 days
}
```

### Protected Route Flow
```
Request → Check Authorization Header
         ↓
    Verify JWT Token
         ↓
    Extract userId
         ↓
    Attach user to req.user
         ↓
    Check User Role (if authorize middleware)
         ↓
    Proceed to Controller
```

## State Management

### Frontend Context Structure
```
AuthContext
├── user (current user data)
├── token (JWT token)
├── isAuthenticated (boolean)
├── loading (boolean)
└── Methods
    ├── signup()
    ├── login()
    ├── logout()
    ├── forgotPassword()
    ├── verifyOTP()
    └── resetPassword()

ThemeContext
├── isDark (boolean)
└── Methods
    └── toggleTheme()

NotificationContext
├── notifications (array)
├── unreadCount (number)
└── Methods
    ├── markAsRead()
    ├── clearNotifications()
    └── sendNotification()
```

## Error Handling

### Error Flow
```
Frontend API Call
        ↓
Axios Request Interceptor
        ↓
Backend Route Handler
        ↓
Controller Logic (try-catch)
        ↓
Error Caught
        ↓
Pass to Error Middleware
        ↓
Format Error Response
        ↓
Return HTTP Status + Error Message
        ↓
Axios Response Interceptor
        ↓
Check 401 → Clear Token → Redirect to Login
        ↓
Frontend (Display Error Toast)
```

## Database Schema Relationships

```
User (1)
  ├── (1..n) Event (organizer)
  ├── (1..n) Registration (user)
  ├── (1..n) Notification (user)
  ├── (1..n) Certificate (user)
  └── (1..n) FraudDetection (user)

Event (1)
  ├── (n) Registration (event)
  ├── (n) Certificate (event)
  └── (1) User (organizer)

Registration (1)
  ├── (1) User (user)
  └── (1) Event (event)

Notification (1)
  ├── (1) User (user)
  └── (1) Event (event - optional)

Certificate (1)
  ├── (1) User (user)
  └── (1) Event (event)

FraudDetection (1)
  ├── (1) User (user - optional)
  └── (1) Event (event - optional)
```

## API Request/Response Format

### Request Format
```json
{
  "headers": {
    "Authorization": "Bearer <JWT_TOKEN>",
    "Content-Type": "application/json"
  },
  "body": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

### Success Response Format
```json
{
  "success": true,
  "data": {
    "key": "value"
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## Security Measures

1. **Authentication**
   - JWT tokens with 30-day expiration
   - Secure password hashing with bcrypt

2. **Authorization**
   - Role-based access control (RBAC)
   - Protected routes with middleware

3. **Data Validation**
   - Express-validator on backend
   - Frontend validation before submission
   - Input sanitization

4. **CORS & Headers**
   - Helmet.js for security headers
   - CORS restricted to frontend URL
   - Rate limiting on API endpoints

5. **Password Reset**
   - OTP-based reset flow
   - Token expiration (10 minutes)
   - Email verification

## Performance Optimization

1. **Frontend**
   - Code splitting with React.lazy()
   - Image optimization
   - Caching strategies
   - React.memo for expensive components

2. **Backend**
   - Database indexing
   - Query optimization
   - Response pagination
   - Connection pooling

3. **Database**
   - Indexed fields for search
   - Aggregation pipelines for analytics
   - Proper TTL indexes for temporary data

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless backend (tokens in client)
   - Load balancing ready
   - Session-less authentication

2. **Database Scaling**
   - MongoDB sharding ready
   - Aggregation pipelines for reports
   - Index optimization for queries

3. **Real-time Scaling**
   - Socket.io adapter for multiple servers
   - Redis for session management (future)
   - Message queues for events (future)

---

This architecture is designed to be scalable, maintainable, and production-ready while following industry best practices.
