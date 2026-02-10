import React from 'react';

const tableProps = {
  role: 'presentation',
  width: '100%',
  cellSpacing: '0',
  cellPadding: '0',
  border: '0',
};

/**
 * ButtonCodedBlock - Renders a styled text button with customizable appearance
 * Settings control color, background, border, padding, etc.
 */
const ButtonCodedBlock = ({
  settings,
  index,
  isActive,
  handleUpdateBlockSettings,
}) => {
  const buttonStyles = {
    textDecoration: 'none',
    letterSpacing: 0,
    display: 'inline',
    borderRadius: settings?.borderRadius,
    fontWeight: 'bold',
    fontSize: settings?.fontSize,
    color: settings?.color,
    padding: settings?.padding,
    backgroundColor: settings?.buttonBgColor,
    border: settings?.border,
  };

  return (
    <table {...tableProps}>
      <tbody>
        <tr>
          <td
            style={{
              textAlign: settings?.textAlign || 'center',
              padding: '16px 0',
            }}>
            <a
              href={`${settings?.linkUrl}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{ display: 'inline-block', textDecoration: 'none' }}>
              <p style={buttonStyles}>{settings?.content || 'Click Me'}</p>
            </a>
            {isActive && (
              <div className='button-settings'>
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Click Me'
                  value={settings?.content || ''}
                  onChange={(e) =>
                    handleUpdateBlockSettings(index, 'content', e.target.value)
                  }
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Link URL'
                  value={settings?.linkUrl || ''}
                  onChange={(e) =>
                    handleUpdateBlockSettings(index, 'linkUrl', e.target.value)
                  }
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Link Label (optional)'
                  value={settings?.linkLabel || ''}
                  onChange={(e) =>
                    handleUpdateBlockSettings(
                      index,
                      'linkLabel',
                      e.target.value,
                    )
                  }
                />
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ButtonCodedBlock;
