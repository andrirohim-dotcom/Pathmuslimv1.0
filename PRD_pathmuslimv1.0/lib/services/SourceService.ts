/**
 * SourceService
 * Business logic and data access for source references
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SourceReference, SourceType } from '@/lib/types';

function buildClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SourceWithModuleCount extends SourceReference {
  module_count: number;
  module_ids: string[];
}

export class SourceService {
  private supabase: SupabaseClient;

  constructor(supabase?: SupabaseClient) {
    this.supabase = supabase ?? buildClient();
  }

  /**
   * Search sources by text query, optionally filtered by type
   */
  async searchSources(
    query: string,
    options: {
      type?: 'quran' | 'hadith' | 'scholar';
      page?: number;
      limit?: number;
    } = {}
  ): Promise<PaginatedResult<SourceWithModuleCount>> {
    const supabase = this.supabase;
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const offset = (page - 1) * limit;

    let q = supabase
      .from('source_references')
      .select('*', { count: 'exact' });

    if (options.type) {
      q = q.eq('source_type', options.type);
    }

    if (query && query.trim().length > 0) {
      const term = query.trim();
      q = q.or(
        `citation.ilike.%${term}%,display_text.ilike.%${term}%,translation.ilike.%${term}%`
      );
    }

    q = q.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, error, count } = await q;
    if (error) throw error;

    const sources = await this._attachModuleCounts(data ?? []);
    return { items: sources, total: count ?? 0, page, limit };
  }

  /**
   * Get all sources referenced by a module
   */
  async getSourcesByModule(moduleId: string): Promise<SourceReference[]> {
    const supabase = this.supabase;

    const { data: module, error: moduleError } = await supabase
      .from('learning_modules')
      .select('source_ids')
      .eq('id', moduleId)
      .single();

    if (moduleError) throw moduleError;
    if (!module?.source_ids?.length) return [];

    const { data, error } = await supabase
      .from('source_references')
      .select('*')
      .in('id', module.source_ids);

    if (error) throw error;
    return data ?? [];
  }

  /**
   * Get Quran sources with optional surah filter
   */
  async getQuranSources(
    options: { surah?: number; page?: number; limit?: number } = {}
  ): Promise<PaginatedResult<SourceWithModuleCount>> {
    const supabase = this.supabase;
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const offset = (page - 1) * limit;

    let q = supabase
      .from('source_references')
      .select('*', { count: 'exact' })
      .eq('source_type', SourceType.Quran);

    if (options.surah !== undefined) {
      // Filter by surah number stored in source_metadata
      q = q.eq('source_metadata->>surah_number', String(options.surah));
    }

    q = q.order('created_at', { ascending: true }).range(offset, offset + limit - 1);

    const { data, error, count } = await q;
    if (error) throw error;

    const sources = await this._attachModuleCounts(data ?? []);
    return { items: sources, total: count ?? 0, page, limit };
  }

  /**
   * Get Hadith sources with optional collection and grade filters
   */
  async getHadithSources(
    options: { collection?: string; grade?: string; page?: number; limit?: number } = {}
  ): Promise<PaginatedResult<SourceWithModuleCount>> {
    const supabase = this.supabase;
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const offset = (page - 1) * limit;

    let q = supabase
      .from('source_references')
      .select('*', { count: 'exact' })
      .eq('source_type', SourceType.Hadith);

    if (options.collection) {
      q = q.ilike('source_metadata->>collection', `%${options.collection}%`);
    }

    if (options.grade) {
      q = q.ilike('source_metadata->>authentication_grade', `%${options.grade}%`);
    }

    q = q.order('created_at', { ascending: true }).range(offset, offset + limit - 1);

    const { data, error, count } = await q;
    if (error) throw error;

    const sources = await this._attachModuleCounts(data ?? []);
    return { items: sources, total: count ?? 0, page, limit };
  }

  /**
   * Get Scholar sources with optional madhab filter
   */
  async getScholarSources(
    options: { madhab?: string; page?: number; limit?: number } = {}
  ): Promise<PaginatedResult<SourceWithModuleCount>> {
    const supabase = this.supabase;
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const offset = (page - 1) * limit;

    let q = supabase
      .from('source_references')
      .select('*', { count: 'exact' })
      .in('source_type', [SourceType.Scholar, SourceType.ScholarlyText]);

    if (options.madhab) {
      q = q.ilike('source_metadata->>madhab', `%${options.madhab}%`);
    }

    q = q.order('created_at', { ascending: true }).range(offset, offset + limit - 1);

    const { data, error, count } = await q;
    if (error) throw error;

    const sources = await this._attachModuleCounts(data ?? []);
    return { items: sources, total: count ?? 0, page, limit };
  }

  /**
   * Attach module_count and module_ids to each source
   */
  private async _attachModuleCounts(
    sources: SourceReference[]
  ): Promise<SourceWithModuleCount[]> {
    if (sources.length === 0) return [];

    const supabase = this.supabase;
    const sourceIds = sources.map((s) => s.id);

    // Query all modules that reference these sources via source_ids JSONB array
    const { data: modules } = await supabase
      .from('learning_modules')
      .select('id, source_ids')
      .not('published_at', 'is', null);

    const modulesBySrc = new Map<string, string[]>();

    for (const mod of modules ?? []) {
      const ids: string[] = Array.isArray(mod.source_ids) ? mod.source_ids : [];
      for (const sid of ids) {
        if (sourceIds.includes(sid)) {
          const existing = modulesBySrc.get(sid) ?? [];
          existing.push(mod.id);
          modulesBySrc.set(sid, existing);
        }
      }
    }

    return sources.map((source) => {
      const modIds = modulesBySrc.get(source.id) ?? [];
      return {
        ...source,
        module_count: modIds.length,
        module_ids: modIds,
      };
    });
  }
}
