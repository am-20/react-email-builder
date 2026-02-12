import React from 'react';
import {
  parsePadding,
  createLink,
  createImage,
  calculateHalfGap,
  calculateSpacerWidth,
  calculateColumnWidth,
  getDefaults,
  COMMON_DEFAULTS,
  renderButton,
  renderButtonGroup,
} from '../helpers';
import { translationsKZ, translationsRU } from '../i18n/translations';

/** kebab-case helper for inline styles */
const kebabCase = (str) =>
  str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

// Extract first value from CSS padding shorthand (top or bottom)
const sanitizePadding = (val) =>
  typeof val === 'string' ? val.trim().split(/\s+/)[0] : val;

// Keys to exclude from style string generation (created once, not on every call)
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
  'buttonBgColor',
  'border',
  'borderRadius',
  'content',
  'lineHeight',
  'lineColor',
  'height',
  // ensure we don't emit legacy 'padding' itself
  'padding',
]);

/** Build inline style string from settings (filter out non-style keys) */
const buildStyle = (type, raw = {}) => {
  // prefer new vertical padding fields; legacy 'padding' only as fallback
  const settings = {
    ...raw,
    paddingTop: sanitizePadding(raw.paddingTop ?? raw.padding),
    paddingBottom: sanitizePadding(raw.paddingBottom ?? raw.padding),
  };

  const stylePairs = Object.entries(settings)
    .filter(
      ([k, v]) =>
        !NON_STYLE_KEYS.has(k) && v !== undefined && v !== null && v !== '',
    )
    .map(([k, v]) => `${kebabCase(k)}: ${v};`);

  // side padding for most blocks (keep images/spacers tight)
  const needsSidePad = !(
    type === 'image' ||
    type === 'spacer' ||
    type === 'header'
  );
  if (needsSidePad) stylePairs.push('padding-left: 6%;', 'padding-right: 6%;');

  return stylePairs.join(' ');
};

