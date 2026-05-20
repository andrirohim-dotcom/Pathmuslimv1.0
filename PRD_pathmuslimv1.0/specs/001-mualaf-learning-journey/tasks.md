---
description: "Task list for Islamic Learning Guide for New Muslims feature implementation"
---

# Tasks: Islamic Learning Guide for New Muslims

**Input**: Design documents from `/specs/001-mualaf-learning-journey/`

**Prerequisites**: plan.md (✅ complete), spec.md (✅ complete), data-model.md (✅ complete), contracts/ (✅ complete), research.md (✅ complete)

**Tests**: NOT EXPLICITLY REQUESTED in specification, but end-to-end validation required per spec success criteria. Unit/integration test tasks marked [OPTIONAL].

**Organization**: Tasks grouped by user story to enable independent implementation and testing. Each user story phase is independently testable and deployable.

---

## Format: `[ID] [P?] [Story?] Description`

- **[ID]**: Task identifier (T001, T002, etc.)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Path Conventions

- **App routes**: `app/` (Next.js app directory)
- **Backend**: `app/api/` (API route handlers)
- **Frontend components**: `components/` (React components)
- **Hooks/Utilities**: `lib/` (shared logic)
- **Tests**: `tests/` (unit, integration, e2e)
- **Database**: `supabase/migrations/` (migrations)
- **Types**: `lib/types.ts` (TypeScript definitions)

---

## Phase 1: Setup & Infrastructure

**Purpose**: Project initialization and framework setup

- [ ] T001 Initialize Next.js project with TypeScript, Tailwind CSS, and required dependencies (package.json configured)
- [ ] T002 [P] Configure Tailwind CSS and design tokens in `styles/globals.css` and `styles/variables.css`
- [ ] T003 [P] Set up TypeScript configuration (`tsconfig.json`) with strict mode and path aliases
- [ ] T004 [P] Create environment configuration files (`.env.local`, `.env.example`) with Supabase credentials
- [ ] T005 [P] Initialize Supabase client in `lib/supabase.ts` with authentication and database setup
- [ ] T006 Create project directory structure per architecture plan (app/, components/, lib/, tests/, public/, supabase/)
- [ ] T007 [P] Configure Git hooks and commit conventions in `.husky/` and `.lintstagedrc`
- [ ] T008 [P] Set up ESLint and Prettier configuration for code quality (`eslintrc.json`, `prettier.config.js`)
- [ ] T009 [P] Initialize testing framework (Jest, React Testing Library) in `jest.config.js`
- [ ] T010 Create root layout component in `app/layout.tsx` with navigation and auth context

**Checkpoint**: Project structure ready, dependencies installed, local dev server runs

---

## Phase 2: Foundational Infrastructure (BLOCKING - Complete Before Any User Story)

**Purpose**: Core infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is 100% complete

- [ ] T011 Create database migrations in `supabase/migrations/` for all entities:
  - [ ] T011a [P] users, user_settings tables
  - [ ] T011b [P] learning_modules, learner_progress tables
  - [ ] T011c [P] qa_questions, qa_answers tables
  - [ ] T011d [P] source_references, junction tables (module_source, answer_source)
  - [ ] T011e [P] learning_milestones table
- [ ] T012 Create TypeScript type definitions in `lib/types.ts` for all entities from data-model.md
- [ ] T013 [P] Set up Supabase authentication flow:
  - [ ] T013a Create auth middleware in `lib/middleware.ts` for protected routes
  - [ ] T013b Configure auth callbacks in `app/api/auth/callback/route.ts`
  - [ ] T013c Set up session management with Supabase Auth context
- [ ] T014 [P] Create authentication pages:
  - [ ] T014a [P] Signup form in `app/(auth)/signup/page.tsx`
  - [ ] T014b [P] Login form in `app/(auth)/login/page.tsx`
  - [ ] T014c [P] Password reset flow in `app/(auth)/forgot-password/page.tsx`
- [ ] T015 Create Root Layout with authentication provider:
  - [ ] T015a Add Supabase Auth provider in `app/layout.tsx`
  - [ ] T015b Create navigation component in `components/layouts/Navbar.tsx`
  - [ ] T015c Set up protected route layout in `app/(dashboard)/layout.tsx`
