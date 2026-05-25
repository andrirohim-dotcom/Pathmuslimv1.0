# PathMuslim v1.0 - Codebase Navigation Guide

**Quick Reference**: Navigate the project structure and locate key files by feature

---

## 📁 Quick Navigation

### Project Root Structure
```
pathmuslim-v1.0/
├── PRD_pathmuslimv1.0/              # Main Next.js application
├── PROGRESS_REPORT.md               # 📊 Overall progress summary
├── IMPLEMENTATION_STATUS.md         # ✅ Detailed completion checklist
├── CODEBASE_GUIDE.md               # 📍 This file
├── README.md                        # Project overview
├── DEVELOPMENT.md                   # Development notes
└── specs/                           # Specification documents (out of scope)
```

---

## 🎯 By Feature

### 🎓 Learning Modules (Curriculum)

**Database**:
- Table: `learning_modules`
- Table: `learner_progress`
- Junction: `module_source` (links modules to sources)

**Backend**:
- Repository: `PRD_pathmuslimv1.0/lib/repositories/ModuleRepository.ts`
- Service: `PRD_pathmuslimv1.0/lib/services/ModuleService.ts`
- API Routes: `PRD_pathmuslimv1.0/app/api/learning/`

**Frontend**:
- Pages: `PRD_pathmuslimv1.0/app/(dashboard)/learning/`
- Components: `PRD_pathmuslimv1.0/components/learning/`
- Hooks: `PRD_pathmuslimv1.0/lib/hooks/` (useModules, useProgress, etc.)

**Tests**:
- Unit: `PRD_pathmuslimv1.0/tests/unit/services/module-service.test.ts`
- Integration: `PRD_pathmuslimv1.0/tests/integration/api/learning.test.ts`
- E2E: `PRD_pathmuslimv1.0/tests/e2e/learning-flow.spec.ts`

---

### ❓ Q&A Knowledge Base

**Database**:
- Table: `qa_questions`
- Table: `qa_answers`
- Junction: `answer_source` (links answers to sources)

**Backend**:
- Repository: `PRD_pathmuslimv1.0/lib/repositories/QARepository.ts`
- Service: `PRD_pathmuslimv1.0/lib/services/QAService.ts`
- API Routes: `PRD_pathmuslimv1.0/app/api/qa/`

**Frontend**:
- Pages: `PRD_pathmuslimv1.0/app/(dashboard)/qa/`
- Components: `PRD_pathmuslimv1.0/components/qa/`
- Hooks: `PRD_pathmuslimv1.0/lib/hooks/` (useQASearch, useAnswer, etc.)

**Tests**:
- Unit: `PRD_pathmuslimv1.0/tests/unit/services/qa-service.test.ts`
- Integration: `PRD_pathmuslimv1.0/tests/integration/api/qa.test.ts`
- E2E: `PRD_pathmuslimv1.0/tests/e2e/qa-flow.spec.ts`

---

### 📊 Progress & Milestones

**Database**:
- Table: `learner_progress` (with assessment_score, time_spent, etc.)
- Table: `learning_milestones`

**Backend**:
- Service: `PRD_pathmuslimv1.0/lib/services/MilestoneService.ts`
- API Routes: `PRD_pathmuslimv1.0/app/api/milestones/`

**Frontend**:
- Pages: `PRD_pathmuslimv1.0/app/(dashboard)/progress/`
- Pages: `PRD_pathmuslimv1.0/app/(dashboard)/milestones/`
- Components: `PRD_pathmuslimv1.0/components/progress/`
- Hooks: `PRD_pathmuslimv1.0/lib/hooks/useProgress.ts`

**Tests**:
- Unit: `PRD_pathmuslimv1.0/tests/unit/services/milestone-service.test.ts`
- Integration: `PRD_pathmuslimv1.0/tests/integration/api/milestones.test.ts`
- E2E: `PRD_pathmuslimv1.0/tests/e2e/progress-flow.spec.ts`

---

### 📖 Source Explorer (Quran, Hadith, Scholars)

**Database**:
- Table: `source_references` (with source_type, metadata, display_text, etc.)

**Backend**:
- Service: `PRD_pathmuslimv1.0/lib/services/SourceService.ts`
- API Routes: `PRD_pathmuslimv1.0/app/api/sources/`

**Frontend**:
- Pages: `PRD_pathmuslimv1.0/app/(dashboard)/sources/`
- Components: `PRD_pathmuslimv1.0/components/sources/`
  - QuranViewer.tsx
  - HadithBrowser.tsx
  - ScholarReference.tsx
  - SourceDetail.tsx

**Tests**:
- Unit: `PRD_pathmuslimv1.0/tests/unit/services/source-service.test.ts`
- Integration: `PRD_pathmuslimv1.0/tests/integration/api/sources.test.ts`
- E2E: `PRD_pathmuslimv1.0/tests/e2e/source-explorer.spec.ts`

