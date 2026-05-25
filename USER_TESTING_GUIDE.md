# PathMuslim v1.0 - User Testing Guide

**Date**: 2026-05-25  
**Purpose**: Comprehensive testing guide with test accounts and scenarios  
**Status**: Ready for testing

---

## 🧪 Test Accounts

Use these credentials to test the application:

### Test User 1: Complete Learner
```
Email:    learner@test.pathmuslim.com
Password: TestUser123!
Name:     Ahmad Learner
Role:     Full access to all features
```
**Profile**: Active learner, completed some modules, has progress
**Use for**: Testing learning flow, progress tracking, milestones

---

### Test User 2: Q&A Enthusiast
```
Email:    qauser@test.pathmuslim.com
Password: TestUser123!
Name:     Fatima QA
Role:     Active in Q&A system
```
**Profile**: Searches Q&A regularly, submitted questions, marks helpful answers
**Use for**: Testing Q&A search, answer viewing, question submission

---

### Test User 3: Source Explorer
```
Email:    scholar@test.pathmuslim.com
Password: TestUser123!
Name:     Muhammad Scholar
Role:     Interest in sources
```
**Profile**: Explores Quran, Hadith, and scholarly references
**Use for**: Testing source explorer, citation viewing, reference linking

---

### Test User 4: New Beginner
```
Email:    newuser@test.pathmuslim.com
Password: TestUser123!
Name:     Aisha Beginner
Role:     Brand new user
```
**Profile**: Just signed up, no progress yet
**Use for**: Testing onboarding flow, empty states, first-time user experience

---

## 🎯 Testing Scenarios

### Scenario 1: User Registration & Login (15 minutes)

**Objective**: Verify authentication flow works correctly

**Steps**:
1. [ ] Open http://localhost:3002
2. [ ] Click "Sign Up" button
3. [ ] Enter test email and password:
   ```
   Email: testuser.new@pathmuslim.com
   Password: NewTest123!
   Confirm Password: NewTest123!
   ```
4. [ ] Click "Create Account"
5. [ ] Verify confirmation email sent (check console/logs)
6. [ ] After signup, you should be redirected to dashboard
7. [ ] Logout
8. [ ] Click "Login"
9. [ ] Enter credentials you just created
10. [ ] Verify you're logged in

**Expected Results**:
- ✅ Signup completes successfully
- ✅ User redirected to dashboard
- ✅ Login works with new credentials
- ✅ Session maintained across navigation

---

### Scenario 2: Learning Module Flow (20 minutes)

**Objective**: Test module browsing, viewing, and progress tracking

**Steps**:
1. [ ] Login with `learner@test.pathmuslim.com`
2. [ ] Click "Learning Modules" in navigation
3. [ ] Browse module list - you should see 20+ modules
4. [ ] Click on first module "Islam Fundamentals"
5. [ ] Read module content and learning objectives
6. [ ] Review prerequisites (if any)
7. [ ] Click "Complete Module" button
8. [ ] Enter assessment score (0-100)
9. [ ] Click "Submit"
10. [ ] You should see success message
11. [ ] Check progress increased
12. [ ] Go to "Progress Dashboard"
13. [ ] Verify module marked as completed
14. [ ] Check statistics updated

**Expected Results**:
- ✅ Module list displays all modules
- ✅ Module detail shows content, objectives, sources
- ✅ Can complete module with assessment score
- ✅ Progress dashboard updates
- ✅ Completion percentage increases

---

### Scenario 3: Q&A Knowledge Base (20 minutes)

**Objective**: Test Q&A search, viewing answers, and submissions

**Steps**:
1. [ ] Login with `qauser@test.pathmuslim.com`
2. [ ] Click "Q&A Search" in navigation
3. [ ] Search for "daily prayer" in search box
4. [ ] See results with relevant questions
5. [ ] Click on first answer
6. [ ] Read answer with scholarly perspective and contemporary context
7. [ ] Review sources cited at bottom
8. [ ] Click "Helpful" button to mark as useful
9. [ ] Go back to search
10. [ ] Click "Ask a Question" button
11. [ ] Enter new question:
    ```
    Title: How to maintain wudu during work?
    Category: Daily Life
    Content: I work in an environment where water is not easily accessible...
    ```
12. [ ] Click "Submit Question"
13. [ ] See "Question submitted" confirmation
14. [ ] Check question appears in pending list

