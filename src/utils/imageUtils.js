import { addFileAsset } from './assets';

export const ICON_BASE_PATH = 'i'; // Put the PNGs in /public/i/icons/*.png

export const getFooterIcon = (iconName) => {
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

export const getImagePath = (iconName) => getFooterIcon(iconName);

export function handleImageUploadForBlock(e, blockIndex, template, setTemplate) {
  const file = e.target.files?.[0];
  if (!file) return;

  const asset = addFileAsset(file); // { filename, path: "i/1.svg", previewUrl, file }

  // Persist final HTML path + keep preview for builder
  const newBlocks = [...template.blocks];
  const b = { ...newBlocks[blockIndex] };
  b.settings = {
    ...b.settings,
    imagePath: asset.path,           // used in HTML export
    imagePreviewUrl: asset.previewUrl, // used in editor preview
  };
  newBlocks[blockIndex] = b;

  setTemplate({ ...template, blocks: newBlocks });
}
