# 🚨 URL and Flow Issues Found

## Critical Issues

### 1. **Backend Route Order Conflicts** ⚠️ HIGH PRIORITY

**Problem:** Express routes are evaluated in order, and dynamic routes (`:param`) are catching requests meant for specific routes.

#### Issue A: Job Routes (`backend/src/routes/job.routes.ts`)
Current order causes conflicts:
```typescript
router.get('/:jobId', authenticateUser, getJobById);           // Line 1 - CATCHES EVERYTHING
router.get('/public/:jobId', getPublicJob);                    // Line 2 - NEVER REACHED
router.post('/ai/generate-description', ...);                  // Line 3 - NEVER REACHED
```

**Impact:**
- ❌ `/api/jobs/public/abc123` → Tries to authenticate `public` as jobId → 401 Unauthorized
- ❌ `/api/jobs/ai/generate-description` → Tries to get job with id `ai` → 404 Not Found
- ✅ `/api/jobs/abc123` → Works correctly

**Solution:** Reorder routes - specific paths BEFORE dynamic params:
```typescript
// Specific routes FIRST
router.get('/public/:jobId', getPublicJob);
router.post('/ai/generate-description', authenticateUser, ...);

// Dynamic routes LAST
router.get('/:jobId', authenticateUser, getJobById);
```

#### Issue B: Candidate Routes (`backend/src/routes/candidate.routes.ts`)
Current order:
```typescript
router.get('/:candidateId', authenticateUser, getCandidateById);  // CATCHES dashboard
router.get('/dashboard/stats', authenticateUser, getDashboardStats); // NEVER REACHED
```

**Impact:**
- ❌ `/api/candidates/dashboard/stats` → Tries to get candidate with id `dashboard` → 404
- ✅ `/api/candidates/abc123` → Works correctly

**Solution:** Move `/dashboard/stats` before `/:candidateId`

---

### 2. **Missing Frontend Pages** ⚠️ MEDIUM PRIORITY

#### Missing: `/dashboard/jobs/new`
**Found in:** 
- `frontend/src/app/dashboard/page.tsx` line 95: `<Link href="/dashboard/jobs/new">`
- `frontend/src/app/dashboard/page.tsx` line 96: `Create New Job Post` button

**Impact:** Clicking "Create New Job Post" on dashboard → 404 Not Found

**Solution:** Either:
- Create `frontend/src/app/dashboard/jobs/new/page.tsx` for dedicated create page
- Or change link to `/dashboard/jobs` and use modal (current jobs page already has create modal)

#### Missing: `/forgot-password`
**Found in:**
- `frontend/src/app/login/page.tsx` line 73: `<a href="/forgot-password">`

**Impact:** Clicking "Forgot Password?" → 404 Not Found

**Solution:** Create `frontend/src/app/forgot-password/page.tsx` or remove the link

---

## Flow Analysis

### ✅ Working Flows:

1. **Authentication Flow:**
   - `/` → `/login` → `/dashboard` ✅
   - `/` → `/signup` → `/dashboard` ✅
   - Sign out redirects to `/login` ✅

2. **Dashboard Navigation:**
   - `/dashboard` → Shows stats ✅
   - `/dashboard/jobs` → List/create/edit jobs ✅
   - `/dashboard/candidates` → View candidates by job ✅
   - `/dashboard/settings` → User settings ✅

3. **Manual Job Creation:**
   - Create job from `/dashboard/jobs` → POST `/api/jobs` ✅
   - Edit job → PUT `/api/jobs/:id` ✅
   - Delete job → DELETE `/api/jobs/:id` ✅

### ❌ Broken Flows:

1. **Public Job Application Flow:**
   ```
   User clicks application link
     ↓
   GET /api/jobs/public/:jobId  ← 401 ERROR (route caught by /:jobId)
     ↓
   Application page shows error
   ```

2. **AI Job Description Generation:**
   ```
   User clicks "Generate with AI"
     ↓
   POST /api/jobs/ai/generate-description  ← 404 ERROR (caught by /:jobId route)
     ↓
   Generation fails
   ```

3. **Dashboard Stats Loading:**
   ```
   Dashboard page loads
     ↓
   GET /api/candidates/dashboard/stats  ← 404 ERROR (caught by /:candidateId)
     ↓
   Stats show 0/0/0
   ```

4. **Create New Job Button:**
   ```
   Click "Create New Job Post" on dashboard
     ↓
   Navigate to /dashboard/jobs/new  ← 404 (page doesn't exist)
   ```

5. **Forgot Password Link:**
   ```
   Click "Forgot Password?" on login
     ↓
   Navigate to /forgot-password  ← 404 (page doesn't exist)
   ```

---

## URL Mapping Reference

### Backend API Routes
| Method | URL | Controller | Auth | Status |
|--------|-----|------------|------|--------|
| GET | `/api/health` | Health check | No | ✅ Works |
| POST | `/api/jobs` | Create job | Yes | ✅ Works |
| GET | `/api/jobs` | List jobs | Yes | ✅ Works |
| GET | `/api/jobs/:jobId` | Get job | Yes | ✅ Works |
| GET | `/api/jobs/public/:jobId` | Public job | No | ❌ BROKEN |
| PUT | `/api/jobs/:jobId` | Update job | Yes | ✅ Works |
| DELETE | `/api/jobs/:jobId` | Delete job | Yes | ✅ Works |
| POST | `/api/jobs/ai/generate-description` | AI generate | Yes | ❌ BROKEN |
| POST | `/api/candidates/apply/:jobId` | Apply | No | ⚠️ AFFECTED |
| GET | `/api/candidates/job/:jobId` | Candidates by job | Yes | ✅ Works |
| GET | `/api/candidates/:candidateId` | Get candidate | Yes | ✅ Works |
| GET | `/api/candidates/dashboard/stats` | Dashboard stats | Yes | ❌ BROKEN |
| POST | `/api/webhooks/update-interview` | Webhook | Secret | ✅ Works |

### Frontend Routes
| Path | Component | Auth | Status |
|------|-----------|------|--------|
| `/` | Landing | No | ✅ Works |
| `/login` | Login | No | ✅ Works |
| `/signup` | Signup | No | ✅ Works |
| `/forgot-password` | - | No | ❌ MISSING |
| `/dashboard` | Dashboard | Yes | ✅ Works |
| `/dashboard/jobs` | Jobs list | Yes | ✅ Works |
| `/dashboard/jobs/new` | - | Yes | ❌ MISSING |
| `/dashboard/candidates` | Candidates | Yes | ✅ Works |
| `/dashboard/settings` | Settings | Yes | ✅ Works |
| `/apply/:jobId` | Application | No | ⚠️ AFFECTED |

---

## Fix Priority

### 🔴 Critical (Fix Immediately)
1. Fix backend route order for jobs (breaks AI & public applications)
2. Fix backend route order for candidates (breaks dashboard stats)

### 🟡 Important (Fix Soon)
3. Create or fix `/dashboard/jobs/new` link
4. Create or remove `/forgot-password` link

### 🟢 Enhancement (Optional)
5. Add error boundaries for missing routes
6. Add route transition loading states

---

**Generated:** October 15, 2025  
**Next Steps:** Fix route order in backend routes files
