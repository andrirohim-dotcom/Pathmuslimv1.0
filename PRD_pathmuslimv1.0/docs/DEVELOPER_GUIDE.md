# PathMuslim Developer Guide

This guide explains the architecture, patterns, and workflows for extending PathMuslim with new features.

## 📐 System Architecture

PathMuslim uses a **3-layer architecture**:

```
┌─────────────────────────────────────────┐
│  API Routes (app/api/**/route.ts)       │  ← HTTP handling, auth checks
├─────────────────────────────────────────┤
│  Services (lib/services/*.ts)           │  ← Business logic
├─────────────────────────────────────────┤
│  Repositories (lib/repositories/*.ts)   │  ← Data access
├─────────────────────────────────────────┤
│  Supabase PostgreSQL Database           │  ← Persistent storage
└─────────────────────────────────────────┘
```

Each layer has a single responsibility:

| Layer | Responsibility | Example |
|-------|-----------------|---------|
| **API Route** | HTTP requests, authentication, response formatting | `GET /api/learning/modules` returns JSON |
| **Service** | Business logic, validation, calculations | `ModuleService.completeModule()` updates progress |
| **Repository** | Database queries, data access patterns | `ModuleRepository.getAll()` fetches from DB |

## 🏗️ Service Pattern Explained

### Repository Layer

Repositories handle **all database operations**. They provide a consistent interface for data access:

```typescript
// lib/repositories/ModuleRepository.ts
export class ModuleRepository {
  static async getAll(page: number, limit: number) {
    const { data, error } = await supabase
      .from('learning_modules')
      .select()
      .range((page - 1) * limit, page * limit - 1);
    
    if (error) throw error;
    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('learning_modules')
      .select()
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
}
```

**Key principles:**
- No business logic - just data access
- Throw errors, don't return error objects
- Type all methods
- Name methods after what they retrieve: `get*`, `find*`, `search*`

### Service Layer

Services contain **business logic**. They use repositories for data access:

```typescript
// lib/services/ModuleService.ts
export class ModuleService {
  static async completeModule(userId: string, moduleId: string, score: number) {
    // Validate input
    if (score < 0 || score > 100) {
      throw new ValidationError('Score must be 0-100');
    }

    // Get module to check prerequisites
    const module = await ModuleRepository.getById(moduleId);
    if (!module) {
      throw new NotFoundError('Module not found');
    }

    // Check if prerequisites completed
    const completed = await this.checkPrerequisites(userId, module.prerequisites);
    if (!completed) {
      throw new ValidationError('Prerequisites not completed');
    }

    // Save completion (repository handles DB)
    const progress = await ModuleRepository.saveProgress(userId, moduleId, score);

    // Calculate and return updated progress
    return {
      module_id: moduleId,
      score: score,
      completed_at: progress.completed_at,
    };
  }

  private static async checkPrerequisites(userId: string, prerequisites: string[]) {
    if (prerequisites.length === 0) return true;
    
    const completed = await ModuleRepository.getCompleted(userId);
    return prerequisites.every(id => completed.some(m => m.id === id));
  }
}
```

**Key principles:**
- Business logic only - no SQL or HTTP
- Use repositories for data access
- Validate inputs
- Throw meaningful errors
- Return clean data structures

### API Route Layer

Routes handle **HTTP concerns**:

```typescript
// app/api/learning/modules/[id]/complete/route.ts
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(error('UNAUTHORIZED'), { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { score } = body;

    if (typeof score !== 'number') {
      return NextResponse.json(error('INVALID_INPUT'), { status: 400 });
    }

    // 3. Call service (where real work happens)
    const userId = request.headers.get('x-user-id') || 'user-1';
    const result = await ModuleService.completeModule(userId, id, score);

    // 4. Return formatted response
    return NextResponse.json(success(result), { status: 200 });

  } catch (err) {
    // Handle errors from service
    if (err instanceof ValidationError) {
      return NextResponse.json(error('VALIDATION_ERROR', err.message), { status: 400 });
    }
    
    console.error('POST /api/learning/modules/[id]/complete error:', err);
    return NextResponse.json(error('INTERNAL_ERROR'), { status: 500 });
  }
}
```

**Key principles:**
- Extract authentication first
- Validate HTTP input
- Call service for business logic
- Handle errors from service
- Format response consistently

## 📝 Adding a New Service: Step-by-Step

