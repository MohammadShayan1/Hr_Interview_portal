# 🔍 OpenRouter AI Debug Guide

## Current Status

The AI job description generation is failing with:
```
Invalid response from AI service
```

I've added extensive logging to help diagnose the issue.

## Steps to Debug

### Step 1: Rebuild Backend

Open a new PowerShell terminal in the backend directory and run:

```powershell
cd d:\work\hr-interview-portal\backend
npm run build
```

The backend should auto-restart via nodemon.

### Step 2: Try AI Generation Again

1. Go to http://localhost:3000/dashboard/jobs
2. Click "Generate with AI"
3. Enter:
   - Job Title: "Software Engineer"
   - Requirements: "5 years experience, React, Node.js"
4. Click "Generate with AI"

### Step 3: Check Backend Logs

Look at the backend terminal for detailed logs. You should now see:

**Before API Call:**
```
Calling OpenRouter API for job description generation
{
  apiKeyConfigured: true/false,
  apiKeyLength: XX,
  apiUrl: "https://openrouter.ai/api/v1",
  titleLength: XX,
  requirementsLength: XX
}
```

**After API Call (Success):**
```
OpenRouter API response received
{
  status: 200,
  hasData: true,
  hasChoices: true,
  choicesLength: 1,
  fullResponse: { ... full API response ... }
}
```

**After API Call (Error):**
```
OpenRouter API error response:
{
  status: 401/403/500,
  statusText: "...",
  data: { ... error details ... }
}
```

## Common Issues & Solutions

### Issue 1: API Key Not Configured
**Log shows:** `apiKeyConfigured: false` or `apiKeyLength: 0`

**Solution:**
```powershell
# Edit backend/.env
OPENROUTER_API_KEY=sk-or-v1-YOUR-ACTUAL-API-KEY-HERE
```

Get your key from: https://openrouter.ai/keys

### Issue 2: Invalid API Key
**Log shows:** `status: 401` or `statusText: "Unauthorized"`

**Solution:**
- Verify the API key is correct
- Check if the key is still active at https://openrouter.ai/keys
- Make sure there are no extra spaces in the .env file

### Issue 3: No Credits
**Log shows:** `status: 402` or error about credits/payment

**Solution:**
- Add credits to your OpenRouter account
- Check balance at: https://openrouter.ai/credits
- Some models are free, try those first

### Issue 4: Model Not Available
**Log shows:** Error about model not found

**Solution:**
Try a different free model. Edit `openrouter.service.ts`:

```typescript
// Instead of:
model: 'openai/gpt-3.5-turbo',

// Try one of these free models:
model: 'meta-llama/llama-3-8b-instruct:free',
// or
model: 'google/gemma-7b-it:free',
// or
model: 'mistralai/mistral-7b-instruct:free',
```

### Issue 5: Rate Limiting
**Log shows:** `status: 429` or "Too many requests"

**Solution:**
- Wait a few minutes
- Check your rate limits at OpenRouter dashboard
- Upgrade your plan if needed

## Alternative: Use Mock AI Response

If you can't get OpenRouter working, you can temporarily use a mock response:

Edit `backend/src/services/openrouter.service.ts`:

```typescript
async generateJobDescription(data: JobDescriptionRequest): Promise<string> {
  // TEMPORARY: Return mock response
  logger.warn('Using mock AI response (OpenRouter disabled)');
  return `# ${data.title}

## About the Role
Join our dynamic team as a ${data.title}!

## Key Responsibilities
- Lead development initiatives
- Collaborate with cross-functional teams
- Mentor junior developers
- Drive technical excellence

## Required Qualifications
${data.requirements.split('\n').map(r => `- ${r}`).join('\n')}

## Benefits
- Competitive salary
- Health insurance
- Remote work options
- Professional development budget
- Flexible hours`;
  
  // Comment out the actual API call
  /*
  try {
    const prompt = ...
    const response = await axios.post(...)
    ...
  */
}
```

This will let you test the rest of the application while you fix the OpenRouter setup.

## Next Steps

1. **Rebuild backend** with the new logging
2. **Try AI generation** again
3. **Copy the full log output** from the backend terminal
4. **Look for the specific error** in the detailed logs
5. **Apply the appropriate solution** from above

## Still Stuck?

If the logs show something unexpected, check:
1. OpenRouter status page: https://status.openrouter.ai/
2. OpenRouter documentation: https://openrouter.ai/docs
3. Your API usage: https://openrouter.ai/activity

---

**Updated**: October 15, 2025  
**Enhanced logging added**: Lines showing full API request/response details
