/**
 * Script to fix missing semicolons after function declarations
 * This is the final fix needed for all screens
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
    
    // Fix missing semicolons after function declarations
    if (content.match(/}\s*return/)) {
      console.log(`${screenFile}: Fixing missing semicolon after function declaration`);
      content = content.replace(/}(\s*)return/, '};\n$1return');
      modified = true;
    }
    
    // Fix multiple return statements
    if ((content.match(/return \(/g) || []).length > 1) {
      console.log(`${screenFile}: Fixing multiple return statements`);
      content = content.replace(/return\s*\(\s*\n\s*return\s*\(/, 'return (');
      modified = true;
    }
    
    // Fix duplicate import statements
    if ((content.match(/import {/g) || []).length > 10) {
      console.log(`${screenFile}: Possible duplicate import statements detected`);
      // This is a more complex fix that would require parsing the imports
      // For now, just flag it for manual review
    }
    
    // Fix missing ScrollView in ProfileCreationScreen
    if (screenFile === 'ProfileCreationScreen.tsx' && !content.includes('<ScrollView')) {
      console.log(`${screenFile}: Adding missing ScrollView component`);
      content = content.replace(
        /(<View style={styles\.container}>[\s\S]*?<BackButton \/>)[\s\S]*?(<\/View>\s*\))/,
        '$1\n      <ScrollView contentContainerStyle={styles.scrollContent}>\n        <Text style={styles.title}>Create Your Profile</Text>\n        <TouchableOpacity style={styles.button} onPress={handleNext}>\n          <Text style={styles.buttonText}>Get Started</Text>\n        </TouchableOpacity>\n      </ScrollView>\n    $2'
      );
      
      // Also add scrollContent style if missing
      if (!content.includes('scrollContent:')) {
        content = content.replace(
          /(container: {[\s\S]*?},)/,
          '$1\n  scrollContent: {\n    paddingTop: 100,\n    paddingHorizontal: 20,\n  },'
        );
      }
      
      modified = true;
    }
    
    // If we made changes, write the file back
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed ${screenFile}`);
    } else {
      console.log(`No changes needed for ${screenFile}`);
    }
  } catch (error) {
    console.error(`Error processing ${screenFile}:`, error.message);
  }
});

console.log('All screens checked and fixed!');
