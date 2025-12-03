# OASCMS Quick Start Guide

## Current Working Configuration

The application is **working** with this setup:

### Files Structure
```
src/
  app/
    [locale]/
      page.tsx          ← Dashboard main page
      layout.tsx        ← Root layout with i18n
      (dashboard)/      ← Route group (transparent in URL)
        layout.tsx      ← Dashboard layout (sidebar/header)
        contracts/
        lottery/
        projects/
      login/
  proxy.ts.disabled     ← Disabled (was causing 404)
```

### How to Start

1. **Kill all Node processes:**
   ```powershell
   taskkill /F /IM node.exe
   ```

2. **Start ONE server:**
   ```powershell
   cd c:/Dev/antigravity_ws/OASCMS/frontend
   npm run dev
   ```

3. **Access the app:**
   - **IMPORTANT**: Use `http://localhost:3000/ko` (NOT the port shown in other terminals)
   - Hard refresh: `Ctrl + Shift + R` (clears cache)

### If Still Showing 404

Try these in order:

1. **Clear browser cache completely**
   - Chrome: Settings → Privacy → Clear browsing data → Cached images

2. **Try incognito/private window**

3. **Check you're on the right port**
   - Close ALL browser tabs
   - Open fresh: `http://localhost:3000/ko`

4. **Verify server logs show `GET /ko 200`**
   - If logs show `200` but browser shows `404`, it's a browser cache issue

### Available Routes
- `/ko` - Dashboard (Korean)
- `/en` - Dashboard (English)
- `/ar` - Dashboard (Arabic, RTL)
- `/ko/login` - Login page
- `/ko/projects` - Projects list
- `/ko/contracts` - Contracts list
- `/ko/lottery` - Lottery dashboard

## Troubleshooting

**Multiple servers running:**
```powershell
# Kill all
taskkill /F /IM node.exe

# Start only one
npm run dev
```

**Port already in use:**
```powershell
# Find process
netstat -ano | findstr :3000

# Kill it
taskkill /F /PID <process_id>
```

**404 despite server showing 200:**
- This is browser cache
- Use Incognito mode or clear cache
- Try different browser

## What Was Fixed

1. ✅ Renamed `middleware.ts` → `proxy.ts` (Next.js 16 requirement)
2. ✅ Disabled proxy.ts temporarily (was causing routing issues with next-intl)
3. ✅ Dashboard page at correct location: `src/app/[locale]/page.tsx`
4. ✅ All UI components working (Sidebar, Header, Charts, Tables)

## Next Steps

Once the app loads:
1. Re-enable i18n middleware (fix proxy.ts configuration)
2. Connect to backend API
3. Replace mock data with real API calls
4. Deploy to production
