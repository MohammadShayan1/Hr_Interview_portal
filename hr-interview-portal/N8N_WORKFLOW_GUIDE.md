# n8n Workflow Configuration Guide

## Overview

This guide explains how to set up the n8n automation workflow that powers the interview automation process.

## Workflow Architecture

\`\`\`
Candidate Application → n8n Workflow → Multiple Actions
   ↓
1. Receive Application Data
   ↓
2. Create Interview Link (BeyondPresence)
   ↓
3. Update Firestore
   ↓
4. Send Email to Candidate
   ↓
5. (After Interview) Get Transcript
   ↓
6. Send to AI for Evaluation
   ↓
7. Post Report Back to Application
\`\`\`

## Setting Up n8n

### Option 1: n8n Cloud (Recommended for Beginners)
1. Go to [https://n8n.io](https://n8n.io)
2. Sign up for a cloud account
3. Create a new workflow

### Option 2: Self-Hosted n8n
\`\`\`bash
# Using npm
npm install n8n -g
n8n start

# Using Docker
docker run -it --rm \\
  --name n8n \\
  -p 5678:5678 \\
  -v ~/.n8n:/home/node/.n8n \\
  n8nio/n8n
\`\`\`

Access n8n at: http://localhost:5678

## Workflow 1: Candidate Application Handler

### Node 1: Webhook Trigger

1. Add a **Webhook** node
2. Configure:
   - **Path**: `/webhook/candidate-application`
   - **Method**: POST
   - **Response Mode**: Last Node
3. Copy the **Webhook URL**
4. Add it to backend `.env` as `N8N_WEBHOOK_URL`

**Expected Data**:
\`\`\`json
{
  "candidateId": "abc123",
  "candidateName": "John Doe",
  "candidateEmail": "john@example.com",
  "candidatePhone": "+1234567890",
  "jobId": "job456",
  "jobTitle": "Software Engineer",
  "resumeUrl": "https://storage.googleapis.com/...",
  "secret": "your-webhook-secret"
}
\`\`\`

### Node 2: Verify Secret (Optional but Recommended)

1. Add an **IF** node
2. Configure:
   - **Value 1**: \`{{ $json.secret }}\`
   - **Operation**: Equal
   - **Value 2**: `your-webhook-secret`
3. Connect "true" path to continue, "false" path to Stop/Error

### Node 3: Create Interview Link (HTTP Request)

1. Add **HTTP Request** node
2. Configure:
   - **Method**: POST
   - **URL**: `https://api.beyondpresence.com/v1/meetings` (adjust based on your platform)
   - **Authentication**: Bearer Token
   - **Token**: `{{ $env.BEYONDPRESENCE_API_KEY }}`
   
