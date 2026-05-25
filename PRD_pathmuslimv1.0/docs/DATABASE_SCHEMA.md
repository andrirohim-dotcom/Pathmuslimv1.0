# Database Schema Guide

Complete reference for PathMuslim's PostgreSQL schema.

## 📊 Entity Overview

| Table | Purpose | Records | Updated |
|-------|---------|---------|---------|
| `users` | User accounts | ~10K | Signup, profile update |
| `user_settings` | User preferences | ~10K | Settings changes |
| `learning_modules` | Course content | ~50 | Admin creation |
| `learner_progress` | Progress tracking | ~100K | Module completion |
| `qa_questions` | User questions | ~5K | User submission |
| `qa_answers` | Q&A answers | ~500 | Admin creation |
| `source_references` | Quranic/Hadith citations | ~2K | Admin content |
| `learning_milestones` | Achievements | ~20 | Admin creation |

## 🔐 RLS Policies

**Row-Level Security** is enabled on all tables to ensure users only see their own data.

Key rule: Users can only access their own records (`WHERE user_id = auth.uid()`).

---

## 📋 Detailed Table Documentation

### users

**Purpose**: Store user account information

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| id | UUID | No | Primary key, auto-generated |
| email | VARCHAR(255) | No | Unique, login identifier |
| name | VARCHAR(255) | No | Display name |
| created_at | TIMESTAMP | No | Account creation time |
| updated_at | TIMESTAMP | No | Last profile update |

**Relationships**:
- One-to-many: user → learner_progress
- One-to-many: user → qa_questions
- One-to-many: user → user_settings

**RLS Policies**:
```sql
-- Users can read their own record
CREATE POLICY users_read ON users
  FOR SELECT USING (id = auth.uid());

-- Supabase auth creates/updates users
CREATE POLICY users_auth ON users
  FOR ALL USING (id = auth.uid());
```

**Common Queries**:
```sql
-- Find user by email
SELECT * FROM users WHERE email = 'user@example.com';

-- Count total users
SELECT COUNT(*) FROM users;

-- Recently joined users
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

---

### user_settings

**Purpose**: Store user preferences (timezone, language, notifications)

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  notifications_email BOOLEAN DEFAULT true,
  notifications_push BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
```

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | UUID | - | Primary key |
| user_id | UUID | - | Foreign key to users |
| language | VARCHAR(10) | 'en' | ISO language code |
| timezone | VARCHAR(50) | 'UTC' | IANA timezone |
| notifications_email | BOOLEAN | true | Enable email notifications |
| notifications_push | BOOLEAN | false | Enable push notifications |
| created_at | TIMESTAMP | NOW() | Creation time |
| updated_at | TIMESTAMP | NOW() | Last update |

**RLS Policy**:
```sql
-- Users can only access their own settings
CREATE POLICY user_settings_own ON user_settings
  FOR ALL USING (user_id = auth.uid());
```

**Common Queries**:
```sql
-- Get user settings
SELECT * FROM user_settings WHERE user_id = 'uuid';

-- Users who enabled email notifications
SELECT u.* FROM users u
JOIN user_settings us ON u.id = us.user_id
WHERE us.notifications_email = true;
```

---

### learning_modules

**Purpose**: Store learning course content

```sql
CREATE TABLE learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  duration_minutes INTEGER,
  content TEXT NOT NULL,
  prerequisites UUID[] DEFAULT ARRAY[]::UUID[],
  learning_objectives TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_learning_modules_category ON learning_modules(category);
CREATE INDEX idx_learning_modules_created_at ON learning_modules(created_at);
```

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| id | UUID | No | Primary key |
| title | VARCHAR(255) | No | Module name |
| description | TEXT | Yes | Short summary |
| category | VARCHAR(100) | Yes | Topic area |
| duration_minutes | INTEGER | Yes | Estimated learning time |
| content | TEXT | No | Full module text |
| prerequisites | UUID[] | Yes | Array of prerequisite module IDs |
| learning_objectives | TEXT[] | Yes | Array of learning goals |
| created_at | TIMESTAMP | No | Created date |
| updated_at | TIMESTAMP | No | Last update |

**RLS Policy**: None (all authenticated users can read)