- [ ] T016 [P] Implement error handling and logging:
  - [ ] T016a Create error boundary component in `components/ErrorBoundary.tsx`
  - [ ] T016b Set up error logging in `lib/logger.ts`
  - [ ] T016c Create user-friendly error pages (404, 500)
- [ ] T017 Create API response format standards:
  - [ ] T017a Define response envelope helper in `lib/api-response.ts`
  - [ ] T017b Create error response standardization in `lib/api-errors.ts`

**Checkpoint**: Foundation complete. Database schema in place. Auth working. API infrastructure ready. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Structured Learning Pathway (Priority: P1) 🎯 MVP

**Goal**: Users can access structured curriculum, progress through modules, and complete foundational Islamic education

**Independent Test**: A new user can signup, access the first module, complete it, and see progress updated within the application

**Story Completion**: All modules are viewable, completable, and progress is tracked with milestones

### [OPTIONAL] Contract Tests for Learning API

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US1] Contract test for learning modules list endpoint in `tests/contract/test_learning_modules_list.ts`
- [ ] T019 [P] [US1] Contract test for module detail endpoint in `tests/contract/test_module_detail.ts`
- [ ] T020 [P] [US1] Contract test for module completion endpoint in `tests/contract/test_module_complete.ts`

### Database & Models for User Story 1

- [ ] T021 [P] [US1] Seed initial 20 learning modules via `scripts/seed-modules.ts`:
  - Module 1: "Islamic Fundamentals"
  - Module 2: "Understanding the Quran"
  - Module 3: "Understanding Hadith"
  - ... (see data-model.md for full curriculum structure)
- [ ] T022 [P] [US1] Seed source references (Quranic verses, Hadith, scholarly citations) via `scripts/seed-sources.ts`
- [ ] T023 [P] [US1] Create repository layer for modules in `lib/repositories/ModuleRepository.ts` (CRUD operations, prerequisites validation)

### API Implementation for User Story 1

- [ ] T024 [US1] Implement `GET /api/learning/modules` endpoint in `app/api/learning/modules/route.ts` (list all modules with user progress)
- [ ] T025 [US1] Implement `GET /api/learning/modules/[id]` endpoint in `app/api/learning/modules/[id]/route.ts` (module detail with content and sources)
- [ ] T026 [US1] Implement `POST /api/learning/modules/[id]/complete` endpoint in `app/api/learning/modules/[id]/complete/route.ts` (mark module complete, unlock next)
- [ ] T027 [US1] Implement `GET /api/learning/progress` endpoint in `app/api/learning/progress/route.ts` (user progress summary)
- [ ] T028 [P] [US1] Implement helper functions in `lib/services/ModuleService.ts`:
  - [ ] Check prerequisites met
  - [ ] Calculate progress percentage
  - [ ] Evaluate milestone achievements
  - [ ] Get next recommended module

### Frontend Implementation for User Story 1

- [ ] T029 [P] [US1] Create Learning Dashboard page in `app/(dashboard)/learning/page.tsx`:
  - Progress overview (completion %, modules done, time remaining)
  - Current module highlight
  - Next recommended module button
- [ ] T030 [P] [US1] Create Module List component in `components/learning/ModuleList.tsx`:
  - Display all modules in sequence
  - Show locked/unlocked status with prerequisite info
  - Show completion badges
- [ ] T031 [P] [US1] Create Module Viewer component in `components/learning/ModuleViewer.tsx`:
  - Display module title, description, learning objectives
  - Render module content (Markdown)
  - Show time estimate
  - Display source references
  - "Mark as Complete" button
- [ ] T032 [P] [US1] Create Source Reference component in `components/learning/SourceReference.tsx`:
  - Display Quranic verse with translation
  - Display Hadith with authentication grade
  - Display scholarly citation
  - Link to full source view
- [ ] T033 [US1] Create Module Detail page in `app/(dashboard)/learning/modules/[id]/page.tsx` (full module view with complete content)
- [ ] T034 [P] [US1] Create Progress Dashboard component in `components/learning/ProgressDashboard.tsx`:
  - Progress bar (X of Y modules complete)
  - List of completed modules with dates
  - Milestone achievements with celebration
