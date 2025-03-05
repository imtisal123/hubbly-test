/**
 * Script to fix all screens with double return statements
 * This script will scan all screen files and fix any instances of consecutive return statements
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const screens = fs.readdirSync(screensDir).filter(file => 
  file.endsWith('Screen.tsx')
);

let fixedScreens = 0;

// Process each screen file
screens.forEach(screenFile => {
  try {
    const filePath = path.join(screensDir, screenFile);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check for double return statements
    if (content.match(/return\s*\(\s*\n\s*\n\s*return\s*\(/)) {
      console.log(`Fixing double return statements in ${screenFile}...`);
      
      // Fix double return statements
      const fixedContent = content.replace(/return\s*\(\s*\n\s*\n\s*return\s*\(/, 'return (');
      
      // Write the fixed content back to the file
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      fixedScreens++;
    }
  } catch (error) {
    console.error(`Error processing ${screenFile}:`, error);
  }
});

// Final summary
if (fixedScreens > 0) {
  console.log(`\n✅ Fixed double return statements in ${fixedScreens} screen(s).`);
} else {
  console.log('\n✅ No screens with double return statements found.');
}

// Now let's run a more comprehensive check for other return statement issues
console.log('\nRunning comprehensive check for all return statement issues...');

let comprehensiveFixedScreens = 0;

screens.forEach(screenFile => {
  try {
    const filePath = path.join(screensDir, screenFile);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Fix any pattern of double returns with any whitespace in between
    const doubleReturnRegex = /(return\s*\()[\s\n]*(return\s*\()/g;
    content = content.replace(doubleReturnRegex, '$1');
    
    // Fix any pattern where there's a return statement immediately after a closing brace
    // This is common in conditional rendering
    const braceReturnRegex = /}\s*return\s*\(/g;
    content = content.replace(braceReturnRegex, '}\n  return (');
    
    // Fix any pattern where there's a return statement without proper indentation
    const badIndentationRegex = /\n(\s*)return\s*\(/g;
    content = content.replace(badIndentationRegex, '\n  $1return (');
    
    // If we made any changes, write the file
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed return statement issues in ${screenFile}`);
      comprehensiveFixedScreens++;
    }
  } catch (error) {
    console.error(`Error in comprehensive fix for ${screenFile}:`, error);
  }
});

if (comprehensiveFixedScreens > 0) {
  console.log(`\n✅ Fixed return statement issues in ${comprehensiveFixedScreens} screen(s) during comprehensive check.`);
} else {
  console.log('\n✅ No additional return statement issues found during comprehensive check.');
}

// Run a final verification to ensure all screens are valid
console.log('\nVerifying all screens...');

let allValid = true;
let screensWithIssues = [];

screens.forEach(screenFile => {
  try {
    const filePath = path.join(screensDir, screenFile);
    const content = fs.readFileSync(filePath, 'utf8');
    let issues = [];
    
    // Check for duplicate return statements (not nested in conditionals)
    const returnMatches = content.match(/return\s*\(/g) || [];
    if (returnMatches.length > 1) {
      // Check if the returns are nested in conditionals (which is valid)
      const lines = content.split('\n');
      let returnLines = [];
      
      lines.forEach((line, index) => {
        if (line.match(/return\s*\(/)) {
          returnLines.push(index);
        }
      });
      
      // Check if any returns are at the same indentation level
      let sameIndentationReturns = false;
      for (let i = 0; i < returnLines.length - 1; i++) {
        const line1 = lines[returnLines[i]];
        const line2 = lines[returnLines[i + 1]];
        
        const indent1 = line1.match(/^\s*/)[0].length;
        const indent2 = line2.match(/^\s*/)[0].length;
        
        if (indent1 === indent2) {
          sameIndentationReturns = true;
          break;
        }
      }
      
      if (sameIndentationReturns) {
        issues.push('Multiple return statements at the same indentation level');
      }
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