---

### 🔐 Authentication

**Database**:
- Table: `users`
- Table: `user_settings`
- Managed by: Supabase Auth

**Backend**:
- Client: `PRD_pathmuslimv1.0/lib/supabase.ts`
- Middleware: `PRD_pathmuslimv1.0/middleware.ts`
- Auth API: `PRD_pathmuslimv1.0/app/api/auth/`

**Frontend**:
- Pages: `PRD_pathmuslimv1.0/app/(auth)/`
  - login/page.tsx
  - signup/page.tsx
  - forgot-password/page.tsx
- Provider: `PRD_pathmuslimv1.0/lib/providers/AuthProvider.tsx`

---

## 🏗️ By Layer

### 1️⃣ Database Layer (`lib/repositories/`)

**ModuleRepository.ts**:
```typescript
- getAll(pagination, filters)
- getById(id)
- getByPrerequisite(prerequisiteId)
- getCompleted(userId)
- getInProgress(userId)
```

**QARepository.ts**:
```typescript
- search(query, filters)
- getById(id)
- getByCategory(category)
- createQuestion(question)
- getCategories()
- markHelpful(answerId, userId)
```

---

### 2️⃣ Service Layer (`lib/services/`)

**ModuleService.ts** (4.7 KB):
- Module business logic
- Prerequisite validation
- Progress calculation
- Completion tracking

**QAService.ts** (2.9 KB):
- Q&A operations
- Search algorithm
- Question submission
- Category management

**MilestoneService.ts** (5.5 KB):
- Milestone calculation
- Achievement detection
- Progress statistics
- Learning streak tracking

**SourceService.ts** (6.4 KB):
- Source retrieval and filtering
- Citation formatting
- Cross-reference linking
- Metadata handling

---

### 3️⃣ API Layer (`app/api/`)

**Learning API** (`app/api/learning/`):
```
GET  /api/learning/modules              (list)
GET  /api/learning/modules/:id          (detail)
POST /api/learning/modules/:id/complete (complete)
GET  /api/learning/modules/:id/progress (progress)
```

**Q&A API** (`app/api/qa/`):
```
GET  /api/qa/search                    (search)
GET  /api/qa/answers/:id               (detail)
POST /api/qa/submit                    (submit question)
GET  /api/qa/categories                (list categories)
POST /api/qa/answers/:id/helpful       (mark helpful)
```

**Milestones API** (`app/api/milestones/`):
```
GET  /api/milestones                   (list)
GET  /api/milestones/:id               (detail)
```

**Sources API** (`app/api/sources/`):
```
GET  /api/sources                      (list)
GET  /api/sources/:id                  (detail)
GET  /api/sources/by-type/:type        (by type)
```

---

### 4️⃣ Frontend Pages (`app/(dashboard)/`)

**Learning** (`app/(dashboard)/learning/`):
- `modules/` - Browse all modules
- `modules/[id]/` - View module detail
- `progress/` - See learning progress

**Q&A** (`app/(dashboard)/qa/`):
- `search/` - Search questions & answers
- `ask/` - Submit new question
- `[answer-id]/` - View answer detail

**Progress** (`app/(dashboard)/progress/`):
- `dashboard/` - Overall progress view

**Milestones** (`app/(dashboard)/milestones/`):
- `index/` - View achievements

**Sources** (`app/(dashboard)/sources/`):
- `index/` - Source explorer
- `[id]/` - Source detail

**Profile** (`app/(dashboard)/profile/`):
- User settings and preferences

---

### 5️⃣ Frontend Components (`components/`)

**Learning Components**:
- ModuleCard.tsx
- ModuleContent.tsx
- ModulePrerequisites.tsx
- LearningObjectives.tsx
- ModuleCompletion.tsx

**Q&A Components**:
- QASearchForm.tsx
- QAResults.tsx
- AnswerDetail.tsx
- QuestionSubmitForm.tsx
- CategoryFilter.tsx

**Progress Components**:
- ProgressChart.tsx
- StatisticsCard.tsx
- ProgressBar.tsx
- LearningStreak.tsx

**Source Components**:
- QuranViewer.tsx
- HadithBrowser.tsx
- ScholarReference.tsx
- SourceCitation.tsx
- SourceDetail.tsx

**UI Components** (`components/ui/`):
- Button, Card, Input, Form
- Modal, Select, Checkbox
- Badge, Alert, Loading

---

## 📚 Key Files Reference

### Core Files
| File | Purpose |
|------|---------|
| `lib/types.ts` | TypeScript definitions for all entities |
| `lib/supabase.ts` | Supabase client initialization |
| `lib/api-response.ts` | API response envelope format |
| `lib/errors.ts` | Custom error classes |
| `lib/logger.ts` | Logging utility |
| `middleware.ts` | Auth and request middleware |
| `app/layout.tsx` | Root layout with auth provider |

