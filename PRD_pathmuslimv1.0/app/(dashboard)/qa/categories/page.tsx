'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface CategoryStat {
  id: string;
  name: string;
  description: string;
  answered_count: number;
  pending_count: number;
  total_count: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  family: '👨‍👩‍👧‍👦',
  work: '💼',
  spirituality: '🙏',
  health: '⚕️',
  relationships: '💑',
  other: '❓',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/qa/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.data?.categories ?? []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Q&A Categories</h1>
      <p className="text-gray-500 mb-8">Browse Islamic guidance by topic area.</p>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/qa/search?category=${cat.id}`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{CATEGORY_ICONS[cat.id] ?? '📚'}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 text-base">{cat.name}</h2>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">{cat.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                    <span>{cat.answered_count} answered</span>
                    {cat.pending_count > 0 && <span>{cat.pending_count} pending</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center">
        <Link
          href="/qa/ask"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Ask a Question
        </Link>
        <p className="text-xs text-gray-400 mt-2">
          Our scholars respond within 48 hours with sourced guidance.
        </p>
      </div>
    </div>
  );
}
