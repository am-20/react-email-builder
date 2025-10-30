import React from 'react';
import { getFooterIconBase64 } from '../utils/imageUtils';

// Convert camelCase to kebab-case
const kebabCase = (str) =>
  str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

// Shared table attributes
const baseTable = 'role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"';

// Generate inline style string safely
const styleFromSettings = (settings = {}) =>
  Object.entries(settings)
    .filter(([key]) =>
      ![
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
      ].includes(key)
    )
    .map(([k, v]) => `${kebabCase(k)}: ${v};`)
    .join(' ');

const renderBlockHtml = (block = {}, template = null) => {
  const { type, content = '', settings = {} } = block;
  const styleString = styleFromSettings(settings);
  const paddingStyle =
    type === 'image' || type === 'spacer' ? '' : 'padding-left: 12%; padding-right: 12%;';
  let blockHtml = '';

  switch (type) {
    case 'header':
      blockHtml = `
        <table ${baseTable} style="${styleString} ${paddingStyle}">
          <tr><td style="text-align:${settings.textAlign || 'left'};">
            <h1 style="margin:0;${styleString}">${content}</h1>
          </td></tr>
        </table>`;
      break;

    case 'text':
      blockHtml = `
        <table ${baseTable} style="${styleString} ${paddingStyle}">
          <tr><td style="text-align:${settings.textAlign || 'left'};">
            <div>${content}</div>
          </td></tr>
        </table>`;
      break;

    case 'image':
      const img = `<img src="${content}" alt="${settings.altText || ''}" style="max-width:100%;border:0;display:block;">`;
      blockHtml = `
        <table ${baseTable} style="${styleString}">
          <tr><td style="text-align:${settings.textAlign || 'left'};">
            ${settings.linkUrl ? `<a href="${settings.linkUrl}" _label="${settings.linkLabel || ''}">${img}</a>` : img}
          </td></tr>
        </table>`;
      break;

    case 'button':
      blockHtml = `
        <table ${baseTable} style="${styleString} ${paddingStyle}">
          <tr><td style="text-align:${settings.textAlign || 'center'};">
            <a href="${settings.linkUrl}" target="_blank" rel="noopener noreferrer" _label="${settings.linkLabel || ''}">
              <img src="${settings.imageUrl}" alt="${settings.imageAlt || ''}" style="max-width:100%;display:block;margin:0 auto;height:auto;border:0;">
            </a>
          </td></tr>
        </table>`;
      break;

    case 'buttonGroup':
      const inline = settings.inline ? 'display:inline-block;' : 'display:block;';
      const gap = settings.gap ? (settings.inline ? `margin-right:${settings.gap};` : `margin-bottom:${settings.gap};`) : '';
      blockHtml = `
        <table ${baseTable} style="${styleString} ${paddingStyle}">
          <tr><td style="text-align:center;">
            ${block.buttons
              ?.map(
                (btn, i) => `
                <div style="${inline}${i < block.buttons.length - 1 ? gap : ''}">
                  <a href="${btn.settings?.linkUrl}" target="_blank" rel="noopener noreferrer" _label="${btn.settings?.linkLabel || ''}">
                    <img src="${btn.settings?.imageUrl}" alt="${btn.settings?.imageAlt || ''}" style="max-width:100%;display:block;margin:0 auto;height:auto;border:0;">
                  </a>
                </div>`
              )
              .join('') || ''}
          </td></tr>
        </table>`;
      break;

    case 'divider':
      blockHtml = `
        <table ${baseTable} style="${styleString}">
          <tr><td style="height:${settings.lineHeight};background-color:${settings.lineColor};"></td></tr>
        </table>`;
      break;

    case 'spacer':
      blockHtml = `
        <table ${baseTable} style="${styleString}">
          <tr><td style="height:${settings.height};"></td></tr>
        </table>`;
      break;

    case 'columns':
      const col = (c) =>
        c?.settings?.linkUrl
          ? `<a href="${c.settings.linkUrl}" _label="${c.settings.linkLabel || ''}">
              <img src="${c.content}" alt="${c.settings.altText || ''}" style="max-width:100%;border:0;display:block;">
             </a>`
          : `<img src="${c.content}" alt="${c.settings?.altText || ''}" style="max-width:100%;border:0;display:block;">`;

      blockHtml = `
        <table ${baseTable} style="${styleString} padding-left:12%;padding-right:12%;">
          <tr>
            <td width="50%" style="padding:0 8px;">${col(block.columns?.[0])}</td>
            <td width="50%" style="padding:0 8px;">${col(block.columns?.[1])}</td>
          </tr>
        </table>`;
      break;

    case 'halfText':
      const image = `<img src="${block.imageUrl}" alt="${settings.altText || ''}" style="max-width:100%;border:0;display:block;">`;
      const imageHtml = settings.imageLinkUrl
        ? `<a href="${settings.imageLinkUrl}" target="_blank" rel="noopener noreferrer">${image}</a>`
        : image;
      const button =
        settings.showButton && settings.buttonUrl
          ? `<a href="${settings.buttonUrl}" target="_blank" style="display:inline-block;padding:8px 16px;background:${settings.buttonColor};color:${settings.buttonTextColor};text-decoration:none;border-radius:4px;margin-top:16px;">${settings.buttonText}</a>`
          : '';
      const text = `
        <div style="color:${settings.color};font-size:${settings.fontSize};text-align:${settings.textAlign};font-family:${settings.fontFamily};">
          ${content}
        </div>${button}`;
      const imageCell = `width:${settings.imageWidth || '40%'};vertical-align:top;`;
      const textCell = `width:${settings.imageWidth === '40%' ? '60%' : '70%'};vertical-align:top;padding:0 20px;`;

      blockHtml = `
        <table ${baseTable} style="${styleString}">
          <tr><td>
            <table ${baseTable}>
              <tr>
                ${settings.imagePosition === 'left'
                  ? `<td style="${imageCell}">${imageHtml}</td><td style="${textCell}">${text}</td>`
                  : `<td style="${textCell}">${text}</td><td style="${imageCell}">${imageHtml}</td>`}
              </tr>
            </table>
          </td></tr>
        </table>`;
      break;

      case 'footer':
        case 'footer_general_kz':
        case 'footer_sendpulse':
          blockHtml = `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${settings.canvascolor || '#f5f5f5'};">
            <tr>
              <td style="height:50px;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
        
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;padding:0;">
                  <tr>
                    <td style="width:120px;">&nbsp;</td>
                    ${['facebook','instagram','vk','youtube','twitter','linkedin']
                      .map(
                        (key) => `
                        <td style="padding:0 16px;">
                          <a title="Samsung Kazakhstan" href="${settings.urls?.[key] || '#'}">
                            <img width="57" src="${getFooterIconBase64(key)}" alt="${key}" style="display:block;border:0;">
                          </a>
                        </td>`
                      )
                      .join('')}
                    <td style="width:120px;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
        
            <tr>
              <td align="center" style="padding:16px 10%;text-align:center;">
                <h1 style="margin:0 0 13px;font:${settings.fontWeight || 'bold'} 24px ${settings.fontFamily || 'Arial, sans-serif'};color:${settings.textcolor};line-height:1;">
                  Есть вопросы?
                </h1>
        
                <table role="presentation" cellspacing="0" cellpadding="7" border="0" style="margin:0 auto;color:${settings.textcolor};">
                  <tr>
                    <td align="center">
                      <a href="${settings.urls.livechat}" style="font:11px ${settings.fontFamily || 'Arial, sans-serif'};color:${settings.textcolor};text-decoration:none;">
                        <img width="13" src="${getFooterIconBase64('chat')}" alt="chat" style="vertical-align:middle;">&nbsp;&nbsp;Онлайн чат
                      </a>
                    </td>
                    <td align="center">
                      <a href="${settings.urls.call}" style="font:11px ${settings.fontFamily || 'Arial, sans-serif'};color:${settings.textcolor};text-decoration:none;">
                        <img width="13" src="${getFooterIconBase64('call')}" alt="call" style="vertical-align:middle;">&nbsp;&nbsp;Call Center 7700
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
        
            <tr>
              <td align="center" style="padding:0 10%;text-align:center;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="500" style="margin:0 auto;color:${settings.disclaimercolor};font:14px ${settings.fontFamily || 'Arial, sans-serif'};">
                  <tr><td style="height:26px;">&nbsp;</td></tr>
        
                  <tr>
                    <td>
                      Вы получили это письмо, потому что подписались на рассылку Samsung. Не отвечайте на данное письмо — оно является автоматической рассылкой.
                      Чтобы отказаться от получения наших рассылок, пожалуйста, перейдите по этой
                      <a href="${settings.urls.optout}" _type="optout" _label="${settings.linklabel || template?.footerLinkLabel || ''}" style="text-decoration:underline;color:${settings.disclaimercolor};">
                        ссылке
                      </a>.
                      <br><br>
                      ©${new Date().getFullYear()} Samsung Electronics Co., Ltd. Все права защищены.<br>
                      ТОО &laquo;SAMSUNG ELECTRONICS CENTRAL EURASIA&raquo;<br>
                      (САМСУНГ ЭЛЕКТРОНИКС ЦЕНТРАЛЬНАЯ ЕВРАЗИЯ)<br>
                      Республика Казахстан, г. Алматы, 050000, улица Желтоксан, д. 115,<br>
                      Торгово-офисный центр &laquo;Kaisar Plaza&raquo;, 3 этаж.
                    </td>
                  </tr>
        
                  <tr><td style="height:24px;">&nbsp;</td></tr>
        
                  <tr>
                    <td>
                      <a href="${settings.urls.legal}" style="color:${settings.textcolor};text-decoration:underline;">Правовая информация</a>
                      &nbsp;|&nbsp;
                      <a href="${settings.urls.privacy}" style="color:${settings.textcolor};text-decoration:underline;">Политика конфиденциальности</a>
                    </td>
                  </tr>
        
                  <tr><td style="height:115px;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
          </table>`;
          break;        

    default:
      blockHtml = '<div>Unknown block type</div>';
  }

  return `
    <table ${baseTable} style="background-color:${settings.backgroundColor || '#ffffff'};">
      <tr><td>${blockHtml}</td></tr>
    </table>`;
};

export default renderBlockHtml;
