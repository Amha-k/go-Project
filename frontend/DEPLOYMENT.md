# EventHub Frontend Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Backend API URL set correctly
- [ ] Testing completed locally
- [ ] Build passes without errors
- [ ] No console errors in production build

## Local Testing

### 1. Build Locally
```bash
npm run build
npm run start
```

### 2. Test Critical Flows
- User login/register
- Company login/register
- Browse events
- Purchase ticket
- View tickets

## Deployment Options

### Option 1: Vercel (Recommended)

**Advantages:** Seamless Next.js integration, automatic deployments, edge functions

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Set Environment Variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL`

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

### Option 2: Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

**Build & Run:**
```bash
docker build -t eventhub-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=<api_url> eventhub-frontend
```

### Option 3: Traditional Server (Node.js)

**1. Build**
```bash
npm run build
```

**2. Install Production Dependencies**
```bash
npm ci --only=production
```

**3. Start with PM2**
```bash
npm install -g pm2
pm2 start npm --name "eventhub-frontend" -- start
pm2 save
pm2 startup
```

**4. Setup Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Configuration

### Production Variables
```env
NEXT_PUBLIC_API_URL=https://api.eventhub.com/api
```

### Sensitive Variables (Use Platform Secrets)
- Database credentials (if any client-side DB access needed)
- API keys for payment providers
- Analytics tokens

## Performance Optimization

### Build Analysis
```bash
npm run build
npm run analyze
```

### Caching Strategy
- Static assets: Long-term caching (1 year)
- HTML pages: Short-term caching (1 hour)
- API calls: Client-side caching with SWR

### Image Optimization
- Next.js `Image` component for automatic optimization
- WebP format with fallbacks
- Lazy loading for images

## Monitoring & Logging

### Error Tracking
Consider integrating:
- Sentry for error monitoring
- LogRocket for session replay
- Datadog or New Relic for performance

### Key Metrics to Monitor
- Page load time
- API response time
- Error rate
- User authentication success rate

## Security Checklist

- [ ] Remove debug logs in production
- [ ] Enable CORS properly on backend
- [ ] Use HTTPS only
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Sanitize API responses
- [ ] Use secure HTTP headers

### Security Headers
```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

## Troubleshooting Deployment

### Build Failures
```bash
npm run build --verbose
# Check for TypeScript errors
npx tsc --noEmit
```

### Runtime Errors
- Check backend API connectivity
- Verify environment variables
- Review server logs
- Check browser console for errors

### Performance Issues
- Analyze bundle size: `npm run build -- --analyze`
- Check for memory leaks
- Optimize database queries
- Enable caching

## Rollback Procedure

### Vercel
```bash
vercel rollback
```

### Docker
```bash
docker run -p 3000:3000 eventhub-frontend:previous-tag
```

### Manual Deployment
```bash
git revert <commit-hash>
npm run build
npm run start
```

## Continuous Deployment

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Scaling Considerations

- **CDN**: Use Vercel Edge or CloudFlare for content delivery
- **Rate Limiting**: Implement on backend for API endpoints
- **Database**: Optimize queries and add caching
- **Frontend**: Lazy load components and code splitting

## Maintenance

- [ ] Regular dependency updates: `npm update`
- [ ] Security patches: `npm audit fix`
- [ ] Monitor error tracking dashboard
- [ ] Review performance metrics weekly
- [ ] Plan feature releases
