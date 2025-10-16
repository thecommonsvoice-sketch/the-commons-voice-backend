import { execSync } from 'child_process';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

if (existsSync('.env')) {
  dotenv.config();
}

try {
  console.log('Compiling TypeScript...');
  execSync('node_modules/typescript/bin/tsc', { stdio: 'inherit' });
  console.log('TypeScript compiled successfully.');
} catch (error) {
  console.error('TypeScript compilation failed.');
  process.exit(1);
}
