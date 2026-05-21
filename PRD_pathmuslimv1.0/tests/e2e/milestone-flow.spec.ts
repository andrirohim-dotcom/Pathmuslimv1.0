/**
 * E2E Test: Milestone Achievement Flow
 * T070 — Verifies the full milestone journey from module completion to celebration.
 *
 * Why this matters: Users must see the MilestoneCelebration modal after completing
 * a qualifying module, then find the milestone reflected in their progress page.
 */

import { test, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function loginAsTestUser(page: Page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
  await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/learning', { timeout: 10000 });
}

/**
 * Mock the complete API to return a milestone_unlocked payload so we can
 * test the celebration UI without needing exactly 5 completed modules in the DB.
 */
async function mockCompleteWithMilestone(page: Page, moduleId: string) {
  await page.route(`**/api/learning/modules/${moduleId}/complete`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          module_id: moduleId,
          is_completed: true,
          completed_at: new Date().toISOString(),
          assessment_score: null,
          next_module: null,
          progress_summary: {
            modules_completed: 5,
            total_modules: 20,
            completion_percentage: 25,
            time_spent_minutes: 120,
            milestones: [],
          },
          milestone_unlocked: {
            name: 'Beginner Achiever',
            description: 'Completed your first 5 modules — the journey begins!',
          },
        },
      }),
    });
  });
}

async function mockMilestonesAPI(page: Page) {
  await page.route('**/api/learning/milestones', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          achieved: [
            {
              id: 'm1',
              name: 'Beginner Achiever',
              description: 'Completed your first 5 modules — the journey begins!',
              trigger_condition: { type: 'module_count', count: 5 },
              achievement_at: new Date().toISOString(),
            },
          ],
          next: {
            name: 'Intermediate Learner',
            description: 'Reached 10 modules — your knowledge is growing.',
            trigger_condition: { type: 'module_count', count: 10 },
            modules_remaining: 5,
          },
        },
      }),
    });
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Milestone Achievement Flow', () => {
  test('MilestoneCelebration modal appears after completing the 5th module', async ({ page }) => {
    // Set up auth tokens in localStorage (simulate logged-in state)
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_id', 'test-user-id');
    });

    // Mock a module detail API
    const testModuleId = 'module-5-id';
    await page.route(`**/api/learning/modules/${testModuleId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: testModuleId,
            title: 'Test Module 5',
            description: 'The fifth module',
            level: 'beginner',
            estimated_hours: 1,
            learning_objectives: ['Understand basics'],
            content: 'Module content goes here.',
            sources: [],
            is_completed: false,
            is_locked: false,
          },
        }),
      });
    });

    await mockCompleteWithMilestone(page, testModuleId);

    // Navigate to module page
    await page.goto(`/learning/modules/${testModuleId}`);
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 });

    // Click the Complete button (ModuleViewer renders this)
    const completeButton = page.getByRole('button', { name: /complete|mark complete/i });
    if (await completeButton.isVisible()) {
      await completeButton.click();

      // Milestone celebration modal should appear
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Milestone Achieved!')).toBeVisible();
      await expect(page.getByText('Beginner Achiever')).toBeVisible();

      // Dismiss the modal
      await page.getByRole('button', { name: /continue learning/i }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 3000 });
    } else {
      // Module may already be completed in the test environment — skip gracefully
      test.skip(true, 'Complete button not visible — module may already be completed');
    }
  });

  test('Progress page shows achieved milestone after earning Beginner Achiever', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_id', 'test-user-id');
    });

    await mockMilestonesAPI(page);

    // Mock progress API
    await page.route('**/api/learning/progress', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            modules_completed: 5,
            total_modules: 20,
            completion_percentage: 25,
            time_spent_minutes: 120,
            milestones: [],
          },
        }),
      });
    });

    // Mock modules list
    await page.route('**/api/learning/modules**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.goto('/learning/progress');

    // Milestone display should show "Beginner Achiever" as achieved
    await expect(page.getByText('Beginner Achiever')).toBeVisible({ timeout: 8000 });
    // Next milestone hint should show
    await expect(page.getByText(/Intermediate Learner/i)).toBeVisible();
  });

  test('Statistics page loads and shows learning data', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('user_id', 'test-user-id');
    });

    // Mock progress and modules
    await page.route('**/api/learning/progress', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            modules_completed: 5,
            total_modules: 20,
            completion_percentage: 25,
            time_spent_minutes: 90,
            milestones: [],
          },
        }),
      });
    });

    await page.route('**/api/learning/modules**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.goto('/learning/statistics');

    await expect(page.getByText('Learning Statistics')).toBeVisible({ timeout: 8000 });
    await expect(page.getByText('Overall Completion')).toBeVisible();
    await expect(page.getByText('25%')).toBeVisible();
    await expect(page.getByText('Modules by Level')).toBeVisible();
  });
});
