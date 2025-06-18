// Handler functions for EmailBuilder component

// Create a new block based on type
export const createNewBlock = (type) => {
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
          padding: '24px 0',
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
          padding: '24px 0',
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
    case 'footer':
      return {
        id,
        type,
        settings: {
          canvascolor: '#FFFFFF',
          textcolor: '#000000',
          theme: 'day',
          disclaimercolor: '#555555',
          linklabel: '99_unsubscribe_btn',
          urls: {
            facebook: 'https://www.facebook.com/SamsungKazakhstan',
            instagram: 'https://www.instagram.com/samsungkz/',
            vkontakte: 'https://vk.com/samsungkazakhstan',
            youtube: 'https://www.youtube.com/user/SamsungKZ',
            twitter: 'https://twitter.com/SamsungKZ',
            linkedin: 'https://www.linkedin.com/company/samsungelectronicscentraleurasia/',
            livechat: 'https://www.samsung.com/kz_ru/support/?content_type=text&creative=creative&segment=no-segment',
            email: 'https://www.samsung.com/kz_ru/support/email/?content_type=text&creative=creative&segment=no-segment',
            hotline: 'https://www.samsung.com/kz_ru/info/contactus/?content_type=text&creative=creative&segment=no-segment',
            call: 'tel:7700',
            optout: 'https://www.samsung.com/kz_ru/unsubscribe',
            privacy: 'https://www.samsung.com/kz_ru/info/privacy/?content_type=text&creative=creative&segment=no-segment',
            legal: 'https://www.samsung.com/kz_ru/info/legal/?content_type=text&creative=creative&segment=no-segment'
          }
        }
      };
    case 'footer_general_kz':
      return {
        id,
        type,
        settings: {
          canvascolor: '#FFFFFF',
          textcolor: '#000000',
          theme: 'day',
          disclaimercolor: '#555555',
          linklabel: '99_unsubscribe_btn',
          urls: {
            facebook: 'https://www.facebook.com/SamsungKazakhstan',
            instagram: 'https://www.instagram.com/samsungkz/',
            vkontakte: 'https://vk.com/samsungkazakhstan',
            youtube: 'https://www.youtube.com/user/SamsungKZ',
            twitter: 'https://twitter.com/SamsungKZ',
            linkedin: 'https://www.linkedin.com/company/samsungelectronicscentraleurasia/',
            livechat: 'https://www.samsung.com/kz_ru/support/?content_type=text&creative=creative&segment=no-segment',
            email: 'https://www.samsung.com/kz_ru/support/email/?content_type=text&creative=creative&segment=no-segment',
            hotline: 'https://www.samsung.com/kz_ru/info/contactus/?content_type=text&creative=creative&segment=no-segment',
            call: 'tel:7700',
            optout: 'https://www.samsung.com/kz_ru/unsubscribe',
            privacy: 'https://www.samsung.com/kz_ru/info/privacy/?content_type=text&creative=creative&segment=no-segment',
            legal: 'https://www.samsung.com/kz_ru/info/legal/?content_type=text&creative=creative&segment=no-segment'
          }
        }
      };
    case 'footer_sendpulse':
      return {
        id,
        type,
        settings: {
          canvascolor: '#FFFFFF',
          textcolor: '#000000',
          theme: 'day',
          disclaimercolor: '#555555',
          linklabel: '99_unsubscribe_btn',
          urls: {
            facebook: 'https://www.facebook.com/SamsungKazakhstan',
            instagram: 'https://www.instagram.com/samsungkz/',
            vkontakte: 'https://vk.com/samsungkazakhstan',
            youtube: 'https://www.youtube.com/user/SamsungKZ',
            twitter: 'https://twitter.com/SamsungKZ',
            linkedin: 'https://www.linkedin.com/company/samsungelectronicscentraleurasia/',
            livechat: 'https://www.samsung.com/kz_ru/support/?content_type=text&creative=creative&segment=no-segment',
            email: 'https://www.samsung.com/kz_ru/support/email/?content_type=text&creative=creative&segment=no-segment',
            hotline: 'https://www.samsung.com/kz_ru/info/contactus/?content_type=text&creative=creative&segment=no-segment',
            call: 'tel:7700',
            optout: 'https://www.samsung.com/kz_ru/unsubscribe',
            privacy: 'https://www.samsung.com/kz_ru/info/privacy/?content_type=text&creative=creative&segment=no-segment',
            legal: 'https://www.samsung.com/kz_ru/info/legal/?content_type=text&creative=creative&segment=no-segment'
          }
        }
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
              linkLabel: ''
            } 
          },
          { 
            content: 'https://placehold.co/300x200', 
            settings: { 
              padding: '10px',
              altText: 'Right column image',
              linkUrl: '',
              linkLabel: ''
            } 
          },
        ],
        settings: {
          backgroundColor: '#ffffff',
          padding: '10px',
          columnGap: '20px',
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
export const handleDeleteBlock = (index, template, setTemplate, setActiveBlockId) => {
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
export const handleUpdateBlockContent = (index, content, template, setTemplate) => {
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
export const handleUpdateBlockSettings = (index, setting, value, template, setTemplate) => {
  const newBlocks = [...template.blocks];
  newBlocks[index] = {
    ...newBlocks[index],
    settings: { ...newBlocks[index].settings, [setting]: value },
  };
  setTemplate({ ...template, blocks: newBlocks });
};

// Update template settings
export const handleUpdateTemplateSetting = (setting, value, template, setTemplate) => {
  setTemplate({ ...template, [setting]: value });
};

// Save template handler
export const handleSaveTemplate = (generateHtmlOutput) => {
  const htmlOutput = generateHtmlOutput();
  
  // Create a blob with the HTML content
  const blob = new Blob([htmlOutput], { type: 'text/html' });
  
  // Create a download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  
  // Set the filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  link.download = `email-template-${timestamp}.html`;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(link.href);
};

// Drag and drop handlers
export const handleDragStart = (e, item, isNew, setDraggedItem) => {
  if (isNew) {
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

export const handleDrop = (e, dropIndex, draggedItem, template, setTemplate, setDraggedItem, setDragOverIndex, createNewBlock) => {
  e.preventDefault();

  const newBlocks = [...template.blocks];

  if (draggedItem.isNew) {
    const newBlock = createNewBlock(draggedItem.type);
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