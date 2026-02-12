/**
 * Calculation helper functions for layout and spacing
 */

/**
 * Calculate half of a gap value for column spacing
 *
 * Handles CSS units (px, em, rem, %)
 * Returns '0' if value is invalid
 *
 * @param {string} gap - Gap value with CSS unit (e.g., '16px', '2em')
 * @returns {string} Half of the gap value with px unit
 *
 * @example
 * calculateHalfGap('16px')  // Returns: '8px'
 * calculateHalfGap('2em')   // Returns: '1px' (converts to px via parseInt)
 * calculateHalfGap('auto')  // Returns: '0'
 */
export const calculateHalfGap = (gap) => {
  if (!gap) return '0';

  // Check if value matches CSS unit pattern
  const isValidUnit = /^-?\d+(\.\d+)?(px|em|rem|%)$/.test(gap);

  if (isValidUnit) {
    const halfValue = parseInt(gap) / 2;
    return `${halfValue}px`;
  }

  return '0';
};

/**
 * Calculate spacer width for centered containers
 * Used in roundContainer and similar layouts
 *
 * @param {number} containerWidth - Container width percentage (e.g., 88)
 * @returns {string} Spacer width as percentage with 2 decimal places
 *
 * @example
 * calculateSpacerWidth(88)  // Returns: "6.00"
 * calculateSpacerWidth(80)  // Returns: "10.00"
 */
export const calculateSpacerWidth = (containerWidth) => {
  const spacerWidth = (100 - containerWidth) / 2;
  return spacerWidth.toFixed(2);
};

/**
 * Calculate column width percentage
 *
 * @param {number} columnCount - Number of columns
 * @returns {string} Column width as percentage with 4 decimal places
 *
 * @example
 * calculateColumnWidth(2)  // Returns: "50.0000"
 * calculateColumnWidth(3)  // Returns: "33.3333"
 */
export const calculateColumnWidth = (columnCount) => {
  if (columnCount <= 0) return '100.0000';
  return (100 / columnCount).toFixed(4);
};
