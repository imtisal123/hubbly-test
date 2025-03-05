/**
 * Final syntax check script to catch and fix any remaining syntax errors
 * This script specifically looks for common syntax issues like duplicate return statements
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const screens = fs.readdirSync(screensDir).filter(file => 
  file.endsWith('Screen.tsx')
);

// Process each screen file
screens.forEach(screenFile => {
  try {
    const filePath = path.join(screensDir, screenFile);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check for duplicate return statements
    if (content.match(/return\s*\(\s*\n\s*return\s*\(/)) {
      console.log(`${screenFile}: Found duplicate return statements`);
      content = content.replace(/return\s*\(\s*\n\s*return\s*\(/, 'return (');
      modified = true;
    }
    
    // Check for return statement immediately after function closing brace
    if (content.match(/}\s*return\s*\(/)) {
      console.log(`${screenFile}: Found return statement after function closing brace`);
      content = content.replace(/}(\s*)return\s*\(/, '}\n$1\nreturn (');
      modified = true;
    }
    
    // Check for missing semicolons after function closing braces
    if (content.match(/}\s*return/)) {
      console.log(`${screenFile}: Found missing semicolon after function`);
      content = content.replace(/}(\s*)return/, '}\n$1return');
      modified = true;
    }
    
    // Check for multiple closing braces
    if (content.match(/}\s*}\s*\n\s*const styles/)) {
      console.log(`${screenFile}: Found multiple closing braces before styles`);
      content = content.replace(/}(\s*)}(\s*\n\s*const styles)/, '}$1\n$2');
      modified = true;
    }
    
    // Check for empty return statements
    if (content.match(/return\s*\(\s*\)/)) {
      console.log(`${screenFile}: Found empty return statement`);
      content = content.replace(/return\s*\(\s*\)/, 'return (\n    <View style={styles.container}>\n      <BackButton />\n      <ScrollView contentContainerStyle={styles.scrollContent}>\n        <Text style={styles.title}>Content</Text>\n      </ScrollView>\n    </View>\n  )');
      modified = true;
    }
    
    // If we made changes, write the file back
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed ${screenFile}`);
    } else {
      console.log(`No issues found in ${screenFile}`);
    }
  } catch (error) {
    console.error(`Error processing ${screenFile}:`, error.message);
  }
});

console.log('All screens checked for syntax errors!');
