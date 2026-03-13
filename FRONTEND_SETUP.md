# EventHub Frontend Setup Guide

## Project Structure

The frontend is built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components.

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login/register)
│   ├── (user)/            # User dashboard pages
│   ├── (company)/         # Company dashboard pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (Navbar, etc.)
│   ├── auth/              # Auth forms
│   ├── events/            # Event-related components
│   └── payment/           # Payment components
├── contexts/              # React contexts (Auth, etc.)
├── lib/
│   ├── api.ts            # API client wrapper
│   ├── validation.ts     # Zod validation schemas
│   └── utils.ts          # Utility functions
├── types/                # TypeScript types
└── public/              # Static assets
```

## Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Replace `http://localhost:8080/api` with your actual backend API URL.

### 3. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

## Key Features

### Authentication
- User & Company authentication with JWT tokens
- Login/Register pages for both user types
- Auth context for managing user state across the app
- Token storage in localStorage
- Auto-logout on token expiration

### User Dashboard
- Browse all available events
- View event details
- Purchase tickets with payment integration
- View purchased tickets
- Manage profile and MFA settings

### Company Dashboard
- Create and manage events
- View event analytics
- Edit/Delete events
- Manage ticket availability

### Payment Integration
- Support for regular card payments
- Stripe integration for enhanced security
- Payment verification and tracking
- Transaction history

## API Integration

The frontend communicates with the Go backend via the API client wrapper (`lib/api.ts`). All API calls automatically include JWT authentication tokens.

### Backend API Base URL
Default: `http://localhost:8080/api`

### Key Endpoints
- Auth: `/users/register`, `/users/login`, `/company/register`, `/company/login`
- Events: `/users/events`, `/users/events/:id/buy`, `/company/event`
- Tickets: `/users/tickets`
- Payments: `/users/payment/verify/:txref`

## Building for Production

```bash
npm run build
npm run start
```

## Troubleshooting

### API Connection Issues
- Ensure backend is running on the correct port
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify CORS settings on backend

### Auth Issues
- Clear browser storage and try logging in again
- Check if JWT tokens are being stored correctly
- Verify token expiration in browser DevTools

### Component Issues
- Ensure shadcn/ui dependencies are installed
- Check Tailwind CSS is properly configured
- Verify dark mode settings if using dark theme

## Next Steps

1. Configure backend API URL
2. Set up environment variables
3. Install dependencies
4. Run development server
5. Test authentication flows
6. Configure payment providers (if needed)
