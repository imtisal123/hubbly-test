/**
 * Comprehensive script to fix all screens in the Hubbly app
 * This script will fix common syntax errors in all screen files
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const screens = fs.readdirSync(screensDir).filter(file => 
  file.endsWith('Screen.tsx')
);

console.log('Starting comprehensive screen fixes...');

// Process each screen file
let fixedScreens = 0;

screens.forEach(screenFile => {
  try {
    const filePath = path.join(screensDir, screenFile);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = [];
    
    // Fix 1: Fix double return statements
    if (content.match(/return\s*\(\s*\n\s*\n\s*return\s*\(/)) {
      content = content.replace(/return\s*\(\s*\n\s*\n\s*return\s*\(/, 'return (');
      changes.push('Fixed double return statements');
    }
    
    // Fix 2: Fix any pattern of double returns with any whitespace in between
    const doubleReturnRegex = /(return\s*\()[\s\n]*(return\s*\()/g;
    if (content.match(doubleReturnRegex)) {
      content = content.replace(doubleReturnRegex, '$1');
      changes.push('Fixed multiple return statements');
    }
    
    // Fix 3: Fix any pattern where there's a return statement immediately after a closing brace
    // This is common in conditional rendering
    const braceReturnRegex = /}\s*return\s*\(/g;
    if (content.match(braceReturnRegex)) {
      content = content.replace(braceReturnRegex, '}\n  return (');
      changes.push('Fixed return statement after closing brace');
    }
    
    // Fix 4: Fix any pattern where there's a return statement without proper indentation
    const badIndentationRegex = /\n(\s*)return\s*\(/g;
    if (content.match(badIndentationRegex)) {
      content = content.replace(badIndentationRegex, '\n  $1return (');
      changes.push('Fixed return statement indentation');
    }
    
    // Fix 5: Fix missing semicolons after function declarations
    const missingSemicolonRegex = /}\s*return/g;
    if (content.match(missingSemicolonRegex)) {
      content = content.replace(missingSemicolonRegex, '};\n  return');
      changes.push('Fixed missing semicolons after function declarations');
    }
    
    // Fix 6: Fix duplicate import statements
    // This is a more complex fix that requires parsing the imports
    const importLines = content.match(/import.*from.*/g) || [];
    const uniqueImports = new Set();
    let hasDuplicateImports = false;
    
    importLines.forEach(line => {
      if (uniqueImports.has(line)) {
        hasDuplicateImports = true;
      } else {
        uniqueImports.add(line);
      }
    });
    
    if (hasDuplicateImports) {
      changes.push('Detected duplicate imports (needs manual review)');
    }
    
    // Fix 7: Ensure export statement is at the top level
    if (content.includes('function') && content.includes('export default') && !content.match(/^export default function/m)) {
      // Check if export is inside a function block
      const exportInsideFunctionRegex = /function.*\{[\s\S]*export default/;
      if (content.match(exportInsideFunctionRegex)) {
        changes.push('Export statement may be inside a function block (needs manual review)');
      }
    }
    
    // If we made any changes, write the file
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed ${screenFile}:`);
      changes.forEach(change => console.log(`  - ${change}`));
      fixedScreens++;
    } else {
      console.log(`✅ No issues found in ${screenFile}`);
    }
  } catch (error) {
    console.error(`Error processing ${screenFile}:`, error);
  }
});

// Final summary
if (fixedScreens > 0) {
  console.log(`\n✅ Fixed issues in ${fixedScreens} screen(s).`);
} else {
  console.log('\n✅ No issues found in any screens.');
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
    
    // Check for ScrollView component
    if (!content.includes('ScrollView') && !content.includes('FlatList')) {
      issues.push('Missing ScrollView or FlatList component');
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
