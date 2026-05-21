'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const VALID_CATEGORIES = [
  { value: 'family', label: 'Family Relations' },
  { value: 'work', label: 'Work & Career' },
  { value: 'spirituality', label: 'Spiritual Practice' },
  { value: 'health', label: 'Health & Medicine' },
  { value: 'relationships', label: 'Relationships & Dating' },
  { value: 'other', label: 'Other' },
];

export default function AskQuestionPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('family');
  const [isSensitive, setIsSensitive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{
    tracking_id: string;
    message: string;
  } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [duplicateId, setDuplicateId] = useState<string | null>(null);
  const dupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Duplicate detection
  useEffect(() => {
    if (dupTimerRef.current) clearTimeout(dupTimerRef.current);
    if (title.trim().length < 10) {
      setDuplicateId(null);
      return;
    }
    dupTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/qa/search?q=${encodeURIComponent(title.trim())}&limit=1`);
        if (res.ok) {
          const data = await res.json();
          const answers = data.data?.answers ?? [];
          setDuplicateId(answers.length > 0 ? (answers[0].id as string) : null);
        }
      } catch {
        setDuplicateId(null);
      }
    }, 500);
    return () => {
      if (dupTimerRef.current) clearTimeout(dupTimerRef.current);
    };
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      const res = await fetch('/api/qa/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category, is_sensitive: isSensitive }),
      });

      const data = await res.json();

      if (res.status === 201 && data.success) {
        setSubmitted({ tracking_id: data.data.tracking_id, message: data.data.message });
      } else if (res.status === 409) {
        setErrors(['A similar question already exists. Please check existing answers.']);
      } else if (res.status === 400) {
        setErrors(data.messages ?? [data.error?.message ?? 'Validation failed']);
      } else {
        setErrors([data.error?.message ?? 'Failed to submit question. Please try again.']);
      }
    } catch {
      setErrors(['Network error. Please try again.']);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <p className="text-4xl mb-4">✅</p>
          <h1 className="text-2xl font-bold text-green-900 mb-2">Question Submitted!</h1>
          <p className="text-sm text-green-700 font-mono mb-4">
            Tracking ID: {submitted.tracking_id}
          </p>
          <p className="text-gray-700 mb-6">{submitted.message}</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/qa/search"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Back to Search
            </Link>
            <Link
              href="/qa/categories"
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link href="/qa/search" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to search
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Ask a Question</h1>
      <p className="text-gray-500 text-sm mb-6">
        Our team of Islamic scholars will research and provide a sourced answer within 48 hours.
      </p>

      {errors.length > 0 && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-700">
              {e}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. How do I handle Ramadan at work as a new Muslim?"
          />
          <div className="flex items-center justify-between mt-1">
            <span
              className={`text-xs ${title.length >= 190 ? 'text-red-500' : 'text-gray-400'}`}
            >
              {title.length}/200
            </span>
            {duplicateId && (
              <span className="text-xs text-amber-600">
                Similar question exists.{' '}
                <Link href={`/qa/answers/${duplicateId}`} className="underline">
                  View it
                </Link>
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Details <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Provide context and details about your situation..."
          />
          <p
            className={`text-xs mt-1 ${content.length >= 1900 ? 'text-red-500' : 'text-gray-400'}`}
          >
            {content.length}/2000
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {VALID_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sensitive */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="sensitive"
            checked={isSensitive}
            onChange={(e) => setIsSensitive(e.target.checked)}
            className="mt-0.5 rounded"
          />
          <div>
            <label htmlFor="sensitive" className="text-sm font-medium text-gray-700 cursor-pointer">
              This is a sensitive topic
            </label>
            <p className="text-xs text-gray-400 mt-0.5">
              Your question will be handled with extra care and discretion.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Question'}
        </button>
      </form>
    </div>
  );
}
