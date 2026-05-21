/**
 * Contract Test: GET /api/qa/search
 * T040 — TDD Red Phase: these tests FAIL until implementation is done
 *
 * Contract: GET /api/qa/search?q=&category=&sort=relevance|recent|helpful
 * Expect: { success: true, data: { answers: QAAnswer[], total, page }, query: string, category?: string }
 */

import { describe, it, expect, beforeAll } from '@jest/globals';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

describe('GET /api/qa/search - Contract Test', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = 'mock-token-for-testing';
  });

  it('should return 200 with answers list for a query', async () => {
    const response = await fetch(`${API_BASE}/api/qa/search?q=family`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data.answers)).toBe(true);
    expect(typeof data.data.total).toBe('number');
    expect(typeof data.data.page).toBe('number');
    expect(data.query).toBe('family');
  });

  it('should include required fields on each answer', async () => {
    const response = await fetch(`${API_BASE}/api/qa/search?q=prayer`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    const answers: unknown[] = data.data.answers;

    if (answers.length > 0) {
      const answer = answers[0] as Record<string, unknown>;
      expect(answer).toHaveProperty('id');
      expect(answer).toHaveProperty('question_title');
      expect(answer).toHaveProperty('answer_excerpt');
      expect(answer).toHaveProperty('category');
      expect(answer).toHaveProperty('helpful_count');
      expect(answer).toHaveProperty('view_count');
      expect(answer).toHaveProperty('source_count');
    }
  });

  it('should filter by category', async () => {
    const response = await fetch(
      `${API_BASE}/api/qa/search?q=&category=family`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.category).toBe('family');
    const answers = data.data.answers as Array<Record<string, unknown>>;
    answers.forEach((a) => expect(a.category).toBe('family'));
  });

  it('should accept sort=relevance', async () => {
    const response = await fetch(
      `${API_BASE}/api/qa/search?q=marriage&sort=relevance`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it('should accept sort=recent', async () => {
    const response = await fetch(
      `${API_BASE}/api/qa/search?q=marriage&sort=recent`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it('should accept sort=helpful', async () => {
    const response = await fetch(
      `${API_BASE}/api/qa/search?q=marriage&sort=helpful`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it('should return 400 when q param is missing', async () => {
    const response = await fetch(`${API_BASE}/api/qa/search`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should paginate results', async () => {
    const response = await fetch(
      `${API_BASE}/api/qa/search?q=&page=1&limit=5`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.answers.length).toBeLessThanOrEqual(5);
  });
});
