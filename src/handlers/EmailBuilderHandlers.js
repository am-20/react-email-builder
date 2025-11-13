// Handler functions for EmailBuilder component
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { listAssets } from '../utils/assets';

// Create a new block based on type
export const createNewBlock = (type, template = null) => {
  const id = `${type}-${Date.now()}`;

  switch (type) {
    case 'header':
      return {
        id,
        type,
        content: 'New Heading',
        settings: {
          backgroundColor: '#ffffff',
          color: '#000000',
          fontSize: '48px',
          padding: '0',
          textAlign: 'center',
          fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
        },
      };
    case 'text':
      return {
        id,
        type,
        content: 'Enter your text here...',
        settings: {
          backgroundColor: '#ffffff',
          color: '#000000',
          fontSize: '24px',
          padding: '0',
          textAlign: 'center',
          fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
        },
      };
    case 'image':
      return {
        id,
        type,
        content: 'https://placehold.co/640x300',
        settings: {
          backgroundColor: '#ffffff',
          textAlign: 'center',
          altText: 'Image description',
          linkUrl: '',
          linkLabel: '',
        },
      };
    case 'button':
      return {
        id,
        type: 'button',
        content: 'https://placehold.co/80x40',
        settings: {
          backgroundColor: '#ffffff',
          padding: '10px',
          textAlign: 'center',
          imageUrl: 'https://placehold.co/80x40',
          imageAlt: 'Click me',
          linkUrl: '#',
          linkLabel: '',
          fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
        },
      };
    case 'buttonCoded':
      return {
        id,
        type,
        content: 'Click Me',
        settings: {
          backgroundColor: '#ffffff',
          buttonBgColor: '#000000',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '30px',
          fontSize: '16px',
          border: '1px solid #000000',
          textAlign: 'center',
          linkUrl: '',
          linkLabel: '',
          fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
        },
      };
    case 'buttonGroup':
      return {
        id,
        type,
        buttons: [
          {
            content: 'https://placehold.co/80x40',
            settings: {
              backgroundColor: '#ffffff',
              padding: '10px',
              textAlign: 'center',
              imageUrl: 'https://placehold.co/80x40',
              imageAlt: 'Button 1',
              linkUrl: '#',
              linkLabel: '',
              fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
            },
          },
          {
            content: 'https://placehold.co/80x40',
            settings: {
              backgroundColor: '#ffffff',
              padding: '10px',
              textAlign: 'center',
              imageUrl: 'https://placehold.co/80x40',
              imageAlt: 'Button 2',
              linkUrl: '#',
              linkLabel: '',
              fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
            },
          },
        ],
        settings: {
          backgroundColor: '#ffffff',
          padding: '10px',
          inline: true,
          gap: '20px',
        },
      };
    case 'buttonCodedGroup':
      return {
        id,
        type,
        buttons: [
          {
            content: 'Click Me',
            settings: {
              backgroundColor: '#ffffff',
              buttonBgColor: '#000000',
              color: '#ffffff',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '30px',
              border: '1px solid #000000',
              textAlign: 'center',
              linkUrl: '',
              linkLabel: '',
              fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
            },
          },
          {
            content: 'Click Me',
            settings: {
              backgroundColor: '#ffffff',
              buttonBgColor: '#000000',
              color: '#ffffff',
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '30px',
              border: '1px solid #000000',
              textAlign: 'center',
              linkUrl: '',
              linkLabel: '',
              fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
            },
          },
        ],
        settings: {
          backgroundColor: '#ffffff',
          padding: '10px',
          inline: true,
          gap: '20px',
        },
      };
    case 'divider':
      return {
        id,
        type,
        settings: {
          backgroundColor: '#ffffff',
          padding: '10px',
          lineColor: '#dddddd',
          lineHeight: '1px',
        },
      };
    case 'spacer':
      return {
        id,
        type,
        settings: {
          backgroundColor: '#ffffff',
          height: '40px',
        },
      };
    case 'roundContainer':
      return {
        id: `round-${Date.now()}`,
        type: 'roundContainer',
        settings: {
          canvasColor: '#CFCFCF',
          backgroundColor: '#FFFFFF',
          bgWidth: 88,
          borderColor: '#FFFFFF',
          borderWidth: 3,
          borderType: 'solid',
          borderRadius: 24,
          paddingTop: 8,
          paddingBottom: 8,
          paddingInnerTop: 64,
          paddingInnerBottom: 64,
        },
        children: [],
      };
    case 'footer':
      return {
        id,
        type,
        settings: {
          canvascolor: '#f5f5f5',
          textcolor: '#000000',
          theme: 'day',
          disclaimercolor: '#555555',
          linklabel: template?.footerLinkLabel || '',
          urls: {
            facebook: 'https://www.facebook.com/SamsungKazakhstan',
            instagram: 'https://www.instagram.com/samsungkz/',
            vkontakte: 'https://vk.com/samsungkazakhstan',
            youtube: 'https://www.youtube.com/user/SamsungKZ',
            twitter: 'https://twitter.com/SamsungKZ',
            linkedin:
              'https://www.linkedin.com/company/samsungelectronicscentraleurasia/',
            livechat: 'https://www.samsung.com/kz_ru/support/',
            call: 'https://www.samsung.com/kz_ru/support/contact/#onlinesupport',
            optout:
              '<%@ include option="NmsServer_URL" %>/webApp/smgUnsub?id=<%= escapeUrl(recipient.cryptedId)%>&lang=sece_ru',
            privacy: 'https://www.samsung.com/kz_ru/info/privacy/',
            legal: 'https://www.samsung.com/kz_ru/info/legal/',
          },
        },
      };
    case 'footer_general_kz':
      return {
        id,
        type,
        settings: {
          canvascolor: '#f5f5f5',
          textcolor: '#000000',
          theme: 'day',
          disclaimercolor: '#555555',
          linklabel: template?.footerLinkLabel || '',
          urls: {
            facebook: 'https://www.facebook.com/SamsungKazakhstan',
            instagram: 'https://www.instagram.com/samsungkz/',
            vkontakte: 'https://vk.com/samsungkazakhstan',
            youtube: 'https://www.youtube.com/user/SamsungKZ',
            twitter: 'https://twitter.com/SamsungKZ',
            linkedin:
              'https://www.linkedin.com/company/samsungelectronicscentraleurasia/',
            livechat: 'https://www.samsung.com/kz_kz/support/',
            call: 'https://www.samsung.com/kz_kz/support/contact/#onlinesupport',
            optout:
              '<%@ include option="NmsServer_URL" %>/webApp/smgUnsub?id=<%= escapeUrl(recipient.cryptedId)%>&lang=sece_kz',
            privacy: 'https://www.samsung.com/kz_kz/info/privacy/',
            legal: 'https://www.samsung.com/kz_kz/info/legal/',
          },
        },
      };
    case 'footer_sendpulse':
      return {
        id,
        type,
        settings: {
          canvascolor: '#f5f5f5',
          textcolor: '#000000',
          theme: 'day',
          disclaimercolor: '#555555',
          linklabel: template?.footerLinkLabel || '',
          urls: {
            facebook: 'https://www.facebook.com/SamsungKazakhstan',
            instagram: 'https://www.instagram.com/samsungkz/',
            vkontakte: 'https://vk.com/samsungkazakhstan',
            youtube: 'https://www.youtube.com/user/SamsungKZ',
            twitter: 'https://twitter.com/SamsungKZ',
            linkedin:
              'https://www.linkedin.com/company/samsungelectronicscentraleurasia/',
            livechat: 'https://www.samsung.com/kz_ru/support/',
            call: 'https://www.samsung.com/kz_ru/support/contact/#onlinesupport',
            optout:
              '<%@ include option="NmsServer_URL" %>/webApp/smgUnsub?id=<%= escapeUrl(recipient.cryptedId)%>&lang=sece_ru',
            privacy: 'https://www.samsung.com/kz_ru/info/privacy/',
            legal: 'https://www.samsung.com/kz_ru/info/legal/',
          },
        },
      };
    case 'columns':
      return {
        id,
        type,
        columns: [
          {
            content: 'https://placehold.co/300x200',
            settings: {
              padding: '10px',
              altText: 'Left column image',
              linkUrl: '',
              linkLabel: '',
            },
          },
          {
            content: 'https://placehold.co/300x200',
            settings: {
              padding: '10px',
              altText: 'Right column image',
              linkUrl: '',
              linkLabel: '',
            },
          },
        ],
        settings: {
          backgroundColor: '#ffffff',
          padding: '10px',
          columnGap: '16px',
        },
      };
    case 'columnsContent':
      return {
        id,
        type,
        columns: [
          {
            imgUrl: 'https://placehold.co/300x200',
            title: 'Title 1',
            text: 'Text 1',
            textAlign: 'center',
            settings: {
              padding: '10px',
              altText: 'Left column image',
              linkUrl: '',
              linkLabel: '',
              titleFontSize: '24px',
              textFontSize: '12px',
            },
          },
          {
            imgUrl: 'https://placehold.co/300x200',
            title: 'Title 2',
            text: 'Text 2',
            settings: {
              padding: '10px',
              altText: 'Right column image',
              linkUrl: '',
              linkLabel: '',
              titleFontSize: '24px',
              textFontSize: '12px',
            },
          },
        ],
        settings: {
          backgroundColor: '#ffffff',
          color: '#000000',
          padding: '10px',
          columnGap: '16px',
          hidetitle: false,
          isBold: false,
        },
      };
    case 'halfText':
      return {
        id,
        type,
        content: 'Enter your text here...',
        imageUrl: 'https://placehold.co/300x200',
        settings: {
          backgroundColor: '#ffffff',
          color: '#000000',
          fontSize: '16px',
          padding: '24px 0',
          textAlign: 'left',
          fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
          imagePosition: 'right',
          imageWidth: '40%',
          showButton: false,
          buttonText: 'Learn More',
          buttonUrl: '#',
          buttonColor: '#2563eb',
          buttonTextColor: '#ffffff',
          imageLinkUrl: '',
          imageLinkLabel: '',
        },
      };
    default:
      return {
        id,
        type,
        content: '',
        settings: { backgroundColor: '#ffffff' },
      };
  }
};

