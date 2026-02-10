import React from 'react';

const tableProps = {
  role: 'presentation',
  width: '100%',
  cellSpacing: '0',
  cellPadding: '0',
  border: '0',
};

/**
 * ButtonGroupBlock - Renders multiple image buttons in a row or column
 * Each button has its own settings and inline controls
 */
const ButtonGroupBlock = ({
  block,
  settings,
  index,
  isActive,
  template,
  setTemplate,
  handleImageUpload,
}) => {
  const container = {
    display: 'flex',
    flexDirection: settings?.inline ? 'row' : 'column',
    gap: settings?.gap,
    justifyContent: 'center',
  };

  return (
    <table {...tableProps}>
      <tbody>
        <tr>
          <td style={{ textAlign: 'center' }}>
            <div style={container}>
              {block.buttons?.map((button, buttonIndex) => {
                const s = button.settings || {};
                const btnSrc =
                  s.imagePreviewUrl ||
                  s.imagePath ||
                  'https://placehold.co/80x40';
                return (
                  <div key={buttonIndex}>
                    <a
                      href={`${s?.linkUrl || ''}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{ display: 'inline-block' }}>
                      {btnSrc && (
                        <img
                          src={btnSrc}
                          alt={s?.imageAlt || ''}
                          style={{
                            display: 'block',
                            margin: '0 auto',
                            maxWidth: '100%',
                            height: 'auto',
                            border: 0,
                          }}
                        />
                      )}
                    </a>
                    {isActive && (
                      <>
                        <input
                          type='file'
                          accept='image/*'
                          className='settings-input'
                          onChange={(e) => handleImageUpload(e, buttonIndex)}
                          style={{ marginBottom: 8 }}
                        />
                        <input
                          type='text'
                          className='settings-input'
                          placeholder='Image path or URL'
                          value={s.imagePath || ''}
                          onChange={(e) => {
                            const url = e.target.value;
                            const newBlocks = [...template.blocks];
                            const btn = newBlocks[index].buttons[buttonIndex];
                            btn.settings = {
                              ...(btn.settings || {}),
                              imagePath: url,
                              imagePreviewUrl: url,
                            };
                            setTemplate({ ...template, blocks: newBlocks });
                          }}
                        />
                        <input
                          type='text'
                          className='settings-input'
                          placeholder='Alt text'
                          value={s?.imageAlt || ''}
                          onChange={(e) => {
                            const newBlocks = [...template.blocks];
                            newBlocks[index].buttons[
                              buttonIndex
                            ].settings.imageAlt = e.target.value;
                            setTemplate({ ...template, blocks: newBlocks });
                          }}
                        />
                        <input
                          type='text'
                          className='settings-input'
                          placeholder='Link URL'
                          value={s?.linkUrl || ''}
                          onChange={(e) => {
                            const newBlocks = [...template.blocks];
                            newBlocks[index].buttons[
                              buttonIndex
                            ].settings.linkUrl = e.target.value;
                            setTemplate({ ...template, blocks: newBlocks });
                          }}
                        />
                        <input
                          type='text'
                          className='settings-input'
                          placeholder='Link Label (optional)'
                          value={s?.linkLabel || ''}
                          onChange={(e) => {
                            const newBlocks = [...template.blocks];
                            newBlocks[index].buttons[
                              buttonIndex
                            ].settings.linkLabel = e.target.value;
                            setTemplate({ ...template, blocks: newBlocks });
                          }}
                        />
                      </>
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

export default ButtonGroupBlock;
