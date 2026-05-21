'use client';

import React, { useEffect, useRef } from 'react';

interface MilestoneCelebrationProps {
  milestoneName: string;
  milestoneDescription: string;
  onDismiss: () => void;
}

/**
 * Milestone Celebration modal.
 * Auto-dismisses after 5 seconds. No heavy animation libraries — CSS only.
 */
export function MilestoneCelebration({
  milestoneName,
  milestoneDescription,
  onDismiss,
}: MilestoneCelebrationProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(onDismiss, 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onDismiss]);

  return (
    <>
      {/* CSS-only confetti dots */}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes celebrationPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .confetti-dot {
          position: fixed;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: confettiFall linear forwards;
          pointer-events: none;
        }
        .celebration-card {
          animation: celebrationPulse 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Confetti dots */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="confetti-dot"
          style={{
            left: `${(i * 5.5) + 2}%`,
            top: 0,
            backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'][i % 5],
            animationDuration: `${2.5 + (i % 4) * 0.5}s`,
            animationDelay: `${(i % 6) * 0.15}s`,
          }}
        />
      ))}

      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
        onClick={onDismiss}
        role="dialog"
        aria-modal="true"
        aria-label="Milestone achieved"
      >
        <div
          className="celebration-card bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-7xl mb-4">🎉</div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">
            Milestone Achieved!
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{milestoneName}</h2>
          <p className="text-gray-600 mb-6">{milestoneDescription}</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onDismiss}
              className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Continue Learning
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'PathMuslim Milestone',
                    text: `I just achieved "${milestoneName}" on PathMuslim! ${milestoneDescription}`,
                  }).catch(() => null);
                }
                onDismiss();
              }}
              className="border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Share
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4">Auto-closes in 5 seconds</p>
        </div>
      </div>
    </>
  );
}