- [ ] T035 [US1] Implement module completion flow:
  - [ ] T035a Create completion confirmation dialog in `components/learning/CompleteModuleDialog.tsx`
  - [ ] T035b Update learner_progress in database on completion
  - [ ] T035c Check for milestone unlocks and display celebration
  - [ ] T035d Update progress stats in real-time

### Tests for User Story 1 [OPTIONAL]

- [ ] T036 [P] [US1] Unit tests for ModuleService in `tests/unit/services/ModuleService.test.ts`
- [ ] T037 [P] [US1] Unit tests for ModuleRepository in `tests/unit/repositories/ModuleRepository.test.ts`
- [ ] T038 [P] [US1] Integration tests for module API endpoints in `tests/integration/api/learning.test.ts`
- [ ] T039 [US1] End-to-end test for complete learning flow in `tests/e2e/learning-flow.spec.ts`:
  - Signup → View modules → Open module → Complete module → See progress updated

**Checkpoint**: User Story 1 is fully functional and independently testable. A user can signup and complete their first module with progress tracking working. This is the MVP.

---

## Phase 4: User Story 2 - Answer Questions with Scholarly References (Priority: P1)

**Goal**: Users can ask daily-life Islamic questions and receive sourced answers from scholarly texts

**Independent Test**: A user can search for existing Q&A, submit a new question, see it in pending state, and view an answered question with full source citations

**Story Completion**: Q&A system fully operational with knowledge base of 100+ question-answer pairs

### [OPTIONAL] Contract Tests for Q&A API

- [ ] T040 [P] [US2] Contract test for Q&A search endpoint in `tests/contract/test_qa_search.ts`
- [ ] T041 [P] [US2] Contract test for answer detail endpoint in `tests/contract/test_answer_detail.ts`
- [ ] T042 [P] [US2] Contract test for question submission endpoint in `tests/contract/test_question_submit.ts`

### Database & Models for User Story 2

- [ ] T043 [P] [US2] Seed initial 100+ Q&A pairs via `scripts/seed-qa.ts`:
  - 20 family relations questions
  - 20 work/career questions
  - 20 spirituality questions
  - 20 health questions
  - 20 relationships questions
- [ ] T044 [P] [US2] Create repository layer for Q&A in `lib/repositories/QARepository.ts` (CRUD, search, moderation workflow)

### API Implementation for User Story 2

- [ ] T045 [US2] Implement `GET /api/qa/search` endpoint in `app/api/qa/search/route.ts` (search knowledge base by keyword, category, sort)
- [ ] T046 [US2] Implement `GET /api/qa/answers/[id]` endpoint in `app/api/qa/answers/[id]/route.ts` (full answer with sources and related modules)
- [ ] T047 [US2] Implement `POST /api/qa/questions` endpoint in `app/api/qa/questions/route.ts` (submit new question for moderation)
- [ ] T048 [US2] Implement `GET /api/qa/categories` endpoint in `app/api/qa/categories/route.ts` (list categories with counts)
- [ ] T049 [US2] Implement `POST /api/qa/answers/[id]/helpful` endpoint in `app/api/qa/answers/[id]/helpful/route.ts` (mark answer helpful)
- [ ] T050 [P] [US2] Create QA service helpers in `lib/services/QAService.ts`:
  - [ ] Search ranking algorithm (relevance > recency > helpful count)
  - [ ] Duplicate question detection
  - [ ] Category classification
  - [ ] Moderation queue status

### Frontend Implementation for User Story 2

- [ ] T051 [P] [US2] Create Q&A Search page in `app/(dashboard)/qa/search/page.tsx`:
  - Search input with keyword suggestions
  - Category filter dropdown
  - Sort options (relevance, recent, helpful)
  - Display search results with snippets
- [ ] T052 [P] [US2] Create Q&A Result List component in `components/qa/QAResultList.tsx`:
  - Show question title, category, view count, helpful count
  - Highlight matching keywords
  - Show "Unanswered" badge if pending
