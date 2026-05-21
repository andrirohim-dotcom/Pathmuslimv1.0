/**
 * Unit Tests: Search Ranking Logic
 * T059 — Tests for the relevance scoring function
 */

import { describe, it, expect } from '@jest/globals';
import { QAService } from '@/lib/services/QAService';

function makeResult(overrides) {
  return {
    id: 'default-id',
    question_id: 'q-id',
    question_title: 'Default title',
    answer_excerpt: 'Default excerpt',
    category: 'other',
    helpful_count: 0,
    view_count: 0,
    source_count: 0,
    created_at: new Date().toISOString(),
    answered_at: new Date().toISOString(),
    status: 'answered',
    ...overrides,
  };
}

describe('Search Ranking', () => {
  it('returns empty array for empty input', () => {
    const ranked = QAService.rankResults([], 'test query');
    expect(ranked).toHaveLength(0);
  });

  it('preserves all results', () => {
    const results = [makeResult({ id: 'a' }), makeResult({ id: 'b' }), makeResult({ id: 'c' })];
    const ranked = QAService.rankResults(results, 'anything');
    expect(ranked).toHaveLength(3);
  });

  it('does not mutate original array', () => {
    const results = [makeResult({ id: 'a', helpful_count: 5 }), makeResult({ id: 'b', helpful_count: 100 })];
    const originalOrder = results.map((r) => r.id);
    QAService.rankResults(results, 'query');
    expect(results.map((r) => r.id)).toEqual(originalOrder);
  });

  it('ranks recently answered results higher when they have matching title', () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 5);

    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 60);

    const results = [
      makeResult({ id: 'old-match', question_title: 'prayer times', answered_at: oldDate.toISOString() }),
      makeResult({ id: 'recent-match', question_title: 'prayer times', answered_at: recentDate.toISOString() }),
    ];

    const ranked = QAService.rankResults(results, 'prayer');
    expect(ranked[0].id).toBe('recent-match');
  });

  it('handles case-insensitive matching', () => {
    const results = [
      makeResult({ id: 'uppercase', question_title: 'FAMILY RELATIONS', answer_excerpt: 'some content' }),
      makeResult({ id: 'lowercase', question_title: 'other topic', answer_excerpt: 'no match' }),
    ];

    const ranked = QAService.rankResults(results, 'family');
    expect(ranked[0].id).toBe('uppercase');
  });
});
