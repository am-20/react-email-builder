/**
 * Parse CSS padding shorthand into individual values
 *
 * Supports:
 * - "12px" → all sides
 * - "12px 24px" → vertical horizontal
 * - "12px 24px 36px 48px" → top right bottom left
 *
 * @param {object} settings - Settings object with padding values
 * @returns {object} Object with top, bottom, x (horizontal) padding values
 *
 * @example
 * parsePadding({ padding: '12px 24px' })
 * Returns: { top: '12px', bottom: '12px', x: '24px' }
 *
 * parsePadding({ paddingTop: '16px', paddingBottom: '20px', paddingX: '32px' })
 * Returns: { top: '16px', bottom: '20px', x: '32px' }
 */
export const parsePadding = (settings) => {
  // If settings.padding exists, parse it
  if (settings.padding) {
    const parts = settings.padding.trim().split(/\s+/);

    if (parts.length === 1) {
      // "12px" → all sides
      return { top: parts[0], bottom: parts[0], x: parts[0] };
    } else if (parts.length === 2) {
      // "12px 24px" → vertical horizontal
      return { top: parts[0], bottom: parts[0], x: parts[1] };
    } else if (parts.length === 4) {
      // "12px 24px 36px 48px" → top right bottom left
      return { top: parts[0], x: parts[1], bottom: parts[2] };
    }
  }

  // Otherwise use individual values with defaults
  return {
    top: settings.paddingTop ?? '12px',
    bottom: settings.paddingBottom ?? '12px',
    x: settings.paddingX ?? '24px',
  };
};
