/**
 * Unit Tests: QAService
 * T058 — Tests for ranking, duplicate detection, and category classification
 * Note: Uses cast-based typing compatible with this project's Babel/Jest config.
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { QAService } from '@/lib/services/QAService';
import { QARepository } from '@/lib/repositories/QARepository';

// Mock the QARepository module to avoid DB calls at import time
jest.mock('@/lib/repositories/QARepository', () => ({
  QARepository: {
    checkDuplicate: () => Promise.resolve({ found: false }),
  },
}));

function makeResult(overrides) {
  return {
    id: 'answer-id',
    question_id: 'q-id',
    question_title: 'Default title',
    answer_excerpt: 'Default excerpt',
    category: 'family',
    helpful_count: 0,
    view_count: 0,
    source_count: 0,
    created_at: new Date().toISOString(),
    answered_at: new Date().toISOString(),
    status: 'answered',
    ...overrides,
  };
}

describe('QAService.rankResults', () => {
  it('ranks title match higher than content-only match', () => {
    const results = [
      makeResult({
        id: 'content-only',
        question_title: 'Something unrelated',
        answer_excerpt: 'family matters are discussed here',
      }),
      makeResult({
        id: 'title-match',
        question_title: 'How to handle family conflicts',
        answer_excerpt: 'General advice',
      }),
    ];

    const ranked = QAService.rankResults(results, 'family');
    expect(ranked[0].id).toBe('title-match');
  });

  it('scores title+content match higher than title-only', () => {
    const results = [
      makeResult({
        id: 'both',
        question_title: 'Family relations guide',
        answer_excerpt: 'family ties are important',
      }),
      makeResult({
        id: 'title-only',
        question_title: 'Family relations guide',
        answer_excerpt: 'General advice',
      }),
    ];

    const ranked = QAService.rankResults(results, 'family');
    expect(ranked[0].id).toBe('both');
  });

  it('returns same results in any order when query is empty', () => {
    const results = [makeResult({ id: 'a' }), makeResult({ id: 'b' })];
    const ranked = QAService.rankResults(results, '');
    expect(ranked.map((r) => r.id)).toEqual(['a', 'b']);
  });

  it('factors in helpful_count as a tiebreaker', () => {
    const results = [
      makeResult({ id: 'low-helpful', question_title: 'Family topic', helpful_count: 5 }),
      makeResult({ id: 'high-helpful', question_title: 'Family topic', helpful_count: 100 }),
    ];

    const ranked = QAService.rankResults(results, 'family');
    expect(ranked[0].id).toBe('high-helpful');
  });
});

describe('QAService.detectDuplicate', () => {
  let checkDuplicateSpy;

  beforeEach(() => {
    checkDuplicateSpy = jest.spyOn(QARepository, 'checkDuplicate');
  });

  afterEach(() => {
    checkDuplicateSpy.mockRestore();
  });

  it('returns question_id when duplicate is found', async () => {
    checkDuplicateSpy.mockResolvedValueOnce({ found: true, question_id: 'existing-q-id' });

    const result = await QAService.detectDuplicate('How do I pray?');
    expect(result).toBe('existing-q-id');
  });

  it('returns null when no duplicate is found', async () => {
    checkDuplicateSpy.mockResolvedValueOnce({ found: false });

    const result = await QAService.detectDuplicate('Unique question title');
    expect(result).toBeNull();
  });
});

describe('QAService.classifyCategory', () => {
  it('classifies "family" keyword to family', () => {
    const category = QAService.classifyCategory('How do I handle family pressure?');
    expect(category).toBe('family');
  });

  it('classifies "prayer" keyword to spirituality', () => {
    const category = QAService.classifyCategory('How do I perform my daily prayer correctly?');
    expect(category).toBe('spirituality');
  });

  it('classifies "work" keyword to work', () => {
    const category = QAService.classifyCategory('My work schedule conflicts with my prayers');
    expect(category).toBe('work');
  });

  it('classifies "therapy" keyword to health', () => {
    const category = QAService.classifyCategory('Is it permissible to see a therapy professional?');
    expect(category).toBe('health');
  });

  it('classifies "dating" keyword to relationships', () => {
    const category = QAService.classifyCategory('What does Islam say about dating?');
    expect(category).toBe('relationships');
  });

  it('falls back to "other" for unclassifiable content', () => {
    const category = QAService.classifyCategory('Random words with no category match xyz');
    expect(category).toBe('other');
  });
});
