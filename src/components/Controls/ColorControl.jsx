import React from 'react';

/**
 * ColorControl - Reusable color picker with label
 * 
 * @param {string} label - Display label (e.g., "Text color")
 * @param {string} value - Current color value (e.g., "#000000")
 * @param {function} onChange - Callback when color changes
 * @param {object} style - Optional additional styles for container
 */
const ColorControl = ({ label, value, onChange, style = {} }) => {
  return (
    <>
      {label && (
        <div
          style={{
            fontSize: 12,
            color: '#6b7280',
            marginTop: 8,
            ...style,
          }}>
          {label}
        </div>
      )}
      <input
        type='color'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='color-input'
      />
    </>
  );
};

export default ColorControl;