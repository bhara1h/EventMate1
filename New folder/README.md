# EventMate - Smart College Event Planner & Discovery Platform

A production-ready full-stack SaaS application for discovering, organizing, and managing college events with modern UI/UX, role-based access control, real-time notifications, QR-based attendance, and advanced analytics.

## 🚀 Features

### For Students
- 🔍 **Event Discovery** - Smart search and filtering by category, location, date
- 📝 **Event Registration** - Quick registration with instant QR ticket generation
- 💳 **Payment Integration** - Razorpay integration for event fees
- 🎫 **QR Tickets** - Generate and manage QR-based event tickets
- 📱 **Notifications** - Real-time notifications via Socket.io
- 📚 **Certificates** - Digital certificates for completed events
- ⭐ **Bookmarking** - Save events for later
- 🤖 **AI Recommendations** - Personalized event suggestions

### For Organizers
- ✨ **Event Creation** - Intuitive event creation workflow
- 📊 **Analytics Dashboard** - Registration trends, attendance rates, revenue tracking
- 👥 **Participant Management** - View and manage event registrations
- 📱 **QR Attendance** - Scan QR codes for real-time attendance tracking
- 💰 **Revenue Analytics** - Track earnings and payment information
- 📢 **Announcements** - Send notifications to registered participants
- 📄 **Reports** - Generate comprehensive event reports

### For Admin
- ✅ **Event Verification** - Approve/reject events before publishing
- 👤 **User Management** - Manage users, roles, and suspensions
- 🚨 **Fraud Detection** - AI-powered fraud detection and prevention
- 📊 **Platform Analytics** - View platform statistics and trends
- 🔒 **Security Management** - Monitor and manage security
- 📋 **Reports** - Generate platform reports

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts and analytics
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Router DOM** - Routing

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Socket.io** - Real-time events
- **Cloudinary** - Image upload
- **QRCode** - QR generation
- **Razorpay** - Payment integration

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account
- Razorpay account

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd eventmate
```

### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Update `.env` with your configuration:
```env
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_RAZORPAY_KEY_ID=your_key_id
```

Run frontend:
```bash
npm run dev
```

### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` with your configuration:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/eventmate
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
```

Run backend:
```bash
npm run dev
```

## 📁 Project Structure

```
eventmate/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── auth/
│   │   │   ├── student/
│   │   │   ├── organizer/
│   │   │   └── admin/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Registration.js
│   │   ├── Notification.js
│   │   ├── Certificate.js
│   │   └── FraudDetection.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errors.js
│   │   └── validation.js
│   ├── config/
│   │   └── database.js
│   ├── utils/
│   │   └── helpers.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

## 🔐 Authentication

The app uses JWT-based authentication:

1. **Signup** - Create account with email, password, and role selection
2. **Login** - Login with email and password
3. **Forgot Password** - OTP-based password reset
4. **Protected Routes** - Role-based access control

## 🎯 API Endpoints

### Auth
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/reset-password` - Reset password
- `GET /auth/me` - Get current user

### Events
- `GET /events` - Get all approved events
- `GET /events/:id` - Get event details
- `POST /events` - Create event (organizer)
- `PUT /events/:id` - Update event (organizer)
- `DELETE /events/:id` - Delete event (organizer)
- `POST /events/:eventId/register` - Register for event
- `GET /user/registrations` - Get user registrations

### Admin
- `GET /admin/events/pending` - Get pending events
- `POST /admin/events/:eventId/approve` - Approve event
- `POST /admin/events/:eventId/reject` - Reject event
- `GET /admin/users` - Get all users
- `POST /admin/users/:userId/suspend` - Suspend user
- `DELETE /admin/users/:userId` - Delete user
- `GET /admin/stats` - Get platform statistics
- `GET /admin/fraud/suspicious-activities` - Get fraud alerts

## 🎨 UI Components

Reusable components built with Tailwind CSS:
- Button - Multiple variants (primary, secondary, danger, ghost)
- Input - Text input with validation
- Card - Glass-morphism card container
- LoadingSpinner - Loading indicator
- Header - Navigation header
- Footer - Footer component
- EventCard - Event display card

## 🌙 Dark Mode

The app includes built-in dark mode support using Tailwind CSS's dark mode feature. Users can toggle between light and dark themes.

## 📊 Analytics & Charts

- Registration trends (line charts)
- Attendance distribution (pie charts)
- Category breakdown (bar charts)
- User growth (line charts)

## 🔔 Real-time Features

- Socket.io for real-time notifications
- Live event updates
- Real-time user notifications
- Live attendance tracking

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist folder
```

### Backend (Heroku/Railway/Render)
```bash
git push heroku main
# Or use Railway/Render CLI
```

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=your_api_url
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_RAZORPAY_KEY_ID=your_key_id
VITE_GOOGLE_CLIENT_ID=your_client_id
```

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
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

## 🧪 Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
npm test
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, email support@eventmate.com or open an issue on GitHub.

## 🎉 Acknowledgments

- React.js team
- Express.js community
- Tailwind CSS team
- All open-source contributors

---

**Made with ❤️ by EventMate Team**
