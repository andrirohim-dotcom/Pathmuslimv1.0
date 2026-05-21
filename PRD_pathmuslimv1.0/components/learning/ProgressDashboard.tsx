'use client';

import React, { useEffect, useState } from 'react';
import { ModuleService } from '@/lib/services/ModuleService';
import { MilestonesDisplay } from '@/components/learning/MilestonesDisplay';

interface AchievedMilestone {
  id: string;
  name: string;
  description: string;
  trigger_condition: { type: string; count?: number };
  achievement_at: string;
}

interface NextMilestone {
  name: string;
  description: string;
  trigger_condition: { type: string; count?: number };
  modules_remaining: number;
}

interface ProgressData {
  modules_completed: number;
  total_modules: number;
  completion_percentage: number;
  time_spent_minutes: number;
  milestones: any[];
}

interface MilestoneData {
  achieved: AchievedMilestone[];
  next: NextMilestone | null;
}

interface ProgressDashboardProps {
  progress: ProgressData;
}

export function ProgressDashboard({ progress }: ProgressDashboardProps) {
  const [displayData, setDisplayData] = useState<any>(null);
  const [milestoneInfo, setMilestoneInfo] = useState<any>(null);
  const [milestoneData, setMilestoneData] = useState<MilestoneData | null>(null);

  useEffect(() => {
    const data = ModuleService.formatProgressDisplay(
      progress.modules_completed,
      progress.total_modules,
      progress.time_spent_minutes
    );
    setDisplayData(data);

    // Check if we just hit a milestone
    const milestone = ModuleService.getMilestoneInfo(progress.modules_completed);
    if (milestone) {
      setMilestoneInfo(milestone);
    }

    // Fetch milestone data
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
    fetch('/api/learning/milestones', {
      headers: {
        'Authorization': `Bearer ${token || 'mock-token'}`,
        'x-user-id': userId || 'mock-user-id',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setMilestoneData(res.data);
      })
      .catch(() => null);
  }, [progress]);

  if (!displayData) return <div>Loading progress...</div>;

  const progressBarWidth = Math.round((progress.modules_completed / progress.total_modules) * 100);
  const { current, modulesUntilNext } =
    ModuleService.evaluateMilestoneAchievements(progress.modules_completed);

  return (
    <div className="space-y-6">
      {/* Main Progress Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Your Learning Progress</h2>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-blue-600">{displayData.percentageDisplay}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressBarWidth}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded">
            <p className="text-3xl font-bold text-blue-600">{progress.modules_completed}</p>
            <p className="text-sm text-gray-600">Modules Completed</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <p className="text-3xl font-bold text-green-600">{progress.total_modules}</p>
            <p className="text-sm text-gray-600">Total Modules</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded">
            <p className="text-3xl font-bold text-purple-600">
              {Math.floor(progress.time_spent_minutes / 60)}h
            </p>
            <p className="text-sm text-gray-600">Time Invested</p>
          </div>
        </div>
      </div>

      {/* Current Level */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Current Level</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-800">{current}</span>
          <span className="text-4xl">🎓</span>
        </div>
        <p className="text-gray-600 mb-4">
          {modulesUntilNext > 0
            ? `Complete ${modulesUntilNext} more module${modulesUntilNext !== 1 ? 's' : ''} to reach the next level`
            : 'You have reached the highest level!'}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{
              width: `${Math.round(
                ((progress.modules_completed % 5 || 5) / 5) * 100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Recent Completions */}
      {progress.milestones && progress.milestones.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">🏆 Achievements</h3>
          <div className="space-y-2">
            {progress.milestones.map((milestone: any, idx: number) => (
              <div key={idx} className="flex items-center p-3 bg-yellow-50 rounded">
                <span className="text-2xl mr-3">⭐</span>
                <div>
                  <p className="font-semibold text-gray-800">
                    {milestone.learning_milestones?.name || 'Milestone Achieved'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {milestone.learning_milestones?.description || 'Great progress!'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestone Celebration */}
      {milestoneInfo && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg shadow p-6 border-2 border-yellow-300">
          <p className="text-5xl text-center mb-3">{milestoneInfo.emoji}</p>
          <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
            {milestoneInfo.name}
          </h3>
          <p className="text-center text-gray-700">{milestoneInfo.description}</p>
        </div>
      )}

      {/* Milestones section */}
      {milestoneData && (
        <MilestonesDisplay achieved={milestoneData.achieved} next={milestoneData.next} />
      )}
    </div>
  );
}
