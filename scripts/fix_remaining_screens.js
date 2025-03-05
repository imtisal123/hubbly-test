/**
 * Script to fix any remaining screens with missing return statements or empty content
 * This is a more aggressive fix that manually checks and restores content
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
  
  // Check for empty ScrollView
  if (content.includes('<ScrollView') && content.includes('</ScrollView>')) {
    const emptyScrollViewMatch = content.match(/<ScrollView[^>]*>\s*<\/ScrollView>/);
    if (emptyScrollViewMatch) {
      console.log(`${screenFile}: Empty ScrollView detected, attempting to restore content`);
      
      // For each screen type, add appropriate content
      if (screenFile === 'EducationScreen.tsx') {
        content = content.replace(
          /<ScrollView[^>]*>\s*<\/ScrollView>/,
          `<ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={4} totalSteps={7} />
        <Text style={styles.title}>Education Details</Text>
        
        <Text style={styles.label}>Highest Education Level</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowEducationPicker(true)}>
          <Text>{educationLevel || "Select education level"}</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>Institution</Text>
        <TextInput
          style={styles.input}
          value={institution}
          onChangeText={setInstitution}
          placeholder="Enter institution name"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>`
        );
        modified = true;
      } else if (screenFile === 'LocationScreen.tsx') {
        content = content.replace(
          /<ScrollView[^>]*>\s*<\/ScrollView>/,
          `<ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={3} totalSteps={7} />
        <Text style={styles.title}>Location Details</Text>
        
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter city"
        />
        
        <Text style={styles.label}>Area</Text>
        <TextInput
          style={styles.input}
          value={area}
          onChangeText={setArea}
          placeholder="Enter area"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>`
        );
        modified = true;
      } else {
        // Generic content for other screens
        content = content.replace(
          /<ScrollView[^>]*>\s*<\/ScrollView>/,
          `<ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={1} totalSteps={7} />
        <Text style={styles.title}>${screenFile.replace('Screen.tsx', '')}</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleNext || (() => navigation.navigate("Home"))}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>`
        );
        modified = true;
      }
    }
  }
  
  // If we made changes, write the file back
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${screenFile}`);
  }
});

console.log('All screens checked and fixed!');
