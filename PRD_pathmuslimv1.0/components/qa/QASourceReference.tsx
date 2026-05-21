'use client';

import React from 'react';

export interface QASource {
  id: string;
  source_type: 'quran' | 'hadith' | 'scholar' | 'scholarly_text';
  citation: string;
  display_text: string;
  translation?: string | null;
  context?: string | null;
  source_metadata?: Record<string, unknown>;
}

interface QASourceReferenceProps {
  source: QASource;
}

const TYPE_CONFIG = {
  quran: {
    label: 'Quranic Verse',
    badge: 'bg-green-100 text-green-700 border-green-200',
    border: 'border-green-200 bg-green-50',
    dot: 'bg-green-500',
  },
  hadith: {
    label: 'Hadith',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    border: 'border-blue-200 bg-blue-50',
    dot: 'bg-blue-500',
  },
  scholar: {
    label: 'Scholar',
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    border: 'border-purple-200 bg-purple-50',
    dot: 'bg-purple-500',
  },
  scholarly_text: {
    label: 'Scholarly Text',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    border: 'border-amber-200 bg-amber-50',
    dot: 'bg-amber-500',
  },
};

export function QASourceReference({ source }: QASourceReferenceProps) {
  const [expanded, setExpanded] = React.useState(false);
  const config = TYPE_CONFIG[source.source_type] ?? TYPE_CONFIG.scholar;
  const meta = source.source_metadata ?? {};

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${config.border}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${config.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${config.badge}`}>
              {config.label}
            </span>
            {source.source_type === 'hadith' && !!meta.grade && (
              <span className="text-xs text-gray-500">
                {String(meta.grade)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 mt-1 truncate">{source.citation}</p>
        </div>
        <span className="text-gray-400 text-sm">{expanded ? '▼' : '▶'}</span>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <blockquote className="bg-white rounded p-3 border border-gray-200 italic text-gray-700 text-sm">
            "{source.display_text}"
          </blockquote>

          {source.translation && (
            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-1">Translation:</p>
              <p>{source.translation}</p>
            </div>
          )}

          {source.source_type === 'quran' && (
            <div className="text-xs text-gray-500 space-y-1">
              {!!meta.surah && <p>Surah: {String(meta.surah)}</p>}
              {!!meta.verses && <p>Verses: {String(meta.verses)}</p>}
            </div>
          )}

          {source.source_type === 'hadith' && (
            <div className="text-xs text-gray-500 space-y-1">
              {!!meta.collection && <p>Collection: {String(meta.collection)}</p>}
              {!!meta.narrator && <p>Narrator: {String(meta.narrator)}</p>}
            </div>
          )}

          {(source.source_type === 'scholar' || source.source_type === 'scholarly_text') && (
            <div className="text-xs text-gray-500 space-y-1">
              {!!meta.name && <p>Scholar: {String(meta.name)}</p>}
              {!!meta.madhab && <p>School: {String(meta.madhab)}</p>}
              {!!meta.major_work && <p>Work: {String(meta.major_work)}</p>}
            </div>
          )}

          {source.context && (
            <div className="text-sm text-gray-600 bg-white rounded p-3 border border-gray-100">
              <p className="font-semibold mb-1">Context:</p>
              <p>{source.context}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