- [ ] T053 [P] [US2] Create Answer Detail page in `app/(dashboard)/qa/answers/[id]/page.tsx`:
  - Full answer text with scholarly and contemporary context
  - Source reference section with Quran/Hadith/scholar content
  - Related learning modules
  - Mark helpful button
  - View count
- [ ] T054 [P] [US2] Create Source Reference Viewer component in `components/qa/SourceReference.tsx`:
  - Display source type badge (Quran, Hadith, Scholar)
  - Full citation with metadata
  - Original text + translation
  - Context explanation
- [ ] T055 [US2] Create Ask Question page in `app/(dashboard)/qa/ask/page.tsx`:
  - [ ] T055a Question form with title, content, category, sensitivity flag
  - [ ] T055b Submit handler with duplicate detection
  - [ ] T055c Confirmation with tracking ID
- [ ] T056 [P] [US2] Create Ask Question Dialog component in `components/qa/AskQuestionDialog.tsx`
- [ ] T057 [US2] Create Q&A Categories page in `app/(dashboard)/qa/categories/page.tsx`:
  - List all categories with descriptions and stats
  - Navigate to category-filtered search

### Tests for User Story 2 [OPTIONAL]

- [ ] T058 [P] [US2] Unit tests for QAService in `tests/unit/services/QAService.test.ts`
- [ ] T059 [P] [US2] Unit tests for search ranking algorithm in `tests/unit/utils/searchRanking.test.ts`
- [ ] T060 [P] [US2] Integration tests for Q&A API endpoints in `tests/integration/api/qa.test.ts`
- [ ] T061 [US2] End-to-end test for Q&A flow in `tests/e2e/qa-flow.spec.ts`:
  - Search for question → View answer with sources → Submit new question → See it pending

**Checkpoint**: User Story 2 is fully functional. Users can search Q&A and submit questions. Knowledge base accessible with full source citations. Core MVP features (US1 + US2) complete and deployable.

---

## Phase 5: User Story 3 - Track Learning Progress & Milestones (Priority: P2)

**Goal**: Users see their learning journey visualized with progress tracking and achievement milestones

**Independent Test**: A user who completes 5 modules sees a progress dashboard showing completion percentage, milestones achieved, and estimated time remaining

**Story Completion**: Complete progress tracking system with visual dashboard and milestone celebrations

### API Implementation for User Story 3

- [ ] T062 [P] [US3] Implement milestone achievement system in `lib/services/MilestoneService.ts`:
  - Check milestone trigger conditions after module completion
  - Award milestone and record achievement_at timestamp
  - Return milestone details for celebration display
