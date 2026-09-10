# SystemPulse Deployment Guide

This guide covers deploying SystemPulse to various platforms.

## 🚀 Deployment Options

### 1. Vercel (Recommended for Next.js)

#### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free tier available)
- PostgreSQL database (see database options below)

#### Steps
1. **Push code to Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel auto-detects Next.js

3. **Configure environment variables**
   - Add `DATABASE_URL` in Vercel dashboard
   - Format: `postgresql://user:password@host:port/database`

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Future pushes trigger automatic deployments

#### Database Options for Vercel
- **Vercel Postgres**: Built-in PostgreSQL (recommended)
- **Supabase**: Free tier with generous limits
- **Neon**: Serverless PostgreSQL
- **Railway**: PostgreSQL with free tier
- **Amazon RDS**: AWS managed PostgreSQL

---

### 2. Railway

#### Quick Deploy
1. **Create Railway account** at [railway.app](https://railway.app)

2. **New Project from GitHub**
   - Connect GitHub repository
   - Railway auto-detects Next.js

3. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway provides `DATABASE_URL` automatically

4. **Configure**
   - Environment variables are auto-set
   - No additional configuration needed

5. **Deploy**
   - Push to GitHub triggers deployment
   - Railway provides a public URL

---

### 3. Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/systempulse
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=systempulse
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Deploy with Docker Compose
```bash
# Build and start
docker-compose up -d

# Push schema
docker-compose exec app npx drizzle-kit push

# View logs
docker-compose logs -f app
```

---

### 4. AWS (EC2 + RDS)

#### EC2 Setup
1. **Launch EC2 instance**
   - Ubuntu 22.04 LTS
   - t3.small or larger
   - Security group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Connect and install dependencies**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install -y nginx
   ```

3. **Clone and build**
   ```bash
   git clone <your-repo>
   cd systempulse
   npm install
   npm run build
   ```

4. **Set environment variables**
   ```bash
   echo "DATABASE_URL=postgresql://user:pass@your-rds.amazonaws.com:5432/db" > .env
   ```

5. **Start with PM2**
   ```bash
   pm2 start npm --name "systempulse" -- start
   pm2 startup
   pm2 save
   ```

#### RDS PostgreSQL Setup
1. Create RDS PostgreSQL instance
2. Configure security group (allow EC2 access)
3. Note connection details for `DATABASE_URL`

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

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

```bash
sudo ln -s /etc/nginx/sites-available/systempulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### 5. DigitalOcean App Platform

1. **Create new app** from GitHub repository
2. **Configure build settings**
   - Build command: `npm run build`
   - Run command: `npm start`
3. **Add PostgreSQL database**
   - DigitalOcean managed database
   - Auto-connects via `DATABASE_URL`
4. **Deploy**
   - Auto-deploys on git push

---

### 6. Render

1. **Create new Web Service** at [render.com](https://render.com)
2. **Connect repository**
3. **Configure**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. **Add PostgreSQL**
   - Create PostgreSQL database
   - Copy internal database URL
5. **Set environment variable**
   - `DATABASE_URL` = PostgreSQL internal URL
6. **Deploy**

---

## 🗄️ Database Setup

### Schema Migration

After deploying, push the schema to your database:

```bash
# Local
npx drizzle-kit push

# Docker
docker-compose exec app npx drizzle-kit push

# SSH (EC2/VPS)
ssh your-server "cd systempulse && npx drizzle-kit push"
```

### Seed Default Alert Settings

The application automatically creates default alert settings on first run:
- CPU: 90% threshold
- RAM: 85% threshold  
- Disk: 90% threshold

---

## 🔒 Security Considerations

### Production Checklist
- [ ] Use HTTPS (SSL certificate)
- [ ] Set strong database password
- [ ] Enable database SSL connection
- [ ] Configure CORS if needed
- [ ] Set up rate limiting
- [ ] Enable authentication (if multi-user)
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor error logs

### Environment Variables
Never commit `.env` file to Git. Use platform-specific secret management:
- **Vercel**: Environment Variables in dashboard
- **Railway**: Variables section
- **Docker**: docker-compose.yml environment or .env file (gitignored)
- **AWS**: Parameter Store or Secrets Manager

---

## 📊 Monitoring Production

### Application Monitoring
- Use platform's built-in monitoring (Vercel Analytics, Railway Metrics)
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Track database query performance

### System Monitoring
- Set up alerts for high resource usage
- Monitor database connection pool
- Track API endpoint usage
- Log slow queries

### Health Checks
- Use `/api/health` endpoint
- Configure uptime monitoring (Uptime Robot, Pingdom)
- Set up status page (Statuspage.io)

---

## 🔄 CI/CD

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check environment variable
echo $DATABASE_URL
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

---

## 📈 Performance Optimization

### Next.js Optimizations
```javascript
// next.config.ts
export default {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_timestamp ON system_readings(timestamp DESC);
CREATE INDEX idx_alert_name ON alert_settings(name);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM system_readings 
WHERE timestamp > NOW() - INTERVAL '1 hour';
```

---

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review application logs
3. Test database connection
4. Verify environment variables
5. Open GitHub issue with details

---

**Happy Deploying!** 🚀
