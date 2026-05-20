# API Contract: Learning Modules

**Service**: Module curriculum delivery and progress tracking

---

## 1. List All Modules (Curriculum Overview)

**Endpoint**: `GET /api/learning/modules`

**Purpose**: Get the complete curriculum structure for initial onboarding

**Query Parameters**:
- `level` (optional): Filter by level (beginner | intermediate | advanced)
- `include_prerequisites` (optional, boolean): Include prerequisite module details

**Success Response (200 OK)**:
```json
{
  "modules": [
    {
      "id": "uuid-1",
      "title": "Islamic Fundamentals",
      "description": "Introduction to core Islamic concepts and beliefs",
      "sequence_number": 1,
      "level": "beginner",
      "estimated_hours": 2,
      "prerequisites": [],
      "locked": false,
      "user_progress": null
    },
    {
      "id": "uuid-2",
      "title": "Understanding the Quran",
      "description": "How to approach and understand the Quran",
      "sequence_number": 2,
      "level": "beginner",
      "estimated_hours": 3,
      "prerequisites": ["uuid-1"],
      "locked": false,
      "user_progress": {
        "completed_at": "2026-05-15T10:30:00Z",
        "assessment_score": 92
      }
    }
  ],
  "metadata": {
    "total_modules": 20,
    "completed_count": 1,
    "current_level": "beginner"
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "error": "Invalid level parameter",
  "message": "level must be one of: beginner, intermediate, advanced"
}
```

---

## 2. Get Module Detail with Content

**Endpoint**: `GET /api/learning/modules/:module_id`

**Purpose**: Retrieve full module content, learning objectives, sources, and user progress

**Success Response (200 OK)**:
```json
{
  "id": "uuid-2",
  "title": "Understanding the Quran",
  "description": "How to approach and understand the Quran",
  "sequence_number": 2,
  "level": "beginner",
  "estimated_hours": 3,
  "content": "# Understanding the Quran\n\nThe Quran is the divine revelation given to Prophet Muhammad...",
  "learning_objectives": [
    "Understand how the Quran was revealed",
    "Learn basic Quranic interpretation methodology",
    "Identify key themes in selected Quranic passages"
  ],
  "prerequisites": [
    {
      "id": "uuid-1",
      "title": "Islamic Fundamentals",
      "completed": true
    }
  ],
  "sources": [
    {
      "id": "source-uuid-1",
      "type": "quran",
      "citation": "Quran 2:183",
      "display_text": "O you who have believed, prescribed for you is fasting...",
      "translation": "[English translation]",
      "metadata": {
        "surah": "Al-Baqarah",
        "surah_number": 2,
        "verse_range": "183-184"
      }
    },
    {
      "id": "source-uuid-2",
      "type": "scholar",
      "citation": "Ibn Qayyim al-Jawziyyah, Ighathat al-Lahfan",
      "display_text": "[Scholarly quote about Quranic interpretation]",
      "metadata": {
        "scholar_name": "Ibn Qayyim al-Jawziyyah",
        "madhab": "Hanbali",
        "work_title": "Ighathat al-Lahfan"
      }
    }
  ],
  "user_progress": {
    "completed_at": null,
    "time_spent_minutes": 45,
    "assessment_score": null,
    "notes": "Taking notes on interpretation methods"
  },
  "next_module": {
    "id": "uuid-3",
    "title": "Understanding Hadith",
    "sequence_number": 3
  }
}
```

**Error Response (404 Not Found)**:
```json
{
  "error": "Module not found",
  "message": "No module with ID uuid-2 exists"
}
```

---

## 3. Mark Module as Completed

**Endpoint**: `POST /api/learning/modules/:module_id/complete`

**Purpose**: Mark a module as completed and record assessment score

**Authentication**: Required (user must be logged in)

**Request Body**:
```json
{
  "assessment_score": 85,
  "time_spent_minutes": 120,
  "notes": "Excellent module, learned a lot about interpretation"
}
```

