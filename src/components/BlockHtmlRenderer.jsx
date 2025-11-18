import React from 'react';

/** kebab-case helper for inline styles */
const kebabCase = (str) =>
  str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

/** Resolve a safe image src (ignore blob:/data: for final HTML) */
const getImageSrc = (s = {}) => {
  const src = s.settings?.imagePath || s.settings?.imageUrl || '';

  return typeof src === 'string' &&
    (src.startsWith('blob:') || src.startsWith('data:'))
    ? ''
    : src;
};

const sanitizePadding = (val) => {
  if (typeof val !== 'string') return val;
  const parts = val.trim().split(/\s+/);
  return parts[0]; // top or bottom only
};

/** Build inline style string from settings (filter out non-style keys) */
const buildStyle = (type, raw = {}) => {
  // prefer new vertical padding fields; legacy 'padding' only as fallback
  const settings = {
    ...raw,
    paddingTop: sanitizePadding(raw.paddingTop ?? raw.padding),
    paddingBottom: sanitizePadding(raw.paddingBottom ?? raw.padding),
  };

  const NON_STYLE_KEYS = new Set([
    // generic
    'altText',
    'imageAlt',
    'imageUrl',
    'imagePath',
    'imagePreviewUrl',
    'linkLabel',
    'linklabel',
    'linkUrl',
    'urls',
    'canvascolor',
    'textcolor',
    'disclaimercolor',
    // component-specific
    'inline',
    'gap',
    'imagePosition',
    'imageWidth',
    'showButton',
    'buttonText',
    'buttonUrl',
    'buttonColor',
    'buttonTextColor',
    'lineHeight',
    'lineColor',
    'height',
    // ensure we don't emit legacy 'padding' itself
    'padding',
  ]);

  const stylePairs = Object.entries(settings)
    .filter(
      ([k, v]) =>
        !NON_STYLE_KEYS.has(k) && v !== undefined && v !== null && v !== ''
    )
    .map(([k, v]) => `${kebabCase(k)}: ${v};`);

  // side padding for most blocks (keep images/spacers tight)
  const needsSidePad = !(
    type === 'image' ||
    type === 'spacer' ||
    type === 'header'
  );
  if (needsSidePad)
    stylePairs.push('padding-left: 12%;', 'padding-right: 12%;');

  return stylePairs.join(' ');
};

const tKZ = {
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
};

