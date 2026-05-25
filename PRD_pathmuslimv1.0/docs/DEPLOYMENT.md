# Deployment Guide

Complete playbook for deploying PathMuslim to production.

## 📋 Pre-Deployment Checklist

**DO NOT DEPLOY** until all items are verified:

### Code Quality
- [ ] All tests passing: `npm run test`
- [ ] Test coverage ≥ 85%: `npm run test:coverage`
- [ ] TypeScript strict: `npm run type-check`
- [ ] ESLint pass: `npm run lint`
- [ ] No `console.log` in production code
- [ ] No hardcoded secrets or API keys
- [ ] No TODO/FIXME comments

### Security
- [ ] Security audit passed
- [ ] All dependencies up to date
- [ ] No vulnerable packages: `npm audit`
- [ ] Database RLS policies enabled
- [ ] JWT secrets configured
- [ ] CORS properly configured
- [ ] Rate limiting configured

### Database
- [ ] Migrations tested in staging
- [ ] Backups enabled
- [ ] RLS policies verified
- [ ] Indexes created
- [ ] No N+1 queries

### Performance
- [ ] Lighthouse score > 80
- [ ] API response time < 500ms
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Caching headers set

### Documentation
- [ ] README updated
- [ ] API docs generated
- [ ] Deployment steps documented
- [ ] Runbook created
- [ ] Team trained

### Environment
- [ ] Production env vars defined
- [ ] Secrets manager configured
- [ ] Monitoring/alerting set up
- [ ] Error tracking enabled
- [ ] Logs aggregated

---

## 🌐 Production Environment Setup

### 1. Supabase Production Database

**Create Production Project**:
1. Go to supabase.com/dashboard
2. Create new project
3. Choose region (closest to users)
4. Set strong database password
5. Wait for initialization

**Get Connection Details**:
```
Project URL: https://[project-id].supabase.co
Anon Key: [public-key]
Service Role Key: [private-key]
Database URL: postgresql://postgres:[password]@[host]:5432/postgres
```

**Run Migrations**:
```bash
# Set production database URL
export DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"

# Run migrations
supabase db push --linked
```

**Enable RLS**:
```bash
# Verify RLS enabled on all tables
psql $DATABASE_URL -c "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';"
```

### 2. Environment Variables

Create `.env.production.local` (never commit):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[public-key]
SUPABASE_SERVICE_ROLE_KEY=[private-key]

# Authentication
NEXTAUTH_SECRET=[generate-with: openssl rand -base64 32]
NEXTAUTH_URL=https://pathmuslim.com

# Features
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.pathmuslim.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

**Keep secrets secure**:
- Use hosting platform's secret management
- Never commit `.env.production.local`
- Use different secrets per environment
- Rotate keys quarterly

### 3. Hosting Setup (Vercel Recommended)

**Connect Repository**:
1. Go to vercel.com
2. Import project from GitHub
3. Select repository
4. Configure build settings

**Build Settings**:
```
Framework: Next.js
Build command: npm run build
Output directory: .next
```

**Environment Variables in Vercel**:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.production.local`
3. Set scope: Production
4. Click Add

### 4. Domain & HTTPS

**Custom Domain**:
1. Go to Vercel → Settings → Domains
2. Add custom domain
3. Update DNS with Vercel nameservers
4. HTTPS auto-enabled

**Or Manual HTTPS**:
```bash
# Add SSL certificate
certbot certonly --standalone -d pathmuslim.com

# Configure reverse proxy to Vercel
```

### 5. Monitoring & Error Tracking

**Sentry Setup** (error tracking):
```bash
# Install
npm install @sentry/nextjs

# Create account at sentry.io
# Set DSN in environment variables
SENTRY_DSN=https://[key]@sentry.io/[project-id]
```

**Configure**:
```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.request?.headers?.authorization) {
      delete event.request.headers.authorization;
    }
    return event;
  },
});
```

**Google Analytics** (usage metrics):
```typescript
// pages/_document.tsx
<Script
  strategy="afterInteractive"
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
/>
<Script
  id="google-analytics"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
    `,
  }}
/>
```

---

## 🚀 Deployment Process

### Step 1: Pre-Deployment Verification

```bash
# Run full test suite
npm run test:coverage

# Build locally
npm run build

# Check for errors
npm run type-check
npm run lint

# Verify environment
echo "Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "Auth URL: $NEXTAUTH_URL"
```

### Step 2: Database Migration

```bash
# In production database shell
# Run migrations from supabase/migrations/
psql $DATABASE_URL < supabase/migrations/001_init.sql
psql $DATABASE_URL < supabase/migrations/002_seed_data.sql

# Verify migrations
SELECT * FROM pg_migrations;

# Check RLS policies
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

### Step 3: Deploy Application

**Using Vercel (Recommended)**:
```bash
# Push to main branch
git push origin main