```sql
CREATE POLICY learning_modules_read ON learning_modules
  FOR SELECT USING (true);
```

**Common Queries**:
```sql
-- Get module by ID
SELECT * FROM learning_modules WHERE id = 'uuid';

-- Get modules in category
SELECT * FROM learning_modules WHERE category = 'Faith Basics';

-- Get modules with prerequisites
SELECT * FROM learning_modules 
WHERE prerequisites IS NOT NULL AND array_length(prerequisites, 1) > 0;

-- Check if module is prerequisite for another
SELECT * FROM learning_modules 
WHERE 'prereq-uuid' = ANY(prerequisites);
```

---

### learner_progress

**Purpose**: Track user progress through modules

```sql
CREATE TABLE learner_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module_id UUID NOT NULL,
  score INTEGER,
  completed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (module_id) REFERENCES learning_modules(id),
  UNIQUE(user_id, module_id)
);

CREATE INDEX idx_learner_progress_user_id ON learner_progress(user_id);
CREATE INDEX idx_learner_progress_module_id ON learner_progress(module_id);
CREATE INDEX idx_learner_progress_completed_at ON learner_progress(completed_at);
```

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| id | UUID | No | Primary key |
| user_id | UUID | No | Which user |
| module_id | UUID | No | Which module |
| score | INTEGER | Yes | Assessment score 0-100 |
| completed_at | TIMESTAMP | No | When completed |
| created_at | TIMESTAMP | No | Record creation |

**RLS Policy**:
```sql
-- Users can only see their own progress
CREATE POLICY learner_progress_own ON learner_progress
  FOR ALL USING (user_id = auth.uid());
```

**Common Queries**:
```sql
-- Get user's completed modules
SELECT * FROM learner_progress 
WHERE user_id = 'uuid' 
ORDER BY completed_at DESC;

-- Count completed modules for user
SELECT COUNT(*) FROM learner_progress WHERE user_id = 'uuid';

-- Get users who completed a module
SELECT u.* FROM users u
JOIN learner_progress lp ON u.id = lp.user_id
WHERE lp.module_id = 'uuid';

-- Calculate average score
SELECT AVG(score) FROM learner_progress 
WHERE user_id = 'uuid';

-- Get modules NOT completed by user
SELECT lm.* FROM learning_modules lm
WHERE lm.id NOT IN (
  SELECT module_id FROM learner_progress WHERE user_id = 'uuid'
);
```

---

### qa_questions

**Purpose**: Store user-submitted questions

```sql
CREATE TABLE qa_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_qa_questions_user_id ON qa_questions(user_id);
CREATE INDEX idx_qa_questions_status ON qa_questions(status);
CREATE INDEX idx_qa_questions_created_at ON qa_questions(created_at);
```

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | UUID | - | Primary key |
| user_id | UUID | - | Who asked |
| title | VARCHAR(255) | - | Question title |
| content | TEXT | - | Full question |
| category | VARCHAR(100) | - | Question category |
| status | VARCHAR(50) | 'pending' | pending/answered/closed |
| created_at | TIMESTAMP | NOW() | Submitted |
| updated_at | TIMESTAMP | NOW() | Last edit |

**RLS Policy**:
```sql
-- Users can read all questions, edit/delete own
CREATE POLICY qa_questions_read ON qa_questions
  FOR SELECT USING (true);

CREATE POLICY qa_questions_own ON qa_questions
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

**Common Queries**:
```sql
-- Get pending questions
SELECT * FROM qa_questions 
WHERE status = 'pending' 
ORDER BY created_at DESC;

-- Get user's questions
SELECT * FROM qa_questions 
WHERE user_id = 'uuid' 
ORDER BY created_at DESC;

-- Get questions by category
SELECT * FROM qa_questions 
WHERE category = 'Daily Life' 
ORDER BY created_at DESC;
```

---

### qa_answers

**Purpose**: Store Q&A answers (admin-created)

```sql
CREATE TABLE qa_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  sources JSONB DEFAULT '[]'::JSONB,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_qa_answers_category ON qa_answers(category);
CREATE INDEX idx_qa_answers_created_at ON qa_answers(created_at);
CREATE INDEX idx_qa_answers_question_gin 
  ON qa_answers USING GIN (to_tsvector('english', question || ' ' || answer));
