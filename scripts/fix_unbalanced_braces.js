/**
 * Script to fix unbalanced braces, parentheses, and brackets in screen files
 * This script will analyze each screen file and report any imbalances
 * It can also attempt to fix simple cases automatically
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
let screensWithIssues = 0;
let totalIssuesFixed = 0;

// Process each screen file
screens.forEach(screenFile => {
  try {
    const filePath = path.join(screensDir, screenFile);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let screenIssues = [];
    
    console.log(`Checking ${screenFile}...`);
    
    // Check for unbalanced braces
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      screenIssues.push(`Unbalanced braces: ${openBraces} opening, ${closeBraces} closing`);
      
      if (shouldFix) {
        // Try to fix unbalanced braces
        if (openBraces > closeBraces) {
          // Missing closing braces
          const missingCount = openBraces - closeBraces;
          
          // Add closing braces at the end of the file
          content += '\n' + '}'.repeat(missingCount) + '\n';
          console.log(`  - Added ${missingCount} missing closing brace(s)`);
          totalIssuesFixed++;
        } else {
          // Missing opening braces - this is harder to fix automatically
          console.log(`  - Found ${closeBraces - openBraces} extra closing brace(s) - needs manual review`);
        }
      }
    }
    
    // Check for unbalanced parentheses
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    
    if (openParens !== closeParens) {
      screenIssues.push(`Unbalanced parentheses: ${openParens} opening, ${closeParens} closing`);
      
      if (shouldFix) {
        // Try to fix unbalanced parentheses
        if (openParens > closeParens) {
          // Missing closing parentheses
          const missingCount = openParens - closeParens;
          
          // Look for return statements without closing parenthesis
          const returnRegex = /return\s*\([^)]*$/gm;
          const matches = content.match(returnRegex);
          
          if (matches && matches.length > 0) {
            // Fix return statements without closing parenthesis
            content = content.replace(returnRegex, match => match + ')');
            console.log(`  - Fixed ${matches.length} return statement(s) missing closing parenthesis`);
            totalIssuesFixed++;
          } else {
            // Add closing parentheses at the end of the file
            content += '\n' + ')'.repeat(missingCount) + '\n';
            console.log(`  - Added ${missingCount} missing closing parenthesis/es`);
            totalIssuesFixed++;
          }
        } else {
          // Missing opening parentheses - this is harder to fix automatically
          console.log(`  - Found ${closeParens - openParens} extra closing parenthesis/es - needs manual review`);
        }
      }
    }
    
    // Check for unbalanced brackets
    const openBrackets = (content.match(/\[/g) || []).length;
    const closeBrackets = (content.match(/\]/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      screenIssues.push(`Unbalanced brackets: ${openBrackets} opening, ${closeBrackets} closing`);
      
      if (shouldFix) {
        // Try to fix unbalanced brackets
        if (openBrackets > closeBrackets) {
          // Missing closing brackets
          const missingCount = openBrackets - closeBrackets;
          
          // Add closing brackets at the end of the file
          content += '\n' + ']'.repeat(missingCount) + '\n';
          console.log(`  - Added ${missingCount} missing closing bracket(s)`);
          totalIssuesFixed++;
        } else {
          // Missing opening brackets - this is harder to fix automatically
          console.log(`  - Found ${closeBrackets - openBrackets} extra closing bracket(s) - needs manual review`);
        }
      }
    }
    
    // Update issue tracker and write fixed content if needed
    if (screenIssues.length > 0) {
      screensWithIssues++;
      
      console.log(`  Found ${screenIssues.length} issue(s) in ${screenFile}:`);
      screenIssues.forEach(issue => console.log(`  - ${issue}`));
      
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
  }
});

// Print summary
console.log('===== SUMMARY =====');
console.log(`Total screens checked: ${screens.length}`);
console.log(`Screens with issues: ${screensWithIssues}`);

if (shouldFix) {
  console.log(`Total issues fixed: ${totalIssuesFixed}`);
  console.log('\n✅ Fixed issues where possible. Some issues may require manual review.');
  
  // Run verification to ensure all screens are valid
  console.log('\nVerifying all screens after fixes...');
  
  let allValid = true;
  let screensWithIssues = [];
  
  screens.forEach(screenFile => {
    try {
      const filePath = path.join(screensDir, screenFile);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for unbalanced braces
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      
      // Check for unbalanced parentheses
      const openParens = (content.match(/\(/g) || []).length;
      const closeParens = (content.match(/\)/g) || []).length;
      
      // Check for unbalanced brackets
      const openBrackets = (content.match(/\[/g) || []).length;
      const closeBrackets = (content.match(/\]/g) || []).length;
      
      if (openBraces === closeBraces && openParens === closeParens && openBrackets === closeBrackets) {
        console.log(`✅ ${screenFile} is valid`);
      } else {
        console.log(`❌ ${screenFile} still has issues:`);
        if (openBraces !== closeBraces) {
          console.log(`  - Unbalanced braces: ${openBraces} opening, ${closeBraces} closing`);
        }
        if (openParens !== closeParens) {
          console.log(`  - Unbalanced parentheses: ${openParens} opening, ${closeParens} closing`);
        }
        if (openBrackets !== closeBrackets) {
          console.log(`  - Unbalanced brackets: ${openBrackets} opening, ${closeBrackets} closing`);
        }
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
} else {
  console.log('\nRun with --fix flag to automatically fix identified issues:');
  console.log('node scripts/fix_unbalanced_braces.js --fix');
}
