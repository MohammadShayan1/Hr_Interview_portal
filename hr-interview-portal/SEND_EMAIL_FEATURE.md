# Send Email Feature Implementation

## Overview
Added a "Send Email" button to the candidates profile/dashboard that allows HR users to send emails directly to candidates.

## Changes Made

### Backend Changes

#### 1. Backend Controller (`backend/src/controllers/candidate.controller.ts`)
- **Import Added**: Added `emailService` import for sending emails
- **New Function**: `sendEmailToCandidate` endpoint handler
  - Validates user is authenticated and owns the job
  - Accepts subject and message from request body
  - Creates professional HTML email template
  - Sends email via EmailService (Nodemailer)
  - Returns success response

#### 2. Backend Routes (`backend/src/routes/candidate.routes.ts`)
- **New Route**: `POST /api/candidates/:candidateId/send-email`
- **Authentication**: Required (protected route)
- **Validation**: Subject and message required
- **Permissions**: User must own the job the candidate applied to

### Frontend Changes

#### 1. Frontend Service (`frontend/src/services/candidate.service.ts`)
- **New Method**: `sendEmailToCandidate(candidateId, subject, message)`
  - Makes POST request to backend email endpoint
  - Returns response with success status

#### 2. Frontend Component (`frontend/src/app/dashboard/candidates/page.tsx`)
- **New State**:
  - `emailModal`: Controls modal visibility and selected candidate
  - `emailForm`: Stores subject and message form input
  - `emailLoading`: Tracks email submission state

- **New Handler**: `handleSendEmail()`
  - Validates form input
  - Calls service to send email
  - Shows success/error toast
  - Clears form and closes modal

- **New UI Elements**:
  - "Send Email" button (green) in candidate actions section
  - Email modal with:
    - Subject input field
    - Message textarea (8 rows)
    - Send and Cancel buttons
    - Loading state during submission

## UI/UX Features

### Send Email Button
- **Location**: Candidates dashboard, in actions section per candidate
- **Style**: Green button with Mail icon
- **Placement**: Between "View Resume" and "Interview Link" buttons

### Email Modal
- **Layout**: Centered modal dialog
- **Fields**:
  - Subject input (required, single line)
  - Message textarea (required, multiline)
- **Actions**:
  - Send Email button (green) - submits the form
  - Cancel button (gray) - closes modal without sending
- **States**:
  - Normal: Ready to input
  - Loading: Disabled inputs, "Sending..." text
  - Success: Toast notification, modal auto-closes

## Email Template
Professional HTML email with:
- Header with branding color (#4F46E5)
- Recipient name personalization
- Message content
- Professional footer
- Plain text alternative

## Security & Validation
1. **Authentication**: Route requires Firebase auth token
2. **Authorization**: User must own the job the candidate applied to
3. **Input Validation**:
   - Subject required (non-empty string)
   - Message required (non-empty string)
   - Candidate must exist
4. **Error Handling**:
   - Proper error messages on failure
   - Logging of all email sends
   - Circular reference safe

## API Endpoint

```
POST /api/candidates/:candidateId/send-email
Content-Type: application/json
Authorization: Bearer <token>

Request Body:
{
  "subject": "Interview Invitation",
  "message": "Dear Candidate,\n\nWe would like to invite you for an interview..."
}

Response (200 OK):
{
  "success": true,
  "message": "Email sent successfully"
}
```

## Testing Guide

### Manual Testing Steps
1. Navigate to Dashboard → Candidates
2. Click "Send Email" button on any candidate
3. Fill in subject (e.g., "Interview Invitation")
4. Fill in message (e.g., "We are pleased to invite you...")
5. Click "Send Email"
6. Verify success toast appears
7. Check candidate's email inbox for the message

### Prerequisites
- Email service configured in `backend/.env`:
  - `EMAIL_HOST`
  - `EMAIL_PORT`
  - `EMAIL_USER`
  - `EMAIL_PASSWORD`
  - `EMAIL_FROM`

## Error Scenarios

| Scenario | Response | Toast Message |
|----------|----------|---------------|
| Empty subject | Validation error | "Please fill in both subject and message" |
| Empty message | Validation error | "Please fill in both subject and message" |
| Candidate not found | 404 | "Failed to send email" |
| User not authenticated | 401 | "Failed to send email" |
| User doesn't own job | 403 | "Failed to send email" |
| Email service error | 500 | "Failed to send email" |

## Status
✅ Implementation Complete
✅ No TypeScript errors
✅ Frontend and Backend integrated
✅ Email service ready (if SMTP configured)

## Related Files
- Backend Controller: `backend/src/controllers/candidate.controller.ts`
- Backend Routes: `backend/src/routes/candidate.routes.ts`
- Backend Service: `backend/src/services/email.service.ts` (existing)
- Frontend Service: `frontend/src/services/candidate.service.ts`
- Frontend Component: `frontend/src/app/dashboard/candidates/page.tsx`
- Environment: `backend/.env` (SMTP settings)

## Next Steps (Optional)
1. Test email sending with real SMTP server
2. Add email templates for different types of emails (invitation, rejection, etc.)
3. Add email history/audit log
4. Add bulk email functionality
5. Add email scheduling feature
