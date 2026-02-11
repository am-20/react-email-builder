import React from 'react';

/**
 * PaddingControl - Reusable padding top/bottom controls
 * 
 * @param {string} paddingTop - Current padding top value
 * @param {string} paddingBottom - Current padding bottom value
 * @param {function} onTopChange - Callback when padding top changes
 * @param {function} onBottomChange - Callback when padding bottom changes
 * @param {string} defaultValue - Default padding value (default: '10px')
 * 
 * Provides consistent padding presets:
 * - No padding: 0px
 * - Small: 16px
 * - Medium: 24px
 * - Large: 40px
 */
const PaddingControl = ({
  paddingTop,
  paddingBottom,
  onTopChange,
  onBottomChange,
  defaultValue = '10px',
}) => {
  return (
    <>
      <select
        className='control-select flex-grow'
        value={paddingTop ?? defaultValue}
        onChange={(e) => onTopChange(e.target.value)}
        title='Padding top'>
        <option value='0px'>No padding top</option>
        <option value='16px'>Small top</option>
        <option value='24px'>Medium top</option>
        <option value='40px'>Large top</option>
      </select>

      <select
        className='control-select flex-grow'
        value={paddingBottom ?? defaultValue}
        onChange={(e) => onBottomChange(e.target.value)}
        title='Padding bottom'>
        <option value='0px'>No padding bottom</option>
        <option value='16px'>Small bottom</option>
        <option value='24px'>Medium bottom</option>
        <option value='40px'>Large bottom</option>
      </select>
    </>
  );
};

export default PaddingControl;