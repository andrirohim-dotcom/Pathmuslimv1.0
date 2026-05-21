/**
 * Integration Tests: Q&A API Endpoints
 * T060 — Tests for GET /api/qa/search and POST /api/qa/questions
 * These tests hit the live server (requires it to be running at API_URL or localhost:3000)
 */

import { describe, it, expect } from '@jest/globals';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

describe('GET /api/qa/search', () => {
  it('should return 200 with results for valid query', async () => {
    const response = await fetch(`${API_BASE}/api/qa/search?q=family`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data.answers)).toBe(true);
    expect(typeof data.data.total).toBe('number');
    expect(typeof data.data.page).toBe('number');
    expect(data.query).toBe('family');
  });

  it('should return 400 when q param is missing and no category provided', async () => {
    const response = await fetch(`${API_BASE}/api/qa/search`);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should return 400 for q that is too short', async () => {
    const response = await fetch(`${API_BASE}/api/qa/search?q=a`);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should return 200 when browsing by category without q', async () => {
    const response = await fetch(`${API_BASE}/api/qa/search?category=family`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.category).toBe('family');
  });

  it('should paginate results', async () => {
    const response = await fetch(`${API_BASE}/api/qa/search?q=&category=family&page=1&limit=5`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.answers.length).toBeLessThanOrEqual(5);
  });
});

describe('POST /api/qa/questions', () => {
  it('should return 201 with tracking_id for valid submission', async () => {
    const uniqueTitle = `How do I handle Eid celebrations as a new Muslim ${Date.now()}?`;
    const response = await fetch(`${API_BASE}/api/qa/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: uniqueTitle,
        content:
          'I want to celebrate Eid with my Muslim community but my non-Muslim family also wants to celebrate with me. How do I balance both in an Islamic way?',
        category: 'family',
        is_sensitive: false,
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.tracking_id).toBeDefined();
    expect(data.data.status).toBe('pending');
    expect(typeof data.data.message).toBe('string');
  });

  it('should return 400 for title too short', async () => {
    const response = await fetch(`${API_BASE}/api/qa/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Short',
        content: 'This content is long enough to pass validation easily.',
        category: 'family',
        is_sensitive: false,
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should return 400 for invalid category', async () => {
    const response = await fetch(`${API_BASE}/api/qa/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'A question with a valid length title',
        content: 'This content is long enough to pass validation easily with more text.',
        category: 'invalid_category',
        is_sensitive: false,
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should return 400 when required fields are missing', async () => {
    const response = await fetch(`${API_BASE}/api/qa/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Only title provided' }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });
});

describe('GET /api/qa/categories', () => {
  it('should return 200 with categories list', async () => {
    const response = await fetch(`${API_BASE}/api/qa/categories`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data.categories)).toBe(true);
    expect(data.data.categories.length).toBeGreaterThan(0);
  });

  it('should include required category fields', async () => {
    const response = await fetch(`${API_BASE}/api/qa/categories`);
    expect(response.status).toBe(200);
    const data = await response.json();
    const firstCategory = data.data.categories[0] as Record<string, unknown>;
    expect(firstCategory).toHaveProperty('id');
    expect(firstCategory).toHaveProperty('name');
    expect(firstCategory).toHaveProperty('description');
    expect(firstCategory).toHaveProperty('answered_count');
    expect(firstCategory).toHaveProperty('pending_count');
  });
});
