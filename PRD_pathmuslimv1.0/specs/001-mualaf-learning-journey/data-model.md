# Phase 1 Data Model: Islamic Learning Guide for New Muslims

**Date**: 2026-05-20
**Status**: Complete
**Plan Reference**: [plan.md](./plan.md)

## Core Entities

### 1. User (Learner Profile)

**Purpose**: Represent a learner and track their learning journey

**Fields**:
- `id` (UUID, primary key)
- `email` (string, unique, required) — User's email for authentication
- `auth_id` (UUID, references Supabase Auth)
- `full_name` (string, required) — User's name
- `created_at` (timestamp) — Account creation date
- `last_login` (timestamp) — Last login timestamp
- `bio` (text, optional) — Optional user bio
- `notification_preferences` (JSON) — Email preferences (weekly digest, question answers, etc.)

**Validation Rules**:
- Email must be valid email format
- Full name must be at least 2 characters
- Created_at/last_login auto-set by system

**Relationships**:
- One User → Many LearnerProgress records (1:N)
- One User → Many UserQuestions records (1:N)
- One User → One UserSettings record (1:1)

**Indexes**: Email (unique), auth_id, created_at

---

### 2. LearnerProgress

**Purpose**: Track which modules a learner has completed and their overall progression

**Fields**:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → User, required)
- `module_id` (UUID, foreign key → LearningModule, required)
- `completed_at` (timestamp, nullable) — When learner completed the module
- `time_spent_minutes` (integer, nullable) — Total time spent on this module
- `assessment_score` (integer, 0-100, nullable) — Module assessment score if applicable
- `notes` (text, nullable) — User's personal notes/reflections on module
- `created_at` (timestamp) — When record was created
- `updated_at` (timestamp) — Last update

**Validation Rules**:
- Can only create progress once per user/module pair (unique constraint)
- Assessment score must be 0-100 if provided
- Time spent must be positive integer
- Completed_at must be after user's account creation
- If completed_at is set, assessment_score must be set

**Relationships**:
- Many LearnerProgress → One User (N:1)
- Many LearnerProgress → One LearningModule (N:1)

**Indexes**: user_id, module_id, completed_at, user_id + module_id (unique)

---

### 3. LearningModule

**Purpose**: Represent a single unit of Islamic education in the curriculum

**Fields**:
- `id` (UUID, primary key)
- `title` (string, required) — Module title (e.g., "Islamic Fundamentals", "Quran Recitation")
- `description` (text, required) — Module overview for learner preview
- `sequence_number` (integer, required) — Position in curriculum (1, 2, 3...)
- `level` (enum: beginner | intermediate | advanced, required)
- `estimated_hours` (integer, required) — Expected time to complete
- `content` (text, required) — Full module content
- `learning_objectives` (JSON array, required) — What learner will understand after completion
- `prerequisites` (JSON array of UUID, optional) — IDs of modules that should be completed first
- `source_ids` (JSON array of UUID, required) — References to sources used in this module
- `created_at` (timestamp)
- `published_at` (timestamp, nullable) — When module was published; null = draft
- `published_by` (UUID, references User/Admin, nullable)
- `version` (integer, default 1) — Version number for tracking updates

**Validation Rules**:
- Title must be 5-100 characters
- Sequence number must be unique and positive
- Level must be one of the enum values
- Estimated hours must be 1-200
- Content must be non-empty
- Learning objectives array must have 1-8 items, each 10-200 characters
- Prerequisites must reference existing modules and be published
- All source_ids must reference existing SourceReference records
- Can only publish if all requirements met (content, objectives, sources)

**Relationships**:
- One LearningModule → Many LearnerProgress records (1:N)
- One LearningModule → Many SourceReference records (N:M via ModuleSource junction)
- One LearningModule → Many LearningMilestone records (1:N)

**Indexes**: sequence_number (unique), level, published_at, prerequisites

**Notes**: 
- Version field allows updates while preserving history
- Published/draft separation allows content editing without disrupting learners

---

### 4. SourceReference

**Purpose**: Store attributions to Quranic verses, Hadith, and scholarly texts

