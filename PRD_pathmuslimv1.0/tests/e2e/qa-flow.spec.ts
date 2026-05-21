/**
 * E2E Tests: Q&A User Flow
 * T061 — Full Q&A flow using Playwright
 * Run: npx playwright test tests/e2e/qa-flow.spec.ts
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck — Playwright types installed separately via npx playwright install

const { test, expect } = require('@playwright/test');

test.describe('Q&A Knowledge Base Flow', () => {
  test.beforeEach(async ({ page }: { page: any }) => {
    await page.goto('/qa/search');
  });

  test('can reach the Q&A search page', async ({ page }: { page: any }) => {
    await expect(page).toHaveTitle(/.*/);
    // The search input should be present
    const input = page.getByPlaceholder(/search questions/i);
    await expect(input).toBeVisible();
  });

  test('can type a search query', async ({ page }: { page: any }) => {
    const searchInput = page.getByPlaceholder(/search questions/i);
    await searchInput.fill('family');
    await page.waitForTimeout(400);
    // No error should appear on the page
    const errorEl = page.getByText(/error/i);
    const errorCount = await errorEl.count();
    expect(errorCount).toBe(0);
  });

  test('can click Ask a Question button', async ({ page }: { page: any }) => {
    await page.getByRole('button', { name: /Ask a Question/i }).click();
    await expect(
      page.getByRole('heading', { name: /Ask a Question/i })
    ).toBeVisible({ timeout: 3000 });
  });

  test('ask form shows validation error for short title', async ({ page }: { page: any }) => {
    await page.goto('/qa/ask');
    await page.getByPlaceholder(/e\.g\. How do I handle/i).fill('Short');
    await page.getByPlaceholder(/Provide context/i).fill('Too short');
    await page.getByRole('button', { name: /Submit Question/i }).click();
    await expect(page.getByText(/must be at least/i)).toBeVisible({ timeout: 3000 });
  });

  test('categories page loads', async ({ page }: { page: any }) => {
    await page.goto('/qa/categories');
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: /Q&A Categories/i })).toBeVisible();
  });

  test('can navigate from categories to search with filter', async ({ page }: { page: any }) => {
    await page.goto('/qa/categories');
    await page.waitForTimeout(1000);
    // Click the first category card
    const firstCard = page.locator('.grid > a').first();
    const count = await firstCard.count();
    if (count > 0) {
      await firstCard.click();
      await expect(page).toHaveURL(/\/qa\/search/);
    }
  });
});