// Delete a block
export const handleDeleteBlock = (
  index,
  template,
  setTemplate,
  setActiveBlockId
) => {
  const newBlocks = [...template.blocks];
  newBlocks.splice(index, 1);
  setTemplate({ ...template, blocks: newBlocks });
  setActiveBlockId(null);
};

// Duplicate a block
export const handleDuplicateBlock = (index, template, setTemplate) => {
  const newBlocks = [...template.blocks];
  const duplicatedBlock = {
    ...newBlocks[index],
    id: `${newBlocks[index].type}-${Date.now()}`,
  };
  newBlocks.splice(index + 1, 0, duplicatedBlock);
  setTemplate({ ...template, blocks: newBlocks });
};

// Update block content
export const handleUpdateBlockContent = (
  index,
  content,
  template,
  setTemplate
) => {
  // Create a temporary div to parse the HTML content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  // Remove all inline styles from the content
  const removeInlineStyles = (element) => {
    if (element.style) {
      element.removeAttribute('style');
    }
    Array.from(element.children).forEach(removeInlineStyles);
  };
  removeInlineStyles(tempDiv);

  // Get the sanitized content
  const sanitizedContent = tempDiv.innerHTML;

  const newBlocks = [...template.blocks];
  newBlocks[index] = { ...newBlocks[index], content: sanitizedContent };
  setTemplate({ ...template, blocks: newBlocks });
};

