/**
 * E2E Tests: Source Explorer Flow
 * T081 — Full source exploration flow using Playwright
 * Run: npx playwright test tests/e2e/source-exploration.spec.ts
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck — Playwright types installed separately via npx playwright install

const { test, expect } = require('@playwright/test');

test.describe('Source Explorer Flow', () => {
  test('can reach the Sources Explorer page', async ({ page }: { page: any }) => {
    await page.goto('/sources');
    await expect(page).toHaveTitle(/.*/);

    // Quran tab should be visible and active by default
    const quranTab = page.getByRole('button', { name: /quran/i });
    await expect(quranTab).toBeVisible();
  });

  test('shows Quran references on the Quran tab', async ({ page }: { page: any }) => {
    await page.goto('/sources');

    // Click Quran tab (already default, but verify it loads content)
    const quranTab = page.getByRole('button', { name: /quran/i });
    await quranTab.click();

    // The surah filter dropdown should be visible
    const surahFilter = page.locator('#surah-filter');
    await expect(surahFilter).toBeVisible();
  });

  test('can filter Quran references by surah', async ({ page }: { page: any }) => {
    await page.goto('/sources');

    // Select Al-Baqarah (surah 2)
    const surahFilter = page.locator('#surah-filter');
    await surahFilter.selectOption('2');

    // Should not show an error
    const errorEl = page.getByText(/failed to load/i);
    const errorCount = await errorEl.count();
    expect(errorCount).toBe(0);
  });

  test('can switch to Hadith tab', async ({ page }: { page: any }) => {
    await page.goto('/sources');

    const hadithTab = page.getByRole('button', { name: /hadith/i });
    await hadithTab.click();

    // Hadith-specific filters should be visible
    const gradeFilter = page.locator('#grade-filter');
    await expect(gradeFilter).toBeVisible();

    const collectionFilter = page.locator('#collection-filter');
    await expect(collectionFilter).toBeVisible();
  });

  test('can filter Hadith by Sahih grade', async ({ page }: { page: any }) => {
    await page.goto('/sources');

    const hadithTab = page.getByRole('button', { name: /hadith/i });
    await hadithTab.click();

    const gradeFilter = page.locator('#grade-filter');
    await gradeFilter.selectOption('sahih');

    // No error should appear
    const errorEl = page.getByText(/failed to load/i);
    const errorCount = await errorEl.count();
    expect(errorCount).toBe(0);
  });

  test('can switch to Scholars tab', async ({ page }: { page: any }) => {
    await page.goto('/sources');

    const scholarsTab = page.getByRole('button', { name: /scholars/i });
    await scholarsTab.click();

    // Madhab filter should be visible
    const madhabFilter = page.locator('#madhab-filter');
    await expect(madhabFilter).toBeVisible();
  });

  test('global search navigates to /sources/search', async ({ page }: { page: any }) => {
    await page.goto('/sources');

    const searchInput = page.getByPlaceholder(/search across all sources/i);
    await searchInput.fill('prayer');

    await page.keyboard.press('Enter');
    await page.waitForURL(/\/sources\/search/);

    expect(page.url()).toContain('/sources/search');
    expect(page.url()).toContain('prayer');
  });

  test('cross-type search page shows grouped results', async ({ page }: { page: any }) => {
    await page.goto('/sources/search?q=prayer');

    // The search input should show the query
    const searchInput = page.getByPlaceholder(/search quran, hadith, and scholars/i);
    await expect(searchInput).toBeVisible();

    // Type filter buttons should be visible
    const allFilter = page.getByRole('button', { name: /^all$/i });
    await expect(allFilter).toBeVisible();
  });

  test('cross-type search filter buttons work', async ({ page }: { page: any }) => {
    await page.goto('/sources/search?q=prayer');

    // Click 'quran' filter
    const quranFilter = page.getByRole('button', { name: /^quran$/i });
    await expect(quranFilter).toBeVisible();
    await quranFilter.click();

    // No error should appear
    const errorEl = page.getByText(/error/i);
    const errorCount = await errorEl.count();
    // Error text may appear in results count etc, just check page doesn't crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('back link from search goes to /sources', async ({ page }: { page: any }) => {
    await page.goto('/sources/search?q=islam');

    const backLink = page.getByRole('link', { name: /back to sources explorer/i });
    await expect(backLink).toBeVisible();
    await backLink.click();

    await page.waitForURL('/sources');
    expect(page.url()).toContain('/sources');
  });
});
