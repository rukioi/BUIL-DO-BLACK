import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function fixImportsInFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Fix relative imports: from './something' -> from './something.js'
    // But don't fix if it already has .js or is importing from node_modules
    content = content.replace(
      /from\s+['"](\.\/[^'"]+)['"]/g,
      (match, importPath) => {
        if (!importPath.endsWith('.js') && !importPath.endsWith('.json')) {
          modified = true;
          return match.replace(importPath, importPath + '.js');
        }
        return match;
      }
    );

    // Fix relative imports: from '../something' -> from '../something.js'
    content = content.replace(
      /from\s+['"](\.\.\/[^'"]+)['"]/g,
      (match, importPath) => {
        if (!importPath.endsWith('.js') && !importPath.endsWith('.json')) {
          modified = true;
          return match.replace(importPath, importPath + '.js');
        }
        return match;
      }
    );

    // Fix import statements: import './something' -> import './something.js'
    content = content.replace(
      /import\s+['"](\.\/[^'"]+)['"]/g,
      (match, importPath) => {
        if (!importPath.endsWith('.js') && !importPath.endsWith('.json')) {
          modified = true;
          return match.replace(importPath, importPath + '.js');
        }
        return match;
      }
    );

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      console.log(`Fixed imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const files = readdirSync(dirPath);

  for (const file of files) {
    const filePath = join(dirPath, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js') && !file.endsWith('.d.ts')) {
      fixImportsInFile(filePath);
    }
  }
}

const distDir = join(__dirname, '..', 'dist');
console.log('Fixing imports in dist directory...');
processDirectory(distDir);
console.log('Done fixing imports!');