Follow this process when adding a feature like "Bookmarks":

### Step 1: Database Design

Define what data you need to store:

```sql
-- migrations/[timestamp]_add_bookmarks.sql
CREATE TABLE user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question_id UUID,
  module_id UUID,
  bookmark_type VARCHAR(50) NOT NULL, -- 'question' or 'module'
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES qa_answers(id),
  FOREIGN KEY (module_id) REFERENCES learning_modules(id)
);

CREATE INDEX idx_user_bookmarks ON user_bookmarks(user_id);
```

### Step 2: TypeScript Types

Add types to `lib/types.ts`:

```typescript
export interface Bookmark {
  id: string;
  user_id: string;
  question_id?: string;
  module_id?: string;
  bookmark_type: 'question' | 'module';
  created_at: string;
}

export interface CreateBookmarkRequest {
  question_id?: string;
  module_id?: string;
  bookmark_type: 'question' | 'module';
}
```

### Step 3: Repository Class

Create `lib/repositories/BookmarkRepository.ts`:

```typescript
import { supabase } from '@/lib/supabase';
import type { Bookmark } from '@/lib/types';

export class BookmarkRepository {
  static async getByUser(userId: string): Promise<Bookmark[]> {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async create(userId: string, bookmark: CreateBookmarkRequest): Promise<Bookmark> {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .insert({
        user_id: userId,
        ...bookmark,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(bookmarkId: string): Promise<void> {
    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('id', bookmarkId);

    if (error) throw error;
  }
}
```

### Step 4: Service Class

Create `lib/services/BookmarkService.ts`:

```typescript
import { BookmarkRepository } from '@/lib/repositories/BookmarkRepository';
import type { Bookmark, CreateBookmarkRequest } from '@/lib/types';

export class BookmarkService {
  static async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    if (!userId) {
      throw new ValidationError('User ID required');
    }
    return BookmarkRepository.getByUser(userId);
  }

  static async addBookmark(userId: string, request: CreateBookmarkRequest): Promise<Bookmark> {
    // Validate input
    if (!request.question_id && !request.module_id) {
      throw new ValidationError('Either question_id or module_id required');
    }

    if (request.question_id && request.module_id) {
      throw new ValidationError('Cannot bookmark both question and module');
    }

    // Create bookmark
    return BookmarkRepository.create(userId, request);
  }

  static async removeBookmark(userId: string, bookmarkId: string): Promise<void> {
    // Verify ownership (security check)
    const bookmarks = await BookmarkRepository.getByUser(userId);
    const bookmark = bookmarks.find(b => b.id === bookmarkId);

    if (!bookmark) {
      throw new NotFoundError('Bookmark not found');
    }

    return BookmarkRepository.delete(bookmarkId);
  }
}
```

### Step 5: API Routes

Create `app/api/bookmarks/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { BookmarkService } from '@/lib/services/BookmarkService';
import { success, error } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(error('UNAUTHORIZED'), { status: 401 });
    }

    const userId = request.headers.get('x-user-id') || 'user-1';
    const bookmarks = await BookmarkService.getUserBookmarks(userId);

    return NextResponse.json(success(bookmarks));
  } catch (err) {
    console.error('GET /api/bookmarks error:', err);
    return NextResponse.json(error('INTERNAL_ERROR'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(error('UNAUTHORIZED'), { status: 401 });
    }

    const userId = request.headers.get('x-user-id') || 'user-1';
    const body = await request.json();

    const bookmark = await BookmarkService.addBookmark(userId, body);
    return NextResponse.json(success(bookmark), { status: 201 });
  } catch (err) {
    console.error('POST /api/bookmarks error:', err);
    return NextResponse.json(error('INTERNAL_ERROR'), { status: 500 });
  }
}
```

### Step 6: Unit Tests

Create `tests/unit/services/BookmarkService.test.ts`:

```typescript
import { BookmarkService } from '@/lib/services/BookmarkService';
import { ValidationError, NotFoundError } from '@/lib/errors';

describe('BookmarkService', () => {
  describe('addBookmark', () => {
    it('should create bookmark with question_id', async () => {
      const result = await BookmarkService.addBookmark('user-1', {
        question_id: 'q-1',
        bookmark_type: 'question',
      });

      expect(result.question_id).toBe('q-1');
      expect(result.user_id).toBe('user-1');
    });

    it('should throw if both question_id and module_id provided', async () => {
      expect(() => 
        BookmarkService.addBookmark('user-1', {
          question_id: 'q-1',
          module_id: 'm-1',
          bookmark_type: 'question',
        })
      ).toThrow(ValidationError);
    });

    it('should throw if neither question_id nor module_id provided', async () => {
      expect(() => 
        BookmarkService.addBookmark('user-1', {
          bookmark_type: 'question',
        })
      ).toThrow(ValidationError);
    });
  });
});
```

