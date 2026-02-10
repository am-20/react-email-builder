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
 * ColumnsContentBlock - Renders multiple columns with image, title, and text
 * Each column has contentEditable title and text
 * Supports add/remove columns and extensive per-column settings
 */
const ColumnsContentBlock = ({
  block,
  settings,
  index,
  isActive,
  contentStyle,
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
        imgUrl: 'https://placehold.co/300x200',
        title: 'New title',
        text: 'New text',
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
    updateCol(colIndex, 'imgUrl', asset.previewUrl, false);
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
                      c?.imagePreviewUrl || c?.imagePath || c?.imgUrl || '';
                    return (
                      <td
                        key={colIndex}
                        width={widthPercent}
                        style={{
                          verticalAlign: 'top',
                          textAlign: c?.textAlign || 'center',
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
                        <h1
                          style={{
                            ...contentStyle,
                            padding: '16px 0 8px',
                            color: settings?.color || '#000',
                            fontSize: c?.settings?.titleFontSize || '24px',
                            display: settings?.hidetitle ? 'none' : null,
                          }}
                          contentEditable={isActive}
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            updateCol(colIndex, 'title', e.target.innerText)
                          }>
                          {c?.title}
                        </h1>
                        <p
                          style={{
                            ...contentStyle,
                            color: settings?.color || '#000',
                            fontSize: c?.settings?.textFontSize || '12px',
                            padding: settings?.hidetitle ? '16px 0' : 0,
                            fontWeight: settings?.isBold ? 'bold' : 'normal',
                          }}
                          contentEditable={isActive}
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            updateCol(colIndex, 'text', e.target.innerText)
                          }>
                          {c?.text}
                        </p>
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
                            <input
                              type='number'
                              className='settings-input'
                              placeholder='Title font size (px)'
                              value={
                                c?.settings?.titleFontSize
                                  ? parseInt(c.settings.titleFontSize, 10)
                                  : ''
                              }
                              onChange={(e) =>
                                updateCol(
                                  colIndex,
                                  'titleFontSize',
                                  e.target.value ? `${e.target.value}px` : '',
                                  true,
                                )
                              }
                            />

                            <input
                              type='number'
                              className='settings-input'
                              placeholder='Text font size (px)'
                              value={
                                c?.settings?.textFontSize
                                  ? parseInt(c.settings.textFontSize, 10)
                                  : ''
                              }
                              onChange={(e) =>
                                updateCol(
                                  colIndex,
                                  'textFontSize',
                                  e.target.value ? `${e.target.value}px` : '',
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

export default ColumnsContentBlock;
