# Jutsu Clash - Troubleshooting Guide

## Common Issues & Solutions

### Server Issues

#### ❌ Error: "Must use import to load ES Module"
**Problem**: `ts-node-dev` doesn't support ES modules properly

**Solution**: ✅ **FIXED** - Now using `tsx watch` instead
```bash
cd server
npm run dev
```

The server now runs with `tsx watch src/index.ts` which fully supports ES modules.

---

#### ❌ Error: "Cannot find module '@jutsu-clash/shared'"
**Problem**: Shared module not built or linked

**Solution**:
```bash
# 1. Build shared module first
cd shared
npm install
npm run build

# 2. Link to server
cd ../server
npm install

# 3. Link to client
cd ../client
npm install
```

---

### Client Issues

#### ❌ Error: "No matching export for JUTSU_DATABASE"
**Problem**: JUTSU_DATABASE not exported from shared module

**Solution**: ✅ **FIXED** - JUTSU_DATABASE now properly exported from `shared/src/index.ts`

If you still see this error:
```bash
cd shared
npm run build
cd ../client
rm -rf node_modules/.vite  # Clear Vite cache
npm run dev
```

---

#### ❌ Error: "It looks like you're trying to use tailwindcss directly as a PostCSS plugin"
**Problem**: Wrong Tailwind CSS syntax in index.css

**Solution**: ✅ **FIXED** - Now using traditional Tailwind directives

The `client/src/index.css` should contain:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

NOT `@import "tailwindcss";` (that's for Tailwind v4)

---

#### ❌ Webcam Not Working
**Problem**: Browser doesn't have camera permissions

**Solutions**:
1. **Chrome/Edge**: Click the camera icon in address bar → Allow
2. **Firefox**: Click the crossed camera icon → Allow
3. **Safari**: Safari → Settings → Websites → Camera → Allow

**Still not working?**
- Check if another app is using the webcam
- Try refreshing the page (F5)
- Restart the browser
- Check camera in device settings

---

#### ❌ Gestures Not Recognized
**Problem**: MediaPipe not detecting hands properly

**Solutions**:
1. **Improve Lighting**: Use a well-lit room
2. **Camera Position**: Place webcam at eye level
3. **Hand Position**: Keep hands centered in frame
4. **Background**: Use plain background if possible
5. **Distance**: Keep hands 1-2 feet from camera

**Confidence Threshold**:
The system requires 85% confidence. If recognition is too strict, you can adjust in:
`client/src/lib/gestureRecognizer.ts` line 54:
```typescript
minDetectionConfidence: 0.7,  // Lower this (0.5-0.7)
minTrackingConfidence: 0.7,   // Lower this (0.5-0.7)
```

---

### Matchmaking Issues

#### ❌ "Match Not Found" / "Searching Forever"
**Problem**: Need 2 players for matchmaking

**Solution**: For local testing, open 2 browser windows:

**Window 1**:
```
http://localhost:5173
Click "Quick Battle"
```

**Window 2** (Incognito/Different Browser):
```
http://localhost:5173
Click "Quick Battle"
```

Both should match within 2 seconds!

---

#### ❌ "Connection Failed" / Socket Errors
**Problem**: Server not running or wrong URL

**Solution**:
1. Verify server is running:
```bash
cd server
npm run dev
# Should see: "🚀 Jutsu Clash server listening on port 4000"
```

2. Check `.env` files:

**client/.env**:
```
VITE_SERVER_URL=http://localhost:4000
```

**server/.env**:
```
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

3. Test server health:
```bash
curl http://localhost:4000/api/health
# Should return: {"status":"ok","timestamp":...}
```

---

### Build Issues

#### ❌ TypeScript Compilation Errors
**Problem**: Type errors when building

**Solution**:
```bash
# Clean and rebuild everything
cd shared
rm -rf dist node_modules
npm install
npm run build

cd ../server
rm -rf dist node_modules
npm install
npm run build

cd ../client
rm -rf dist node_modules .vite
npm install
# No need to build for dev mode
```

---

#### ❌ Port Already in Use
**Problem**: Port 4000 or 5173 already taken

**Solution**:

**For Server (Port 4000)**:
Edit `server/.env`:
```
PORT=4001  # Or any available port
```

Update `client/.env`:
```
VITE_SERVER_URL=http://localhost:4001
```

**For Client (Port 5173)**:
Vite will automatically try the next available port (5174, 5175, etc.)

Or specify in `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3000  // Your preferred port
  }
})
```

---

### Performance Issues

#### ❌ Low FPS / Laggy Gesture Recognition
**Problem**: MediaPipe processing too heavy

**Solutions**:
1. **Lower Model Complexity**:
   Edit `client/src/lib/gestureRecognizer.ts` line 42:
   ```typescript
   modelComplexity: 0,  // Instead of 1
   ```

2. **Reduce Video Quality**:
   Edit `client/src/lib/gestureRecognizer.ts` line 56:
   ```typescript
   video: {
     width: 640,   // Instead of 1280
     height: 480,  // Instead of 720
   }
   ```

3. **Close Other Apps**: Free up CPU/GPU resources

---

#### ❌ High Memory Usage
**Problem**: Browser using too much RAM

**Solutions**:
1. Close unused browser tabs
2. Disable browser extensions
3. Use Chrome/Edge (better WebGL support)
4. Increase available system RAM

---

### Network Issues

#### ❌ High Latency in Battles
**Problem**: Slow network communication

**For Local Testing**: Shouldn't be an issue

**For Remote Testing**:
1. Check server location (use closer region)
2. Check network speed
3. Reduce battle update frequency (edit `server/src/index.ts` line 165)

---

### Database Issues (Future)

**Note**: Database features not yet implemented in MVP.

When Prisma is added:
```bash
cd server
npx prisma generate
npx prisma migrate dev
```

---

## Quick Fixes Checklist

If nothing works, try this sequence:

```bash
# 1. Stop all running processes (Ctrl+C in terminals)

