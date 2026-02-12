/**
 * HTML generation helper functions for email templates
 */

/**
 * Wrap content in a standard email table structure
 *
 * @param {string} content - HTML content to wrap
 * @param {string} styleString - CSS styles for the table
 * @param {object} tdProps - Additional props for the TD element
 * @returns {string} Complete table HTML
 *
 * @example
 * wrapInTable('<p>Hello</p>', 'background-color:#fff;', { align: 'center' })
 * Returns: <table...><tr><td align="center">...</td></tr></table>
 */
export const wrapInTable = (content, styleString = '', tdProps = {}) => {
  const tdAttrs = Object.entries(tdProps)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
    <tr>
      <td${tdAttrs ? ' ' + tdAttrs : ''}>
        ${content}
      </td>
    </tr>
  </table>`;
};

/**
 * Create an HTML link with standard attributes
 *
 * @param {string} href - Link URL
 * @param {string} content - Link content (text or HTML)
 * @param {string} label - Label for tracking (_label attribute)
 * @param {string} styles - Inline CSS styles
 * @returns {string} Anchor tag HTML
 *
 * @example
 * createLink('https://example.com', 'Click here', 'cta-button', 'color:blue;')
 * Returns: <a href="..." _label="cta-button" style="color:blue;">Click here</a>
 */
export const createLink = (href, content, label = '', styles = '') => {
  return `<a href="${href || '#'}" target="_blank" rel="noopener noreferrer" _label="${label}" style="${styles}">${content}</a>`;
};

/**
 * Create an HTML image tag with standard email attributes
 *
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} styles - Inline CSS styles
 * @returns {string} Image tag HTML
 *
 * @example
 * createImage('image.jpg', 'Product photo', 'max-width:100%;border:0;')
 * Returns: <img src="image.jpg" alt="Product photo" style="...">
 */
export const createImage = (src, alt = '', styles = '') => {
  return `<img src="${src}" alt="${alt}" style="${styles}border:0;display:block;">`;
};

/**
 * Create a linked image (image wrapped in anchor tag)
 *
 * @param {string} imageSrc - Image source URL
 * @param {string} linkHref - Link URL
 * @param {string} alt - Image alt text
 * @param {string} label - Link label for tracking
 * @param {string} imageStyles - Image inline styles
 * @returns {string} Linked image HTML
 *
 * @example
 * createLinkedImage('btn.png', 'https://example.com', 'Button', 'cta', 'max-width:100%;')
 */
export const createLinkedImage = (
  imageSrc,
  linkHref,
  alt = '',
  label = '',
  imageStyles = '',
) => {
  const img = createImage(imageSrc, alt, imageStyles);
  return createLink(linkHref, img, label);
};
