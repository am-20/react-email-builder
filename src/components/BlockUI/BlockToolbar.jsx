import React from 'react';
import { Copy, Trash2 } from 'lucide-react';

/**
 * BlockToolbar - Action buttons for block (duplicate/delete)
 * 
 * Displays duplicate and delete buttons when block is hovered or active.
 * 
 * @param {object} props
 * @param {number} props.index - Block index
 * @param {function} props.onDuplicate - Duplicate handler
 * @param {function} props.onDelete - Delete handler
 * @param {object} props.style - Optional additional styles
 */
const BlockToolbar = ({ index, onDuplicate, onDelete, style = {} }) => {
  return (
    <div className='block-actions' style={{ zIndex: 20, ...style }}>
      <button
        className='action-button'
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate(index);
        }}
        title='Duplicate block'>
        <Copy size={14} className='action-icon' />
      </button>
      <button
        className='action-button'
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        title='Delete block'>
        <Trash2 size={14} className='action-icon' />
      </button>
    </div>
  );
};

export default BlockToolbar;