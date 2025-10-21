# 🚀 QUICK START - Access Your App Now!

## Your Machine IP: `192.168.0.141`

### 🌐 Access URLs (Copy & Paste)

**On This Computer:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api

**From Other Devices:**
- Frontend: http://192.168.0.141:3000
- Backend: http://192.168.0.141:5000/api

## ✅ Services Running

```
Terminal 1: Backend  (Port 5000) ✅ Running
Terminal 2: Frontend (Port 3000) ✅ Running
```

## 🎯 First Steps

1. **Open browser** on any device on same WiFi network
2. **Go to**: http://192.168.0.141:3000
3. **Sign up** or login
4. **Create a job** posting
5. **Get the Job ID** from the URL
6. **Go to**: http://192.168.0.141:3000/apply/{jobId}
7. **Upload a resume** (PDF/DOC)
8. **Check dashboard** to see applications

## 📂 Resume Storage

Files saved to:
```
backend/storage/resumes/{jobId}/{timestamp}_{filename}
```

## 🆘 Troubleshooting

**Can't access from other device?**
- Check firewall (Windows Defender may block ports)
- Verify correct IP: `ipconfig | Select-String "IPv4"`
- Try from same machine first: `localhost:3000`
- Restart services: `Ctrl+C` and `npm run dev`

**Backend errors?**
- Check Firebase credentials in `backend/.env`
- Verify email settings if sending invitations
- Look at backend terminal for error messages

**Frontend not loading?**
- Clear browser cache: `Ctrl+Shift+Delete`
- Try incognito/private mode
- Check `.env.local` has correct API URL

## 📚 Full Documentation

- `NETWORK_ACCESS_SETUP.md` - Complete network guide
- `LOCAL_STORAGE_SETUP.md` - Resume storage details
- `STATUS_RUNNING.md` - Full status report

---

**That's it! Your app is running and ready to use!** 🎉

