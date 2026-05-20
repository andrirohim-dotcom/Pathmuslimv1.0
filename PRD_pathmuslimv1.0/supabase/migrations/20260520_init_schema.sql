-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USER TABLES
-- ============================================================================

-- Users table (learner profiles)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  auth_id UUID NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  bio TEXT,
  notification_preferences JSONB DEFAULT '{"email_digest": "weekly", "question_answers": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  CONSTRAINT email_valid CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT full_name_not_empty CHECK (LENGTH(full_name) >= 2)
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  profile_visibility VARCHAR(20) DEFAULT 'private' CHECK (profile_visibility IN ('private', 'public', 'milestone_only')),
  email_digest VARCHAR(20) DEFAULT 'weekly' CHECK (email_digest IN ('weekly', 'monthly', 'never')),
  content_language VARCHAR(20) DEFAULT 'english',
  theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. LEARNING MODULES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  sequence_number INTEGER UNIQUE NOT NULL,
  level VARCHAR(50) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours INTEGER NOT NULL CHECK (estimated_hours BETWEEN 1 AND 200),
  content TEXT NOT NULL,
  learning_objectives JSONB NOT NULL DEFAULT '[]',
  prerequisites JSONB DEFAULT '[]',
  source_ids JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE,
  published_by UUID REFERENCES users(id),
  version INTEGER DEFAULT 1,
  CONSTRAINT title_length CHECK (LENGTH(title) BETWEEN 5 AND 100),
  CONSTRAINT objectives_count CHECK (jsonb_array_length(learning_objectives) BETWEEN 1 AND 8)
);

-- ============================================================================
-- 3. SOURCE REFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS source_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('quran', 'hadith', 'scholar', 'scholarly_text')),
  citation VARCHAR(255) NOT NULL,
  display_text TEXT NOT NULL,
  translation TEXT,
  context TEXT,
  source_metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  CONSTRAINT citation_length CHECK (LENGTH(citation) BETWEEN 5 AND 200),
  CONSTRAINT display_text_length CHECK (LENGTH(display_text) BETWEEN 10 AND 5000)
);

-- ============================================================================
-- 4. LEARNER PROGRESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS learner_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER CHECK (time_spent_minutes IS NULL OR time_spent_minutes > 0),
  assessment_score INTEGER CHECK (assessment_score IS NULL OR (assessment_score >= 0 AND assessment_score <= 100)),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module_id)
);

-- ============================================================================
-- 5. Q&A TABLES
-- ============================================================================

-- Questions table
CREATE TABLE IF NOT EXISTS qa_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('family', 'work', 'spirituality', 'health', 'relationships', 'other')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'archived')),
  answer_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  answered_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  sensitive_content BOOLEAN DEFAULT FALSE,
  CONSTRAINT title_length CHECK (LENGTH(title) BETWEEN 5 AND 200),
  CONSTRAINT content_length CHECK (LENGTH(content) BETWEEN 20 AND 5000),
  CONSTRAINT view_count_positive CHECK (view_count >= 0),
  CONSTRAINT helpful_count_positive CHECK (helpful_count >= 0)
);

-- Answers table
CREATE TABLE IF NOT EXISTS qa_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES qa_questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  scholarly_perspective TEXT NOT NULL,
  contemporary_context TEXT,
  source_ids JSONB NOT NULL DEFAULT '[]',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1,
  moderation_status VARCHAR(50) DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'published')),
  moderation_notes TEXT,
  CONSTRAINT content_length CHECK (LENGTH(content) BETWEEN 50 AND 10000),
  CONSTRAINT scholarly_perspective_length CHECK (LENGTH(scholarly_perspective) BETWEEN 30 AND 5000)
);

-- Add foreign key constraint after qa_answers is created
ALTER TABLE qa_questions ADD CONSTRAINT fk_qa_questions_answer_id FOREIGN KEY (answer_id) REFERENCES qa_answers(id) ON DELETE SET NULL;

-- ============================================================================
-- 6. LEARNING MILESTONES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  trigger_condition JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT name_length CHECK (LENGTH(name) BETWEEN 5 AND 100),
  CONSTRAINT description_length CHECK (LENGTH(description) BETWEEN 10 AND 500)
);

