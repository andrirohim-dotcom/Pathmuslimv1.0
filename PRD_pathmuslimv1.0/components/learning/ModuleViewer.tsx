'use client';

import React from 'react';
import { ClockIcon, BookOpenIcon, CheckIcon } from 'lucide-react';
import { SourceReference } from '@/components/learning/SourceReference';

interface Source {
  id: string;
  source_type: 'quran' | 'hadith' | 'scholar' | 'scholarly_text';
  citation: string;
  display_text: string;
  translation?: string;
  context?: string;
  source_metadata?: Record<string, any>;
}

interface ModuleViewerProps {
  id: string;
  title: string;
  description: string;
  estimated_hours: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  learning_objectives: string[];
  content: string;
  sources: Source[];
  is_completed: boolean;
  is_locked: boolean;
  onComplete: (moduleId: string, score?: number) => void;
  isCompleting?: boolean;
}

export function ModuleViewer({
  id,
  title,
  description,
  estimated_hours,
  level,
  learning_objectives,
  content,
  sources,
  is_completed,
  is_locked,
  onComplete,
  isCompleting = false,
}: ModuleViewerProps) {
  const [showCompleteDialog, setShowCompleteDialog] = React.useState(false);
  const [score, setScore] = React.useState<number | undefined>();

  const handleComplete = () => {
    onComplete(id, score);
    setShowCompleteDialog(false);
    setScore(undefined);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-blue-600 bg-blue-50';
      case 'advanced':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (is_locked) {
    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-8 text-center">
        <p className="text-4xl mb-3">🔒</p>
        <h3 className="text-xl font-bold text-red-800 mb-2">Module Locked</h3>
        <p className="text-red-700">
          Please complete the prerequisites before accessing this module.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg p-6 ${getLevelColor(level)}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-lg opacity-90">{description}</p>
          </div>
          {is_completed && (
            <div className="text-center">
              <p className="text-5xl mb-2">✅</p>
              <p className="font-semibold">Completed</p>
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{estimated_hours} hours</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpenIcon className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">{level} Level</span>
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Learning Objectives</h2>
        <ul className="space-y-2">
          {learning_objectives.map((objective, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{objective}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Content</h2>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          {content.split('\n').map((paragraph, idx) => {
            if (paragraph.startsWith('#')) {
              const level = paragraph.match(/^#+/)?.[0].length || 2;
              const text = paragraph.replace(/^#+\s?/, '');
              const HeadingTag =
                level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4';
              return (
                <HeadingTag
                  key={idx}
                  className={`font-bold mt-4 mb-2 ${
                    level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg'
                  }`}
                >
                  {text}
                </HeadingTag>
              );
            }
            if (paragraph.startsWith('-')) {
              return (
                <li key={idx} className="ml-4">
                  {paragraph.replace(/^-\s?/, '')}
                </li>
              );
            }
            if (paragraph.trim().length > 0) {
              return <p key={idx}>{paragraph}</p>;
            }
            return null;
          })}
        </div>
      </div>

      {/* Sources */}
      {sources.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Sources & References</h2>
          <div className="space-y-4">
            {sources.map((source) => (
              <SourceReference key={source.id} source={source} />
            ))}
          </div>
        </div>
      )}

      {/* Completion Button */}
      {!is_completed && (
        <div className="flex gap-3">
          <button
            onClick={() => setShowCompleteDialog(true)}
            disabled={isCompleting}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCompleting ? 'Completing...' : 'Mark as Complete'}
          </button>
        </div>
      )}

      {/* Complete Dialog */}
      {showCompleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Complete Module</h3>
            <p className="text-gray-600 mb-4">
              You're about to mark <strong>{title}</strong> as complete!
            </p>

            {/* Optional score input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Score (Optional, 0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={score ?? ''}
                onChange={(e) => setScore(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Enter score..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteDialog(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCompleting ? 'Completing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
