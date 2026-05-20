# API Contract: Q&A Knowledge Base

**Service**: Question and Answer knowledge base for daily-life Islamic guidance

---

## 1. Search Knowledge Base

**Endpoint**: `GET /api/qa/search`

**Purpose**: Find answered questions relevant to user's query

**Query Parameters**:
- `q` (required, string): Search query (min 2 characters, max 500)
- `category` (optional): Filter by category (family | work | spirituality | health | relationships | other)
- `sort` (optional): Sort order (relevance | recent | helpful, default relevance)
- `limit` (optional, integer 1-50): Number of results (default 10)

**Success Response (200 OK)**:
```json
{
  "query": "how to handle family conflicts",
  "category_filter": null,
  "results": [
    {
      "id": "question-uuid-1",
      "title": "How should I approach disagreements with my non-Muslim family?",
      "category": "family",
      "created_at": "2026-02-10T08:00:00Z",
      "answer": {
        "id": "answer-uuid-1",
        "content": "Disagreements with family members, especially when there are religious differences, are common challenges for new Muslims...",
        "scholarly_perspective": "Islamic jurisprudence emphasizes maintaining family ties (silat al-rahim) even with non-believers...",
        "contemporary_context": "Family therapists recognize that validating differences while maintaining connection is key to healthy relationships...",
        "sources": [
          {
            "id": "source-uuid-1",
            "type": "quran",
            "citation": "Quran 29:8",
            "display_text": "But if they strive to make you associate with Me that of which you have no knowledge...",
            "translation": "[English translation]"
          },
          {
            "id": "source-uuid-2",
            "type": "scholar",
            "citation": "Ibn Qayyim al-Jawziyyah on family relations",
            "display_text": "[Scholarly guidance on family obligations]"
          }
        ]
      },
      "view_count": 245,
      "helpful_count": 89,
      "match_score": 0.94
    },
    {
      "id": "question-uuid-2",
      "title": "Is it obligatory to obey non-Muslim parents?",
      "category": "family",
      "created_at": "2026-01-22T14:15:00Z",
      "answer": {
        "id": "answer-uuid-2",
        "content": "One of the most important obligations in Islam is treating parents with kindness and respect...",
        "scholarly_perspective": "...",
        "sources": [...]
      },
      "view_count": 312,
      "helpful_count": 124,
      "match_score": 0.87
    }
  ],
  "total_results": 2,
  "unanswered_similar": [
    {
      "id": "question-uuid-pending",
      "title": "How do I tell my family about my conversion to Islam?",
      "category": "family",
      "status": "pending",
      "created_at": "2026-05-18T10:00:00Z",
      "message": "This question is being researched by our team. We'll add a sourced answer within 48 hours."
    }
  ]
}
```

**Empty Results (200 OK)**:
```json
{
  "query": "very specific obscure topic",
  "results": [],
  "total_results": 0,
  "message": "No answered questions match your search. Try a simpler query, or submit a new question.",
  "suggestions": [
    {
      "title": "Submit a New Question",
      "description": "Ask our team—we'll research and provide a sourced answer",
      "action": "POST /api/qa/questions"
    },
    {
      "title": "Explore by Category",
      "description": "Browse questions by topic",
      "categories": ["family", "work", "spirituality", "health", "relationships"]
    }
  ]
}
```

**Error Response (400 Bad Request)**:
```json
{
  "error": "Invalid search query",
  "message": "Search query must be at least 2 characters"
}
```

---

## 2. Get Answer Detail with Full Sources

**Endpoint**: `GET /api/qa/answers/:answer_id`

**Purpose**: Retrieve full answer text with complete source citations and scholarly context

**Success Response (200 OK)**:
```json
{
  "id": "answer-uuid-1",
  "question": {
    "id": "question-uuid-1",
    "title": "How should I approach disagreements with my non-Muslim family?",
    "category": "family",
    "asked_by": "anonymous"
  },
  "content": "Disagreements with family members, especially when there are religious differences, are common challenges for new Muslims. Islam emphasizes maintaining family ties (silat al-rahim) as a core obligation, even with non-believers...",
  "scholarly_perspective": "Islamic jurisprudence, particularly as developed in the schools of Islamic law (madhabs), consistently emphasize that family obligations are fundamental to Islamic practice...",
  "contemporary_context": "Modern psychology recognizes that families navigate change through a process of renegotiation. Some practical approaches include setting boundaries around religious practices while respecting family relationships, seeking counseling if conflicts escalate, and finding community support among other converts navigating similar challenges.",
  "sources": [
    {
      "id": "source-uuid-1",
      "type": "quran",
      "citation": "Quran 29:8",
      "display_text": "But if they strive to make you associate with Me that of which you have no knowledge, do not obey them but accompany them in worldly life with appropriate kindness and follow the way of those who turn back to Me...",
      "translation": "Sahih International",
      "metadata": {
        "surah": "Al-Ankabut",
        "surah_number": 29,
        "verse": 8
      }
    },
    {
      "id": "source-uuid-2",
      "type": "quran",
      "citation": "Quran 17:23-24",
      "display_text": "[Full verses on honoring parents]",
      "metadata": {
        "surah": "Al-Isra",
        "surah_number": 17,
        "verse_range": "23-24"
      }
    },
    {
      "id": "source-uuid-3",
      "type": "hadith",
      "citation": "Sahih al-Bukhari 5971",
      "display_text": "The Prophet (peace be upon him) said: The most complete believers in faith are the best of them in character, and the best of you are the best to your wives.",
      "authentication_grade": "Sahih (Authentic)",
      "metadata": {
        "collection": "Sahih al-Bukhari",
        "hadith_number": 5971,
        "narrator": "Abu Hurayrah"
      }
    },
    {
      "id": "source-uuid-4",
      "type": "scholar",
      "citation": "Ibn Qayyim al-Jawziyyah, Ighathat al-Lahfan min Masaid al-Shaytan",
      "display_text": "[Scholarly interpretation of family obligations]",
      "metadata": {
        "scholar_name": "Ibn Qayyim al-Jawziyyah",
        "madhab": "Hanbali",
        "work_title": "Ighathat al-Lahfan",
        "publication_year": 1961
      }
    }
  ],
  "created_by_advisor": "Sheikh Ahmad Al-Mansouri",
  "created_at": "2026-02-10T08:00:00Z",
  "version": 1,
  "view_count": 245,
  "helpful_count": 89,
  "user_marked_helpful": false,
  "related_modules": [
    {
      "id": "module-uuid-3",
      "title": "Islamic Family Values",
      "sequence_number": 6
    }
  ]
}
```

