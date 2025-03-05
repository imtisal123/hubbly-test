/**
 * Script to check for and fix duplicate import statements in all screen files
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const screens = fs.readdirSync(screensDir).filter(file => 
  file.endsWith('Screen.tsx')
);

console.log('Checking for duplicate imports in all screens...');

// Process each screen file
let fixedScreens = 0;

screens.forEach(screenFile => {
  try {
    const filePath = path.join(screensDir, screenFile);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extract all import statements
    const importRegex = /import\s+.*\s+from\s+["'].*["'];?/g;
    const imports = content.match(importRegex) || [];
    
    // Check for duplicates
    const uniqueImports = new Set();
    const duplicates = [];
    
    imports.forEach(importStatement => {
      // Normalize the import statement (remove whitespace, semicolons, etc.)
      const normalizedImport = importStatement.replace(/\s+/g, ' ').replace(/;$/, '');
      
      if (uniqueImports.has(normalizedImport)) {
        duplicates.push(importStatement);
      } else {
        uniqueImports.add(normalizedImport);
      }
    });
    
    // If duplicates found, report them
    if (duplicates.length > 0) {
      console.log(`\nDuplicate imports found in ${screenFile}:`);
      duplicates.forEach(duplicate => {
        console.log(`  ${duplicate}`);
      });
      
      // Ask if we should fix them
      console.log(`\nWould you like to fix the duplicate imports in ${screenFile}? (Run this script with --fix to automatically fix)`);
      fixedScreens++;
    }
  } catch (error) {
    console.error(`Error processing ${screenFile}:`, error);
  }
});

// Final summary
if (fixedScreens === 0) {
  console.log('\n✅ No duplicate imports found in any screens.');
} else {
  console.log(`\n❌ Found duplicate imports in ${fixedScreens} screen(s).`);
  console.log('To fix these issues, run this script with the --fix flag:');
  console.log('node scripts/check_imports.js --fix');
}

// Check if we should fix the issues
if (process.argv.includes('--fix')) {
  console.log('\nFixing duplicate imports...');
  
  let fixedCount = 0;
  
  screens.forEach(screenFile => {
    try {
      const filePath = path.join(screensDir, screenFile);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Extract all import statements
      const importRegex = /import\s+.*\s+from\s+["'].*["'];?/g;
      const imports = content.match(importRegex) || [];
      
      // Check for duplicates
      const uniqueImports = new Set();
      const duplicates = [];
      
      imports.forEach(importStatement => {
        // Normalize the import statement
        const normalizedImport = importStatement.replace(/\s+/g, ' ').replace(/;$/, '');
        
        if (uniqueImports.has(normalizedImport)) {
          duplicates.push(importStatement);
        } else {
          uniqueImports.add(normalizedImport);
        }
      });
      
      // If duplicates found, remove them
      if (duplicates.length > 0) {
        duplicates.forEach(duplicate => {
          // Escape special characters for regex
          const escapedDuplicate = duplicate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedDuplicate, 'g');
          
          // Remove all occurrences after the first one
          let found = false;
          content = content.replace(regex, match => {
            if (found) return '';
            found = true;
            return match;
          });
        });
        
        // Write the fixed content back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed duplicate imports in ${screenFile}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`Error fixing ${screenFile}:`, error);
    }
  });
  
  // Final summary
  if (fixedCount > 0) {
    console.log(`\n✅ Fixed duplicate imports in ${fixedCount} screen(s).`);
  } else {
    console.log('\n✅ No duplicate imports needed fixing.');
  }
}