const tRU = {
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

/** Render a block to exportable HTML (string) */
const renderBlockHtml = (block, template = null) => {
  const { type, content = '', settings = {} } = block;
  const styleString = buildStyle(type, settings);
  let blockHtml = '';
  const paddingLeftRight = settings?.paddingX ?? '12%';

  switch (type) {
    /** HEADERS & TEXT */
    case 'header':
      {
        const src =
          settings?.imagePath ||
          settings?.imageUrl ||
          'https://placehold.co/80x80';

        const img = `<img src="${src}" alt="voucher" style="max-width:100%;border:0;display:block;margin:0 auto;">`;

        if (settings?.isImage) {
          blockHtml = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}; padding: 0 ${paddingLeftRight}">
      <tr>
        <td style="margin:0;padding:0;background-color:${
          settings.backgroundColor
        };">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
            <tr>
              <td style="vertical-align:middle;padding-right:16px;text-align:center;">
                ${img}
              </td>
              <td style="vertical-align:middle;text-align:${
                settings.textAlign || 'left'
              };">
                <h1 style="margin:0;white-space:pre-wrap;${buildStyle(
                  'header',
                  settings
                )}">${content}</h1>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
        } else {
          blockHtml = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}; padding: 0 ${paddingLeftRight}">
      <tr>
        <td style="text-align:${
          settings.textAlign || 'left'
        };margin:0;padding:0;background-color:${settings.backgroundColor};">
          <h1 style="margin:0;white-space:pre-wrap;${buildStyle(
            'header',
            settings
          )}">${content}</h1>
        </td>
      </tr>
    </table>`;
        }
      }
      break;

    case 'text':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr>
          <td style="text-align:${
            settings.textAlign || 'left'
          };margin:0;padding:0;background-color:${settings.backgroundColor};">
            <p style="white-space:pre-wrap;">${content}</p>
          </td>
        </tr>
      </table>`;
      break;

    /** IMAGE */
    case 'image': {
      const src =
        settings?.imagePath ||
        settings?.imageUrl ||
        'https://placehold.co/640x300';

      const img = `<img src="${src}" alt="${
        settings.altText || ''
      }" style="max-width:100%;border:0;display:block;margin:${
        settings.margin || '0 auto'
      }">`;
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${buildStyle(
        'image',
        settings
      )}">
        <tr>
          <td style="text-align:${
            settings.textAlign || 'left'
          };background-color:${settings.backgroundColor};">
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

    /** IMAGE BUTTON */
    case 'button': {
      const buttonImgSrc =
        getImageSrc(settings) || 'https://placehold.co/80x40';
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr>
          <td style="text-align:${
            settings.textAlign || 'center'
          };background-color:${settings.backgroundColor};">
            <a href="${
              settings.linkUrl || '#'
            }" target="_blank" rel="noopener noreferrer" _label="${
        settings.linkLabel || ''
      }">
              <img src="${buttonImgSrc}" alt="${
        settings.imageAlt || ''
      }" style="max-width:100%;display:block;margin:0 auto;height:auto;border:0;">
            </a>
          </td>
        </tr>
      </table>`;
      break;
    }

    /** CODED BUTTON */
    case 'buttonCoded': {
      const paddingTop = settings.paddingTop ?? '12px';
      const paddingBottom = settings.paddingBottom ?? '12px';
      const paddingX = settings.paddingX ?? '24px';
      const color = settings.color ?? '#ffffff';
      const bg = settings.buttonBgColor ?? '#000000';
      const bgCanvas = settings.backgroundColor ?? '#000000';
      const border = settings.border ?? 'none';
      const radius = settings.borderRadius ?? '30px';
      const fontSize = settings.fontSize ?? '16px';
      const fontWeight = settings.fontWeight ?? 'bold';
      const text = settings.content || 'Click Me';
      const href = settings.linkUrl || '#';
      const linkLabel = settings.linkLabel || '#';
      const align = settings.textAlign || 'center';

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="${align}" style="padding:16px 0;background-color:${bgCanvas};">
            <a href="${href}" target="_blank" _label="${linkLabel}" rel="noopener noreferrer" style="
              display:inline-block;text-decoration:none;color:${color};background-color:${bg};
              border:${border};border-radius:${radius};font-weight:${fontWeight};font-size:${fontSize};
              padding:${paddingTop} ${paddingX} ${paddingBottom} ${paddingX};letter-spacing:0;line-height:120%;
              font-family:${settings.fontFamily || 'Arial, sans-serif'};
            ">${text}</a>
          </td>
        </tr>
      </table>`;
      break;
    }

    /** IMAGE BUTTON GROUP */
    case 'buttonGroup': {
      const inline = !!settings.inline;
      const gap = settings.gap || '0';
      const wrapStyle = inline ? 'display:inline-block;' : 'display:block;';
      const sepStyle = inline
        ? `margin-right:${gap};`
        : `margin-bottom:${gap};`;

      const buttons = (block.buttons || [])
        .map((btn, i, arr) => {
          const s = btn?.settings || {};
          const imgSrc = getImageSrc(s) || 'https://placehold.co/80x40';
          return `
            <div style="${wrapStyle}${i < arr.length - 1 ? sepStyle : ''}">
              <a href="${
                s.linkUrl || '#'
              }" target="_blank" rel="noopener noreferrer" _label="${
            s.linkLabel || ''
          }">
                <img src="${imgSrc}" alt="${
            s.imageAlt || ''
          }" style="max-width:100%;display:block;margin:0 auto;height:auto;border:0;">
              </a>
            </div>`;
        })
        .join('');

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr><td style="text-align:center;background-color:${settings.backgroundColor};">${buttons}</td></tr>
      </table>`;
      break;
    }

    /** CODED BUTTON GROUP */
    case 'buttonCodedGroup': {
      const inline = !!settings.inline;
      const gap = settings.gap || '0';
      const wrapStyle = inline ? 'display:inline-block;' : 'display:block;';
      const sepStyle = inline
        ? `margin-right:${gap};`
        : `margin-bottom:${gap};`;

      const buttons = (block.buttons || [])
        .map((btn, i, arr) => {
          const s = btn?.settings || {};
          const label = s.content || 'Click Me';
          const href = s.linkUrl || '#';
          const linkLabel = s.linkLabel || '';
          const color = s.color ?? '#ffffff';
          const bg = s.buttonBgColor ?? '#000000';
          const padding = s.padding ?? '12px 24px';
          const fontSize = s.fontSize ?? '16px';
          const border = s.border ?? '1px solid #000000';

          return `
            <div style="${wrapStyle}${i < arr.length - 1 ? sepStyle : ''}">
              <a href="${href}" target="_blank" rel="noopener noreferrer" _label="${linkLabel}" style="display:inline-block;text-decoration:none;">
                <span style="
                  display:inline-block;text-decoration:none;letter-spacing:0;border-radius:30px;
                  font-weight:bold;font-size:${fontSize};color:${color};background-color:${bg};
                  border:${border};padding:${padding};line-height:120%;
                  font-family:${settings.fontFamily || 'Arial, sans-serif'};
                ">${label}</span>
              </a>
            </div>`;
        })
        .join('');

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr><td style="text-align:center;background-color:${settings.backgroundColor};">${buttons}</td></tr>
      </table>`;
      break;
    }

    /** DIVIDER & SPACER */
    case 'divider':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding-top:10px;padding-bottom:10px;padding-left:12%;padding-right:12%;">
        <tr><td style="height:${
          settings.lineHeight || '1px'
        };background-color:${settings.lineColor || '#ddd'};"></td></tr>
      </table>`;
      break;

    case 'spacer':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr><td style="height:${settings.height || '40px'};background-color:${
        settings.backgroundColor
      };"></td></tr>
      </table>`;
      break;

    /** COLUMNS */
    case 'columns': {
      const cols = Array.isArray(block.columns) ? block.columns : [];
      const count = Math.max(cols.length, 1);
      const gap = settings.columnGap || '0';
      const halfGap = /^-?\d+(\.\d+)?(px|em|rem|%)$/.test(gap)
        ? `${parseInt(gap) / 2}px`
        : '0';
      const widthPercent = (100 / count).toFixed(4);

      const cells = cols
        .map((c, idx) => {
          const src = c?.imagePath || c?.imageUrl || c?.content || '';

          const img = src
            ? `<img src="${src}" alt="${
                c?.settings?.altText || ''
              }" style="padding-left: ${
                idx === 0 ? '0' : idx === count - 1 ? gap : halfGap
              };border:0;display:block;width:100%!important;">`
            : '';
          const inner = c?.settings?.linkUrl
            ? `<a href="${c.settings.linkUrl}" _label="${
                c?.settings?.linkLabel || ''
              }">${img}</a>`
            : img;

          return `
            <td width="${widthPercent}%" style="background-color:${settings.backgroundColor};vertical-align:top;font-size:0;line-height:0;">
              ${inner}
            </td>`;
        })
        .join('');

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding-left:12%;padding-right:12%;">
        <tr>${cells}</tr>
      </table>`;
      break;
    }

    /** COLUMNS */
    case 'columnsContent': {
      const cols = Array.isArray(block.columns) ? block.columns : [];
      const count = Math.max(cols.length, 1);

      const gap = settings?.columnGap || '0';
      const halfGap =
        typeof gap === 'string' && /-?\d+(\.\d+)?(px|em|rem|%)$/.test(gap)
          ? `${parseInt(gap) / 2}px`
          : '0';

      const widthPercent = `${(100 / count).toFixed(4)}%`;

      const bg = settings?.backgroundColor || '#ffffff';
      const color = settings?.color || '#000000';
      const isBold = settings?.isBold || false;
      const fontFamily =
        settings?.fontFamily || 'SamsungOne, Arial, Helvetica, sans-serif';

      const paddingTop = settings?.paddingTop ?? settings?.padding ?? '0';
      const paddingBottom = settings?.paddingBottom ?? settings?.padding ?? '0';
      const paddingLeftRight = settings?.paddingX ?? '12%';

      const cellsHtml = (cols.length ? cols : [{}, {}, ...[]].slice(0, 1))
        .map((c, idx) => {
          const src = c?.imagePath || c?.imgUrl || '';
          const alt = (c?.settings?.altText || '').replace(/"/g, '&quot;');
          const textAlign = c?.textAlign || 'center';
          const titleSize = c?.settings?.titleFontSize || '24px';
          const textSize = c?.settings?.textFontSize || '12px';

          const imgHtml = src
            ? `<img src="${src}" alt="${alt}" style="max-width:100%;display:block;height:auto;border:0;margin: 0 auto;">`
            : ``;

          const wrappedImg = c?.settings?.linkUrl
            ? `<a href="${c.settings.linkUrl}" target="_blank" rel="noopener noreferrer">${imgHtml}</a>`
            : imgHtml;

          const titleHtml = settings?.hidetitle
            ? ``
            : `<h1 style="font-family:${fontFamily};font-size:${titleSize};line-height:1.2;color:${color};padding:16px 0 8px;text-align:${textAlign};">${
                c?.title || ''
              }</h1>`;

          const textPad = settings?.hidetitle ? '16px 0' : '0';
          const textHtml = `<p style="font-family:${fontFamily};font-size:${textSize};line-height:1.4;color:${color};padding:${textPad};margin:0;text-align:${textAlign};font-weight:${
            isBold ? 'bold' : 'normal'
          }">${c?.text || ''}</p>`;

          const padLeft = idx === 0 ? '0' : halfGap;
          const padRight = idx === count - 1 ? '0' : halfGap;

          return `
            <td width="${widthPercent}" valign="top" style="text-align:${textAlign};padding-left:${padLeft};padding-right:${padRight};">
              ${wrappedImg}
              ${titleHtml}
              ${textHtml}
            </td>`;
        })
        .join('');

      blockHtml += `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${bg};padding-top:${paddingTop};padding-bottom:${paddingBottom};padding-left:${paddingLeftRight};padding-right:${paddingLeftRight};">
          <tbody>
            <tr>
              <td>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tbody>
                    <tr>
                      ${cellsHtml}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>`;
      break;
    }

    /** HALF TEXT */
    case 'halfText': {
      const imageSrc =
        block.imagePath ||
        block.imageUrl ||
        getImageSrc(settings) ||
        'https://placehold.co/640x300';

      const imageHtml = settings.imageLinkUrl
        ? `<a href="${
            settings.imageLinkUrl
          }" target="_blank" rel="noopener noreferrer"><img src="${imageSrc}" alt="${
            settings.altText || ''
          }" style="max-width:100%;border:0;display:block;"></a>`
        : `<img src="${imageSrc}" alt="${
            settings.altText || ''
          }" style="max-width:100%;border:0;display:block;">`;

      const textHtml = `
        <p style="color:${settings.color};font-size:${
        settings.fontSize
      };text-align:${settings.textAlign};font-family:${settings.fontFamily};">
          ${content}
        </p>
        ${
          settings.showButton
            ? `<a href="${
                settings.buttonUrl || '#'
              }" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:8px 16px;background-color:${
                settings.buttonColor
              };color:${
                settings.buttonTextColor
              };text-decoration:none;border-radius:4px;margin-top:16px;">${
                settings.buttonText
              }</a>`
            : ''
        }`;

      // default to image on the RIGHT (second cell), per editor request
      const imageLeft =
        settings.imagePosition === 'left'
          ? true
          : settings.imagePosition === 'right'
          ? false
          : false;
      const imgW = settings.imageWidth || '260px';
      const textW = `${100 - parseInt(imgW)}%`;
      const imgTdStyle = `width:${imgW};vertical-align:top;`;
      const textTdStyle = `width:${textW};vertical-align:top;padding:0 20px;`;

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding:0 12%;background-color:${
              settings.backgroundColor
            };">
              <tr>
                <td style="${imageLeft ? imgTdStyle : textTdStyle}">
                  ${imageLeft ? imageHtml : textHtml}
                </td>
                <td style="${imageLeft ? textTdStyle : imgTdStyle}">
                  ${imageLeft ? textHtml : imageHtml}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;
      break;
    }

    // ROUND CONTAINER
    case 'roundContainer': {
      const s = settings || {};
      const canvasColor = s.canvasColor || '#CFCFCF';
      const backgroundColor = s.backgroundColor || '#FFFFFF';
      const bgWidth = Number(s.bgWidth ?? 88);
      const borderColor = s.borderColor || '#FFFFFF';
      const borderWidth = Number(s.borderWidth ?? 3);
      const borderType = s.borderType || 'solid';
      const borderRadius = Number(s.borderRadius ?? 24);
      const paddingTop = Number(s.paddingTop ?? 8);
      const paddingBottom = Number(s.paddingBottom ?? 8);
      const paddingInnerTop = Number(s.paddingInnerTop ?? 64);
      const paddingInnerBottom = Number(s.paddingInnerBottom ?? 64);

      const kids = Array.isArray(block.children) ? block.children : [];

      // Wrap each child in a 1x1 table that can carry corner radii.
      const childrenHTML = kids
        .map((child, i) => {
          const isFirst = i === 0;
          const isLast = i === kids.length - 1;

          const topLeft = isFirst ? borderRadius : 0;
          const topRight = isFirst ? borderRadius : 0;
          const bottomLeft = isLast ? borderRadius : 0;
          const bottomRight = isLast ? borderRadius : 0;

          const childHtml = renderBlockHtml(child, template);

          // Email-safe wrapper table with separate border-radius on corners, no padding
          return `
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                   style="border-collapse:separate;border-spacing:0;
                          border-top-left-radius:${topLeft}px;border-top-right-radius:${topRight}px;
                          border-bottom-left-radius:${bottomLeft}px;border-bottom-right-radius:${bottomRight}px;
                          overflow:hidden;">
              <tr>
                <td style="padding:0;">
                  ${childHtml}
                </td>
              </tr>
            </table>
          `;
        })
        .join('');

      const topPadRow =
        paddingTop > 0
          ? `<tr><td style="mso-line-height-rule:exactly;height:${paddingTop}px;font-size:0;border:0;background-color:${canvasColor}" bgcolor="${canvasColor}" height="${paddingTop}">&nbsp;</td></tr>`
          : '';

      const bottomPadRow =
        paddingBottom > 0
          ? `<tr><td style="mso-line-height-rule:exactly;height:${paddingBottom}px;font-size:0;border:0;background-color:${canvasColor}" bgcolor="${canvasColor}" height="${paddingBottom}">&nbsp;</td></tr>`
          : '';

      blockHtml = `
        ${topPadRow}
        <tr>
          <td style="border:0;margin:0 auto;mso-line-height-rule:exactly;background-color:${canvasColor};padding-top:${paddingInnerTop}px;padding-bottom:${paddingInnerBottom}px;">
            <table align="center" cellpadding="0" cellspacing="0" border="0"
              style="border-collapse:separate;border:${borderWidth}px ${borderType} ${borderColor};
                     border-radius:${borderRadius}px;margin:0 auto;width:${bgWidth}%;
                     padding:0;text-align:center;background-color:${backgroundColor};">
              <tbody>
                <tr>
                  <td style="padding:0;">
                    ${childrenHTML}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        ${bottomPadRow}
      `;
      break;
    }

    /** FOOTERS */
    case 'footer':
    case 'footer_general_kz':
    case 'footer_sendpulse': {
      const isKZ = type === 'footer_general_kz';
      const isSendpulse = type === 'footer_sendpulse';
      const dict = isKZ ? tKZ : tRU;

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${
        settings.canvascolor || '#f5f5f5'
      };">
        <tr><td style="height:50px;font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- Socials -->
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
                          <img width="57" src="i/${key}.png" alt="${key}" style="display:block;border:0;">
                        </a>
                      </td>`
                  )
                  .join('')}                
                <td style="width:120px;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Contact -->
        <tr>
          <td align="center" style="padding-top:16px;padding-bottom:16px;padding-left:10%;padding-right:10%;text-align:center;">
            <h1 style="margin:0 0 13px;font:${
              settings.fontWeight || 'bold'
            } 24px ${settings.fontFamily || 'Arial, sans-serif'};color:${
        settings.textcolor
      };line-height:1;">
              ${dict.questions}
            </h1>

            <table role="presentation" cellspacing="0" cellpadding="7" border="0" style="margin:0 auto;color:${
              settings.textcolor
            };">
              <tr>
                <td align="center" style="padding-left:16px;">
                  <a href="${
                    settings.urls?.livechat || '#'
                  }" style="font:11px ${
        settings.fontFamily || 'Arial, sans-serif'
      };color:${settings.textcolor};text-decoration:none;">
                    <img width="13" src="i/chat.png" alt="chat" style="vertical-align:middle;">&nbsp;&nbsp;Онлайн чат
                  </a>
                </td>
                <td align="center">
                  <a href="${settings.urls?.call || '#'}" style="font:11px ${
        settings.fontFamily || 'Arial, sans-serif'
      };color:${settings.textcolor};text-decoration:none;">
                    <img width="13" src="i/call.png" alt="call" style="vertical-align:middle;">&nbsp;&nbsp;Call Center 7700
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Legal -->
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
                      ? `${dict.disclaimer}
                        <a href='${
                          settings.urls?.optout || '#'
                        }' _type="optout" _label="${
                          settings.linklabel || template?.footerLinkLabel || ''
                        }" style="text-decoration:underline;color:${
                          settings.disclaimercolor
                        };">${dict.link}</a> ${dict.disclaimer_end}<br><br>`
                      : ''
                  }
                  ©${new Date().getFullYear()} Samsung Electronics Co., Ltd. ${
        dict.all_rights
      }<br>
                  ${dict.address}
                </td>
              </tr>

              <tr><td style="height:24px;">&nbsp;</td></tr>

              <tr>
                <td>
                  <a href="${settings.urls?.legal || '#'}" style="color:${
        settings.textcolor
      };text-decoration:underline;">${dict.legal}</a>
                  &nbsp;|&nbsp;
                  <a href="${settings.urls?.privacy || '#'}" style="color:${
        settings.textcolor
      };text-decoration:underline;">${dict.privacy}</a>
                </td>
              </tr>

              <tr><td style="height:115px;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>
      </table>`;
      break;
    }

    default:
      blockHtml = '<p>Unknown block type</p>';
  }

  // outer wrapper: keep only background color here
  const bg = settings.backgroundColor
    ? `background-color:${settings.backgroundColor};`
    : '';
  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${bg}">
    <tr><td>${blockHtml}</td></tr>
  </table>`;
};

export default renderBlockHtml;
