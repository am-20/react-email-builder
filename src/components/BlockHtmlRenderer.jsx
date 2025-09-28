import React from 'react';
import { getFooterIconBase64 } from '../utils/imageUtils';

// Convert camelCase to kebab-case for CSS properties
const kebabCase = (str) => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};

// Render a block as HTML
const renderBlockHtml = (block, template = null) => {
  const { type, content, settings } = block;
  let blockHtml = '';

  const styleString = Object.entries(settings || {})
    .filter(
      ([key]) =>
        ![
          'altText',
          'buttonUrl',
          'inline',
          'gap',
          'imagePosition',
          'imageWidth',
          'showButton',
          'buttonText',
          'buttonUrl',
          'buttonColor',
          'buttonTextColor',
          'linkLabel',
        ].includes(key)
    )
    .map(([key, value]) => `${kebabCase(key)}: ${value};`)
    .join(' ');

  // Add padding styles for non-image and non-spacer blocks
  const paddingStyle =
    type === 'image' || type === 'spacer'
      ? ''
      : 'padding-left: 12%; padding-right: 12%;';

  switch (type) {
    case 'header':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
        <tr>
          <td style="text-align: ${
            settings.textAlign || 'left'
          }; margin: 0; padding: 0;">
            <h1 style="margin: 0; ${styleString} padding: 0;">${content}</h1>
          </td>
        </tr>
      </table>`;
      break;
    case 'text':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
        <tr>
          <td style="text-align: ${
            settings.textAlign || 'left'
          }; margin: 0; padding: 0;">
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
              <a href="${settings.linkUrl}" _label="${
          settings.linkLabel || ''
        }">
                <img src="${content}" alt="${
          settings.altText || ''
        }" style="max-width: 100%; border: 0; display: block;">
              </a>
            </td>
          </tr>
        </table>`;
      } else {
        blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
          <tr>
            <td style="text-align: ${settings.textAlign || 'left'};">
              <img src="${content}" alt="${
          settings.altText || ''
        }" style="max-width: 100%; border: 0; display: block;">
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
            <a href="${
              settings.linkUrl
            }" target="_blank" rel="noopener noreferrer" _label="${
        settings.linkLabel || ''
      }">
              <img src="${settings.imageUrl}" alt="${
        settings.imageAlt || ''
      }" style="max-width: 100%; display: block; margin: 0 auto; height: auto; border: 0;">
            </a>
          </td>
        </tr>
      </table>`;
      break;
    case 'buttonGroup': {
      const buttonStyle = block.settings.inline
        ? 'display: inline-block;'
        : 'display: block;';
      const gapStyle = block.settings.inline
        ? `margin-right: ${block.settings.gap};`
        : `margin-bottom: ${block.settings.gap};`;

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
        <tr>
          <td style="text-align: center;">
            ${block.buttons
              .map(
                (button, index) => `
              <div style="${buttonStyle} ${
                  index < block.buttons.length - 1 ? gapStyle : ''
                }">
                <a href="${
                  button.settings.linkUrl
                }" target="_blank" rel="noopener noreferrer" _label="${
                  button.settings.linkLabel || ''
                }">
                  <img src="${button.settings.imageUrl}" alt="${
                  button.settings.imageAlt || ''
                }" style="max-width: 100%; display: block; margin: 0 auto; height: auto; border: 0;">
                </a>
              </div>
            `
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
    case 'columns':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} padding-left: 12%; padding-right: 12%;">
        <tr>
          <td width="50%" style="padding: 0 8px;">
            ${
              block.columns[0].settings?.linkUrl
                ? `<a href="${block.columns[0].settings.linkUrl}" _label="${
                    block.columns[0].settings?.linkLabel || ''
                  }"><img src="${block.columns[0].content}" alt="${
                    block.columns[0].settings?.altText || ''
                  }" style="max-width: 100%; border: 0; display: block;"></a>`
                : `<img src="${block.columns[0].content}" alt="${
                    block.columns[0].settings?.altText || ''
                  }" style="max-width: 100%; border: 0; display: block;">`
            }
          </td>
          <td width="50%" style="padding: 0 8px;">
            ${
              block.columns[1].settings?.linkUrl
                ? `<a href="${block.columns[1].settings.linkUrl}" _label="${
                    block.columns[1].settings?.linkLabel || ''
                  }"><img src="${block.columns[1].content}" alt="${
                    block.columns[1].settings?.altText || ''
                  }" style="max-width: 100%; border: 0; display: block;"></a>`
                : `<img src="${block.columns[1].content}" alt="${
                    block.columns[1].settings?.altText || ''
                  }" style="max-width: 100%; border: 0; display: block;">`
            }
          </td>
        </tr>
      </table>`;
      break;
    case 'halfText': {
      const imageHtml = settings.imageLinkUrl
        ? `<a href="${
            settings.imageLinkUrl
          }" target="_blank" rel="noopener noreferrer"><img src="${
            block.imageUrl
          }" alt="${
            settings.altText || ''
          }" style="max-width: 100%; border: 0; display: block;"></a>`
        : `<img src="${block.imageUrl}" alt="${
            settings.altText || ''
          }" style="max-width: 100%; border: 0; display: block;">`;

      const textContent = `
        <div style="color: ${settings.color}; font-size: ${
        settings.fontSize
      }; text-align: ${settings.textAlign}; font-family: ${
        settings.fontFamily
      };">
          ${content}
        </div>
        ${
          settings.showButton
            ? `
          <a href="${settings.buttonUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background-color: ${settings.buttonColor}; color: ${settings.buttonTextColor}; text-decoration: none; border-radius: 4px; margin-top: 16px;">
            ${settings.buttonText}
          </a>
        `
            : ''
        }`;

      const imageContainerStyle = `width: ${settings.imageWidth}; vertical-align: top;`;
      const textContainerStyle = `width: ${
        settings.imageWidth === '40%' ? '60%' : '70%'
      }; vertical-align: top; padding: 0 20px;`;

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr>
          <td>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="${
                  settings.imagePosition === 'left'
                    ? imageContainerStyle
                    : textContainerStyle
                }">
                  ${settings.imagePosition === 'left' ? imageHtml : textContent}
                </td>
                <td style="${
                  settings.imagePosition === 'left'
                    ? textContainerStyle
                    : imageContainerStyle
                }">
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
          <td style="height:50px;font-size:0;background-color:${
            settings.canvascolor || '#f5f5f5'
          };" height="50">&nbsp;</td>
        </tr>
        <tr>
          <td bgcolor="${settings.canvascolor}" align="center">
            <table class="w100pc" style="width:100%;margin:0;padding:0;" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:120px;">&nbsp;</td>
                <td class="paddLR10px" style="padding-left:16px;padding-right:16px;"><a title="Samsung Kazakhstan" href="${
                  settings.urls.facebook
                }"><img border="0" width="57" src="${getFooterIconBase64('facebook')}" alt="Facebook"></a></td>
                <td class="paddLR10px" style="padding-left:16px;padding-right:16px;"><a title="Samsung Kazakhstan" href="${
                  settings.urls.instagram
                }"><img border="0" width="57" src="${getFooterIconBase64('instagram')}" alt="Instagram"></a></td>
                <td class="paddLR10px" style="padding-left:16px;padding-right:16px;"><a title="Samsung Kazakhstan" href="${
                  settings.urls.vkontakte
                }"><img border="0" width="57" src="${getFooterIconBase64('vk')}" alt="VK"></a></td>
                <td class="paddLR10px" style="padding-left:16px;padding-right:16px;"><a title="Samsung Kazakhstan" href="${
                  settings.urls.youtube
                }"><img border="0" width="57" src="${getFooterIconBase64('youtube')}" alt="Youtube"></a></td>
                <td class="paddLR10px" style="padding-left:16px;padding-right:16px;"><a title="Samsung Kazakhstan" href="${
                  settings.urls.twitter
                }"><img border="0" width="57" src="${getFooterIconBase64('twitter')}" alt="Twitter"></a></td>
                <td class="paddLR10px" style="padding-left:16px;padding-right:16px;"><a title="Samsung Kazakhstan" href="${
                  settings.urls.linkedin
                }"><img border="0" width="57" src="${getFooterIconBase64('linkedin')}" alt="LinkedIn"></a></td>
                <td style="width:120px;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="${
            settings.canvascolor || '#f5f5f5'
          }" align="center" style="text-align:center;padding-top:16px;padding-left:10%;padding-right:10%;background-color: ${
        settings.canvascolor
      };">
            <h1 style="font-family:${
              settings.fontFamily || 'Arial, sans-serif'
            };font-size:24px;font-weight:bold;margin:0;margin-bottom:13px;color:${
        settings.textcolor
      };line-height:1;">Есть вопросы?</h1>
            <table style="margin:0;margin-left:auto;margin-right:auto;padding:0;text-align:center;color:${
              settings.textcolor
            };" cellpadding="15" cellspacing="0">
                <tbody>
                  <tr>
                    <td valign="top" align="center" style="padding:7px">
                      <a style="font-family:${
                        settings.fontFamily || 'Arial, sans-serif'
                      };font-size:11px;color:${
        settings.textcolor
      };text-decoration:none;" href="${settings.urls.livechat}">
                        <img width="13" src="${getFooterIconBase64('chat')}" alt="chat"/> 
                        &nbsp;&nbsp;Онлайн чат
                      </a>
                    </td>
                    <td valign="top" align="center" style="padding:7px">
                      <a style="font-family:${
                        settings.fontFamily || 'Arial, sans-serif'
                      };font-size:11px;color:${
        settings.textcolor
      };text-decoration:none;" href="${settings.urls.call}">
                        <img width="13" src="${getFooterIconBase64('call')}" alt="call"/> 
                        &nbsp;&nbsp;Call Center 7700
                      </a>
                    </td>
                  </tr>
                </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="${settings.canvascolor}" align="center">
            <table style="width:500px;margin:0;padding:0;text-align:center;color:${
              settings.disclaimercolor
            };" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="height:26px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="font-size:14px;color:${
                  settings.disclaimercolor
                };font-family:${settings.fontFamily || 'Arial, sans-serif'};">
                  Вы получили это письмо, потому что подписались на&nbsp;рассылку Samsung. Не отвечайте на&nbsp;данное письмо. Оно является автоматической рассылкой. Чтобы отказаться от получения наших рассылок, пожалуйста, перейдите по&nbsp;этой <a style="text-decoration:underline;color:${
                    settings.disclaimercolor
                  };font-family:${
        settings.fontFamily || 'Arial, sans-serif'
      };" href="${settings.urls.optout}" _type="optout" _label="${
        settings.linklabel || template?.footerLinkLabel || ''
      }">ссылке</a>.<br /><br />
                  ©${new Date().getFullYear()} Samsung Electronics Co., Ltd. Все права защищены.<br />
                  ТОО &laquo;SAMSUNG ELECTRONICS CENTRAL EURASIA&raquo;<br />
                  (САМСУНГ ЭЛЕКТРОНИКС ЦЕНТРАЛЬНАЯ ЕВРАЗИЯ)<br />
                  Республика Казахстан, г. Алматы, 050000, улица Желтоксан, д. 115,<br />
                  Торгово-офисный центр &laquo;Kaisar Plaza&raquo;, 3 этаж.
                </td>
              </tr>
              <tr>
                <td style="height:24px;" height="24">&nbsp;</td>
              </tr>
              <tr>
                <td style="height:24px;color:${
                  settings.disclaimercolor
                };font-size:14px;font-family:${
        settings.fontFamily || 'Arial, sans-serif'
      };" height="24">
                  <a style="font-size:14px;color:${
                    settings.textcolor
                  };text-decoration:underline;font-family:${
        settings.fontFamily || 'Arial, sans-serif'
      };" href="${settings.urls.legal}">Правовая информация</a>&nbsp;|&nbsp;
                  <a style="font-size:14px;color:${
                    settings.textcolor
                  };text-decoration:underline;font-family:${
        settings.fontFamily || 'Arial, sans-serif'
      };" href="${settings.urls.privacy}">Политика конфиденциальности</a>
                </td>
              </tr>
              <tr>
                <td style="height:115px;" height="115">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
      break;
    default:
      blockHtml = '<div>Unknown block type</div>';
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