### Service Files
| File | Purpose |
|------|---------|
| `lib/services/ModuleService.ts` | Learning module logic |
| `lib/services/QAService.ts` | Q&A operations |
| `lib/services/MilestoneService.ts` | Milestone tracking |
| `lib/services/SourceService.ts` | Source management |

### Repository Files
| File | Purpose |
|------|---------|
| `lib/repositories/ModuleRepository.ts` | Module data access |
| `lib/repositories/QARepository.ts` | Q&A data access |

### Configuration Files
| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration |
| `tsconfig.json` | TypeScript settings |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `jest.config.js` | Jest testing configuration |
| `.env.local` | Environment variables |

---

## 🧪 Test Files

### Unit Tests
```
tests/unit/
├── services/
│   ├── module-service.test.ts
│   ├── qa-service.test.ts
│   ├── milestone-service.test.ts
│   └── source-service.test.ts
├── repositories/
│   ├── module-repository.test.ts
│   └── qa-repository.test.ts
└── utils/
    └── api-response.test.ts
```

### Integration Tests
```
tests/integration/
├── api/
│   ├── learning.test.ts
│   ├── qa.test.ts
│   ├── milestones.test.ts
│   └── sources.test.ts
└── database/
    └── migrations.test.ts
```

### E2E Tests
```
tests/e2e/
├── learning-flow.spec.ts
├── qa-flow.spec.ts
├── progress-flow.spec.ts
└── source-explorer.spec.ts
```

---

## 🗂️ Database Schema

### Tables
1. **users** - User accounts and profiles
2. **user_settings** - User preferences
3. **learning_modules** - Curriculum content
4. **learner_progress** - Progress tracking
5. **qa_questions** - User questions
6. **qa_answers** - Expert answers
7. **source_references** - Citations
8. **learning_milestones** - Achievements

### Relationships
```
users
  → learning_modules (1:many, via learner_progress)
  → qa_questions (1:many)
  → learning_milestones (1:many)

learning_modules
  → learner_progress (1:many)
  → source_references (many:many via module_source)

qa_answers
  → source_references (many:many via answer_source)

learning_milestones
  → learner_progress (1:many)
```

---

## 🔍 How to Find Code

### By Feature
1. **Learning Modules**: Start at `lib/services/ModuleService.ts`
2. **Q&A System**: Start at `lib/services/QAService.ts`
3. **Progress Tracking**: Start at `lib/services/MilestoneService.ts`
4. **Sources**: Start at `lib/services/SourceService.ts`

### By Layer
1. **Database**: Check `lib/repositories/`
2. **Business Logic**: Check `lib/services/`
3. **API**: Check `app/api/`
4. **Frontend**: Check `app/(dashboard)/` and `components/`

### By Test Type
1. **Unit Tests**: `tests/unit/`
2. **Integration Tests**: `tests/integration/`
3. **E2E Tests**: `tests/e2e/`

---

## 📖 Documentation Map

### Specification Docs
```
PRD_pathmuslimv1.0/specs/001-mualaf-learning-journey/
├── spec.md                     # Full feature specification
├── plan.md                     # Implementation plan
├── data-model.md              # Database schema
├── research.md                # Technical decisions
├── tasks.md                   # Implementation tasks
├── quickstart.md              # Developer setup
├── contracts/
│   ├── learning-modules-api.md
│   ├── qa-knowledge-base-api.md
│   └── ... (additional contracts)
└── checklists/
    ├── requirements.md
    └── system-completeness.md
```

### Project Docs
```
PRD_pathmuslimv1.0/
├── CLAUDE.md                  # Development guidelines
└── PRD_pathmuslimv1.0/CLAUDE.md  # (same file)
```

### Progress Tracking
```
pathmuslim-v1.0/
├── PROGRESS_REPORT.md         # Executive summary
├── IMPLEMENTATION_STATUS.md   # Detailed checklist
└── CODEBASE_GUIDE.md         # This file
```

---

## 🚀 Quick Start Guide

### 1. Setup Project
```bash
cd PRD_pathmuslimv1.0
npm install
cp .env.local.example .env.local
```

### 2. Run Development Server
```bash
npm run dev
# Visit http://localhost:3000
```

### 3. Run Tests
```bash
npm run test              # Unit tests
npm run test:integration # Integration tests
npm run test:e2e         # E2E tests
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🔗 Related Documentation

- **Specification**: `PRD_pathmuslimv1.0/specs/001-mualaf-learning-journey/spec.md`
- **Implementation Plan**: `PRD_pathmuslimv1.0/specs/001-mualaf-learning-journey/plan.md`
- **Development Guide**: `PRD_pathmuslimv1.0/CLAUDE.md`
- **Progress Report**: `PROGRESS_REPORT.md`
- **Completion Checklist**: `IMPLEMENTATION_STATUS.md`

---

**Last Updated**: 2026-05-25  
**Version**: 1.0 (MVP Complete)
