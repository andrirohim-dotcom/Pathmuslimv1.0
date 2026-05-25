# Scaling Guide

Plan and execute growth as PathMuslim usage increases.

## 📈 Growth Phases

### Phase 1: MVP (0 - 1,000 Users)
**Current Status** ✅

- Single Vercel instance
- Supabase starter plan
- No caching
- All features enabled

### Phase 2: Early Growth (1,000 - 10,000 Users)
**Triggers**:
- Database query slowdown
- API response time > 500ms
- Regular 100% CPU spikes

**Actions**:
- [ ] Enable Redis caching
- [ ] Upgrade database plan
- [ ] Add CDN for static assets
- [ ] Implement rate limiting
- [ ] Add monitoring alerts

### Phase 3: Scale (10,000 - 100,000 Users)
**Triggers**:
- Database CPU consistently > 60%
- Storage > 50GB
- API p95 latency > 1s

**Actions**:
- [ ] Database read replicas
- [ ] API load balancing
- [ ] Microservices separation
- [ ] Message queue (async jobs)
- [ ] Advanced caching strategies

### Phase 4: Enterprise (100,000+ Users)
**Triggers**:
- Multi-region requirements
- High availability SLA
- Custom deployment options

**Actions**:
- [ ] Multi-region deployment
- [ ] Database sharding
- [ ] Dedicated infrastructure
- [ ] Custom SLAs
- [ ] 24/7 support team

---

## 🗄️ Database Scaling

### Current Setup
```
Supabase Starter Plan
├── Single PostgreSQL instance
├── 500MB storage
├── 2 concurrent connections
└── All features included
```

### Bottleneck Indicators

**Watch for**:
- Query execution time > 100ms
- Connection pool exhaustion
- Storage approaching limits
- Slow sequential queries

### Scaling Steps

#### Step 1: Query Optimization (Free)

```sql
-- Add indexes for common queries
CREATE INDEX idx_progress_user_date ON learner_progress(user_id, completed_at DESC);
CREATE INDEX idx_answers_category_date ON qa_answers(category, created_at DESC);

-- Enable query statistics
SELECT query, calls, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Fix N+1 queries
-- Use JOINs instead of sequential queries
-- Batch operations where possible
```

**Expected Improvement**: 30-50% faster queries

#### Step 2: Upgrade Plan (Paid)

Upgrade through Supabase dashboard:

| Plan | Storage | Connections | Price/mo |
|------|---------|-------------|----------|
| Starter | 500MB | 2 | Free |
| Pro | 8GB | 20 | $25 |
| Enterprise | Unlimited | Unlimited | Custom |

**When to Upgrade**: When approaching storage limit or connection pool full

#### Step 3: Read Replicas

For heavy read workloads:

```typescript
// Read from replica (for reporting, analytics)
const { data: stats } = await replicaClient
  .from('learner_progress')
  .select('COUNT(*)')
  .eq('completed_at', dateRange);

// Write to primary (for all inserts/updates)
const { error } = await primaryClient
  .from('learner_progress')
  .insert(progressData);
```

**Cost**: ~$1.25/day per replica  
**Benefit**: 2-3x read throughput increase

#### Step 4: Database Sharding (Advanced)

When single database becomes bottleneck:

```typescript
// Shard by user ID (hash)
const shardId = hash(userId) % NUM_SHARDS;
const dbConnection = getDatabaseForShard(shardId);

// Query from correct shard
const { data } = await dbConnection
  .from('learner_progress')
  .select()
  .eq('user_id', userId);
```

**Complexity**: High  
**Benefit**: Unlimited horizontal scaling  
**When**: 100K+ concurrent users

---

## ⚡ API & Caching Scaling

### Current Caching Strategy

```typescript
// No caching currently
// Every request hits database
```

### Phase 2: Add Redis Cache

```bash
# Add Redis
npm install redis

# Start Redis
redis-server
```

**Cache Strategy**:

```typescript
// lib/cache.ts
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
});

export async function getModules(page: number, limit: number) {
  const cacheKey = `modules:${page}:${limit}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Query database
  const modules = await ModuleRepository.getAll(page, limit);
  
  // Cache for 1 hour
  await redis.setEx(cacheKey, 3600, JSON.stringify(modules));
  
  return modules;
}

