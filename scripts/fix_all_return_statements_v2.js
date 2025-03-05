/**
 * Script to fix all return statement issues in screen files
 * This script takes a direct approach by adding missing return statements and fixing syntax
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
    
    // Fix missing return statement pattern
    const missingReturnPattern = /(\s+)(<View style={styles\.container}>[\s\S]*?<\/View>\s*\))/g;
    if (content.match(missingReturnPattern)) {
      content = content.replace(missingReturnPattern, '$1return ($2');
      modified = true;
    }
    
    // Fix missing closing brace for early returns
    if (content.includes('if (') && content.includes('return (')) {
      const earlyReturnPattern = /(if\s*\([^)]*\)\s*{\s*return\s*\([^]*?\)\s*)(}[\s\n]*[^}])/g;
      if (content.match(earlyReturnPattern)) {
        content = content.replace(earlyReturnPattern, '$1}\n  $2');
        modified = true;
      }
    }
    
    // Fix double return statements
    const doubleReturnPattern = /return\s*\(\s*return\s*\(/g;
    if (content.match(doubleReturnPattern)) {
      content = content.replace(doubleReturnPattern, 'return (');
      modified = true;
    }
    
    // Fix missing closing brace at the end of component
    const missingClosingBracePattern = /(\)\s*\n\s*\}\s*\n\s*const styles)/g;
    if (content.match(missingClosingBracePattern)) {
      content = content.replace(missingClosingBracePattern, ')\n  }\n}\n\nconst styles');
      modified = true;
    }
    
    // Fix FatherDetailsScreen specific issue with early return
    if (screenFile === 'FatherDetailsScreen.tsx') {
      // Find the if statement with early return
      const earlyReturnMatch = content.match(/(if\s*\(!route\.params\.fatherAlive\)\s*{\s*return\s*\()([^]*?)(\)\s*\})/);
      if (earlyReturnMatch) {
        // Extract the early return JSX
        const earlyReturnJSX = earlyReturnMatch[2];
        
        // Find the main return statement
        const mainReturnMatch = content.match(/(\s+)(<View style={styles\.container}>[\s\S]*?<\/View>\s*\))/);
        if (mainReturnMatch) {
          // Replace the entire component structure
          const componentStart = content.match(/(const FatherDetailsScreen = \(\) => {[\s\S]*?)(if\s*\(!route\.params\.fatherAlive\))/)[1];
          const componentEnd = content.match(/(<\/View>\s*\)\s*\}\s*\n\s*const styles)/)[1];
          
          // Reconstruct the component with proper conditional rendering
          const newComponentStructure = `${componentStart}
  const handleNext = () => {
    if (!maritalStatus || !cityOfResidence) {
      alert("Please fill in all required fields.")
      return
    }

    navigation.navigate("FatherAdditionalInfo", {
      ...route.params,
      fatherMaritalStatus: maritalStatus,
      fatherCityOfResidence: cityOfResidence,
      fatherAreaOfResidence: areaOfResidence,
    })
  }

  if (!route.params.fatherAlive) {
    return (
      <View style={styles.container}>
        <BackButton />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ProgressBar currentStep={1} totalSteps={7} />
          <Text style={styles.title}>Father Details</Text>
          <Text style={styles.subtitle}>Your father has passed away. We're sorry for your loss.</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MotherDetails", route.params)}>
            <Text style={styles.buttonText}>Continue to Mother's Details</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={1} totalSteps={7} />
        <Text style={styles.title}>Father's Details</Text>
        
        <Text style={styles.label}>Marital Status</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowMaritalStatusPicker(true)}>
          <Text>{maritalStatus || "Select marital status"}</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>City of Residence</Text>
        <TextInput
          style={styles.input}
          value={cityOfResidence}
          onChangeText={setCityOfResidence}
          placeholder="Enter city of residence"
        />
        
        <Text style={styles.label}>Area of Residence</Text>
        <TextInput
          style={styles.input}
          value={areaOfResidence}
          onChangeText={setAreaOfResidence}
          placeholder="Enter area of residence (optional)"
        />
        
        <PickerModal
          visible={showMaritalStatusPicker}
          onClose={() => setShowMaritalStatusPicker(false)}
          onSelect={(value) => setMaritalStatus(value)}
          options={[
            { label: "Single", value: "Single" },
            { label: "Married", value: "Married" },
            { label: "Divorced", value: "Divorced" },
            { label: "Widowed", value: "Widowed" },
          ]}
          selectedValue={maritalStatus}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles`;
          
          content = content.replace(/(const FatherDetailsScreen = \(\) => {[\s\S]*?)(const styles)/, newComponentStructure);
          modified = true;
        }
      }
    } else {
      // For all other screens, ensure there's a proper return statement
      const missingMainReturnPattern = /(\s+const handleNext[\s\S]*?)(\s+<View style={styles\.container}>)/g;
      if (content.match(missingMainReturnPattern)) {
        content = content.replace(missingMainReturnPattern, '$1\n  return ($2');
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
  } catch (error) {
    console.error(`Error processing ${screenFile}:`, error.message);
  }
});

console.log('All screens checked and fixed!');
