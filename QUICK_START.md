# EventHub Quick Start Guide

## Project Overview

EventHub is a modern event booking platform with:
- **Backend**: Go/Gin REST API
- **Frontend**: Next.js 16 with React & TypeScript

## Getting Started

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd /vercel/share/v0-project

# Install Go dependencies
go mod download

# Run the backend
go run main.go
```

Backend will be available at: `http://localhost:8080`

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## Testing the Application

### Create Test User Account

1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Enter test credentials:
   - Email: `user@test.com`
   - Password: `password123`
   - Name: `Test User`

### Create Test Company Account

1. Click "Company" link on homepage
2. Click "Sign Up"
3. Enter test credentials:
   - Email: `company@test.com`
   - Password: `password123`
   - Name: `Test Company`

### Create Test Event (as Company)

1. Login as company
2. Go to Dashboard → My Events → Create Event
3. Fill in event details:
   - Name: "Tech Conference 2024"
   - Description: "Annual tech conference"
   - Date: 2024-06-01
   - Price: $99
   - Available Tickets: 100

### Purchase a Ticket (as User)

1. Logout and login as user
2. Go to Browse Events
3. Find the event you created
4. Click "Buy Ticket"
5. Complete payment form (test credit card: 4111 1111 1111 1111)

## Key Features

### For Users
✅ Browse events  
✅ Purchase tickets  
✅ View purchased tickets  
✅ Manage profile  
✅ Enable MFA (optional)  

### For Companies
✅ Create and manage events  
✅ View event analytics  
✅ Edit/delete events  
✅ Manage ticket inventory  

### Payment Integration
✅ Regular card payments  
✅ Stripe integration  
✅ Payment verification  
✅ Transaction history  

## Project Structure

```
/vercel/share/v0-project/
├── main.go                 # Backend entry point
├── models/                 # Data models
├── routes/                 # API routes
├── handlers/               # Request handlers
├── middleware/             # Custom middleware
│
└── frontend/              # Next.js Frontend
    ├── app/              # Page routes
    ├── components/       # Reusable components
    ├── lib/              # Utilities & API client
    ├── contexts/         # React contexts
    ├── types/            # TypeScript types
    └── package.json
```

## Common Tasks

### Add a New Event Feature

1. **Backend** (`routes/eventRoutes.go`):
   - Add new route handler
   - Update models if needed

2. **Frontend** (`components/events/`):
   - Create new component
   - Add to relevant page

### Fix an Issue

1. **Check Frontend Console**
   - Open DevTools (F12)
   - Look for errors in Console tab

2. **Check Backend Logs**
   - Backend prints logs to stdout
   - Look for request errors

3. **Verify API Connection**
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Ensure backend is running

### Run Tests

```bash
# Frontend (currently no tests set up)
npm run test

# Backend
go test ./...
```

## Useful Commands

### Frontend

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run linter
npm run type-check      # Check TypeScript

# Cleaning
rm -rf .next           # Clear build cache
rm -rf node_modules    # Clear dependencies
```

### Backend

```bash
# Run
go run main.go         # Start server
go build              # Build binary

# Testing
go test ./...         # Run all tests
go test -v ./...      # Verbose test output

# Database
go run migrations/*.go # Run migrations
```

## Troubleshooting

### Frontend won't start

```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Check Node version (should be 18+)
node --version
```

### Backend won't start

```bash
# Check Go version (should be 1.20+)
go version

# Run with debug output
go run main.go -v

# Check port availability
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows
```

### API connection issues

```bash
# Test backend is running
curl http://localhost:8080/health

# Check frontend env var
grep NEXT_PUBLIC_API_URL .env.local

# Verify CORS is enabled on backend
```

### Login not working

1. Check browser DevTools → Application → Local Storage
2. Verify `auth_token` is being stored
3. Check backend login endpoint is working:
   ```bash
   curl -X POST http://localhost:8080/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@test.com","password":"password123"}'
   ```

## Next Steps

1. ✅ Start both frontend and backend
2. ✅ Create test accounts
3. ✅ Create test events
4. ✅ Test ticket purchasing
5. 🔄 Implement additional features
6. 📦 Prepare for production deployment

## Documentation

- **Frontend Setup**: `FRONTEND_SETUP.md`
- **Integration Guide**: `INTEGRATION_GUIDE.md`
- **Deployment Guide**: `frontend/DEPLOYMENT.md`
- **Backend**: Check backend README for API documentation

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the relevant documentation
3. Check browser console for errors
4. Check backend logs
5. Verify environment variables are set correctly

Happy coding! 🚀