// Invalidate cache on updates
export async function completeModule(userId: string, moduleId: string) {
  const result = await ModuleService.completeModule(userId, moduleId);
  
  // Clear relevant caches
  await redis.del('modules:*');
  await redis.del(`progress:${userId}:*`);
  
  return result;
}
```

**What to Cache**:
- Learning modules list (changes rarely)
- Q&A answers (changes rarely)
- Source references (static)
- User progress (changes frequently - cache with TTL)

**What NOT to Cache**:
- User-specific progress (frequent updates)
- Authentication tokens (use JWT)
- Real-time data (streamed separately)

**Expected Improvement**: 10x faster reads, 50% less database load

### Phase 3: Add CDN for Static Assets

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['cdn.pathmuslim.com'],
    formats: ['image/avif', 'image/webp'],
  },
  staticPageGenerationTimeout: 60,
};
```

**Benefits**:
- Faster static asset delivery
- Reduced bandwidth costs
- Improved user experience
- Geographic distribution

---

## 🌍 Geographic Scaling

### Single Region (Current)
```
┌─────────────────────────────────────┐
│  Vercel US (Edge, auto-distributed) │
│  Supabase (US East)                 │
└─────────────────────────────────────┘
```

**Latency**: 
- US: 20-50ms ✅
- Europe: 100-150ms ⚠️
- Asia: 200-300ms ❌

### Multi-Region (Phase 3+)

**Option 1: Edge Functions + Read Replicas**

```
Edge Locations (Vercel):
├── us-west
├── eu-west
├── ap-southeast
└── ... (70+ locations globally)

Primary Database: US
Read Replicas:
├── Europe
└── Asia
```

**Cost**: ~$200-500/month  
**Benefit**: Global coverage, <100ms for most users

**Option 2: Database Replication**

```typescript
// Route requests to nearest database
const nearestDB = getNearestDatabase(userRegion);
const { data } = await nearestDB
  .from('learning_modules')
  .select();
```

**Cost**: High  
**Benefit**: Consistent low latency globally  
**When**: 100K+ users across continents

---

## 📊 Load Balancing

### Current Setup (Single Vercel)
```
User → Vercel → Supabase
```

**Max Throughput**: ~100 requests/second  
**When to Scale**: At 50 req/sec sustained

### Load Balanced Setup

```
Users
  ├─ Vercel Region 1 ──┐
  ├─ Vercel Region 2 ──┼──→ Supabase (Primary)
  └─ Vercel Region 3 ──┘
```

**Vercel Auto-Scaling**:
- Automatically scales across regions
- No configuration needed
- Pay per-request

**Custom Load Balancing**:

```typescript
// Load balance API calls
const apis = [
  'https://api-1.pathmuslim.com',
  'https://api-2.pathmuslim.com',
  'https://api-3.pathmuslim.com',
];

function selectAPI(): string {
  const index = Math.floor(Math.random() * apis.length);
  return apis[index];
}

const response = await fetch(`${selectAPI()}/api/modules`);
```

---

## 👥 Concurrent User Capacity

### Current Capacity Analysis

| Metric | Current | Bottleneck | Upgrade |
|--------|---------|-----------|---------|
| Concurrent Users | 100 | Connections | Read Replicas |
| Requests/sec | 100 | API CPU | Load Balance |
| Storage | 500MB | Disk | Upgrade Plan |
| Session TTL | 24h | Memory | Redis |

### Capacity Planning

```
Concurrent Users = (Requests/sec) × (Avg Session Duration) / 2

Example:
- 100 req/sec
- 1 min avg session
- 100 × 1 / 2 = 50 concurrent users

Growth:
- 1,000 users → 250 concurrent → 500 req/sec
- 10,000 users → 2,500 concurrent → 5,000 req/sec
- 100,000 users → 25,000 concurrent → Need sharding
```

---

## 🔄 Async Job Scaling

### Current (Synchronous)
```
User Request
  ├── API receives
  ├── Process
  └── Return response (blocks until complete)
```

**Problem**: Long operations block API

### Phase 2: Background Jobs Queue

```bash
# Add Bull (Redis-based queue)
npm install bull
```

**Implementation**:

```typescript
import Queue from 'bull';

// Create job queue
const emailQueue = new Queue('emails', process.env.REDIS_URL);

// API: Enqueue job (fast response)
export async function submitQuestion(question: SubmitQuestionRequest) {
  const result = await QuestionRepository.create(question);
  
  // Enqueue email notification (async)
  await emailQueue.add({
    userId: question.user_id,
    questionId: result.id,
  });
  
  return result; // Return immediately
}

// Worker: Process jobs in background
emailQueue.process(async (job) => {
  const { userId, questionId } = job.data;
  await sendEmailNotification(userId, questionId);
});
```

