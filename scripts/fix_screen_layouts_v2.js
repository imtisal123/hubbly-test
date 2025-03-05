/**
 * Script to fix layout issues in all screens - Version 2
 * Adds proper padding and ScrollView to prevent back button overlapping
 * This version handles JSX structure more carefully
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const screens = fs.readdirSync(screensDir).filter(file => 
  file.endsWith('Screen.tsx') && 
  !file.includes('LoginSignupScreen') && 
  !file.includes('ProfileCreationScreen') &&
  !file.includes('NationalityScreen')
);

// Process each screen file
screens.forEach(screenFile => {
  const filePath = path.join(screensDir, screenFile);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add ScrollView import if needed
  if (!content.includes('ScrollView')) {
    content = content.replace(
      /import {([^}]+)} from "react-native"/,
      'import {$1, ScrollView} from "react-native"'
    );
  }
  
  // Add BackButton import if needed
  if (!content.includes('import BackButton')) {
    content = content.replace(
      /import {([^}]+)} from "@react-navigation\/native"/,
      'import {$1} from "@react-navigation/native"\nimport BackButton from "../components/BackButton"'
    );
  }
  
  // Fix container style
  content = content.replace(
    /container: {[^}]+}/,
    'container: {\n    flex: 1,\n    backgroundColor: theme.background,\n  }'
  );
  
  // Add scrollContent style if needed
  if (!content.includes('scrollContent')) {
    content = content.replace(
      /container: {[^}]+}/,
      'container: {\n    flex: 1,\n    backgroundColor: theme.background,\n  },\n  scrollContent: {\n    paddingTop: 100,\n    paddingHorizontal: 20,\n  }'
    );
  }
  
  // Check if we need to fix the JSX structure
  if (content.includes('</ScrollView>') && content.includes('</View>')) {
    // Extract the JSX return statement
    const returnMatch = content.match(/return\s*\(\s*<View[^>]*>([\s\S]*?)<\/View>\s*\)\s*}/);
    
    if (returnMatch) {
      const viewContent = returnMatch[1];
      
      // Check if there's a ScrollView that's incorrectly placed
      if (viewContent.includes('</ScrollView>')) {
        // Extract all the content between the View opening and closing tags
        const cleanedContent = viewContent
          .replace(/<ScrollView[^>]*>[\s\S]*?<\/ScrollView>/g, '') // Remove any existing ScrollView
          .replace(/<BackButton[^\/]*\/>/g, '<BackButton />'); // Keep the BackButton
        
        // Build the proper structure
        const contentWithoutBackButton = cleanedContent.replace(/<BackButton[^\/]*\/>\s*/g, '');
        
        const newContent = `
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
${contentWithoutBackButton.trim()}
      </ScrollView>
    </View>
  )
}`;
        
        // Replace the old return statement with the new one
        content = content.replace(/return\s*\(\s*<View[^>]*>[\s\S]*?<\/View>\s*\)\s*}/g, newContent);
      }
    }
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed layout in ${screenFile}`);
});

console.log('Layout fixes completed!');
