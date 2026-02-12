import { useMemo } from 'react';

/**
 * useBlockSettings - Custom hook for calculating block styles and settings
 * 
 * Extracts common block styling logic:
 * - Background colors
 * - Padding (top/bottom/left/right)
 * - Border styling for active blocks
 * - Content text styling
 * - Special handling for different block types
 * 
 * @param {string} type - Block type
 * @param {object} settings - Block settings
 * @param {boolean} isActive - Whether block is currently selected
 * 
 * @returns {object} - { blockStyle, contentStyle, paddingTop, paddingBottom }
 */
export const useBlockSettings = ({ type, settings, isActive }) => {
  // Extract padding values
  const paddingTop = settings?.paddingTop ?? settings?.padding ?? '0';
  const paddingBottom = settings?.paddingBottom ?? settings?.padding ?? '0';

  // Determine block type flags
  const isSpacer = type === 'spacer';
  const isFooter = type === 'footer' || type === 'footer_general_kz';
  const isRound = type === 'roundContainer';
  const isImage = type === 'image';

  // Calculate block container styles
  const blockStyle = useMemo(
    () => ({
      backgroundColor: settings?.backgroundColor || 'white',
      paddingTop: isSpacer || isFooter || isRound ? '0' : paddingTop,
      paddingBottom: isSpacer || isFooter || isRound ? '0' : paddingBottom,
      paddingLeft: isImage || isSpacer || isFooter || isRound ? '0' : '8%',
      paddingRight: isImage || isSpacer || isFooter || isRound ? '0' : '8%',
      position: 'relative',
      cursor: 'pointer',
      border: isActive ? '2px solid #4299e1' : 'none',
      transition: 'all 0.2s ease',
      lineHeight: isImage ? 0 : undefined,
    }),
    [
      settings?.backgroundColor,
      paddingTop,
      paddingBottom,
      isSpacer,
      isFooter,
      isRound,
      isImage,
      isActive,
    ]
  );

  // Calculate content text styles
  const contentStyle = useMemo(
    () => ({
      color: settings?.color,
      fontSize: settings?.fontSize,
      textAlign: settings?.textAlign,
      whiteSpace: 'pre-wrap',
    }),
    [settings?.color, settings?.fontSize, settings?.textAlign]
  );

  return {
    blockStyle,
    contentStyle,
  };
};