'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookIcon, ChevronDownIcon, ChevronRightIcon, AlertTriangleIcon } from 'lucide-react';
import { SourceWithModuleCount } from '@/lib/services/SourceService';
import { HadithMetadata } from '@/lib/types';

type GradeFilter = 'all' | 'sahih' | 'hasan' | 'weak';
type CollectionFilter = 'all' | 'bukhari' | 'muslim' | 'tirmidhi' | 'other';

const GRADE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  sahih: { label: 'Sahih', color: 'text-green-700', bg: 'bg-green-100' },
  hasan: { label: 'Hasan', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  weak: { label: "Da'if (Weak)", color: 'text-red-700', bg: 'bg-red-100' },
  "da'if": { label: "Da'if (Weak)", color: 'text-red-700', bg: 'bg-red-100' },
  daif: { label: "Da'if (Weak)", color: 'text-red-700', bg: 'bg-red-100' },
};

function gradeConfig(grade?: string) {
  const normalized = (grade ?? '').toLowerCase();
  return GRADE_CONFIG[normalized] ?? { label: grade ?? 'Unknown', color: 'text-gray-700', bg: 'bg-gray-100' };
}

function isWeak(grade?: string) {
  const n = (grade ?? '').toLowerCase();
  return n === 'weak' || n === "da'if" || n === 'daif';
}

function HadithCard({ source }: { source: SourceWithModuleCount }) {
  const [expanded, setExpanded] = useState(false);
  const meta = source.source_metadata as HadithMetadata;
  const { label, color, bg } = gradeConfig(meta?.authentication_grade);
  const weak = isWeak(meta?.authentication_grade);

  return (
    <div className={`border rounded-lg overflow-hidden ${weak ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
      <button
        className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${weak ? 'hover:bg-red-100' : 'hover:bg-blue-100'}`}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <BookIcon className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="font-semibold text-gray-800 text-sm truncate">{source.citation}</p>
            <div className="flex items-center gap-2 shrink-0">
              {meta?.authentication_grade && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color} ${bg}`}>
                  {label}
                </span>
              )}
              {source.module_count > 0 && (
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
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
          {meta?.collection && (
            <p className="text-xs text-gray-600 mt-0.5">{meta.collection}</p>
          )}
        </div>
      </button>

      {expanded && (
        <div className={`px-4 pb-4 border-t pt-4 space-y-3 ${weak ? 'border-red-200' : 'border-blue-200'}`}>
          {/* Weak hadith warning */}
          {weak && (
            <div className="flex items-start gap-2 bg-red-100 border border-red-200 rounded p-3 text-sm text-red-700">
              <AlertTriangleIcon className="w-4 h-4 mt-0.5 shrink-0" />
              <p>Included for context — treat with caution. This hadith has a weak chain of narration.</p>
            </div>
          )}

          {/* Narrator chain */}
          {meta?.narrator && (
            <div className="text-xs text-gray-600">
              <span className="font-semibold uppercase tracking-wide">Narrator: </span>
              {meta.narrator}
            </div>
          )}

          {/* Hadith text */}
          <div className="bg-white rounded p-3 border border-gray-200 italic text-gray-700 text-sm">
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

          {source.context && (
            <div className="text-sm text-gray-600 bg-white rounded p-3 border border-gray-100">
              <p className="font-semibold text-xs uppercase tracking-wide text-gray-500 mb-1">
                Context
              </p>
              <p>{source.context}</p>
            </div>
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
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
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

interface HadithViewerProps {
  sources: SourceWithModuleCount[];
  total: number;
  page: number;
  onCollectionChange: (collection: CollectionFilter) => void;
  onGradeChange: (grade: GradeFilter) => void;
  onPageChange: (page: number) => void;
  selectedCollection: CollectionFilter;
  selectedGrade: GradeFilter;
}

export function HadithViewer({
  sources,
  total,
  page,
  onCollectionChange,
  onGradeChange,
  onPageChange,
  selectedCollection,
  selectedGrade,
}: HadithViewerProps) {
  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="collection-filter" className="text-sm font-medium text-gray-700">
            Collection:
          </label>
          <select
            id="collection-filter"
            value={selectedCollection}
            onChange={(e) => onCollectionChange(e.target.value as CollectionFilter)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Collections</option>
            <option value="bukhari">Sahih al-Bukhari</option>
            <option value="muslim">Sahih Muslim</option>
            <option value="tirmidhi">Jami al-Tirmidhi</option>
            <option value="other">Others</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="grade-filter" className="text-sm font-medium text-gray-700">
            Grade:
          </label>
          <select
            id="grade-filter"
            value={selectedGrade}
            onChange={(e) => onGradeChange(e.target.value as GradeFilter)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Grades</option>
            <option value="sahih">Sahih</option>
            <option value="hasan">Hasan</option>
            <option value="weak">Da&apos;if (Weak)</option>
          </select>
        </div>

        <span className="text-sm text-gray-500">{total} Hadith reference{total !== 1 ? 's' : ''}</span>
      </div>

      {/* Results */}
      {sources.length === 0 ? (
        <p className="text-gray-500 text-sm py-8 text-center">No Hadith references found.</p>
      ) : (
        <div className="space-y-3">
          {sources.map((source) => (
            <HadithCard key={source.id} source={source} />
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
