// A simple script to toggle mocks in production
// Usage: node scripts/toggle-mocks.js [on|off]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envProdPath = path.join(rootDir, '.env.production');

// Get the command line argument
const arg = process.argv[2]?.toLowerCase();

if (!['on', 'off'].includes(arg)) {
  console.error('Usage: node scripts/toggle-mocks.js [on|off]');
  process.exit(1);
}

// Set the value based on the argument
const enableMocks = arg === 'on';
const envContent = `# Production environment variables
# Mocks are ${enableMocks ? 'enabled' : 'disabled'} in production
VITE_ENABLE_MOCKS=${enableMocks ? 'true' : 'false'}`;

// Write the file
fs.writeFileSync(envProdPath, envContent);

console.log(`✅ Mocks ${enableMocks ? 'enabled' : 'disabled'} for production builds`);
console.log('Run "pnpm build" to rebuild the application with the new settings');
