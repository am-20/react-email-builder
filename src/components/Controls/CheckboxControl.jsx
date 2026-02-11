import React from 'react';

/**
 * CheckboxControl - Reusable checkbox with label
 * 
 * @param {string} id - Unique ID for the checkbox
 * @param {string} label - Label text to display
 * @param {boolean} checked - Current checked state
 * @param {function} onChange - Callback when checkbox changes (receives boolean)
 * @param {object} containerStyle - Optional styles for container
 */
const CheckboxControl = ({
  id,
  label,
  checked,
  onChange,
  containerStyle = {},
}) => {
  return (
    <div className='checkbox-container' style={containerStyle}>
      <input
        type='checkbox'
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default CheckboxControl;