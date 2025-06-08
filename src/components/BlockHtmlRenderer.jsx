import React from 'react';

// Convert camelCase to kebab-case for CSS properties
const kebabCase = (str) => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};

// Render a block as HTML
const renderBlockHtml = (block) => {
  const { type, content, settings } = block;
  let blockHtml = '';

  const styleString = Object.entries(settings || {})
    .filter(([key]) => !['altText', 'buttonUrl', 'inline', 'gap', 'imagePosition', 'imageWidth', 'showButton', 'buttonText', 'buttonUrl', 'buttonColor', 'buttonTextColor', 'linkLabel'].includes(key))
    .map(([key, value]) => `${kebabCase(key)}: ${value};`)
    .join(' ');

  // Add padding styles for non-image and non-spacer blocks
  const paddingStyle = (type === 'image' || type === 'spacer') ? '' : 'padding-left: 12%; padding-right: 12%;';

  switch (type) {
    case 'header':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
        <tr>
          <td style="text-align: ${settings.textAlign || 'left'}; margin: 0; padding: 0;">
            <h1 style="margin: 0; ${styleString} padding: 0;">${content}</h1>
          </td>
        </tr>
      </table>`;
      break;
    case 'text':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
        <tr>
          <td style="text-align: ${settings.textAlign || 'left'}; margin: 0; padding: 0;">
            <div>${content}</div>
          </td>
        </tr>
      </table>`;
      break;
    case 'image':
      if (settings.linkUrl) {
        blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
          <tr>
            <td style="text-align: ${settings.textAlign || 'left'};">
              <a href="${settings.linkUrl}" _label="${settings.linkLabel || ''}">
                <img src="${content}" alt="${settings.altText || ''}" style="max-width: 100%; border: 0; display: block;">
              </a>
            </td>
          </tr>
        </table>`;
      } else {
        blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
          <tr>
            <td style="text-align: ${settings.textAlign || 'left'};">
              <img src="${content}" alt="${settings.altText || ''}" style="max-width: 100%; border: 0; display: block;">
            </td>
          </tr>
        </table>`;
      }
      break;
    case 'button':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
        <tr>
          <td style="text-align: ${settings.textAlign || 'center'};">
            <a href="${settings.linkUrl}" target="_blank" rel="noopener noreferrer" _label="${settings.linkLabel || ''}">
              <img src="${settings.imageUrl}" alt="${settings.imageAlt || ''}" style="max-width: 100%; display: block; margin: 0 auto; height: auto; border: 0;">
            </a>
          </td>
        </tr>
      </table>`;
      break;
    case 'buttonGroup':
      const buttonStyle = block.settings.inline ? 'display: inline-block;' : 'display: block;';
      const gapStyle = block.settings.inline ? `margin-right: ${block.settings.gap};` : `margin-bottom: ${block.settings.gap};`;
      
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
        <tr>
          <td style="text-align: center;">
            ${block.buttons.map((button, index) => `
              <div style="${buttonStyle} ${index < block.buttons.length - 1 ? gapStyle : ''}">
                <a href="${button.settings.linkUrl || '#'}" target="_blank" rel="noopener noreferrer" _label="${button.settings.linkLabel || ''}">
                  <img src="${button.settings.imageUrl}" alt="${button.settings.imageAlt || ''}" style="max-width: 100%; display: block; margin: 0 auto; height: auto; border: 0;">
                </a>
              </div>
            `).join('')}
          </td>
        </tr>
      </table>`;
      break;
    case 'divider':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr>
          <td style="height: ${settings.lineHeight}; background-color: ${settings.lineColor};"></td>
        </tr>
      </table>`;
      break;
    case 'spacer':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr>
          <td style="height: ${settings.height};"></td>
        </tr>
      </table>`;
      break;
    case 'columns':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} padding-left: 12%; padding-right: 12%;">
        <tr>
          <td width="50%" style="padding: 0 8px;">
            ${block.columns[0].settings?.linkUrl 
              ? `<a href="${block.columns[0].settings.linkUrl}" _label="${block.columns[0].settings?.linkLabel || ''}"><img src="${block.columns[0].content}" alt="${block.columns[0].settings?.altText || ''}" style="max-width: 100%; border: 0; display: block;"></a>`
              : `<img src="${block.columns[0].content}" alt="${block.columns[0].settings?.altText || ''}" style="max-width: 100%; border: 0; display: block;">`
            }
          </td>
          <td width="50%" style="padding: 0 8px;">
            ${block.columns[1].settings?.linkUrl 
              ? `<a href="${block.columns[1].settings.linkUrl}" _label="${block.columns[1].settings?.linkLabel || ''}"><img src="${block.columns[1].content}" alt="${block.columns[1].settings?.altText || ''}" style="max-width: 100%; border: 0; display: block;"></a>`
              : `<img src="${block.columns[1].content}" alt="${block.columns[1].settings?.altText || ''}" style="max-width: 100%; border: 0; display: block;">`
            }
          </td>
        </tr>
      </table>`;
      break;
    case 'halfText':
      const imageHtml = settings.imageLinkUrl 
        ? `<a href="${settings.imageLinkUrl}" target="_blank" rel="noopener noreferrer"><img src="${block.imageUrl}" alt="${settings.altText || ''}" style="max-width: 100%; border: 0; display: block;"></a>`
        : `<img src="${block.imageUrl}" alt="${settings.altText || ''}" style="max-width: 100%; border: 0; display: block;">`;

      const textContent = `
        <div style="color: ${settings.color}; font-size: ${settings.fontSize}; text-align: ${settings.textAlign}; font-family: ${settings.fontFamily};">
          ${content}
        </div>
        ${settings.showButton ? `
          <a href="${settings.buttonUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background-color: ${settings.buttonColor}; color: ${settings.buttonTextColor}; text-decoration: none; border-radius: 4px; margin-top: 16px;">
            ${settings.buttonText}
          </a>
        ` : ''}`;

      const imageContainerStyle = `width: ${settings.imageWidth}; vertical-align: top;`;
      const textContainerStyle = `width: ${settings.imageWidth === '40%' ? '60%' : '70%'}; vertical-align: top; padding: 0 20px;`;

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} padding-left: 12%; padding-right: 12%;">
        <tr>
          <td>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                ${settings.imagePosition === 'left' ? `
                  <td style="${imageContainerStyle}">
                    ${imageHtml}
                  </td>
                  <td style="${textContainerStyle}">
                    ${textContent}
                  </td>
                ` : `
                  <td style="${textContainerStyle}">
                    ${textContent}
                  </td>
                  <td style="${imageContainerStyle}">
                    ${imageHtml}
                  </td>
                `}
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
      break;
    default:
      blockHtml = '';
  }

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${settings.backgroundColor};">
    <tr>
      <td>
        ${blockHtml}
      </td>
    </tr>
  </table>`;
};

export default renderBlockHtml; 