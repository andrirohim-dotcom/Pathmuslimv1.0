'use client';

import React from 'react';
import Link from 'next/link';
import { LockIcon, CheckCircleIcon } from 'lucide-react';

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

interface ModuleListProps {
  modules: Module[];
  prerequisiteTitles?: Record<string, string>;
}

export function ModuleList({ modules, prerequisiteTitles = {} }: ModuleListProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelLabel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div className="space-y-4">
      {modules.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No modules available yet.</p>
        </div>
      ) : (
        modules.map((module) => (
          <Link key={module.id} href={`/learning/modules/${module.id}`}>
            <div
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                module.is_locked
                  ? 'border-gray-300 bg-gray-50 opacity-60'
                  : 'border-blue-200 bg-white hover:border-blue-400'
              }`}
            >
              <div className="flex items-start justify-between">
                {/* Left: Module info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Lock or Checkmark */}
                    {module.is_locked ? (
                      <LockIcon className="w-5 h-5 text-gray-400" />
                    ) : module.is_completed ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : null}

                    {/* Module number and title */}
                    <h3 className="text-lg font-semibold text-gray-800">
                      Module {module.sequence_number}: {module.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>

                  {/* Level badge and time */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(module.level)}`}>
                      {getLevelLabel(module.level)}
                    </span>
                    <span className="text-xs text-gray-500">⏱️ {module.estimated_hours}h</span>

                    {module.prerequisites && module.prerequisites.length > 0 && (
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        📋 Prerequisites
                      </span>
                    )}
                  </div>

                  {/* Prerequisites tooltip */}
                  {module.prerequisites && module.prerequisites.length > 0 && (
                    <div className="mt-2 p-2 bg-amber-50 rounded text-xs text-amber-700">
                      <p className="font-semibold mb-1">Requires:</p>
                      <ul className="list-disc list-inside">
                        {module.prerequisites.map((prereqId) => (
                          <li key={prereqId}>
                            {prerequisiteTitles[prereqId] || `Module ${prereqId.slice(0, 4)}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right: Completion status */}
                <div className="ml-4 text-right">
                  {module.is_completed && (
                    <div className="text-center">
                      <p className="text-2xl mb-1">✅</p>
                      <p className="text-xs font-semibold text-green-600">Completed</p>
                    </div>
                  )}
                  {module.is_locked && (
                    <div className="text-center">
                      <p className="text-2xl mb-1">🔒</p>
                      <p className="text-xs font-semibold text-gray-500">Locked</p>
                    </div>
                  )}
                  {!module.is_completed && !module.is_locked && (
                    <div className="text-center">
                      <p className="text-2xl mb-1">▶️</p>
                      <p className="text-xs font-semibold text-blue-600">Start</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
