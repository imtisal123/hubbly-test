const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '../screens');
const files = fs.readdirSync(screensDir).filter(file => file.endsWith('Screen.tsx'));

// Common style fixes to apply to all screens
const styleFixTemplate = `
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },`;

// Button style fixes
const buttonStyleFixTemplate = `
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },`;

// Fix for ScrollView and BackButton
const layoutFixRegex = /<ScrollView\s+style={styles\.container}(?!\s+contentContainerStyle={styles\.scrollContent}).*?>/g;
const layoutFixReplacement = '<ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>';

const backButtonFixRegex = /<BackButton\s*\/>/g;
const backButtonFixReplacement = '<BackButton style={styles.backButton} />';

// Fix for styles
const scrollContentStyleRegex = /scrollContent:\s*{[^}]*}/g;
const backButtonStyleRegex = /backButton:\s*{[^}]*}/g;
const buttonStyleRegex = /button:\s*{[^}]*}/g;
const buttonTextStyleRegex = /buttonText:\s*{[^}]*}/g;

let fixedFiles = 0;

files.forEach(file => {
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix ScrollView and BackButton
  if (content.includes('<ScrollView') && !content.includes('contentContainerStyle={styles.scrollContent}')) {
    content = content.replace(layoutFixRegex, layoutFixReplacement);
    modified = true;
  }

  if (content.includes('<BackButton') && !content.includes('style={styles.backButton}')) {
    content = content.replace(backButtonFixRegex, backButtonFixReplacement);
    modified = true;
  }

  // Fix styles
  if (content.includes('scrollContent:') && !content.includes('paddingBottom: 40')) {
    content = content.replace(scrollContentStyleRegex, 'scrollContent: {' + styleFixTemplate.split('scrollContent: {')[1].split('},')[0] + '}');
    modified = true;
  } else if (content.includes('styles.scrollContent') && !content.includes('scrollContent:')) {
    // Add scrollContent style if it's missing but referenced
    const stylesIndex = content.indexOf('const styles = StyleSheet.create({');
    if (stylesIndex !== -1) {
      const insertPos = stylesIndex + 'const styles = StyleSheet.create({'.length;
      content = content.slice(0, insertPos) + styleFixTemplate + content.slice(insertPos);
      modified = true;
    }
  }

  if (!content.includes('backButton:')) {
    // Add backButton style if it's missing
    const stylesIndex = content.indexOf('const styles = StyleSheet.create({');
    if (stylesIndex !== -1) {
      const insertPos = stylesIndex + 'const styles = StyleSheet.create({'.length;
      const backButtonStyle = styleFixTemplate.split('scrollContent: {')[1].split('backButton: {')[1];
      content = content.slice(0, insertPos) + '\n  backButton: {' + backButtonStyle + content.slice(insertPos);
      modified = true;
    }
  }

  // Fix button styles
  if (content.includes('button:') && !content.includes('borderRadius: 25')) {
    content = content.replace(buttonStyleRegex, 'button: {' + buttonStyleFixTemplate.split('button: {')[1].split('},')[0] + '}');
    modified = true;
  }

  if (content.includes('buttonText:') && !content.includes('color: "white"')) {
    content = content.replace(buttonTextStyleRegex, 'buttonText: {' + buttonStyleFixTemplate.split('buttonText: {')[1].split('},')[0] + '}');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    fixedFiles++;
    console.log(`Fixed layout in: ${file}`);
  }
});

console.log(`\nFixed layout issues in ${fixedFiles} files.`);
