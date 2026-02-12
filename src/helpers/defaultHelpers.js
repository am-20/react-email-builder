/**
 * Default value helper functions
 * Provides clean null-safe access to settings with fallbacks
 */

/**
 * Get a value from an object with a fallback default
 * Uses nullish coalescing to only fallback on null/undefined
 *
 * @param {object} obj - Object to get value from (e.g., settings)
 * @param {string} key - Key to access
 * @param {any} fallback - Default value if key is null/undefined
 * @returns {any} The value or fallback
 *
 * @example
 * getDefault({ color: '#fff' }, 'color', '#000')     // Returns: '#fff'
 * getDefault({ color: null }, 'color', '#000')       // Returns: '#000'
 * getDefault({ color: '' }, 'color', '#000')         // Returns: '' (empty string is not null)
 * getDefault({}, 'color', '#000')                    // Returns: '#000'
 */
export const getDefault = (obj, key, fallback) => {
  return obj?.[key] ?? fallback;
};

/**
 * Get multiple values with defaults in one call
 * Returns an object with all requested values
 *
 * @param {object} obj - Source object
 * @param {object} defaults - Object mapping keys to default values
 * @returns {object} Object with all values (from obj or defaults)
 *
 * @example
 * getDefaults(settings, {
 *   color: '#ffffff',
 *   fontSize: '16px',
 *   fontWeight: 'bold'
 * })
 * Returns: { color: '#ffffff', fontSize: '16px', fontWeight: 'bold' }
 * (using values from settings if present, otherwise defaults)
 */
export const getDefaults = (obj = {}, defaults = {}) => {
  const result = {};

  for (const [key, defaultValue] of Object.entries(defaults)) {
    result[key] = obj[key] ?? defaultValue;
  }

  return result;
};

/**
 * Common default values for email components
 * Centralized defaults to ensure consistency
 */
export const COMMON_DEFAULTS = {
  // Colors
  white: '#ffffff',
  black: '#000000',
  gray: '#ddd',
  canvasGray: '#CFCFCF',

  // Typography
  fontFamily: 'Arial, sans-serif',
  fontFamilySamsung: 'SamsungOne, Arial, Helvetica, sans-serif',
  fontSize: '16px',
  fontSize12: '12px',
  fontSize24: '24px',
  fontWeight: 'bold',
  lineHeight: '120%',

  // Spacing
  buttonPaddingY: '12px',
  buttonPaddingX: '24px',
  borderRadius: '30px',
  gap: '0',
  padding: '0',
  sidePadding: '8%',
  sidePaddingReduced: '6%',

  // Alignment
  textAlign: 'center',
  textAlignLeft: 'left',

  // Placeholders
  placeholderButtonImage: 'https://placehold.co/80x40',
  placeholderImage: 'https://placehold.co/600x400',
  placeholderHeaderImage: 'https://placehold.co/80x80',

  // Links
  defaultHref: '#',
  defaultLabel: '',

  // Dimensions
  dividerHeight: '1px',
  spacerHeight: '40px',

  // Border
  borderNone: 'none',
  borderSolid: 'solid',

  // Round Container defaults
  roundContainerBgWidth: 88,
  roundContainerBorderWidth: 3,
  roundContainerBorderRadius: 24,
  roundContainerPaddingTop: 8,
  roundContainerPaddingBottom: 8,
  roundContainerPaddingInnerTop: 64,
  roundContainerPaddingInnerBottom: 64,
};
