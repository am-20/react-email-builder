import React from 'react';
import { getFooterIconBase64 } from '../utils/imageUtils';

// Convert camelCase to kebab-case for CSS properties
const kebabCase = (str) => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};

// Render a block as HTML
const renderBlockHtml = (block, template = null) => {
  const { type, content = '', settings = {} } = block;
  let blockHtml = '';

  // Prefer new vertical padding fields; keep legacy 'padding' as fallback only for top/bottom
  const resolvedSettings = {
    ...settings,
    paddingTop:
      settings.paddingTop ?? settings.padding ?? undefined,
    paddingBottom:
      settings.paddingBottom ?? settings.padding ?? undefined,
  };

  const styleString = Object.entries(resolvedSettings || {})
    .filter(
      ([key]) =>
        ![
          // non-style data keys excluded from inline styles
          'altText',
          'buttonUrl',
          'inline',
          'gap',
          'imagePosition',
          'imageWidth',
          'showButton',
          'buttonText',
          'buttonColor',
          'buttonTextColor',
          'linkLabel',
          'urls',
          'canvascolor',
          'textcolor',
          'disclaimercolor',
          'imageLinkUrl',
          'imageUrl',
          'imageAlt',
          'lineHeight',
          'lineColor',
          'height',
          'linklabel',
          // IMPORTANT: exclude legacy padding so only paddingTop/Bottom are used
          'padding',
        ].includes(key)
    )
    .map(([key, value]) => `${kebabCase(key)}: ${value};`)
    .join(' ');

  // Add side padding for non-image and non-spacer blocks
  const paddingStyle =
    type === 'image' || type === 'spacer' ? '' : 'padding-left: 12%; padding-right: 12%;';

  switch (type) {
    case 'header':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
        <tr>
          <td style="text-align: ${settings.textAlign || 'left'}; margin: 0; padding: 0;">
            <h1 style="margin: 0; ${styleString}">${content}</h1>
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

    case 'image': {
      const img = `<img src="${content}" alt="${settings.altText || ''}" style="max-width: 100%; border: 0; display: block;">`;
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr>
          <td style="text-align: ${settings.textAlign || 'left'};">
            ${
              settings.linkUrl
                ? `<a href="${settings.linkUrl}" _label="${settings.linkLabel || ''}">${img}</a>`
                : img
            }
          </td>
        </tr>
      </table>`;
      break;
    }

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

    case 'buttonGroup': {
      const buttonStyle = settings.inline ? 'display: inline-block;' : 'display: block;';
      const gapStyle = settings.inline ? `margin-right: ${settings.gap};` : `margin-bottom: ${settings.gap};`;

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
        <tr>
          <td style="text-align: center;">
            ${(block.buttons || [])
              .map(
                (button, index) => `
              <div style="${buttonStyle} ${index < block.buttons.length - 1 ? gapStyle : ''}">
                <a href="${button.settings?.linkUrl}" target="_blank" rel="noopener noreferrer" _label="${button.settings?.linkLabel || ''}">
                  <img src="${button.settings?.imageUrl}" alt="${button.settings?.imageAlt || ''}" style="max-width: 100%; display: block; margin: 0 auto; height: auto; border: 0;">
                </a>
              </div>`
              )
              .join('')}
          </td>
        </tr>
      </table>`;
      break;
    }

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

    case 'columns': {
      const cols = Array.isArray(block.columns) ? block.columns : [];
      const count = Math.max(cols.length, 1);
      const gap = settings?.columnGap || '0';
      const halfGap = /^-?\d+(\.\d+)?(px|em|rem|%)$/.test(gap) ? `calc((${gap}) / 2)` : '0';
      const widthPercent = (100 / count).toFixed(4);

      const cellHtml = cols
        .map((c, idx) => {
          const img = `<img src="${c?.content || ''}" alt="${c?.settings?.altText || ''}" style="max-width:100%;border:0;display:block;">`;
          const inner =
            c?.settings?.linkUrl
              ? `<a href="${c.settings.linkUrl}" _label="${c?.settings?.linkLabel || ''}">${img}</a>`
              : img;
          return `
            <td width="${widthPercent}%" style="padding-left:${idx === 0 ? '0' : halfGap};padding-right:${idx === count - 1 ? '0' : halfGap};">
              ${inner}
            </td>`;
        })
        .join('');

      blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} padding-left:12%;padding-right:12%;">
          <tr>${cellHtml}</tr>
        </table>`;
      break;
    }

    case 'halfText': {
      const imageHtml = settings.imageLinkUrl
        ? `<a href="${settings.imageLinkUrl}" target="_blank" rel="noopener noreferrer"><img src="${block.imageUrl}" alt="${settings.altText || ''}" style="max-width: 100%; border: 0; display: block;"></a>`
        : `<img src="${block.imageUrl}" alt="${settings.altText || ''}" style="max-width: 100%; border: 0; display: block;">`;

      const textContent = `
        <div style="color: ${settings.color}; font-size: ${settings.fontSize}; text-align: ${settings.textAlign}; font-family: ${settings.fontFamily};">
          ${content}
        </div>
        ${
          settings.showButton
            ? `<a href="${settings.buttonUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background-color: ${settings.buttonColor}; color: ${settings.buttonTextColor}; text-decoration: none; border-radius: 4px; margin-top: 16px;">${settings.buttonText}</a>`
            : ''
        }`;

      const imageContainerStyle = `width: ${settings.imageWidth}; vertical-align: top;`;
      const textContainerStyle = `width: ${settings.imageWidth === '40%' ? '60%' : '70%'}; vertical-align: top; padding: 0 20px;`;

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr>
          <td>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="${settings.imagePosition === 'left' ? imageContainerStyle : textContainerStyle}">
                  ${settings.imagePosition === 'left' ? imageHtml : textContent}
                </td>
                <td style="${settings.imagePosition === 'left' ? textContainerStyle : imageContainerStyle}">
                  ${settings.imagePosition === 'left' ? textContent : imageHtml}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
      break;
    }

    case 'footer':
    case 'footer_general_kz':
    case 'footer_sendpulse':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="height:50px;font-size:0;background-color:${settings.canvascolor || '#f5f5f5'};" height="50">&nbsp;</td>
        </tr>
        <!-- (cleaned footer kept as earlier messages) -->
      </table>`;
      break;

    default:
      blockHtml = '<div>Unknown block type</div>';
  }

  // Outer wrapper keeps background only (no vertical padding here)
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${settings.backgroundColor};">
    <tr>
      <td>
        ${blockHtml}
      </td>
    </tr>
  </table>`;
};

export default renderBlockHtml;
