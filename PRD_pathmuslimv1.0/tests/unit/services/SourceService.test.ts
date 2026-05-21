/**
 * Unit Tests: SourceService
 * T080 — Tests for source filtering, search, and pagination.
 *
 * Why these behaviors matter:
 *  - searchSources with type filter must only return sources of that type.
 *  - getQuranSources must filter by surah_number when surah is provided.
 *  - getHadithSources grade filter must apply ilike on authentication_grade.
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// ---------------------------------------------------------------------------
// Mock @supabase/supabase-js so SourceService can import without env vars.
// The test injects a mock supabase directly into the service constructor.
// ---------------------------------------------------------------------------
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => {
    throw new Error('createClient must not be called without injection in tests');
  }),
}));

import { SourceService } from '@/lib/services/SourceService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeBuilder(resolved: { data: unknown[] | null; error: Error | null; count: number }) {
  const builder: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    not: jest.fn(),  // set below after builder is created, to return a resolved promise
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockResolvedValue(resolved),
    single: jest.fn().mockResolvedValue(resolved),
  };
  // _attachModuleCounts awaits .select().not() directly (no .range()), so the
  // builder itself must be thenable after not() is called.
  const thenableChain: any = {
    ...builder,
    then: (resolve: (v: typeof resolved) => unknown) => Promise.resolve(resolved).then(resolve),
    catch: (fn: (e: Error) => unknown) => Promise.resolve(resolved).catch(fn),
  };
  builder.not = jest.fn().mockReturnValue(thenableChain);
  return builder;
}

function makeFakeSupabase(sourcesBuilder: any, modulesBuilder: any) {
  return {
    from: jest.fn((table: string) => {
      if (table === 'source_references') return sourcesBuilder;
      return modulesBuilder;
    }),
  } as any;
}

function makeSource(overrides: Record<string, unknown> = {}) {
  return {
    id: 'src-1',
    source_type: 'quran',
    citation: 'Quran 2:255',
    display_text: 'Allah — there is no deity except Him',
    translation: 'Allah, there is no deity worthy of worship except Him',
    context: 'Ayat al-Kursi',
    source_metadata: { surah: 'Al-Baqarah', surah_number: 2, verse_start: 255 },
    created_at: new Date().toISOString(),
    created_by: null,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests: searchSources
// ---------------------------------------------------------------------------

describe('SourceService.searchSources', () => {
  it('applies source_type filter when type=quran is provided', async () => {
    const sourcesBuilder = makeBuilder({ data: [makeSource()], error: null, count: 1 });
    const modulesBuilder = makeBuilder({ data: [], error: null, count: 0 });

    const service = new SourceService(makeFakeSupabase(sourcesBuilder, modulesBuilder));
    const result = await service.searchSources('Allah', { type: 'quran' });

    expect(result.items).toHaveLength(1);
    expect(sourcesBuilder.eq).toHaveBeenCalledWith('source_type', 'quran');
  });

  it('returns correct page and total from resolved data', async () => {
    const sources = [makeSource(), makeSource({ id: 'src-2', citation: 'Quran 1:1' })];
    const sourcesBuilder = makeBuilder({ data: sources, error: null, count: 25 });
    const modulesBuilder = makeBuilder({ data: [], error: null, count: 0 });

    const service = new SourceService(makeFakeSupabase(sourcesBuilder, modulesBuilder));
    const result = await service.searchSources('', { page: 2, limit: 10 });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.total).toBe(25);
  });

  it('attaches module_count and module_ids from learning_modules', async () => {
    const source = makeSource({ id: 'src-abc' });
    const module = { id: 'mod-1', source_ids: ['src-abc'] };

    const sourcesBuilder = makeBuilder({ data: [source], error: null, count: 1 });
    const modulesBuilder = makeBuilder({ data: [module], error: null, count: 1 });

    const service = new SourceService(makeFakeSupabase(sourcesBuilder, modulesBuilder));
    const result = await service.searchSources('');

    expect(result.items[0].module_count).toBe(1);
    expect(result.items[0].module_ids).toContain('mod-1');
  });

  it('returns module_count=0 when source is not referenced by any module', async () => {
    const source = makeSource({ id: 'src-unreferenced' });
    const module = { id: 'mod-1', source_ids: ['src-other'] };

    const sourcesBuilder = makeBuilder({ data: [source], error: null, count: 1 });
    const modulesBuilder = makeBuilder({ data: [module], error: null, count: 1 });

    const service = new SourceService(makeFakeSupabase(sourcesBuilder, modulesBuilder));
    const result = await service.searchSources('');

    expect(result.items[0].module_count).toBe(0);
    expect(result.items[0].module_ids).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Tests: getQuranSources
// ---------------------------------------------------------------------------

describe('SourceService.getQuranSources', () => {
  it('filters by surah_number when surah option is provided', async () => {
    const sourcesBuilder = makeBuilder({ data: [], error: null, count: 0 });
    const modulesBuilder = makeBuilder({ data: [], error: null, count: 0 });

    const service = new SourceService(makeFakeSupabase(sourcesBuilder, modulesBuilder));
    await service.getQuranSources({ surah: 2 });

    expect(sourcesBuilder.eq).toHaveBeenCalledWith('source_type', 'quran');
    expect(sourcesBuilder.eq).toHaveBeenCalledWith('source_metadata->>surah_number', '2');
  });

  it('does not apply surah filter when surah is not provided', async () => {
    const sourcesBuilder = makeBuilder({ data: [], error: null, count: 0 });
    const modulesBuilder = makeBuilder({ data: [], error: null, count: 0 });

    const service = new SourceService(makeFakeSupabase(sourcesBuilder, modulesBuilder));
    await service.getQuranSources({});

    const eqCalls: unknown[][] = sourcesBuilder.eq.mock.calls;
    const surahCalls = eqCalls.filter(
      (args) => typeof args[0] === 'string' && args[0].includes('surah_number')
    );
    expect(surahCalls).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Tests: getHadithSources
// ---------------------------------------------------------------------------

describe('SourceService.getHadithSources', () => {
  it('applies grade ilike filter when grade=sahih is provided', async () => {
    const sahihSource = makeSource({
      source_type: 'hadith',
      source_metadata: { collection: 'Bukhari', authentication_grade: 'Sahih' },
    });
    const sourcesBuilder = makeBuilder({ data: [sahihSource], error: null, count: 1 });
    const modulesBuilder = makeBuilder({ data: [], error: null, count: 0 });

    const service = new SourceService(makeFakeSupabase(sourcesBuilder, modulesBuilder));
    const result = await service.getHadithSources({ grade: 'sahih' });

    expect(sourcesBuilder.ilike).toHaveBeenCalledWith(
      'source_metadata->>authentication_grade',
      '%sahih%'
    );
    expect(result.items).toHaveLength(1);
  });

  it('applies collection ilike filter when collection is provided', async () => {
    const sourcesBuilder = makeBuilder({ data: [], error: null, count: 0 });
    const modulesBuilder = makeBuilder({ data: [], error: null, count: 0 });

    const service = new SourceService(makeFakeSupabase(sourcesBuilder, modulesBuilder));
    await service.getHadithSources({ collection: 'bukhari' });

    expect(sourcesBuilder.ilike).toHaveBeenCalledWith(
      'source_metadata->>collection',
      '%bukhari%'
    );
  });

  it('does not apply grade filter when no grade is provided', async () => {
    const sourcesBuilder = makeBuilder({ data: [], error: null, count: 0 });
    const modulesBuilder = makeBuilder({ data: [], error: null, count: 0 });

    const service = new SourceService(makeFakeSupabase(sourcesBuilder, modulesBuilder));
    await service.getHadithSources({});

    const ilikeCalls: unknown[][] = sourcesBuilder.ilike.mock.calls;
    const gradeCalls = ilikeCalls.filter(
      (args) => typeof args[0] === 'string' && args[0].includes('authentication_grade')
    );
    expect(gradeCalls).toHaveLength(0);
  });
});
