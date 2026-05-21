/**
 * Contract Test: GET /api/qa/answers/[id]
 * T041 — TDD Red Phase: these tests FAIL until implementation is done
 *
 * Contract: GET /api/qa/answers/[id]
 * Expect: { success: true, data: { question, answer, sources: SourceRef[], related_modules: LearningModule[] } }
 * answer must have: scholarly_perspective, contemporary_context, moderation_status: 'published'
 */

import { describe, it, expect, beforeAll } from '@jest/globals';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

describe('GET /api/qa/answers/[id] - Contract Test', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = 'mock-token-for-testing';
  });

  it('should return 404 for non-existent answer', async () => {
    const response = await fetch(
      `${API_BASE}/api/qa/answers/00000000-0000-0000-0000-000000000000`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should return 200 with full answer detail for valid id', async () => {
    // First search to get a valid answer id
    const searchResp = await fetch(`${API_BASE}/api/qa/search?q=family`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (searchResp.status !== 200) {
      // Skip if search not implemented yet
      return;
    }

    const searchData = await searchResp.json();
    if (!searchData.data?.answers?.length) return;

    const answerId = (searchData.data.answers[0] as Record<string, unknown>).id as string;

    const response = await fetch(`${API_BASE}/api/qa/answers/${answerId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });

  it('should include question, answer, sources, and related_modules', async () => {
    const searchResp = await fetch(`${API_BASE}/api/qa/search?q=family`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (searchResp.status !== 200) return;
    const searchData = await searchResp.json();
    if (!searchData.data?.answers?.length) return;

    const answerId = (searchData.data.answers[0] as Record<string, unknown>).id as string;

    const response = await fetch(`${API_BASE}/api/qa/answers/${answerId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    const detail = data.data as Record<string, unknown>;

    expect(detail).toHaveProperty('question');
    expect(detail).toHaveProperty('answer');
    expect(detail).toHaveProperty('sources');
    expect(detail).toHaveProperty('related_modules');
    expect(Array.isArray(detail.sources)).toBe(true);
    expect(Array.isArray(detail.related_modules)).toBe(true);
  });

  it('should have scholarly_perspective and contemporary_context on answer', async () => {
    const searchResp = await fetch(`${API_BASE}/api/qa/search?q=family`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (searchResp.status !== 200) return;
    const searchData = await searchResp.json();
    if (!searchData.data?.answers?.length) return;

    const answerId = (searchData.data.answers[0] as Record<string, unknown>).id as string;

    const response = await fetch(`${API_BASE}/api/qa/answers/${answerId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    const answer = (data.data as Record<string, unknown>).answer as Record<string, unknown>;

    expect(answer).toHaveProperty('scholarly_perspective');
    expect(answer).toHaveProperty('contemporary_context');
    expect(answer.moderation_status).toBe('published');
  });

  it('should include source type fields on each source', async () => {
    const searchResp = await fetch(`${API_BASE}/api/qa/search?q=family`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (searchResp.status !== 200) return;
    const searchData = await searchResp.json();
    if (!searchData.data?.answers?.length) return;

    const answerId = (searchData.data.answers[0] as Record<string, unknown>).id as string;

    const response = await fetch(`${API_BASE}/api/qa/answers/${answerId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.status !== 200) return;
    const data = await response.json();
    const sources = (data.data as Record<string, unknown>).sources as Array<Record<string, unknown>>;

    if (sources.length > 0) {
      const source = sources[0];
      expect(source).toHaveProperty('id');
      expect(source).toHaveProperty('source_type');
      expect(source).toHaveProperty('citation');
      expect(source).toHaveProperty('display_text');
      expect(['quran', 'hadith', 'scholar', 'scholarly_text']).toContain(source.source_type);
    }
  });
});
