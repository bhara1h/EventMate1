# EventMate Frontend

Modern, responsive React frontend for EventMate platform with Tailwind CSS and Framer Motion animations.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update environment variables
# Edit .env with your API URLs and keys
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/           # Shared components (Header, Footer, Button, etc.)
│   ├── auth/             # Auth-related components
│   ├── student/          # Student-specific components
│   ├── organizer/        # Organizer-specific components
│   └── admin/            # Admin-specific components
├── pages/                # Page components (Dashboard, Discovery, etc.)
├── context/              # React Context (Auth, Theme, Notifications)
├── hooks/                # Custom React hooks
├── services/             # API service calls
├── utils/                # Helper functions and constants
├── assets/               # Images and static files
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Purple (#8b5cf6)
- **Secondary**: Blue (#0284c7)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Glassmorphism
Built-in glass effect with backdrop blur and transparency using Tailwind CSS classes.

### Responsive Design
Mobile-first approach with breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🧩 Key Components

### Button
```jsx
<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

### Input
```jsx
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error={errorMessage}
/>
```

### Card
```jsx
<Card className="p-6">
  Card content
</Card>
```

### EventCard
```jsx
<EventCard
  event={eventData}
  onClick={handleClick}
  onRegister={handleRegister}
/>
```

## 🔐 Authentication Flow

1. **Role Selection** → Select Student/Organizer
2. **Signup** → Create account
3. **Login** → Access dashboard
4. **Protected Routes** → Role-based access
5. **Logout** → Clear session

## 📱 Responsive Pages

- **Landing Page** - Hero, features, testimonials
- **Role Selection** - Choose user role
- **Authentication** - Login, signup, password recovery
- **Student Dashboard** - Overview, upcoming events
- **Event Discovery** - Search, filter, recommendations
- **Event Details** - Full event information
- **Registered Events** - QR tickets, event management
- **Organizer Dashboard** - Event management, analytics
- **Admin Dashboard** - Platform overview, moderation

## 🌙 Dark Mode

Toggle dark mode using the theme toggle in the header. Preference is saved to localStorage.

## 🔌 API Integration

All API calls go through Axios with automatic token attachment:

```javascript
import axios from 'axios'

const response = await axios.get('/api/events')
```

## 📊 Charts

Using Recharts for data visualization:
- LineChart - Trends
- BarChart - Comparisons
- PieChart - Distribution

## 🎬 Animations

Framer Motion for smooth animations:
- Page transitions
- Component entrances
- Hover effects
- Loading states

## 🧪 Testing

```bash
npm test
```

## 📦 Dependencies

- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client
- **tailwindcss**: Styling
- **framer-motion**: Animations
- **recharts**: Charts
- **socket.io-client**: Real-time communication
- **react-hot-toast**: Notifications
- **lucide-react**: Icons

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js
port: 5174
```

### CORS Issues
Ensure backend has proper CORS configuration with frontend URL.

### API Connection Failed
Check if backend is running on correct port (default: 5000).

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org)

---

**Last Updated**: June 2024
