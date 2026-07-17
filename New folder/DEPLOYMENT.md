# EventMate - Deployment Guide

This guide provides step-by-step instructions for deploying EventMate to production.

## Prerequisites

- GitHub account with repository access
- MongoDB Atlas account
- Cloudinary account
- Razorpay account
- Vercel account (for frontend)
- Railway/Render account (for backend)

## Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Project
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project
3. Create a cluster (Free tier is sufficient for testing)
4. Configure network access (whitelist all IPs for development: 0.0.0.0/0)
5. Create a database user with read/write access
6. Get the connection string

### 2. Initialize Collections
```bash
# The MongoDB collections will be created automatically by Mongoose
# No manual setup needed
```

## Cloudinary Setup

### 1. Create Cloudinary Account
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Create an upload preset for image uploads

### Environment Variables
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Razorpay Setup

### 1. Create Razorpay Account
1. Sign up at [Razorpay](https://razorpay.com)
2. Complete KYC verification
3. Go to Settings → API Keys
4. Copy Key ID and Key Secret

### Environment Variables
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

## Email Setup (Gmail SMTP)

### 1. Enable Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Create an App Password for Mail
4. Copy the generated password

### Environment Variables
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="EventMate <no-reply@eventmate.com>"
```

## Frontend Deployment (Vercel)

### 1. Prepare Frontend
```bash
cd frontend
npm run build
```

### 2. Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel
```

### 3. Configure Environment Variables in Vercel
```env
VITE_API_URL=https://your-api-url.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_RAZORPAY_KEY_ID=your_key_id
VITE_GOOGLE_CLIENT_ID=your_client_id
```

### 4. Update Vercel Settings
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `frontend`

## Backend Deployment (Railway)

### 1. Prepare Backend
```bash
cd backend
# Ensure all environment variables are set
```

### 2. Connect to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Set environment variables
railway variables
```

### 3. Configure Environment Variables
In Railway dashboard, set:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_min_32_chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="EventMate <no-reply@eventmate.com>"
FRONTEND_URL=https://your-frontend-url.com
PORT=5000
NODE_ENV=production
```

### 4. Deploy
```bash
# Deploy to Railway
railway up
```

### 5. Get Backend URL
- Copy the public URL from Railway dashboard
- Update frontend API_URL to point to this URL

## Docker Deployment

### Frontend Dockerfile
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: eventmate
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/eventmate
      JWT_SECRET: ${JWT_SECRET}
      # ... other env vars
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## Production Checklist

### Security
- [ ] All sensitive keys in environment variables
- [ ] HTTPS enabled on production
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Helmet.js security headers enabled
- [ ] No console.log statements in production code
- [ ] Input validation on both frontend and backend

### Performance
- [ ] Frontend minified and optimized
- [ ] Images optimized and using CDN
- [ ] Database indexes created
- [ ] Caching strategy implemented
- [ ] Code splitting and lazy loading enabled
- [ ] API response times monitored

### Monitoring
- [ ] Error tracking (Sentry/Rollbar)
- [ ] Performance monitoring (Google Analytics)
- [ ] Uptime monitoring
- [ ] Log aggregation setup
- [ ] Database backups configured

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Load testing performed
- [ ] Security audit completed

## Post-Deployment

### 1. Health Checks
```bash
# Check backend health
curl https://your-api-url.com/health

# Check frontend accessibility
curl https://your-frontend-url.com
```

### 2. Test Authentication
- Create test account
- Login and verify token
- Test protected routes

### 3. Test Payment Integration
- Use Razorpay test keys
- Complete a test transaction

### 4. Monitor Logs
- Check backend logs in Railway
- Check frontend errors in browser console
- Monitor MongoDB Atlas activity

### 5. Setup CI/CD

#### GitHub Actions for Frontend
```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend && npm install && npm run build
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

#### GitHub Actions for Backend
```yaml
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd backend && npm install
      - uses: railway/action@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
```

## Rollback Procedure

### Frontend Rollback (Vercel)
1. Go to Vercel Dashboard
2. Select project
3. Go to Deployments
4. Click "Promote to Production" on previous version

### Backend Rollback (Railway)
1. Go to Railway Dashboard
2. Select deployment
3. Click "Rollback" button

## Monitoring & Maintenance

### Daily Tasks
- Monitor error logs
- Check system health
- Review user feedback

### Weekly Tasks
- Analyze performance metrics
- Review security logs
- Plan database optimization

### Monthly Tasks
- Update dependencies
- Review and optimize slow queries
- Perform security audit

## Troubleshooting

### 502 Bad Gateway
- Check if backend is running
- Verify database connection
- Check environment variables

### CORS Errors
- Update FRONTEND_URL in backend .env
- Clear browser cache
- Check origin in CORS configuration

### Database Connection Timeout
- Check IP whitelist in MongoDB Atlas
- Verify connection string
- Check network connectivity

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [GitHub Actions](https://github.com/features/actions)

---

For deployment issues, contact devops@eventmate.com
