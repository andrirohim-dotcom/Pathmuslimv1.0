'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon, ScrollIcon, BookIcon, UserIcon, ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { SourceWithModuleCount } from '@/lib/services/SourceService';

type SourceType = 'quran' | 'hadith' | 'scholar' | 'scholarly_text';

interface GroupedResults {
  quran: SourceWithModuleCount[];
  hadith: SourceWithModuleCount[];
  scholars: SourceWithModuleCount[];
}

function typeLabel(type: SourceType) {
  switch (type) {
    case 'quran': return 'Quran';
    case 'hadith': return 'Hadith';
    case 'scholar':
    case 'scholarly_text': return 'Scholar';
    default: return 'Reference';
  }
}

function typeBadgeClass(type: SourceType) {
  switch (type) {
    case 'quran': return 'bg-green-100 text-green-700';
    case 'hadith': return 'bg-blue-100 text-blue-700';
    case 'scholar':
    case 'scholarly_text': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function typeIcon(type: SourceType) {
  switch (type) {
    case 'quran': return <ScrollIcon className="w-4 h-4" />;
    case 'hadith': return <BookIcon className="w-4 h-4" />;
    default: return <UserIcon className="w-4 h-4" />;
  }
}

type FilterType = 'all' | 'quran' | 'hadith' | 'scholars';

function SourceResultCard({ source }: { source: SourceWithModuleCount }) {
  const type = source.source_type as SourceType;
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-gray-500">{typeIcon(type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadgeClass(type)}`}>
              {typeLabel(type)}
            </span>
            {source.module_count > 0 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {source.module_count} module{source.module_count !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="font-semibold text-sm text-gray-800">{source.citation}</p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{source.display_text}</p>
          {source.translation && (
            <p className="text-xs text-gray-500 mt-1 italic line-clamp-1">{source.translation}</p>
          )}
          {source.module_count > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {source.module_ids.slice(0, 3).map((id) => (
                <Link
                  key={id}
                  href={`/learning/${id}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  View Module
                </Link>
              ))}
              {source.module_ids.length > 3 && (
                <span className="text-xs text-gray-500">+{source.module_ids.length - 3} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultSection({
  title,
  icon,
  count,
  items,
  hidden,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  items: SourceWithModuleCount[];
  hidden: boolean;
}) {
  if (hidden || items.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-semibold text-gray-800">
          {title} <span className="text-gray-500 font-normal">({count})</span>
        </h2>
      </div>
      <div className="space-y-2">
        {items.map((s) => (
          <SourceResultCard key={s.id} source={s} />
        ))}
      </div>
    </div>
  );
}

export default function SourcesSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [filter, setFilter] = useState<FilterType>('all');
  const [grouped, setGrouped] = useState<GroupedResults>({ quran: [], hadith: [], scholars: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const totalCount =
    (filter === 'all' || filter === 'quran' ? grouped.quran.length : 0) +
    (filter === 'all' || filter === 'hadith' ? grouped.hadith.length : 0) +
    (filter === 'all' || filter === 'scholars' ? grouped.scholars.length : 0);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);

    const [quranRes, hadithRes, scholarsRes] = await Promise.allSettled([
      fetch(`/api/sources/quran?q=${encodeURIComponent(q)}&limit=50`),
      fetch(`/api/sources/hadith?q=${encodeURIComponent(q)}&limit=50`),
      fetch(`/api/sources/scholars?q=${encodeURIComponent(q)}&limit=50`),
    ]);

    async function extractItems(result: PromiseSettledResult<Response>): Promise<SourceWithModuleCount[]> {
      if (result.status !== 'fulfilled' || !result.value.ok) return [];
      const json = await result.value.json();
      return json.data ?? [];
    }

    const [quran, hadith, scholars] = await Promise.all([
      extractItems(quranRes),
      extractItems(hadithRes),
      extractItems(scholarsRes),
    ]);

    setGrouped({ quran, hadith, scholars });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initialQuery) {
      search(initialQuery);
    }
  }, [initialQuery, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    setQuery(q);
    router.replace(`/sources/search?q=${encodeURIComponent(q)}`, { scroll: false });
    search(q);
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/sources"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Sources Explorer
      </Link>

      {/* Search bar */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Sources</h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1 max-w-lg">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search Quran, Hadith, and scholars..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {loading && (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p className="mt-3 text-gray-500 text-sm">Searching all sources...</p>
        </div>
      )}

      {searched && !loading && query && (
        <>
          {/* Results summary + type filter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-600">
                {totalCount} result{totalCount !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>Quran ({grouped.quran.length})</span>
                <span>|</span>
                <span>Hadith ({grouped.hadith.length})</span>
                <span>|</span>
                <span>Scholars ({grouped.scholars.length})</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter:</span>
              {(['all', 'quran', 'hadith', 'scholars'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors capitalize ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {totalCount === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm mt-1">Try a different search term or browse by type.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <ResultSection
                title="Quranic Verses"
                icon={<ScrollIcon className="w-5 h-5 text-green-600" />}
                count={grouped.quran.length}
                items={grouped.quran}
                hidden={filter !== 'all' && filter !== 'quran'}
              />
              <ResultSection
                title="Hadith References"
                icon={<BookIcon className="w-5 h-5 text-blue-600" />}
                count={grouped.hadith.length}
                items={grouped.hadith}
                hidden={filter !== 'all' && filter !== 'hadith'}
              />
              <ResultSection
                title="Scholarly Citations"
                icon={<UserIcon className="w-5 h-5 text-purple-600" />}
                count={grouped.scholars.length}
                items={grouped.scholars}
                hidden={filter !== 'all' && filter !== 'scholars'}
              />
            </div>
          )}
        </>
      )}

      {!searched && !loading && (
        <div className="py-12 text-center text-gray-500">
          <SearchIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Enter a search term to find references across Quran, Hadith, and scholars.</p>
        </div>
      )}
    </div>
  );
}
