import React from 'react';

/**
 * NumberControl - Reusable number input with label and optional px conversion
 * 
 * @param {string} label - Display label (e.g., "Font size")
 * @param {string} value - Current value with unit (e.g., "24px")
 * @param {function} onChange - Callback when value changes (receives value with px)
 * @param {string} placeholder - Placeholder text
 * @param {boolean} addPx - Whether to append 'px' to the value (default: true)
 * @param {object} inputStyle - Optional styles for input element
 * @param {object} containerStyle - Optional styles for container
 */
const NumberControl = ({
  label,
  value,
  onChange,
  placeholder = '',
  addPx = true,
  inputStyle = {},
  containerStyle = {},
}) => {
  // Parse numeric value from string like "24px"
  const numericValue = value ? parseInt(value, 10) : '';

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue === '') {
      onChange('');
    } else {
      onChange(addPx ? `${newValue}px` : newValue);
    }
  };

  return (
    <div
      className='control-flex'
      style={{ flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && (
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          {label}
        </div>
      )}
      <input
        type='number'
        className='settings-input'
        placeholder={placeholder}
        value={numericValue}
        onChange={handleChange}
        style={{ width: 80, ...inputStyle }}
      />
    </div>
  );
};

export default NumberControl;