'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { QAResultList, QAResult } from '@/components/qa/QAResultList';
import { AskQuestionDialog } from '@/components/qa/AskQuestionDialog';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'family', label: 'Family' },
  { value: 'work', label: 'Work' },
  { value: 'spirituality', label: 'Spirituality' },
  { value: 'health', label: 'Health' },
  { value: 'relationships', label: 'Relationships' },
];

const SORTS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'recent', label: 'Recent' },
  { value: 'helpful', label: 'Most Helpful' },
];

export default function QASearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<'relevance' | 'recent' | 'helpful'>('relevance');
  const [results, setResults] = useState<QAResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAskDialog, setShowAskDialog] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = async (q: string, cat: string, s: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (cat) params.set('category', cat);
      params.set('sort', s);
      params.set('limit', '20');

      // Need either q or category
      if (!q && !cat) {
        setResults([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/qa/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.data?.answers ?? []);
        setTotal(data.data?.total ?? 0);
      } else {
        setResults([]);
        setTotal(0);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResults(query, category, sort);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, category, sort]);

  const hasSearch = query.length >= 2 || category !== '';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Q&A Knowledge Base</h1>
          <button
            onClick={() => setShowAskDialog(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Ask a Question
          </button>
        </div>
        <p className="text-gray-500 mt-2">
          Find Islamic guidance on everyday situations — family, work, spirituality, and more.
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions (e.g. family, prayer, work...)"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === cat.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sort toggle */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-gray-500">Sort:</span>
        {SORTS.map((s) => (
          <button
            key={s.value}
            onClick={() => setSort(s.value as 'relevance' | 'recent' | 'helpful')}
            className={`text-sm px-3 py-1 rounded border transition-colors ${
              sort === s.value
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && hasSearch && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {total} result{total !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {!loading && hasSearch && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-3">No answers found for your search.</p>
          <p className="text-gray-400 text-sm mb-6">
            Try a different query, browse by category, or ask our team directly.
          </p>
          <button
            onClick={() => setShowAskDialog(true)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Ask a Question
          </button>
        </div>
      )}

      {!loading && <QAResultList results={results} />}

      {!hasSearch && !loading && (
        <div className="text-center py-12 text-gray-400">
          <p>Type a search query or select a category above to browse answers.</p>
          <Link href="/qa/categories" className="mt-4 inline-block text-blue-600 underline text-sm">
            Browse by category
          </Link>
        </div>
      )}

      <AskQuestionDialog
        open={showAskDialog}
        onClose={() => setShowAskDialog(false)}
      />
    </div>
  );
}
