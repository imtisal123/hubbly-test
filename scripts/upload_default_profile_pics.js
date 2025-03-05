// Script to upload default profile pictures to Supabase storage
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = 'https://jhpmzmjegvspxdnbazzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NzAxMjEsImV4cCI6MjA1NjI0NjEyMX0.Lsw4uwOnZJ1l_gMRtSEDhnZ-Vee8-756XKt0wHGZS_A';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to download an image from a URL and save it locally
async function downloadImage(url, filepath) {
  console.log(`Downloading image from ${url} to ${filepath}...`);
  
  // Create the directory if it doesn't exist
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`Image downloaded successfully to ${filepath}`);
    return true;
  } catch (error) {
    console.error(`Error downloading image: ${error.message}`);
    return false;
  }
}

// Function to upload a file to Supabase storage
async function uploadFile(filePath, bucketName, storagePath) {
  console.log(`Uploading ${filePath} to ${bucketName}/${storagePath}...`);
  
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileExt = path.extname(filePath);
    const contentType = fileExt === '.jpg' || fileExt === '.jpeg' ? 'image/jpeg' : 'image/png';
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true
      });
    
    if (error) {
      throw error;
    }
    
    console.log(`File uploaded successfully to ${bucketName}/${storagePath}`);
    const publicUrl = supabase.storage.from(bucketName).getPublicUrl(storagePath).data.publicUrl;
    console.log(`Public URL: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading file: ${error.message}`);
    return null;
  }
}

// Main function to upload default profile pictures
async function uploadDefaultProfilePics() {
  console.log('Starting upload of default profile pictures...');
  
  // Create temp directory for downloaded images
  const tempDir = path.join(__dirname, 'temp_images');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Define default profile pictures
  const defaultPics = [
    {
      name: 'admin_profile.jpg',
      url: 'https://randomuser.me/api/portraits/men/1.jpg',
      path: 'default/admin_profile.jpg'
    },
    {
      name: 'mother_profile.jpg',
      url: 'https://randomuser.me/api/portraits/women/1.jpg',
      path: 'default/mother_profile.jpg'
    },
    {
      name: 'father_profile.jpg',
      url: 'https://randomuser.me/api/portraits/men/2.jpg',
      path: 'default/father_profile.jpg'
    },
    {
      name: 'sister_profile.jpg',
      url: 'https://randomuser.me/api/portraits/women/2.jpg',
      path: 'default/sister_profile.jpg'
    },
    {
      name: 'brother_profile.jpg',
      url: 'https://randomuser.me/api/portraits/men/3.jpg',
      path: 'default/brother_profile.jpg'
    }
  ];
  
  // Process each profile picture
  for (const pic of defaultPics) {
    const localPath = path.join(tempDir, pic.name);
    
    // Download the image
    const downloaded = await downloadImage(pic.url, localPath);
    if (!downloaded) {
      console.log(`Skipping upload for ${pic.name} due to download failure`);
      continue;
    }
    
    // Upload to Supabase
    await uploadFile(localPath, 'profile_pictures', pic.path);
  }
  
  console.log('Default profile pictures upload completed!');
  
  // Clean up temp directory
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('Temporary files cleaned up');
  } catch (error) {
    console.error(`Error cleaning up temporary files: ${error.message}`);
  }
}

// Run the function
uploadDefaultProfilePics();
