// clean.js
const fs = require('fs');
const path = require('path');

const pathsToRemove = [
  './.cache',
  './node_modules/.cache',
  './dist',
  './build'
];

console.log('🧹 Cleaning project caches...');

pathsToRemove.forEach(pathToRemove => {
  try {
    const fullPath = path.resolve(process.cwd(), pathToRemove);
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`Removed: ${pathToRemove}`);
    } else {
      console.log(`Path not found (skipping): ${pathToRemove}`);
    }
  } catch (err) {
    console.error(`Error removing ${pathToRemove}:`, err.message);
  }
});

// Find and remove TSBuildInfo files
try {
  const findTSBuildInfo = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !fullPath.includes('node_modules')) {
        findTSBuildInfo(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.tsbuildinfo')) {
        fs.unlinkSync(fullPath);
        console.log(`Removed: ${fullPath}`);
      }
    }
  };
  
  findTSBuildInfo(process.cwd());
} catch (err) {
  console.error('Error while searching for .tsbuildinfo files:', err.message);
}

console.log('✅ Clean completed successfully!');