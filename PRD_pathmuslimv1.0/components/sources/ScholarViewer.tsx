'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserIcon, ChevronDownIcon, ChevronRightIcon, BookOpenIcon } from 'lucide-react';
import { SourceWithModuleCount } from '@/lib/services/SourceService';
import { ScholarMetadata } from '@/lib/types';

type MadhabFilter = 'all' | 'hanafi' | 'maliki' | 'shafi' | 'hanbali';

const MADHAB_COLORS: Record<string, { color: string; bg: string }> = {
  hanafi: { color: 'text-purple-700', bg: 'bg-purple-100' },
  maliki: { color: 'text-blue-700', bg: 'bg-blue-100' },
  shafi: { color: 'text-green-700', bg: 'bg-green-100' },
  "shafi'i": { color: 'text-green-700', bg: 'bg-green-100' },
  hanbali: { color: 'text-amber-700', bg: 'bg-amber-100' },
};

function madhabStyle(madhab?: string) {
  const key = (madhab ?? '').toLowerCase();
  return MADHAB_COLORS[key] ?? { color: 'text-gray-700', bg: 'bg-gray-100' };
}

function ScholarCard({ source }: { source: SourceWithModuleCount }) {
  const [expanded, setExpanded] = useState(false);
  const meta = source.source_metadata as ScholarMetadata;
  const { color, bg } = madhabStyle(meta?.madhab);

  const periodDisplay = meta?.publication_year
    ? `(d. ${meta.publication_year})`
    : '';

  return (
    <div className="border border-purple-200 rounded-lg bg-purple-50 overflow-hidden">
      <button
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-purple-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <UserIcon className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="font-semibold text-gray-800 text-sm">
              {meta?.scholar_name ?? source.citation}
              {periodDisplay && (
                <span className="font-normal text-gray-500 ml-1">{periodDisplay}</span>
              )}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              {meta?.madhab && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${color} ${bg}`}>
                  {meta.madhab}
                </span>
              )}
              {source.module_count > 0 && (
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                  {source.module_count} module{source.module_count !== 1 ? 's' : ''}
                </span>
              )}
              {expanded ? (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>
          {meta?.work_title && (
            <div className="flex items-center gap-1 mt-0.5">
              <BookOpenIcon className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-600 italic">{meta.work_title}</p>
            </div>
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-purple-200 pt-4 space-y-3">
          {/* Quote/Excerpt */}
          <div className="bg-white rounded p-3 border border-purple-100 italic text-gray-700 text-sm">
            &ldquo;{source.display_text}&rdquo;
          </div>

          {source.translation && (
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-xs uppercase tracking-wide text-gray-500 mb-1">
                Translation
              </p>
              <p>{source.translation}</p>
            </div>
          )}

          {/* Scholar biography / context */}
          {source.context && (
            <div className="text-sm text-gray-600 bg-white rounded p-3 border border-purple-100">
              <p className="font-semibold text-xs uppercase tracking-wide text-gray-500 mb-1">
                About this Scholar
              </p>
              <p>{source.context}</p>
            </div>
          )}

          {/* Page reference */}
          {meta?.page_reference && (
            <p className="text-xs text-gray-500">Reference: {meta.page_reference}</p>
          )}

          {source.module_count > 0 && (
            <div className="text-sm">
              <p className="font-semibold text-xs uppercase tracking-wide text-gray-500 mb-2">
                Used in Modules
              </p>
              <div className="flex flex-wrap gap-2">
                {source.module_ids.map((id) => (
                  <Link
                    key={id}
                    href={`/learning/${id}`}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                  >
                    View Module
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ScholarViewerProps {
  sources: SourceWithModuleCount[];
  total: number;
  page: number;
  onMadhabChange: (madhab: MadhabFilter) => void;
  onPageChange: (page: number) => void;
  selectedMadhab: MadhabFilter;
}

export function ScholarViewer({
  sources,
  total,
  page,
  onMadhabChange,
  onPageChange,
  selectedMadhab,
}: ScholarViewerProps) {
  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Madhab filter */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="madhab-filter" className="text-sm font-medium text-gray-700">
            Madhab:
          </label>
          <select
            id="madhab-filter"
            value={selectedMadhab}
            onChange={(e) => onMadhabChange(e.target.value as MadhabFilter)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Schools</option>
            <option value="hanafi">Hanafi</option>
            <option value="maliki">Maliki</option>
            <option value="shafi">Shafi&apos;i</option>
            <option value="hanbali">Hanbali</option>
          </select>
        </div>
        <span className="text-sm text-gray-500">{total} Scholar citation{total !== 1 ? 's' : ''}</span>
      </div>

      {/* Results */}
      {sources.length === 0 ? (
        <p className="text-gray-500 text-sm py-8 text-center">No scholar citations found.</p>
      ) : (
        <div className="space-y-3">
          {sources.map((source) => (
            <ScholarCard key={source.id} source={source} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="text-sm px-4 py-2 border rounded-md disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="text-sm px-4 py-2 border rounded-md disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
