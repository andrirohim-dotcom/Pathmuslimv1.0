'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon, ScrollIcon, BookIcon, UserIcon } from 'lucide-react';
import { QuranViewer } from '@/components/sources/QuranViewer';
import { HadithViewer } from '@/components/sources/HadithViewer';
import { ScholarViewer } from '@/components/sources/ScholarViewer';
import { SourceWithModuleCount } from '@/lib/services/SourceService';

type ActiveTab = 'quran' | 'hadith' | 'scholars';

interface FetchState {
  items: SourceWithModuleCount[];
  total: number;
  loading: boolean;
  error: string | null;
}

const TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: 'quran', label: 'Quran', icon: <ScrollIcon className="w-4 h-4" /> },
  { id: 'hadith', label: 'Hadith', icon: <BookIcon className="w-4 h-4" /> },
  { id: 'scholars', label: 'Scholars', icon: <UserIcon className="w-4 h-4" /> },
];

export default function SourcesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<ActiveTab>('quran');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Quran state
  const [selectedSurah, setSelectedSurah] = useState<number | undefined>(undefined);

  // Hadith state
  const [selectedCollection, setSelectedCollection] = useState<'all' | 'bukhari' | 'muslim' | 'tirmidhi' | 'other'>('all');
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'sahih' | 'hasan' | 'weak'>('all');

  // Scholar state
  const [selectedMadhab, setSelectedMadhab] = useState<'all' | 'hanafi' | 'maliki' | 'shafi' | 'hanbali'>('all');

  const [data, setData] = useState<FetchState>({
    items: [],
    total: 0,
    loading: false,
    error: null,
  });

  const buildUrl = useCallback(() => {
    if (activeTab === 'quran') {
      const params = new URLSearchParams();
      if (selectedSurah) params.set('surah', String(selectedSurah));
      params.set('page', String(page));
      return `/api/sources/quran?${params}`;
    }
    if (activeTab === 'hadith') {
      const params = new URLSearchParams();
      if (selectedCollection !== 'all') params.set('collection', selectedCollection);
      if (selectedGrade !== 'all') params.set('grade', selectedGrade);
      params.set('page', String(page));
      return `/api/sources/hadith?${params}`;
    }
    // scholars
    const params = new URLSearchParams();
    if (selectedMadhab !== 'all') params.set('madhab', selectedMadhab);
    params.set('page', String(page));
    return `/api/sources/scholars?${params}`;
  }, [activeTab, selectedSurah, selectedCollection, selectedGrade, selectedMadhab, page]);

  const fetchData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const url = buildUrl();
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData({
        items: json.data ?? [],
        total: json.metadata?.total ?? 0,
        loading: false,
        error: null,
      });
    } catch (err) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load sources',
      }));
    }
  }, [buildUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when tab or filter changes
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/sources/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Islamic Source References</h1>
        <p className="text-gray-600 mt-1">
          Browse Quranic verses, Hadith, and scholarly citations used across learning modules.
        </p>
      </div>

      {/* Global search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1 max-w-lg">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all sources..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-0" aria-label="Source tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {data.loading && (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p className="mt-3 text-gray-500 text-sm">Loading references...</p>
        </div>
      )}

      {data.error && !data.loading && (
        <div className="py-8 text-center text-red-600 text-sm">
          Failed to load sources: {data.error}
        </div>
      )}

      {!data.loading && !data.error && (
        <>
          {activeTab === 'quran' && (
            <QuranViewer
              sources={data.items}
              total={data.total}
              page={page}
              selectedSurah={selectedSurah}
              onSurahChange={(surah) => { setSelectedSurah(surah); setPage(1); }}
              onPageChange={setPage}
            />
          )}

          {activeTab === 'hadith' && (
            <HadithViewer
              sources={data.items}
              total={data.total}
              page={page}
              selectedCollection={selectedCollection}
              selectedGrade={selectedGrade}
              onCollectionChange={(c) => { setSelectedCollection(c); setPage(1); }}
              onGradeChange={(g) => { setSelectedGrade(g); setPage(1); }}
              onPageChange={setPage}
            />
          )}

          {activeTab === 'scholars' && (
            <ScholarViewer
              sources={data.items}
              total={data.total}
              page={page}
              selectedMadhab={selectedMadhab}
              onMadhabChange={(m) => { setSelectedMadhab(m); setPage(1); }}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
