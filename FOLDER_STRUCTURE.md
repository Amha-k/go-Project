# EventHub - Project Folder Structure

## Overview
The entire Next.js frontend is organized in a single `frontend` folder for easy deployment and management.

## Directory Structure

```
.
├── go-project-root/          # Backend (Go)
│   ├── main.go
│   ├── go.mod
│   ├── controller/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── config/
│
├── frontend/                 # Next.js Frontend (React TypeScript)
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Auth routes group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── company/login/
│   │   │   ├── company/register/
│   │   │   └── layout.tsx
│   │   ├── (user-routes)/    # User dashboard routes group
│   │   │   ├── dashboard/
│   │   │   ├── events/[id]/
│   │   │   ├── tickets/
│   │   │   ├── profile/
│   │   │   ├── checkout/[id]/
│   │   │   └── layout.tsx
│   │   ├── company/          # Company routes (explicit prefix)
│   │   │   ├── dashboard/
│   │   │   ├── events/
│   │   │   ├── events/[id]/edit/
│   │   │   ├── events/create/
│   │   │   ├── profile/
│   │   │   └── layout.tsx
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   │
│   ├── components/           # React Components
│   │   ├── auth/             # Auth components
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── events/           # Event components
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventsList.tsx
│   │   │   └── EventForm.tsx
│   │   ├── layout/           # Layout components
│   │   │   └── Navbar.tsx
│   │   ├── payment/          # Payment components
│   │   │   └── PaymentForm.tsx
│   │   └── ui/               # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── form.tsx
│   │       ├── label.tsx
│   │       ├── alert.tsx
│   │       ├── skeleton.tsx
│   │       ├── dropdown-menu.tsx
│   │       └── index.ts
│   │
│   ├── contexts/             # React Contexts
│   │   └── AuthContext.tsx
│   │
│   ├── lib/                  # Utilities & Helpers
│   │   ├── api.ts            # API client
│   │   ├── validation.ts     # Zod schemas
│   │   ├── utils.ts          # Helper functions
│   │   └── index.ts
│   │
│   ├── types/                # TypeScript Types
│   │   └── index.ts
│   │
│   ├── public/               # Static assets (images, icons, etc.)
│   │
│   ├── package.json          # Frontend dependencies
│   ├── tsconfig.json         # TypeScript config
│   ├── next.config.js        # Next.js config
│   ├── tailwind.config.ts    # Tailwind CSS config
│   ├── postcss.config.js     # PostCSS config
│   ├── .gitignore            # Git ignore
│   ├── .env.local.example    # Environment template
│   ├── README.md             # Frontend README
│   └── DEPLOYMENT.md         # Deployment guide
│
├── QUICK_START.md            # Quick start guide (Root)
├── FRONTEND_SETUP.md         # Frontend setup guide
├── INTEGRATION_GUIDE.md      # API integration guide
├── DOCUMENTATION_INDEX.md    # Documentation index
├── README_PROJECT.md         # Project overview
└── VALIDATION_CHECKLIST.md   # Testing checklist
```

## Key Points

### Frontend Folder (`/frontend`)
- **Self-contained**: All Next.js code is in one folder
- **Production-ready**: Can be deployed independently
- **Organized**: Clear separation of concerns (components, contexts, lib, types)
- **Configured**: Includes all necessary config files

### Route Structure
- **Auth Routes** (`(auth)`): Login/Register for users and companies
- **User Routes** (`(user-routes)`): Dashboard, events, tickets, profile, checkout
- **Company Routes** (`company/`): Explicit prefix to avoid conflicts
- **Public Routes**: Home page at `/`

### No Conflicts
The routing has been fixed to ensure:
- `(auth)` and `(user-routes)` and `company/` don't share the same paths
- Each route group resolves to unique URLs
- Parallel route groups are properly isolated

## Running the Application

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.local.example .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Deployment

The entire `frontend` folder can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- Any Node.js hosting provider

See `DEPLOYMENT.md` for detailed instructions.
