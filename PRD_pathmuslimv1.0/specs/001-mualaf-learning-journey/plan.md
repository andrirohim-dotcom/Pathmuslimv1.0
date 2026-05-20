# Implementation Plan: Islamic Learning Guide for New Muslims

**Branch**: `001-mualaf-learning-journey` | **Date**: 2026-05-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-mualaf-learning-journey/spec.md`

**Note**: This plan is filled in by the `/speckit-plan` command.

## Summary

**Feature**: Web-based learning platform and Q&A system for new Muslim converts (mualaf), providing structured Islamic education sourced from Quran, authenticated Hadith, and scholarly texts, plus a knowledge base for answering daily-life Islamic questions.

**Core Deliverables (Phase 1)**:
- Structured learning curriculum with sequential modules and progress tracking
- Q&A knowledge base with source attribution and reference linking
- User authentication and profile management
- Content management system for curriculum and Q&A sourcing
- Web-based interface optimized for millennial/Gen Z learners

**Technical Approach**: Next.js web application with Supabase backend, TypeScript for type safety, and a content management layer for curriculum and Q&A sourcing.

## Technical Context

**Language/Version**: TypeScript 5.x (JavaScript with type safety for maintainability)

**Primary Dependencies**: 
- Next.js 14+ (React framework for web application)
- Supabase JavaScript client (database, authentication, real-time features)
- TanStack Query (server state management and data fetching)
- Tailwind CSS (responsive UI design)

**Storage**: Supabase PostgreSQL database (managed cloud database with local CLI for development)

**Testing**: 
- Jest + React Testing Library (unit and component testing)
- Playwright (end-to-end testing for critical user flows)

**Target Platform**: Web browsers (Chrome, Firefox, Safari) on desktop and tablet. Mobile responsiveness Phase 1; native mobile app Phase 2.

**Project Type**: Web application (full-stack Next.js with Supabase backend)

**Performance Goals**: 
- Page load: < 2 seconds on 4G (meets success criterion SC-001: "within 2 minutes" covers user onboarding time)
- Module content delivery: < 1 second after initial load
- Search results: < 500ms for Q&A knowledge base queries
- Support 1000+ concurrent users Phase 1 (scale to 10,000+ by end of 2026)

**Constraints**:
- No hardcoded or proprietary Islamic content; all sourced from public, authenticated religious texts
- GDPR and privacy compliance for user learning data
- Content moderation workflow for Q&A submissions before publication
- Source attribution on every learning module and answer

**Scale/Scope**: 
- Phase 1: 20 foundational learning modules, 100+ Q&A pairs in knowledge base
- 5000-10,000 registered users by end of Phase 1
- ~40 screens/pages for learning flows, profile, search, and source reference

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Principles Alignment**:

✅ **I. User-Centric Design**: Specification driven entirely by user needs (new Muslim learners, mealaf community). Feature design rooted in real user pain points (integrating Islam into daily life, structured learning). No technology-first decisions.

✅ **II. Clarity Over Cleverness**: Specification written for stakeholders (curriculum advisors, product team). Clear user scenarios with concrete examples. Every acceptance criterion unambiguous and testable. No assumptions about technical implementation in the spec.

✅ **III. Traceability**: Each requirement (FR-001 through FR-010) traces to user stories. Each success criterion (SC-001 through SC-008) measures a specific business/user outcome. All acceptance scenarios directly support the requirement they're under.

✅ **IV. Testability**: All acceptance criteria objective and measurable (2-minute load time, 85% retention, 4/5 star satisfaction, 60% return rate). No subjective language ("user-friendly" → specific engagement metrics). Every requirement can be verified without knowing implementation details.

✅ **V. Iterative Validation**: Specification documents learner journey end-to-end. Design phases (research, data modeling, contracts) will validate assumptions against technical feasibility. Re-evaluation checkpoint after Phase 1 design before Phase 2 tasks.

**Status**: ✅ PASS - Feature design fully complies with constitution. No violations identified.

## Project Structure

### Documentation (this feature)

```text
specs/001-mualaf-learning-journey/
├── plan.md                           # This file
├── research.md                        # Phase 0: Research & decisions (to be generated)
├── data-model.md                      # Phase 1: Entity definitions & schema
├── quickstart.md                      # Phase 1: Developer setup & first run
├── contracts/                         # Phase 1: API & data contracts
│   ├── learning-modules-api.md       # Curriculum module delivery API
│   ├── qa-knowledge-base-api.md      # Question/Answer search and submission
│   ├── user-progress-api.md          # Learning progress tracking
│   ├── source-references-api.md      # Quranic/Hadith reference viewing
│   └── content-management-api.md     # CMS for sourcing curriculum & answers
├── checklists/requirements.md         # Specification quality checklist (completed)
└── tasks.md                          # Phase 2: Implementation tasks (by /speckit-tasks)
```

### Source Code (repository root)

**Selected Structure**: Next.js monorepo with frontend-focused organization (mobile APIs added in Phase 2)

```text
app/
├── (auth)/                           # Authentication routes
│   ├── login/
│   ├── signup/
│   └── forgot-password/
├── (dashboard)/                      # User dashboard (protected routes)
│   ├── learning/
│   │   ├── modules/                 # Curriculum module viewer
│   │   ├── progress/                # Progress dashboard
│   │   └── milestone/               # Milestone celebrations
│   ├── qa/
│   │   ├── search/                  # Q&A search interface
│   │   ├── ask/                     # Submit new question
│   │   └── [answer-id]/             # View answer detail with sources
│   ├── sources/                     # Source reference explorer
│   │   ├── quran/
│   │   ├── hadith/
│   │   └── scholars/
│   └── profile/                     # User profile & settings
├── api/                             # Backend API routes
│   ├── auth/
│   ├── learning/
│   ├── qa/
│   ├── users/
│   └── content/
└── layout.tsx                       # Root layout with navigation

