import React from 'react';

const tableProps = {
  role: 'presentation',
  width: '100%',
  cellSpacing: '0',
  cellPadding: '0',
  border: '0',
};

/**
 * ImageBlock - Renders an image with optional link and inline controls
 * Includes all the inline editing controls when isActive
 * Alignment is controlled via margin setting (not textAlign)
 */
const ImageBlock = ({
  settings,
  index,
  isActive,
  manualUrlValue,
  setManualUrlValue,
  handleImageUpload,
  handleUpdateBlockSettings,
}) => {
  const srcForEditor =
    settings?.imagePreviewUrl ||
    settings?.imagePath ||
    'https://placehold.co/640x300';

  const handleManualUrl = (e) => {
    const url = e.target.value;
    setManualUrlValue(url);
    handleUpdateBlockSettings(index, 'imagePath', url);
    handleUpdateBlockSettings(index, 'imagePreviewUrl', url);
  };

  // Image style with dynamic margin for alignment
  const imgStyle = {
    maxWidth: '100%',
    border: 0,
    display: 'block',
    margin: settings?.margin || '0 auto', // Use margin from settings
  };

  const ImageEl =
    srcForEditor &&
    (settings?.linkUrl ? (
      <a href={`${settings.linkUrl}`} target='_blank' rel='noopener noreferrer'>
        <img
          src={srcForEditor}
          alt={settings?.altText || ''}
          style={imgStyle} // ← Using dynamic style
        />
      </a>
    ) : (
      <img
        src={srcForEditor}
        alt={settings?.altText || ''}
        style={imgStyle} // ← Using dynamic style
      />
    ));

  return (
    <table {...tableProps}>
      <tbody>
        <tr>
          <td>
            {ImageEl}

            {isActive && (
              <table {...tableProps} style={{ marginTop: 8 }}>
                <tbody>
                  <tr>
                    <td>
                      <div className='button-settings'>
                        <input
                          type='file'
                          accept='image/*'
                          className='settings-input'
                          onChange={handleImageUpload}
                          style={{ marginBottom: 8 }}
                        />

                        <input
                          type='text'
                          className='settings-input'
                          placeholder='Image path or URL (e.g. i/1.png or https://...)'
                          value={manualUrlValue}
                          onChange={handleManualUrl}
                        />

                        <input
                          type='text'
                          className='settings-input'
                          placeholder='Alt text'
                          value={settings?.altText || ''}
                          onChange={(e) =>
                            handleUpdateBlockSettings(
                              index,
                              'altText',
                              e.target.value,
                            )
                          }
                        />
                        <input
                          type='text'
                          className='settings-input'
                          placeholder='Link URL (optional)'
                          value={settings?.linkUrl || ''}
                          onChange={(e) =>
                            handleUpdateBlockSettings(
                              index,
                              'linkUrl',
                              e.target.value,
                            )
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
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ImageBlock;
