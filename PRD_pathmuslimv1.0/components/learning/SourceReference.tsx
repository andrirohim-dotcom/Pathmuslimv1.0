'use client';

import React from 'react';
import { BookIcon, ScrollIcon, UserIcon } from 'lucide-react';

interface Source {
  id: string;
  source_type: 'quran' | 'hadith' | 'scholar' | 'scholarly_text';
  citation: string;
  display_text: string;
  translation?: string;
  context?: string;
  source_metadata?: Record<string, any>;
}

interface SourceReferenceProps {
  source: Source;
}

export function SourceReference({ source }: SourceReferenceProps) {
  const [expanded, setExpanded] = React.useState(false);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'quran':
        return <ScrollIcon className="w-5 h-5 text-green-600" />;
      case 'hadith':
        return <BookIcon className="w-5 h-5 text-blue-600" />;
      case 'scholar':
        return <UserIcon className="w-5 h-5 text-purple-600" />;
      case 'scholarly_text':
        return <BookIcon className="w-5 h-5 text-amber-600" />;
      default:
        return <BookIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSourceTypeLabel = (type: string) => {
    switch (type) {
      case 'quran':
        return 'Quranic Verse';
      case 'hadith':
        return 'Hadith';
      case 'scholar':
        return 'Scholarly Citation';
      case 'scholarly_text':
        return 'Scholarly Text';
      default:
        return 'Reference';
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'quran':
        return 'bg-green-50 border-green-200';
      case 'hadith':
        return 'bg-blue-50 border-blue-200';
      case 'scholar':
        return 'bg-purple-50 border-purple-200';
      case 'scholarly_text':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const renderSourceContent = () => {
    const { source_type, citation, display_text, translation, context, source_metadata } = source;

    return (
      <div className="space-y-3">
        {/* Citation and metadata */}
        <div className="space-y-1">
          <p className="font-semibold text-gray-800">{citation}</p>
          {source_metadata && (
            <div className="text-xs text-gray-600 space-y-1">
              {source_type === 'quran' && source_metadata.surah && (
                <p>
                  📖 Surah {source_metadata.surah}, Verses {source_metadata.verses}
                </p>
              )}
              {source_type === 'hadith' && source_metadata.collection && (
                <p>
                  📚 {source_metadata.collection} | Grade:{' '}
                  <span className="font-semibold">{source_metadata.grade}</span>
                </p>
              )}
              {source_type === 'scholar' && source_metadata.madhab && (
                <p>
                  👤 School: <span className="font-semibold">{source_metadata.madhab}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Display Text */}
        <div className="bg-white rounded p-3 border border-gray-200 italic text-gray-700">
          "{display_text}"
        </div>

        {/* Translation */}
        {translation && (
          <div className="text-sm text-gray-600">
            <p className="font-semibold mb-1">Translation:</p>
            <p>{translation}</p>
          </div>
        )}

        {/* Context */}
        {context && (
          <div className="text-sm text-gray-600 bg-white rounded p-3 border border-gray-100">
            <p className="font-semibold mb-1">Context:</p>
            <p>{context}</p>
          </div>
        )}

        {/* Additional metadata for hadith */}
        {source_type === 'hadith' && source_metadata && (
          <div className="text-xs text-gray-600 bg-white rounded p-3 border border-gray-100">
            {source_metadata.theme && (
              <p>
                📌 Theme: <span className="font-semibold">{source_metadata.theme}</span>
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${getSourceColor(source.source_type)}`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {getSourceIcon(source.source_type)}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-gray-700">
              {getSourceTypeLabel(source.source_type)}
            </p>
            <span className="text-lg text-gray-400">{expanded ? '▼' : '▶'}</span>
          </div>
          <p className="text-sm text-gray-600 truncate">{source.citation}</p>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && <div className="mt-4 pt-4 border-t border-gray-300">{renderSourceContent()}</div>}
    </div>
  );
}