```

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| id | UUID | - | Primary key |
| question | VARCHAR(255) | - | Question text |
| answer | TEXT | - | Answer text |
| category | VARCHAR(100) | - | Question category |
| sources | JSONB | '[]' | Quranic/Hadith sources |
| helpful_count | INTEGER | 0 | Helpful vote count |
| created_at | TIMESTAMP | NOW() | Created |
| updated_at | TIMESTAMP | NOW() | Updated |

**RLS Policy**: None (all users can read)

```sql
CREATE POLICY qa_answers_read ON qa_answers
  FOR SELECT USING (true);
```

**Source Format**:
```json
{
  "sources": [
    {
      "type": "quran",
      "reference": "Surah Al-Baqarah 2:256",
      "text": "There is no compulsion in religion..."
    },
    {
      "type": "hadith",
      "reference": "Sahih Bukhari 1:1",
      "grade": "Sahih"
    }
  ]
}
```

**Common Queries**:
```sql
-- Search answers by text
SELECT * FROM qa_answers 
WHERE to_tsvector('english', question || ' ' || answer) 
  @@ plainto_tsquery('english', 'prayer');

-- Get answers by category
SELECT * FROM qa_answers WHERE category = 'Family';

-- Most helpful answers
SELECT * FROM qa_answers 
ORDER BY helpful_count DESC 
LIMIT 10;

-- Recent answers
SELECT * FROM qa_answers 
ORDER BY created_at DESC 
LIMIT 20;
```

---

### source_references

**Purpose**: Store Quranic verses, Hadith, and scholarly references

```sql
CREATE TABLE source_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  reference VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_source_references_type ON source_references(type);
CREATE INDEX idx_source_references_reference ON source_references(reference);
```

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| type | VARCHAR(50) | 'quran', 'hadith', 'scholar', 'text' |
| title | VARCHAR(255) | Source name |
| reference | VARCHAR(255) | Citation format |
| content | TEXT | Full text |
| metadata | JSONB | Type-specific data |
| created_at | TIMESTAMP | Created |

**RLS Policy**: None (all users can read)

**Metadata Formats**:

```json
// Quran
{
  "surah": 2,
  "ayah": 256,
  "text_arabic": "...",
  "text_english": "..."
}

// Hadith
{
  "collection": "Sahih Bukhari",
  "grade": "Sahih",
  "narrator": "Abu Hurayrah"
}

// Scholar
{
  "author": "Ibn Taymiyyah",
  "work": "Majmu' al-Fatawa",
  "century": "13-14"
}
```

**Common Queries**:
```sql
-- Get Quranic verses for a surah
SELECT * FROM source_references 
WHERE type = 'quran' 
AND metadata->>'surah'::int = 2;

-- Get Hadith by collection
SELECT * FROM source_references 
WHERE type = 'hadith' 
AND metadata->>'collection' = 'Sahih Bukhari';

-- Get scholar works
SELECT DISTINCT metadata->>'author'
FROM source_references 
WHERE type = 'scholar';
```

---

### learning_milestones

**Purpose**: Store achievement milestones

```sql
CREATE TABLE learning_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  milestone_name VARCHAR(255) NOT NULL,
  milestone_description TEXT,
  trigger_condition JSONB NOT NULL,
  achievement_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_learning_milestones_user_id ON learning_milestones(user_id);
CREATE INDEX idx_learning_milestones_achievement_at ON learning_milestones(achievement_at);
```

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Which user |
| milestone_name | VARCHAR(255) | Achievement name |
| milestone_description | TEXT | What it means |
| trigger_condition | JSONB | How it was earned |
| achievement_at | TIMESTAMP | When earned |
| created_at | TIMESTAMP | Record created |

**RLS Policy**:
```sql
-- Users can only see their own milestones
CREATE POLICY learning_milestones_own ON learning_milestones
  FOR ALL USING (user_id = auth.uid());
```

**Common Queries**:
```sql
-- Get user's achievements
SELECT * FROM learning_milestones 
WHERE user_id = 'uuid' 
ORDER BY achievement_at DESC;

-- Count milestones earned
SELECT COUNT(*) FROM learning_milestones 
WHERE user_id = 'uuid';

