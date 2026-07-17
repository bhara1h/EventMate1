.github/
# GitHub Copilot Instructions for EventMate

This document provides guidelines for using GitHub Copilot with the EventMate project.

## Project Overview

EventMate is a full-stack SaaS application for college event management with:
- React.js frontend with Tailwind CSS
- Node.js/Express backend
- MongoDB database
- JWT authentication
- Role-based access control (Student, Organizer, Admin)

## Code Patterns

### Frontend Components
- Use functional components with hooks
- Destructure props for clarity
- Use Tailwind CSS classes for styling
- Follow component folder organization

Example:
```jsx
export default function MyComponent({ prop1, prop2 }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{prop1}</h1>
    </div>
  )
}
```

### Backend Controllers
- Use async/await for promise handling
- Always handle errors in try-catch blocks
- Validate input data before processing
- Return consistent JSON responses

Example:
```javascript
export const handleRequest = async (req, res, next) => {
  try {
    // Process request
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}
```

## File Naming Conventions

- Components: PascalCase (e.g., `EventCard.jsx`)
- Functions: camelCase (e.g., `getEvents.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- CSS Classes: kebab-case (e.g., `primary-button`)

## Common Tasks

### Add a New Page
1. Create component in `/pages/{role}/PageName.jsx`
2. Add route in `App.jsx`
3. Use consistent layout with Header/Footer
4. Implement proper error handling

### Add an API Endpoint
1. Create controller method in `/controllers/`
2. Create route in `/routes/`
3. Add validation middleware
4. Document endpoint in README

### Add a Component
1. Create in `/components/{category}/ComponentName.jsx`
2. Export as default
3. Add prop types documentation
4. Include accessibility attributes

## Testing Approach

- Write unit tests for utilities
- Test API endpoints with Postman
- Test authentication flows thoroughly
- Verify responsive design on mobile

## Performance Tips

- Use React.memo for expensive components
- Lazy load routes for code splitting
- Optimize images with Cloudinary
- Implement pagination for large lists
- Cache API responses appropriately

## Security Best Practices

- Never commit .env files
- Use HTTPS in production
- Validate all user inputs
- Sanitize data before database insertion
- Use helmet.js for security headers
- Implement rate limiting on APIs

## Common Issues & Solutions

**Issue: CORS errors in development**
- Solution: Check FRONTEND_URL in backend .env

**Issue: Token authentication failing**
- Solution: Verify JWT_SECRET matches in .env

**Issue: Database connection timeout**
- Solution: Check MongoDB connection string and IP whitelist

## Resources

- Project README: `/README.md`
- Frontend Guide: `/frontend/README.md`
- Backend Guide: `/backend/README.md`
- API Documentation: `/backend/README.md#api-endpoints`

## Questions for Clarification

When Copilot is unsure, ask:
- Which user role is this feature for?
- Should this be a new route or modify existing?
- What's the expected API response format?
- Is this component reusable or role-specific?

---

Last Updated: June 2024
