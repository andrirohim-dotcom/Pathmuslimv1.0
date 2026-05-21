/**
 * Islamic Learning Guide - Type Definitions
 * Comprehensive TypeScript types for all database entities
 * Based on data-model.md
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum Level {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

export enum QACategory {
  Family = 'family',
  Work = 'work',
  Spirituality = 'spirituality',
  Health = 'health',
  Relationships = 'relationships',
  Other = 'other',
}

export enum QAStatus {
  Pending = 'pending',
  Answered = 'answered',
  Archived = 'archived',
}

export enum ModerationStatus {
  Pending = 'pending',
  Approved = 'approved',
  Published = 'published',
}

export enum ProfileVisibility {
  Private = 'private',
  Public = 'public',
  MilestoneOnly = 'milestone_only',
}

export enum EmailDigest {
  Weekly = 'weekly',
  Monthly = 'monthly',
  Never = 'never',
}

export enum SourceType {
  Quran = 'quran',
  Hadith = 'hadith',
  Scholar = 'scholar',
  ScholarlyText = 'scholarly_text',
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

// ============================================================================
// USER & SETTINGS
// ============================================================================

export interface User {
  id: string; // UUID
  email: string;
  auth_id: string; // UUID, references Supabase Auth
  full_name: string;
  bio?: string | null;
  notification_preferences: {
    email_digest?: 'weekly' | 'monthly' | 'never';
    question_answers?: boolean;
    [key: string]: unknown;
  };
  created_at: string; // ISO timestamp
  last_login?: string | null; // ISO timestamp
}

export interface UserSettings {
  user_id: string; // UUID, primary key
  profile_visibility: ProfileVisibility;
  email_digest: EmailDigest;
  content_language: string; // 'english' currently
  theme: Theme;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// ============================================================================
// LEARNING MODULES
// ============================================================================

export interface LearningModule {
  id: string; // UUID
  title: string;
  description: string;
  sequence_number: number;
  level: Level;
  estimated_hours: number;
  content: string;
  learning_objectives: string[]; // Array of 1-8 learning objectives
  prerequisites?: string[] | null; // Array of module UUIDs
  source_ids: string[]; // Array of source reference UUIDs
  created_at: string; // ISO timestamp
  published_at?: string | null; // ISO timestamp
  published_by?: string | null; // UUID of admin/publisher
  version: number;
}

// ============================================================================
// SOURCE REFERENCES
// ============================================================================

export interface QuranMetadata {
  surah: string;
  surah_number: number;
  verse_start: number;
  verse_end?: number;
  translation_name?: string;
}

export interface HadithMetadata {
  collection: string;
  hadith_number: number;
  authentication_grade?: string;
  narrator?: string;
  chapter?: string;
}

export interface ScholarMetadata {
  scholar_name: string;
  work_title: string;
  publication_year?: number;
  madhab?: string;
  page_reference?: string;
}

export type SourceMetadata = QuranMetadata | HadithMetadata | ScholarMetadata | Record<string, unknown>;

export interface SourceReference {
  id: string; // UUID
  source_type: SourceType;
  citation: string; // e.g., "Quran 2:183", "Sahih Bukhari 1234"
  display_text: string; // The actual quoted text or verse
  translation?: string | null; // English translation if original is Arabic
  context?: string | null; // Explanation of why this source matters
  source_metadata: SourceMetadata;
  created_at: string; // ISO timestamp
  created_by?: string | null; // UUID of creator
}

// ============================================================================
// LEARNER PROGRESS
// ============================================================================

export interface LearnerProgress {
  id: string; // UUID
  user_id: string; // UUID
  module_id: string; // UUID
  completed_at?: string | null; // ISO timestamp
  time_spent_minutes?: number | null;
  assessment_score?: number | null; // 0-100
  notes?: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// ============================================================================
// Q&A SYSTEM
// ============================================================================

export interface QAQuestion {
  id: string; // UUID
  user_id: string; // UUID
  title: string;
  content: string;
  category: QACategory;
  status: QAStatus;
  answer_id?: string | null; // UUID of linked answer
  created_at: string; // ISO timestamp
  answered_at?: string | null; // ISO timestamp
  view_count: number;
  helpful_count: number;
  sensitive_content: boolean;
}

export interface QAAnswer {
  id: string; // UUID
  question_id: string; // UUID
  content: string;
  scholarly_perspective: string;
  contemporary_context?: string | null;
  source_ids: string[]; // Array of source reference UUIDs
  created_by: string; // UUID of admin/moderator
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  version: number;
  moderation_status: ModerationStatus;
  moderation_notes?: string | null;
}

// ============================================================================
// MILESTONES
// ============================================================================

export interface MilestoneCondition {
  type: 'module_count' | 'module_id' | 'time_spent';
  count?: number;
  level?: Level;
  module_id?: string;
  hours?: number;
}

export interface LearningMilestone {
  id: string; // UUID
  name: string;
  description: string;
  trigger_condition: MilestoneCondition;
  created_at: string; // ISO timestamp
}

export interface LearnerMilestone {
  id: string; // UUID
  user_id: string; // UUID
  milestone_id: string; // UUID
  achievement_at: string; // ISO timestamp
}

// ============================================================================
// JUNCTION TABLES
// ============================================================================

export interface ModuleSource {
  module_id: string; // UUID
  source_id: string; // UUID
  created_at: string; // ISO timestamp
}

export interface AnswerSource {
  answer_id: string; // UUID
  source_id: string; // UUID
  created_at: string; // ISO timestamp
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateUserRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface UpdateUserSettingsRequest {
  profile_visibility?: ProfileVisibility;
  email_digest?: EmailDigest;
  content_language?: string;
  theme?: Theme;
}

export interface CreateQuestionRequest {
  title: string;
  content: string;
  category: QACategory;
  sensitive_content?: boolean;
}

export interface CompleteModuleRequest {
  assessment_score?: number;
  time_spent_minutes?: number;
  notes?: string;
}

export interface MarkAnswerHelpfulRequest {
  is_helpful: boolean;
}

// ============================================================================
// DATABASE VIEW TYPES
// ============================================================================

export interface UserProgressSummary {
  user_id: string;
  email: string;
  full_name: string;
  completed_modules: number;
  total_modules_started: number;
  completion_percentage: number;
  last_completed_at?: string | null;
  total_time_spent_minutes: number;
}

export interface QASummary {
  category: QACategory;
  total_questions: number;
  answered_count: number;
  pending_count: number;
  archived_count: number;
}