**Headers**:
\`\`\`json
{
  "Content-Type": "application/json"
}
\`\`\`

**Body**:
\`\`\`json
{
  "title": "Interview for {{ $json.jobTitle }}",
  "participantName": "{{ $json.candidateName }}",
  "participantEmail": "{{ $json.candidateEmail }}",
  "duration": 60,
  "recordingEnabled": true,
  "transcriptionEnabled": true
}
\`\`\`

**Alternative (Mock for Testing)**:
If you don't have BeyondPresence yet, use a **Function** node:
\`\`\`javascript
return [{
  json: {
    meetingId: `mock-${Date.now()}`,
    meetingLink: `https://meet.example.com/interview/${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
}];
\`\`\`

### Node 4: Update Firestore

**Option A: Using HTTP Request to Your Backend**

1. Add **HTTP Request** node
2. Configure:
   - **Method**: POST
   - **URL**: `{{ $env.BACKEND_URL }}/api/webhooks/update-interview`
   
**Headers**:
\`\`\`json
{
  "Content-Type": "application/json",
  "x-webhook-secret": "{{ $env.WEBHOOK_SECRET }}"
}
\`\`\`

**Body**:
\`\`\`json
{
  "candidateId": "{{ $node['Webhook'].json.candidateId }}",
  "interviewLink": "{{ $node['Create Interview Link'].json.meetingLink }}",
  "status": "Interview Scheduled"
}
\`\`\`

**Option B: Using Firebase Node** (if available)

1. Add **Firebase Firestore** node
2. Configure:
   - **Operation**: Update
   - **Collection**: candidates
   - **Document ID**: \`{{ $node['Webhook'].json.candidateId }}\`
   - **Update Fields**:
     \`\`\`json
     {
       "interviewLink": "{{ $node['Create Interview Link'].json.meetingLink }}",
       "status": "Interview Scheduled"
     }
     \`\`\`

### Node 5: Send Email to Candidate

1. Add **Send Email** node (or **HTTP Request** to SendGrid)
2. Configure:

**Using SMTP (Nodemailer style)**:
- **To Email**: \`{{ $node['Webhook'].json.candidateEmail }}\`
- **Subject**: `Interview Invitation - {{ $node['Webhook'].json.jobTitle }}`
- **Text**:
  \`\`\`
  Dear {{ $node['Webhook'].json.candidateName }},

  Thank you for your application for the {{ $node['Webhook'].json.jobTitle }} position.

  We are pleased to invite you to participate in a virtual interview. Please use the link below to join your interview session:

  {{ $node['Create Interview Link'].json.meetingLink }}

  Important Instructions:
  - Please ensure you have a stable internet connection
  - Test your camera and microphone before the interview
  - Find a quiet, well-lit space for the interview
  - This link will remain valid for 7 days

  We look forward to speaking with you!

  Best regards,
  The Hiring Team
  \`\`\`

**Using SendGrid API**:
1. Add **HTTP Request** node
2. Configure:
   - **Method**: POST
   - **URL**: `https://api.sendgrid.com/v3/mail/send`
   - **Headers**:
     \`\`\`json
     {
       "Authorization": "Bearer {{ $env.SENDGRID_API_KEY }}",
       "Content-Type": "application/json"
     }
     \`\`\`
   - **Body**:
     \`\`\`json
     {
       "personalizations": [{
         "to": [{"email": "{{ $node['Webhook'].json.candidateEmail }}"}],
         "dynamic_template_data": {
           "candidateName": "{{ $node['Webhook'].json.candidateName }}",
           "jobTitle": "{{ $node['Webhook'].json.jobTitle }}",
           "interviewLink": "{{ $node['Create Interview Link'].json.meetingLink }}"
         }
       }],
       "from": {"email": "noreply@yourdomain.com", "name": "HR Team"},
       "template_id": "your-sendgrid-template-id"
     }
     \`\`\`

### Node 6: Response (Optional)

1. Add **Respond to Webhook** node
2. Configure:
   - **Response Body**:
     \`\`\`json
     {
       "success": true,
       "message": "Interview scheduled successfully"
     }
     \`\`\`

## Workflow 2: Post-Interview Evaluation

### Trigger Options

**Option A: Manual Trigger**
- Add **Manual Trigger** node
- You'll manually start this workflow after interviews

**Option B: BeyondPresence Webhook**
- Add **Webhook** node
- Configure BeyondPresence to call it when interview ends

**Option C: Schedule**
- Add **Cron** node
- Check for completed interviews periodically

### Node 1: Get Completed Interviews

Add **HTTP Request** or **Firestore** node to get interviews with status "Interview Completed"

### Node 2: Get Transcript

1. Add **HTTP Request** node
2. Configure:
   - **Method**: GET
   - **URL**: `https://api.beyondpresence.com/v1/meetings/{{ $json.meetingId }}/transcript`
   - **Headers**:
     \`\`\`json
     {
       "Authorization": "Bearer {{ $env.BEYONDPRESENCE_API_KEY }}"
     }
     \`\`\`

### Node 3: Evaluate with AI (OpenRouter.ai)

1. Add **HTTP Request** node
2. Configure:
   - **Method**: POST
   - **URL**: `https://openrouter.ai/api/v1/chat/completions`
   - **Headers**:
     \`\`\`json
     {
       "Authorization": "Bearer {{ $env.OPENROUTER_API_KEY }}",
       "Content-Type": "application/json"
     }
     \`\`\`
   - **Body**:
     \`\`\`json
     {
       "model": "openai/gpt-3.5-turbo",
       "messages": [
         {
           "role": "system",
           "content": "You are an expert HR interviewer. Analyze the interview transcript and provide a JSON response with: score (0-100), strengths (array), weaknesses (array), recommendation (HIRE/MAYBE/REJECT), and summary."
         },
         {
           "role": "user",
           "content": "Job: {{ $json.jobTitle }}\\nCandidate: {{ $json.candidateName }}\\n\\nTranscript:\\n{{ $node['Get Transcript'].json.transcript }}"
         }
       ],
       "temperature": 0.5
     }
     \`\`\`

### Node 4: Parse AI Response

Add **Function** node:
\`\`\`javascript
const aiResponse = $input.item.json.choices[0].message.content;
const evaluation = JSON.parse(aiResponse);

return {
  json: {
    candidateId: $node['Get Completed Interviews'].json.id,
    evaluation: evaluation
  }
};
\`\`\`

### Node 5: Update Application with Report

1. Add **HTTP Request** node
2. Configure:
   - **Method**: POST
   - **URL**: `{{ $env.BACKEND_URL }}/api/webhooks/update-interview`
   - **Headers**:
     \`\`\`json
     {
       "Content-Type": "application/json",
       "x-webhook-secret": "{{ $env.WEBHOOK_SECRET }}"
     }
     \`\`\`
   - **Body**:
     \`\`\`json
     {
       "candidateId": "{{ $json.candidateId }}",
       "status": "Report Ready",
       "interviewReport": {{ $json.evaluation }}
     }
     \`\`\`

## Environment Variables in n8n

Set these in n8n Settings > Environments:

\`\`\`env
BEYONDPRESENCE_API_KEY=your-api-key
BACKEND_URL=https://api.yourdomain.com
WEBHOOK_SECRET=your-webhook-secret
OPENROUTER_API_KEY=your-openrouter-key
SENDGRID_API_KEY=your-sendgrid-key (if using SendGrid)
\`\`\`

## Testing the Workflow

### Test Workflow 1:
\`\`\`bash
curl -X POST https://your-n8n.com/webhook/candidate-application \\
  -H "Content-Type: application/json" \\
  -d '{
    "candidateId": "test123",
    "candidateName": "Test User",
    "candidateEmail": "test@example.com",
    "candidatePhone": "+1234567890",
    "jobId": "job123",
    "jobTitle": "Software Engineer",
    "resumeUrl": "https://example.com/resume.pdf",
    "secret": "your-webhook-secret"
  }'
\`\`\`

### Test Workflow 2:
1. Manually trigger the workflow
2. Check n8n execution history
3. Verify the report appears in your application

## Troubleshooting

### Issue: Webhook not triggering
- Check the URL in backend `.env`
- Verify webhook is activated in n8n
- Check firewall/security settings

### Issue: Email not sending
- Verify SMTP credentials
- Check spam folder
- Test email service separately

### Issue: AI evaluation fails
- Check OpenRouter.ai API key
- Verify transcript format
- Check API rate limits

## Export/Import Workflow

To share or backup your workflow:

1. In n8n, click the **⋮** menu
2. Select **Export Workflow**
3. Save the JSON file
4. To import: Click **Import from File**

## Advanced: Error Handling

Add error handling between nodes:

1. Add **Error Trigger** node
2. Connect it to send error notifications:
   - Email to admin
   - Slack message
   - Log to external service

## Monitoring

Set up workflow monitoring:

1. **Webhook** node → Set timeout (30s)
2. **Error Handling** → Add Error Trigger nodes
3. **Logging** → Use **Function** nodes to log important data
4. **Notifications** → Alert on failures

## Best Practices

1. ✅ **Test in Staging**: Always test workflows before production
2. ✅ **Error Handling**: Add error triggers for critical flows
3. ✅ **Logging**: Log important steps for debugging
4. ✅ **Secrets**: Use environment variables, never hardcode
5. ✅ **Timeouts**: Set appropriate timeouts for external APIs
6. ✅ **Retries**: Enable retry on failure for HTTP requests
7. ✅ **Monitoring**: Set up alerts for workflow failures

---

**Your n8n workflow is now ready to automate your interview process! 🎉**

For more advanced n8n features, check the [official documentation](https://docs.n8n.io/).
