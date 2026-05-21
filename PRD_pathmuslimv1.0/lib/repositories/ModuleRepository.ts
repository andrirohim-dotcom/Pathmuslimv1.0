/**
 * ModuleRepository
 * Data access layer for learning modules and user progress
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  sequence_number: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  content: string;
  learning_objectives: string[];
  prerequisites: string[];
  source_ids: string[];
  created_at: string;
  published_at: string | null;
  published_by: string | null;
  version: number;
}

export interface LearnerProgress {
  id: string;
  user_id: string;
  module_id: string;
  completed_at: string | null;
  time_spent_minutes: number | null;
  assessment_score: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModuleWithProgress extends LearningModule {
  is_locked: boolean;
  is_completed: boolean;
  completion_percentage: number;
  progress?: LearnerProgress | null;
}

export interface SourceReference {
  id: string;
  source_type: 'quran' | 'hadith' | 'scholar' | 'scholarly_text';
  citation: string;
  display_text: string;
  translation?: string;
  context?: string;
  source_metadata?: Record<string, any>;
  created_at: string;
}

export interface ModuleDetail extends ModuleWithProgress {
  sources: SourceReference[];
  prerequisite_modules?: ModuleWithProgress[];
}

export class ModuleRepository {
  /**
   * Get all modules with user progress
   */
  static async getAllModules(userId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    try {
      // Get all published modules
      const { data: modules, error: modulesError, count: totalCount } = await supabase
        .from('learning_modules')
        .select('*', { count: 'exact' })
        .not('published_at', 'is', null)
        .order('sequence_number', { ascending: true })
        .range(offset, offset + limit - 1);

      if (modulesError) throw modulesError;

      if (!modules) return { modules: [], total: 0 };

      // Get user's progress for these modules
      const { data: progress, error: progressError } = await supabase
        .from('learner_progress')
        .select('*')
        .eq('user_id', userId)
        .in(
          'module_id',
          modules.map((m) => m.id)
        );

      if (progressError) throw progressError;

      const progressMap = new Map(progress?.map((p) => [p.module_id, p]) || []);

      // Enrich modules with progress data
      const modulesWithProgress: ModuleWithProgress[] = modules.map((module) => ({
        ...module,
        is_completed: !!progressMap.get(module.id)?.completed_at,
        is_locked: !this.arePrerequisitesMet(module.prerequisites, progressMap),
        completion_percentage: progressMap.get(module.id)?.assessment_score || 0,
        progress: progressMap.get(module.id) || null,
      }));

      return {
        modules: modulesWithProgress,
        total: totalCount || 0,
      };
    } catch (error) {
      console.error('Error in getAllModules:', error);
      throw error;
    }
  }

  /**
   * Get module detail with sources
   */
  static async getModuleById(moduleId: string, userId: string): Promise<ModuleDetail | null> {
    try {
      // Get module
      const { data: module, error: moduleError } = await supabase
        .from('learning_modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (moduleError) throw moduleError;
      if (!module) return null;

      // Get user progress for this module
      const { data: progress, error: progressError } = await supabase
        .from('learner_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .maybeSingle();

      if (progressError && progressError.code !== 'PGRST116') throw progressError;

      // Get sources for this module
      const { data: sources, error: sourcesError } = await supabase
        .from('module_sources')
        .select(
          `
          source_references(
            id,
            source_type,
            citation,
            display_text,
            translation,
            context,
            source_metadata
          )
        `
        )
        .eq('module_id', moduleId);

      if (sourcesError) throw sourcesError;

      // Get prerequisite modules
      let prerequisiteModules: ModuleWithProgress[] = [];
      if (module.prerequisites && module.prerequisites.length > 0) {
        const { data: prereqs, error: prereqError } = await supabase
          .from('learning_modules')
          .select('*')
          .in('id', module.prerequisites);

        if (prereqError) throw prereqError;

        // Get progress for prerequisites
        const { data: prereqProgress, error: prereqProgressError } = await supabase
          .from('learner_progress')
          .select('*')
          .eq('user_id', userId)
          .in(
            'module_id',
            (prereqs || []).map((p) => p.id)
          );

        if (prereqProgressError) throw prereqProgressError;

        const prereqProgressMap = new Map(prereqProgress?.map((p) => [p.module_id, p]) || []);

        prerequisiteModules = (prereqs || []).map((p) => ({
          ...p,
          is_completed: !!prereqProgressMap.get(p.id)?.completed_at,
          is_locked: false, // Prerequisites are shown as-is
          completion_percentage: prereqProgressMap.get(p.id)?.assessment_score || 0,
          progress: prereqProgressMap.get(p.id) || null,
        }));
      }

      // Extract sources from the nested response
      const sourceList: SourceReference[] = (sources || [])
        .filter((item: any) => item.source_references)
        .map((item: any) => ({
          ...(item.source_references || {}),
          created_at: new Date().toISOString(),
        } as SourceReference));

      // Build final response
      const sourceIdMap = new Map((progress ? [progress] : []).map((p) => [p.module_id, p]));
      const isCompleted = !!progress?.completed_at;
      const isLocked = !this.arePrerequisitesMet(module.prerequisites, sourceIdMap as Map<string, LearnerProgress>);

      return {
        ...module,
        is_completed: isCompleted,
        is_locked: isLocked,
        completion_percentage: progress?.assessment_score || 0,
        progress: progress || null,
        sources: sourceList,
        prerequisite_modules: prerequisiteModules,
      };
    } catch (error) {
      console.error('Error in getModuleById:', error);
      throw error;
    }
  }

  /**
   * Mark a module as completed
   */
  static async completeModule(
    moduleId: string,
    userId: string,
    assessmentScore?: number
  ): Promise<{
    progress: LearnerProgress;
    nextModule: ModuleWithProgress | null;
    progressSummary: any;
    milestoneUnlocked: any | null;
  }> {
    try {
      // Check prerequisites
      const module = await supabase
        .from('learning_modules')
        .select('prerequisites')
        .eq('id', moduleId)
        .single();

      if (!module.data) throw new Error('Module not found');

      const prerequisitesMet = await this.checkPrerequisitesMet(moduleId, userId);
      if (!prerequisitesMet) {
        throw new Error('Prerequisites not met');
      }

      // Validate assessment score
      if (assessmentScore !== undefined && (assessmentScore < 0 || assessmentScore > 100)) {
        throw new Error('Assessment score must be between 0 and 100');
      }

      // Update or insert progress record
      const now = new Date().toISOString();
      const { data: progress, error: progressError } = await supabase
        .from('learner_progress')
        .upsert(
          {
            user_id: userId,
            module_id: moduleId,
            completed_at: now,
            assessment_score: assessmentScore || null,
            updated_at: now,
          },
          {
            onConflict: 'user_id,module_id',
          }
        )
        .select()
        .single();

      if (progressError) throw progressError;
      if (!progress) throw new Error('Failed to update progress');

      // Get next module
      const module_seq = await supabase
        .from('learning_modules')
        .select('sequence_number')
        .eq('id', moduleId)
        .single();

      let nextModule: ModuleWithProgress | null = null;
      if (module_seq.data) {
        const { data: nextMod } = await supabase
          .from('learning_modules')
          .select('*')
          .gt('sequence_number', module_seq.data.sequence_number)
          .not('published_at', 'is', null)
          .order('sequence_number', { ascending: true })
          .limit(1)
          .single();

        if (nextMod) {
          nextModule = {
            ...nextMod,
            is_completed: false,
            is_locked: false,
            completion_percentage: 0,
            progress: null,
          };
        }
      }

      // Get progress summary
      const progressSummary = await this.getUserProgress(userId);

      // Check for milestone achievements
      const milestoneUnlocked = await this.checkMilestoneAchievement(userId, progressSummary);

      return {
        progress,
        nextModule,
        progressSummary,
        milestoneUnlocked,
      };
    } catch (error) {
      console.error('Error in completeModule:', error);
      throw error;
    }
  }

  /**
   * Get user's learning progress summary
   */
  static async getUserProgress(userId: string) {
    try {
      // Get completed modules count
      const { count: completedCount } = await supabase
        .from('learner_progress')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .not('completed_at', 'is', null);

      // Get total published modules
      const { count: totalCount } = await supabase
        .from('learning_modules')
        .select('id', { count: 'exact' })
        .not('published_at', 'is', null);

      const completedModules = completedCount || 0;
      const totalModules = totalCount || 0;
      const completionPercentage =
        totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

      // Get time spent
      const { data: timeData } = await supabase
        .from('learner_progress')
        .select('time_spent_minutes')
        .eq('user_id', userId)
        .not('completed_at', 'is', null);

      const totalTimeSpent = (timeData || []).reduce((sum, row) => sum + (row.time_spent_minutes || 0), 0);

      // Get milestones achieved
      const { data: milestonesData } = await supabase
        .from('learner_milestones')
        .select('learning_milestones(id, name, description)')
        .eq('user_id', userId);

      return {
        modules_completed: completedModules,
        total_modules: totalModules,
        completion_percentage: completionPercentage,
        time_spent_minutes: totalTimeSpent,
        milestones: milestonesData || [],
      };
    } catch (error) {
      console.error('Error in getUserProgress:', error);
      throw error;
    }
  }

  /**
   * Check if prerequisites for a module are met
   */
  static async checkPrerequisitesMet(moduleId: string, userId: string): Promise<boolean> {
    try {
      const { data: module, error: moduleError } = await supabase
        .from('learning_modules')
        .select('prerequisites')
        .eq('id', moduleId)
        .single();

      if (moduleError) throw moduleError;
      if (!module || !module.prerequisites || module.prerequisites.length === 0) {
        return true;
      }

      const { count, error: countError } = await supabase
        .from('learner_progress')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .in('module_id', module.prerequisites)
        .not('completed_at', 'is', null);

      if (countError) throw countError;

      return (count || 0) === module.prerequisites.length;
    } catch (error) {
      console.error('Error in checkPrerequisitesMet:', error);
      throw error;
    }
  }

  /**
   * Private helper: Check if prerequisites are met using progress map
   */
  private static arePrerequisitesMet(
    prerequisites: string[] | null | undefined,
    progressMap: Map<string, LearnerProgress>
  ): boolean {
    if (!prerequisites || prerequisites.length === 0) return true;
    return prerequisites.every((moduleId) => {
      const progress = progressMap.get(moduleId);
      return progress?.completed_at !== null && progress?.completed_at !== undefined;
    });
  }

  /**
   * Check if user achieved a milestone
   */
  private static async checkMilestoneAchievement(userId: string, progressSummary: any) {
    try {
      // Define milestone thresholds
      const milestones = [
        { threshold: 5, name: 'Beginner Level', description: '5 modules completed' },
        { threshold: 10, name: 'Intermediate Level', description: '10 modules completed' },
        { threshold: 15, name: 'Advanced Level', description: '15 modules completed' },
        { threshold: 20, name: 'Master', description: 'All 20 modules completed' },
      ];

      const completed = progressSummary.modules_completed;

      for (const milestone of milestones) {
        if (completed >= milestone.threshold) {
          // Check if user already has this milestone
          const { data: existing } = await supabase
            .from('learning_milestones')
            .select('id')
            .eq('user_id', userId)
            .ilike('learning_milestones.name', milestone.name)
            .single();

          if (!existing) {
            // Create milestone for this user
            const { data: milestoneData, error: milestoneError } = await supabase
              .from('learning_milestones')
              .select('id')
              .ilike('name', milestone.name)
              .single();

            if (milestoneError && milestoneError.code !== 'PGRST116') throw milestoneError;

            if (milestoneData) {
              const { error: insertError } = await supabase
                .from('learner_milestones')
                .insert({
                  user_id: userId,
                  milestone_id: milestoneData.id,
                });

              if (!insertError) {
                return {
                  name: milestone.name,
                  description: milestone.description,
                };
              }
            }
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error in checkMilestoneAchievement:', error);
      return null;
    }
  }
}
