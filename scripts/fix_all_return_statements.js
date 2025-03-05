/**
 * Script to fix all return statement issues in screen files
 * This script takes a more direct approach by completely rewriting the component structure
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
  
  // Extract imports and other code before the component
  const beforeComponentMatch = content.match(/([\s\S]*?)(export default function|const \w+Screen)/);
  if (!beforeComponentMatch) {
    console.log(`${screenFile}: Could not find component declaration`);
    return;
  }
  
  const beforeComponent = beforeComponentMatch[1];
  
  // Check if it's a function component or arrow function
  const isFunctionComponent = content.includes('export default function');
  
  // Extract component name
  const componentNameMatch = isFunctionComponent 
    ? content.match(/export default function (\w+)\(\)/)
    : content.match(/const (\w+Screen)/);
  
  if (!componentNameMatch) {
    console.log(`${screenFile}: Could not extract component name`);
    return;
  }
  
  const componentName = componentNameMatch[1];
  
  // Extract the component body
  const componentBodyMatch = isFunctionComponent
    ? content.match(/export default function \w+\(\)\s*{([\s\S]*?)const styles/m)
    : content.match(/const \w+Screen\s*=\s*\(\s*\)\s*=>\s*{([\s\S]*?)const styles/m);
  
  if (!componentBodyMatch) {
    console.log(`${screenFile}: Could not extract component body`);
    return;
  }
  
  let componentBody = componentBodyMatch[1];
  
  // Extract styles and everything after
  const stylesAndAfterMatch = content.match(/(const styles[\s\S]*$)/);
  if (!stylesAndAfterMatch) {
    console.log(`${screenFile}: Could not extract styles`);
    return;
  }
  
  const stylesAndAfter = stylesAndAfterMatch[1];
  
  // Extract navigation and route setup
  const navigationSetupMatch = componentBody.match(/([\s\S]*?)(<View style={styles\.container})/);
  if (!navigationSetupMatch) {
    console.log(`${screenFile}: Could not extract navigation setup`);
    return;
  }
  
  const navigationSetup = navigationSetupMatch[1];
  
  // Extract JSX content
  const jsxMatch = componentBody.match(/<View style={styles\.container}[\s\S]*?<\/View>\s*\)/);
  if (!jsxMatch) {
    console.log(`${screenFile}: Could not extract JSX content`);
    return;
  }
  
  let jsx = jsxMatch[0];
  
  // Reconstruct the component with proper return statement
  let newComponentBody;
  if (isFunctionComponent) {
    newComponentBody = `export default function ${componentName}() {${navigationSetup}  return (
${jsx}
}`;
  } else {
    newComponentBody = `const ${componentName} = () => {${navigationSetup}  return (
${jsx}
}`;
  }
  
  // Reconstruct the full file content
  const newContent = `${beforeComponent}${newComponentBody}

${stylesAndAfter}`;
  
  // Write the new content back to the file
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Fixed ${screenFile}`);
});

console.log('All screens fixed!');
