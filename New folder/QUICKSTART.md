# EventMate - Quick Start Guide

Get EventMate up and running locally in 5 minutes!

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd eventmate
```

### 2. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```
Frontend will run on `http://localhost:5173`

### 3. Setup Backend (in a new terminal)
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```
Backend will run on `http://localhost:5000`

## 🔑 Environment Variables

### Frontend .env
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_RAZORPAY_KEY_ID=pk_test_your_key_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend .env
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/eventmate
JWT_SECRET=your_secret_key_must_be_at_least_32_characters_long
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=rzp_test_your_key_id
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

## 📝 Sample Test Accounts

### Student Account
- Email: `student@example.com`
- Password: `TestPass123`

### Organizer Account
- Email: `organizer@example.com`
- Password: `TestPass123`

### Admin Account
- Email: `admin@example.com`
- Password: `AdminPass123`

## 🧪 Testing the App

### Test User Registration
1. Go to `http://localhost:5173`
2. Click "Get Started"
3. Select your role (Student/Organizer)
4. Fill in signup form
5. Login with new credentials

### Test Event Creation (Organizer)
1. Login as organizer
2. Go to "Create Event"
3. Fill in event details
4. Submit for approval
5. Admin approves event
6. Event appears in discovery

### Test Event Registration (Student)
1. Login as student
2. Go to "Discover Events"
3. Browse and find events
4. Click "Register"
5. View QR ticket

### Test Admin Functions
1. Login as admin
2. Go to "Verify Events"
3. Approve or reject pending events
4. View user management
5. Check fraud alerts

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Frontend (change port in vite.config.js)
# Backend (change PORT in .env)
```

### MongoDB Connection Error
- Check connection string in .env
- Ensure IP whitelist includes your IP in MongoDB Atlas
- Verify username and password

### CORS Error
- Check FRONTEND_URL in backend .env
- Ensure it matches your frontend URL
- Restart backend server

### API Not Responding
- Check if backend is running on port 5000
- Verify VITE_API_URL in frontend .env
- Check browser console for errors

## 📚 Project Structure

```
eventmate/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React Context
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   ├── utils/        # Utilities
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/               # Express backend
│   ├── controllers/       # Request handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration
│   ├── utils/            # Utilities
│   ├── server.js
│   └── package.json
│
├── README.md             # Main documentation
├── DEPLOYMENT.md         # Deployment guide
└── ARCHITECTURE.md       # Architecture overview
```

## 🎯 Key Features to Try

### Student Features
- ✅ Event Discovery with search and filtering
- ✅ Event Registration with QR ticket
- ✅ Saved Events (Bookmarking)
- ✅ View Registered Events
- ✅ Notifications Center
- ✅ Profile Management
- ✅ Certificates (after event completion)

### Organizer Features
- ✅ Create and manage events
- ✅ View registrations
- ✅ Analytics and reports
- ✅ QR attendance tracking
- ✅ Profile and organization info

### Admin Features
- ✅ Event verification/approval
- ✅ User management
- ✅ Platform analytics
- ✅ Fraud detection
- ✅ User suspension/deletion

## 🚀 Next Steps

1. **Customize Branding**
   - Update colors in `tailwind.config.js`
   - Update logo and favicon
   - Customize metadata

2. **Connect External Services**
   - Setup Cloudinary for image uploads
   - Configure Razorpay for payments
   - Setup Gmail for emails

3. **Deploy to Production**
   - Follow DEPLOYMENT.md guide
   - Configure production environment
   - Setup monitoring

4. **Add More Features**
   - AI recommendations
   - Chat messaging
   - Advanced analytics
   - Mobile app (React Native)

## 📞 Support

For issues and questions:
- Check README.md for detailed documentation
- Review ARCHITECTURE.md for system design
- Check GitHub Issues
- Contact: support@eventmate.com

## 📖 Useful Commands

### Frontend
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Lint code
```

### Backend
```bash
npm run dev       # Start dev server with nodemon
npm start         # Start production server
npm test          # Run tests
```

## 🎨 Design System

- **Primary Color**: Purple (#8b5cf6)
- **Secondary Color**: Blue (#0284c7)
- **Success Color**: Green (#10b981)
- **Error Color**: Red (#ef4444)
- **Font**: Inter (Google Fonts)
- **Dark Mode**: Full support

## ✅ Checklist for First Run

- [ ] Clone repository
- [ ] Install frontend dependencies
- [ ] Install backend dependencies
- [ ] Create .env files (both frontend and backend)
- [ ] Setup MongoDB Atlas account and connection
- [ ] Start frontend dev server
- [ ] Start backend dev server
- [ ] Test login/signup
- [ ] Create a test event
- [ ] Register for event
- [ ] Check admin panel

## 🎉 You're All Set!

Now you're ready to explore EventMate! Start with the student dashboard and try creating events as an organizer.

Happy coding! 🚀

---

For more detailed information, see:
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Architecture Overview](./ARCHITECTURE.md)
