/**
 * MilestoneService
 * Business logic for milestone achievement tracking
 */

import { createClient } from '@supabase/supabase-js';
import { LearningMilestone, LearnerMilestone } from '@/lib/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AchievedMilestone {
  milestone: LearningMilestone;
  achievement_at: string;
}

export interface NextMilestoneProgress {
  milestone: LearningMilestone;
  modules_remaining: number;
}

export interface UserMilestonesResult {
  achieved: AchievedMilestone[];
  next: NextMilestoneProgress | null;
}

// Milestone thresholds (matches seed data in learning_milestones table)
const MILESTONE_NAMES = [
  'Beginner Achiever',
  'Intermediate Learner',
  'Advanced Student',
  'Islamic Scholar Apprentice',
];

export class MilestoneService {
  /**
   * After module completion, check if any milestone thresholds were crossed.
   * Returns newly awarded milestones (empty array if none).
   */
  static async checkAndAwardMilestones(userId: string): Promise<LearningMilestone[]> {
    try {
      // Get count of completed modules for this user
      const { count: completedCount } = await supabase
        .from('learner_progress')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .not('completed_at', 'is', null);

      const completedModules = completedCount ?? 0;

      // Get all milestone definitions
      const { data: allMilestones, error: milestonesError } = await supabase
        .from('learning_milestones')
        .select('*')
        .order('created_at', { ascending: true });

      if (milestonesError) throw milestonesError;
      if (!allMilestones || allMilestones.length === 0) return [];

      // Get milestones already achieved by this user
      const { data: alreadyAchieved, error: achievedError } = await supabase
        .from('learner_milestones')
        .select('milestone_id')
        .eq('user_id', userId);

      if (achievedError) throw achievedError;

      const achievedIds = new Set((alreadyAchieved || []).map((a: LearnerMilestone) => a.milestone_id));

      // Find milestones whose threshold is now crossed and not yet awarded
      const newlyEarned: LearningMilestone[] = [];

      for (const milestone of allMilestones as LearningMilestone[]) {
        if (achievedIds.has(milestone.id)) continue;

        const condition = milestone.trigger_condition;
        if (condition.type === 'module_count' && condition.count !== undefined) {
          if (completedModules >= condition.count) {
            // Award the milestone
            const { error: insertError } = await supabase
              .from('learner_milestones')
              .insert({
                user_id: userId,
                milestone_id: milestone.id,
                achievement_at: new Date().toISOString(),
              });

            if (!insertError) {
              newlyEarned.push(milestone);
            }
          }
        }
      }

      return newlyEarned;
    } catch (err) {
      console.error('MilestoneService.checkAndAwardMilestones error:', err);
      return [];
    }
  }

  /**
   * Get user's full milestone progress: achieved milestones + next upcoming milestone.
   */
  static async getUserMilestones(userId: string): Promise<UserMilestonesResult> {
    try {
      // Get count of completed modules
      const { count: completedCount } = await supabase
        .from('learner_progress')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .not('completed_at', 'is', null);

      const completedModules = completedCount ?? 0;

      // Get all milestone definitions
      const { data: allMilestones, error: milestonesError } = await supabase
        .from('learning_milestones')
        .select('*')
        .order('created_at', { ascending: true });

      if (milestonesError) throw milestonesError;

      const milestones = (allMilestones || []) as LearningMilestone[];

      // Get milestones achieved by the user (with timestamps)
      const { data: achievedRows, error: achievedError } = await supabase
        .from('learner_milestones')
        .select('milestone_id, achievement_at')
        .eq('user_id', userId);

      if (achievedError) throw achievedError;

      const achievedMap = new Map(
        (achievedRows || []).map((a: { milestone_id: string; achievement_at: string }) => [
          a.milestone_id,
          a.achievement_at,
        ])
      );

      const achieved: AchievedMilestone[] = milestones
        .filter((m) => achievedMap.has(m.id))
        .map((m) => ({
          milestone: m,
          achievement_at: achievedMap.get(m.id)!,
        }));

      // Find the next unachieved milestone
      const unachieved = milestones.filter((m) => !achievedMap.has(m.id));
      let next: NextMilestoneProgress | null = null;

      for (const milestone of unachieved) {
        const condition = milestone.trigger_condition;
        if (condition.type === 'module_count' && condition.count !== undefined) {
          const remaining = Math.max(0, condition.count - completedModules);
          next = { milestone, modules_remaining: remaining };
          break;
        }
      }

      return { achieved, next };
    } catch (err) {
      console.error('MilestoneService.getUserMilestones error:', err);
      return { achieved: [], next: null };
    }
  }

  /**
   * Get the names of all defined milestones in order.
   * Used for display without a DB call.
   */
  static getMilestoneNames(): string[] {
    return MILESTONE_NAMES;
  }
}
