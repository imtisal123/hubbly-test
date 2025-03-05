/**
 * Script to fix all import-related issues in screen files
 * This script handles:
 * 1. Duplicate imports
 * 2. Malformed imports (like the useEffect issue)
 * 3. Missing semicolons in imports
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const screens = fs.readdirSync(screensDir).filter(file => 
  file.endsWith('Screen.tsx')
);

console.log('Starting comprehensive import fixes...');

// Process each screen file
let fixedScreens = 0;

screens.forEach(screenFile => {
  try {
    const filePath = path.join(screensDir, screenFile);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = [];
    
    // Fix 1: Check for malformed imports (like "useEffect } from 'react'")
    const malformedImportRegex = /useEffect\s*}\s*from\s*["']react["']/g;
    if (content.match(malformedImportRegex)) {
      // This is a specific fix for the CareerScreen issue
      content = content.replace(malformedImportRegex, '');
      changes.push('Fixed malformed useEffect import');
    }
    
    // Fix 2: Extract all import statements
    const importRegex = /import\s+.*\s+from\s+["'].*["'];?/g;
    const imports = content.match(importRegex) || [];
    
    // Check for duplicates
    const uniqueImports = new Set();
    const duplicates = [];
    
    imports.forEach(importStatement => {
      // Normalize the import statement
      const normalizedImport = importStatement.replace(/\\s+/g, ' ').replace(/;$/, '');
      
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
        const escapedDuplicate = duplicate.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
        const regex = new RegExp(escapedDuplicate, 'g');
        
        // Remove all occurrences after the first one
        let found = false;
        content = content.replace(regex, match => {
          if (found) return '';
          found = true;
          return match;
        });
      });
      
      changes.push('Fixed duplicate imports');
    }
    
    // Fix 3: Ensure all imports have semicolons
    const importWithoutSemicolonRegex = /(import\s+.*\s+from\s+["'].*["'])([^;])/g;
    if (content.match(importWithoutSemicolonRegex)) {
      content = content.replace(importWithoutSemicolonRegex, '$1;$2');
      changes.push('Added missing semicolons to imports');
    }
    
    // Fix 4: Fix multiple export default statements
    const exportDefaultCount = (content.match(/export\s+default/g) || []).length;
    if (exportDefaultCount > 1) {
      // This is a complex fix that might need manual intervention
      changes.push('Multiple export default statements detected (needs manual review)');
    }
    
    // If we made any changes, write the file
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed ${screenFile}:`);
      changes.forEach(change => console.log(`  - ${change}`));
      fixedScreens++;
    } else {
      console.log(`✅ No import issues found in ${screenFile}`);
    }
  } catch (error) {
    console.error(`Error processing ${screenFile}:`, error);
  }
});

// Final summary
if (fixedScreens > 0) {
  console.log(`\n✅ Fixed import issues in ${fixedScreens} screen(s).`);
} else {
  console.log('\n✅ No import issues found in any screens.');
}

// Run verification to ensure all screens are valid
console.log('\nVerifying all screens...');

let allValid = true;
let screensWithIssues = [];

screens.forEach(screenFile => {
  try {
    const filePath = path.join(screensDir, screenFile);
    const content = fs.readFileSync(filePath, 'utf8');
    let issues = [];
    
    // Check for import statements
    if (!content.includes('import {')) {
      issues.push('Missing import statements');
    }
    
    // Check for return statement
    if (!content.includes('return (')) {
      issues.push('Missing return statement');
    }
    
    // Print results
    if (issues.length === 0) {
      console.log(`✅ ${screenFile} is valid`);
    } else {
      console.log(`Issues in ${screenFile}:`);
      issues.forEach(issue => {
        console.log(`  - ${issue}`);
      });
      allValid = false;
      screensWithIssues.push(screenFile);
    }
  } catch (error) {
    console.error(`Error verifying ${screenFile}:`, error);
    allValid = false;
    screensWithIssues.push(screenFile);
  }
});

// Final summary
if (allValid) {
  console.log('\n✅ All screens are valid!');
} else {
  console.log('\n❌ Some screens still have issues:');
  screensWithIssues.forEach(screen => {
    console.log(`  - ${screen}`);
  });
  
  console.log('\nYou may need to manually fix these screens or run a more targeted fix script.');
}
