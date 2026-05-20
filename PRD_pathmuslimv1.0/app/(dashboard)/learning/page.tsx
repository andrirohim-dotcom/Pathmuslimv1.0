'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProgressDashboard } from '@/components/learning/ProgressDashboard';
import { ModuleList } from '@/components/learning/ModuleList';

interface Module {
  id: string;
  title: string;
  description: string;
  sequence_number: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  is_locked: boolean;
  is_completed: boolean;
  completion_percentage: number;
  prerequisites: string[];
}

interface ProgressData {
  modules_completed: number;
  total_modules: number;
  completion_percentage: number;
  time_spent_minutes: number;
  milestones: any[];
}

export default function LearningPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules'>('overview');

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers = {
          'Authorization': `Bearer ${token || 'mock-token'}`,
          'x-user-id': userId || 'mock-user-id',
          'Content-Type': 'application/json',
        };

        // Fetch modules
        const modulesRes = await fetch('/api/learning/modules', { headers });
        if (!modulesRes.ok) {
          throw new Error(`Failed to fetch modules: ${modulesRes.status}`);
        }
        const modulesData = await modulesRes.json();
        setModules(modulesData.data || []);

        // Fetch progress
        const progressRes = await fetch('/api/learning/progress', { headers });
        if (!progressRes.ok) {
          throw new Error(`Failed to fetch progress: ${progressRes.status}`);
        }
        const progressData = await progressRes.json();
        setProgress(progressData.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(message);
        console.error('Error fetching learning data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token || userId) {
      fetchData();
    }
  }, [token, userId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">
            {error}. Please make sure you're logged in and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Islamic Learning Journey</h1>
        <p className="text-gray-600">
          Welcome to your personalized learning path. Start with the basics and progress at your own pace.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('modules')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'modules'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          📚 Modules
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && progress && <ProgressDashboard progress={progress} />}

      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Available Modules ({modules.length})
            </h2>
            <ModuleList modules={modules} />
          </div>
        </div>
      )}

      {/* Quick CTA */}
      {modules.length > 0 && modules.some((m) => !m.is_locked && !m.is_completed) && (
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Ready to continue learning?</h3>
          <p className="mb-4 opacity-90">
            Start with the next available module and expand your Islamic knowledge.
          </p>
          <Link
            href={`/learning/modules/${modules.find((m) => !m.is_locked && !m.is_completed)?.id}`}
            className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Learning →
          </Link>
        </div>
      )}
    </div>
  );
}