# 2. Clean everything
cd shared && rm -rf dist node_modules && npm install && npm run build
cd ../server && rm -rf dist node_modules && npm install
cd ../client && rm -rf dist node_modules .vite && npm install

# 3. Start fresh
cd ../server && npm run dev
# In new terminal:
cd client && npm run dev

# 4. Clear browser cache and refresh
```

---

## Getting Help

### Before Asking for Help
1. Check this guide
2. Check browser console (F12) for errors
3. Check server terminal for errors
4. Try the Quick Fixes above

### Where to Ask
- GitHub Issues: For bugs
- Discussions: For questions
- Discord: Real-time help (if available)

### What to Include
1. **Error Message**: Full error text
2. **Environment**:
   - OS (Windows/Mac/Linux)
   - Node version (`node --version`)
   - Browser & version
3. **Steps to Reproduce**: What you did before error
4. **Screenshots**: If UI-related
5. **Console Logs**: Browser console (F12) and server terminal

---

## Platform-Specific Issues

### Windows
- Use PowerShell or Git Bash (not CMD)
- Path separators: Use `/` or `\\`
- Port conflicts: Check Task Manager

### macOS
- May need to allow camera in System Preferences
- Use Terminal or iTerm2
- Check Security & Privacy settings

### Linux
- Camera permissions via browser only
- May need `sudo` for some npm commands
- Check `v4l2-ctl` for camera issues

---

## Development Tips

### Hot Reload Not Working?
- **Server**: `tsx watch` should auto-reload
- **Client**: Vite should hot-reload automatically
- If not, restart the dev servers

### Types Not Updating?
```bash
cd shared && npm run build
# Restart server and client
```

### Module Resolution Issues?
Check `tsconfig.json` in all three packages:
- `"moduleResolution": "nodenext"`
- `"module": "nodenext"`
- `"type": "module"` in package.json

---

## Still Having Issues?

1. Check `README.md` for setup instructions
2. Check `QUICKSTART.md` for step-by-step guide
3. Review `PROJECT_SUMMARY.md` for architecture
4. Open a GitHub issue with details

---

**Last Updated**: 2025-11-01
**Tested On**: Windows 11, Node v18+, Chrome/Edge
