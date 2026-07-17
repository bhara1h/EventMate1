# EventMate - API Documentation

Complete API reference for EventMate backend.

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-api-url.com/api
```

## Authentication

All endpoints (except signup/login) require JWT token in Authorization header:

```bash
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "key": "value"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Error message"
    }
  ]
}
```

## Authentication Endpoints

### POST /auth/signup
Create a new user account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  }
}
```

**Status Codes:**
- 201: User created successfully
- 400: Validation error or user exists

### POST /auth/login
Login user with email and password.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  }
}
```

**Status Codes:**
- 200: Login successful
- 401: Invalid credentials

### GET /auth/me
Get current user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "avatar": "avatar_url",
      "bio": "User bio",
      "location": "City, Country"
    }
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

### POST /auth/logout
Logout current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST /auth/forgot-password
Request password reset with OTP.

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### POST /auth/verify-otp
Verify OTP for password reset.

**Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resetToken": "reset_token"
  }
}
```

### POST /auth/reset-password
Reset password with reset token.

**Body:**
```json
{
  "token": "reset_token",
  "newPassword": "NewPass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

## Event Endpoints

### GET /events
Get all approved events with filtering.

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in title/description
- `status` (optional): Filter by status

**Example:**
```
GET /events?category=Technology&search=summit
```

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "_id": "event_id",
        "title": "Tech Summit 2024",
        "description": "...",
        "category": "Technology",
        "organizer": {
          "_id": "organizer_id",
          "name": "John Org",
          "email": "org@example.com"
        },
        "date": "2024-06-15T00:00:00Z",
        "location": "Convention Center",
        "capacity": 500,
        "registrations": 245,
        "fee": 199,
        "poster": "poster_url",
        "status": "approved"
      }
    ]
  }
}
```

### GET /events/:id
Get detailed information about a specific event.

**Response:**
```json
{
  "success": true,
  "data": {
    "event": {
      "_id": "event_id",
      "title": "Tech Summit 2024",
      "description": "...",
      "category": "Technology",
      "organizer": {
        "_id": "organizer_id",
        "name": "John Org",
        "email": "org@example.com"
      },
      "date": "2024-06-15T00:00:00Z",
      "time": "10:00",
      "location": "Convention Center",
      "capacity": 500,
      "registrations": 245,
      "fee": 199,
      "poster": "poster_url",
      "status": "approved",
      "tags": ["tech", "summit"],
      "attendanceCount": 200
    }
  }
}
```

**Status Codes:**
- 200: Success
- 404: Event not found

### POST /events
Create a new event (Organizer only).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Tech Summit 2024",
  "description": "A conference on latest technologies",
  "category": "Technology",
  "date": "2024-06-15",
  "time": "10:00",
  "location": "Convention Center",
  "capacity": 500,
  "fee": 199
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "event": {
      "_id": "event_id",
      "title": "Tech Summit 2024",
      "status": "pending",
      "organizer": {
        "_id": "organizer_id",
        "name": "John Org"
      }
    }
  }
}
```

**Status Codes:**
- 201: Event created
- 400: Validation error
- 403: Not authorized

### PUT /events/:id
Update an event (Organizer only).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Updated Title",
  "capacity": 600
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "event": {
      "_id": "event_id",
      "title": "Updated Title"
    }
  }
}
```

**Status Codes:**
- 200: Updated successfully
- 403: Not authorized
- 404: Event not found

### DELETE /events/:id
Delete an event (Organizer only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Event deleted"
}
```

**Status Codes:**
- 200: Deleted successfully
- 403: Not authorized

## Registration Endpoints

### POST /events/:eventId/register
Register for an event.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registration": {
      "_id": "registration_id",
      "user": "user_id",
      "event": "event_id",
      "status": "registered",
      "ticketId": "TICKET123",
      "qrCode": "qrcode_data_url",
      "paymentStatus": "completed"
    }
  }
}
```

**Status Codes:**
- 201: Registered successfully
- 400: Already registered or event full
- 404: Event not found

### GET /events/user/registrations
Get current user's registrations.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrations": [
      {
        "_id": "registration_id",
        "event": {
          "_id": "event_id",
          "title": "Tech Summit 2024",
          "date": "2024-06-15"
        },
        "status": "registered",
        "ticketId": "TICKET123",
        "qrCode": "qrcode_data_url"
      }
    ]
  }
}
```

### GET /events/:eventId/participants
Get event participants (Organizer only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "participants": [
      {
        "_id": "registration_id",
        "user": {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "status": "registered",
        "createdAt": "2024-06-01T00:00:00Z"
      }
    ]
  }
}
```

**Status Codes:**
- 200: Success
- 403: Not authorized

## Admin Endpoints

All admin endpoints require `Authorization: Bearer <token>` and admin role.

### GET /admin/events/pending
Get pending events awaiting verification.

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [...]
  }
}
```

### POST /admin/events/:eventId/approve
Approve a pending event.

**Response:**
```json
{
  "success": true,
  "data": {
    "event": {...},
    "message": "Event approved"
  }
}
```

### POST /admin/events/:eventId/reject
Reject a pending event.

**Body:**
```json
{
  "reason": "Misleading event details"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "event": {...},
    "message": "Event rejected"
  }
}
```

### GET /admin/users
Get all users.

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...]
  }
}
```

### POST /admin/users/:userId/suspend
Suspend a user account.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "message": "User suspended"
  }
}
```

### POST /admin/users/:userId/unsuspend
Unsuspend a user account.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "message": "User unsuspended"
  }
}
```

### DELETE /admin/users/:userId
Delete a user permanently.

**Response:**
```json
{
  "success": true,
  "message": "User deleted"
}
```

### GET /admin/stats
Get platform statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 1500,
      "totalEvents": 250,
      "pendingEvents": 15,
      "approvedEvents": 230,
      "students": 1000,
      "organizers": 400
    }
  }
}
```

### GET /admin/fraud/suspicious-activities
Get suspicious activities.

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "_id": "activity_id",
        "type": "unusual_registration",
        "severity": "high",
        "description": "Multiple registrations in short time",
        "status": "pending",
        "user": {...},
        "event": {...},
        "createdAt": "2024-06-01T00:00:00Z"
      }
    ]
  }
}
```

### POST /admin/fraud/report
Report suspicious activity.

**Body:**
```json
{
  "type": "unusual_registration",
  "severity": "high",
  "description": "Multiple quick registrations",
  "userId": "user_id",
  "eventId": "event_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activity": {...}
  }
}
```

## HTTP Status Codes

- `200` - OK / Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized / Invalid Token
- `403` - Forbidden / Not Authorized
- `404` - Not Found
- `500` - Server Error

## Rate Limiting

API endpoints are rate limited to 100 requests per 15 minutes per IP address.

**Headers in Response:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Error Handling

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Token is invalid"
}
```

### Authorization Error
```json
{
  "success": false,
  "message": "User role not authorized to access this route"
}
```

---

For more information, see [Backend README](./backend/README.md)
