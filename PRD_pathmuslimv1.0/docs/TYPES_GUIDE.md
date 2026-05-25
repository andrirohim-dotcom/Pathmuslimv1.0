# TypeScript Types Guide

Complete reference for all types used in PathMuslim.

## 📦 Core Entity Types

All types are defined in `lib/types.ts`. These represent data entities in the system.

### User

```typescript
interface User {
  id: string;                    // UUID
  email: string;                 // Unique email
  name: string;                  // Display name
  created_at: string;            // ISO 8601 timestamp
}
```

**When to use**: User authentication, profile display, activity tracking

### Module (Learning)

```typescript
interface Module {
  id: string;                    // UUID
  title: string;                 // Module name
  description: string;           // What the module covers
  category: string;              // Topic category
  duration_minutes: number;      // Estimated duration
  content: string;               // Full module text
  prerequisites?: string[];      // Module IDs required first
  learning_objectives: string[]; // What users will learn
  created_at: string;            // Created timestamp
  updated_at: string;            // Last update
}
```

**When to use**: Module listing, detail pages, prerequisite checking

### Progress

```typescript
interface ModuleProgress {
  id: string;                    // UUID
  user_id: string;               // Which user
  module_id: string;             // Which module
  score: number;                 // Assessment score (0-100)
  completed_at: string;          // When completed (ISO 8601)
}
```

**When to use**: Progress tracking, completion status, milestone calculations

### QA Answer

```typescript
interface QAAnswer {
  id: string;                    // UUID
  question: string;              // The question asked
  answer: string;                // Detailed answer
  category: 'family' | 'work' | 'spirituality' | 'health' | 'relationships' | 'other';
  helpful_count: number;         // How many marked helpful
  sources: SourceReference[];   // Quranic/Hadith references
  created_at: string;            // When created
}

interface SourceReference {
  type: 'quran' | 'hadith' | 'scholar' | 'text';
  reference: string;             // e.g. "Surah Al-Baqarah 2:256"
  text?: string;                 // Full text if applicable
}
```

**When to use**: Q&A display, search results, answer detail pages

### Milestone

```typescript
interface Milestone {
  id: string;                    // UUID
  name: string;                  // Achievement name
  description: string;           // What it means
  trigger_condition: {
    type: 'modules_completed';
    count: number;               // Complete N modules
  };
  created_at: string;
}

interface UserMilestone {
  user_id: string;
  milestone_id: string;
  achievement_at: string;        // When achieved
}
```

**When to use**: Achievement display, milestone progress, gamification

### Source

```typescript
interface Source {
  id: string;
  type: 'quran' | 'hadith' | 'scholar' | 'text';
  title: string;                 // Source name
  reference: string;             // Citation format
  content: string;               // Full text
  metadata?: {
    author?: string;
    surah?: number;              // For Quran
    ayah?: number;               // For Quran
    grade?: string;              // For Hadith (Sahih, Hasan, etc.)
  };
}
```

**When to use**: Source explorer, citation display, reference linking

## 🔄 Request & Response Types

These types represent API input and output.

### Request Types

```typescript
// Complete a module
interface CompleteModuleRequest {
  score: number;                 // 0-100 required
}

// Submit a question
interface SubmitQuestionRequest {
  title: string;                 // Question title
  category: string;              // Category slug
  content: string;               // Full question text
}

// Create a bookmark
interface CreateBookmarkRequest {
  question_id?: string;
  module_id?: string;
  bookmark_type: 'question' | 'module';
}
```

### Response Types

All API responses follow this envelope:

```typescript
interface ApiResponse<T> {
  success: boolean;              // Always present
  data?: T;                       // Present on success
  error?: string;                // Present on error
  message?: string;              // Optional message
  meta?: {                        // For paginated responses
    total: number;
    page: number;
    limit: number;
  };
}
```

**Examples:**

```typescript
// Success response
{
  "success": true,
  "data": { ... },
  "meta": { "total": 50, "page": 1, "limit": 10 }
}

// Error response
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Score must be 0-100"
}
```

### Pagination Types

```typescript
interface PaginationParams {
  page?: number;                 // Default: 1
  limit?: number;                // Default: 10
}

interface PaginationMeta {
  total: number;                 // Total items
  page: number;                  // Current page
  limit: number;                 // Items per page
}
```

## ⚠️ Error Types

Custom error classes in `lib/errors.ts`:

```typescript
// Base class
class AppError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

// Specific errors
class ValidationError extends AppError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message);
  }
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super('NOT_FOUND', message);
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string) {
    super('UNAUTHORIZED', message);
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message);
  }
}
```

**When to throw:**

```typescript
// Input validation failed
if (!userId) throw new ValidationError('User ID required');

// Resource doesn't exist
if (!module) throw new NotFoundError('Module not found');

// User not authenticated
if (!authHeader) throw new UnauthorizedError('Token required');

// Resource already exists
if (duplicate) throw new ConflictError('Email already in use');
```

**HTTP Status Mapping:**