**Track Viewing**:
```
On successful GET, increment answer.view_count and record in analytics
```

---

## 3. Submit New Question

**Endpoint**: `POST /api/qa/questions`

**Purpose**: Allow learners to ask new questions about daily Islamic life

**Authentication**: Required (can be anonymous via email or logged-in user)

**Request Body**:
```json
{
  "title": "How should I handle dating as a new Muslim?",
  "content": "I was dating someone before converting to Islam. We still care about each other but have different values now. What does Islam say about this situation?",
  "category": "relationships",
  "sensitive_topic": false,
  "submit_as_anonymous": true,
  "email_when_answered": "user@example.com"
}
```

**Validation Rules**:
- title: 5-200 characters, required
- content: 20-5000 characters, required
- category: Must be one of enum values
- email_when_answered: Valid email format if provided

**Success Response (201 Created)**:
```json
{
  "id": "question-uuid-new",
  "title": "How should I handle dating as a new Muslim?",
  "category": "relationships",
  "status": "pending",
  "created_at": "2026-05-20T15:30:00Z",
  "message": "Thank you for your question! Our team will research and provide sourced answers within 48 hours.",
  "tracking_id": "Q-2026-05-20-00847",
  "email_notification": "We'll send an email to user@example.com when an answer is published"
}
```

**Duplicate Question (409 Conflict)**:
```json
{
  "status": 409,
  "error": "Similar question already answered",
  "message": "Your question is similar to one we've already answered. Would you like to see that answer instead?",
  "existing_answer": {
    "id": "answer-uuid-similar",
    "question_title": "Is dating allowed in Islam?",
    "link": "/api/qa/answers/answer-uuid-similar"
  }
}
```

**Validation Error (400 Bad Request)**:
```json
{
  "error": "Validation failed",
  "messages": [
    "title must be at least 5 characters",
    "content must be at least 20 characters"
  ]
}
```

---

## 4. Mark Answer as Helpful

**Endpoint**: `POST /api/qa/answers/:answer_id/helpful`

**Purpose**: Record that user found answer helpful (for ranking and analytics)

**Request Body**:
```json
{
  "helpful": true
}
```

**Success Response (200 OK)**:
```json
{
  "id": "answer-uuid-1",
  "helpful_count": 90,
  "user_helpful_status": true
}
```

**Note**: Each user can only mark an answer helpful/unhelpful once; subsequent calls update the previous status

---

## 5. Get Question Categories

**Endpoint**: `GET /api/qa/categories`

**Purpose**: List available Q&A categories with description and question counts

**Success Response (200 OK)**:
```json
{
  "categories": [
    {
      "id": "family",
      "name": "Family Relations",
      "description": "Questions about relationships with parents, spouse, children, and extended family",
      "icon": "👨‍👩‍👧‍👦",
      "question_count": 34,
      "answered_count": 34,
      "pending_count": 2
    },
    {
      "id": "work",
      "name": "Work & Career",
      "description": "Islamic guidance on workplace ethics, professional development, and career choices",
      "icon": "💼",
      "question_count": 18,
      "answered_count": 17,
      "pending_count": 1
    },
    {
      "id": "spirituality",
      "name": "Spiritual Practice",
      "description": "Prayer, meditation, Islamic rituals, and building spiritual discipline",
      "icon": "🙏",
      "question_count": 52,
      "answered_count": 50,
      "pending_count": 2
    },
    {
      "id": "health",
      "name": "Health & Medicine",
      "description": "Islamic perspectives on health, medical ethics, and wellness",
      "icon": "⚕️",
      "question_count": 22,
      "answered_count": 20,
      "pending_count": 2
    },
    {
      "id": "relationships",
      "name": "Relationships & Dating",
      "description": "Guidance on relationships, marriage, divorce, and interpersonal dynamics",
      "icon": "💑",
      "question_count": 28,
      "answered_count": 26,
      "pending_count": 2
    }
  ],
  "total_questions": 154,
  "total_answered": 147,
  "total_pending": 7,
  "average_answer_time_hours": 24
}
```

---

## Rate Limiting & Caching

- **Rate Limit**: Search 50 requests/min, Submit question 3 requests/min per user
- **Search Cache**: Results cached for 5 minutes
- **Cache Headers**: `Cache-Control: public, max-age=300`

---

## Error Codes

| Code | Scenario |
|------|----------|
| 400 | Invalid request (malformed query, validation errors) |
| 401 | Authentication required for certain operations |
| 404 | Answer/question not found |
| 409 | Conflict (e.g., duplicate question detected) |
| 429 | Rate limited |
| 500 | Server error |

---

## Notes

- All timestamps in ISO 8601 format (UTC)
- Anonymous questions don't reveal user identity
- Email notifications require explicit opt-in
- Search ranking: Exact matches > relevance score > view count
- Pending questions with no answer show a supportive message instead of an empty result
- Answers can reference related learning modules to deepen understanding
