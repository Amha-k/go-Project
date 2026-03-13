# EventHub - Complete Event Booking Platform

A modern, full-stack event booking platform with separate dashboards for attendees and event organizers.

## 🚀 Quick Start

```bash
# 1. Start Backend
go run main.go

# 2. Start Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

**For detailed setup**, see [QUICK_START.md](QUICK_START.md)

## 📋 Project Structure

```
EventHub/
├── [Backend - Go/Gin]
│   ├── main.go
│   ├── models/              # Data models
│   ├── routes/              # API routes
│   ├── handlers/            # Request handlers
│   └── middleware/          # Custom middleware
│
├── frontend/                # [Frontend - Next.js]
│   ├── app/                 # Page routes
│   ├── components/          # React components
│   ├── contexts/            # State management
│   ├── lib/                 # Utilities & API
│   ├── types/               # TypeScript types
│   └── package.json
│
└── [Documentation Files]
    ├── QUICK_START.md                      # 👈 START HERE
    ├── FRONTEND_SETUP.md                   # Frontend guide
    ├── INTEGRATION_GUIDE.md                # API docs
    ├── FRONTEND_BUILD_SUMMARY.md           # Build overview
    ├── VALIDATION_CHECKLIST.md             # QA checklist
    └── DOCUMENTATION_INDEX.md              # Doc index
```

## 🎯 Features

### For Attendees
✅ User registration & authentication  
✅ Browse available events  
✅ View detailed event information  
✅ Purchase event tickets  
✅ Manage purchased tickets  
✅ View ticket history  
✅ User profile management  
✅ Multi-factor authentication (MFA)  

### For Event Organizers
✅ Company registration & authentication  
✅ Create new events  
✅ Manage event details  
✅ Track ticket sales  
✅ View event analytics  
✅ Edit/delete events  
✅ Manage ticket inventory  

### Payment & Transactions
✅ Regular card payment processing  
✅ Stripe integration  
✅ Payment verification  
✅ Transaction history  
✅ Refund support (framework ready)  

## 🏗️ Technology Stack

### Backend
- **Framework**: Go with Gin
- **Database**: Configured for your setup
- **Authentication**: JWT tokens
- **API**: REST API with CORS support

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **State**: React Context API
- **HTTP**: Fetch API with JWT auth

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](QUICK_START.md) | Getting started in 5 minutes |
| [FRONTEND_SETUP.md](frontend/README.md) | Frontend installation & setup |
| [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) | API integration details |
| [frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md) | Production deployment |
| [FRONTEND_BUILD_SUMMARY.md](FRONTEND_BUILD_SUMMARY.md) | Build overview |
| [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) | Complete doc index |
| [VALIDATION_CHECKLIST.md](VALIDATION_CHECKLIST.md) | QA checklist |

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ (for frontend)
- Go 1.20+ (for backend)
- npm or pnpm (for package management)

### Backend Setup
```bash
# Install dependencies
go mod download

# Run server
go run main.go

# Backend runs on http://localhost:8080
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

### Configuration
Update `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🧪 Testing

### Create Test Accounts
1. **User Account**
   - Email: `user@test.com`
   - Password: `password123`

2. **Company Account**
   - Email: `company@test.com`
   - Password: `password123`

### Test Features
1. Browse events as a user
2. Create an event as a company
3. Purchase a ticket as a user
4. View tickets in user dashboard

## 🚢 Deployment

### Frontend Deployment

**Option 1: Vercel (Recommended)**
```bash
cd frontend
vercel deploy --prod
```

**Option 2: Docker**
```bash
cd frontend
docker build -t eventhub-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=<api_url> eventhub-frontend
```

**Option 3: Traditional Server**
```bash
cd frontend
npm run build
npm run start
```

See [frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md) for detailed deployment guides.

## 📊 API Endpoints

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /company/register` - Company registration
- `POST /company/login` - Company login
- `POST /verify-mfa` - MFA verification

### Events
- `GET /users/events` - List all events
- `POST /company/event` - Create event
- `PATCH /company/event/:id` - Update event
- `DELETE /company/event/:id` - Delete event
- `GET /company/event` - Get company events

### Tickets
- `GET /users/tickets` - List user tickets
- `POST /users/events/:id/buy` - Purchase ticket
- `POST /users/events1/:id/buy` - Stripe purchase

### Payments
- `GET /users/payment/verify/:txref` - Verify payment

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for complete API documentation.

## 🔐 Security Features

✅ JWT-based authentication  
✅ Password hashing (backend)  
✅ CORS protection  
✅ Input validation (Zod + backend)  
✅ XSS prevention  
✅ Secure HTTP headers  
✅ Rate limiting (ready to implement)  
✅ SQL injection prevention (parameterized queries)  

## 🤝 Contributing

To add features or fix bugs:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 🐛 Troubleshooting

### Frontend won't start
```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Start again
npm run dev
```

### API connection issues
- Verify backend is running: `http://localhost:8080`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Enable CORS on backend

### Login issues
- Check browser DevTools → Application → Local Storage
- Verify `auth_token` is being stored
- Check backend logs for errors

See [QUICK_START.md](QUICK_START.md) for more troubleshooting.

## 📈 Performance

### Frontend Metrics
- Optimized with Next.js (automatic code splitting)
- Tailwind CSS for minimal bundle size
- Lazy loading for components
- Image optimization ready

### Backend Metrics
- RESTful API with efficient queries
- Connection pooling ready
- Caching support implemented

## 🔄 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search & filtering
- [ ] Event reviews & ratings
- [ ] Wishlist/favorites
- [ ] Social login
- [ ] Email verification
- [ ] Invoice generation
- [ ] Event cancellation & refunds
- [ ] Analytics dashboard
- [ ] Mobile app

## 📝 License

[Your License Here]

## 👥 Support

For help:
1. Check [QUICK_START.md](QUICK_START.md)
2. Review [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
3. Check troubleshooting sections
4. Review relevant documentation file

## 📞 Contact

[Your contact information here]

---

## 🎉 You're Ready!

Start the project now:
```bash
# Terminal 1 - Backend
go run main.go

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Visit `http://localhost:3000` to see the app!

For detailed setup, see [QUICK_START.md](QUICK_START.md)

---

**Project Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2024
