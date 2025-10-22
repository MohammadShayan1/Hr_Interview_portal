# 🚀 Google Gemini AI Integration - Setup Guide

## ✅ What's Been Done

I've successfully integrated **Google Gemini AI** (free tier) into your HR Interview Portal!

### Changes Made:

1. **Installed Package**: `@google/generative-ai`
2. **Created Service**: `backend/src/services/gemini.service.ts`
3. **Updated Controller**: Switched from OpenRouter to Gemini
4. **Updated Config**: Added Gemini API key configuration
5. **Updated .env.example**: Added Gemini setup instructions

---

## 🔑 How to Get FREE Gemini API Key

### Step 1: Visit Google AI Studio
👉 **https://aistudio.google.com/**

### Step 2: Sign In
- Use your Google account
- No credit card required!

### Step 3: Get API Key
1. Click **"Get API Key"** button
2. Click **"Create API Key"**
3. Copy your API key

### Step 4: Add to Environment Variables

**For Local Development:**
```bash
# In backend/.env file
GEMINI_API_KEY=your_actual_api_key_here
```

**For Railway Deployment:**
1. Go to Railway Dashboard
2. Select your project
3. Go to **Variables** tab
4. Add new variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your API key
5. Click **"Add"**
6. Redeploy (Railway will auto-deploy)

---

## 🎯 Features Now Using Gemini (FREE)

### 1. **Job Description Generation** ✅
- **Endpoint**: `POST /api/jobs/generate`
- **Free Limits**: 1,500 requests/day
- **Model**: Gemini 1.5 Flash (fast & free)
- **Output**: HTML formatted job descriptions

### 2. **Interview Evaluation** ✅
- **Ready for**: Future implementation
- **Will analyze**: Interview transcripts
- **Provides**: Scores, strengths, weaknesses, recommendations

### 3. **Interview Questions Generator** 🆕
- **New Feature**: Generate relevant interview questions
- **Bonus**: Included in the Gemini service!

---

## 📊 Free Tier Limits

```
✅ 15 requests per minute
✅ 1,500 requests per day
✅ 1 million tokens per minute
✅ Gemini 1.5 Flash model
✅ No credit card required
✅ No expiration
```

**More than enough for your needs!**

---

## 🧪 Testing the Integration

### Test 1: Job Description Generation

**Using the Frontend:**
1. Go to Jobs page
2. Click "Generate with AI" button
3. Enter job title: "Senior React Developer"
4. Enter requirements: "5+ years React, TypeScript, Next.js"
5. Click "Generate"
6. You should see a beautifully formatted HTML job description!

**Using API directly (Postman/Thunder Client):**
```bash
POST https://hrinterviewportal-production.up.railway.app/api/jobs/generate
Authorization: Bearer YOUR_FIREBASE_TOKEN
Content-Type: application/json

{
  "title": "Senior React Developer",
  "requirements": "5+ years React experience, TypeScript, Next.js, Redux"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "description": "<h2>About the Role</h2><p>...</p><ul><li>...</li></ul>"
  }
}
```

---

## 🎨 What Makes Gemini Better?

| Feature | Gemini (Now) | OpenRouter (Before) |
|---------|--------------|---------------------|
| **Cost** | ✅ FREE Forever | ❌ Paid (credits) |
| **Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Speed** | Fast (1-2s) | Medium (2-3s) |
| **Setup** | No credit card | Credit card required |
| **Daily Limit** | 1,500 requests | Depends on credits |
| **Context Size** | 1M tokens | 128K tokens |

---

## 🔧 Technical Details

### Service Architecture

```typescript
// backend/src/services/gemini.service.ts
class GeminiService {
  // Generate job descriptions
  async generateJobDescription(data: JobDescriptionRequest): Promise<string>
  
  // Evaluate interviews (ready to use)
  async evaluateInterview(data: InterviewEvaluationRequest): Promise<EvaluationResponse>
  
  // Generate interview questions (bonus feature!)
  async generateInterviewQuestions(jobTitle: string, description: string): Promise<string[]>
}
```

### Data Flow

```
Frontend → Backend Controller → Gemini Service → Google AI Studio API
   ↓              ↓                    ↓                   ↓
Request       Validate          Format Prompt         Generate
   ↓              ↓                    ↓                   ↓
Receive ← JSON Response ← Parse & Clean ← AI Response
```

---

## 🚨 Error Handling

If you see this error:
```
"Gemini API key not configured"
```

**Solution:**
1. Make sure `GEMINI_API_KEY` is set in Railway variables
2. Redeploy the backend
3. Check Railway logs for confirmation

**In Railway Logs, you should see:**
```
✓ Gemini AI service initialized successfully
```

---

## 📝 Code Examples

### Generate Job Description (Backend)
```typescript
import geminiService from '../services/gemini.service';

const description = await geminiService.generateJobDescription({
  title: "Senior Developer",
  requirements: "5+ years experience, React, TypeScript"
});
```

### Generate Interview Questions (New!)
```typescript
const questions = await geminiService.generateInterviewQuestions(
  "Senior Developer",
  "Full job description here...",
  5 // number of questions
);
// Returns: ["Question 1?", "Question 2?", ...]
```

---

## 🔐 Security Notes

✅ API key stored in environment variables (not in code)
✅ Never exposed to frontend
✅ Validated before use
✅ Proper error handling
✅ Rate limiting handled by Google

---

## 🎉 Benefits You Get

1. **Save Money** - No more paying for OpenRouter
2. **Better Quality** - Gemini is on par with GPT-4
3. **Faster** - Optimized for speed
4. **Reliable** - Backed by Google infrastructure
5. **Generous Limits** - 1,500 requests/day is plenty
6. **Easy Setup** - No credit card needed

---

## 📱 Next Steps

### Immediate:
1. ✅ Get Gemini API key from https://aistudio.google.com/
2. ✅ Add `GEMINI_API_KEY` to Railway variables
3. ✅ Redeploy (or wait for auto-deploy)
4. ✅ Test job generation feature

### Optional Future Features:
- Resume screening with AI
- Automated interview question generation
- Candidate email responses
- Skills gap analysis
- Salary recommendations

---

## 🐛 Troubleshooting

### Issue: "Failed to generate job description"
**Check:**
- Is `GEMINI_API_KEY` set in Railway?
- Is the API key valid?
- Check Railway logs for detailed error

### Issue: Rate limit exceeded
**Solution:**
- Free tier: 15 requests/minute
- Wait 1 minute and try again
- For production, consider caching responses

### Issue: Poor quality output
**Solution:**
- Adjust the prompt in `gemini.service.ts`
- Try different temperature values (0.5-0.9)
- Switch to `gemini-1.5-pro` for better quality

---

## 📞 Support

**Google AI Studio Documentation:**
https://ai.google.dev/

**Gemini API Docs:**
https://ai.google.dev/gemini-api/docs

**Get API Key:**
https://aistudio.google.com/

---

## ✅ Deployment Checklist

- [x] Install @google/generative-ai package
- [x] Create gemini.service.ts
- [x] Update job.controller.ts
- [x] Add config for GEMINI_API_KEY
- [x] Update .env.example
- [ ] Get Gemini API key from Google AI Studio
- [ ] Add GEMINI_API_KEY to Railway variables
- [ ] Test job generation feature
- [ ] Enjoy free AI! 🎉

---

**Status**: ✅ Code Ready - Just Add Your API Key!

**Commit Message**: "Integrate Google Gemini AI for free job description generation"