# Vercel auto-deploys
# Monitor: https://vercel.com/dashboard

# View logs
vercel logs --prod
```

**Manual Deployment**:
```bash
# Build production bundle
npm run build

# Run type check
npm run type-check

# Deploy to hosting
# (varies by provider - Vercel, AWS, Heroku, etc.)

# Verify deployment
curl https://pathmuslim.com/api/health
```

### Step 4: Run Smoke Tests

```bash
# Health check
curl https://pathmuslim.com/api/health
# Expected: {"status":"ok","version":"0.1.0"}

# API test
curl -H "Authorization: Bearer TEST_TOKEN" \
  https://pathmuslim.com/api/learning/modules
# Expected: {"success":true,"data":[...]}

# Frontend test
curl https://pathmuslim.com/
# Expected: 200 status with HTML

# Performance test
lighthouse https://pathmuslim.com
# Expected: Score > 80
```

### Step 5: Monitor Logs

```bash
# Watch for errors
vercel logs --prod --follow

# Check Sentry
https://sentry.io/organizations/pathmuslim/issues/

# Check analytics
https://analytics.google.com/

# Monitor database
# Supabase dashboard → Monitoring
```

### Step 6: Verify End-to-End

**Test Critical Flows**:
1. [ ] User registration/login works
2. [ ] Module listing loads
3. [ ] Q&A search responds
4. [ ] Progress tracking calculates
5. [ ] Milestones display
6. [ ] API endpoints accessible

**Check Metrics**:
- [ ] Response time < 500ms
- [ ] Error rate < 0.1%
- [ ] Database load normal
- [ ] No disk space issues

---

## 🔐 Secrets Management

### Store Secrets Securely

**NEVER**:
```bash
# ❌ Don't hardcode
const apiKey = "sk-xxxxxxxxxxxx";

# ❌ Don't commit .env
git add .env.production.local

# ❌ Don't log secrets
console.log("Token:", authToken);
```

**DO**:
```bash
# ✅ Use environment variables
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

# ✅ Use hosting provider's secrets
// Vercel Environment Variables
// AWS Secrets Manager
// Supabase Vault

# ✅ Rotate keys quarterly
# Archive old keys
# Generate new keys
# Update all services
```

### Key Rotation Checklist

When rotating keys:
- [ ] Generate new key
- [ ] Add new key to all environments
- [ ] Monitor both keys working
- [ ] Remove old key from code
- [ ] Update documentation
- [ ] Verify all services work
- [ ] Archive old key
- [ ] Update security log

---

## 🗄️ Database Migrations

### Running Migrations

```bash
# Push new migrations
supabase db push

# Verify changes
supabase db pull

# Check migration status
supabase migration list
```

### Migration Safety

**Before Production**:
1. Test migration in staging
2. Verify rollback plan
3. Plan for downtime (if needed)
4. Notify team
5. Get approval

**During Migration**:
1. Record start time
2. Monitor database
3. Watch for errors
4. Check data integrity
5. Verify performance

**After Migration**:
1. Run smoke tests
2. Check all endpoints
3. Verify data
4. Document changes
5. Communicate completion

### Rollback Procedure

If migration fails:

```bash
# Stop deployment
ctrl+c

# Rollback last migration
supabase migration rollback

# Verify rollback
SELECT COUNT(*) FROM [affected_table];

# Investigate issue
# Fix migration
# Test again

# Redeploy
git push origin main
```

**Never**:
- Force overwrite data
- Skip backups
- Deploy without testing
- Ignore warnings

---

## 📊 Monitoring & Alerting

### Application Monitoring

**Set Up Alerts**:
1. API error rate > 1% → Alert
2. Response time > 1s → Alert
3. Database CPU > 80% → Alert
4. Disk space < 10% → Alert

**Configure Sentry**:
```typescript
// Notify on critical errors
Sentry.captureException(error, {
  level: 'error',
  tags: {
    environment: 'production',
    severity: 'critical',
  },
});
```

**Monitor Database**:
- Supabase → Monitoring tab
- Watch slow queries
- Check connections
- Monitor storage

**Monitor Performance**:
```bash
# Check response times
curl -w "@curl-format.txt" \
  -o /dev/null \
  -s https://pathmuslim.com/api/health

