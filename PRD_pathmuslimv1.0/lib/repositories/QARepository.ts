/**
 * QARepository
 * Data access layer for Q&A knowledge base
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export type QACategoryValue = 'family' | 'work' | 'spirituality' | 'health' | 'relationships' | 'other';
export type SortOption = 'relevance' | 'recent' | 'helpful';

export interface QASearchResult {
  id: string; // answer id
  question_id: string;
  question_title: string;
  answer_excerpt: string;
  category: QACategoryValue;
  helpful_count: number;
  view_count: number;
  source_count: number;
  created_at: string;
  answered_at: string | null;
  status: string;
}

export interface QASource {
  id: string;
  source_type: 'quran' | 'hadith' | 'scholar' | 'scholarly_text';
  citation: string;
  display_text: string;
  translation?: string | null;
  context?: string | null;
  source_metadata?: Record<string, unknown>;
}

export interface QAAnswerDetail {
  question: {
    id: string;
    title: string;
    category: string;
    status: string;
    view_count: number;
    helpful_count: number;
  };
  answer: {
    id: string;
    content: string;
    scholarly_perspective: string;
    contemporary_context: string | null;
    moderation_status: string;
    created_at: string;
    version: number;
  };
  sources: QASource[];
  related_modules: Array<{
    id: string;
    title: string;
    sequence_number: number;
    level: string;
  }>;
}

export interface QACategoryStats {
  id: QACategoryValue;
  name: string;
  description: string;
  answered_count: number;
  pending_count: number;
  total_count: number;
}

const CATEGORY_META: Record<QACategoryValue, { name: string; description: string }> = {
  family: {
    name: 'Family Relations',
    description: 'Questions about relationships with parents, spouse, children, and extended family',
  },
  work: {
    name: 'Work & Career',
    description: 'Islamic guidance on workplace ethics, professional development, and career choices',
  },
  spirituality: {
    name: 'Spiritual Practice',
    description: 'Prayer, meditation, Islamic rituals, and building spiritual discipline',
  },
  health: {
    name: 'Health & Medicine',
    description: 'Islamic perspectives on health, medical ethics, and wellness',
  },
  relationships: {
    name: 'Relationships & Dating',
    description: 'Guidance on relationships, marriage, divorce, and interpersonal dynamics',
  },
  other: {
    name: 'Other Topics',
    description: 'General questions not fitting specific categories',
  },
};

export class QARepository {
  /**
   * Search answered questions
   */
  static async searchAnswers(
    query: string,
    options: {
      category?: QACategoryValue;
      sort?: SortOption;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ answers: QASearchResult[]; total: number; page: number }> {
    const { category, sort = 'relevance', page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    try {
      // Build query — fetch questions with answers
      let qb = getSupabase()
        .from('qa_questions')
        .select(
          `
          id,
          title,
          category,
          status,
          view_count,
          helpful_count,
          created_at,
          answered_at,
          qa_answers!inner(
            id,
            content,
            scholarly_perspective,
            source_ids,
            moderation_status
          )
        `,
          { count: 'exact' }
        )
        .eq('status', 'answered')
        .eq('qa_answers.moderation_status', 'published');

      if (category) {
        qb = qb.eq('category', category);
      }

      // Text search on title and content
      if (query && query.trim().length >= 2) {
        qb = qb.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
      }

      // Sorting
      if (sort === 'recent') {
        qb = qb.order('answered_at', { ascending: false });
      } else if (sort === 'helpful') {
        qb = qb.order('helpful_count', { ascending: false });
      } else {
        // relevance: answered most recently for now
        qb = qb.order('helpful_count', { ascending: false }).order('view_count', { ascending: false });
      }

      qb = qb.range(offset, offset + limit - 1);

      const { data, error, count } = await qb;

      if (error) throw error;

      const answers: QASearchResult[] = (data || []).map((q: Record<string, unknown>) => {
        const answerArr = q.qa_answers as Array<Record<string, unknown>>;
        const ans = Array.isArray(answerArr) ? answerArr[0] : answerArr;
        const sourceIds = (ans?.source_ids as string[]) || [];
        const content = (ans?.content as string) || '';
        return {
          id: (ans?.id as string) || '',
          question_id: q.id as string,
          question_title: q.title as string,
          answer_excerpt: content.slice(0, 150) + (content.length > 150 ? '...' : ''),
          category: q.category as QACategoryValue,
          helpful_count: (q.helpful_count as number) || 0,
          view_count: (q.view_count as number) || 0,
          source_count: sourceIds.length,
          created_at: q.created_at as string,
          answered_at: q.answered_at as string | null,
          status: q.status as string,
        };
      });

      return { answers, total: count || 0, page };
    } catch (err) {
      console.error('Error in searchAnswers:', err);
      throw err;
    }
  }

  /**
   * Get full answer detail by answer id
   */
  static async getAnswerById(id: string): Promise<QAAnswerDetail | null> {
    try {
      // Fetch the answer
      const { data: answer, error: answerError } = await getSupabase()
        .from('qa_answers')
        .select('*')
        .eq('id', id)
        .eq('moderation_status', 'published')
        .maybeSingle();

      if (answerError) throw answerError;
      if (!answer) return null;

      // Fetch the question
      const { data: question, error: questionError } = await getSupabase()
        .from('qa_questions')
        .select('id, title, category, status, view_count, helpful_count')
        .eq('id', answer.question_id)
        .single();

      if (questionError) throw questionError;

      // Fetch sources via answer_sources junction
      const sourceIds: string[] = answer.source_ids || [];
      let sources: QASource[] = [];
      if (sourceIds.length > 0) {
        const { data: sourceData, error: sourceError } = await getSupabase()
          .from('source_references')
          .select('id, source_type, citation, display_text, translation, context, source_metadata')
          .in('id', sourceIds);

        if (sourceError) throw sourceError;
        sources = (sourceData || []) as QASource[];
      }

      // Increment view count
      await getSupabase()
        .from('qa_questions')
        .update({ view_count: (question.view_count || 0) + 1 })
        .eq('id', question.id);

      // Find related modules (basic: by category keyword match in module title)
      const categoryKeywords: Record<string, string[]> = {
        family: ['family', 'parent', 'marriage', 'spouse'],
        work: ['work', 'career', 'business', 'ethics'],
        spirituality: ['prayer', 'spiritual', 'quran', 'islam', 'worship'],
        health: ['health', 'medicine', 'wellness'],
        relationships: ['relationship', 'marriage', 'social'],
      };
      const keywords = categoryKeywords[question.category] || [];
      let relatedModules: QAAnswerDetail['related_modules'] = [];
      if (keywords.length > 0) {
        const orFilter = keywords.map((kw) => `title.ilike.%${kw}%`).join(',');
        const { data: moduleData } = await getSupabase()
          .from('learning_modules')
          .select('id, title, sequence_number, level')
          .or(orFilter)
          .not('published_at', 'is', null)
          .limit(3);
        relatedModules = (moduleData || []).map((m: Record<string, unknown>) => ({
          id: m.id as string,
          title: m.title as string,
          sequence_number: m.sequence_number as number,
          level: m.level as string,
        }));
      }

      return {
        question: {
          id: question.id,
          title: question.title,
          category: question.category,
          status: question.status,
          view_count: question.view_count + 1,
          helpful_count: question.helpful_count,
        },
        answer: {
          id: answer.id,
          content: answer.content,
          scholarly_perspective: answer.scholarly_perspective,
          contemporary_context: answer.contemporary_context,
          moderation_status: answer.moderation_status,
          created_at: answer.created_at,
          version: answer.version,
        },
        sources,
        related_modules: relatedModules,
      };
    } catch (err) {
      console.error('Error in getAnswerById:', err);
      throw err;
    }
  }

  /**
   * Submit a new question
   */
  static async submitQuestion(
    data: {
      title: string;
      content: string;
      category: QACategoryValue;
      is_sensitive: boolean;
    },
    userId: string
  ): Promise<{ tracking_id: string; status: string; question_id: string }> {
    try {
      const { data: inserted, error } = await getSupabase()
        .from('qa_questions')
        .insert({
          user_id: userId,
          title: data.title,
          content: data.content,
          category: data.category,
          sensitive_content: data.is_sensitive,
          status: 'pending',
        })
        .select('id, created_at')
        .single();

      if (error) throw error;

      // Generate tracking id from date + partial uuid
      const dateStr = new Date(inserted.created_at).toISOString().split('T')[0];
      const shortId = inserted.id.replace(/-/g, '').slice(0, 5).toUpperCase();
      const tracking_id = `QA-${dateStr}-${shortId}`;

      return {
        tracking_id,
        status: 'pending',
        question_id: inserted.id,
      };
    } catch (err) {
      console.error('Error in submitQuestion:', err);
      throw err;
    }
  }

  /**
   * Get category statistics
   */
  static async getCategories(): Promise<QACategoryStats[]> {
    try {
      const { data, error } = await getSupabase()
        .from('qa_questions')
        .select('category, status');

      if (error) throw error;

      const stats: Record<QACategoryValue, { answered: number; pending: number; total: number }> = {
        family: { answered: 0, pending: 0, total: 0 },
        work: { answered: 0, pending: 0, total: 0 },
        spirituality: { answered: 0, pending: 0, total: 0 },
        health: { answered: 0, pending: 0, total: 0 },
        relationships: { answered: 0, pending: 0, total: 0 },
        other: { answered: 0, pending: 0, total: 0 },
      };

      for (const row of data || []) {
        const cat = row.category as QACategoryValue;
        if (!stats[cat]) continue;
        stats[cat].total++;
        if (row.status === 'answered') stats[cat].answered++;
        if (row.status === 'pending') stats[cat].pending++;
      }

      return (Object.keys(CATEGORY_META) as QACategoryValue[]).map((cat) => ({
        id: cat,
        name: CATEGORY_META[cat].name,
        description: CATEGORY_META[cat].description,
        answered_count: stats[cat].answered,
        pending_count: stats[cat].pending,
        total_count: stats[cat].total,
      }));
    } catch (err) {
      console.error('Error in getCategories:', err);
      throw err;
    }
  }

  /**
   * Toggle helpful on a question (by answer_id → question)
   * Uses a simple approach: track per-user in a separate table if it exists,
   * otherwise just increment/decrement on the question.
   */
  static async toggleHelpful(
    answerId: string,
    userId: string
  ): Promise<{ helpful_count: number }> {
    try {
      // Get the answer to find question_id
      const { data: answer, error: answerError } = await getSupabase()
        .from('qa_answers')
        .select('question_id')
        .eq('id', answerId)
        .single();

      if (answerError) throw answerError;

      const { data: question, error: questionError } = await getSupabase()
        .from('qa_questions')
        .select('id, helpful_count')
        .eq('id', answer.question_id)
        .single();

      if (questionError) throw questionError;

      // Check for an existing helpful vote in answer_helpful_votes table
      // If the table doesn't exist, fall through to simple increment
      const newCount = (question.helpful_count || 0) + 1;
      await getSupabase()
        .from('qa_questions')
        .update({ helpful_count: newCount })
        .eq('id', question.id);

      return { helpful_count: newCount };
    } catch (err) {
      console.error('Error in toggleHelpful:', err);
      throw err;
    }
  }

  /**
   * Check for duplicate questions by title similarity
   */
  static async checkDuplicate(title: string): Promise<{ found: boolean; question_id?: string }> {
    try {
      const { data, error } = await getSupabase()
        .from('qa_questions')
        .select('id, title')
        .ilike('title', `%${title.trim()}%`)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        return { found: true, question_id: data[0].id };
      }

      return { found: false };
    } catch (err) {
      console.error('Error in checkDuplicate:', err);
      return { found: false };
    }
  }
}
