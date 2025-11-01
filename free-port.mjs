#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import net from 'net';

const execAsync = promisify(exec);
const PORT = 3000;
const isWindows = process.platform === 'win32';

/**
 * Check if port is in use
 */
async function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    
    server.listen(port);
  });
}

/**
 * Kill process using the port on Windows
 */
async function killPortWindows(port) {
  try {
    // Find PID using the port
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    const lines = stdout.trim().split('\n');
    
    const pids = new Set();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0' && !isNaN(pid)) {
        pids.add(pid);
      }
    }
    
    if (pids.size === 0) {
      console.log(`⚠ No process found on port ${port}`);
      return false;
    }
    
    // Kill all PIDs found
    for (const pid of pids) {
      try {
        await execAsync(`taskkill /PID ${pid} /F`);
        console.log(`✓ Killed process ${pid} on port ${port}`);
      } catch (err) {
        console.log(`⚠ Could not kill PID ${pid}: ${err.message}`);
      }
    }
    
    return true;
  } catch (err) {
    console.log(`⚠ Error finding process on port ${port}:`, err.message);
    return false;
  }
}

/**
 * Kill process using the port on Unix (macOS/Linux)
 */
async function killPortUnix(port) {
  try {
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    const pids = stdout.trim().split('\n').filter(pid => pid);
    
    if (pids.length === 0) {
      console.log(`⚠ No process found on port ${port}`);
      return false;
    }
    
    for (const pid of pids) {
      try {
        await execAsync(`kill -9 ${pid}`);
        console.log(`✓ Killed process ${pid} on port ${port}`);
      } catch (err) {
        console.log(`⚠ Could not kill PID ${pid}: ${err.message}`);
      }
    }
    
    return true;
  } catch (err) {
    console.log(`⚠ Error finding process on port ${port}:`, err.message);
    return false;
  }
}

/**
 * Free the port if in use
 */
async function freePort(port) {
  const inUse = await isPortInUse(port);
  
  if (!inUse) {
    console.log(`✓ Port ${port} is available`);
    return true;
  }
  
  console.log(`⚠ Port ${port} is in use, attempting to free it...`);
  
  const killed = isWindows 
    ? await killPortWindows(port) 
    : await killPortUnix(port);
  
  if (killed) {
    // Wait a moment for the port to be fully released
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const stillInUse = await isPortInUse(port);
    if (stillInUse) {
      console.log(`⚠ Port ${port} is still in use after cleanup`);
      return false;
    }
    
    console.log(`✓ Port ${port} is now available`);
    return true;
  }
  
  return false;
}

/**
 * Start Next.js dev server
 */
async function startDevServer() {
  console.log(`\n🚀 Starting Next.js dev server on port ${PORT}...\n`);
  
  const { spawn } = await import('child_process');
  const child = spawn('npx', ['next', 'dev', '-p', PORT.toString()], {
    stdio: 'inherit',
    shell: true
  });
  
  child.on('error', (err) => {
    console.error('Failed to start dev server:', err);
    process.exit(1);
  });
  
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
  
  // Handle termination signals
  process.on('SIGINT', () => {
    child.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
    process.exit(0);
  });
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Checking port availability...\n');
  
  try {
    await freePort(PORT);
    await startDevServer();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();