// Update block settings
export const handleUpdateBlockSettings = (
  blockIndex,
  key,
  value,
  template,
  setTemplate,
  parentIndex = null
) => {
  setTemplate((prev) => {
    const next = JSON.parse(JSON.stringify(prev));

    if (
      parentIndex !== null &&
      next.blocks[parentIndex]?.children?.[blockIndex]
    ) {
      // nested child (like inside RoundContainer)
      next.blocks[parentIndex].children[blockIndex].settings[key] = value;
    } else if (next.blocks?.[blockIndex]) {
      // top-level block
      next.blocks[blockIndex].settings[key] = value;
    }

    return next;
  });
};

// Update template settings
export const handleUpdateTemplateSetting = (
  setting,
  value,
  template,
  setTemplate
) => {
  setTemplate({ ...template, [setting]: value });
};

// Save template handler
export async function handleSaveTemplate(getHtml, title = 'Template') {
  const zip = new JSZip();
  const html = getHtml();

  // add main HTML
  zip.file('index.html', html);

  // assets already collected from localStorage
  const assets = listAssets();
  let assetsFolder = null;

  if (assets.length) {
    assetsFolder = zip.folder('i');
    assets.forEach((a) => {
      const filename = a.path.split('/').pop();
      const base64 = a.dataUrl.split(',')[1] || '';
      assetsFolder.file(filename, base64, { base64: true });
    });
  }

  // so addDefaultFooterIcons can skip duplicates
  const hasPath = (p) => assets.some((a) => a.path === p);

  // also add default footer icons from /public/i if missing
  await addDefaultFooterIcons(assetsFolder ?? zip.folder('i'), hasPath);

  // download zip
  const blob = await zip.generateAsync({ type: 'blob' });
  const safe = (title || 'Template').replace(/[^\w-]+/g, '_');
  saveAs(blob, `${safe}.zip`);
}

