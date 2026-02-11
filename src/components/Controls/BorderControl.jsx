import React from 'react';

/**
 * BorderControl - Comprehensive border control (color, width, type, radius)
 * 
 * @param {string} label - Label for the control group (default: "Border")
 * @param {string} colorValue - Border color
 * @param {number} widthValue - Border width in px
 * @param {string} typeValue - Border type ('solid', 'dashed', 'dotted')
 * @param {number} radiusValue - Border radius in px
 * @param {function} onColorChange - Callback for color change
 * @param {function} onWidthChange - Callback for width change
 * @param {function} onTypeChange - Callback for type change
 * @param {function} onRadiusChange - Callback for radius change
 * @param {object} containerStyle - Optional container styles
 */
const BorderControl = ({
  label = 'Border',
  colorValue,
  widthValue,
  typeValue,
  radiusValue,
  onColorChange,
  onWidthChange,
  onTypeChange,
  onRadiusChange,
  containerStyle = {},
}) => {
  return (
    <div
      className='control-flex'
      style={{ gap: 8, flexWrap: 'wrap', marginTop: '16px', ...containerStyle }}>
      <span style={{ fontSize: 12, color: '#6b7280' }}>
        {label}
      </span>
      <input
        type='color'
        value={colorValue}
        onChange={(e) => onColorChange(e.target.value)}
        className='color-input'
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type='number'
          value={widthValue}
          onChange={(e) => onWidthChange(Number(e.target.value))}
          placeholder='Width'
          className='settings-input'
          style={{ width: 60 }}
        />
        <select
          value={typeValue}
          onChange={(e) => onTypeChange(e.target.value)}
          className='control-select'
          style={{ width: 90 }}>
          <option value='solid'>solid</option>
          <option value='dashed'>dashed</option>
          <option value='dotted'>dotted</option>
        </select>
        <input
          type='number'
          value={radiusValue}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          placeholder='Radius'
          className='settings-input'
          style={{ width: 70 }}
        />
      </div>
    </div>
  );
};

export default BorderControl;