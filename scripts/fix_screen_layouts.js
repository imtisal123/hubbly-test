/**
 * Script to fix layout issues in all screens
 * Adds proper padding and ScrollView to prevent back button overlapping
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const screens = fs.readdirSync(screensDir).filter(file => 
  file.endsWith('Screen.tsx') && 
  !file.includes('LoginSignupScreen') && 
  !file.includes('ProfileCreationScreen') &&
  !file.includes('NationalityScreen') &&
  !file.includes('ParentStatusCheckScreen') &&
  !file.includes('FatherDetailsScreen') &&
  !file.includes('MotherDetailsScreen') &&
  !file.includes('SiblingCountScreen') &&
  !file.includes('FinalCongratsScreen')
);

// Process each screen file
screens.forEach(screenFile => {
  const filePath = path.join(screensDir, screenFile);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file already has the ScrollView with proper padding
  if (content.includes('paddingTop: 100') && content.includes('scrollContent')) {
    console.log(`${screenFile} already fixed, skipping...`);
    return;
  }
  
  // Add ScrollView import if needed
  if (!content.includes('ScrollView')) {
    content = content.replace(
      /import {([^}]+)} from "react-native"/,
      'import {$1, ScrollView} from "react-native"'
    );
  }
  
  // Add BackButton import if needed
  if (!content.includes('BackButton')) {
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
  
  // Add scrollContent style
  if (!content.includes('scrollContent')) {
    content = content.replace(
      /container: {[^}]+}/,
      'container: {\n    flex: 1,\n    backgroundColor: theme.background,\n  },\n  scrollContent: {\n    paddingTop: 100,\n    paddingHorizontal: 20,\n  }'
    );
  }
  
  // Fix the return statement to use ScrollView
  content = content.replace(
    /<View style={styles\.container}>\s*<BackButton \/>([^<]*)<([^>]+)>/,
    '<View style={styles.container}>\n      <BackButton />\n      <ScrollView contentContainerStyle={styles.scrollContent}>\n        <$2>'
  );
  
  // If there's no BackButton, add it
  if (!content.includes('<BackButton />')) {
    content = content.replace(
      /<View style={styles\.container}>/,
      '<View style={styles.container}>\n      <BackButton />'
    );
  }
  
  // Close the ScrollView properly
  content = content.replace(
    /<\/View>\s*\)\s*}/,
    '</ScrollView>\n    </View>\n  )\n}'
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed layout in ${screenFile}`);
});

console.log('Layout fixes completed!');
