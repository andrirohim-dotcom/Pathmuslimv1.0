'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { QASourceReference, QASource } from '@/components/qa/QASourceReference';
import { useParams } from 'next/navigation';

interface AnswerDetail {
  question: {
    id: string;
    title: string;
    category: string;
    status: string;
    view_count: number;
    helpful_count: number;
  };
  answer: {
    id: string;
    content: string;
    scholarly_perspective: string;
    contemporary_context: string | null;
    moderation_status: string;
    created_at: string;
    version: number;
  };
  sources: QASource[];
  related_modules: Array<{
    id: string;
    title: string;
    sequence_number: number;
    level: string;
  }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  family: 'Family Relations',
  work: 'Work & Career',
  spirituality: 'Spiritual Practice',
  health: 'Health & Medicine',
  relationships: 'Relationships',
  other: 'Other',
};

export default function AnswerDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [detail, setDetail] = useState<AnswerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState<number>(0);
  const [helpfulClicked, setHelpfulClicked] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/qa/answers/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        setDetail(data.data);
        setHelpfulCount(data.data?.question?.helpful_count ?? 0);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleHelpful = async () => {
    if (helpfulClicked) return;
    try {
      const res = await fetch(`/api/qa/answers/${id}/helpful`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setHelpfulCount(data.data?.helpful_count ?? helpfulCount + 1);
        setHelpfulClicked(true);
      }
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-500">Loading answer...</p>
      </div>
    );
  }

  if (notFound || !detail) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">Answer not found.</p>
        <Link href="/qa/search" className="mt-4 inline-block text-blue-600 underline">
          Back to search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link href="/qa/search" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to search
      </Link>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {CATEGORY_LABELS[detail.question.category] ?? detail.question.category}
          </span>
          <span className="text-xs text-gray-400">
            {detail.question.view_count} views · {helpfulCount} found helpful
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{detail.question.title}</h1>
      </div>

      {/* Scholarly Perspective */}
      <section className="mb-5">
        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-2">
            Scholarly Perspective
          </h2>
          <p className="text-gray-800 leading-relaxed">{detail.answer.scholarly_perspective}</p>
        </div>
      </section>

      {/* Contemporary Context */}
      {detail.answer.contemporary_context && (
        <section className="mb-5">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-2">
              Contemporary Context
            </h2>
            <p className="text-gray-800 leading-relaxed">{detail.answer.contemporary_context}</p>
          </div>
        </section>
      )}

      {/* Full Answer Content */}
      {detail.answer.content && (
        <section className="mb-6">
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <p>{detail.answer.content}</p>
          </div>
        </section>
      )}

      {/* Sources */}
      {detail.sources.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            Sources ({detail.sources.length})
          </h2>
          <div className="space-y-3">
            {detail.sources.map((source) => (
              <QASourceReference key={source.id} source={source} />
            ))}
          </div>
        </section>
      )}

      {/* Helpful Button */}
      <div className="mb-6">
        <button
          onClick={handleHelpful}
          disabled={helpfulClicked}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            helpfulClicked
              ? 'bg-green-50 border-green-300 text-green-700 cursor-default'
              : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          👍 {helpfulClicked ? 'Thanks for your feedback!' : `Helpful (${helpfulCount})`}
        </button>
      </div>

      {/* Related Modules */}
      {detail.related_modules.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">Related Learning Modules</h2>
          <div className="space-y-2">
            {detail.related_modules.map((mod) => (
              <Link
                key={mod.id}
                href={`/learning/modules/${mod.id}`}
                className="block bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 transition-colors"
              >
                <span className="text-xs text-gray-400 mr-2">Module {mod.sequence_number}</span>
                <span className="text-sm font-medium text-gray-800">{mod.title}</span>
                <span className="ml-2 text-xs capitalize text-gray-400">{mod.level}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
