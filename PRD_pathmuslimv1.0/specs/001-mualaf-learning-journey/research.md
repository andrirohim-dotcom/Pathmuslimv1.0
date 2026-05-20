# Phase 0 Research: Islamic Learning Guide for New Muslims

**Date**: 2026-05-20
**Status**: Completed
**Plan Reference**: [plan.md](./plan.md)

## 1. Curriculum Sourcing Framework

**Decision**: Hybrid model with curriculum advisors + community contribution

**Rationale**: 
- Curriculum authenticity is critical to user trust
- Islamic scholars have established methodologies for teaching converts
- Expert review from Islamic knowledge advisors needed before content goes live
- Community can contribute Q&A content under advisor review

**Approach**:
- Partner with 2-3 Islamic knowledge advisors (scholars or experienced Islamic educators) who will:
  - Define the module sequence based on established convert education methodologies
  - Review all curriculum content for authenticity and clarity
  - Validate hadith authentications and Quranic interpretations
- Content management system allows advisors to:
  - Create/edit modules with source citations
  - Review user-submitted Q&A before publication
  - Update content when new questions arise
- All curriculum locked to published versions (immutable history for reliability)

**Alternative Considered & Rejected**: 
- Build automated Islamic knowledge validation → Too risky for religious content accuracy
- Use single open-source Islamic course → Limits customization to millennial learners' specific needs

---

## 2. Q&A Moderation Workflow

**Decision**: Human expert review with asynchronous moderation queue

**Rationale**:
- Islamic questions deserve thoughtful, authentic scholarly answers
- Cannot automate validation of Quranic/Hadith authenticity
- Users need confidence that answers come from legitimate sources
- 48-hour SLA (success criterion SC-004) reasonable for volunteer/part-time moderation

**Approach**:
- User submits question → Automatically searches existing knowledge base
  - If existing answer found: Show related answers immediately
  - If no match: Flag for moderation queue with "We're finding sources for this question" message
- Moderation team (Islamic knowledge advisors + trained community moderators):
  - Reviews flagged questions (priority queue by topic and engagement)
  - Sources answer from Quran, Hadith, or scholarly references
  - Publishes answer with full source citations
  - Timeline: Target 24-48 hours; aim for 80% within 48 hours
- Published answers locked to prevent drift but versioned if updated with new sources

**Alternative Considered & Rejected**:
- Community peer review (crowdsourced answers) → Risk of inaccurate Islamic guidance; requires expert curation anyway
- AI-generated answers → Cannot verify Islamic authenticity; too risky for religious content

---

## 3. Source Attribution Best Practices

**Decision**: Multi-source attribution system with reference explorer

**Rationale**:
- Learners need confidence content is sourced from authentic Islamic texts
- Quranic verses and Hadith have standard citation formats
- Scholarly interpretations need author/work attribution
- Building trust through transparency

**Approach**:

**Quranic Content**:
- Verses cited as: [Surah Name]:[Verse Range] (e.g., Quran 2:183)
- Include English translation (selected mainstream translation for consistency)
- Link to scholarly interpretation if available
- Store original Arabic for reference

**Hadith**:
- Use standard Hadith collection format: [Collection Name] [Hadith Number] (e.g., Sahih Bukhari 1234)
- Only include hadith from authenticated collections (Sahih al-Bukhari, Sahih Muslim, etc.)
- Mark weak/disputed hadith explicitly if referenced for educational context
- Include chain of narrators (isnad) for transparency

**Scholarly Texts**:
- Citation: [Scholar Name], [Work Title], [Edition], [Page/Section]
- Ensure published works with known publication info
- Include brief context on scholar's school of thought (madhab) if relevant

**Implementation**:
- Create "Sources & References" section on every curriculum module and answer
- Learners can tap reference to see full citation, original text, and Islamic knowledge advisor's commentary
- Search-by-source (e.g., "Show all content from Quran Chapter 4") available in sources explorer

**Alternative Considered & Rejected**:
- Use external Islamic content APIs → Limited control over attribution accuracy; risk of proprietary/unreliable content
- Minimal attribution → Reduces user confidence; violates spec requirement FR-005

---

## 4. User Authentication & Privacy

**Decision**: Supabase Auth with privacy-forward design

**Rationale**:
- Supabase Auth provides OAuth + email/password with minimal overhead
- Learning progress is sensitive religious data; require explicit user consent
- GDPR-compliant data residency for international users
- Minimal data collection philosophy aligns with user trust

