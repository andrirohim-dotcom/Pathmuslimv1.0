'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, BarChart2Icon } from 'lucide-react';
import { ProgressDashboard } from '@/components/learning/ProgressDashboard';
import { MilestonesDisplay } from '@/components/learning/MilestonesDisplay';

interface ProgressData {
  modules_completed: number;
  total_modules: number;
  completion_percentage: number;
  time_spent_minutes: number;
  milestones: any[];
}

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

interface MilestoneData {
  achieved: AchievedMilestone[];
  next: NextMilestone | null;
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [milestoneData, setMilestoneData] = useState<MilestoneData | null>(null);
  const [nextModuleId, setNextModuleId] = useState<string | null>(null);
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

    const fetchAll = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        const [progressRes, milestonesRes, modulesRes] = await Promise.all([
          fetch('/api/learning/progress', { headers }),
          fetch('/api/learning/milestones', { headers }),
          fetch('/api/learning/modules?limit=100', { headers }),
        ]);

        if (!progressRes.ok) throw new Error('Failed to fetch progress');

        const progressJson = await progressRes.json();
        setProgress(progressJson.data);

        if (milestonesRes.ok) {
          const milestonesJson = await milestonesRes.json();
          setMilestoneData(milestonesJson.data);
        }

        if (modulesRes.ok) {
          const modulesJson = await modulesRes.json();
          const modules: any[] = modulesJson.data || [];
          const next = modules.find((m) => !m.is_locked && !m.is_completed);
          if (next) setNextModuleId(next.id);
        }
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !progress) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/learning" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Learning
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{fetchError || 'No progress data found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/learning" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Learning
        </Link>
        <Link
          href="/learning/statistics"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          <BarChart2Icon className="w-4 h-4" />
          View Statistics
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Progress</h1>

      {/* Progress dashboard (handles its own milestone fetch too) */}
      <ProgressDashboard progress={progress} />

      {/* Milestones */}
      {milestoneData && (
        <div className="mt-6">
          <MilestonesDisplay achieved={milestoneData.achieved} next={milestoneData.next} />
        </div>
      )}

      {/* Continue learning CTA */}
      {nextModuleId && (
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Ready to continue?</h3>
          <p className="mb-4 opacity-90 text-sm">Pick up where you left off.</p>
          <Link
            href={`/learning/modules/${nextModuleId}`}
            className="inline-block bg-white text-blue-600 font-bold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            Continue Learning →
          </Link>
        </div>
      )}
    </div>
  );
}
