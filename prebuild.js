import { execSync } from 'child_process';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file if it exists.
// This is for local development only. Render uses its dashboard.
if (existsSync('.env')) {
  dotenv.config();
}

// A simple check to ensure environment variables are loaded.
// Replace 'EXAMPLE_VAR' with an actual variable you use.
if (!process.env.PORT) {
  console.warn("Warning: Environment variables not loaded correctly. Using defaults.");
}

// Run the TypeScript compiler using npx to ensure tsc is found.
try {
  console.log('Compiling TypeScript...');
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('TypeScript compiled successfully.');
} catch (error) {
  console.error('TypeScript compilation failed.');
  process.exit(1);
}
