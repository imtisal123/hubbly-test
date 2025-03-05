/**
 * Script to check for unbalanced braces, parentheses, and brackets in all screen files
 */
const fs = require('fs');
const path = require('path');

// Get all screen files
const screensDir = path.join(__dirname, '..', 'screens');
const screenFiles = fs.readdirSync(screensDir)
  .filter(file => file.endsWith('.tsx') || file.endsWith('.js'));

console.log(`Found ${screenFiles.length} screen files to check.`);

// Function to check for unbalanced braces, parentheses, and brackets
function checkBalanced(code) {
  const stack = [];
  const pairs = {
    '{': '}',
    '(': ')',
    '[': ']'
  };
  
  // Track line numbers for better error reporting
  let lineNum = 1;
  const errorPositions = [];
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    
    // Count line numbers
    if (char === '\n') {
      lineNum++;
      continue;
    }
    
    // Check for opening brackets
    if ('{(['.includes(char)) {
      stack.push({ char, line: lineNum, pos: i });
    }
    
    // Check for closing brackets
    else if ('})]'.includes(char)) {
      if (stack.length === 0) {
        errorPositions.push({ error: `Extra closing ${char} at line ${lineNum}`, line: lineNum });
        continue;
      }
      
      const last = stack.pop();
      if (pairs[last.char] !== char) {
        errorPositions.push({ 
          error: `Mismatched bracket at line ${lineNum}: expected ${pairs[last.char]} but found ${char}`,
          line: lineNum,
          openingLine: last.line
        });
      }
    }
  }
  
  // Check if there are any unclosed brackets
  if (stack.length > 0) {
    stack.forEach(item => {
      errorPositions.push({ 
        error: `Unclosed ${item.char} at line ${item.line}`,
        line: item.line
      });
    });
  }
  
  return errorPositions;
}

// Function to check if there are any return statements not followed by a semicolon or parenthesis
function checkReturnStatements(code) {
  const lines = code.split('\n');
  const errors = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for return statements that aren't followed by ( or ;
    if (line === 'return' || (line.startsWith('return ') && !line.endsWith(';') && !line.endsWith('('))) {
      // Check if the next line starts with a JSX component
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      if (nextLine.startsWith('<')) {
        // This is likely a JSX return without parentheses
        errors.push({
          error: `Return statement without parentheses at line ${i + 1}`,
          line: i + 1
        });
      }
    }
  }
  
  return errors;
}

// Function to check for JSX fragments without proper closing
function checkJSXFragments(code) {
  const lines = code.split('\n');
  const errors = [];
  let inJSXFragment = false;
  let fragmentStartLine = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.includes('<>') && !line.includes('</>')) {
      inJSXFragment = true;
      fragmentStartLine = i + 1;
    } else if (line.includes('</>') && !line.includes('<>')) {
      if (!inJSXFragment) {
        errors.push({
          error: `Closing JSX fragment without opening at line ${i + 1}`,
          line: i + 1
        });
      }
      inJSXFragment = false;
    }
  }
  
  if (inJSXFragment) {
    errors.push({
      error: `Unclosed JSX fragment starting at line ${fragmentStartLine}`,
      line: fragmentStartLine
    });
  }
  
  return errors;
}

// Check each file
let filesWithErrors = 0;
let totalErrors = 0;

screenFiles.forEach(file => {
  const filePath = path.join(screensDir, file);
  const code = fs.readFileSync(filePath, 'utf8');
  
  const balanceErrors = checkBalanced(code);
  const returnErrors = checkReturnStatements(code);
  const jsxFragmentErrors = checkJSXFragments(code);
  
  const allErrors = [...balanceErrors, ...returnErrors, ...jsxFragmentErrors];
  
  if (allErrors.length > 0) {
    console.log(`\nIssues found in ${file}:`);
    allErrors.forEach(error => {
      console.log(`  - ${error.error}`);
    });
    
    filesWithErrors++;
    totalErrors += allErrors.length;
  } else {
    console.log(`✅ No issues found in ${file}`);
  }
});

console.log(`\n===== SUMMARY =====`);
console.log(`Total screens checked: ${screenFiles.length}`);
console.log(`Screens with issues: ${filesWithErrors}`);
console.log(`Total issues found: ${totalErrors}`);

if (filesWithErrors === 0) {
  console.log(`\n✅ All screens are balanced and properly formatted!`);
} else {
  console.log(`\n❌ Found issues in ${filesWithErrors} screens. Please fix them manually.`);
}
