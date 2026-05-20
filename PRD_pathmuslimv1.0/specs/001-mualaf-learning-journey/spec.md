# Feature Specification: Islamic Learning Guide for New Muslims

**Feature Branch**: `001-mualaf-learning-journey`

**Created**: 2026-05-20

**Status**: Draft

**Input**: Guidance application for new Muslim converts (mualaf) seeking structured Islamic education and answers to daily-life questions

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Structured Islamic Learning Pathway (Priority: P1)

A newly converted Muslim wants to systematically learn Islam's foundational teachings in the correct order, guided by the methodology recommended by Islamic scholars for new converts. They need a clear, structured curriculum that progresses from basic concepts to deeper understanding.

**Why this priority**: This is the core value proposition of the application—providing organized, authentic Islamic education that gives new Muslims confidence they're learning in the way Islamic scholars recommend, not randomly or from potentially unreliable sources.

**Independent Test**: A new user can access a complete learning pathway, progress through at least 3 foundational modules, and demonstrate understanding of core Islamic concepts without needing external resources.

**Acceptance Scenarios**:

1. **Given** a new convert opens the application, **When** they select "Begin Learning," **Then** they see a structured learning pathway with sequential modules organized by Islamic scholars' recommended progression (e.g., fundamentals → Quranic studies → Hadith understanding → daily practice)
2. **Given** a learner completes a module, **When** they move to the next module, **Then** the content builds logically on previous knowledge with clear connections explained
3. **Given** a learner reaches a learning milestone (e.g., "Completed 5 modules"), **When** they view their profile, **Then** they see visual confirmation of their progress and what comes next
4. **Given** a learner encounters difficult concepts, **When** they request explanation, **Then** they receive clarification with referenced sources (Quran verses, authentic Hadith, scholarly texts)

---

### User Story 2 - Answer Questions with Scholarly References (Priority: P1)

A new Muslim has a practical question about daily Islamic life (e.g., "How should I handle conflicts with non-Muslim family members?") and wants a thoughtful, scholarly answer grounded in Islamic sources—not a fatwa, but guidance from authentic Islamic scholarship that considers modern context and psychology.

**Why this priority**: New Muslims often struggle with integrating Islamic values into daily life. This feature directly addresses their lived experience and builds confidence in Islam's applicability to their situation.

**Independent Test**: A user can ask 3 different types of daily-life questions and receive sourced answers that reference authentic Islamic knowledge and contemporary understanding within 2 minutes of asking.

**Acceptance Scenarios**:

