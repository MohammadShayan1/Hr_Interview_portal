# Testing Interview Scheduling Feature

## Setup
1. Ensure backend is running on `http://localhost:5000`
2. Ensure frontend is running on `http://localhost:3000`
3. Login as an HR user
4. Have at least one candidate with status "Applied"

## Test Case 1: Schedule AI Interview

### Steps:
1. Navigate to `/dashboard/candidates`
2. Find a candidate with status "Applied"
3. Click the "Schedule Interview" button
4. Modal should open with two cards: 🤖 AI Interview and 📅 Manual Interview
5. Click on "AI Interview" card (should highlight with blue border)
6. Date and time input fields should appear
7. Enter a future date in the date picker
8. Enter a time (e.g., 14:00)
9. Click "Schedule Interview" button
10. Loading state should show "Scheduling..."
11. Success toast should appear
12. Modal should close
13. Candidates list should refresh
14. Candidate status should update to "Interview Scheduled"

### Expected Result:
- **Frontend Response:**
  ```json
  {
    "success": true,
    "message": "AI interview scheduled successfully",
    "data": {
      "interviewLink": "http://localhost:3000/ai-interview/[candidateId]",
      "scheduledTime": "[Formatted date/time]"
    }
  }
  ```

- **Backend Log:**
  ```
  [info]: Scheduling AI interview { candidateId, userId, interviewDate, interviewTime }
  [info]: Interview scheduling email sent successfully
  [info]: AI interview scheduled successfully { candidateId }
  ```

- **Database Update:**
  Candidate document should have:
  ```
  status: "Interview Scheduled"
  interviewLink: "http://localhost:3000/ai-interview/[id]"
  interviewType: "ai"
  interviewDate: "2023-12-01"
  interviewTime: "14:00"
  updatedAt: [current timestamp]
  ```

---

## Test Case 2: Schedule Manual Interview (Calendly)

### Steps:
1. Navigate to `/dashboard/candidates`
2. Find a candidate with status "Applied"
3. Click the "Schedule Interview" button
4. Modal should open
5. Click on "Manual Interview" card (should highlight with green border)
6. Calendly link input field should appear
7. Enter a valid Calendly link: `https://calendly.com/testuser/30min`
8. Click "Schedule Interview" button
9. Loading state should show "Scheduling..."
10. Success toast should appear
11. Modal should close
12. Candidates list should refresh
13. Candidate status should update to "Interview Scheduled"

### Expected Result:
- **Frontend Response:**
  ```json
  {
    "success": true,
    "message": "Interview scheduling link sent successfully",
    "data": {
      "calendlyLink": "https://calendly.com/testuser/30min"
    }
  }
  ```

- **Backend Log:**
  ```
  [info]: Scheduling manual interview { candidateId, userId, calendlyLink }
  [info]: Interview scheduling email sent successfully
  [info]: Manual interview scheduled successfully { candidateId }
  ```

- **Database Update:**
  Candidate document should have:
  ```
  status: "Interview Scheduled"
  interviewLink: "https://calendly.com/testuser/30min"
  interviewType: "manual"
  updatedAt: [current timestamp]
  ```

---

## Test Case 3: Validation Errors

### Test 3a: AI Interview - Missing Date
1. Open interview modal
2. Select AI Interview
3. Leave date empty, enter time
4. Click "Schedule Interview"
5. **Expected:** Alert showing "Please select both date and time"

### Test 3b: AI Interview - Missing Time
1. Open interview modal
2. Select AI Interview
3. Enter date, leave time empty
4. Click "Schedule Interview"
5. **Expected:** Alert showing "Please select both date and time"

### Test 3c: Manual Interview - Empty Calendly Link
1. Open interview modal
2. Select Manual Interview
3. Leave Calendly link empty
4. Click "Schedule Interview"
5. **Expected:** Alert showing "Please enter a Calendly link"

### Test 3d: Manual Interview - Invalid Calendly Link
1. Open interview modal
2. Select Manual Interview
3. Enter invalid link: `https://google.com`
4. Click "Schedule Interview"
5. **Expected:** Backend returns 400 error: "Invalid Calendly link format"

### Test 3e: No Interview Type Selected
1. Open interview modal
2. Don't select any interview type
3. Try to click "Schedule Interview"
4. **Expected:** Button should be disabled (gray background)

---

## Test Case 4: Security Tests

### Test 4a: Unauthorized Access
1. Try to schedule interview for a candidate belonging to another user
2. **API Call:**
   ```
   POST /api/candidates/[othersUserId]/schedule-ai-interview
   Authorization: Bearer [yourToken]
   ```
3. **Expected:** 403 error: "Unauthorized access to candidate"

### Test 4b: Unauthenticated Request
1. Try to call API without authentication token
2. **Expected:** 401 error: "Unauthorized"

---

## Test Case 5: UI State Management

### Test 5a: Modal Cancel
1. Open interview modal
2. Select interview type
3. Fill in form fields
4. Click "Cancel" button
5. **Expected:**
   - Modal closes
   - Form resets
   - No API call made
   - Candidates list unchanged

