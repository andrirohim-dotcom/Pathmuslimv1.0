'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronRightIcon, ScrollIcon } from 'lucide-react';
import { SourceWithModuleCount } from '@/lib/services/SourceService';
import { QuranMetadata } from '@/lib/types';

const SURAHS: { number: number; name: string }[] = [
  { number: 1, name: 'Al-Fatiha' },
  { number: 2, name: 'Al-Baqarah' },
  { number: 3, name: 'Al-Imran' },
  { number: 4, name: 'An-Nisa' },
  { number: 5, name: 'Al-Maidah' },
  { number: 6, name: "Al-An'am" },
  { number: 7, name: "Al-A'raf" },
  { number: 8, name: 'Al-Anfal' },
  { number: 9, name: 'At-Tawbah' },
  { number: 10, name: 'Yunus' },
  { number: 11, name: 'Hud' },
  { number: 12, name: 'Yusuf' },
  { number: 13, name: "Ar-Ra'd" },
  { number: 14, name: 'Ibrahim' },
  { number: 15, name: 'Al-Hijr' },
  { number: 16, name: 'An-Nahl' },
  { number: 17, name: "Al-Isra'" },
  { number: 18, name: 'Al-Kahf' },
  { number: 19, name: 'Maryam' },
  { number: 20, name: 'Ta-Ha' },
  { number: 21, name: "Al-Anbiya'" },
  { number: 22, name: 'Al-Hajj' },
  { number: 23, name: "Al-Mu'minun" },
  { number: 24, name: 'An-Nur' },
  { number: 25, name: 'Al-Furqan' },
  { number: 26, name: "Ash-Shu'ara'" },
  { number: 27, name: 'An-Naml' },
  { number: 28, name: 'Al-Qasas' },
  { number: 29, name: "Al-'Ankabut" },
  { number: 30, name: 'Ar-Rum' },
  { number: 31, name: 'Luqman' },
  { number: 32, name: 'As-Sajdah' },
  { number: 33, name: 'Al-Ahzab' },
  { number: 34, name: 'Saba' },
  { number: 35, name: 'Fatir' },
  { number: 36, name: 'Ya-Sin' },
  { number: 37, name: 'As-Saffat' },
  { number: 38, name: 'Sad' },
  { number: 39, name: 'Az-Zumar' },
  { number: 40, name: 'Ghafir' },
  { number: 41, name: 'Fussilat' },
  { number: 42, name: 'Ash-Shura' },
  { number: 43, name: 'Az-Zukhruf' },
  { number: 44, name: 'Ad-Dukhan' },
  { number: 45, name: 'Al-Jathiyah' },
  { number: 46, name: 'Al-Ahqaf' },
  { number: 47, name: 'Muhammad' },
  { number: 48, name: 'Al-Fath' },
  { number: 49, name: 'Al-Hujurat' },
  { number: 50, name: 'Qaf' },
  { number: 51, name: 'Adh-Dhariyat' },
  { number: 52, name: 'At-Tur' },
  { number: 53, name: 'An-Najm' },
  { number: 54, name: 'Al-Qamar' },
  { number: 55, name: 'Ar-Rahman' },
  { number: 56, name: "Al-Waqi'ah" },
  { number: 57, name: 'Al-Hadid' },
  { number: 58, name: 'Al-Mujadila' },
  { number: 59, name: 'Al-Hashr' },
  { number: 60, name: 'Al-Mumtahanah' },
  { number: 61, name: 'As-Saf' },
  { number: 62, name: "Al-Jumu'ah" },
  { number: 63, name: 'Al-Munafiqun' },
  { number: 64, name: 'At-Taghabun' },
  { number: 65, name: 'At-Talaq' },
  { number: 66, name: 'At-Tahrim' },
  { number: 67, name: 'Al-Mulk' },
  { number: 68, name: 'Al-Qalam' },
  { number: 69, name: 'Al-Haqqah' },
  { number: 70, name: "Al-Ma'arij" },
  { number: 71, name: 'Nuh' },
  { number: 72, name: 'Al-Jinn' },
  { number: 73, name: 'Al-Muzzammil' },
  { number: 74, name: 'Al-Muddaththir' },
  { number: 75, name: 'Al-Qiyamah' },
  { number: 76, name: 'Al-Insan' },
  { number: 77, name: 'Al-Mursalat' },
  { number: 78, name: "An-Naba'" },
  { number: 79, name: "An-Nazi'at" },
  { number: 80, name: "'Abasa" },
  { number: 81, name: 'At-Takwir' },
  { number: 82, name: 'Al-Infitar' },
  { number: 83, name: 'Al-Mutaffifin' },
  { number: 84, name: 'Al-Inshiqaq' },
  { number: 85, name: 'Al-Buruj' },
  { number: 86, name: 'At-Tariq' },
  { number: 87, name: "Al-A'la" },
  { number: 88, name: 'Al-Ghashiyah' },
  { number: 89, name: 'Al-Fajr' },
  { number: 90, name: 'Al-Balad' },
  { number: 91, name: 'Ash-Shams' },
  { number: 92, name: 'Al-Layl' },
  { number: 93, name: 'Ad-Duhaa' },
  { number: 94, name: 'Ash-Sharh' },
  { number: 95, name: 'At-Tin' },
  { number: 96, name: "Al-'Alaq" },
  { number: 97, name: 'Al-Qadr' },
  { number: 98, name: 'Al-Bayyinah' },
  { number: 99, name: 'Az-Zalzalah' },
  { number: 100, name: "Al-'Adiyat" },
  { number: 101, name: "Al-Qari'ah" },
  { number: 102, name: 'At-Takathur' },
  { number: 103, name: "Al-'Asr" },
  { number: 104, name: 'Al-Humazah' },
  { number: 105, name: 'Al-Fil' },
  { number: 106, name: 'Quraysh' },
  { number: 107, name: "Al-Ma'un" },
  { number: 108, name: 'Al-Kawthar' },
  { number: 109, name: 'Al-Kafirun' },
  { number: 110, name: 'An-Nasr' },
  { number: 111, name: 'Al-Masad' },
  { number: 112, name: 'Al-Ikhlas' },
  { number: 113, name: 'Al-Falaq' },
  { number: 114, name: 'An-Nas' },
];

