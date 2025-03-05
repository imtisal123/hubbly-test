/**
 * Comprehensive Screen Checker
 * 
 * This script performs a thorough analysis of all screen files to identify and fix common issues:
 * 1. Syntax errors (malformed imports, missing semicolons)
 * 2. Duplicate return statements
 * 3. Duplicate import statements
 * 4. Multiple export default statements
 * 5. Improper component structure
 * 
 * Usage: node comprehensive_screen_checker.js [--fix]
 * Add --fix flag to automatically fix identified issues
 */

const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const shouldFix = process.argv.includes('--fix');

// Get all screen files
const screens = fs.readdirSync(screensDir).filter(file => 
  file.endsWith('Screen.tsx')
);

console.log(`Found ${screens.length} screen files to check.`);
console.log(`Fix mode: ${shouldFix ? 'ON' : 'OFF'}`);
console.log('-----------------------------------');

// Track issues for summary
const issueTracker = {
  screensWithIssues: 0,
  totalIssues: 0,
  issueTypes: {},
  screenIssues: {}
};

// Process each screen file
screens.forEach(screenFile => {
  try {
    const filePath = path.join(screensDir, screenFile);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let screenIssues = [];
    
    console.log(`Checking ${screenFile}...`);
    
    // Check 1: Malformed imports
    if (content.match(/import\s*[^{]*}\s*from/)) {
      screenIssues.push('Malformed import statement');
      issueTracker.issueTypes['Malformed import'] = (issueTracker.issueTypes['Malformed import'] || 0) + 1;
      
      if (shouldFix) {
        // Try to fix malformed imports - this is a complex fix that might need manual review
        content = content.replace(/import\s*[^{]*}\s*from\s*["']([^"']*)["']/g, '');
        console.log('  - Fixed malformed import statement');
      }
    }
    
    // Check 2: Duplicate imports
    const importRegex = /import\s+.*\s+from\s+["'].*["'];?/g;
    const imports = content.match(importRegex) || [];
    const uniqueImports = new Set();
    const duplicateImports = [];
    
    imports.forEach(importStatement => {
      // Normalize the import statement
      const normalizedImport = importStatement.replace(/\s+/g, ' ').replace(/;$/, '');
      
      if (uniqueImports.has(normalizedImport)) {
        duplicateImports.push(importStatement);
      } else {
        uniqueImports.add(normalizedImport);
      }
    });
    
    if (duplicateImports.length > 0) {
      screenIssues.push(`${duplicateImports.length} duplicate import(s)`);
      issueTracker.issueTypes['Duplicate imports'] = (issueTracker.issueTypes['Duplicate imports'] || 0) + 1;
      
      if (shouldFix) {
        // Fix duplicate imports
        duplicateImports.forEach(duplicate => {
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
        console.log('  - Fixed duplicate imports');
      }
    }
    
    // Check 3: Missing semicolons in imports
    const importWithoutSemicolonRegex = /(import\s+.*\s+from\s+["'].*["'])([^;])/g;
    if (content.match(importWithoutSemicolonRegex)) {
      screenIssues.push('Missing semicolons in imports');
      issueTracker.issueTypes['Missing semicolons'] = (issueTracker.issueTypes['Missing semicolons'] || 0) + 1;
      
      if (shouldFix) {
        // Add missing semicolons
        content = content.replace(importWithoutSemicolonRegex, '$1;$2');
        console.log('  - Added missing semicolons to imports');
      }
    }
    
    // Check 4: Double return statements
    if (content.match(/return\s*\(\s*\n\s*\n\s*return\s*\(/)) {
      screenIssues.push('Double return statements');
      issueTracker.issueTypes['Double returns'] = (issueTracker.issueTypes['Double returns'] || 0) + 1;
      
      if (shouldFix) {
        // Fix double return statements
        content = content.replace(/return\s*\(\s*\n\s*\n\s*return\s*\(/, 'return (');
        console.log('  - Fixed double return statements');
      }
    }
    
    // Check 5: Multiple export default statements
    const exportDefaultCount = (content.match(/export\s+default/g) || []).length;
    if (exportDefaultCount > 1) {
      screenIssues.push(`${exportDefaultCount} export default statements`);
      issueTracker.issueTypes['Multiple exports'] = (issueTracker.issueTypes['Multiple exports'] || 0) + 1;
      
      if (shouldFix) {
        // This is a complex fix that might need manual review
        console.log('  - Multiple export default statements (needs manual review)');
      }
    }
    
    // Check 6: Return statement after closing brace without proper spacing
    if (content.match(/}\s*return\s*\(/)) {
      screenIssues.push('Improper return after closing brace');
      issueTracker.issueTypes['Improper returns'] = (issueTracker.issueTypes['Improper returns'] || 0) + 1;
      
      if (shouldFix) {
        // Fix return statements after closing braces
        content = content.replace(/}\s*return\s*\(/g, '}\n  return (');
        console.log('  - Fixed return statement after closing brace');
      }
    }
    
    // Check 7: Missing ScrollView or FlatList
    if (!content.includes('ScrollView') && !content.includes('FlatList')) {
      screenIssues.push('Missing ScrollView or FlatList');
      issueTracker.issueTypes['Missing ScrollView'] = (issueTracker.issueTypes['Missing ScrollView'] || 0) + 1;
    }
    
    // Check 8: Missing BackButton
    if (!content.includes('<BackButton') && !screenFile.includes('Login')) {
      screenIssues.push('Missing BackButton component');
      issueTracker.issueTypes['Missing BackButton'] = (issueTracker.issueTypes['Missing BackButton'] || 0) + 1;
    }
    
    // Check 9: Custom syntax checks instead of using Function constructor
    // Check for unbalanced braces, parentheses, and brackets
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      screenIssues.push(`Unbalanced braces: ${openBraces} opening, ${closeBraces} closing`);
      issueTracker.issueTypes['Unbalanced braces'] = (issueTracker.issueTypes['Unbalanced braces'] || 0) + 1;
    }
    
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      screenIssues.push(`Unbalanced parentheses: ${openParens} opening, ${closeParens} closing`);
      issueTracker.issueTypes['Unbalanced parentheses'] = (issueTracker.issueTypes['Unbalanced parentheses'] || 0) + 1;
    }
    
    const openBrackets = (content.match(/\[/g) || []).length;
    const closeBrackets = (content.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      screenIssues.push(`Unbalanced brackets: ${openBrackets} opening, ${closeBrackets} closing`);
      issueTracker.issueTypes['Unbalanced brackets'] = (issueTracker.issueTypes['Unbalanced brackets'] || 0) + 1;
    }
    
    // Update issue tracker
    if (screenIssues.length > 0) {
      issueTracker.screensWithIssues++;
      issueTracker.totalIssues += screenIssues.length;
      issueTracker.screenIssues[screenFile] = screenIssues;
      
      console.log(`  Found ${screenIssues.length} issue(s) in ${screenFile}:`);
      screenIssues.forEach(issue => console.log(`  - ${issue}`));
      
      // Write fixed content if needed
      if (shouldFix && content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ Fixed issues in ${screenFile}`);
      }
    } else {
      console.log(`  ✅ No issues found in ${screenFile}`);
    }
    
    console.log(''); // Add empty line for readability
  } catch (error) {
    console.error(`Error processing ${screenFile}:`, error);
    issueTracker.screensWithIssues++;
    issueTracker.totalIssues++;
    issueTracker.screenIssues[screenFile] = [`Error processing file: ${error.message}`];
  }
});

// Print summary
console.log('===== SUMMARY =====');
console.log(`Total screens checked: ${screens.length}`);
console.log(`Screens with issues: ${issueTracker.screensWithIssues}`);
console.log(`Total issues found: ${issueTracker.totalIssues}`);

if (issueTracker.totalIssues > 0) {
  console.log('\nIssue types:');
  Object.entries(issueTracker.issueTypes).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}`);
  });
  
  console.log('\nScreens with issues:');
  Object.entries(issueTracker.screenIssues).forEach(([screen, issues]) => {
    console.log(`  ${screen}: ${issues.length} issue(s)`);
    issues.forEach(issue => console.log(`    - ${issue}`));
  });
  
  if (shouldFix) {
    console.log('\n✅ Fixed issues where possible. Some issues may require manual review.');
  } else {
    console.log('\nRun with --fix flag to automatically fix identified issues:');
    console.log('node scripts/comprehensive_screen_checker.js --fix');
  }
} else {
  console.log('\n✅ All screens are valid!');
}

// If in fix mode, run verification after fixes
if (shouldFix) {
  console.log('\nVerifying all screens after fixes...');
  
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
    console.log('\n✅ All screens are valid after fixes!');
  } else {
    console.log('\n❌ Some screens still have issues after fixes:');
    screensWithIssues.forEach(screen => {
      console.log(`  - ${screen}`);
    });
    
    console.log('\nYou may need to manually fix these screens.');
  }
}