### Test 5b: Modal Close (X button)
1. Open interview modal
2. Click X button in top-right corner
3. **Expected:**
   - Modal closes
   - Form resets
   - No API call made

### Test 5c: Loading State
1. Open interview modal
2. Fill in form
3. Click "Schedule Interview"
4. During API call:
   - **Expected:**
     - Schedule button shows "Scheduling..."
     - Both buttons disabled
     - Form inputs disabled
     - Interview type cards disabled

### Test 5d: Button Visibility
1. View candidates list
2. **Expected:**
   - "Schedule Interview" button shows for candidates with:
     - status = "Applied"
     - no interviewLink set
   - Button hidden for candidates with:
     - status ≠ "Applied"
     - interviewLink already set

---

## Test Case 6: Email Notification (Manual Testing)

### Setup Email Testing:
1. Ensure n8n workflow is configured
2. Use a real email address for candidate

### Test 6a: AI Interview Email
1. Schedule AI interview
2. Check candidate's email inbox
3. **Expected Email Content:**
   - Subject: "Interview Scheduled - [Job Title]"
   - Contains: Candidate name
   - Contains: Interview date/time
   - Contains: AI interview link
   - Contains: Success tips
   - Professional formatting

### Test 6b: Manual Interview Email
1. Schedule manual interview
2. Check candidate's email inbox
3. **Expected Email Content:**
   - Subject: "Interview Scheduling Link - [Job Title]"
   - Contains: Candidate name
   - Contains: Calendly link
   - Contains: Instructions
   - Professional formatting

---

## Test Case 7: Edge Cases

### Test 7a: Past Date Selection
1. Open AI interview modal
2. Try to select a past date
3. **Expected:** Date picker should not allow past dates (min attribute set)

### Test 7b: Rapid Clicking
1. Open interview modal
2. Fill form
3. Click "Schedule Interview" multiple times quickly
4. **Expected:** Button disabled after first click, prevents duplicate submissions

### Test 7c: Network Error
1. Stop backend server
2. Try to schedule interview
3. **Expected:** Error toast shown with network error message

### Test 7d: Invalid Candidate ID
1. Try to schedule interview for non-existent candidate
2. **Expected:** 404 error: "Candidate not found"

---

## Test Case 8: Integration Testing

### Complete Flow Test:
1. Create a new job posting
2. Submit candidate application (use `/apply/:jobId` public endpoint)
3. Verify candidate appears in dashboard with "Applied" status
4. Schedule AI interview for the candidate
5. Verify status changes to "Interview Scheduled"
6. Verify interviewLink is set
7. Verify email sent
8. Navigate to interview link (will show 404 until AI interview page is built)
9. **Expected:** All steps complete without errors

---

## Automated API Testing (Postman/Thunder Client)

### Test: Schedule AI Interview
```http
POST http://localhost:5000/api/candidates/[candidateId]/schedule-ai-interview
Authorization: Bearer [your-jwt-token]
Content-Type: application/json

{
  "interviewDate": "2024-12-15",
  "interviewTime": "14:00"
}
```

### Test: Schedule Manual Interview
```http
POST http://localhost:5000/api/candidates/[candidateId]/schedule-manual-interview
Authorization: Bearer [your-jwt-token]
Content-Type: application/json

{
  "calendlyLink": "https://calendly.com/testuser/30min"
}
```

---

## Performance Testing

### Test: Response Time
1. Schedule 10 interviews in quick succession
2. **Expected:** Each request completes within 2 seconds

### Test: Concurrent Users
1. Have 5 HR users schedule interviews simultaneously
2. **Expected:** No race conditions, all interviews scheduled correctly

---

## Checklist Summary

- [ ] AI interview scheduling works end-to-end
- [ ] Manual interview scheduling works end-to-end
- [ ] Date/time validation works
- [ ] Calendly link validation works
- [ ] Emails sent successfully
- [ ] Database updates correctly
- [ ] UI loading states work
- [ ] Modal open/close works
- [ ] Security: Authorization verified
- [ ] Security: Ownership verified
- [ ] Button visibility correct
- [ ] Error handling works
- [ ] Toast notifications appear
- [ ] Candidates list refreshes
- [ ] Backend logs correctly

---

## Known Issues / Future Work

1. **AI Interview Page**: The AI interview link currently points to a non-existent page
   - Need to create `/ai-interview/:id` page
   - Implement actual AI interview functionality

2. **Email Content**: Currently using n8n workflow with basic payload
   - May need to customize email template in n8n
   - Consider adding HTML email formatting

3. **Timezone Handling**: No timezone conversion currently
   - Consider adding timezone selection
   - Store interview times in UTC

4. **Rescheduling**: No option to reschedule existing interviews
   - Need "Reschedule" button for scheduled interviews
   - Consider interview history tracking

5. **Candidate Confirmation**: Candidates can't confirm/decline
   - Add confirmation endpoints
   - Update candidate status based on response