-- Recent achievements across all users
SELECT * FROM learning_milestones 
ORDER BY achievement_at DESC 
LIMIT 10;
```

---

## 🔗 Key Relationships

### User Journey

```
user
  ├── user_settings (1:1) - preferences
  ├── learner_progress (1:many) - module completions
  │   └── learning_modules - what they completed
  ├── qa_questions (1:many) - questions they asked
  └── learning_milestones (1:many) - achievements earned
```

### Content Relationships

```
learning_modules
  ├── prerequisites (UUID[]) - references other modules
  └── sources (linked via qa_answers) - citations used

qa_answers
  ├── category (implicit link to question categories)
  └── sources (JSONB) - embedded Quranic/Hadith references

source_references
  └── used by qa_answers and learning_modules (semantic link)
```

---

## 🔍 Query Patterns

### Pattern 1: User Progress

```sql
-- Get user's progress summary
SELECT 
  u.name,
  COUNT(DISTINCT lp.module_id) as modules_completed,
  AVG(lp.score) as average_score,
  COUNT(DISTINCT lm.id) as milestones_earned,
  MAX(lp.completed_at) as last_activity
FROM users u
LEFT JOIN learner_progress lp ON u.id = lp.user_id
LEFT JOIN learning_milestones lm ON u.id = lm.user_id
WHERE u.id = 'user-uuid'
GROUP BY u.id, u.name;
```

### Pattern 2: Search Answers

```sql
-- Search Q&A with relevance ranking
SELECT 
  qa_answers.*,
  ts_rank(
    to_tsvector('english', question || ' ' || answer),
    plainto_tsquery('english', 'prayer')
  ) as relevance
FROM qa_answers
WHERE to_tsvector('english', question || ' ' || answer) 
  @@ plainto_tsquery('english', 'prayer')
ORDER BY relevance DESC
LIMIT 10;
```

### Pattern 3: Check Prerequisites

```sql
-- Check if user completed all prerequisites for a module
SELECT 
  lm.id,
  lm.title,
  array_length(lm.prerequisites, 1) as prereq_count,
  COUNT(lp.id) as completed_prereqs
FROM learning_modules lm
LEFT JOIN learner_progress lp ON 
  lp.user_id = 'user-uuid' 
  AND lp.module_id = ANY(lm.prerequisites)
WHERE lm.id = 'module-uuid'
GROUP BY lm.id, lm.title;
```

### Pattern 4: Calculate Completion Rate

```sql
-- Overall completion rate
SELECT 
  COUNT(DISTINCT lp.user_id) as users_active,
  COUNT(DISTINCT lp.module_id) as unique_modules_completed,
  COUNT(*) as total_completions,
  ROUND(100.0 * COUNT(*) / (
    SELECT COUNT(*) FROM learning_modules
  )::NUMERIC, 2) as completion_percentage
FROM learner_progress;
```

---

## 🚀 Adding New Tables

When adding a new entity, follow this checklist:

1. **Design the schema**
   ```sql
   CREATE TABLE new_entity (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL,
     -- other fields
     created_at TIMESTAMP DEFAULT NOW(),
     FOREIGN KEY (user_id) REFERENCES users(id)
   );
   ```

2. **Create indexes**
   ```sql
   CREATE INDEX idx_new_entity_user_id ON new_entity(user_id);
   CREATE INDEX idx_new_entity_created_at ON new_entity(created_at);
   ```

3. **Set up RLS policies**
   ```sql
   CREATE POLICY new_entity_own ON new_entity
     FOR ALL USING (user_id = auth.uid());
   ```

4. **Add TypeScript types**
   ```typescript
   // lib/types.ts
   interface NewEntity {
     id: string;
     user_id: string;
     // ...
   }
   ```

5. **Create migration file**
   - Name: `migrations/[timestamp]_add_new_entity.sql`
   - Run: `npm run db:push`

---

## 📚 Related Documentation

- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Adding new services
- [TYPES_GUIDE.md](./TYPES_GUIDE.md) - TypeScript types
- Production schema at: `supabase/migrations/`

---

**Questions?** Review the actual migrations in `supabase/migrations/` or check Supabase documentation for PostgreSQL features.
