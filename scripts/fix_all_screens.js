/**
 * Script to fix all screens in the app
 * - Adds proper return statements
 * - Fixes ScrollView structure
 * - Ensures consistent layout
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
  
  // 1. Fix missing return statements
  if (content.match(/const\s+\w+Screen\s*=\s*\(\s*\)\s*=>\s*{[\s\S]*?<View[\s\S]*?<\/View>\s*\)\s*}/)) {
    const missingReturnMatch = content.match(/const\s+\w+Screen\s*=\s*\(\s*\)\s*=>\s*{([\s\S]*?)(\s*<View[\s\S]*?<\/View>\s*\)\s*})/);
    if (missingReturnMatch && !missingReturnMatch[1].includes('return')) {
      console.log(`${screenFile}: Adding missing return statement`);
      content = content.replace(
        missingReturnMatch[0],
        `const ${screenFile.replace('.tsx', '')} = () => {${missingReturnMatch[1]}  return (${missingReturnMatch[2]}`
      );
      modified = true;
    }
  }
  
  // 2. Fix ScrollView structure
  if (content.includes('<ScrollView') && content.includes('</ScrollView>')) {
    // Check for improperly nested content
    const scrollViewMatch = content.match(/<ScrollView[^>]*>([\s\S]*?)<\/ScrollView>/);
    if (scrollViewMatch) {
      const scrollViewContent = scrollViewMatch[1];
      
      // If content is not properly indented or has weird spacing
      if (scrollViewContent.includes('<Text') && !scrollViewContent.match(/^\s*<Text/m)) {
        console.log(`${screenFile}: Fixing ScrollView content structure`);
        
        // Extract all the content between the ScrollView tags
        const cleanedContent = scrollViewContent
          .replace(/^\s*</gm, '        <')  // Fix indentation
          .replace(/\n\s*\n/g, '\n')        // Remove extra blank lines
          .trim();
        
        // Replace the old ScrollView content with properly formatted content
        content = content.replace(
          /<ScrollView[^>]*>[\s\S]*?<\/ScrollView>/,
          `<ScrollView contentContainerStyle={styles.scrollContent}>\n        ${cleanedContent}\n      </ScrollView>`
        );
        modified = true;
      }
    }
  }
  
  // 3. Add scrollContent style if missing
  if (!content.includes('scrollContent')) {
    const styleMatch = content.match(/const styles = StyleSheet\.create\(\{\s*container: \{[^}]*\},/);
    if (styleMatch) {
      console.log(`${screenFile}: Adding scrollContent style`);
      content = content.replace(
        styleMatch[0],
        `const styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    backgroundColor: theme.background,\n  },\n  scrollContent: {\n    paddingTop: 100,\n    paddingHorizontal: 20,\n  },`
      );
      modified = true;
    }
  }
  
  // 4. Fix BackButton import if missing
  if (!content.includes('import BackButton')) {
    console.log(`${screenFile}: Adding BackButton import`);
    content = content.replace(
      /import {([^}]+)} from "@react-navigation\/native"/,
      'import {$1} from "@react-navigation/native"\nimport BackButton from "../components/BackButton"'
    );
    modified = true;
  }
  
  // 5. Add BackButton if missing
  if (!content.includes('<BackButton')) {
    const viewMatch = content.match(/<View style={styles\.container}>/);
    if (viewMatch) {
      console.log(`${screenFile}: Adding BackButton component`);
      content = content.replace(
        viewMatch[0],
        `<View style={styles.container}>\n      <BackButton />`
      );
      modified = true;
    }
  }
  
  // If we made changes, write the file back
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${screenFile}`);
  } else {
    console.log(`No changes needed for ${screenFile}`);
  }
});

console.log('All screens fixed!');