-- Learner milestones (achievement tracking)
CREATE TABLE IF NOT EXISTS learner_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES learning_milestones(id) ON DELETE CASCADE,
  achievement_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, milestone_id)
);

-- ============================================================================
-- 7. JUNCTION TABLES (Many-to-Many)
-- ============================================================================

-- Module sources junction table
CREATE TABLE IF NOT EXISTS module_sources (
  module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES source_references(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (module_id, source_id)
);

-- Answer sources junction table
CREATE TABLE IF NOT EXISTS answer_sources (
  answer_id UUID NOT NULL REFERENCES qa_answers(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES source_references(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (answer_id, source_id)
);

-- ============================================================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_auth_id ON users(auth_id);

-- Learning module indexes
CREATE INDEX idx_learning_modules_sequence_number ON learning_modules(sequence_number);
CREATE INDEX idx_learning_modules_level ON learning_modules(level);
CREATE INDEX idx_learning_modules_published_at ON learning_modules(published_at);

-- Learner progress indexes
CREATE INDEX idx_learner_progress_user_id ON learner_progress(user_id);
CREATE INDEX idx_learner_progress_module_id ON learner_progress(module_id);
CREATE INDEX idx_learner_progress_completed_at ON learner_progress(completed_at);
CREATE INDEX idx_learner_progress_user_completed ON learner_progress(user_id, completed_at);

-- Q&A indexes
CREATE INDEX idx_qa_questions_user_id ON qa_questions(user_id);
CREATE INDEX idx_qa_questions_status ON qa_questions(status);
CREATE INDEX idx_qa_questions_category ON qa_questions(category);
CREATE INDEX idx_qa_questions_created_at ON qa_questions(created_at);
CREATE INDEX idx_qa_questions_status_category ON qa_questions(status, category);

CREATE INDEX idx_qa_answers_question_id ON qa_answers(question_id);
CREATE INDEX idx_qa_answers_created_by ON qa_answers(created_by);
CREATE INDEX idx_qa_answers_moderation_status ON qa_answers(moderation_status);

-- Source reference indexes
CREATE INDEX idx_source_references_type ON source_references(source_type);
CREATE INDEX idx_source_references_citation ON source_references(citation);
CREATE INDEX idx_source_references_created_at ON source_references(created_at);

-- Milestone indexes
CREATE INDEX idx_learner_milestones_user_id ON learner_milestones(user_id);
CREATE INDEX idx_learner_milestones_achievement_at ON learner_milestones(achievement_at);

-- ============================================================================
-- 9. VIEWS FOR COMMON QUERIES
-- ============================================================================

-- User progress summary view
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT
  u.id as user_id,
  u.email,
  u.full_name,
  COUNT(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.module_id END) as completed_modules,
  COUNT(DISTINCT lp.module_id) as total_modules_started,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.module_id END) /
        NULLIF(COUNT(DISTINCT CASE WHEN lm.published_at IS NOT NULL THEN lm.id END), 0), 2) as completion_percentage,
  MAX(lp.completed_at) as last_completed_at,
  COALESCE(SUM(lp.time_spent_minutes), 0) as total_time_spent_minutes
FROM users u
LEFT JOIN learner_progress lp ON u.id = lp.user_id AND lp.completed_at IS NOT NULL
LEFT JOIN learning_modules lm ON lm.published_at IS NOT NULL
GROUP BY u.id, u.email, u.full_name;

-- Q&A answered/pending summary
CREATE OR REPLACE VIEW qa_summary AS
SELECT
  category,
  COUNT(*) as total_questions,
  COUNT(CASE WHEN status = 'answered' THEN 1 END) as answered_count,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_count
FROM qa_questions
GROUP BY category;

-- ============================================================================
-- 10. ENABLE ROW LEVEL SECURITY (RLS) - Optional, can be configured per table
-- ============================================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_milestones ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies should be configured after auth is set up
-- Sample policy (uncomment when ready):
-- CREATE POLICY "Users can view their own data" ON users
--   FOR SELECT USING (auth.uid() = auth_id);
