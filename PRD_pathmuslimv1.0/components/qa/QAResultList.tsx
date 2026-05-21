'use client';

import Link from 'next/link';

export interface QAResult {
  id: string; // answer id
  question_id: string;
  question_title: string;
  answer_excerpt: string;
  category: string;
  helpful_count: number;
  view_count: number;
  source_count: number;
  status: string;
}

interface QAResultListProps {
  results: QAResult[];
}

const CATEGORY_LABELS: Record<string, string> = {
  family: 'Family',
  work: 'Work & Career',
  spirituality: 'Spirituality',
  health: 'Health',
  relationships: 'Relationships',
  other: 'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
  family: 'bg-green-100 text-green-700',
  work: 'bg-blue-100 text-blue-700',
  spirituality: 'bg-purple-100 text-purple-700',
  health: 'bg-red-100 text-red-700',
  relationships: 'bg-pink-100 text-pink-700',
  other: 'bg-gray-100 text-gray-700',
};

export function QAResultList({ results }: QAResultListProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No results found.</p>
        <p className="text-gray-400 mt-2">Try a different query or ask a new question.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {results.map((result) => (
        <li key={result.id}>
          <Link href={`/qa/answers/${result.id}`} className="block">
            <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-blue-300 transition-all">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-gray-900 text-base leading-snug">
                  {result.question_title}
                </h3>
                {result.status === 'pending' ? (
                  <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                    Pending Review
                  </span>
                ) : (
                  <span
                    className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                      CATEGORY_COLORS[result.category] ?? 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {CATEGORY_LABELS[result.category] ?? result.category}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{result.answer_excerpt}</p>

              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                <span title="Views">👁 {result.view_count}</span>
                <span title="Helpful">👍 {result.helpful_count}</span>
                <span title="Sources">📚 {result.source_count} source{result.source_count !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