const DEFAULT_ICON_KEYS = [
  'facebook',
  'instagram',
  'vk',
  'youtube',
  'twitter',
  'linkedin',
  'chat',
  'call',
];

// Fetch /i/<name>.png from the app and add to zip if not already present
async function addDefaultFooterIcons(assetsFolder, hasPath) {
  const origin = window.location.origin;

  for (const key of DEFAULT_ICON_KEYS) {
    const path = `i/${key}.png`; // must match what HTML uses
    if (hasPath(path)) continue; // don't duplicate or override uploaded assets

    try {
      const url = new URL(`/${path}`, origin); // absolute fetch from public/i
      const res = await fetch(url);
      if (!res.ok) {
        console.warn('[Export] footer icon not found:', url.toString());
        continue;
      }
      const blob = await res.blob();
      const arrayBuff = await blob.arrayBuffer();
      const filename = path.split('/').pop();
      assetsFolder.file(filename, arrayBuff);
    } catch (e) {
      console.warn('[Export] failed to include default icon', key, e);
    }
  }
}

// Drag and drop handlers
export const handleDragStart = (e, item, isNew, setDraggedItem) => {
  if (isNew) {
    // Set dataTransfer data for components that read from it (like RoundContainer)
    try {
      e.dataTransfer.setData('text/block-type', item.type);
      e.dataTransfer.setData('application/x-block-type', item.type);
      e.dataTransfer.setData('text/plain', item.type);
    } catch (err) {
      // Some browsers may not support setData in certain contexts
      console.log('Error: ', err);
    }
    setDraggedItem({ ...item, isNew: true });
  } else {
    e.currentTarget.dataset.index = e.currentTarget.getAttribute('data-index');
    setDraggedItem({
      ...item,
      isNew: false,
      index: parseInt(e.currentTarget.dataset.index),
    });
  }
};

export const handleDragOver = (e, index, setDragOverIndex) => {
  e.preventDefault();
  setDragOverIndex(index);
};

export const handleDrop = (
  e,
  dropIndex,
  draggedItem,
  template,
  setTemplate,
  setDraggedItem,
  setDragOverIndex,
  createNewBlock
) => {
  e.preventDefault();

  const newBlocks = [...template.blocks];

  if (draggedItem.isNew) {
    const newBlock = createNewBlock(draggedItem.type, template);
    newBlocks.splice(dropIndex, 0, newBlock);
  } else {
    const movedItem = newBlocks[draggedItem.index];
    newBlocks.splice(draggedItem.index, 1);
    newBlocks.splice(dropIndex, 0, movedItem);
  }

  setTemplate({ ...template, blocks: newBlocks });
  setDraggedItem(null);
  setDragOverIndex(null);
};
