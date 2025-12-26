#!/usr/bin/env node
/**
 * Auto Port Finder Script
 * Automatically finds and uses an available port, then starts Next.js
 */

const { spawn } = require('child_process');
const { findAvailablePort } = require('./check-port');

async function main() {
  const defaultPort = parseInt(process.env.PORT || process.env.NEXT_PORT || '3000', 10);
  const availablePort = await findAvailablePort(defaultPort, 20);
  
  if (availablePort) {
    console.log(`✓ Port ${availablePort} is available`);
    console.log(`Starting Next.js dev server on port ${availablePort}...\n`);
    
    // Set the port as an environment variable for Next.js
    process.env.PORT = availablePort.toString();
    process.env.NEXT_PORT = availablePort.toString();
    
    // Spawn Next.js dev server
    const nextDev = spawn('npx', ['next', 'dev', '-p', availablePort.toString()], {
      stdio: 'inherit',
      shell: true,
    });
    
    nextDev.on('error', (err) => {
      console.error('Failed to start Next.js:', err);
      process.exit(1);
    });
    
    nextDev.on('exit', (code) => {
      process.exit(code || 0);
    });
  } else {
    console.error(`✗ Could not find an available port starting from ${defaultPort}`);
    console.error(`Please free up a port or specify a different one with: PORT=XXXX npm run dev`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };

