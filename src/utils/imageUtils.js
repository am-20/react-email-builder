export const ICON_BASE_PATH = 'i'; // Put the PNGs in /public/i/icons/*.png

export const getFooterIconBase64 = (iconName) => {
  return `i/${iconName}.png`;
};


export const socialIcons = {
  facebook: 'facebook',
  instagram: 'instagram',
  vkontakte: 'vk',
  youtube: 'youtube',
  twitter: 'twitter',
  linkedin: 'linkedin',
  livechat: 'chat',
  call: 'call',
};

export const getImagePath = (iconName) => getFooterIconBase64(iconName);