# Check availability
curl -I https://pathmuslim.com
# Expected: 200 OK
```

### Alert Channels

Set up notifications:
- **Email**: Critical errors
- **Slack**: Warnings and errors
- **PagerDuty**: P1 incidents
- **SMS**: Outages (if critical)

### Runbook Example

**Alert: API Error Rate > 5%**

1. Check Sentry for error patterns
2. View recent deployments
3. Check database connections
4. Monitor server resources
5. Check for traffic spike
6. Rollback if needed
7. Document incident

---

## 🔄 Rollback Procedure

If you need to rollback deployment:

### Option 1: Vercel Rollback (Fast)
```bash
# Go to Vercel dashboard
# Deployments → Click previous deployment
# Click "Promote to Production"

# Time: ~1 minute
# Risk: Low
```

### Option 2: Git Revert
```bash
# Revert commit
git revert HEAD
git push origin main

# Vercel auto-deploys
# Time: ~3-5 minutes
# Risk: Medium
```

### Option 3: Database Rollback
```bash
# If database migration failed
supabase migration rollback

# Verify rollback
SELECT COUNT(*) FROM [table];

# Redeploy application
git push origin main

# Time: ~5-10 minutes
# Risk: Medium-High
```

### Rollback Checklist

After rollback:
- [ ] Verify application loads
- [ ] Test critical endpoints
- [ ] Check database integrity
- [ ] Monitor error rates
- [ ] Notify stakeholders
- [ ] Schedule post-mortem
- [ ] Document incident

---

## 📈 Post-Deployment Monitoring (First 24 Hours)

Monitor closely after deployment:

### Hour 1
- [ ] No error spikes
- [ ] Response times normal
- [ ] Database healthy
- [ ] All endpoints respond

### Hour 6
- [ ] Error rate stable
- [ ] User signups working
- [ ] Content loading
- [ ] Search functional

### Hour 24
- [ ] All metrics normal
- [ ] No recurring errors
- [ ] User feedback positive
- [ ] Performance stable

**If Issues Found**:
1. Check logs in Sentry
2. Identify root cause
3. Decide: Fix or Rollback
4. Fix in dev environment
5. Test thoroughly
6. Redeploy

---

## 🛠️ Troubleshooting

### Deployment Fails

```bash
# Check logs
vercel logs --prod

# Check for secrets
echo $NEXT_PUBLIC_SUPABASE_URL

# Rebuild locally
npm run build

# Check errors
npm run type-check
```

### Database Connection Fails

```bash
# Test connection
psql postgresql://postgres:pass@host:5432/postgres

# Check env vars
echo $DATABASE_URL

# Verify RLS doesn't block
SELECT * FROM users LIMIT 1;
```

### API Returns 500

```bash
# Check logs
vercel logs --prod

# Check Sentry
sentry.io/issues

# Look for:
- Missing env vars
- Database errors
- Service crashes
- Memory issues
```

### Performance Degraded

```bash
# Check database query times
SELECT query, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC;

# Check Node memory
vercel env pull

# Monitor API response
curl -w "%{time_total}\n" -o /dev/null -s https://pathmuslim.com/api/health
```

---

## 📋 Deployment Checklist Template

```markdown
## Deployment: [Date] [Version]

### Pre-Deployment
- [ ] All tests pass
- [ ] Coverage ≥ 85%
- [ ] No TypeScript errors
- [ ] Secrets configured
- [ ] Migrations tested

### Deployment
- [ ] Database migrated
- [ ] Application deployed
- [ ] Smoke tests pass
- [ ] No error spikes
- [ ] Performance normal

### Post-Deployment (24h)
- [ ] User feedback positive
- [ ] Error rate stable
- [ ] All features working
- [ ] Metrics normal

### Sign-Off
- Deployed by: ___________
- Reviewed by: ___________
- Date: ___________
- Notes: ___________
```

---

## 📞 Support & Escalation

**During Deployment Issues**:

1. **Severity P1** (Outage)
   - Rollback immediately
   - Notify all stakeholders
   - Schedule post-mortem

2. **Severity P2** (Degraded)
   - Assess impact
   - Decide: Fix or Rollback
   - Update status page

3. **Severity P3** (Minor)
   - Log issue
   - Plan fix for next deployment
   - Communicate to team

---

## 🔗 Related Documentation

- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development workflow
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database structure
- [TYPES_GUIDE.md](./TYPES_GUIDE.md) - Type definitions

## 📚 External Resources

- [Vercel Deployment Guide](https://vercel.com/docs)
- [Supabase Database Guide](https://supabase.com/docs)
- [Next.js Production Checklist](https://nextjs.org/learn/foundations/how-nextjs-works/production)
- [Sentry Documentation](https://docs.sentry.io/)

---

**Last Updated**: 2026-05-25  
**Maintained By**: DevOps Team  
**Questions?** Contact: devops@pathmuslim.com