**Approach**:
- Authentication: Supabase Auth (email/password, optionally Google OAuth for Phase 2)
- Privacy:
  - Learning progress not shared publicly by default
  - User can opt-in to share progress milestones (e.g., "I completed Islamic Fundamentals")
  - Minimal tracking: only learning completion, not question engagement or behavioral analytics in Phase 1
  - Clear privacy policy explaining: what data we collect, how it's used, retention period
- Data Residency:
  - Offer choice of Supabase region (EU, US, etc.) at signup for GDPR compliance
  - Document which region stores user data
- Account Control:
  - Users can export their learning history
  - Users can request account deletion (data wiped within 30 days)

**Alternative Considered & Rejected**:
- Custom authentication → Higher maintenance burden; Supabase handles compliance updates
- Anonymous learning without accounts → Can't track progress or personalize future recommendations

---

## 5. Offline & Progressive Web App (PWA) Potential

**Decision**: Defer offline/PWA to Phase 2; focus on stable, fast web experience Phase 1

**Rationale**:
- Phase 1 priority: Core learning + Q&A working well, authentic sourcing established
- New Muslim learners typically have consistent internet (smartphone with data or WiFi)
- Offline modules add complexity to source updates and correctness verification
- PWA caching increases maintenance burden with no immediate user need

**Approach (Phase 1)**:
- Fast web app with aggressive client-side caching (TanStack Query)
- Optimized for slow connections (gzip, lazy loading, image optimization)
- Works well on mobile browsers with offline-like experience (instant navigation between cached pages)
- Success metrics: SC-001 (2-minute first load) and responsive design

**Phase 2 Consideration**: 
- If analytics show offline demand (users in areas with spotty connectivity), implement service worker + local IndexedDB caching
- PWA could cache current module + next 3 modules for seamless offline learning

**Alternative Considered & Rejected**:
- Native mobile app for Phase 1 → Delays shipping core features; web + responsive design sufficient for Phase 1
- Service worker + offline database → Adds complexity to source versioning and correctness; premature optimization

---

## 6. Hadith Authentication Standards

**Decision**: Use only hadith from authenticated collections; clearly mark madhab interpretations

**Rationale**:
- Islamic tradition has established hadith grading systems
- Different scholarly schools (madhabs) weight hadith differently
- Users deserve transparency on authentication level

**Approach**:
- **Tier 1 (Most Authenticated)**: Hadith from Sahih al-Bukhari and Sahih Muslim (universally accepted)
- **Tier 2 (Well-Authenticated)**: Hadith from Sunan collections with strong authentication (Ibn Majah, At-Tirmidhi, An-Nasai, Abu Dawood)
- **Tier 3 (Contextual Use)**: Weaker hadith used only for educational/contextual understanding, clearly labeled "Weak hadith referenced for context"
- All hadith include: authenticity grade + source collection

**Alternative Considered & Rejected**:
- Use any hadith collection without grading → Risk of spreading weak/fabricated hadith; violates user trust
- Only use Sahih al-Bukhari/Muslim → Limits scope; doesn't cover all Islamic topics needed for convert education

---

## Technology Research Summary

**Language**: TypeScript with Next.js → Strongly typed, rapid development, good team accessibility

**Database**: Supabase PostgreSQL → Managed database, real-time subscriptions, built-in auth, straightforward to scale

**Frontend Framework**: Next.js 14 with React 18 → Server components for performance, file-based routing, built-in optimization

**UI Framework**: Tailwind CSS + shadcn/ui → Rapid styling, accessible components, mobile-responsive defaults

**State Management**: TanStack Query → Server state handling, caching, background sync; Context API for UI state

**Testing**: Jest + Playwright → Unit tests for logic, E2E tests for critical user flows

**Hosting**: Vercel (Next.js) + Supabase Cloud → Automatic deployments, CDN, databases geographically distributed

---

## Research Completion Checklist

- ✅ Curriculum sourcing decision made (hybrid expert + community model)
- ✅ Q&A moderation approach defined (human expert with 48-hour SLA)
- ✅ Source attribution framework designed (Quran, Hadith, scholarly)
- ✅ Privacy & authentication approach determined (Supabase Auth with privacy-first design)
- ✅ Offline/PWA decision deferred to Phase 2 (Phase 1 focuses on fast web)
- ✅ Hadith authentication standards set (Tier 1/2/3 with transparency)
- ✅ Technology stack finalized (TypeScript, Next.js, Supabase, Tailwind)

**All NEEDS CLARIFICATION items resolved. Ready to proceed to Phase 1 Design (data-model.md, contracts, quickstart.md)**