lib/
├── supabase/                        # Database queries & initialization
├── api/                             # API client functions
├── hooks/                           # Custom React hooks
├── types/                           # TypeScript type definitions
└── utils/                           # Utility functions

components/
├── learning/                        # Module viewing components
├── qa/                              # Q&A interface components
├── progress/                        # Progress tracking components
├── sources/                         # Source reference components
├── ui/                              # Reusable UI components
└── layouts/                         # Page layout components

styles/
├── globals.css                      # Tailwind configuration & globals
└── variables.css                    # Design tokens

tests/
├── unit/                            # Jest unit tests
├── integration/                     # Integration tests
└── e2e/                            # Playwright end-to-end tests

public/
├── assets/                          # Images, icons
└── content/                         # Static content references

.env.local                           # Local environment variables (Supabase credentials)
next.config.js
package.json
tsconfig.json
```

**Structure Decision**: Next.js 14 app router with co-located components and clear feature-based organization. This allows:
- Rapid feature development with isolated page + component + API route groups
- Clear separation between user-facing routes, API endpoints, and shared logic
- Easy mobile API addition in Phase 2 (can add `/api/mobile/` routes without restructuring)
- Straightforward deployment to Vercel or self-hosted Next.js server

## Design Phases

### Phase 0: Research (Resolve Unknowns)

**Objectives**: Validate technical choices and resolve any ambiguities before detailed design

**Research Topics**:

1. **Curriculum Sourcing Framework**
   - How will curriculum modules be sourced and reviewed for authenticity?
   - What review process ensures Islamic scholarly accuracy?
   - Who are the Islamic knowledge advisors for content validation?
   - Decision needed: Build in-house review process vs. partner with established Islamic educators

2. **Q&A Moderation Workflow**
   - How will submitted questions and answers be moderated before publication?
   - What are the approval criteria and turnaround expectations?
   - Decision needed: Human moderation, AI-assisted triage, or community review

3. **Source Attribution Best Practices**
   - How to represent Quranic verses (translation preference, full text vs. excerpt)?
   - Hadith authentication standards (which collections are considered "authenticated")?
   - Scholarly text citation format and access approach
   - Decision needed: Use existing Islamic database APIs or build custom content management

4. **User Authentication & Privacy**
   - Privacy approach for tracking learning progress (sensitive religious learning data)
   - GDPR/data residency requirements for international users
   - Decision needed: Supabase authentication or custom auth layer

5. **Offline & Progressive Web App (PWA) Potential**
   - Should Phase 1 include offline learning (cached modules)?
   - Or is connectivity assumption reasonable?
   - Decision needed: Standard web app vs. PWA approach

**Output**: `research.md` with decisions on each topic

### Phase 1: Design & Contracts (Technical Architecture)

**Objectives**: Define data model, API contracts, and technical approach

**Deliverables**:

1. **data-model.md** — Entity definitions for:
   - Learner Profile (user, progress, milestones)
   - Learning Module (curriculum structure, prerequisites, content)
   - Question & Answer (knowledge base organization)
   - Source Reference (Quran, Hadith, scholar citations)
   - Knowledge Base Topic (Q&A category structure)

2. **contracts/** — API specifications:
   - `/api/learning/modules` — GET list of modules, GET module detail with content
   - `/api/learning/progress` — GET learner progress, POST module completion
   - `/api/qa/search` — GET answers by question text, GET answer detail with sources
   - `/api/qa/questions` — POST new question submission
   - `/api/sources/quran`, `/api/sources/hadith`, `/api/sources/scholars` — Reference lookup
   - `/api/content/admin` — CMS endpoints for adding curriculum and answers

3. **quickstart.md** — Developer onboarding:
   - Local setup (Node.js, Supabase local CLI, environment config)
   - Database schema creation
   - Running the dev server
   - First module creation (sample curriculum loading)
   - Testing the learner flow (signup → first module → progress)

**Constitution Re-check**: Verify design decisions don't violate clarity, traceability, or testability principles

**Output**: All three files above + confirmation that design supports specification

---

## Artifacts Delivered

### Phase 0 Complete ✅
- [research.md](./research.md) — 6 research topics resolved, technology stack finalized
- All NEEDS CLARIFICATION items resolved with reasoned decisions
- Curriculum sourcing, Q&A moderation, source attribution, privacy, offline access, hadith standards all decided

### Phase 1 Complete ✅
- [data-model.md](./data-model.md) — 8 core entities, junction tables, indexes, and validation rules
- [contracts/learning-modules-api.md](./contracts/learning-modules-api.md) — 5 endpoints for module delivery and progress tracking
- [contracts/qa-knowledge-base-api.md](./contracts/qa-knowledge-base-api.md) — 5 endpoints for Q&A search and submission
- [quickstart.md](./quickstart.md) — Complete developer setup guide (30 minutes to running locally)
- Updated CLAUDE.md with plan reference for context

### Ready for Phase 2 ✅
- Next step: `/speckit-tasks` to generate implementation tasks
- Tasks will be organized by user story (P1: Learning + Q&A, P2: Progress + Sources)
- Tasks ready for parallel team development

---

## Planning Completion Summary

**Feature**: Islamic Learning Guide for New Muslims (PathMuslim v1.0)
**Phase 1 Status**: COMPLETE ✅
**Total Artifacts**: 1 plan + 1 research + 1 data model + 2 API contracts + 1 quickstart guide

**Key Design Decisions**:
1. **Sourcing Model**: Hybrid expert-driven (curriculum advisors validate) + community contribution (Q&A moderation)
2. **Architecture**: Next.js fullstack with Supabase backend, TypeScript for type safety
3. **Priority P1**: Learning modules + Q&A system (core value)
4. **Priority P2**: Progress dashboard + source explorer (engagement features)
5. **Privacy**: Supabase Auth with explicit user consent for progress sharing
6. **Mobile**: Deferred to Phase 2; Phase 1 focuses on responsive web

**Constitution Alignment**: ✅ PASS
- User-Centric: Design driven by mualaf learner needs
- Clarity: No technical jargon in spec; clear acceptance criteria
- Traceability: Requirements trace to user stories; APIs trace to requirements
- Testability: All success criteria measurable; no subjective language
- Iterative: Design phases validate assumptions; re-evaluation gates in place

**Next Action**: Generate implementation tasks with `/speckit-tasks`
- Tasks breakdown by P1 user story (learning, Q&A)
- Foundational infrastructure first, then parallel story implementation
- Estimated Phase 1 delivery: 8-10 weeks with full team
