'use client';

import React from 'react';

interface MilestoneDefinition {
  id?: string;
  name: string;
  description: string;
  trigger_condition: {
    type: string;
    count?: number;
  };
  achievement_at?: string;
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

interface MilestonesDisplayProps {
  achieved: AchievedMilestone[];
  next: NextMilestone | null;
}

// All 4 milestones in order — matches seed data
const ALL_MILESTONES: { name: string; description: string; count: number; icon: string }[] = [
  {
    name: 'Beginner Achiever',
    description: 'Completed your first 5 modules — the journey begins!',
    count: 5,
    icon: '🌱',
  },
  {
    name: 'Intermediate Learner',
    description: 'Reached 10 modules — your knowledge is growing.',
    count: 10,
    icon: '📖',
  },
  {
    name: 'Advanced Student',
    description: 'Completed 15 modules — dedicated and disciplined.',
    count: 15,
    icon: '🎓',
  },
  {
    name: 'Islamic Scholar Apprentice',
    description: 'All 20 modules complete — a true commitment to learning.',
    count: 20,
    icon: '🌟',
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function MilestonesDisplay({ achieved, next }: MilestonesDisplayProps) {
  const achievedNames = new Set(achieved.map((a) => a.name));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-1">Milestones</h3>
      {next && (
        <p className="text-sm text-blue-600 mb-5">
          {next.modules_remaining} more module{next.modules_remaining !== 1 ? 's' : ''} to reach{' '}
          <span className="font-semibold">{next.name}</span>
        </p>
      )}
      {!next && achieved.length === ALL_MILESTONES.length && (
        <p className="text-sm text-green-600 mb-5 font-semibold">
          All milestones achieved — MashaAllah!
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ALL_MILESTONES.map((def) => {
          const achievedItem = achieved.find((a) => a.name === def.name);
          const isAchieved = achievedNames.has(def.name);
          const isNext = next?.name === def.name;

          return (
            <div
              key={def.name}
              className={`relative rounded-lg border-2 p-4 transition-all ${
                isAchieved
                  ? 'border-green-400 bg-green-50'
                  : isNext
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              {/* Achieved checkmark */}
              {isAchieved && (
                <span className="absolute top-3 right-3 text-green-500 text-lg">✓</span>
              )}

              <div className="flex items-start gap-3">
                <span className={`text-3xl ${!isAchieved ? 'grayscale opacity-50' : ''}`}>
                  {def.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isAchieved ? 'text-green-800' : 'text-gray-700'}`}>
                    {def.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{def.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {def.count} modules
                  </p>
                  {isAchieved && achievedItem && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      Achieved {formatDate(achievedItem.achievement_at)}
                    </p>
                  )}
                  {!isAchieved && isNext && next && (
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      {next.modules_remaining} module{next.modules_remaining !== 1 ? 's' : ''} remaining
                    </p>
                  )}
                  {!isAchieved && !isNext && (
                    <p className="text-xs text-gray-400 mt-1">Locked</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
