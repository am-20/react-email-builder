import React from 'react';
import { GripVertical } from 'lucide-react';

/**
 * BlockTypeIndicator - Shows block type with drag handle
 * 
 * Displays the drag handle icon and block type label.
 * Text color adapts based on block type for better visibility.
 * 
 * @param {object} props
 * @param {string} props.type - Block type (e.g., 'header', 'text', 'image')
 * @param {object} props.settings - Block settings (for color)
 */
const BlockTypeIndicator = ({ type, settings }) => {
  // For header and text blocks, use their text color for the indicator
  const indicatorColor =
    type === 'header' || type === 'text' ? settings?.color : undefined;

  return (
    <div
      className='block-type-indicator'
      style={{ color: indicatorColor }}>
      <GripVertical size={14} className='drag-handle' />
      <div className='block-type-text'>{type}</div>
    </div>
  );
};

export default BlockTypeIndicator;