interface QuranViewerProps {
  sources: SourceWithModuleCount[];
  total: number;
  page: number;
  onSurahChange: (surah: number | undefined) => void;
  onPageChange: (page: number) => void;
  selectedSurah?: number;
}

function VerseCard({ source }: { source: SourceWithModuleCount }) {
  const [expanded, setExpanded] = useState(false);
  const meta = source.source_metadata as QuranMetadata;

  return (
    <div className="border border-green-200 rounded-lg bg-green-50 overflow-hidden">
      <button
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-green-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <ScrollIcon className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-gray-800 text-sm">
              {meta?.surah
                ? `${meta.surah} ${meta.surah_number ? `${meta.surah_number}:${meta.verse_start}` : ''}`
                : source.citation}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              {source.module_count > 0 && (
                <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
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
          <p className="text-xs text-gray-600 mt-0.5 truncate">{source.citation}</p>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-green-200 pt-4 space-y-3">
          <div className="bg-white rounded p-3 border border-green-100 italic text-gray-700 text-sm">
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
            <div className="text-sm text-gray-600 bg-white rounded p-3 border border-green-100">
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
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
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

export function QuranViewer({
  sources,
  total,
  page,
  onSurahChange,
  onPageChange,
  selectedSurah,
}: QuranViewerProps) {
  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <label htmlFor="surah-filter" className="text-sm font-medium text-gray-700">
          Filter by Surah:
        </label>
        <select
          id="surah-filter"
          value={selectedSurah ?? ''}
          onChange={(e) => onSurahChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Surahs</option>
          {SURAHS.map((s) => (
            <option key={s.number} value={s.number}>
              {s.number}. {s.name}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">{total} Quranic reference{total !== 1 ? 's' : ''}</span>
      </div>

      {/* Results */}
      {sources.length === 0 ? (
        <p className="text-gray-500 text-sm py-8 text-center">No Quranic references found.</p>
      ) : (
        <div className="space-y-3">
          {sources.map((source) => (
            <VerseCard key={source.id} source={source} />
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