- [ ] T063 [US3] Implement `GET /api/learning/milestones` endpoint in `app/api/learning/milestones/route.ts` (user's achieved milestones)

### Frontend Implementation for User Story 3

- [ ] T064 [P] [US3] Create Progress Dashboard component in `components/learning/ProgressDashboard.tsx`:
  - Progress bar showing X of Y modules complete
  - Completion percentage with text description
  - Time spent and estimated time remaining
  - Last completed module with date
  - Next recommended module highlight
- [ ] T065 [P] [US3] Create Milestones Display component in `components/learning/MilestonesDisplay.tsx`:
  - Show all achieved milestones with achievement dates
  - Show upcoming milestone (e.g., "3 more modules to Intermediate Level")
  - Visual achievement indicators (badges, stars)
- [ ] T066 [US3] Create Milestone Celebration modal in `components/learning/MilestoneCelebration.tsx`:
  - Show when new milestone is achieved
  - Celebration animation
  - Share milestone button (optional)
- [ ] T067 [US3] Create Learning Statistics page in `app/(dashboard)/learning/statistics/page.tsx`:
  - Learning streak (consecutive days)
  - Total modules completed
  - Total time invested
  - Favorite categories
  - Overall completion estimate
- [ ] T068 [P] [US3] Update Progress Dashboard in `app/(dashboard)/learning/progress/page.tsx`:
  - Enhance with milestones section
  - Add learning statistics
  - Add time tracking visualization

### Tests for User Story 3 [OPTIONAL]

- [ ] T069 [P] [US3] Unit tests for MilestoneService in `tests/unit/services/MilestoneService.test.ts`
- [ ] T070 [US3] End-to-end test for milestone achievement in `tests/e2e/milestone-flow.spec.ts`:
  - Complete required modules → Milestone achieved → See celebration

**Checkpoint**: User Story 3 is fully functional. Progress dashboards, milestones, and learning statistics complete. User engagement features operational.

---

## Phase 6: User Story 4 - Explore Reference Sources (Priority: P2)

**Goal**: Committed learners can explore original Islamic sources (Quran, Hadith, scholars) and understand how they connect to learning modules

**Independent Test**: A user can search for a Quranic topic, view verses with translations and scholarly interpretations, and see how they relate to completed modules

**Story Completion**: Complete source reference explorer with advanced search and rich context

### API Implementation for User Story 4

- [ ] T071 [P] [US4] Implement source search in `lib/services/SourceService.ts`:
  - Search by source type (quran, hadith, scholar)
  - Filter by topic/keyword
  - Get sources linked to specific modules
- [ ] T072 [US4] Implement `GET /api/sources/quran` endpoint in `app/api/sources/quran/route.ts` (Quranic passages with translations)
- [ ] T073 [US4] Implement `GET /api/sources/hadith` endpoint in `app/api/sources/hadith/route.ts` (Hadith with grading)
- [ ] T074 [US4] Implement `GET /api/sources/scholars` endpoint in `app/api/sources/scholars/route.ts` (scholarly texts and interpretations)

### Frontend Implementation for User Story 4

- [ ] T075 [P] [US4] Create Sources Explorer page in `app/(dashboard)/sources/page.tsx`:
  - Tab navigation (Quran, Hadith, Scholars)
  - Search by keyword
  - Filter/sort options
- [ ] T076 [P] [US4] Create Quran Source Viewer in `components/sources/QuranViewer.tsx`:
  - Surah selection (28 chapters)
  - Verse range selection
  - Display verse with translation
  - Show scholarly interpretation
  - Related modules section
- [ ] T077 [P] [US4] Create Hadith Source Viewer in `components/sources/HadithViewer.tsx`:
  - Collection selection (Bukhari, Muslim, etc.)
  - Hadith search
  - Show authentication grade (Sahih, Hasan, Weak)
  - Show narrator chain (isnad)
- [ ] T078 [P] [US4] Create Scholar Source Viewer in `components/sources/ScholarViewer.tsx`:
  - Scholar profile with biography
  - Major works list
  - Quotes/interpretations
  - Madhab (school of law) information
- [ ] T079 [US4] Create Topic Search for Sources in `app/(dashboard)/sources/search/page.tsx`:
  - Search across all source types
  - Filter by source type
  - See all instances of topic/concept

### Tests for User Story 4 [OPTIONAL]

- [ ] T080 [P] [US4] Unit tests for SourceService in `tests/unit/services/SourceService.test.ts`
- [ ] T081 [US4] End-to-end test for source exploration in `tests/e2e/source-exploration.spec.ts`:
  - Search for topic → View Quranic verses → See scholarly interpretation → See related modules

**Checkpoint**: User Story 4 is fully functional. Source explorer complete with rich reference system. All core and engagement features operational.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple features

- [ ] T082 [P] Create comprehensive documentation:
  - [ ] T082a README.md with project overview and setup instructions
  - [ ] T082b API documentation with full endpoint reference
  - [ ] T082c Contributing guide for future developers
  - [ ] T082d Deployment guide for production
- [ ] T083 [P] Optimize performance:
  - [ ] T083a Image optimization (convert to WebP, set explicit dimensions)
  - [ ] T083b Implement lazy loading for modules and Q&A results
  - [ ] T083c Cache optimization for TanStack Query (stale times, GC times)
  - [ ] T083d Database query optimization (add indexes, optimize joins)
- [ ] T084 [P] Accessibility improvements:
  - [ ] T084a Run accessibility audit (WCAG 2.1 AA compliance)
  - [ ] T084b Fix color contrast issues
  - [ ] T084c Ensure keyboard navigation works throughout
  - [ ] T084d Add ARIA labels where needed
- [ ] T085 [P] Security hardening:
  - [ ] T085a Implement Row-Level Security (RLS) policies in Supabase
  - [ ] T085b Add rate limiting to API endpoints
  - [ ] T085c Implement CSRF protection for form submissions
  - [ ] T085d Sanitize user input in Q&A submissions
- [ ] T086 [P] Content management system (CMS) for advisors:
  - [ ] T086a Create admin panel at `/admin/content/modules`
  - [ ] T086b Create admin panel at `/admin/content/qa`
  - [ ] T086c Create approval workflow for user-submitted Q&A
  - [ ] T086d Add bulk content import from CSV
- [ ] T087 Analytics & monitoring:
  - [ ] T087a Set up error tracking (Sentry or equivalent)
  - [ ] T087b Implement page view tracking
  - [ ] T087c Add module completion analytics
  - [ ] T087d Create admin dashboard for metrics
- [ ] T088 [P] Additional unit tests (if not already in story phases):
  - [ ] T088a Full unit test coverage for utility functions in `lib/utils/`
  - [ ] T088b Component snapshot tests for UI components
- [ ] T089 Prepare for Phase 2 (Mobile + Community):
  - [ ] T089a Document mobile API requirements for Phase 2
  - [ ] T089b Create GraphQL schema (if mobile uses GraphQL)
  - [ ] T089c Plan community contribution workflow
- [ ] T090 Run final integration test suite:
  - [ ] Complete E2E test for full user journey (signup → learn → ask question → see answer → progress)
  - [ ] Validate all success criteria from spec.md are met
  - [ ] Performance testing under load (1000+ users)

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies → can start immediately
2. **Foundational (Phase 2)**: Depends on Setup completion → **BLOCKS all user stories**
3. **User Story 1 (Phase 3)**: Depends on Foundational completion → can start immediately after Phase 2
4. **User Story 2 (Phase 4)**: Depends on Foundational completion → can start immediately after Phase 2 OR in parallel with US1
5. **User Story 3 (Phase 5)**: Depends on US1 completion (needs module completion tracking)
6. **User Story 4 (Phase 6)**: Depends on US1 completion (needs module context)
7. **Polish (Final Phase)**: Depends on desired user stories being complete

### User Story Dependencies

```
Foundational Phase (blocking)
    ↓
    ├→ User Story 1 (P1) - Learning Path
    │   ↓
    │   └→ User Story 3 (P2) - Progress Tracking [REQUIRES US1 completion]
    │
    ├→ User Story 2 (P1) - Q&A System [Can run in parallel with US1]
    │
    └→ User Story 4 (P2) - Source Explorer [REQUIRES US1 completion]
```

### Parallelization Opportunities

**Phase 1 (Setup)**: All [P] tasks can run in parallel
```
T002 Configure Tailwind (parallel with T003, T004, T005, T007, T008, T009)
T003 Configure TypeScript (parallel with T002, T004, T005, T007, T008, T009)
T004 Environment setup (parallel with others)
T005 Supabase client (parallel with others)
T007 Git hooks (parallel with others)
T008 Linting (parallel with others)
T009 Testing setup (parallel with others)
```

**Phase 2 (Foundational)**: All [P] database migrations in parallel, then auth flows in parallel
```
Database Creation (parallel):
T011a Create user tables
T011b Create module tables
T011c Create Q&A tables
T011d Create source tables
T011e Create milestones table

Then Auth Setup (parallel):
T013a, T013b, T013c, T014a, T014b, T014c (all independent)

Then Error Handling (parallel):
T016a, T016b
```

**Phase 3 (User Story 1 - Learning)**: Models and APIs can start after Phase 2
```
Parallel Component Development:
T021 & T022 Seed modules & sources (parallel, both seed tasks)
T030-T034 Frontend components (all independent)
T035a, T035b, T035c, T035d (all in single completion flow, sequential)
T036-T039 Tests (all independent except E2E which needs implementation done)
```

**Phase 4 (User Story 2 - Q&A)**: Can run in parallel with Phase 3
```
Parallel Development:
T043 & T044 Seed Q&A & repository (parallel)
T045-T049 API endpoints (sequential: depends on repository from T044)
T051-T057 Frontend components (all parallel)
T058-T061 Tests (all parallel, optional)
```

**Phase 5 (User Story 3 - Progress)**: Depends on US1 complete
```
T062 & T063 Milestone service (can run in parallel)
T064-T068 Frontend components (all parallel)
T069-T070 Tests (parallel)
```

**Phase 6 (User Story 4 - Sources)**: Depends on US1 complete
```
T071-T074 API endpoints (sequential)
T075-T079 Frontend components (all parallel)
T080-T081 Tests (parallel)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

For fastest shipping of core value:

1. ✅ Complete Phase 1: Setup (1 week)
2. ✅ Complete Phase 2: Foundational (1-2 weeks)
3. ✅ Complete Phase 3: User Story 1 - Learning (2-3 weeks)
4. ✅ Complete Phase 4: User Story 2 - Q&A (2-3 weeks, parallel with US1)
5. 🎯 **STOP and VALIDATE**: Test User Story 1 + 2 independently
6. 📦 Deploy MVP to production (Week 6-7)

**MVP Scope**: Users can learn Islam systematically and ask/answer daily-life questions
**Estimated Timeline**: 6-7 weeks with full team

### Incremental Delivery

1. Deploy MVP (US1 + US2) to production
2. Gather user feedback on learning and Q&A systems
3. Add User Story 3 - Progress tracking (2 weeks)
4. Validate engagement improvements
5. Add User Story 4 - Source explorer (2 weeks)
6. Complete Polish phase (1-2 weeks)

### Parallel Team Strategy

With multiple developers:

**Week 1-2**:
- Developer A: Phase 1 Setup (alone)
- Developer B: Prepare Phase 2 infrastructure (in parallel)

**Week 3-4** (After Phase 2 complete):
- Developer A: User Story 1 - Learning (modules, API, UI)
- Developer B: User Story 2 - Q&A (questions, API, UI)
- Developer C: User Story 3 - Progress (dashboard, milestones)

**Week 5-7**:
- Developer A: Complete US1 refinements + testing
- Developer B: Complete US2 refinements + testing
- Developer C: User Story 4 - Sources OR Polish phase

**Week 8+**:
- Full team: Polish, optimization, launch prep

---

## Success Metrics (from spec.md)

Validate against these criteria before shipping:

- **SC-001**: New users access first module within 2 minutes ✓
- **SC-002**: 85%+ retention of concepts after module completion ✓
- **SC-003**: Users ask 2+ questions per month ✓
- **SC-004**: 80% of questions answered within 48 hours ✓
- **SC-005**: Users complete curriculum with 85%+ retention ✓
- **SC-006**: Answers rated 4/5 stars for helpfulness ✓
- **SC-007**: 100% of content has authenticated sources ✓
- **SC-008**: 60% user retention (return for 2nd session within 7 days) ✓

---

## Notes

- **[P] tasks**: Different files, no dependencies = can run in parallel
- **[Story] labels**: US1 (User Story 1), US2, US3, US4 map to spec.md stories
- Each user story is **independently testable and deployable**
- Tests marked [OPTIONAL] not critical path but recommended for quality
- Commit after each task or logical group
- Stop at checkpoint to validate story independently before moving to next
- Reference design docs (plan.md, data-model.md, contracts/) for implementation details

---

## Task Checklist Validation

✅ All tasks follow strict format: `- [ ] [ID] [P?] [Story?] Description with file path`
✅ All tasks have checkboxes `- [ ]`
✅ All tasks have sequential IDs (T001-T090)
✅ All tasks have descriptions with exact file paths
✅ Parallel tasks marked with `[P]`
✅ User story tasks marked with `[US1]`, `[US2]`, etc.
✅ Dependencies clearly documented
✅ Parallel opportunities identified per phase
✅ Setup & Foundational phases first
✅ User stories in priority order (P1 before P2)
✅ Each story independently testable
✅ Tests optional but planned
✅ Estimated timeline provided
✅ Success criteria mapped to tasks
✅ Ready for execution by single or multiple developers