**Fields**:
- `id` (UUID, primary key)
- `source_type` (enum: quran | hadith | scholar | scholarly_text, required)
- `citation` (string, required) — Formatted citation (e.g., "Quran 2:183", "Sahih Bukhari 1234")
- `display_text` (text, required) — The actual quoted text or verse
- `translation` (text, nullable) — English translation if original is Arabic
- `context` (text, nullable) — Brief explanation of why this source matters
- `source_metadata` (JSON, required) — Structured metadata specific to source type:
  
  **For Quran**:
  ```json
  {
    "surah": "Al-Baqarah",
    "surah_number": 2,
    "verse_start": 183,
    "verse_end": 184,
    "translation_name": "Sahih International"
  }
  ```
  
  **For Hadith**:
  ```json
  {
    "collection": "Sahih al-Bukhari",
    "hadith_number": 1234,
    "authentication_grade": "Sahih (Authentic)",
    "narrator": "Abu Hurayrah",
    "chapter": "Book of Fasting"
  }
  ```
  
  **For Scholarly**:
  ```json
  {
    "scholar_name": "Ibn Qayyim al-Jawziyyah",
    "work_title": "Ighathat al-Lahfan",
    "publication_year": 1961,
    "madhab": "Hanbali",
    "page_reference": "p. 45"
  }
  ```

- `created_at` (timestamp)
- `created_by` (UUID, references User/Admin)

**Validation Rules**:
- Citation must be 5-200 characters
- Display text must be 10-5000 characters
- Source_metadata must be valid JSON with required fields for source_type
- Translation (if provided) must be different from display_text

**Relationships**:
- Many SourceReference → Many LearningModule (N:M via ModuleSource junction)
- Many SourceReference → Many QAAnswer (N:M via AnswerSource junction)

**Indexes**: source_type, citation, created_at

---

### 5. QAQuestion

**Purpose**: Represent a user's question about daily Islamic life

**Fields**:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → User, required)
- `title` (string, required) — Question title (5-200 chars)
- `content` (text, required) — Full question description
- `category` (enum: family | work | spirituality | health | relationships | other, required)
- `status` (enum: pending | answered | archived, required, default pending)
- `answer_id` (UUID, foreign key → QAAnswer, nullable) — Linked answer if exists
- `created_at` (timestamp)
- `answered_at` (timestamp, nullable) — When answer was published
- `view_count` (integer, default 0) — How many times this Q&A was viewed
- `helpful_count` (integer, default 0) — How many marked it helpful
- `sensitive_content` (boolean, default false) — Flag for sensitive topics requiring care

**Validation Rules**:
- Title must be 5-200 characters
- Content must be 20-5000 characters
- Category must be one of enum values
- Status: pending → answered → archived (one-way progression)
- User can only set status to archived (moderation team controls pending → answered)
- View count and helpful count non-negative

**Relationships**:
- Many QAQuestion → One User (N:1)
- Many QAQuestion → One QAAnswer (N:1, optional)

**Indexes**: user_id, status, category, created_at, answered_at

---

### 6. QAAnswer

**Purpose**: Represent an answer to a user's question with scholarly sources

**Fields**:
- `id` (UUID, primary key)
- `question_id` (UUID, foreign key → QAQuestion, required)
- `content` (text, required) — The answer text
- `scholarly_perspective` (text, required) — Islamic scholarly guidance on this question
- `contemporary_context` (text, nullable) — Modern/psychological context for the issue
- `source_ids` (JSON array of UUID, required) — References to SourceReference records
- `created_by` (UUID, references User/Admin, required) — Who wrote this answer
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `version` (integer, default 1) — Version tracking for answer updates
- `moderation_status` (enum: pending | approved | published, required)
- `moderation_notes` (text, nullable) — Notes from moderation team

**Validation Rules**:
- Content must be 50-10000 characters
- Scholarly perspective must be 30-5000 characters
- Contemporary context (if provided) must be 20-3000 characters
- Source IDs must reference existing SourceReference records
- At least 1 source required (scholarly OR contemporary)
- Created_by must be a valid admin/moderator user
- Moderation status: pending → approved → published

**Relationships**:
- One QAAnswer → One QAQuestion (1:1)
- Many QAAnswer → Many SourceReference (N:M via AnswerSource junction)

**Indexes**: question_id, created_by, moderation_status, created_at

---

### 7. LearningMilestone

**Purpose**: Define milestone achievements for learners to celebrate progress

