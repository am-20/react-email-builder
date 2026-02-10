import React from 'react';

const tableProps = {
  role: 'presentation',
  width: '100%',
  cellSpacing: '0',
  cellPadding: '0',
  border: '0',
};

/**
 * ButtonCodedGroupBlock - Renders multiple styled text buttons
 * Each button has extensive style controls (colors, padding, border, etc.)
 */
const ButtonCodedGroupBlock = ({
  block,
  settings,
  index,
  isActive,
  template,
  setTemplate,
}) => {
  const container = {
    display: 'flex',
    flexDirection: settings?.inline ? 'row' : 'column',
    gap: settings?.gap || '0px',
    justifyContent: 'center',
  };

  const getBtnStyles = (btn) => {
    const s = btn?.settings || {};
    return {
      textDecoration: 'none',
      letterSpacing: 0,
      display: 'inline',
      borderRadius: s.borderRadius ?? '30px',
      fontWeight: 'bold',
      backgroundColor: s.buttonBgColor ?? '#000000',
      fontSize: s.fontSize ?? '16px',
      color: s.color ?? '#ffffff',
      padding: s.padding ?? '12px 24px',
      border: s.border ?? '1px solid #000000',
    };
  };

  const updateBtn = (buttonIndex, key, value) => {
    const newBlocks = [...template.blocks];
    const btn = newBlocks[index].buttons?.[buttonIndex] || { settings: {} };
    btn.settings = { ...(btn.settings || {}), [key]: value };
    newBlocks[index].buttons[buttonIndex] = btn;
    setTemplate({ ...template, blocks: newBlocks });
  };

  return (
    <table {...tableProps}>
      <tbody>
        <tr>
          <td style={{ textAlign: 'center' }}>
            <div style={container}>
              {block.buttons?.map((button, buttonIndex) => {
                const btnStyles = getBtnStyles(button);
                const s = button?.settings || {};
                return (
                  <div key={buttonIndex} style={{ padding: '16px 0' }}>
                    <a
                      href={`${s.linkUrl || '#'}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{
                        display: 'inline-block',
                        textDecoration: 'none',
                      }}>
                      <p style={btnStyles}>{s.content || 'Click Me'}</p>
                    </a>

                    {isActive && (
                      <div
                        className='button-settings'
                        style={{ width: '100%' }}>
                        <input
                          type='text'
                          className='settings-input'
                          placeholder='Button text'
                          value={s.content || ''}
                          onChange={(e) =>
                            updateBtn(buttonIndex, 'content', e.target.value)
                          }
                        />

                        <input
                          type='text'
                          className='settings-input'
                          placeholder='Link URL'
                          value={s.linkUrl || ''}
                          onChange={(e) =>
                            updateBtn(buttonIndex, 'linkUrl', e.target.value)
                          }
                        />
                        <input
                          type='text'
                          className='settings-input'
                          placeholder='Link label'
                          value={s.linkLabel || ''}
                          onChange={(e) =>
                            updateBtn(buttonIndex, 'linkLabel', e.target.value)
                          }
                        />

                        <div
                          className='control-flex'
                          style={{
                            gap: 8,
                            marginTop: 6,
                            flexWrap: 'wrap',
                          }}>
                          <div
                            className='control-flex'
                            style={{ alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 12, color: '#6b7280' }}>
                              Bg
                            </span>
                            <input
                              type='color'
                              value={s.buttonBgColor ?? '#000000'}
                              onChange={(e) =>
                                updateBtn(
                                  buttonIndex,
                                  'buttonBgColor',
                                  e.target.value,
                                )
                              }
                              className='color-input'
                            />
                          </div>

                          <div
                            className='control-flex'
                            style={{ alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 12, color: '#6b7280' }}>
                              Text
                            </span>
                            <input
                              type='color'
                              value={s.color ?? '#ffffff'}
                              onChange={(e) =>
                                updateBtn(buttonIndex, 'color', e.target.value)
                              }
                              className='color-input'
                            />
                          </div>

                          <input
                            type='text'
                            className='settings-input'
                            placeholder='Padding (e.g. 12px 24px)'
                            value={s.padding ?? '12px 24px'}
                            onChange={(e) =>
                              updateBtn(buttonIndex, 'padding', e.target.value)
                            }
                          />

                          <input
                            type='number'
                            className='settings-input'
                            placeholder='Font size (px)'
                            value={s.fontSize ? parseInt(s.fontSize, 10) : ''}
                            onChange={(e) =>
                              updateBtn(
                                buttonIndex,
                                'fontSize',
                                e.target.value ? `${e.target.value}px` : '',
                              )
                            }
                          />

                          <input
                            type='text'
                            className='settings-input'
                            placeholder='Border (e.g. 1px solid #000)'
                            value={s.border ?? '1px solid #000000'}
                            onChange={(e) =>
                              updateBtn(buttonIndex, 'border', e.target.value)
                            }
                          />

                          <input
                            type='number'
                            className='settings-input'
                            placeholder='Border radius (px)'
                            value={
                              s.borderRadius ? parseInt(s.borderRadius, 10) : ''
                            }
                            onChange={(e) =>
                              updateBtn(
                                buttonIndex,
                                'borderRadius',
                                e.target.value ? `${e.target.value}px` : '',
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ButtonCodedGroupBlock;