**Expected Results**:
- ✅ Search finds relevant Q&A pairs
- ✅ Answer displays with sources
- ✅ Helpful voting works
- ✅ Question submission succeeds
- ✅ Question appears in system

---

### Scenario 4: Progress Dashboard & Milestones (15 minutes)

**Objective**: Test progress tracking and milestone system

**Steps**:
1. [ ] Login with `learner@test.pathmuslim.com`
2. [ ] Click "Progress" in navigation
3. [ ] View dashboard with statistics:
    - Overall completion percentage
    - Modules completed
    - Time spent
    - Learning streak
4. [ ] Check estimated time to completion
5. [ ] Scroll to see your skills/competencies
6. [ ] Click "Milestones" tab
7. [ ] View achievement badges
8. [ ] Check which milestones you've earned
9. [ ] Check next milestone and progress toward it
10. [ ] Try to complete another module to trigger milestone

**Expected Results**:
- ✅ Dashboard shows accurate statistics
- ✅ Progress calculated correctly
- ✅ Milestones display properly
- ✅ Achievement badges show
- ✅ Next milestone shows progress bar

---

### Scenario 5: Source Explorer (15 minutes)

**Objective**: Test browsing Quran, Hadith, and Scholar references

**Steps**:
1. [ ] Login with `scholar@test.pathmuslim.com`
2. [ ] Click "Sources" in navigation
3. [ ] You should see three tabs: Quran, Hadith, Scholars
4. [ ] Click "Quran" tab
5. [ ] Browse Surah list
6. [ ] Select "Surah Al-Fatiha"
7. [ ] View verses with Arabic and English
8. [ ] Note the source citation format
9. [ ] Click "Hadith" tab
10. [ ] Browse Hadith collections
11. [ ] View Hadith with authentication grade
12. [ ] Click "Scholars" tab
13. [ ] Browse scholar references
14. [ ] View scholar profiles and key works
15. [ ] Search for a specific topic across all sources

**Expected Results**:
- ✅ All source types display correctly
- ✅ Quran verses show Arabic and English
- ✅ Hadith grading system displays
- ✅ Scholar information clear
- ✅ Source citations consistent and informative

---

### Scenario 6: User Profile & Settings (10 minutes)

**Objective**: Test profile management and preferences

**Steps**:
1. [ ] Login with any test account
2. [ ] Click profile icon/menu (top right)
3. [ ] Click "Profile Settings"
4. [ ] View/edit profile information:
    - [ ] Name
    - [ ] Email
    - [ ] Learning language preference
    - [ ] Time zone
5. [ ] Make one change (e.g., timezone)
6. [ ] Click "Save Changes"
7. [ ] Verify save successful
8. [ ] Check notification preferences
9. [ ] Toggle email notifications
10. [ ] Logout and login again
11. [ ] Verify settings persisted

**Expected Results**:
- ✅ Profile page loads
- ✅ Can edit profile fields
- ✅ Changes save successfully
- ✅ Settings persist across sessions
- ✅ Notification preferences work

---

### Scenario 7: API Testing with curl (20 minutes)

**Objective**: Test backend API endpoints directly

**Steps**:

#### 7a. Health Check
```bash
curl http://localhost:3002/api/health
```
**Expected**: `{"status":"ok","timestamp":"...","version":"0.1.0"}`

#### 7b. Get Auth Token
```bash
curl -X POST http://localhost:3002/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "learner@test.pathmuslim.com",
    "password": "TestUser123!"
  }'
```
**Expected**: Returns auth token

#### 7c. Get Modules (with token)
```bash
# Replace TOKEN with token from 7b
curl http://localhost:3002/api/learning/modules \
  -H "Authorization: Bearer TOKEN"
```
**Expected**: JSON array of modules

#### 7d. Search Q&A
```bash
curl "http://localhost:3002/api/qa/search?query=prayer" \
  -H "Authorization: Bearer TOKEN"
```
**Expected**: JSON array of answers

#### 7e. Get Categories
```bash
curl http://localhost:3002/api/qa/categories \
  -H "Authorization: Bearer TOKEN"
```
**Expected**: JSON array of Q&A categories

**Expected Results**:
- ✅ All endpoints respond with valid JSON
- ✅ Auth token required and validated
- ✅ Search returns relevant results
- ✅ Categories list complete