**Fields**:
- `id` (UUID, primary key)
- `name` (string, required) — Milestone name (e.g., "Completed Islamic Fundamentals")
- `description` (text, required) — Description of what this milestone represents
- `trigger_condition` (JSON, required) — Condition that unlocks milestone
  ```json
  {
    "type": "module_count",
    "count": 5,
    "level": "beginner"
  }
  ```
  OR
  ```json
  {
    "type": "module_id",
    "module_id": "uuid-of-completed-module"
  }
  ```
- `created_at` (timestamp)

**Validation Rules**:
- Name must be 5-100 characters
- Description must be 10-500 characters
- Trigger condition must be valid JSON with type field

**Relationships**:
- Milestones are automatically awarded (not directly referenced by user table)
- Derived through LearnerProgress + LearningModule queries

**Indexes**: created_at

---

### 8. UserSettings

**Purpose**: User preferences and privacy settings

**Fields**:
- `user_id` (UUID, primary key, foreign key → User)
- `profile_visibility` (enum: private | public | milestone_only, default private) — Who can see progress
- `email_digest` (enum: weekly | monthly | never, default weekly) — Frequency of progress emails
- `content_language` (enum: english, default english) — Language preference
- `theme` (enum: light | dark | system, default system) — UI theme
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Validation Rules**:
- One settings record per user
- All enum fields must be valid values

**Relationships**:
- One UserSettings → One User (1:1)

---

## Database Relationships Diagram

```
User (1) ──→ (N) LearnerProgress
User (1) ──→ (N) UserQuestion
User (1) ──→ (N) QAAnswer (created_by)
User (1) ──→ (1) UserSettings

LearningModule (1) ──→ (N) LearnerProgress
LearningModule (N) ──→ (M) SourceReference (via ModuleSource junction)

QAQuestion (1) ──→ (1) QAAnswer
QAAnswer (N) ──→ (M) SourceReference (via AnswerSource junction)

SourceReference (1) can be referenced by (N) modules and answers
```

---

## Junction Tables (Many-to-Many)

### ModuleSource
- `module_id` (UUID, FK → LearningModule)
- `source_id` (UUID, FK → SourceReference)
- `created_at` (timestamp)
- Primary Key: (module_id, source_id)

### AnswerSource
- `answer_id` (UUID, FK → QAAnswer)
- `source_id` (UUID, FK → SourceReference)
- `created_at` (timestamp)
- Primary Key: (answer_id, source_id)

---

## State Transitions & Constraints

**Module Publishing**:
- Draft → Published (requires all sources validated)
- Published → Archived (if needed for cleanup, but learners keep access)

**Question Answering**:
- Pending → Answered (moderation team adds answer)
- Answered → Archived (user or admin archiving)

**Progress Tracking**:
- LearnerProgress can only be created once user completes a module
- Cannot retroactively mark as incomplete (tracks completion only)

---

## Indexes for Performance

**User Queries**:
- `users(email)` - Login queries
- `users(created_at)` - Cohort analysis

**Learning Progress**:
- `learner_progress(user_id, completed_at)` - "What has this user completed?"
- `learner_progress(module_id, completed_at)` - "How many completed this module?"

**Q&A**:
- `qa_questions(user_id, status, created_at)` - User's questions
- `qa_questions(status, category, answered_at)` - Unanswered questions by category
- `qa_answers(question_id)` - Find answer for question

**Content Search**:
- `source_references(source_type, citation)` - Find existing source before adding duplicate

---

## Notes

- **Versioning**: Both LearningModule and QAAnswer track versions to allow updates without data loss
- **Audit Trail**: All created_by and created_at fields provide audit trail for content attribution
- **Soft Deletes**: Archived status allows hiding without data loss (important for learning history)
- **Flexibility**: JSON fields (notification_preferences, source_metadata, trigger_condition) allow evolution without schema migrations

---

## Migration Path

1. Create tables in order: User, UserSettings, LearningModule, SourceReference, LearnerProgress, QAQuestion, QAAnswer, LearningMilestone
2. Create junction tables: ModuleSource, AnswerSource
3. Create indexes as listed above
4. Seed with initial curriculum modules and sources (via admin CMS)
5. Enable Row-Level Security (RLS) policies for privacy
