# Interview Scheduling Feature

## Overview
This feature allows HR users to schedule interviews with candidates using two methods:
1. **AI Interview**: Automated AI-powered interview with scheduled date/time
2. **Manual Interview**: Share Calendly link for candidate self-scheduling

Both methods automatically send email notifications to candidates with interview details.

## Frontend Implementation

### 1. Candidate Service (`frontend/src/services/candidate.service.ts`)
Added two new API methods:
```typescript
// Schedule AI interview with date/time
async scheduleAIInterview(candidateId: string, interviewDate: string, interviewTime: string)

// Schedule manual interview with Calendly link
async scheduleManualInterview(candidateId: string, calendlyLink: string)
```

### 2. Candidates Page (`frontend/src/app/dashboard/candidates/page.tsx`)

#### New State Management
```typescript
const [interviewModal, setInterviewModal] = useState({isOpen: false, candidate: null});
const [interviewType, setInterviewType] = useState<'ai' | 'manual' | null>(null);
const [interviewForm, setInterviewForm] = useState({date: '', time: '', calendlyLink: ''});
const [interviewLoading, setInterviewLoading] = useState(false);
```

#### Schedule Interview Button
Added "Schedule Interview" button for each candidate (shows only when status is 'Applied' and no interview is scheduled):
```tsx
<button onClick={() => handleScheduleInterviewClick(candidate)}>
  Schedule Interview
</button>
```

#### Interview Scheduling Modal
- **Interview Type Selection**: Choose between AI Interview or Manual Interview with visual cards
- **AI Interview Form**: Date and time inputs with minimum date validation
- **Manual Interview Form**: Calendly link input with URL validation
- **Email Notification Info**: Clear indication that candidate will receive email
- **Validation**: Required field validation before submission
- **Loading States**: Disabled inputs and buttons during API calls

## Backend Implementation

### 1. Controller (`backend/src/controllers/candidate.controller.ts`)

#### `scheduleAIInterview` Endpoint
```typescript
POST /api/candidates/:id/schedule-ai-interview
Body: { interviewDate: string, interviewTime: string }
```

Features:
- Validates date and time are provided
- Verifies user owns the job
- Generates AI interview link: `${FRONTEND_URL}/ai-interview/${candidateId}`
- Formats date/time for email display
- Updates candidate status to "Interview Scheduled"
- Stores interview type, date, time, and link
- Sends email notification via n8n (non-blocking)
- Returns interview link and formatted schedule time

#### `scheduleManualInterview` Endpoint
```typescript
POST /api/candidates/:id/schedule-manual-interview
Body: { calendlyLink: string }
```

Features:
- Validates Calendly link format (https://calendly.com/...)
- Verifies user owns the job
- Updates candidate status to "Interview Scheduled"
- Stores interview type and Calendly link
- Sends email notification via n8n (non-blocking)
- Returns success confirmation

### 2. Routes (`backend/src/routes/candidate.routes.ts`)

Added routes with validation:
```typescript
// AI interview scheduling
router.post(
  '/:id/schedule-ai-interview',
  authenticateUser,
  scheduleAIInterviewValidation,
  handleValidationErrors,
  scheduleAIInterview
);

// Manual interview scheduling
router.post(
  '/:id/schedule-manual-interview',
  authenticateUser,
  scheduleManualInterviewValidation,
  handleValidationErrors,
  scheduleManualInterview
);
```

### Validation Rules
- **AI Interview**: Date and time must not be empty
- **Manual Interview**: Calendly link must match regex pattern `^https:\/\/(calendly\.com|www\.calendly\.com)\/.+`

## Email Notifications

Both scheduling methods trigger n8n workflow for email delivery (non-blocking):
- **AI Interview Email**: Includes scheduled date/time and interview link
- **Manual Interview Email**: Includes Calendly link for self-scheduling

Email details:
- Professional formatting with candidate's name
- Clear interview instructions
- Helpful tips for candidates
- Branded closing signature

## User Flow

### AI Interview Flow
1. HR clicks "Schedule Interview" button
2. Modal opens with interview type selection
3. HR selects "AI Interview" option
4. Date and time input fields appear
5. HR enters interview date/time
6. HR clicks "Schedule Interview"
7. API creates AI interview link
8. Candidate status updates to "Interview Scheduled"
9. Email sent to candidate with date/time and interview link
10. Success toast shown
11. Candidates list refreshes

### Manual Interview Flow
1. HR clicks "Schedule Interview" button
2. Modal opens with interview type selection
3. HR selects "Manual Interview" option
4. Calendly link input field appears
5. HR pastes their Calendly link
6. HR clicks "Schedule Interview"
7. Calendly link validated and stored
8. Candidate status updates to "Interview Scheduled"
9. Email sent to candidate with Calendly link
10. Success toast shown
11. Candidates list refreshes

## Security

- All endpoints require authentication (`authenticateUser` middleware)
- User ownership verified by checking job's `createdBy` field
- Input validation via express-validator
- URL format validation for Calendly links
- Firebase security rules enforce data isolation

## Error Handling

- Comprehensive error logging
- User-friendly error messages
- Non-blocking email sending (failures don't block scheduling)
- Loading states prevent duplicate submissions
- Validation errors shown before API calls

## Database Schema Updates

Candidate document now includes:
```typescript
{
  status: 'Interview Scheduled',
  interviewLink: string,        // AI link or Calendly link
  interviewType: 'ai' | 'manual',
  interviewDate?: string,        // Only for AI interviews
  interviewTime?: string,        // Only for AI interviews
  updatedAt: string
}
```

## Future Enhancements

1. **AI Interview Page**: Create `/ai-interview/:id` page for conducting interviews
2. **Calendar Integration**: Sync AI interviews with Google Calendar
3. **Reminder Emails**: Send automated reminders before interview time
4. **Rescheduling**: Allow HR to reschedule existing interviews
5. **Candidate Confirmation**: Let candidates confirm/decline interview times
6. **Interview Reports**: Generate reports after AI interviews complete
7. **Video Integration**: Add video call links for manual interviews
8. **Timezone Support**: Handle multiple timezones for global hiring

## Testing Checklist

- [ ] AI interview scheduling with valid date/time
- [ ] Manual interview scheduling with valid Calendly link
- [ ] Invalid Calendly link rejection
- [ ] Unauthorized access prevention
- [ ] Email delivery confirmation
- [ ] Status update verification
- [ ] Modal opening/closing
- [ ] Loading states during API calls
- [ ] Success toast notifications
- [ ] Candidates list refresh after scheduling
- [ ] Button visibility based on status
- [ ] Date validation (no past dates)
- [ ] Interview type selection
- [ ] Form field validation

## Dependencies

**Frontend:**
- React (state management)
- Axios (API calls)
- react-hot-toast (notifications)

**Backend:**
- Express (routing)
- express-validator (input validation)
- Firebase Admin (database)
- n8n (email workflow)

## API Response Examples

### Success Response (AI Interview)
```json
{
  "success": true,
  "message": "AI interview scheduled successfully",
  "data": {
    "interviewLink": "http://localhost:3000/ai-interview/abc123",
    "scheduledTime": "Friday, December 1, 2023, 02:00 PM EST"
  }
}
```

### Success Response (Manual Interview)
```json
{
  "success": true,
  "message": "Interview scheduling link sent successfully",
  "data": {
    "calendlyLink": "https://calendly.com/username/30min"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Candidate not found"
}
```