---

## ⚠️ Known Issues & Workarounds

### Issue 1: Database Connection
**Problem**: "ECONNREFUSED 127.0.0.1:54321"  
**Cause**: Supabase local instance not running  
**Solution**: 
```bash
# Start Supabase locally
supabase start

# Then run app
npm run dev
```

### Issue 2: "middleware deprecated" warning
**Problem**: Deprecation warning on startup  
**Cause**: Next.js configuration  
**Solution**: Non-blocking - app works fine, can be fixed in next version

### Issue 3: Image aspect ratio warning
**Problem**: Default Next.js template image sizing  
**Cause**: Template component  
**Solution**: Non-critical, visual only

---

## 🐛 Bug Report Template

If you find issues, use this template:

```
**Title**: [Brief description of issue]

**Steps to Reproduce**:
1. [First step]
2. [Second step]
3. [Expected result vs actual result]

**Environment**:
- Browser: [Chrome/Firefox/Safari]
- URL: [Where issue occurs]
- User Account: [Which test account]

**Screenshot**: [If applicable]

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happens]
```

---

## ✅ Testing Checklist

Use this checklist to track your testing:

### User Registration & Auth
- [ ] Signup flow works
- [ ] Login works
- [ ] Logout works
- [ ] Session persists
- [ ] Password reset works

### Learning Modules
- [ ] Module list loads
- [ ] Module detail displays
- [ ] Can complete module
- [ ] Assessment score saves
- [ ] Progress updates

### Q&A System
- [ ] Search works
- [ ] Results relevant
- [ ] Answers display sources
- [ ] Can mark helpful
- [ ] Can submit question

### Progress Tracking
- [ ] Dashboard shows stats
- [ ] Milestones display
- [ ] Achievements unlock
- [ ] Progress calculated correctly

### Source Explorer
- [ ] Quran viewer works
- [ ] Hadith browser works
- [ ] Scholar reference works
- [ ] Citations display correctly

### User Profile
- [ ] Can view profile
- [ ] Can edit settings
- [ ] Changes save
- [ ] Settings persist

### API Endpoints
- [ ] Health check responds
- [ ] Auth endpoints work
- [ ] Module API works
- [ ] Q&A API works
- [ ] Source API works

### Error Handling
- [ ] Invalid login shows error
- [ ] Missing fields show error
- [ ] Network errors handled
- [ ] 404 pages display
- [ ] Error messages helpful

---

## 📝 Testing Notes

### Performance
- [ ] Pages load quickly (< 2 seconds)
- [ ] API responses fast (< 500ms)
- [ ] No lag when scrolling
- [ ] Smooth animations

### Design & UX
- [ ] Mobile responsive (test on phone)
- [ ] Colors consistent
- [ ] Fonts readable
- [ ] Buttons clickable
- [ ] Navigation clear

### Accessibility
- [ ] Can navigate with keyboard
- [ ] Text has good contrast
- [ ] Images have alt text
- [ ] Links understandable
- [ ] Forms labeled properly

---

## 📞 Support

**If you encounter issues**:

1. Check the "Known Issues" section above
2. Review the bug report template
3. Check browser console for errors (F12)
4. Check server logs (where dev server is running)
5. Try clearing browser cache and logging back in

---

## 🎯 Success Criteria

Testing is **SUCCESSFUL** when:
- ✅ All 7 scenarios complete without critical errors
- ✅ User can create account and login
- ✅ User can complete modules and see progress
- ✅ User can search and view Q&A answers
- ✅ User can explore sources
- ✅ User can view profile and settings
- ✅ API endpoints respond correctly
- ✅ No critical bugs found

---

## 🚀 Next Steps After Testing

1. **Report findings** - Use bug report template
2. **Document issues** - Note severity and reproduction steps
3. **Test Phase 7** - When documentation is ready
4. **Plan Phase 2** - Mobile apps, advanced features
5. **Prepare for launch** - Production deployment

---

**Happy Testing! 🎉**

For questions during testing, refer to:
- PROGRESS_REPORT.md - Feature overview
- CODEBASE_GUIDE.md - Code navigation
- API endpoints - Built-in health check at /api/health

---

**Generated**: 2026-05-25  
**Version**: 1.0  
**Status**: Ready for User Testing
