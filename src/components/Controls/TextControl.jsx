import React from 'react';

/**
 * TextControl - Reusable text input with label
 * 
 * @param {string} label - Display label (e.g., "Button's inner paddings")
 * @param {string} value - Current value
 * @param {function} onChange - Callback when value changes
 * @param {string} placeholder - Placeholder text
 * @param {string} className - Input className (default: 'control-select')
 * @param {object} inputStyle - Optional styles for input element
 * @param {object} containerStyle - Optional styles for container
 */
const TextControl = ({
  label,
  value,
  onChange,
  placeholder = '',
  className = 'control-select',
  inputStyle = {},
  containerStyle = {},
}) => {
  return (
    <div style={containerStyle}>
      {label && (
        <div
          style={{
            fontSize: 12,
            color: '#6b7280',
            marginTop: 8,
          }}>
          {label}
        </div>
      )}
      <input
        type='text'
        className={className}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
};

export default TextControl;