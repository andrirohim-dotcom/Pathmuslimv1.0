/**
 * Contract Test: GET /api/learning/modules/[id]
 *
 * Tests the module detail endpoint contract.
 * This test is intentionally written to FAIL until the endpoint is implemented.
 */

import { describe, it, expect, beforeAll } from '@jest/globals';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

describe('GET /api/learning/modules/[id] - Contract Test', () => {
  let authToken: string;
  let testModuleId: string;

  beforeAll(async () => {
    // Mock authentication
    authToken = 'mock-token-for-testing';
    testModuleId = 'test-module-id-123';
  });

  it('should return 200 with module detail', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(typeof data.data).toBe('object');
    expect(data.data).not.toBeNull();
  });

  it('should include module detail fields', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const module = data.data;

    // Required fields
    expect(module).toHaveProperty('id');
    expect(module).toHaveProperty('title');
    expect(module).toHaveProperty('description');
    expect(module).toHaveProperty('sequence_number');
    expect(module).toHaveProperty('level');
    expect(module).toHaveProperty('estimated_hours');
    expect(module).toHaveProperty('learning_objectives');
    expect(Array.isArray(module.learning_objectives)).toBe(true);
    expect(module).toHaveProperty('content');
    expect(typeof module.content).toBe('string');
    expect(module).toHaveProperty('prerequisites');
    expect(Array.isArray(module.prerequisites)).toBe(true);
  });

  it('should include source references', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const module = data.data;

    expect(module).toHaveProperty('sources');
    expect(Array.isArray(module.sources)).toBe(true);

    if (module.sources.length > 0) {
      const source = module.sources[0];
      expect(source).toHaveProperty('id');
      expect(source).toHaveProperty('source_type');
      expect(['quran', 'hadith', 'scholar', 'scholarly_text']).toContain(source.source_type);
      expect(source).toHaveProperty('citation');
      expect(source).toHaveProperty('display_text');
    }
  });

  it('should include user progress data', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const module = data.data;

    expect(module).toHaveProperty('is_locked');
    expect(typeof module.is_locked).toBe('boolean');
    expect(module).toHaveProperty('is_completed');
    expect(typeof module.is_completed).toBe('boolean');
    expect(module).toHaveProperty('completion_percentage');
    expect(typeof module.completion_percentage).toBe('number');
  });

  it('should return 404 for non-existent module', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/non-existent-id`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it('should return 401 without authentication', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(401);
  });

  it('should return prerequisites as module objects', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const module = data.data;

    if (module.prerequisites && module.prerequisites.length > 0) {
      const prereq = module.prerequisites[0];
      expect(prereq).toHaveProperty('id');
      expect(prereq).toHaveProperty('title');
      expect(prereq).toHaveProperty('sequence_number');
    }
  });
});
