/**
 * Contract Test: GET /api/learning/modules
 *
 * Tests the learning modules list endpoint contract.
 * This test is intentionally written to FAIL until the endpoint is implemented.
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

describe('GET /api/learning/modules - Contract Test', () => {
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Mock authentication for testing
    // In real tests, this would use test credentials from environment
    testUserId = 'test-user-123';
    authToken = 'mock-token-for-testing';
  });

  afterAll(async () => {
    // Cleanup if needed
  });

  it('should return 200 with modules list', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should return modules with required fields', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const module = data.data[0];

      // Required fields per spec
      expect(module).toHaveProperty('id');
      expect(module).toHaveProperty('title');
      expect(module).toHaveProperty('description');
      expect(module).toHaveProperty('sequence_number');
      expect(module).toHaveProperty('level');
      expect(module).toHaveProperty('estimated_hours');
      expect(module).toHaveProperty('learning_objectives');
      expect(module).toHaveProperty('prerequisites');
      expect(module).toHaveProperty('is_locked');
      expect(module).toHaveProperty('is_completed');
      expect(module).toHaveProperty('completion_percentage');
    }
  });

  it('should include pagination metadata', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules?page=1&limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    expect(data.metadata).toBeDefined();
    expect(data.metadata).toHaveProperty('total');
    expect(data.metadata).toHaveProperty('page');
    expect(data.metadata).toHaveProperty('limit');
  });

  it('should respect pagination parameters', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules?page=1&limit=5`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    expect(data.data.length).toBeLessThanOrEqual(5);
    expect(data.metadata.limit).toBe(5);
  });

  it('should return 401 without authentication', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status).toBe(401);
  });

  it('should include user progress for each module', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const module = data.data[0];
      expect(typeof module.is_locked).toBe('boolean');
      expect(typeof module.is_completed).toBe('boolean');
      expect(typeof module.completion_percentage).toBe('number');
      expect(module.completion_percentage).toBeGreaterThanOrEqual(0);
      expect(module.completion_percentage).toBeLessThanOrEqual(100);
    }
  });
});
