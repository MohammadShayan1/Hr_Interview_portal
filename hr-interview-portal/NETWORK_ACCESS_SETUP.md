# 🌐 Network Access Setup - Public IP Configuration

Your HR Interview Portal is now configured to run on your **local network** using your machine's IP address!

## 📡 Your Network Details

- **Machine IP Address**: `192.168.0.141`
- **Local Address**: `localhost`
- **Backend Port**: `5000`
- **Frontend Port**: `3000`

## 🔗 Access URLs

### From This Computer (Development Machine)
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### From Other Devices on Same Network
- **Frontend**: http://192.168.0.141:3000
- **Backend API**: http://192.168.0.141:5000/api
- **Health Check**: http://192.168.0.141:5000/api/health

## ✅ What Was Updated

### Backend Configuration
✅ Server now listens on `0.0.0.0` (all network interfaces)
✅ CORS configured to accept requests from both localhost and IP
✅ Environment variables use IP address: `192.168.0.141`
✅ Graceful error handling and logging

### Frontend Configuration
✅ API URL points to machine IP: `http://192.168.0.141:5000/api`
✅ Firebase configuration loaded from environment
✅ Fixed Suspense boundary for dynamic search parameters
✅ Production build verified and working

## 🚀 Quick Start

### Terminal 1 - Start Backend

```powershell
cd d:\work\hr-interview-portal\backend
npm run dev
```

Expected output:
```
🚀 Server is running!
📡 Environment: development
🔗 Local: http://localhost:5000
🔗 Network: http://192.168.0.141:5000
📊 API: http://192.168.0.141:5000/api
✅ Health Check: http://192.168.0.141:5000/api/health
```

### Terminal 2 - Start Frontend

```powershell
cd d:\work\hr-interview-portal\frontend
npm run dev
```

Expected output:
```
▲ Next.js ready in ...ms
- Local:        http://localhost:3000
- Environments: .env.local, .env
```

## 🖥️ Accessing from Other Devices

### On Windows/Mac/Linux
1. Find your development machine's IP: `192.168.0.141`
2. Open browser on another device
3. Go to: `http://192.168.0.141:3000`
4. Should see the HR Interview Portal landing page!

### On Mobile (Phone/Tablet)
1. Connect to the same WiFi as your development machine
2. Open browser
3. Go to: `http://192.168.0.141:3000`
4. Test full application functionality

### Via Remote Desktop
1. If using RDP or similar, same process applies
2. Browser on remote machine → `http://192.168.0.141:3000`

## ⚠️ Firewall Configuration

**If you can't access from other devices:**

### Windows Firewall
1. Go to **Windows Defender Firewall** → **Allow an app**
2. Click **Change settings**
3. Find and allow:
   - `node.exe` or `npm`
   - Enable for both Private and Public networks

Or run in PowerShell as Administrator:
```powershell
# Allow Node.js on firewall
netsh advfirewall firewall add rule name="Node.js" dir=in action=allow program="C:\Program Files\nodejs\node.exe" enable=yes

# Allow specific ports
netsh advfirewall firewall add rule name="Port 5000" dir=in action=allow protocol=tcp localport=5000
netsh advfirewall firewall add rule name="Port 3000" dir=in action=allow protocol=tcp localport=3000
```

### Mac/Linux
Usually no firewall blocks localhost network by default. If issues:
```bash
# Check if ports are listening
netstat -an | grep -E '3000|5000'
```

## 🧪 Testing Network Access

### Test Backend API
From another device:
```bash
curl http://192.168.0.141:5000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "API is running",
  ...
}
```

### Test Resume Upload
1. Go to http://192.168.0.141:3000
2. Create account or login
3. Create a job posting
4. Go to `/apply/{jobId}` on mobile/other device
5. Upload a resume
6. Verify it saves to `backend/storage/resumes/{jobId}/`

## 📋 Environment Files Updated

### Backend `.env`
```env
FRONTEND_URL=http://192.168.0.141:3000
BACKEND_URL=http://192.168.0.141:5000
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://192.168.0.141:5000/api
```

## 🔧 Configuration Files Modified

| File | Change |
|------|--------|
| `backend/src/server.ts` | Listen on `0.0.0.0` instead of default host |
| `backend/src/app.ts` | Added IP to CORS whitelist |
| `backend/.env` | Updated URLs to use IP address |
| `frontend/.env.local` | Created with IP-based API URL |
| `frontend/src/app/dashboard/candidates/page.tsx` | Fixed Suspense boundary |

## 🌍 Network Architecture

```
┌─────────────────────────────────────────────────────┐
│         Your Development Machine                     │
│         (192.168.0.141)                              │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ Backend API (Node.js + Express)             │   │
│  │ Listening on 0.0.0.0:5000                   │   │
│  │ - Serves API endpoints                      │   │
│  │ - Stores resumes locally                    │   │
│  │ - Connects to Firebase                      │   │
│  └─────────────────────────────────────────────┘   │
│                         ↕                            │
│  ┌─────────────────────────────────────────────┐   │
│  │ Frontend (Next.js)                          │   │
│  │ Listening on 0.0.0.0:3000                   │   │
│  │ - Web interface                             │   │
│  │ - Calls backend API                         │   │
│  │ - Firebase authentication                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
└─────────────────────────────────────────────────────┘
              ↕                ↕
    ┌──────────────┐   ┌─────────────────┐
    │ Your Laptop  │   │ Other Devices   │
    │ localhost:   │   │ 192.168.0.141:  │
    │ 3000 & 5000  │   │ 3000 & 5000     │
    └──────────────┘   └─────────────────┘
```

## 🆘 Troubleshooting

### "Cannot connect from other device"
- [ ] Check firewall (see Firewall Configuration section)
- [ ] Verify IP address is correct: `ipconfig | Select-String "IPv4"`
- [ ] Ensure both backend and frontend are running
- [ ] Check no port conflicts: `netstat -ano | findstr :3000`

### "API calls returning 404"
- [ ] Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- [ ] Check backend is actually running
- [ ] Look for CORS errors in browser console

### "Resume uploads failing"
- [ ] Verify `backend/storage/resumes/` directory exists
- [ ] Check file permissions on storage folder
- [ ] Look at backend logs for errors

### "Pages not loading on mobile"
- [ ] Ensure you're on same WiFi network
- [ ] Try from browser incognito/private mode
- [ ] Check if firewall is blocking: see Firewall Configuration

## 📝 Next Steps

1. **Start the servers** using commands above
2. **Test locally first** with http://localhost:3000
3. **Access from another device** with http://192.168.0.141:3000
4. **Test all features**: Create job, Apply, Upload resume, View candidate
5. **When ready for production**: Follow deployment guide

## 📚 Related Documentation

- `LOCAL_STORAGE_SETUP.md` - Local resume storage configuration
- `FIREBASE_STORAGE_SOLUTIONS.md` - Storage solutions overview
- `SETUP_CHECKLIST.md` - Complete setup instructions
- `README.md` - Project overview

---

**Ready to test?** Start the servers and access your app from any device on your network! 🚀

