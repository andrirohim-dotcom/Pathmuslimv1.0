'use client';

import React, { useState, useEffect, useRef } from 'react';

const VALID_CATEGORIES = [
  { value: 'family', label: 'Family Relations' },
  { value: 'work', label: 'Work & Career' },
  { value: 'spirituality', label: 'Spiritual Practice' },
  { value: 'health', label: 'Health & Medicine' },
  { value: 'relationships', label: 'Relationships & Dating' },
  { value: 'other', label: 'Other' },
];

interface AskQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  prefillTitle?: string;
}

export function AskQuestionDialog({ open, onClose, prefillTitle }: AskQuestionDialogProps) {
  const [title, setTitle] = useState(prefillTitle ?? '');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('family');
  const [isSensitive, setIsSensitive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ tracking_id: string; message: string } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [duplicateId, setDuplicateId] = useState<string | null>(null);
  const dupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefillTitle) setTitle(prefillTitle);
  }, [prefillTitle]);

  // Duplicate detection on title change
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
          if (data.data?.answers?.length > 0) {
            setDuplicateId(data.data.answers[0].id as string);
          } else {
            setDuplicateId(null);
          }
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

    const res = await fetch('/api/qa/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, category, is_sensitive: isSensitive }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (res.status === 201 && data.success) {
      setSubmitted({ tracking_id: data.data.tracking_id, message: data.data.message });
    } else if (res.status === 400) {
      setErrors(data.messages ?? [data.error?.message ?? 'Validation failed']);
    } else {
      setErrors([data.error?.message ?? 'Failed to submit question']);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Ask a Question</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
            ×
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-semibold text-gray-900">Question Submitted</p>
            <p className="text-sm text-gray-500 mt-1">Tracking ID: {submitted.tracking_id}</p>
            <p className="text-sm text-gray-600 mt-3">{submitted.message}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                {errors.map((e, i) => (
                  <p key={i} className="text-sm text-red-700">{e}</p>
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. How should I handle family disagreements as a new Muslim?"
              />
              <p className="text-xs text-gray-400 mt-1">{title.length}/200</p>
              {duplicateId && (
                <p className="text-xs text-amber-600 mt-1">
                  A similar question exists.{' '}
                  <a href={`/qa/answers/${duplicateId}`} className="underline">
                    View it
                  </a>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={2000}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Please provide more context..."
              />
              <p className="text-xs text-gray-400 mt-1">{content.length}/2000</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {VALID_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isSensitive}
                onChange={(e) => setIsSensitive(e.target.checked)}
                className="rounded"
              />
              This is a sensitive topic
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Question'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
