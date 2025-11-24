const fs = require('fs');
const path = require('path');

// Ensure the build/index.d.ts file exists and exports correctly
const buildDir = path.join(__dirname, '../build');
const indexDtsPath = path.join(buildDir, 'index.d.ts');

// Check if index.d.ts exists, if not create it
if (!fs.existsSync(indexDtsPath)) {
  fs.writeFileSync(indexDtsPath, "export * from './context-menu';\n");
}

// Verify context-menu/index.d.ts exists
const contextMenuIndexPath = path.join(buildDir, 'context-menu', 'index.d.ts');
if (!fs.existsSync(contextMenuIndexPath)) {
  console.error('❌ context-menu/index.d.ts not found after TypeScript compilation');
  process.exit(1);
}

console.log('✅ TypeScript declaration files verified');

