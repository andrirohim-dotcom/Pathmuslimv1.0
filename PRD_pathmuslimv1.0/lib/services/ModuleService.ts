/**
 * ModuleService
 * Business logic and helper functions for learning modules
 */

import { ModuleRepository } from '@/lib/repositories/ModuleRepository';

export class ModuleService {
  /**
   * Check if prerequisites are met for a module
   */
  static async checkPrerequisitesMet(moduleId: string, userId: string): Promise<boolean> {
    return ModuleRepository.checkPrerequisitesMet(moduleId, userId);
  }

  /**
   * Calculate overall progress percentage
   */
  static calculateProgressPercentage(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  /**
   * Evaluate milestone achievements for a user
   */
  static evaluateMilestoneAchievements(
    completedModules: number
  ): {
    current: string;
    nextThreshold: number;
    modulesUntilNext: number;
  } {
    const thresholds = [
      { name: 'Beginner', count: 5 },
      { name: 'Intermediate', count: 10 },
      { name: 'Advanced', count: 15 },
      { name: 'Master', count: 20 },
    ];

    let currentLevel = 'Novice';
    let nextThreshold = 5;

    for (const threshold of thresholds) {
      if (completedModules >= threshold.count) {
        currentLevel = threshold.name;
        nextThreshold = threshold.count;
      }
    }

    // Find next milestone
    let nextMilestone = 5;
    for (const threshold of thresholds) {
      if (completedModules < threshold.count) {
        nextMilestone = threshold.count;
        break;
      }
    }

    const modulesUntilNext = Math.max(0, nextMilestone - completedModules);

    return {
      current: currentLevel,
      nextThreshold: nextMilestone,
      modulesUntilNext,
    };
  }

  /**
   * Get next recommended module for a user
   */
  static async getNextRecommendedModule(userId: string) {
    try {
      const { modules } = await ModuleRepository.getAllModules(userId, 1, 100);

      // Find first unlocked and incomplete module
      const nextModule = modules.find((m) => !m.is_locked && !m.is_completed);

      return nextModule || null;
    } catch (error) {
      console.error('Error in getNextRecommendedModule:', error);
      return null;
    }
  }

  /**
   * Get milestone information
   */
  static getMilestoneInfo(modulesCompleted: number) {
    const milestones = [
      {
        threshold: 5,
        name: 'Beginner Level',
        description: 'You have completed your first 5 modules!',
        emoji: '🌱',
      },
      {
        threshold: 10,
        name: 'Intermediate Level',
        description: 'You have progressed to an intermediate level!',
        emoji: '🌿',
      },
      {
        threshold: 15,
        name: 'Advanced Level',
        description: 'You have reached the advanced level!',
        emoji: '🌳',
      },
      {
        threshold: 20,
        name: 'Master',
        description: 'Congratulations! You have completed all modules!',
        emoji: '👑',
      },
    ];

    return milestones.find((m) => m.threshold === modulesCompleted) || null;
  }

  /**
   * Format progress data for display
   */
  static formatProgressDisplay(
    completed: number,
    total: number,
    timeSpent: number
  ): {
    percentageDisplay: string;
    moduleDisplay: string;
    timeDisplay: string;
    status: 'just_started' | 'making_progress' | 'advanced' | 'completed';
  } {
    const percentage = this.calculateProgressPercentage(completed, total);
    const percentageDisplay = `${percentage}%`;
    const moduleDisplay = `${completed} of ${total}`;

    let timeDisplay = '';
    if (timeSpent === 0) {
      timeDisplay = 'No time logged yet';
    } else if (timeSpent < 60) {
      timeDisplay = `${timeSpent} minutes`;
    } else {
      const hours = Math.floor(timeSpent / 60);
      const minutes = timeSpent % 60;
      timeDisplay = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }

    let status: 'just_started' | 'making_progress' | 'advanced' | 'completed' = 'just_started';
    if (completed === total && total > 0) {
      status = 'completed';
    } else if (percentage >= 75) {
      status = 'advanced';
    } else if (percentage > 0) {
      status = 'making_progress';
    }

    return {
      percentageDisplay,
      moduleDisplay,
      timeDisplay,
      status,
    };
  }

  /**
   * Get learning streak information
   */
  static getLearningStreak(completedModules: number[]): number {
    // Simple implementation: count consecutive completed modules
    // In production, this would analyze completion dates
    if (completedModules.length === 0) return 0;

    let streak = 1;
    for (let i = 1; i < completedModules.length; i++) {
      if (completedModules[i] === completedModules[i - 1] + 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
}