| Error | Status | Example |
|-------|--------|---------|
| ValidationError | 400 | Invalid input |
| NotFoundError | 404 | Module not found |
| UnauthorizedError | 401 | No auth token |
| ConflictError | 409 | Duplicate email |
| AppError (generic) | 500 | Database error |

## ✅ Type Safety Best Practices

### 1. Never Use `any`

❌ **Bad:**
```typescript
function processData(data: any) {
  return data.value; // No type checking
}
```

✅ **Good:**
```typescript
interface Data {
  value: string;
}

function processData(data: Data): string {
  return data.value; // Type-safe
}
```

### 2. Use Discriminated Unions for Variants

❌ **Bad:**
```typescript
interface Source {
  type: string;        // Any string allowed
  surah?: number;      // Only for Quran
  author?: string;     // Only for Scholar
}
```

✅ **Good:**
```typescript
type Source = 
  | { type: 'quran'; surah: number; ayah: number; }
  | { type: 'hadith'; grade: string; collection: string; }
  | { type: 'scholar'; author: string; title: string; };

// TypeScript ensures you handle all variants
function formatSource(source: Source): string {
  switch (source.type) {
    case 'quran':
      return `Surah ${source.surah}:${source.ayah}`;
    case 'hadith':
      return `${source.collection} (${source.grade})`;
    case 'scholar':
      return `${source.author} - ${source.title}`;
  }
}
```

### 3. Use Type Narrowing

```typescript
function processAnswer(answer: QAAnswer | null) {
  // Narrow from union
  if (!answer) {
    console.log('No answer provided');
    return;
  }

  // Now TypeScript knows answer is not null
  console.log(answer.question);
}

function handleSource(source: Source | Source[] | undefined) {
  // Handle different types
  if (Array.isArray(source)) {
    source.forEach(s => console.log(s));
  } else if (source) {
    console.log(source);
  }
}
```

### 4. Use Generics for Reusability

```typescript
// Generic repository pattern
interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
}

class ModuleRepository implements Repository<Module> {
  async getAll(): Promise<Module[]> { ... }
  async getById(id: string): Promise<Module | null> { ... }
  async create(data: Omit<Module, 'id'>): Promise<Module> { ... }
}

// Generic API response
type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};
```

### 5. Readonly Properties for Immutability

```typescript
interface ImmutableUser {
  readonly id: string;     // Cannot be reassigned
  readonly email: string;
  name: string;            // Can be reassigned
}

const user: ImmutableUser = { ... };
user.id = 'new-id';        // ❌ TypeScript error
user.name = 'New Name';    // ✅ Allowed
```

## 📝 Type Examples

### Typed Service Method

```typescript
interface GetModulesRequest {
  page?: number;
  limit?: number;
  category?: string;
}

interface GetModulesResponse {
  modules: Module[];
  total: number;
  page: number;
  limit: number;
}

class ModuleService {
  static async getModules(
    request: GetModulesRequest
  ): Promise<GetModulesResponse> {
    const { page = 1, limit = 10, category } = request;
    
    const modules = await ModuleRepository.search({
      category,
      page,
      limit,
    });

    return {
      modules: modules.items,
      total: modules.total,
      page: modules.page,
      limit: modules.limit,
    };
  }
}
```

### Typed API Route

```typescript
import { NextRequest, NextResponse } from 'next/server';
import type { CompleteModuleRequest } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const body: CompleteModuleRequest = await request.json();

    if (body.score < 0 || body.score > 100) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const userId = request.headers.get('x-user-id') || 'user-1';
    const result = await ModuleService.completeModule(userId, id, body.score);

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
```

### Typed React Component

```typescript
interface ModuleCardProps {
  module: Module;
  onSelect: (moduleId: string) => void;
  isCompleted?: boolean;
}

export function ModuleCard({
  module,
  onSelect,
  isCompleted = false,
}: ModuleCardProps): JSX.Element {
  return (
    <div onClick={() => onSelect(module.id)}>
      <h2>{module.title}</h2>
      <p>{module.description}</p>
      {isCompleted && <span>✓ Completed</span>}
    </div>
  );
}
```

## 🔧 Extending Types

### Adding to Existing Types

```typescript
// In lib/types.ts, add to Module interface
interface Module {
  // ... existing fields ...
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

// Services automatically get the new fields
const module = await ModuleRepository.getById('m-1');
console.log(module.difficulty); // ✅ TypeScript knows about it
```

### Creating Request/Response Pairs

```typescript
// Always define both
interface GetBookmarksRequest {
  userId: string;
  limit?: number;
}

interface GetBookmarksResponse {
  bookmarks: Bookmark[];
  total: number;
}

// Use in service
async function getBookmarks(
  req: GetBookmarksRequest
): Promise<GetBookmarksResponse> {
  // ...
}
```

## 📚 Type Checking

Run type checking during development:

```bash
# Check for TypeScript errors
npm run type-check

# Or use IDE: Cmd+Shift+B (VS Code)
```

Fix type errors by:
1. Understanding the error message
2. Checking the type definition
3. Adjusting types or usage accordingly

---

**For more:** Check `lib/types.ts` for the complete type definitions and examples in existing services like `ModuleService` and `QAService`.