### Step 7: Integration Tests

Create `tests/integration/bookmarks.test.ts`:

```typescript
describe('Bookmarks API', () => {
  it('POST /api/bookmarks should create bookmark', async () => {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer token',
        'x-user-id': 'user-1',
      },
      body: JSON.stringify({
        question_id: 'q-1',
        bookmark_type: 'question',
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it('GET /api/bookmarks should list user bookmarks', async () => {
    const response = await fetch('/api/bookmarks', {
      headers: {
        'Authorization': 'Bearer token',
        'x-user-id': 'user-1',
      },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.data)).toBe(true);
  });
});
```

### Step 8: Documentation

Add JSDoc to your service:

```typescript
/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Get user bookmarks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's bookmarks
 *   post:
 *     summary: Create bookmark
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: string
 *               module_id:
 *                 type: string
 */
```

## 🔄 Common Patterns

### Error Handling

```typescript
try {
  const result = await riskyOperation();
  return success(result);
} catch (err) {
  if (err instanceof ValidationError) {
    return error('VALIDATION_ERROR', err.message, { status: 400 });
  }
  if (err instanceof NotFoundError) {
    return error('NOT_FOUND', err.message, { status: 404 });
  }
  
  // Log unexpected errors
  console.error('Unexpected error:', err);
  return error('INTERNAL_ERROR', { status: 500 });
}
```

### Pagination

```typescript
// In repository
static async search(query: string, page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;
  const { data, count } = await supabase
    .from('items')
    .select('*', { count: 'exact' })
    .textSearch('search_column', query)
    .range(offset, offset + limit - 1);
  
  return { items: data, total: count, page, limit };
}

// In API route
const { page = 1, limit = 10 } = searchParams;
const result = await Repository.search(q, parseInt(page), parseInt(limit));
return success(result, createPaginationMetadata(result.total, page, limit));
```

### Search & Filters

```typescript
static async search(filters: {
  category?: string;
  sort?: 'relevance' | 'recent';
  page?: number;
}) {
  let query = supabase.from('items').select();

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.sort === 'recent') {
    query = query.order('created_at', { ascending: false });
  }

  return query;
}
```

### Authentication Checks

```typescript
// Always in API routes, not services
const authHeader = request.headers.get('authorization');
if (!authHeader?.startsWith('Bearer ')) {
  return error('UNAUTHORIZED', { status: 401 });
}

// Extract user ID (in production, verify JWT)
const userId = request.headers.get('x-user-id') || extractFromJWT(authHeader);
```

## 🛠️ Development Tools & Scripts

```bash
# Run tests
npm run test              # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Type checking
npm run type-check       # Check for TypeScript errors

# Linting
npm run lint             # Run ESLint
npm run lint --fix       # Fix linting issues

# Building
npm run build            # Production build
npm run dev              # Development server

# Database
npm run seed             # Seed test data
npm run db:reset         # Reset database (development only)
npm run db:push          # Push schema changes
```

## 📋 Development Checklist

When adding a new feature:

- [ ] Create database migration
- [ ] Add TypeScript types
- [ ] Create Repository class
- [ ] Create Service class
- [ ] Create API routes
- [ ] Add unit tests (Repository + Service)
- [ ] Add integration tests (API routes)
- [ ] Add E2E tests (user flows)
- [ ] Add JSDoc comments
- [ ] Update Swagger spec
- [ ] Test coverage > 80%
- [ ] All tests passing
- [ ] No TypeScript errors

## 🚀 Next Steps

1. Read [TYPES_GUIDE.md](./TYPES_GUIDE.md) to understand the type system
2. Read [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) to understand data structure
3. Check `/api/swagger-ui` for live API documentation
4. Review existing services (ModuleService, QAService) for patterns
5. Start with a small feature to practice the workflow

---

**Questions?** Check the other documentation files or review the existing code in `lib/services/` and `app/api/`.