/** Render a block to exportable HTML (string) */
const renderBlockHtml = (block, template = null) => {
  const { type, content = '', settings = {} } = block;
  const styleString = buildStyle(type, settings);
  let blockHtml = '';
  const paddingLeftRight = settings?.paddingX ?? '8%';

  switch (type) {
    /** HEADERS & TEXT */
    case 'header':
      {
        const src =
          settings?.imagePath ||
          settings?.imageUrl ||
          COMMON_DEFAULTS.placeholderHeaderImage;

        const img = `<img src="${src}" alt="voucher" style="max-width:100%;border:0;display:block;margin:0 auto;">`;

        if (settings?.isImage) {
          blockHtml = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}; padding: 0 ${paddingLeftRight}">
      <tr>
        <td style="margin:0;padding:0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
            <tr>
              <td style="vertical-align:middle;padding-right:16px;text-align:center;">
                ${img}
              </td>
              <td style="vertical-align:middle;text-align:${
                settings.textAlign || 'left'
              };">
                <h2 style="margin:0;white-space:pre-wrap;${buildStyle(
                  'header',
                  settings,
                )}">${content}</h2>
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
        };margin:0;padding:0;">
          <h2 style="margin:0;white-space:pre-wrap;${buildStyle(
            'header',
            settings,
          )}">${content}</h2>
        </td>
      </tr>
    </table>
    `;
        }
      }
      break;

    case 'text':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr>
          <td align="${settings.textAlign || 'left'}" style="text-align:${
            settings.textAlign || 'left'
          };margin:0;padding:0;">
            <p style="white-space:pre-wrap;padding:16px 0;margin: 0;text-align:${settings.textAlign || 'left'};">${content}</p>
          </td>
        </tr>
      </table>`;
      break;

    /** IMAGE */
    case 'image': {
      const src =
        settings?.imagePath ||
        settings?.imageUrl ||
        COMMON_DEFAULTS.placeholderImage;

      const img = `<img src="${src}" alt="${
        settings.altText || ''
      }" style="max-width:100%;border:0;display:block;margin:${
        settings.margin || '0 auto'
      }">`;
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${buildStyle(
        'image',
        settings,
      )}">
        <tr>
          <td style="text-align:${settings.textAlign || 'left'};">
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
      const align = settings.textAlign ?? COMMON_DEFAULTS.textAlign;
      const buttonHtml = renderButton(settings, true);

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr>
          <td style="text-align:${align};">
            ${buttonHtml}
          </td>
        </tr>
      </table>`;
      break;
    }

    /** CODED BUTTON */
    case 'buttonCoded': {
      const align = settings.textAlign ?? COMMON_DEFAULTS.textAlign;
      const buttonHtml = renderButton(settings, false);

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr>
          <td align="${align}" style="padding:16px 0;">
            ${buttonHtml}
          </td>
        </tr>
      </table>`;
      break;
    }

    /** IMAGE BUTTON GROUP */
    case 'buttonGroup': {
      const bg = settings.backgroundColor ?? COMMON_DEFAULTS.white;
      const textAlign = settings.textAlign ?? COMMON_DEFAULTS.textAlign;
      const groupHtml = renderButtonGroup(block.buttons || [], settings, true);

      blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
          <tbody>
            <tr>
              <td align="${textAlign}" style="background-color:${bg};">
                ${groupHtml}
              </td>
            </tr>
          </tbody>
        </table>
      `;
      break;
    }

    /** CODED BUTTON GROUP */
    case 'buttonCodedGroup': {
      const bg = settings.backgroundColor ?? COMMON_DEFAULTS.white;
      const textAlign = settings.textAlign ?? COMMON_DEFAULTS.textAlign;
      const groupHtml = renderButtonGroup(block.buttons || [], settings, false);

      blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
          <tr>
            <td align="${textAlign}" style="background-color:${bg};text-align:${textAlign};">
              ${groupHtml}
            </td>
          </tr>
        </table>`;
      break;
    }

    /** DIVIDER & SPACER */
    case 'divider':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr><td style="height:${
          settings.lineHeight ?? '1px'
        };background-color:${settings.lineColor ?? '#ddd'};"></td></tr>
      </table>`;
      break;

    case 'spacer':
      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
        <tr><td style="height:${settings.height ?? '40px'};"></td></tr>
      </table>`;
      break;

    /** COLUMNS */
    case 'columns': {
      const cols = Array.isArray(block.columns) ? block.columns : [];
      const count = Math.max(cols.length, 1);
      const gap = settings.columnGap ?? '0';

      // Use calculateHalfGap helper
      const halfGap = calculateHalfGap(gap);

      // Use calculateColumnWidth helper
      const widthPercent = calculateColumnWidth(count);

      const backgroundColor = settings.backgroundColor ?? COMMON_DEFAULTS.white;
      const paddingTop = settings.paddingTop ?? settings.padding ?? '0';
      const paddingBottom = settings.paddingBottom ?? settings.padding ?? '0';

      const cells = cols
        .map((c, idx) => {
          const src = c?.imagePath || c?.imageUrl || c?.content || '';
          const padLeft = idx === 0 ? '0' : halfGap;
          const padRight = idx === count - 1 ? '0' : halfGap;

          // Use createImage and createLinkedImage helpers
          const img = src
            ? createImage(
                src,
                c?.settings?.altText ?? '',
                'width:auto;height:auto;margin:0 auto;',
              )
            : '';
          const inner = c?.settings?.linkUrl
            ? createLink(c.settings.linkUrl, img, c?.settings?.linkLabel ?? '')
            : img;

          return `
            <td width="${widthPercent}%" style="vertical-align:top;padding-left:${padLeft};padding-right:${padRight};">
              ${inner}
            </td>`;
        })
        .join('');

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${backgroundColor};padding-top:${paddingTop};padding-bottom:${paddingBottom};padding-left:6%;padding-right:6%;">
        <tbody>
          <tr>${cells}</tr>
        </tbody>
      </table>`;
      break;
    }

    /** COLUMNS */
    case 'columnsContent': {
      const cols = Array.isArray(block.columns) ? block.columns : [];
      const count = Math.max(cols.length, 1);

      // Use calculateHalfGap helper (same as columns case)
      const gap = settings?.columnGap ?? '0';
      const halfGap = calculateHalfGap(gap);

      // Use calculateColumnWidth helper
      const widthPercent = `${calculateColumnWidth(count)}%`;

      // Use getDefaults for cleaner default handling
      const {
        backgroundColor: bg,
        color,
        isBold,
        fontFamily,
      } = getDefaults(settings, {
        backgroundColor: COMMON_DEFAULTS.white,
        color: COMMON_DEFAULTS.black,
        isBold: false,
        fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
      });

      const paddingTop = settings?.paddingTop ?? settings?.padding ?? '0';
      const paddingBottom = settings?.paddingBottom ?? settings?.padding ?? '0';
      const paddingLeftRight = settings?.paddingX ?? '8%';

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
            : `<h2 style="font-family:${fontFamily};font-size:${titleSize};line-height:1.2;color:${color};padding:16px 0 8px;text-align:${textAlign};">${
                c?.title || ''
              }</h2>`;

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

    // ROUND CONTAINER
    case 'roundContainer': {
      const s = settings || {};

      // Use getDefaults for cleaner default handling
      const { canvasColor, backgroundColor, borderColor, borderType } =
        getDefaults(s, {
          canvasColor: COMMON_DEFAULTS.canvasGray,
          backgroundColor: COMMON_DEFAULTS.white,
          borderColor: COMMON_DEFAULTS.white,
          borderType: 'solid',
        });

      const bgWidth = Number(s.bgWidth ?? 88);
      const borderWidth = Number(s.borderWidth ?? 3);
      const borderRadius = Number(s.borderRadius ?? 24);
      const paddingTop = Number(s.paddingTop ?? 8);
      const paddingBottom = Number(s.paddingBottom ?? 8);
      const paddingInnerTop = Number(s.paddingInnerTop ?? 64);
      const paddingInnerBottom = Number(s.paddingInnerBottom ?? 64);

      const kids = Array.isArray(block.children) ? block.children : [];

      // Simply render each child without additional wrapping
      const childrenHTML = kids
        .map((child) => renderBlockHtml(child, template))
        .join('');

      const topPadRow =
        paddingTop > 0
          ? `<tr><td style="mso-line-height-rule:exactly;height:${paddingTop}px;font-size:0;border:0;background-color:${canvasColor}" bgcolor="${canvasColor}" height="${paddingTop}">&nbsp;</td></tr>`
          : '';

      const bottomPadRow =
        paddingBottom > 0
          ? `<tr><td style="mso-line-height-rule:exactly;height:${paddingBottom}px;font-size:0;border:0;background-color:${canvasColor}" bgcolor="${canvasColor}" height="${paddingBottom}">&nbsp;</td></tr>`
          : '';

      // Use calculateSpacerWidth helper
      const spacerWidth = calculateSpacerWidth(bgWidth);

      blockHtml = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${canvasColor};">
        <tbody>
          ${topPadRow}
          <tr>
            <td
              align="center"
              style="padding-top:${paddingInnerTop}px;padding-bottom:${paddingInnerBottom}px;text-align:center;mso-line-height-rule:exactly;"
            >
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="${spacerWidth}%" style="padding:0;font-size:0;line-height:0;">&nbsp;</td>
                  <td width="${bgWidth}%" style="padding:0;max-width:600px;">
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="border-collapse:separate;border-spacing:0;"
                    >
                      <tr>
                        <td
                          align="center"
                          style="padding:0;text-align:center;background-color:${backgroundColor};
                                border:${borderWidth}px ${borderType} ${borderColor};
                                border-radius:${borderRadius}px;overflow:hidden;"
                          bgcolor="${backgroundColor}"
                        >
                          ${childrenHTML}
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="${spacerWidth}%" style="padding:0;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
          ${bottomPadRow}
        </tbody>
      </table>
      `;
      break;
    }

    /** FOOTERS */
    case 'footer':
    case 'footer_general_kz': {
      const isKZ = type === 'footer_general_kz';
      const dict = isKZ ? translationsKZ : translationsRU;
      const disclaimerLink = settings.urls?.optout
        ? `<a href='${settings.urls.optout}' style='text-decoration:underline;color:${settings.disclaimercolor};'>${dict.link}</a>`
        : dict.link;

      blockHtml = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${
        settings.canvascolor || '#f5f5f5'
      };">

        <tr><td style="height:50px;font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- Socials -->
        <tr>
          <td align="center">
            <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;padding:0;">
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
                      </td>`,
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
            <h2 style="margin:0 0 13px;font:${
              settings.fontWeight || 'bold'
            } 24px ${settings.fontFamily || 'Arial, sans-serif'};color:${
              settings.textcolor
            };line-height:1;">
              ${dict.questions}
            </h2>

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

              <tr>
                <td>
                  <p>${dict.disclaimer} ${disclaimerLink} ${dict.disclaimer_end}.</p>
                </td>
              </tr>

              <tr>
                <td>
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

  return blockHtml;
};

export default renderBlockHtml;
