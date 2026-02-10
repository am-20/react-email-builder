import React from 'react';

const tableProps = {
  role: 'presentation',
  width: '100%',
  cellSpacing: '0',
  cellPadding: '0',
  border: '0',
};

const IMG_BLOCK_STYLE = {
  maxWidth: '100%',
  border: 0,
  display: 'block',
  margin: '0 auto',
};

/**
 * HeaderBlock - Renders a header with optional image
 * Includes inline image upload control when isActive
 */
const HeaderBlock = ({
  content,
  settings,
  index,
  isActive,
  contentStyle,
  handleUpdateBlockContent,
  handleImageUpload,
}) => {
  const srcForEditor =
    settings?.imagePreviewUrl ||
    settings?.imageUrl ||
    settings?.imagePath ||
    'https://placehold.co/80x80';

  return (
    <table {...tableProps}>
      <tbody>
        <tr>
          {settings?.isImage ? (
            <td style={{ textAlign: settings?.textAlign || 'left' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  flexWrap: 'wrap',
                }}>
                <img
                  src={srcForEditor}
                  alt='voucher'
                  style={{ ...IMG_BLOCK_STYLE, margin: 0 }}
                />
                <h1
                  style={contentStyle}
                  contentEditable={isActive}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleUpdateBlockContent(index, e.target.innerText)
                  }>
                  {content}
                </h1>
              </div>

              {isActive && (
                <div style={{ marginTop: 8 }}>
                  <div className='button-settings'>
                    <input
                      type='file'
                      accept='image/*'
                      className='settings-input'
                      onChange={(e) =>
                        handleImageUpload(e, null, null, false, true)
                      }
                      style={{ marginBottom: 8 }}
                    />
                  </div>
                </div>
              )}
            </td>
          ) : (
            <td style={{ textAlign: settings?.textAlign || 'left' }}>
              <h1
                style={{ ...contentStyle, paddingBottom: '8px' }}
                contentEditable={isActive}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleUpdateBlockContent(index, e.target.innerText)
                }>
                {content}
              </h1>
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
};

export default HeaderBlock;
