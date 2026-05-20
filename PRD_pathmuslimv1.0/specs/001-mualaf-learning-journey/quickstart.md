# Developer Quickstart: Islamic Learning Guide

**Target Audience**: Backend engineers, frontend engineers, and new contributors  
**Time to Complete**: ~30 minutes from zero to running locally  
**Last Updated**: 2026-05-20

---

## Prerequisites

Ensure you have installed:
- **Node.js**: v18+ (check with `node --version`)
- **npm** or **yarn**: v8+ or equivalent
- **Supabase CLI**: v1.30+ (for local database) — [Install guide](https://supabase.com/docs/guides/cli/getting-started)
- **Git**: For cloning and version control

---

## Step 1: Clone Repository & Install Dependencies

```bash
# Clone the project
git clone <repository-url>
cd mualaf-learning-journey

# Install Node dependencies
npm install

# Verify installation
npm run --version
node --version
```

**Expected Output**:
```
npm v9.x.x
node v18.x.x
```

If versions are below required minimums, update Node and npm.

---

## Step 2: Set Up Local Database (Supabase)

### 2a. Initialize Supabase Local Environment

```bash
# Start Supabase local development stack
supabase start

# This starts PostgreSQL, PostgREST API, and other services locally
# ⏳ First run takes 2-3 minutes as Docker images download
```

**Expected Output**:
```
Started supabase local development setup.

         API URL: http://localhost:54321
     Anon key: eyJ...
Service role key: eyJ...
      DB URL: postgresql://postgres:postgres@localhost:5432/postgres
```

### 2b. Create Initial Schema

```bash
# Apply database migrations to set up tables
npx supabase db pull  # (if migrations already exist in repo)

# OR manually create schema if first time
npx ts-node scripts/init-database.ts
```

**Schema Created**:
- `users` — Learner profiles
- `user_settings` — User preferences
- `learning_modules` — Curriculum content
- `learner_progress` — Completion tracking
- `qa_questions` — User questions
- `qa_answers` — Answers with sources
- `source_references` — Quranic, Hadith, scholarly citations
- `learning_milestones` — Achievement tracking

Verify tables exist:

```bash
# Connect to local Supabase PostgreSQL
psql postgresql://postgres:postgres@localhost:5432/postgres

# List tables
\dt

# Exit psql
\q
```

### 2c. Create Environment Configuration

Create `.env.local` file in project root:

```env
# Supabase Local Setup
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<copy from supabase start output above>
SUPABASE_SERVICE_ROLE_KEY=<copy from supabase start output>

# App Configuration
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Email (for notifications) - stub for local development
EMAIL_PROVIDER=console  # Logs emails to console instead of sending
```

**Important**: Never commit `.env.local`. It's in `.gitignore` for security.

---

## Step 3: Seed Sample Data

```bash
# Load sample curriculum and sources into local database
npm run seed

# This creates:
# - 3 sample learning modules (Islamic Fundamentals, Understanding Quran, Understanding Hadith)
# - 5 sample Q&A pairs with sources
# - 3 sample users for testing
```

**Expected Output**:
```
✓ Created 3 learning modules
✓ Created 12 source references
✓ Created 5 Q&A pairs
✓ Created 3 test users
Database seeding complete!
```

### Seeded Test User Accounts

| Email | Password | Role |
|-------|----------|------|
| learner1@example.com | password123 | Learner |
| advisor@example.com | password123 | Content Advisor |
| admin@example.com | password123 | Admin |

---

## Step 4: Start Development Server

```bash
# Start Next.js development server
npm run dev

# Server starts on http://localhost:3000
```

**Expected Output**:
```
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 3.2s
```

---

## Step 5: Verify Installation

### 5a. Check Frontend is Running

Open browser and navigate to: **http://localhost:3000**

Expected landing page with:
- [ ] "Welcome to PathMuslim" heading
- [ ] "Begin Learning" button
- [ ] Navigation menu (Home, Learning, Q&A, Profile)

### 5b. Test Authentication

```bash
# Visit signup page
open http://localhost:3000/signup

# Create test account
- Email: testlearner@example.com
- Password: TestPassword123!

# Should redirect to /dashboard/learning after signup
```

Expected result:
- Account created in local Supabase
- Redirected to learning dashboard
- See first module available

### 5c. Test Learning Flow

1. Click "Begin Learning"
2. Should see "Islamic Fundamentals" module
3. Click module to view content
4. Click "Mark as Complete" button
5. Confirm:
   - [ ] Progress updates (shows 1/3 complete)
   - [ ] "Islamic Fundamentals - Complete" badge appears
   - [ ] Next module unlocks
   - [ ] "First Module Complete" milestone achieved

### 5d. Test Q&A System

1. Navigate to Q&A section
2. Search for "family" → Should return 2 sample answers
3. Click an answer to view sources
4. Click Quran source → Should show verse with translation
5. Submit new question:
   - Title: "Test question"
   - Category: "Family"
   - Should get "Thank you" message with tracking ID

### 5e. Check API Endpoints Directly

```bash
# Test learning modules API
curl http://localhost:3000/api/learning/modules

# Should return JSON with module list

# Test Q&A search API
curl "http://localhost:3000/api/qa/search?q=family"

# Should return array of Q&A pairs
```

---

## Step 6: Explore Code Structure

Familiarize yourself with the codebase:

```
app/
├── (auth)/               # Signup/login pages
├── (dashboard)/          
│   ├── learning/         # Curriculum viewing
│   ├── qa/               # Questions and answers
│   └── sources/          # Reference explorer
└── api/                  # Backend API routes

lib/
├── supabase.ts          # Database client
├── hooks/               # React hooks
└── types/               # TypeScript definitions

components/
├── learning/            # Module display components
├── qa/                  # Q&A interface
└── ui/                  # Reusable UI components
```

**Key Files to Understand**:
- `lib/supabase.ts` — Database initialization and auth
- `app/api/learning/modules/route.ts` — Module API endpoint
- `app/(dashboard)/learning/modules/page.tsx` — Learning page component
- `app/api/qa/search/route.ts` — Q&A search endpoint

---

## Step 7: Run Tests

```bash
# Run all tests (unit + integration)
npm test

# Run tests in watch mode (re-run on file changes)
npm test -- --watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm test -- --coverage
```

**Expected Test Results**:
- ✓ Database schema initialization
- ✓ User authentication flow
- ✓ Module listing and completion
- ✓ Q&A search and submission
- ✓ Source reference display

---

## Troubleshooting

### "Connection refused" error

**Problem**: "Cannot connect to localhost:5432"

**Solution**: Ensure Supabase is running:
```bash
# Check Supabase status
supabase status

# If not running, restart:
supabase stop
supabase start
```

### "Module not found" errors

**Problem**: TypeScript errors about missing modules

**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Database migrations failed"

**Problem**: Errors when running `npm run seed`

**Solution**: Reset database:
```bash
supabase db reset
npm run seed
```

### "Port 3000 already in use"

**Problem**: "listen EADDRINUSE: address already in use :::3000"

**Solution**: Kill process on port 3000:
```bash
# macOS/Linux
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Email doesn't receive verification code"

**Problem**: Stuck on email verification

**Solution**: During development, we use console email (no real emails sent). Check terminal/console output for the link:
```
[Console Email] Verification link: http://localhost:3000/auth/callback?token=...
```

Copy and open the link in browser to complete signup.

---

## Common Development Tasks

### Add a New Learning Module

1. Log in as `advisor@example.com` (password: `password123`)
2. Navigate to `/admin/content/modules`
3. Click "Add Module"
4. Fill form:
   - Title: "Your Module Title"
   - Description: Module overview
   - Content: Full module text (Markdown supported)
   - Learning Objectives: 3-5 objectives
   - Sources: Add Quranic verses, Hadith, or scholarly texts
5. Click "Save as Draft"
6. Click "Publish" when ready

### Add Q&A Pair

1. Log in as `advisor@example.com`
2. Navigate to `/admin/content/qa`
3. Click "Add Answer"
4. Find or create question
5. Write scholarly answer and contemporary context
6. Link sources (Quran, Hadith, scholars)
7. Click "Publish"

### Extend Database Schema

1. Create migration file: `supabase/migrations/[timestamp]_description.sql`
2. Write SQL migrations in file
3. Run: `supabase db push`
4. Update TypeScript types in `lib/types.ts`

### Debug Database Queries

1. Open Supabase console: `supabase studio`
2. View tables and run raw SQL queries
3. Check Row-Level Security (RLS) policies for permission issues

---

## Next Steps After Quickstart

1. **Explore the API Contracts** — Read `/specs/001-mualaf-learning-journey/contracts/` to understand endpoints
2. **Review Data Model** — Read `/specs/001-mualaf-learning-journey/data-model.md` for schema details
3. **Pick a Task** — Start with tasks from `/specs/001-mualaf-learning-journey/tasks.md`
4. **Read Code Comments** — Key files have comments explaining non-obvious logic
5. **Ask Questions** — Create GitHub issues for blockers or uncertainties

---

## Important Notes for Contributors

### Code Quality

- All TypeScript code must pass `npm run type-check`
- All code must pass `npm run lint`
- All new features must have tests (`npm test`)

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat(learning): add module completion tracking
fix(qa): search highlights exact matches first
docs(quickstart): clarify database setup steps
```

### Pull Request Workflow

1. Create feature branch: `git checkout -b feat/feature-name`
2. Make changes and commit with conventional messages
3. Push to remote: `git push origin feat/feature-name`
4. Open PR with description of changes
5. Address review feedback
6. Merge when approved and tests pass

---

## Getting Help

- **Documentation**: See `/specs/001-mualaf-learning-journey/` for detailed design docs
- **Issues**: Create GitHub issue if you encounter bugs or have questions
- **Slack**: Ask in development channel for quick help
- **Code Review**: Pair with senior engineer for architectural questions

---

## Database Diagram (Quick Reference)

```
User (1) ──→ (N) LearnerProgress
User (1) ──→ (N) QAQuestion
User (1) ──→ (1) UserSettings

LearningModule (1) ──→ (N) LearnerProgress
LearningModule (N) ──→ (M) SourceReference

QAQuestion (1) ──→ (1) QAAnswer
QAAnswer (N) ──→ (M) SourceReference
```

Full ERD in `data-model.md`.

---

## Development Environment Checklist

Before starting work, verify:

- [ ] Supabase local running (`supabase status` shows services up)
- [ ] `.env.local` configured with correct URLs and keys
- [ ] Database seeded (`npm run seed` succeeds)
- [ ] Dev server running (`npm run dev` shows "Ready")
- [ ] Can log in with test user (learner1@example.com)
- [ ] Can view first module
- [ ] Can search Q&A ("family" returns results)
- [ ] Tests passing (`npm test` shows 0 failures)

---

## Performance Notes

**Initial Load Performance**:
- First page load: ~1-2 seconds (includes Next.js chunks)
- Module content: Cached locally after first load
- Q&A search: Real-time, <500ms for 100+ items
- Progress updates: Immediate on client, synced to DB

**Development Optimizations**:
- TanStack Query caches API responses
- Next.js optimizes images and code splitting
- CSS-in-JS (Tailwind) bundled efficiently
- Database queries indexed for common patterns

Check `/specs/001-mualaf-learning-journey/plan.md` for performance targets.

---

**Congratulations!** You're now set up to contribute to PathMuslim. Happy coding! 🎓
