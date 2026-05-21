/**
 * QAService
 * Business logic for Q&A knowledge base
 */

import { QARepository, QASearchResult, QACategoryValue } from '@/lib/repositories/QARepository';

export class QAService {
  /**
   * Rank search results by relevance to query.
   * Score: title match (3pts) > content match (2pts) > helpful_count (0.5pt/10) > recency (1pt for < 30 days)
   */
  static rankResults(results: QASearchResult[], query: string): QASearchResult[] {
    if (!query || query.trim().length === 0) return results;

    const normalizedQuery = query.toLowerCase();
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    return [...results].sort((a, b) => {
      const scoreA = this.computeScore(a, normalizedQuery, now, thirtyDays);
      const scoreB = this.computeScore(b, normalizedQuery, now, thirtyDays);
      return scoreB - scoreA;
    });
  }

  private static computeScore(
    result: QASearchResult,
    query: string,
    now: number,
    thirtyDays: number
  ): number {
    let score = 0;
    const title = result.question_title.toLowerCase();
    const excerpt = result.answer_excerpt.toLowerCase();

    if (title.includes(query)) score += 3;
    if (excerpt.includes(query)) score += 2;

    // Recency bonus
    const createdAt = result.answered_at ? new Date(result.answered_at).getTime() : 0;
    if (createdAt && now - createdAt < thirtyDays) score += 1;

    // Helpfulness bonus
    score += (result.helpful_count / 10) * 0.5;

    return score;
  }

  /**
   * Check for a similar existing question by title.
   * Returns question_id if duplicate found, null otherwise.
   */
  static async detectDuplicate(title: string): Promise<string | null> {
    const result = await QARepository.checkDuplicate(title);
    return result.found ? (result.question_id ?? null) : null;
  }

  /**
   * Classify question content into a category using keyword matching.
   */
  static classifyCategory(content: string): QACategoryValue {
    const lower = content.toLowerCase();
    const rules: Array<{ category: QACategoryValue; keywords: string[] }> = [
      { category: 'family', keywords: ['parent', 'family', 'mother', 'father', 'sibling', 'children', 'spouse', 'wife', 'husband', 'ramadan'] },
      { category: 'work', keywords: ['work', 'job', 'career', 'business', 'employer', 'salary', 'riba', 'interest', 'bank'] },
      { category: 'spirituality', keywords: ['prayer', 'salah', 'quran', 'fasting', 'zakat', 'hajj', 'worship', 'dua', 'dhikr', 'iman', 'ibadah'] },
      { category: 'health', keywords: ['health', 'medicine', 'medication', 'doctor', 'therapy', 'mental', 'tattoo', 'yoga', 'organ'] },
      { category: 'relationships', keywords: ['dating', 'marriage', 'friend', 'relationship', 'mahram', 'love', 'divorce'] },
    ];

    for (const rule of rules) {
      if (rule.keywords.some((kw) => lower.includes(kw))) {
        return rule.category;
      }
    }
    return 'other';
  }
}
