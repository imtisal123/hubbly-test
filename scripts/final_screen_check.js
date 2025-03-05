/**
 * Final check script to ensure all screens have proper syntax
 * This is a more thorough check that specifically looks for missing return statements
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const screens = fs.readdirSync(screensDir).filter(file => 
  file.endsWith('Screen.tsx')
);

let allFixed = true;

// Process each screen file
screens.forEach(screenFile => {
  const filePath = path.join(screensDir, screenFile);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check for function component style
  const functionComponentMatch = content.match(/export\s+default\s+function\s+\w+Screen\(\)\s*{([\s\S]*?)}/);
  if (functionComponentMatch) {
    const componentBody = functionComponentMatch[1];
    
    // If there's JSX without a return statement
    if (componentBody.includes('<View') && !componentBody.includes('return')) {
      console.log(`${screenFile}: Missing return statement in function component`);
      
      // Find the JSX section and add return
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
  
  // Check for arrow function component style
  const arrowComponentMatch = content.match(/const\s+\w+Screen\s*=\s*\(\s*\)\s*=>\s*{([\s\S]*?)}/);
  if (arrowComponentMatch) {
    const componentBody = arrowComponentMatch[1];
    
    // If there's JSX without a return statement
    if (componentBody.includes('<View') && !componentBody.includes('return')) {
      console.log(`${screenFile}: Missing return statement in arrow function component`);
      
      // Find the JSX section and add return
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
  
  // If we made changes, write the file back
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${screenFile}`);
    allFixed = false;
  }
});

if (allFixed) {
  console.log('All screens are properly formatted!');
} else {
  console.log('Some screens were fixed. Please restart the app.');
}
