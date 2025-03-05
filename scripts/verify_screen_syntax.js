/**
 * Script to verify and fix common syntax issues in screen files
 * Specifically checks for missing return statements and proper JSX structure
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const screens = fs.readdirSync(screensDir).filter(file => 
  file.endsWith('Screen.tsx')
);

// Process each screen file
screens.forEach(screenFile => {
  const filePath = path.join(screensDir, screenFile);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check for missing return statement
  const componentMatch = content.match(/const\s+\w+Screen\s*=\s*\(\s*\)\s*=>\s*{([\s\S]*?)}/);
  if (componentMatch) {
    const componentBody = componentMatch[1];
    
    // If there's JSX without a return statement
    if (componentBody.includes('<View') && !componentBody.includes('return')) {
      console.log(`${screenFile}: Missing return statement`);
      
      // Find the JSX section
      const jsxMatch = componentBody.match(/(\s*)<View([\s\S]*?)<\/View>\s*\)/);
      if (jsxMatch) {
        const indentation = jsxMatch[1];
        const jsxContent = jsxMatch[0];
        
        // Replace with proper return statement
        const fixedContent = componentBody.replace(
          jsxContent,
          `${indentation}return (${jsxContent}`
        );
        
        content = content.replace(componentBody, fixedContent);
        modified = true;
      }
    }
  }
  
  // Check for ScrollView without content
  if (content.includes('<ScrollView') && content.includes('</ScrollView>')) {
    const emptyScrollViewMatch = content.match(/<ScrollView[^>]*>\s*<\/ScrollView>/);
    if (emptyScrollViewMatch) {
      console.log(`${screenFile}: Empty ScrollView`);
      
      // Try to find the original content that should be inside the ScrollView
      const originalContentMatch = content.match(/congratsText|instructionText|iconContainer|buttonContainer/);
      if (originalContentMatch) {
        // This is a more complex fix that would require analyzing the file structure
        console.log(`  - Please manually check ${screenFile} for content that should be inside ScrollView`);
      }
    }
  }
  
  // If we made changes, write the file back
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed syntax in ${screenFile}`);
  }
});

console.log('Syntax verification completed!');
