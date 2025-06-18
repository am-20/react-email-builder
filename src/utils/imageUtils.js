// Utility function to get the correct image path
export const getImagePath = (imageName) => {
  // In development, use the relative path
  if (process.env.NODE_ENV === 'development') {
    return `/src/assets/global/${imageName}`;
  }
  // In production, use the public path
  return `/assets/global/${imageName}`;
};

// Map of social media icons
export const socialIcons = {
  facebook: 'icon.png',
  instagram: 'i-instagram.png',
  vkontakte: 'i-vk.png',
  youtube: 'i-youtube.png',
  twitter: 'i-twitter.png',
  linkedin: 'i-linkedin.png',
  livechat: 'i-chat.png',
  call: 'i-call.png'
}; 