# Frontend Setup Checklist

## Pre-Setup Requirements
- [ ] Node.js 18+ installed
- [ ] npm or yarn package manager
- [ ] Backend server running (`go run main.go` on port 8080)

## Step-by-Step Setup

### 1. Navigate to Frontend Folder
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```
This installs all required packages from `package.json`:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod (validation)
- Axios (HTTP client)
- SWR (data fetching)
- shadcn/ui components
- Radix UI
- And more...

### 3. Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 4. Verify Backend is Running
Before starting the frontend, ensure your Go backend is running:
```bash
# In a separate terminal, from project root
go run main.go
```

Expected output:
```
Server running on :8080
Connected to database successfully
```

### 5. Start Development Server
```bash
npm run dev
```

Expected output:
```
> next dev
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### 6. Open in Browser
Visit: `http://localhost:3000`

You should see:
- EventHub homepage
- Navigation bar
- Login/Register links
- Browse events section

## Verification Steps

### Check Routes Work
- [ ] Home page loads at `/`
- [ ] Login page loads at `/login`
- [ ] Register page loads at `/register`
- [ ] Company login at `/company/login`
- [ ] Company register at `/company/register`

### Check Components
- [ ] Navigation bar appears on all pages
- [ ] Forms have proper validation
- [ ] Buttons are clickable
- [ ] Cards display correctly
- [ ] Colors and styles load

### Check API Connection
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Try to login
- [ ] Should see POST request to `http://localhost:8080/api/auth/login`
- [ ] Check Console for any errors

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: Run `npm install` again
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"
**Solution**: Use different port
```bash
npm run dev -- -p 3001
```

### Issue: "API connection refused"
**Solution**: Ensure backend is running
```bash
# Check if backend is running on port 8080
lsof -i :8080
# If not running, start it
go run main.go
```

### Issue: "404 Not Found" on routes
**Solution**: This is expected - routes need authentication. Login first to access protected pages.

### Issue: "CORS errors in console"
**Solution**: Backend needs CORS enabled for frontend URL
Add to Go backend:
```go
c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
c.Header("Access-Control-Allow-Credentials", "true")
```

## Build for Production

### Build
```bash
npm run build
```

### Test Production Build
```bash
npm start
```

Visit: `http://localhost:3000`

## Deployment Readiness Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Backend API URL updated to production URL
- [ ] No console errors
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] API calls return expected data
- [ ] Authentication flow works
- [ ] Mobile responsive design works
- [ ] Performance acceptable (Lighthouse score)

## Project Structure Verification

Verify these folders/files exist:

```
frontend/
├── app/              ✓ Contains all pages
├── components/       ✓ Contains all React components
├── contexts/         ✓ Contains AuthContext
├── lib/              ✓ Contains API client, validation
├── types/            ✓ Contains TypeScript types
├── package.json      ✓ Dependencies defined
├── tsconfig.json     ✓ TypeScript config
├── next.config.js    ✓ Next.js config
├── tailwind.config.ts ✓ Tailwind config
└── .env.local        ✓ Environment configured
```

## Next Steps After Setup

1. **Login as User**
   - Go to `/login`
   - Create test user account at `/register`
   - Browse events
   - Purchase tickets

2. **Login as Company**
   - Go to `/company/login`
   - Create test company account at `/company/register`
   - Create an event
   - Manage events

3. **Test Payment Flow**
   - Try purchasing a ticket
   - Test payment validation

4. **Review Code**
   - Check component structure
   - Review API integration
   - Study form validation
   - Understand auth flow

## Documentation

For more details, see:
- `QUICK_START.md` - 5-minute overview
- `FRONTEND_SETUP.md` - Detailed setup
- `INTEGRATION_GUIDE.md` - API integration
- `DEPLOYMENT.md` - Production deployment
- `DOCUMENTATION_INDEX.md` - All documentation
