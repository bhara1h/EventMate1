# EventMate Backend API

Express.js backend API for EventMate platform with MongoDB, JWT authentication, and Socket.io real-time features.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (Atlas or local)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update environment variables in .env
```

### Running the Server

#### Development
```bash
npm run dev
```

#### Production
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── controllers/          # Request handlers
├── models/              # MongoDB schemas
├── routes/              # API routes
├── middleware/          # Custom middleware
├── config/              # Configuration files
├── utils/               # Helper functions
├── server.js            # Entry point
└── package.json
```

## 🔐 Authentication

### JWT Token
- Token expires in 30 days
- Sent in `Authorization: Bearer <token>` header
- Required for protected routes

### Password Security
- Passwords hashed with bcrypt (10 salt rounds)
- Minimum 8 characters
- Must contain uppercase and number

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'organizer' | 'admin',
  avatar: String,
  bio: String,
  phone: String,
  location: String,
  organization: String,
  verificationStatus: 'pending' | 'verified' | 'rejected',
  isActive: Boolean,
  isSuspended: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Event
```javascript
{
  title: String,
  description: String,
  category: String,
  organizer: ObjectId,
  date: Date,
  time: String,
  location: String,
  capacity: Number,
  registrations: Number,
  fee: Number,
  poster: String,
  status: 'pending' | 'approved' | 'rejected' | 'cancelled',
  isFake: Boolean,
  tags: [String],
  attendanceCount: Number,
  revenue: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Registration
```javascript
{
  user: ObjectId,
  event: ObjectId,
  status: 'registered' | 'attended' | 'no-show' | 'cancelled',
  qrCode: String,
  ticketId: String,
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded',
  paymentId: String,
  amountPaid: Number,
  checkedInAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 API Endpoints

### Authentication

#### Signup
```
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "student"
}

Response: { token, user }
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: { token, user }
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer <token>

Response: { user }
```

#### Forgot Password
```
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: { message }
```

#### Verify OTP
```
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}

Response: { resetToken }
```

#### Reset Password
```
POST /auth/reset-password
Content-Type: application/json

{
  "token": "resetToken",
  "newPassword": "NewPass123"
}

Response: { message }
```

### Events

#### Get All Events
```
GET /events?category=Technology&search=summit&status=approved

Response: { events }
```

#### Get Event by ID
```
GET /events/:id

Response: { event }
```

#### Create Event
```
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tech Summit",
  "description": "...",
  "category": "Technology",
  "date": "2024-06-15",
  "time": "10:00",
  "location": "Auditorium",
  "capacity": 500,
  "fee": 199
}

Response: { event }
```

#### Update Event
```
PUT /events/:id
Authorization: Bearer <token>
Content-Type: application/json

{ ...event fields }

Response: { event }
```

#### Delete Event
```
DELETE /events/:id
Authorization: Bearer <token>

Response: { message }
```

#### Register for Event
```
POST /events/:eventId/register
Authorization: Bearer <token>

Response: { registration }
```

#### Get My Registrations
```
GET /events/user/registrations
Authorization: Bearer <token>

Response: { registrations }
```

#### Get Event Participants
```
GET /events/:eventId/participants
Authorization: Bearer <token>

Response: { participants }
```

### Admin

#### Get Pending Events
```
GET /admin/events/pending
Authorization: Bearer <token>

Response: { events }
```

#### Approve Event
```
POST /admin/events/:eventId/approve
Authorization: Bearer <token>

Response: { event, message }
```

#### Reject Event
```
POST /admin/events/:eventId/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Misleading content"
}

Response: { event, message }
```

#### Get All Users
```
GET /admin/users
Authorization: Bearer <token>

Response: { users }
```

#### Suspend User
```
POST /admin/users/:userId/suspend
Authorization: Bearer <token>

Response: { user, message }
```

#### Delete User
```
DELETE /admin/users/:userId
Authorization: Bearer <token>

Response: { message }
```

#### Get Platform Stats
```
GET /admin/stats
Authorization: Bearer <token>

Response: { stats }
```

#### Get Suspicious Activities
```
GET /admin/fraud/suspicious-activities
Authorization: Bearer <token>

Response: { activities }
```

#### Report Suspicious Activity
```
POST /admin/fraud/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "unusual_registration",
  "severity": "high",
  "description": "...",
  "userId": "...",
  "eventId": "..."
}

Response: { activity }
```

## 🔌 Socket.IO Events

### Client to Server
- `join-room` - Join a room
- `send-notification` - Send notification
- `send-message` - Send message

### Server to Client
- `user-joined` - User joined room
- `notification` - Receive notification
- `message` - Receive message

## 🔒 Middleware

### Authentication
Protects routes requiring login.

### Authorization
Restricts routes to specific roles (student, organizer, admin).

### Validation
Validates request data using express-validator.

### Error Handler
Catches and formats errors consistently.

## 📝 Logging

Errors and important events are logged to console. For production, integrate with:
- Winston
- Morgan
- Sentry

## 🚀 Deployment

### Heroku
```bash
git push heroku main
```

### Railway
```bash
railway link
railway up
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📚 Environment Variables

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eventmate
JWT_SECRET=your_secret_key_min_32_chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="EventMate <no-reply@eventmate.com>"
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

## 🐛 Troubleshooting

### Database Connection Failed
- Check MongoDB connection string
- Verify IP whitelist in MongoDB Atlas

### JWT Token Invalid
- Check JWT_SECRET matches frontend
- Verify token expiry time

### CORS Errors
- Update FRONTEND_URL in .env
- Check CORS configuration in server.js

## 🧪 Testing

```bash
npm test
```

## 📚 Resources

- [Express.js](https://expressjs.com)
- [MongoDB](https://docs.mongodb.com)
- [Mongoose](https://mongoosejs.com)
- [JWT](https://jwt.io)
- [Socket.IO](https://socket.io)

## 📞 Support

For issues or questions, open a GitHub issue or contact support@eventmate.com

---

**Last Updated**: June 2024
