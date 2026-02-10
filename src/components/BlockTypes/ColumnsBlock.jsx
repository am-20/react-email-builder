import React from 'react';
import { addFileAsset } from '../../utils/assets';

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
 * ColumnsBlock - Renders multiple columns with images
 * Each column can have image, alt text, and link
 * Supports add/remove columns
 */
const ColumnsBlock = ({
  block,
  settings,
  index,
  isActive,
  template,
  setTemplate,
}) => {
  const cols = Array.isArray(block.columns) ? block.columns : [];
  const count = Math.max(cols.length, 1);
  const gap = settings?.columnGap || '0';
  const widthPercent = `${(100 / count).toFixed(4)}%`;
  const halfGap =
    typeof gap === 'string' && /-?\d+(\.\d+)?(px|em|rem|%)$/.test(gap)
      ? `calc((${gap}) / 2)`
      : '0';

  const addColumn = () => {
    const newBlocks = [...template.blocks];
    newBlocks[index].columns = [
      ...(newBlocks[index].columns || []),
      {
        content: 'https://placehold.co/300x200',
        settings: { altText: '', linkUrl: '', linkLabel: '' },
      },
    ];
    setTemplate({ ...template, blocks: newBlocks });
  };

  const removeColumn = (colIndex) => {
    const newBlocks = [...template.blocks];
    const current = newBlocks[index].columns || [];
    if (current.length <= 1) return;
    newBlocks[index].columns = current.filter((_, i) => i !== colIndex);
    setTemplate({ ...template, blocks: newBlocks });
  };

  const updateCol = (colIndex, key, value, isSetting = false) => {
    const newBlocks = [...template.blocks];
    const col = { ...(newBlocks[index].columns?.[colIndex] || {}) };
    if (isSetting) {
      col.settings = { ...(col.settings || {}), [key]: value };
    } else {
      col[key] = value;
    }
    const arr = [...(newBlocks[index].columns || [])];
    arr[colIndex] = col;
    newBlocks[index].columns = arr;
    setTemplate({ ...template, blocks: newBlocks });
  };

  const onUpload = (e, colIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const asset = addFileAsset(file);
    updateCol(colIndex, 'imagePath', asset.path, false);
    updateCol(colIndex, 'imagePreviewUrl', asset.previewUrl, false);
    updateCol(colIndex, 'content', asset.previewUrl, false);
  };

  return (
    <table {...tableProps}>
      <tbody>
        <tr>
          <td>
            <table {...tableProps} className='columns-container'>
              <tbody>
                <tr>
                  {cols.map((c, colIndex) => {
                    const colSrc =
                      c?.imagePreviewUrl || c?.imagePath || c?.content || '';
                    return (
                      <td
                        key={colIndex}
                        width={widthPercent}
                        style={{
                          verticalAlign: 'top',
                          paddingLeft: colIndex === 0 ? 0 : halfGap,
                          paddingRight: colIndex === 0 ? halfGap : 0,
                        }}>
                        {c?.settings?.linkUrl ? (
                          <a
                            href={`${c.settings.linkUrl}`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            {colSrc && (
                              <img
                                src={colSrc}
                                alt={c?.settings?.altText || ''}
                                style={{
                                  ...IMG_BLOCK_STYLE,
                                }}
                              />
                            )}
                          </a>
                        ) : (
                          colSrc && (
                            <img
                              src={colSrc}
                              alt={c?.settings?.altText || ''}
                              style={{
                                ...IMG_BLOCK_STYLE,
                              }}
                            />
                          )
                        )}

                        {isActive && (
                          <div className='column-settings'>
                            <input
                              type='file'
                              accept='image/*'
                              className='settings-input'
                              onChange={(e) => onUpload(e, colIndex)}
                              style={{ marginBottom: 8 }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Image path or URL'
                              value={c?.imagePath || ''}
                              onChange={(e) => {
                                const url = e.target.value;
                                updateCol(colIndex, 'imagePath', url, false);
                                updateCol(
                                  colIndex,
                                  'imagePreviewUrl',
                                  url,
                                  false,
                                );
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Alt text'
                              value={c?.settings?.altText || ''}
                              onChange={(e) =>
                                updateCol(
                                  colIndex,
                                  'altText',
                                  e.target.value,
                                  true,
                                )
                              }
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link URL (optional)'
                              value={c?.settings?.linkUrl || ''}
                              onChange={(e) =>
                                updateCol(
                                  colIndex,
                                  'linkUrl',
                                  e.target.value,
                                  true,
                                )
                              }
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link Label (optional)'
                              value={c?.settings?.linkLabel || ''}
                              onChange={(e) =>
                                updateCol(
                                  colIndex,
                                  'linkLabel',
                                  e.target.value,
                                  true,
                                )
                              }
                            />
                            <div
                              className='control-flex'
                              style={{ gap: 8, marginTop: 6 }}>
                              <button
                                className='action-button'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeColumn(colIndex);
                                }}
                                disabled={count <= 1}>
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>

            {isActive && (
              <div className='control-flex margin-top-small'>
                <button
                  className='action-button'
                  onClick={(e) => {
                    e.stopPropagation();
                    addColumn();
                  }}>
                  + Add column
                </button>
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ColumnsBlock;
