import React from 'react';

/**
 * AlignmentControl - Reusable text alignment control
 * 
 * @param {string} label - Display label (default: "Text align")
 * @param {string} value - Current alignment value ('left', 'center', 'right')
 * @param {function} onChange - Callback when alignment changes
 * @param {array} options - Alignment options (default: ['left', 'center', 'right'])
 * @param {object} containerStyle - Optional styles for container
 */
const AlignmentControl = ({
  label = 'Text align',
  value,
  onChange,
  options = ['left', 'center', 'right'],
  containerStyle = {},
}) => {
  // Capitalize first letter for display
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div style={containerStyle}>
      {label && (
        <div
          style={{
            fontSize: 12,
            color: '#6b7280',
            marginTop: 8,
            marginBottom: 8,
          }}>
          {label}
        </div>
      )}
      <select
        className='control-select'
        value={value || 'left'}
        onChange={(e) => onChange(e.target.value)}>
        {options.map((align) => (
          <option key={align} value={align}>
            {capitalize(align)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AlignmentControl;