import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert image to base64
function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 
                     ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
                     ext === '.gif' ? 'image/gif' : 'image/png';
    
    return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.warn(`Could not convert image: ${imagePath}`, error);
    return null;
  }
}

// Convert all footer images to base64
const publicAssetsPath = path.join(__dirname, '../public/assets/global');
const images = {
  facebook: 'ic_fb.png',
  instagram: 'ic_in.png',
  vk: 'ic_vk.png',
  youtube: 'ic_yt.png',
  twitter: 'icon-x.png',
  linkedin: 'icon-linkedin.png',
  chat: 'i-chat.png',
  call: 'i-call.png'
};

const base64Images = {};

console.log('Converting images to base64...');
for (const [name, filename] of Object.entries(images)) {
  const imagePath = path.join(publicAssetsPath, filename);
  const base64 = imageToBase64(imagePath);
  if (base64) {
    base64Images[name] = base64;
    console.log(`✓ Converted ${filename}`);
  } else {
    console.log(`✗ Failed to convert ${filename}`);
  }
}

// Generate the updated imageUtils.js content
const imageUtilsContent = `// Utility functions for handling images in email templates

// Convert image to base64 data URI
export const imageToBase64 = async (imagePath) => {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(\`Could not convert image to base64: \${imagePath}\`, error);
    return imagePath; // Fallback to original path
  }
};

// Pre-converted base64 images for footer icons
export const footerIconBase64 = {
  facebook: '${base64Images.facebook}',
  instagram: '${base64Images.instagram}',
  vk: '${base64Images.vk}',
  youtube: '${base64Images.youtube}',
  twitter: '${base64Images.twitter}',
  linkedin: '${base64Images.linkedin}',
  chat: '${base64Images.chat}',
  call: '${base64Images.call}'
};

// Function to get base64 image for footer icons
export const getFooterIconBase64 = (iconName) => {
  return footerIconBase64[iconName] || footerIconBase64.facebook;
};`;

// Write the updated file
const outputPath = path.join(__dirname, '../src/utils/imageUtils.js');
fs.writeFileSync(outputPath, imageUtilsContent);

console.log('✓ Updated imageUtils.js with base64 images');
console.log('All footer images are now embedded as base64 data URIs');
