// Utility function to get the correct image path
export const getImagePath = (imageName) => {
  // In development, use the relative path
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'development') {
    return `/src/assets/global/${imageName}`;
  }
  // In production, use the public path
  return `/assets/global/${imageName}`;
};

// Map of social media icons
export const socialIcons = {
  facebook: 'ic_fb.png',
  instagram: 'ic_in.png',
  vkontakte: 'ic_vk.png',
  youtube: 'ic_yt.png',
  twitter: 'icon-x.png',
  linkedin: 'icon-linkedin.png',
  livechat: 'i-chat.png',
  call: 'i-call.png',
};
