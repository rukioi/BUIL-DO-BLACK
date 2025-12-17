import { execSync } from 'child_process';

try {
  console.log('Building backend...');
  execSync('tsc -p tsconfig.server.json', { stdio: 'inherit' });
  console.log('TypeScript compilation completed (with possible type errors)');
} catch (error) {
  console.log('TypeScript compilation completed with errors (continuing anyway)');
}

// Always run fix-imports
try {
  console.log('Fixing imports...');
  await import('./fix-imports.js');
} catch (error) {
  console.error('Error fixing imports:', error.message);
  process.exit(1);
}

console.log('Backend build completed!');

