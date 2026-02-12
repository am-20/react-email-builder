/**
 * Button rendering helpers
 * Unified logic for both image and coded buttons
 */

import { parsePadding, COMMON_DEFAULTS } from './index';

/**
 * Render a single button (image or coded)
 *
 * @param {object} settings - Button settings
 * @param {boolean} isImage - Whether this is an image button (vs coded)
 * @returns {string} Button HTML
 */
export const renderButton = (settings, isImage = false) => {
  if (isImage) {
    // IMAGE BUTTON
    const imgSrc =
      settings.imagePath ||
      settings.imageUrl ||
      COMMON_DEFAULTS.placeholderButtonImage;
    const alt = settings.imageAlt ?? '';
    const href = settings.linkUrl || COMMON_DEFAULTS.defaultHref;
    const label = settings.linkLabel ?? COMMON_DEFAULTS.defaultLabel;

    return `
      <a href="${href}" target="_blank" rel="noopener noreferrer" _label="${label}">
        <img src="${imgSrc}" alt="${alt}" style="max-width:100%;display:block;margin:0 auto;height:auto;border:0;">
      </a>
    `;
  } else {
    // CODED BUTTON
    const {
      top: paddingTop,
      bottom: paddingBottom,
      x: paddingX,
    } = parsePadding(settings);

    const color = settings.color ?? COMMON_DEFAULTS.white;
    const bg = settings.buttonBgColor ?? COMMON_DEFAULTS.black;
    const border = settings.border ?? COMMON_DEFAULTS.borderNone;
    const radius = settings.borderRadius ?? COMMON_DEFAULTS.borderRadius;
    const fontSize = settings.fontSize ?? COMMON_DEFAULTS.fontSize;
    const fontWeight = settings.fontWeight ?? COMMON_DEFAULTS.fontWeight;
    const fontFamily = settings.fontFamily ?? COMMON_DEFAULTS.fontFamily;
    const text = settings.content ?? 'Click Me';
    const href = settings.linkUrl || COMMON_DEFAULTS.defaultHref;
    const label = settings.linkLabel ?? COMMON_DEFAULTS.defaultLabel;

    return `
      <a href="${href}" target="_blank" _label="${label}" rel="noopener noreferrer" style="
        display:inline-block;text-decoration:none;color:${color};background-color:${bg};
        border:${border};border-radius:${radius};font-weight:${fontWeight};font-size:${fontSize};
        padding:${paddingTop} ${paddingX} ${paddingBottom} ${paddingX};letter-spacing:0;line-height:120%;
        font-family:${fontFamily};
      ">${text}</a>
    `;
  }
};

/**
 * Render a button group (image or coded buttons)
 * Handles both inline and stacked layouts
 *
 * @param {array} buttons - Array of button data
 * @param {object} settings - Group settings
 * @param {boolean} isImage - Whether these are image buttons (vs coded)
 * @returns {string} Button group HTML
 */
export const renderButtonGroup = (buttons, settings, isImage = false) => {
  const inline = !!settings.inline;
  const gap = settings.gap ?? COMMON_DEFAULTS.gap;
  const bg = settings.backgroundColor ?? COMMON_DEFAULTS.white;
  const fontFamily = settings.fontFamily ?? COMMON_DEFAULTS.fontFamily;
  const textAlign = settings.textAlign ?? COMMON_DEFAULTS.textAlign;

  if (isImage) {
    // IMAGE BUTTON GROUP
    const buttonHtmls = buttons.map((btn) => {
      const s = btn?.settings || {};
      return renderButton(s, true);
    });

    let tableRows = '';

    if (inline) {
      // ONE ROW, many TDs → buttons inline
      const cells = buttonHtmls
        .map((btnHtml, i) => {
          const isLast = i === buttonHtmls.length - 1;
          const paddingRight = !isLast ? `padding-right:${gap};` : '';
          return `
            <td align="center" style="${paddingRight}">
              ${btnHtml}
            </td>
          `;
        })
        .join('');

      tableRows = `<tr>${cells}</tr>`;
    } else {
      // MANY ROWS, one TD per row → buttons stacked
      tableRows = buttonHtmls
        .map((btnHtml, i) => {
          const isLast = i === buttonHtmls.length - 1;
          const paddingBottom = !isLast ? `padding-bottom:${gap};` : '';
          return `
            <tr>
              <td align="center" style="${paddingBottom}">
                ${btnHtml}
              </td>
            </tr>
          `;
        })
        .join('');
    }

    return `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  } else {
    // CODED BUTTON GROUP
    const buttonTables = buttons
      .map((btn, i, arr) => {
        const s = btn?.settings || {};
        const buttonHtml = renderButton(s, false);

        const isLast = i === arr.length - 1;
        const spacer = isLast ? '0' : gap;

        // spacing: right margin for inline, bottom margin for stacked
        const tableSpacing = inline
          ? `margin-right:${spacer};`
          : `margin:0 auto ${spacer} auto; width:fit-content;`;

        return `
          <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                 style="display:${inline ? 'inline-block' : 'block'};${tableSpacing}">
            <tr>
              <td align="center">
                ${buttonHtml}
              </td>
            </tr>
          </table>`;
      })
      .join('');

    return buttonTables;
  }
};
