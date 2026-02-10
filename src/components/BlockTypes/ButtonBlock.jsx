import React from 'react';
import { addFileAsset } from '../../utils/assets';

const tableProps = {
  role: 'presentation',
  width: '100%',
  cellSpacing: '0',
  cellPadding: '0',
  border: '0',
};

/**
 * ButtonBlock - Renders a single image button with link
 * Includes inline image upload and URL controls
 */
const ButtonBlock = ({
  settings,
  index,
  isActive,
  setTemplate,
  handleUpdateBlockSettings,
}) => {
  const btnSrc =
    settings?.imagePreviewUrl ||
    settings?.imagePath ||
    'https://placehold.co/80x40';

  const uploadBtn = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const asset = addFileAsset(file);

    setTemplate((prev) => {
      const newBlocks = [...prev.blocks];
      const blk = newBlocks[index];
      blk.settings = {
        ...(blk.settings || {}),
        imagePath: asset.path,
        imagePreviewUrl: asset.previewUrl,
      };
      return { ...prev, blocks: newBlocks };
    });
  };

  const manualBtn = (e) => {
    const url = e.target.value;
    handleUpdateBlockSettings(index, 'imagePath', url);
    handleUpdateBlockSettings(index, 'imagePreviewUrl', url);
  };

  return (
    <table {...tableProps}>
      <tbody>
        <tr>
          <td style={{ textAlign: settings?.textAlign || 'center' }}>
            <a
              href={`${settings?.linkUrl || ''}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{ display: 'inline-block' }}>
              {btnSrc && (
                <img
                  src={btnSrc}
                  alt={settings?.imageAlt || ''}
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
              <div className='button-settings'>
                <input
                  type='file'
                  accept='image/*'
                  className='settings-input'
                  onChange={uploadBtn}
                  style={{ marginBottom: 8 }}
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Image path or URL'
                  onChange={manualBtn}
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Alt text'
                  value={settings?.imageAlt || ''}
                  onChange={(e) =>
                    handleUpdateBlockSettings(index, 'imageAlt', e.target.value)
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

export default ButtonBlock;
