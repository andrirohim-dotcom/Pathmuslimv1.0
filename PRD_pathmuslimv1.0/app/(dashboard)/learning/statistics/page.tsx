'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';

interface ProgressData {
  modules_completed: number;
  total_modules: number;
  completion_percentage: number;
  time_spent_minutes: number;
  milestones: any[];
}

interface LevelBreakdown {
  beginner: number;
  intermediate: number;
  advanced: number;
}

interface Stats {
  totalCompleted: number;
  totalModules: number;
  completionPercentage: number;
  daysLearning: number;
  totalTimeMinutes: number;
  averageScore: number | null;
  streak: number;
  byLevel: LevelBreakdown;
}

function formatTime(minutes: number): string {
  if (minutes === 0) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

    const headers = {
      'Authorization': `Bearer ${token || 'mock-token'}`,
      'x-user-id': userId || 'mock-user-id',
      'Content-Type': 'application/json',
    };

    const fetchStats = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        // Fetch progress summary and module details in parallel
        const [progressRes, modulesRes] = await Promise.all([
          fetch('/api/learning/progress', { headers }),
          fetch('/api/learning/modules?limit=100', { headers }),
        ]);

        if (!progressRes.ok) throw new Error('Failed to fetch progress');

        const progressJson = await progressRes.json();
        const progress: ProgressData = progressJson.data;

        // Calculate days learning from first completion date (approximation)
        const createdAt = localStorage.getItem('user_created_at');
        const startDate = createdAt ? new Date(createdAt) : new Date();
        const today = new Date();
        const daysLearning = Math.max(
          1,
          Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        );

        // Level breakdown from modules list
        let byLevel: LevelBreakdown = { beginner: 0, intermediate: 0, advanced: 0 };
        let averageScore: number | null = null;

        if (modulesRes.ok) {
          const modulesJson = await modulesRes.json();
          const modules: any[] = modulesJson.data || [];
          const completedModules = modules.filter((m) => m.is_completed);

          completedModules.forEach((m) => {
            if (m.level === 'beginner') byLevel.beginner++;
            else if (m.level === 'intermediate') byLevel.intermediate++;
            else if (m.level === 'advanced') byLevel.advanced++;
          });

          const scores = completedModules
            .map((m) => m.progress?.assessment_score)
            .filter((s): s is number => typeof s === 'number');
          if (scores.length > 0) {
            averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          }
        }

        // Simple streak: days with at least one completion (approximation using total days / completed modules)
        const streak = Math.min(progress.modules_completed, daysLearning);

        setStats({
          totalCompleted: progress.modules_completed,
          totalModules: progress.total_modules,
          completionPercentage: progress.completion_percentage,
          daysLearning,
          totalTimeMinutes: progress.time_spent_minutes,
          averageScore,
          streak,
          byLevel,
        });
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !stats) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/learning/progress" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Progress
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{fetchError || 'No data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/learning/progress" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
        <ChevronLeftIcon className="w-5 h-5" />
        Back to Progress
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning Statistics</h1>
      <p className="text-gray-500 mb-8">A summary of your Islamic learning journey.</p>

      {/* Key stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.totalCompleted}</p>
          <p className="text-xs text-gray-500 mt-1">of {stats.totalModules} modules</p>
          <p className="text-sm font-medium text-gray-700">Completed</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.daysLearning}</p>
          <p className="text-xs text-gray-500 mt-1">since you started</p>
          <p className="text-sm font-medium text-gray-700">Days Learning</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{formatTime(stats.totalTimeMinutes)}</p>
          <p className="text-xs text-gray-500 mt-1">logged study time</p>
          <p className="text-sm font-medium text-gray-700">Invested</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{stats.streak}</p>
          <p className="text-xs text-gray-500 mt-1">day streak</p>
          <p className="text-sm font-medium text-gray-700">Streak</p>
        </div>
      </div>

      {/* Completion bar */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700">Overall Completion</span>
          <span className="font-bold text-blue-600">{stats.completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-700"
            style={{ width: `${stats.completionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {stats.totalModules - stats.totalCompleted} module{stats.totalModules - stats.totalCompleted !== 1 ? 's' : ''} remaining
        </p>
      </div>

      {/* Average score */}
      {stats.averageScore !== null && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Average Assessment Score</h3>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-gray-800">{stats.averageScore}</span>
            <span className="text-gray-400 text-2xl">/100</span>
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full ${
                  stats.averageScore >= 80
                    ? 'bg-green-500'
                    : stats.averageScore >= 60
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                }`}
                style={{ width: `${stats.averageScore}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modules by level */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Modules by Level</h3>
        <div className="space-y-3">
          {(
            [
              { label: 'Beginner', count: stats.byLevel.beginner, color: 'bg-green-400', total: 7 },
              { label: 'Intermediate', count: stats.byLevel.intermediate, color: 'bg-blue-400', total: 7 },
              { label: 'Advanced', count: stats.byLevel.advanced, color: 'bg-purple-400', total: 6 },
            ] as const
          ).map((level) => (
            <div key={level.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 font-medium">{level.label}</span>
                <span className="text-gray-500">
                  {level.count} / {level.total}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`${level.color} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.round((level.count / level.total) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
