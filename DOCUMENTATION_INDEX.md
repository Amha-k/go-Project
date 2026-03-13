# EventHub Documentation Index

## Quick Navigation

### Getting Started (Start Here!)
1. **[QUICK_START.md](QUICK_START.md)** ⭐ START HERE
   - 5-minute setup guide
   - Test account creation
   - Key features overview
   - Troubleshooting quick fixes

### Setup & Configuration
2. **[FRONTEND_SETUP.md](frontend/README.md)**
   - Project structure overview
   - Installation instructions
   - Environment variables
   - Running development server

3. **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)**
   - API endpoint documentation
   - Authentication flows
   - Event management APIs
   - Payment integration details
   - Data models reference

### Frontend Documentation
4. **[frontend/README.md](frontend/README.md)**
   - Frontend-specific guide
   - Architecture overview
   - Component organization
   - Development workflow

5. **[frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md)**
   - Production deployment
   - Multiple deployment options
   - Security checklist
   - Monitoring & logging
   - Troubleshooting guide

### Comprehensive Guides
6. **[FRONTEND_BUILD_SUMMARY.md](FRONTEND_BUILD_SUMMARY.md)**
   - Complete build overview
   - What was implemented
   - File structure
   - Future enhancements
   - Success metrics

---

## Documentation by Topic

### 🚀 Starting the Project
- [QUICK_START.md](QUICK_START.md) - Complete getting started guide
- [FRONTEND_SETUP.md](frontend/README.md) - Frontend-specific setup