**Success Response (200 OK)**:
```json
{
  "id": "uuid-2",
  "module_id": "uuid-2",
  "user_id": "user-uuid",
  "completed_at": "2026-05-20T14:30:00Z",
  "assessment_score": 85,
  "time_spent_minutes": 120,
  "notes": "Excellent module, learned a lot about interpretation",
  "next_module_unlocked": {
    "id": "uuid-3",
    "title": "Understanding Hadith"
  },
  "milestone_unlocked": {
    "id": "milestone-uuid",
    "name": "Completed Beginner Level",
    "description": "You've completed all beginner-level modules!"
  }
}
```

**Validation Errors (400 Bad Request)**:
```json
{
  "error": "Validation failed",
  "messages": [
    "assessment_score must be 0-100",
    "time_spent_minutes must be a positive integer"
  ]
}
```

**Prerequisite Error (403 Forbidden)**:
```json
{
  "error": "Prerequisites not met",
  "message": "Complete module 'Islamic Fundamentals' before starting this module",
  "blocked_by": ["uuid-1"]
}
```

**Already Completed (409 Conflict)**:
```json
{
  "error": "Module already completed",
  "message": "This module was completed on 2026-05-15. You cannot resubmit completion.",
  "original_completion": {
    "completed_at": "2026-05-15T10:30:00Z",
    "assessment_score": 92
  }
}
```

---

## 4. Get User Progress Summary

**Endpoint**: `GET /api/learning/progress`

**Purpose**: Get overview of user's learning journey

**Authentication**: Required

**Success Response (200 OK)**:
```json
{
  "user_id": "user-uuid",
  "total_modules": 20,
  "completed_modules": 3,
  "current_level": "beginner",
  "completion_percentage": 15,
  "estimated_time_remaining": "40 hours",
  "last_completed_module": {
    "id": "uuid-3",
    "title": "Understanding Hadith",
    "completed_at": "2026-05-18T11:00:00Z"
  },
  "next_recommended_module": {
    "id": "uuid-4",
    "title": "Islamic Jurisprudence (Fiqh)",
    "sequence_number": 4
  },
  "milestones_achieved": [
    {
      "name": "First Module Complete",
      "description": "Completed your first learning module",
      "achieved_at": "2026-05-10T15:00:00Z"
    },
    {
      "name": "Beginner Foundation",
      "description": "Completed 3 modules",
      "achieved_at": "2026-05-18T11:00:00Z"
    }
  ],
  "learning_streak_days": 8
}
```

---

## 5. Search Modules by Keyword

**Endpoint**: `GET /api/learning/modules/search`

**Query Parameters**:
- `q` (required, string): Search query (min 2 characters)
- `level` (optional): Filter by level

**Success Response (200 OK)**:
```json
{
  "query": "quran",
  "results": [
    {
      "id": "uuid-2",
      "title": "Understanding the Quran",
      "description": "How to approach and understand the Quran",
      "sequence_number": 2,
      "level": "beginner",
      "match_score": 0.95
    },
    {
      "id": "uuid-5",
      "title": "Quranic Memorization (Hifz)",
      "description": "Approach to memorizing the Quran",
      "sequence_number": 5,
      "level": "intermediate",
      "match_score": 0.88
    }
  ],
  "total_results": 2
}
```

---

## Rate Limiting & Caching

- **Rate Limit**: 100 requests/minute per user (authenticated), 20 requests/minute per IP (anonymous)
- **Cache**: Module list cached for 1 hour; individual module content cached for 30 minutes on client
- **Cache Headers**: `Cache-Control: public, max-age=3600`

---

## Error Codes

| Code | Scenario |
|------|----------|
| 400 | Invalid request (missing required params, invalid values) |
| 401 | Authentication required |
| 403 | Access denied (e.g., prerequisites not met) |
| 404 | Module not found |
| 409 | Conflict (e.g., module already completed) |
| 429 | Rate limited |
| 500 | Server error |

---

## Notes

- All timestamps in ISO 8601 format (UTC)
- Assessment scores optional (not all modules have assessments)
- Progress data only visible to authenticated user viewing their own progress
- Module content immutable once published (new versions created for updates)
