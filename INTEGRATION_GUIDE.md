# Frontend-Backend Integration Guide

## Overview

The EventHub frontend is a Next.js application that communicates with a Go/Gin backend API. This guide explains how the frontend integrates with the backend services.

## API Client Setup

### Base Configuration

**File:** `frontend/lib/api.ts`

The API client wrapper handles:
- Base URL configuration
- JWT token injection for all requests
- Error handling and response parsing
- Automatic token refresh (if implemented)

### Configuring API URL

Set the backend API URL via environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Authentication Flow

### User Authentication

1. **Registration** (`POST /users/register`)
   ```typescript
   // Request
   { email: string; password: string; name: string }
   // Response
   { token: string; user: User }
   ```

2. **Login** (`POST /users/login`)
   ```typescript
   // Request
   { email: string; password: string }
   // Response
   { token: string; user: User }
   ```

3. **Token Storage**
   - JWT token stored in `localStorage` with key `auth_token`
   - User data stored in `localStorage` with key `user_data`
   - Token automatically included in all API requests

### Company Authentication

Same flow but with separate endpoints:
- `POST /company/register`
- `POST /company/login`

### MFA (Multi-Factor Authentication)

1. **Enable MFA** (`GET /users/MFAoption`)
   - Returns QR code for TOTP setup

2. **Verify MFA** (`POST /verify-mfa`)
   ```typescript
   { temp_token: string; mfa_code: string }
   // Response
   { token: string }
   ```

## Event Management

### Fetching Events (User)

**Endpoint:** `GET /users/events`

```typescript
// Response
Event[]
```

**Component:** `EventsList.tsx`

### Event Details

Events include:
- `id`: Event ID
- `name`: Event name
- `description`: Event description
- `price`: Ticket price (in cents)
- `event_date`: Event date
- `ticket_number`: Available tickets
- `company_id`: Creator company ID

### Searching Events

**Endpoint:** `GET /users/search?q=query`

Filters events by name or description.

## Ticket Management

### Buying Tickets (Regular Payment)

**Endpoint:** `POST /users/events/:id/buy`

```typescript
// Request
{ quantity: number; email: string }

// Response
{ payment_ref: string; payment_url?: string }
```

### Buying Tickets (Stripe)

**Endpoint:** `POST /users/events1/:id/buy`

```typescript
// Response
{ sessionUrl: string }
// Redirects to Stripe Checkout
```

### Viewing User Tickets

**Endpoint:** `GET /users/tickets`

```typescript
// Response
Ticket[]
```

### Payment Verification

**Endpoint:** `GET /users/payment/verify/:txref`

Verifies payment status and completes ticket purchase.

## Company Event Management

### Creating Events

**Endpoint:** `POST /company/event`

```typescript
// Request
{
  name: string;
  description: string;
  price: number;
  event_date: string;
  ticket_number: number;
}

// Response
{ event: Event }
```

### Getting Company Events

**Endpoint:** `GET /company/event`

Returns all events created by the authenticated company.

### Updating Events

**Endpoint:** `PATCH /company/event/:id`

```typescript
// Request: Partial Event data to update
// Response: Updated Event
```

### Deleting Events

**Endpoint:** `DELETE /company/event/:id`

```typescript
// Response: { success: boolean }
```

## User Profile Management

### Get User Info

User data is stored in auth context after login. No separate endpoint needed.

### Update Profile

**Future Implementation**

The backend may need a `PATCH /users/:id` endpoint for profile updates.

## Payment Integration

### Regular Payment Flow

1. User initiates payment on checkout page
2. Frontend sends payment request to backend
3. Backend processes payment (via Flutterwave or similar)
4. Frontend verifies payment status via `/users/payment/verify/:txref`

### Stripe Payment Flow

1. User clicks "Pay with Stripe"
2. Frontend calls `POST /users/events1/:id/buy`
3. Backend returns Stripe checkout session URL
4. User redirected to Stripe
5. After payment, user redirected to `/checkout/success`

### Payment Callback Handling

- Regular payments: Verify via `GET /users/payment/verify/:txref`
- Stripe payments: Backend should send webhook to update ticket status

## Error Handling

### Standard Error Response

```typescript
{
  success: false;
  message: string;
  code?: string;
}
```

### Handled Errors

- **401 Unauthorized**: User not authenticated, redirect to login
- **403 Forbidden**: User not authorized for action
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation error
- **500 Server Error**: Backend error

## Data Models

### User

```typescript
interface User {
  id: number;
  email: string;
  name: string;
  mfa_enabled: boolean;
  created_at: string;
}
```

### Company

```typescript
interface Company {
  id: number;
  email: string;
  name: string;
  created_at: string;
}
```

### Event

```typescript
interface Event {
  id: number;
  name: string;
  description: string;
  price: number;
  event_date: string;
  ticket_number: number;
  company_id: number;
  created_at: string;
}
```

### Ticket

```typescript
interface Ticket {
  id: number;
  user_id: number;
  event_id: number;
  price: number;
  payment_status: string; // 'pending', 'completed', 'failed'
  payment_ref: string;
  created_at: string;
}
```

## Testing the Integration

### Manual Testing

1. Start backend: `go run main.go`
2. Start frontend: `npm run dev`
3. Navigate to `http://localhost:3000`
4. Test authentication flows
5. Create/browse events
6. Test ticket purchase

### Using API Client in Browser

```typescript
// In browser console
import { api } from '@/lib/api';

// Get events
const events = await api.get('/users/events');

// Create event (company)
await api.post('/company/event', {
  name: 'My Event',
  // ... other fields
});
```

## Troubleshooting

### CORS Issues

Ensure backend has CORS enabled for frontend URL:

```go
config := cors.DefaultConfig()
config.AllowOrigins = []string{"http://localhost:3000"}
r.Use(cors.New(config))
```

### Token Not Persisting

- Check `localStorage` is enabled in browser
- Verify `auth_token` key is being set
- Check token expiration time

### API Calls Failing

- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check backend is running on correct port
- Enable CORS in backend
- Check request headers in browser DevTools

### Payment Issues

- Verify payment provider configuration (Flutterwave/Stripe)
- Check transaction reference matches
- Verify callback URLs are correct

## Future Enhancements

- [ ] Implement token refresh mechanism
- [ ] Add real-time event updates via WebSocket
- [ ] Add file upload for event images
- [ ] Implement email verification
- [ ] Add payment history tracking
- [ ] Implement refund handling
