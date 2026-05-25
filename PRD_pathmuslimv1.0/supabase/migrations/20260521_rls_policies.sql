-- ============================================================================
-- RLS Policies for PathMuslim v1.0
-- ============================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE learner_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- learner_progress: users see only their own
CREATE POLICY "users_own_progress" ON learner_progress
  FOR ALL USING (auth.uid() = user_id);

-- qa_questions: users can insert their own; read answered or own
CREATE POLICY "users_own_questions" ON qa_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_read_answered" ON qa_questions
  FOR SELECT USING (status = 'answered' OR auth.uid() = user_id);

-- learner_milestones: users see only their own
CREATE POLICY "users_own_milestones" ON learner_milestones
  FOR ALL USING (auth.uid() = user_id);

-- user_settings: users manage only their own
CREATE POLICY "users_own_settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- learning_modules: public read for authenticated users
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_modules" ON learning_modules
  FOR SELECT USING (auth.role() = 'authenticated');

-- source_references: public read for authenticated users
ALTER TABLE source_references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_sources" ON source_references
  FOR SELECT USING (auth.role() = 'authenticated');