### 🔐 Authentication
- [INTEGRATION_GUIDE.md - Authentication Flow](INTEGRATION_GUIDE.md#authentication-flow)
- [frontend/components/auth/LoginForm.tsx](frontend/components/auth/LoginForm.tsx) - Login implementation

### 📅 Events Management
- [INTEGRATION_GUIDE.md - Event Management](INTEGRATION_GUIDE.md#event-management)
- [frontend/app/(company)/events](frontend/app/(company)/events) - Company event management
- [frontend/app/(user)/events](frontend/app/(user)/events) - User event browsing

### 🎫 Tickets & Booking
- [INTEGRATION_GUIDE.md - Ticket Management](INTEGRATION_GUIDE.md#ticket-management)
- [frontend/app/(user)/checkout](frontend/app/(user)/checkout) - Purchase flow
- [frontend/app/(user)/tickets](frontend/app/(user)/tickets) - Ticket viewing

### 💳 Payment Integration
- [INTEGRATION_GUIDE.md - Payment Integration](INTEGRATION_GUIDE.md#payment-integration)
- [frontend/components/payment/PaymentForm.tsx](frontend/components/payment/PaymentForm.tsx) - Payment UI

### 🛠️ Development
- [frontend/lib/api.ts](frontend/lib/api.ts) - API client configuration
- [frontend/types/index.ts](frontend/types/index.ts) - TypeScript types
- [frontend/lib/validation.ts](frontend/lib/validation.ts) - Form validation

### 📦 Deployment
- [frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md) - Production deployment guide
- [Vercel Deployment Section](frontend/DEPLOYMENT.md#option-1-vercel-recommended) - Vercel setup
- [Docker Deployment Section](frontend/DEPLOYMENT.md#option-2-docker) - Docker containerization

### 🧪 Testing
- [QUICK_START.md - Testing the Application](QUICK_START.md#testing-the-application)
- [QUICK_START.md - Testing Checklist](QUICK_START.md#testing-checklist)

---

## API Reference Quick Links

### Authentication Endpoints
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /company/register` - Company registration
- `POST /company/login` - Company login
- `POST /verify-mfa` - MFA verification

### Event Endpoints
- `GET /users/events` - List all events
- `POST /company/event` - Create event
- `PATCH /company/event/:id` - Update event
- `DELETE /company/event/:id` - Delete event
- `GET /company/event` - Get company events

### Ticket Endpoints
- `GET /users/tickets` - List user tickets
- `POST /users/events/:id/buy` - Purchase ticket (regular)
- `POST /users/events1/:id/buy` - Purchase ticket (Stripe)
- `GET /users/payment/verify/:txref` - Verify payment

---

## File Locations

### Frontend Application
```
frontend/
├── app/                          # Next.js pages & routing
├── components/                   # React components
├── contexts/                     # State management
├── lib/                         # Utilities & API client
├── types/                       # TypeScript types
├── package.json                 # Dependencies
└── .env.local.example          # Environment template
```

### Documentation Files
```
/
├── QUICK_START.md                      # 👈 Start here!
├── FRONTEND_SETUP.md                   # Setup guide
├── INTEGRATION_GUIDE.md                # API documentation
├── FRONTEND_BUILD_SUMMARY.md           # Build overview
├── DOCUMENTATION_INDEX.md              # This file
└── frontend/
    ├── README.md                       # Frontend README
    ├── DEPLOYMENT.md                   # Deployment guide
    └── .env.local.example              # Env template
```

---

## Common Tasks & Solutions

### I want to...

#### Start the project
→ Read [QUICK_START.md](QUICK_START.md)

#### Set up the frontend locally
→ Read [FRONTEND_SETUP.md](frontend/README.md)

#### Understand API integration
→ Read [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

#### Deploy to production
→ Read [frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md)

#### Create a new page
→ Navigate to `frontend/app/` and create your route

#### Add a new component
→ Create in `frontend/components/` folder with appropriate category

#### Configure the backend URL
→ Update `NEXT_PUBLIC_API_URL` in `.env.local`

#### Fix a bug
→ Check [QUICK_START.md - Troubleshooting](QUICK_START.md#troubleshooting)

#### Test a feature
→ Follow [QUICK_START.md - Testing](QUICK_START.md#testing-the-application)

---

## Technology Stack Reference

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 16.0.0 |
| Runtime | Node.js | 18+ |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| UI Components | shadcn/ui | Latest |
| Forms | React Hook Form | 7.x |
| Validation | Zod | Latest |
| HTTP Client | Fetch API | Native |
| State | React Context | 19.x |

---

## Environment Variables

### Required
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Optional
```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx
NEXT_PUBLIC_FLUTTERWAVE_KEY=FLWPUBK_xxxxx
NEXT_PUBLIC_ENABLE_MFA=true
NEXT_PUBLIC_ENABLE_STRIPE=true
```

See [frontend/.env.local.example](frontend/.env.local.example) for complete template.

---

## Support & Troubleshooting

### Common Issues

**Frontend won't start**
→ [QUICK_START.md - Troubleshooting](QUICK_START.md#frontend-wont-start)

**API connection issues**
→ [QUICK_START.md - API connection issues](QUICK_START.md#api-connection-issues)

**Login not working**
→ [QUICK_START.md - Login not working](QUICK_START.md#login-not-working)

### Getting Help

1. Check [QUICK_START.md](QUICK_START.md) troubleshooting section
2. Review relevant documentation above
3. Check browser console (DevTools → Console)
4. Check backend logs
5. Verify environment variables

---

## Development Workflow

### 1. Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

### 2. Development
- Edit files in `frontend/app/` or `frontend/components/`
- Changes auto-reload via Hot Module Replacement
- Check console for errors

### 3. Testing
- Manual testing in browser
- Check browser DevTools
- Verify backend connectivity

### 4. Deployment
- Run `npm run build`
- Follow [frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md)
- Monitor in production

---

## Additional Resources

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

### Learning Resources
- [Next.js Tutorial](https://nextjs.org/learn)
- [React Tutorial](https://react.dev/learn)
- [TypeScript for JavaScript Developers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

---

## Document Versions

| Document | Version | Last Updated | Status |
|----------|---------|--------------|--------|
| QUICK_START.md | 1.0 | 2024 | ✅ Current |
| FRONTEND_SETUP.md | 1.0 | 2024 | ✅ Current |
| INTEGRATION_GUIDE.md | 1.0 | 2024 | ✅ Current |
| DEPLOYMENT.md | 1.0 | 2024 | ✅ Current |
| FRONTEND_BUILD_SUMMARY.md | 1.0 | 2024 | ✅ Current |
| DOCUMENTATION_INDEX.md | 1.0 | 2024 | ✅ Current |

---

## Next Steps

1. **👀 Start Here**: Read [QUICK_START.md](QUICK_START.md)
2. **🚀 Setup**: Follow installation steps
3. **🧪 Test**: Create test accounts and events
4. **📚 Learn**: Review [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for API details
5. **🛠️ Build**: Modify and add features
6. **📦 Deploy**: Use [DEPLOYMENT.md](frontend/DEPLOYMENT.md) for production

---

**Happy Coding! 🎉**

For more help, refer to the Quick Start guide or check the troubleshooting sections in each documentation file.