**Benefits**:
- Faster API response times
- Can retry failed jobs
- Distribute processing load
- Scale workers independently

**What to Queue**:
- Email notifications
- Slack messages
- Analytics events
- Report generation
- Data cleanup

---

## 📊 Monitoring & Capacity Planning

### Key Metrics to Track

```typescript
// lib/monitoring.ts
export function trackMetrics() {
  // API metrics
  recordMetric('api.response_time', responseTime, { endpoint, method });
  recordMetric('api.error_rate', errorCount / totalRequests);
  recordMetric('api.requests_per_second', rps);
  
  // Database metrics
  recordMetric('db.query_time', queryTime);
  recordMetric('db.connections.active', activeConnections);
  recordMetric('db.connections.max', maxConnections);
  recordMetric('db.storage_used', storageBytes);
  
  // Business metrics
  recordMetric('users.active', activeUserCount);
  recordMetric('modules.completed', completionCount);
  recordMetric('api.health', serverHealth);
}
```

### Alert Thresholds

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Response Time | 500ms | 1000ms | Optimize queries |
| Error Rate | 1% | 5% | Investigate logs |
| DB CPU | 60% | 80% | Upgrade plan |
| Storage | 70% | 90% | Archive/upgrade |
| Connections | 80% | 95% | Scale replicas |

### Forecasting Growth

```
Current: 1,000 users
Projected: 10,000 users in 6 months (10x growth)

Action Timeline:
- Month 2: Add Redis cache
- Month 3: Upgrade database
- Month 4: Add CDN
- Month 5: Add read replicas
- Month 6: Monitor for further scaling
```

---

## 🚀 Scaling Checklist

### Before Scaling
- [ ] Current bottleneck identified
- [ ] Metrics baseline established
- [ ] Growth projections made
- [ ] Budget approved
- [ ] Risk assessed

### During Scaling
- [ ] Deploy to staging first
- [ ] Run load tests
- [ ] Monitor metrics
- [ ] No service interruption
- [ ] Team trained

### After Scaling
- [ ] Verify improvement
- [ ] Monitor for new bottlenecks
- [ ] Document changes
- [ ] Update runbooks
- [ ] Plan next phase

---

## 💰 Cost Optimization

### Current Costs (Estimated)
```
Vercel: $25/month (Pro plan)
Supabase: Free tier + overages
Redis: None (optional)
CDN: Included with Vercel
───────────────────────
Total: ~$25/month
```

### Scaling Costs Projection

```
1,000 users:   $25/month ✅
10,000 users:  $150/month (DB upgrade, Redis)
100,000 users: $1,000/month (Read replicas, CDN)
```

### Cost Reduction Strategies

1. **Query Optimization** (Free)
   - Add proper indexes
   - Remove N+1 queries
   - Cache aggressively

2. **Rate Limiting** ($0)
   - Prevent abuse
   - Reduce invalid requests
   - Saves database load

3. **Data Cleanup** ($0)
   - Archive old data
   - Delete duplicates
   - Compress large fields

---

## 🔧 Performance Benchmarks

### Target Metrics

| Component | P95 Latency | Availability | Cost |
|-----------|------------|--------------|------|
| API Response | < 100ms | 99.95% | Optimal |
| Database Query | < 50ms | 99.99% | Optimal |
| Static Assets | < 50ms | 99.99% | Optimal |
| Full Page Load | < 2s | 99.9% | Optimal |

### Load Testing

```bash
# Install artillery
npm install -g artillery

# Create load test
cat > load-test.yml <<EOF
config:
  target: "https://pathmuslim.com"
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
scenarios:
  - name: "Typical user flow"
    flow:
      - get:
          url: "/api/learning/modules"
      - get:
          url: "/api/qa/search?q=prayer"
      - post:
          url: "/api/modules/complete"
          json: { score: 85 }
EOF

# Run test
artillery run load-test.yml
```

---

## 📞 Support & Escalation

**Scaling Issues?**

1. Check metrics dashboard
2. Identify bottleneck
3. Follow scaling playbook
4. Contact platform support:
   - Vercel Support: vercel.com/support
   - Supabase Support: supabase.com/support

---

## 📚 Related Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment procedures
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Data structure
- [Monitoring Setup](./DEPLOYMENT.md#-monitoring--alerting)

---

**Last Updated**: 2026-05-25  
**Owner**: Infrastructure Team  
**Review Frequency**: Quarterly
