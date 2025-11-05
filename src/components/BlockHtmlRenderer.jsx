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
    paddingTop: settings.paddingTop ?? settings.padding ?? undefined,
    paddingBottom: settings.paddingBottom ?? settings.padding ?? undefined,
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
    type === 'image' || type === 'spacer'
      ? ''
      : 'padding-left: 12%; padding-right: 12%;';

  const isKZ = type === 'footer_general_kz';
  const isSendpulse = type === 'footer_sendpulse';

  const t = isKZ
    ? {
        questions: 'Сұрақтарыңыз бар ма?',
        disclaimer:
          'Сіз Samsung хабарламаларының таратылымына жазылғандықтан осы хатты алдыңыз. Осы хатқа жауап қайтармаңыз. Бұл автоматты түрде жолданатын хабарлама. Біздің хабарламаларымызды алудан бас тарту үшін, осы ',
        link: 'сілтеме',
        disclaimer_end: 'арқылы өтуіңізді сұраймыз.',
        all_rights: ' Барлық құқықтар қорғалған.',
        address:
          'ТОО «SAMSUNG ELECTRONICS CENTRAL EURASIA» ЖШС (САМСУНГ ЭЛЕКТРОНИКС ОРТАЛЫҚ ЕУРАЗИЯ) Қазақстан Республикасы, Алматы қ., 050000, Желтоқсан көшесі, 115 үй, «Kaisar Plaza» сауда-кеңсе орталығы, 3-қабат.',
        legal: 'Құқықтық ақпарат',
        privacy: 'Құпиялылық саясаты',
      }
    : {
        questions: 'Есть вопросы?',
        disclaimer:
          'Вы получили это письмо, потому что подписались на рассылку Samsung. Не отвечайте на данное письмо. Оно является автоматической рассылкой. Чтобы отказаться от получения наших рассылок, пожалуйста, перейдите по этой ',
        link: 'ссылке',
        disclaimer_end: '',
        all_rights: ' Все права защищены.',
        address:
          'ТОО «SAMSUNG ELECTRONICS CENTRAL EURASIA» (САМСУНГ ЭЛЕКТРОНИКС ЦЕНТРАЛЬНАЯ ЕВРАЗИЯ) Республика Казахстан, г. Алматы, 050000, улица Желтоксан, д. 115, Торгово-офисный центр «Kaisar Plaza», 3 этаж.',
        legal: 'Правовая информация',
        privacy: 'Политика конфиденциальности',
      };

  switch (type) {
    case 'header':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle} ">
        <tr>
          <td style="text-align: ${
            settings.textAlign || 'left'
          }; margin: 0; padding: 0;">
            <h1 style="margin: 0; white-space:pre-wrap; ${styleString}">${content}</h1>
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
            <div style="white-space:pre-wrap;">${content}</div>
          </td>
        </tr>
      </table>`;
      break;

    case 'image': {
      const img = `<img src="${content}" alt="${
        settings.altText || ''
      }" style="max-width: 100%; border: 0; display: block;">`;
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr>
          <td style="text-align: ${settings.textAlign || 'left'};">
            ${
              settings.linkUrl
                ? `<a href="${settings.linkUrl}" _label="${
                    settings.linkLabel || ''
                  }">${img}</a>`
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

    case 'buttonCoded': {
      const paddingTop = settings?.paddingTop ?? '12px';
      const paddingBottom = settings?.paddingBottom ?? '12px';
      const paddingX = settings?.paddingX ?? '24px';
      const color = settings?.color ?? '#ffffff';
      const bg = settings?.buttonBgColor ?? '#000000';
      const border = settings?.border ?? 'none';
      const radius = settings?.borderRadius ?? '30px';
      const fontSize = settings?.fontSize ?? '16px';
      const fontWeight = settings?.fontWeight ?? 'bold';
      const text = settings?.content || 'Click Me';
      const href = settings?.linkUrl || '#';
      const align = settings?.textAlign || 'center';

      blockHtml = `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="${align}" style="padding:16px 0;">
                <a
                  href="${href}"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="
                    display:inline-block;
                    text-decoration:none;
                    color:${color};
                    background-color:${bg};
                    border:${border};
                    border-radius:${radius};
                    font-weight:${fontWeight};
                    font-size:${fontSize};
                    padding:${paddingTop} ${paddingX} ${paddingBottom} ${paddingX};
                    letter-spacing:0;
                    line-height:120%;
                    font-family: ${settings.fontFamily};
                  "
                >
                  ${text}
                </a>
              </td>
            </tr>
          </table>
        `;
      break;
    }

    case 'buttonGroup': {
      const buttonStyle = settings.inline
        ? 'display: inline-block;'
        : 'display: block;';
      const gapStyle = settings.inline
        ? `margin-right: ${settings.gap};`
        : `margin-bottom: ${settings.gap};`;

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
        <tr>
          <td style="text-align: center;">
            ${(block.buttons || [])
              .map(
                (button, index) => `
              <div style="${buttonStyle} ${
                  index < block.buttons.length - 1 ? gapStyle : ''
                }">
                <a href="${
                  button.settings?.linkUrl
                }" target="_blank" rel="noopener noreferrer" _label="${
                  button.settings?.linkLabel || ''
                }">
                  <img src="${button.settings?.imageUrl}" alt="${
                  button.settings?.imageAlt || ''
                }" style="max-width: 100%; display: block; margin: 0 auto; height: auto; border: 0;">
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
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}; padding: 10px 12%">
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
      const halfGap = /^-?\d+(\.\d+)?(px|em|rem|%)$/.test(gap)
        ? `calc((${gap}) / 2)`
        : '0';
      const widthPercent = (100 / count).toFixed(4);

      const cellHtml = cols
        .map((c, idx) => {
          const img = `<img src="${c?.content || ''}" alt="${
            c?.settings?.altText || ''
          }" style="max-width:100%;border:0;display:block;">`;
          const inner = c?.settings?.linkUrl
            ? `<a href="${c.settings.linkUrl}" _label="${
                c?.settings?.linkLabel || ''
              }">${img}</a>`
            : img;
          return `
            <td width="${widthPercent}%" style="padding-left:${
            idx === 0 ? '0' : halfGap
          };padding-right:${idx === count - 1 ? '0' : halfGap};">
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
      const imageSrc = settings.imageUrl || '';

      const imageHtml = settings.imageLinkUrl
        ? `<a href="${
            settings.imageLinkUrl
          }" target="_blank" rel="noopener noreferrer"><img src="${imageSrc}" alt="${
            settings.altText || ''
          }" style="max-width: 100%; border: 0; display: block;"></a>`
        : `<img src="${imageSrc}" alt="${
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
            ? `<a href="${settings.buttonUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background-color: ${settings.buttonColor}; color: ${settings.buttonTextColor}; text-decoration: none; border-radius: 4px; margin-top: 16px;">${settings.buttonText}</a>`
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
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding: 0 12%">
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
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${
          settings.canvascolor || '#f5f5f5'
        };">
          <tr>
            <td style="height:50px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
      
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;padding:0;">
                <tr>
                  <td style="width:120px;">&nbsp;</td>
                  ${[
                    'facebook',
                    'instagram',
                    'vk',
                    'youtube',
                    'twitter',
                    'linkedin',
                  ]
                    .map(
                      (key) => `
                      <td style="padding:0 16px;">
                        <a title="Samsung Kazakhstan" href="${
                          settings.urls?.[key] || '#'
                        }">
                          <img width="57" src="${getFooterIconBase64(
                            key
                          )}" alt="${key}" style="display:block;border:0;">
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
              <h1 style="margin:0 0 13px;font:${
                settings.fontWeight || 'bold'
              } 24px ${settings.fontFamily || 'Arial, sans-serif'};color:${
        settings.textcolor
      };line-height:1;">
      ${t.questions}
              </h1>
      
              <table role="presentation" cellspacing="0" cellpadding="7" border="0" style="margin:0 auto;color:${
                settings.textcolor
              };">
                <tr>
                 <td align="center">
                      <a href="${settings.urls.livechat}" style="font:11px ${
        settings.fontFamily || 'Arial, sans-serif'
      };color:${settings.textcolor};text-decoration:none;">
                        <img width="13" src="${getFooterIconBase64(
                          'chat'
                        )}" alt="chat" style="vertical-align:middle;">&nbsp;&nbsp;Онлайн чат
                      </a>
                    </td>
                     <td align="center">
                      <a href="${settings.urls.call}" style="font:11px ${
        settings.fontFamily || 'Arial, sans-serif'
      };color:${settings.textcolor};text-decoration:none;">
                        <img width="13" src="${getFooterIconBase64(
                          'call'
                        )}" alt="call" style="vertical-align:middle;">&nbsp;&nbsp;Call Center 7700
                      </a>
                    </td>
                  </tr>
                   </table>
              </td>
            </tr>
        
            <tr>
              <td align="center" style="padding:0 10%;text-align:center;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="500" style="margin:0 auto;color:${
                  settings.disclaimercolor
                };font:14px ${settings.fontFamily || 'Arial, sans-serif'};">
                  <tr><td style="height:26px;">&nbsp;</td></tr>
        
                  <tr>
                    <td>
                    ${
                      !isSendpulse
                        ? `${t.disclaimer}
                      <a href='${
                        settings.urls.optout
                      }' _type="optout" _label="${
                            settings.linklabel ||
                            template?.footerLinkLabel ||
                            ''
                          }" style="text-decoration:underline;color:${
                            settings.disclaimercolor
                          };">
      ${t.link}
                      </a> ${t.disclaimer_end}.
                      <br><br>`
                        : ''
                    }
                      ©${new Date().getFullYear()} Samsung Electronics Co., Ltd. ${
        t.all_rights
      }<br>
                      ${t.address}
                    </td>
                  </tr>
        
                  <tr><td style="height:24px;">&nbsp;</td></tr>
        
                  <tr>
                    <td>
                      <a href="${settings.urls.legal}" style="color:${
        settings.textcolor
      };text-decoration:underline;">${t.legal}</a>
                      &nbsp;|&nbsp;
                      <a href="${settings.urls.privacy}" style="color:${
        settings.textcolor
      };text-decoration:underline;">${t.privacy}</a>
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
