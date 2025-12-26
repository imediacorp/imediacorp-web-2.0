#!/usr/bin/env node
/**
 * Port Checker Script
 * Checks if a port is available and suggests an alternative if not
 */

const net = require('net');

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve({ available: true, port });
      });
      server.close();
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve({ available: false, port });
      } else {
        resolve({ available: false, port, error: err });
      }
    });
  });
}

async function findAvailablePort(startPort, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    const result = await checkPort(port);
    
    if (result.available) {
      return port;
    }
  }
  
  return null;
}

// Main execution
async function main() {
  const defaultPort = parseInt(process.env.PORT || process.env.NEXT_PORT || '3000', 10);
  const result = await checkPort(defaultPort);
  
  if (result.available) {
    console.log(`Port ${defaultPort} is available`);
    process.exit(0);
  } else {
    console.warn(`Port ${defaultPort} is in use, searching for alternative...`);
    const alternativePort = await findAvailablePort(defaultPort + 1);
    
    if (alternativePort) {
      console.log(`Suggested port: ${alternativePort}`);
      console.log(`\nTo use this port, run:`);
      console.log(`  PORT=${alternativePort} npm run dev`);
      process.exit(1);
    } else {
      console.error(`Could not find an available port starting from ${defaultPort}`);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkPort, findAvailablePort };

