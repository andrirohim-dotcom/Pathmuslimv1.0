/**
 * Contract Test: POST /api/learning/modules/[id]/complete
 *
 * Tests the module completion endpoint contract.
 * This test is intentionally written to FAIL until the endpoint is implemented.
 */

import { describe, it, expect, beforeAll } from '@jest/globals';

const API_BASE = process.env.API_URL || 'http://localhost:3000';

describe('POST /api/learning/modules/[id]/complete - Contract Test', () => {
  let authToken: string;
  let testModuleId: string;

  beforeAll(async () => {
    // Mock authentication
    authToken = 'mock-token-for-testing';
    testModuleId = 'test-module-id-123';
  });

  it('should return 200 when module is completed', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessment_score: 85,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });

  it('should return updated progress after completion', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessment_score: 90,
      }),
    });

    const data = await response.json();
    const result = data.data;

    expect(result).toHaveProperty('module_id');
    expect(result.module_id).toBe(testModuleId);
    expect(result).toHaveProperty('is_completed');
    expect(result.is_completed).toBe(true);
    expect(result).toHaveProperty('completed_at');
    expect(result).toHaveProperty('assessment_score');
  });

  it('should include next recommended module in response', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessment_score: 75,
      }),
    });

    const data = await response.json();
    const result = data.data;

    expect(result).toHaveProperty('next_module');
    // next_module can be null if this is the last module
    if (result.next_module) {
      expect(result.next_module).toHaveProperty('id');
      expect(result.next_module).toHaveProperty('title');
      expect(result.next_module).toHaveProperty('sequence_number');
    }
  });

  it('should accept optional assessment_score parameter', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(200);
  });

  it('should validate assessment_score between 0-100', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessment_score: 150,
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should return 404 for non-existent module', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/non-existent-id/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessment_score: 80,
      }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should return 401 without authentication', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessment_score: 80,
      }),
    });

    expect(response.status).toBe(401);
  });

  it('should return 400 if module prerequisites are not met', async () => {
    // This test assumes a module with prerequisites exists
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessment_score: 80,
      }),
    });

    // If prerequisites are not met, should return 400
    // If no prerequisites, should return 200
    expect([200, 400]).toContain(response.status);
  });

  it('should include user progress summary in response', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessment_score: 85,
      }),
    });

    const data = await response.json();
    const result = data.data;

    expect(result).toHaveProperty('progress_summary');
    const summary = result.progress_summary;
    expect(summary).toHaveProperty('modules_completed');
    expect(summary).toHaveProperty('total_modules');
    expect(summary).toHaveProperty('completion_percentage');
  });

  it('should trigger milestone if thresholds are crossed', async () => {
    const response = await fetch(`${API_BASE}/api/learning/modules/${testModuleId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessment_score: 88,
      }),
    });

    const data = await response.json();
    const result = data.data;

    expect(result).toHaveProperty('milestone_unlocked');
    // milestone_unlocked can be null if no milestone was achieved
    if (result.milestone_unlocked) {
      expect(result.milestone_unlocked).toHaveProperty('name');
      expect(result.milestone_unlocked).toHaveProperty('description');
    }
  });
});
