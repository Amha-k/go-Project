# EventHub Frontend

A modern event booking platform frontend built with Next.js 16, TypeScript, and Tailwind CSS. Supports both event attendees and event organizers with complete authentication and payment integration.

## Features

### For Event Attendees
- **Browse Events**: Discover events with search and filtering
- **Book Tickets**: Purchase tickets with multiple payment methods
- **Manage Tickets**: View and track purchased tickets
- **User Profile**: Manage account settings and security
- **2FA Support**: Optional two-factor authentication

### For Event Organizers
- **Create Events**: Launch new events with details and pricing
- **Manage Events**: Edit, update, and delete events
- **Analytics Dashboard**: Track sales and revenue
- **Ticket Management**: Monitor ticket sales in real-time

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Authentication**: JWT tokens (stored in cookies)

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone and navigate to the frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. **Set up environment variables**:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set the API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. **Run the development server**:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (user)/            # User dashboard and pages
│   ├── (company)/         # Company organizer pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
│
├── components/            # Reusable React components
│   ├── auth/              # Auth-related components
│   └── events/            # Event-related components
│
├── contexts/              # React Context providers
│   └── AuthContext.tsx    # Authentication state
│
├── lib/                   # Utility functions and helpers
│   ├── api.ts            # API client wrapper
│   ├── validation.ts     # Zod schemas
│   └── utils.ts          # Helper functions
│
├── types/                 # TypeScript type definitions
│   └── index.ts          # All types
│
└── public/               # Static assets
```

## API Integration

The frontend communicates with the Go backend via REST API. The API client is located in `lib/api.ts` and handles:

- **Authentication**: User and company login/register
- **Events**: Create, read, update, delete operations
- **Tickets**: Purchase and management
- **Payments**: Payment verification for both regular and Stripe payments
- **MFA**: Two-factor authentication setup

### API Base URL

Set via `NEXT_PUBLIC_API_URL` environment variable. Default: `http://localhost:8080/api`

## Authentication Flow

1. **User registers/logs in** → receives JWT token
2. **Token stored in HTTP-only cookie** → sent with each request
3. **Protected routes** → redirect to login if not authenticated
4. **MFA (optional)** → verify OTP after initial login
5. **Logout** → token removed from cookies

## Key Pages

### User Dashboard
- `/` - Homepage
- `/login` - User login
- `/register` - User registration
- `/user/dashboard` - Browse events
- `/user/events/[id]` - Event details & booking
- `/user/tickets` - My purchased tickets
- `/user/profile` - Account settings

### Company Dashboard
- `/company/login` - Company login
- `/company/register` - Company registration
- `/company/dashboard` - Analytics dashboard
- `/company/events` - Manage events
- `/company/events/create` - Create new event
- `/company/events/[id]/edit` - Edit event

## Styling

The app uses Tailwind CSS with a custom design token system:

```css
/* Design tokens in globals.css */
--background: main background color
--foreground: main text color
--primary: primary accent color
--secondary: secondary background
--accent: brand color (teal)
--muted: muted backgrounds
--muted-foreground: muted text color
```

## Development

### Hot Module Replacement
Changes automatically reflect in the browser during development.

### Type Safety
All components are fully typed with TypeScript.

### Form Validation
Uses React Hook Form + Zod for client-side validation with schema-based validation.

## Building for Production

```bash
npm run build
npm start
```

The app will be optimized and ready for deployment.

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
Build the app (`npm run build`) and deploy the `.next` directory.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080/api` |

## Common Issues

### CORS Errors
Ensure the backend allows requests from your frontend URL. Check backend CORS configuration.

### 401 Unauthorized
JWT token may be expired. Try logging out and logging back in.

### API Not Responding
Verify the backend is running and `NEXT_PUBLIC_API_URL` is correctly set.

## License

MIT License - See LICENSE file for details
