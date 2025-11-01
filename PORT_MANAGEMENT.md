# Port 3000 Management - Automatic Cleanup

## Overview

This project includes an automatic port management system that ensures the Next.js dev server always runs on port 3000, even if the port is occupied by a stale process.

## How It Works

### `free-port.mjs` Script

The `free-port.mjs` script automatically:
1. **Checks** if port 3000 is available
2. **Identifies** any process using port 3000
3. **Kills** the blocking process (cross-platform)
4. **Starts** Next.js dev server on port 3000

### Cross-Platform Support

**Windows:**
- Uses `netstat -ano` to find PIDs
- Uses `taskkill /F` to terminate processes

**macOS/Linux:**
- Uses `lsof -ti:3000` to find PIDs
- Uses `kill -9` to terminate processes

## Usage

Simply run the dev command as usual:

```bash
npm run dev
```

The script will automatically:
- ✓ Check port availability
- ✓ Free the port if occupied
- ✓ Start the dev server on port 3000

### Output Example

```
🔍 Checking port availability...

⚠ Port 3000 is in use, attempting to free it...
✓ Killed process 12345 on port 3000
✓ Port 3000 is now available

🚀 Starting Next.js dev server on port 3000...

▲ Next.js 14.2.33
✓ Ready on http://localhost:3000
```

## Benefits

1. **No Port Conflicts**: Never see "trying 3001 instead" messages
2. **Clean Development**: Automatically cleans up orphaned processes
3. **Consistent URLs**: Always use `http://localhost:3000`
4. **Cross-Platform**: Works on Windows, macOS, and Linux
5. **Zero Configuration**: Just run `npm run dev`

## Technical Details

### Port Detection

Uses Node.js `net` module to check if port is in use:
- Attempts to create a server on port 3000
- If `EADDRINUSE` error occurs, port is occupied
- Otherwise, port is available

### Process Termination

Safely terminates processes:
- Finds all PIDs using the port
- Kills each process with force flag
- Waits 1 second for port release
- Verifies port is free before starting Next.js

### Signal Handling

Properly handles termination signals:
- `SIGINT` (Ctrl+C): Graceful shutdown
- `SIGTERM`: Graceful shutdown
- Passes signals to child Next.js process

## Troubleshooting

### Port Still Shows as Busy

If the script reports the port is still in use:
1. Wait 2-3 seconds and try again
2. Manually check with: `netstat -ano | findstr :3000` (Windows) or `lsof -i:3000` (Unix)
3. Restart your terminal/command prompt

### Permission Errors

On Unix systems, if you get permission errors:
```bash
sudo npm run dev
```

### Script Not Running

Ensure Node.js version supports ES modules:
- Node.js 14+ required
- Check with: `node --version`

## Files

- `free-port.mjs` - Port management script (project root)
- `package.json` - Updated dev script to use `node ./free-port.mjs`

## Security

- Only kills processes on port 3000
- Does not affect other ports or services
- Uses system-level commands with proper error handling
- No external dependencies

## Maintenance

The script is self-contained and requires no maintenance. It will:
- Always check port before starting
- Always clean up properly on exit
- Always use the same reliable process

## Alternative: Manual Port Cleanup

If you prefer to manually free the port:

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:3000
kill -9 <PID>
```

But with this script, you never need to do this manually!