1. **Given** a user has a daily-life question, **When** they type their question, **Then** the application searches its knowledge base and displays relevant answers organized by source (Quranic guidance, Hadith-based answers, scholarly interpretations)
2. **Given** an answer references an Islamic source, **When** the user taps the reference, **Then** they see the original source text (Quran verse, Hadith excerpt, or scholar's explanation) with context
3. **Given** a question doesn't have an existing answer, **When** the user submits it, **Then** it's flagged for addition to the knowledge base with a message: "This is a great question—we're adding it with sourced answers soon"
4. **Given** an answer addresses psychology or modern context, **When** the user views it, **Then** they see both Islamic scholarly perspective AND practical psychology or contemporary understanding clearly separated

---

### User Story 3 - Track Learning Progress & Milestones (Priority: P2)

A learner wants to see their learning journey visualized—what they've completed, what comes next, and how they're progressing toward understanding Islam comprehensively. Seeing milestones motivates continued learning.

**Why this priority**: Progress visibility builds motivation and helps learners see they're making real progress. However, it's secondary to actually having great learning content.

**Independent Test**: A learner who completes 5 modules sees a visual progress tracker showing 5/20 modules complete and understands what the remaining modules cover.

**Acceptance Scenarios**:

1. **Given** a learner views their dashboard, **When** the page loads, **Then** they see a progress bar, modules completed, estimated time to complete the full curriculum, and which major milestone they're approaching
2. **Given** a learner has completed certain modules, **When** they check their profile, **Then** they see badges or markers for completed learning sections (e.g., "Islamic Fundamentals - Complete")

---

### User Story 4 - Explore Reference Sources (Priority: P2)

A committed learner wants to dive deeper into original sources—reading Quranic passages, understanding authenticated Hadith collections, or exploring how classical Islamic scholars interpreted teachings. This deepens their learning and gives them confidence in the authenticity of the guidance they're receiving.

**Why this priority**: This serves engaged learners seeking deeper knowledge, but the core need is the guided learning path and daily-life answers.

**Independent Test**: A user can search for a Quranic topic, view relevant verses with translation and classical interpretation, and understand how it connects to their earlier learning modules.

**Acceptance Scenarios**:

1. **Given** a learner wants to explore sources, **When** they access the "Sources & References" section, **Then** they see organized access to Quranic passages (with translation), authentic Hadith collections, and classical Islamic scholarly works relevant to what they're learning
2. **Given** a learner reads a Quranic verse with commentary, **When** they view it, **Then** they see the verse, its meaning/translation, and how Islamic scholars have historically interpreted it

---

### Edge Cases

- What happens when a new convert has questions about theological disagreements between Islamic schools (madhabs)? → Present multiple scholarly perspectives respectfully, noting they're valid interpretations within Islamic tradition
- How does the system handle sensitive topics (e.g., relationships, mental health, cultural conflicts)? → Provide compassionate, sourced answers that integrate Islamic guidance with psychological understanding
- What if a user asks something that isn't a legitimate Islamic question? → Redirect politely with explanation and suggest related legitimate questions they might have

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a structured learning curriculum with modules organized in the sequence Islamic scholars recommend for new convert education
- **FR-002**: System MUST organize all curriculum content with clear prerequisites so learners understand dependencies (e.g., "Module 3 builds on concepts from Module 1")
- **FR-003**: System MUST include a Q&A knowledge base where users can ask daily-life Islamic questions and receive answers with source citations (Quran, Hadith, scholarly references)
- **FR-004**: System MUST NOT provide fatwas (religious rulings); instead, it MUST reference and cite authentic Islamic sources and scholarly interpretations
- **FR-005**: System MUST attribute all learning content and answers to authenticated sources—Quranic verses, authenticated Hadith collections, or named Islamic scholars/texts
- **FR-006**: System MUST provide visibility into the knowledge base structure, so learners understand what content is sourced from Quran, what from Hadith, what from scholarly interpretation
- **FR-007**: System MUST track learner progress through the curriculum with clear milestone markers
- **FR-008**: System MUST support searching for content by topic, Quranic chapter, Hadith collection, or question theme
- **FR-009**: System MUST include learning materials appropriate for millennial and Gen Z audiences—clear language, relatable scenarios, contemporary context without compromising Islamic authenticity
- **FR-010**: System MUST be accessible on web browsers (Phase 1 focus) with mobile responsiveness; mobile app (iOS/Android) planned for Phase 2

### Key Entities

- **Learner Profile**: Tracks a user's learning journey—completed modules, current level, accumulated knowledge, learning streaks, answered questions
- **Learning Module**: A cohesive unit of Islamic education with learning objectives, content, examples, and assessment. Modules have prerequisites and dependencies
- **Learning Milestone**: Markers of progression (e.g., "Completed Islamic Fundamentals," "Asked and answered 10 questions")
- **Question & Answer**: User questions about Islamic daily-life topics with sourced answers and reference citations
- **Source Reference**: Attributes content to Quran, Hadith, Islamic scholar, or scholarly text with full citation
- **Knowledge Base Topic**: Organizing structure for Q&A content (e.g., Family Relations, Work Ethics, Spiritual Practice, Health & Medicine)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: New users can access and begin learning the first module within 2 minutes of opening the application
- **SC-002**: Learners who engage with 3+ modules report confidence in understanding foundational Islamic concepts (measured via post-learning assessment)
- **SC-003**: Users ask an average of 2+ questions in their first month, indicating the Q&A feature addresses real concerns
- **SC-004**: 80% of user questions receive answers within 48 hours (sourced answers added or reference provided)
- **SC-005**: Learners complete the foundational curriculum module (estimated 8-12 weeks engagement) with 85%+ retention of core concepts
- **SC-006**: Users report that answers help them navigate daily-life Islamic decisions (measured via satisfaction survey; target 4/5 stars)
- **SC-007**: All learning content and answers have authenticated source citations, with 100% of sources traceable to Quranic verse, Hadith collection, or named Islamic scholar
- **SC-008**: New users from millennial/Gen Z demographic find the learning style relatable and engaging (measured by retention: 60%+ return for second learning session within 7 days)

## Assumptions

- **Curriculum Design**: We assume the learning curriculum will follow the progression recommended by Islamic scholars for new converts (e.g., fundamentals first, then deeper studies). A curriculum advisor will define this; the app implements the structure they provide.
- **Source Authenticity**: We assume sourcing expertise and authenticity review of Quranic passages, Hadith authentications, and scholarly references will be provided by Islamic knowledge advisors; the app organizes and presents these sources accurately.
- **User Motivation**: We assume new converts are intrinsically motivated to learn Islam deeply, so gamification elements are secondary to content quality.
- **Language**: We assume content will be in English initially (Phase 1), serving English-speaking new Muslims globally. Localization to other languages planned for later phases.
- **Psychology Integration**: We assume psychological and contemporary context will be integrated by subject matter experts into answers and learning materials, not added algorithmically.
- **Offline Access**: Phase 1 focuses on web access with internet connectivity; offline learning modes are out of scope for Phase 1.
- **Community Features**: Phase 1 focuses on guided individual learning; community/peer interaction features are planned for Phase 2.
