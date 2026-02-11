import React from 'react';

/**
 * SelectControl - Reusable select dropdown with label
 * 
 * @param {string} label - Display label (e.g., "Text align")
 * @param {string} value - Current selected value
 * @param {function} onChange - Callback when selection changes
 * @param {array} options - Array of {value, label} objects or just strings
 * @param {string} className - Optional className (default: 'control-select')
 * @param {string} title - Optional title attribute
 * @param {object} containerStyle - Optional styles for container
 * 
 * @example
 * <SelectControl
 *   label="Text align"
 *   value={textAlign}
 *   onChange={(val) => handleChange('textAlign', val)}
 *   options={[
 *     { value: 'left', label: 'Left' },
 *     { value: 'center', label: 'Center' },
 *     { value: 'right', label: 'Right' }
 *   ]}
 * />
 * 
 * Or with simple strings:
 * <SelectControl
 *   options={['left', 'center', 'right']}
 *   ...
 * />
 */
const SelectControl = ({
  label,
  value,
  onChange,
  options = [],
  className = 'control-select',
  title,
  containerStyle = {},
}) => {
  // Normalize options to {value, label} format
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

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
      <select
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        title={title}>
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectControl;