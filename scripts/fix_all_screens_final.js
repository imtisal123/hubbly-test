/**
 * Final comprehensive script to fix all screen issues at once
 * This script completely rewrites each screen file with proper structure
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
    
    // Skip files that are already properly structured
    if (content.includes('export default') && content.includes('return (') && !content.match(/\s+<View[\s\S]*?\)\s*$/m)) {
      console.log(`${screenFile}: Already properly structured, skipping`);
      return;
    }
    
    // Extract imports
    const importsMatch = content.match(/([\s\S]*?)(export default function|const \w+Screen|export default)/);
    if (!importsMatch) {
      console.log(`${screenFile}: Could not find imports section, skipping`);
      return;
    }
    
    const imports = importsMatch[1];
    
    // Determine component type (function, arrow function, or default export)
    let componentType = 'function';
    let componentName = screenFile.replace('.tsx', '');
    
    if (content.includes('export default function')) {
      componentType = 'function';
      const nameMatch = content.match(/export default function (\w+)/);
      if (nameMatch) componentName = nameMatch[1];
    } else if (content.includes('const') && content.includes('= () =>')) {
      componentType = 'arrow';
      const nameMatch = content.match(/const (\w+)/);
      if (nameMatch) componentName = nameMatch[1];
    } else if (content.includes('export default')) {
      componentType = 'default';
    }
    
    // Extract state and handlers
    const stateAndHandlersMatch = content.match(/(const navigation|const route|const \[|useEffect|const handle\w+)/);
    let stateAndHandlers = '';
    
    if (stateAndHandlersMatch) {
      const startIndex = content.indexOf(stateAndHandlersMatch[1]);
      const endIndex = content.indexOf('<View style={styles.container', startIndex);
      
      if (endIndex > startIndex) {
        stateAndHandlers = content.substring(startIndex, endIndex);
      }
    }
    
    // Extract JSX content
    const jsxMatch = content.match(/<View style={styles\.container}[\s\S]*?<\/View>/);
    let jsx = '';
    
    if (jsxMatch) {
      jsx = jsxMatch[0];
    } else {
      // Create a basic structure if no JSX found
      jsx = `<View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>${componentName}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>`;
    }
    
    // Extract styles
    const stylesMatch = content.match(/(const styles = StyleSheet\.create\({[\s\S]*?)(\}\))/);
    let styles = '';
    
    if (stylesMatch) {
      styles = stylesMatch[0];
    } else {
      // Create basic styles if none found
      styles = `const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: theme.primaryDark,
  },
  button: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: theme.white,
    fontSize: 16,
    fontWeight: "bold",
  },
})`;
    }
    
    // Reconstruct the file with proper structure
    let newContent = '';
    
    if (componentType === 'function') {
      newContent = `${imports}
export default function ${componentName}() {
  ${stateAndHandlers.trim()}
  
  return (
    ${jsx}
  )
}

${styles}`;
    } else if (componentType === 'arrow') {
      newContent = `${imports}
const ${componentName} = () => {
  ${stateAndHandlers.trim()}
  
  return (
    ${jsx}
  )
}

${styles}

export default ${componentName}`;
    } else {
      newContent = `${imports}
function ${componentName}() {
  ${stateAndHandlers.trim()}
  
  return (
    ${jsx}
  )
}

${styles}

export default ${componentName}`;
    }
    
    // Write the new content back to the file
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed ${screenFile}`);
  } catch (error) {
    console.error(`Error processing ${screenFile}:`, error.message);
  }
});

console.log('All screens fixed!');
