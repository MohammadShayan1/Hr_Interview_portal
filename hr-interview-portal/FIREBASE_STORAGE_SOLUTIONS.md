# Firebase Storage - Free Tier Issue & Solutions

## 🔴 Problem

Firebase Cloud Storage is **NOT included in the Spark Plan (free tier)**. You need to upgrade to the **Blaze Plan (pay-as-you-go)** to use Cloud Storage.

### Current Usage
Your application uses Firebase Storage to:
- Store uploaded resumes in `resumes/{jobId}/{timestamp}_{filename}` structure
- Make files publicly accessible for download
- Keep resumes linked to candidate records

## 💰 Upgrade Path

### Blaze Plan (Pay-as-you-go)
- **Storage**: $0.18 per GB/month
- **Network**: $0.12 per GB egress
- **Typical cost**: ~$5-20/month for small-to-medium usage

⚠️ **Important**: You must have a valid credit card to enable Blaze Plan.

---

## 🛠️ Solution Options

### Option 1: Upgrade to Blaze Plan (Recommended for Production)

**Pros:**
- Minimal code changes
- Production-ready
- Built-in access control

**Cons:**
- Requires payment
- Pay per usage

**Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click on your project
3. Go to **Settings** → **Billing** (or **Plan & pricing**)
4. Click **Upgrade to Blaze**
5. Add a valid credit card
6. Confirm upgrade
7. Storage will be enabled automatically

---

### Option 2: Use Local Server Storage (Development Only)

Store files on your backend server instead of cloud storage.

**Pros:**
- Free
- Works with Spark Plan
- Good for development/testing

**Cons:**
- Not scalable
- Need to manage file storage manually
- Not suitable for production
- Files lost if server resets

**Implementation:**
See Section: "Option 2 - Local Server Storage Implementation" below.

---

### Option 3: Use Free Third-Party Storage

Use free cloud storage services instead of Firebase.

**Options:**
- **AWS S3 Free Tier**: 5GB storage (12 months only)
- **Backblaze B2**: $0.006 per GB/month (very cheap)
- **MinIO**: Self-hosted (free)
- **Cloudinary**: Free tier (5GB storage, useful for media)

**Pros:**
- Potentially free or very cheap
- More granular control
- Good for specific use cases

**Cons:**
- Additional service to manage
- More complex setup
- May have different API

---

### Option 4: Remove Resume Storage (Simplified)

Store resume URL only, no actual file storage.

**Pros:**
- No storage costs
- Simplest implementation
- Works with Spark Plan

**Cons:**
- Can't persist resumes long-term
- Limited resume management
- Temporary solution only

**Implementation:**
Only accept resume URLs from candidates instead of file uploads.

---

## 📋 Recommended Actions by Use Case

### For Development/Testing
Use **Option 2 (Local Server Storage)** for free testing with minimal changes.

### For Small Production
Use **Option 1 (Blaze Plan)** with budget alerts to monitor costs.

### For Large Scale
Use **Option 3 (AWS S3 or Backblaze)** for better cost control.

### For MVP
Use **Option 4 (No Storage)** temporarily until ready to scale.

---

## 📝 Implementation Details

### Option 2: Local Server Storage Implementation

**Step 1: Create upload directory**

```bash
# Create storage directory
mkdir -p backend/storage/resumes
```

**Step 2: Update candidate.controller.ts**

Replace Firebase Storage with local file system:

```typescript
import fs from 'fs-extra';
import path from 'path';

// Define local storage path
const LOCAL_STORAGE_PATH = path.join(process.cwd(), 'storage', 'resumes');

export const applyForJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const { name, email, phone, experience } = req.body;
    const file = req.file;
    
    if (!file) {
      throw new ApiError(400, 'Resume file is required');
    }
    
    // Verify job exists
    const jobDoc = await db().collection('jobs').doc(jobId).get();
    
    if (!jobDoc.exists) {
      throw new ApiError(404, 'Job not found');
    }
    
    const jobData = jobDoc.data();
    
    // Create directory structure
    const jobDir = path.join(LOCAL_STORAGE_PATH, jobId);
    await fs.ensureDir(jobDir);
    
    // Save file locally
    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = path.join(jobDir, fileName);
    
    await fs.writeFile(filePath, file.buffer);
    
    // Generate local download URL
    const resumeUrl = `/api/candidates/resume/${jobId}/${fileName}`;
    
    // Create candidate record
    const candidateData = {
      jobId,
      name,
      email,
      phone,
      experience: parseInt(experience, 10),
      resumeUrl,
      status: 'Applied',
      interviewLink: null,
      interviewReport: null,
      appliedAt: new Date().toISOString(),
    };
    
    const candidateRef = await db().collection('candidates').add(candidateData);
    
    // ... rest of the function
  } catch (error) {
    logger.error('Error submitting application:', error);
    throw error;
  }
};
```

**Step 3: Add resume download endpoint**

```typescript
// In candidate.routes.ts
import { Router } from 'express';
import fs from 'fs-extra';
import path from 'path';

const router = Router();
const LOCAL_STORAGE_PATH = path.join(process.cwd(), 'storage', 'resumes');

// Download resume
router.get('/resume/:jobId/:fileName', async (req, res) => {
  try {
    const { jobId, fileName } = req.params;
    const filePath = path.join(LOCAL_STORAGE_PATH, jobId, fileName);
    
    // Security check: prevent directory traversal
    if (!filePath.startsWith(LOCAL_STORAGE_PATH)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Check if file exists
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Send file
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download resume' });
  }
});

export default router;
```

**Step 4: Update .gitignore**

```
# Ignore local storage
storage/resumes/
```

---

## ⚠️ Important Notes

### Storage Limits
- **Spark Plan**: 5GB total (includes Firestore + Storage)
- **Blaze Plan**: Unlimited (pay per usage)

### Security Considerations
- Local storage: Not secure for production
- Cloud storage: Better for production with proper rules
- Always validate file types and sizes
- Never trust client-provided file names

### Backup Strategy
- Local storage: Set up backup scripts
- Cloud storage: Use Firebase backup features
- Consider archival after interview completes

---

## 🚀 Next Steps

### To Upgrade to Blaze Plan
1. Open Firebase Console
2. Navigate to Billing
3. Click "Upgrade to Blaze"
4. Add payment method
5. Confirm upgrade

### To Implement Local Storage (Dev Only)
1. Follow "Option 2" implementation above
2. Test with local resume uploads
3. Verify resumeUrl format works

### To Monitor Costs (After Upgrade)
1. Set up Firebase billing alerts
2. Monitor usage in Firebase Console
3. Set daily/monthly budget caps
4. Review logs regularly

---

## 📚 References

- [Firebase Pricing](https://firebase.google.com/pricing)
- [Firebase Storage Quotas](https://firebase.google.com/docs/storage/usage-quotas)
- [Firebase Blaze Plan](https://firebase.google.com/docs/projects/billing/firebase-cloud-messaging-and-notifications-pricing)
- [Node.js fs Documentation](https://nodejs.org/api/fs.html)

---

## ❓ FAQ

**Q: Can I use Storage with Spark Plan?**
A: No, Cloud Storage requires Blaze Plan.

**Q: How much will Storage cost?**
A: ~$0.18/GB/month for storage + egress fees. ~$5-20/month for typical usage.

**Q: Can I switch back to Spark Plan?**
A: Only if you disable Cloud Storage and remove all files.

**Q: Is local file storage secure?**
A: Only for development. Not recommended for production.

**Q: What happens if I exceed Blaze budget?**
A: You can set billing alerts and caps to prevent overage.

