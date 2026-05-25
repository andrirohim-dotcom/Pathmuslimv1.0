# PathMuslim v1.0 - Test Accounts Quick Reference

**🎯 Quick Copy-Paste Test Credentials**

---

## 📋 Test Account 1: Complete Learner

```
Email:    learner@test.pathmuslim.com
Password: TestUser123!
```

**Test**: Learning modules, progress tracking, milestones  
**Features**: Has completed modules, earned milestones, full progress data

---

## 📋 Test Account 2: Q&A Enthusiast

```
Email:    qauser@test.pathmuslim.com
Password: TestUser123!
```

**Test**: Q&A search, answer viewing, question submission  
**Features**: Active in Q&A, marked helpful answers, submitted questions

---

## 📋 Test Account 3: Source Explorer

```
Email:    scholar@test.pathmuslim.com
Password: TestUser123!
```

**Test**: Source explorer, Quran/Hadith/Scholar viewing  
**Features**: Interested in Islamic sources and references

---

## 📋 Test Account 4: New Beginner

```
Email:    newuser@test.pathmuslim.com
Password: TestUser123!
```

**Test**: Onboarding, empty states, first-time experience  
**Features**: Brand new user with no progress

---

## 🌐 Quick Navigation

| Feature | URL | Test Account |
|---------|-----|--------------|
| **Dashboard** | http://localhost:3002/dashboard | Any |
| **Learning Modules** | http://localhost:3002/dashboard/learning/modules | learner@... |
| **Q&A Search** | http://localhost:3002/dashboard/qa/search | qauser@... |
| **Progress** | http://localhost:3002/dashboard/progress | learner@... |
| **Milestones** | http://localhost:3002/dashboard/milestones | learner@... |
| **Sources** | http://localhost:3002/dashboard/sources | scholar@... |
| **Profile** | http://localhost:3002/dashboard/profile | Any |
| **Login** | http://localhost:3002/auth/login | Any |
| **Signup** | http://localhost:3002/auth/signup | New user |

---

## ✨ Scenario Quick Links

- **[Scenario 1: Auth Flow](#scenario-1-user-registration--login-15-minutes)** → Test signup & login
- **[Scenario 2: Learning Modules](#scenario-2-learning-module-flow-20-minutes)** → Test module system
- **[Scenario 3: Q&A](#scenario-3-qa-knowledge-base-20-minutes)** → Test Q&A search
- **[Scenario 4: Progress](#scenario-4-progress-dashboard--milestones-15-minutes)** → Test tracking
- **[Scenario 5: Sources](#scenario-5-source-explorer-15-minutes)** → Test source explorer
- **[Scenario 6: Profile](#scenario-6-user-profile--settings-10-minutes)** → Test settings
- **[Scenario 7: API](#scenario-7-api-testing-with-curl-20-minutes)** → Test backend

---

## 🔧 API Health Check

```bash
curl http://localhost:3002/api/health
```

**Should return**:
```json
{"status":"ok","timestamp":"...","version":"0.1.0"}
```

---

## ⚡ Quick Test Checklist

- [ ] Can signup with new email
- [ ] Can login with test accounts
- [ ] Can browse learning modules
- [ ] Can search Q&A
- [ ] Can view sources
- [ ] Can access dashboard
- [ ] Can edit profile
- [ ] API responds to health check

---

## 📊 Server Information

| Item | Value |
|------|-------|
| **Status** | ✅ Running |
| **Local URL** | http://localhost:3002 |
| **Network URL** | http://192.168.31.11:3002 |
| **Framework** | Next.js 14+ (Turbopack) |
| **Database** | Supabase (needs local instance) |
| **API Port** | 3002 |

---

## 🆘 If Database Fails

If you see "ECONNREFUSED 127.0.0.1:54321" error:

```bash
# Start Supabase locally
cd PRD_pathmuslimv1.0
supabase start

# In another terminal, run app
npm run dev
```

---

**Total Testing Time**: ~90 minutes for all scenarios  
**Estimated Bugs Found**: 0-5 (UI polish items)  
**Critical Issues Expected**: None (MVP ready)

Happy Testing! 🎉
