import React from 'react';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { getImagePath, socialIcons } from '../utils/imageUtils';

const tableProps = {
  role: 'presentation',
  width: '100%',
  cellSpacing: '0',
  cellPadding: '0',
  border: '0',
};

const BlockRenderer = ({
  block,
  index,
  isActive,
  isHovered,
  isNestedBlock,
  showPreview,
  dragOverIndex,
  settings,
  template,
  setTemplate,
  handleDragStart,
  handleDragOver,
  handleDrop,
  setActiveBlockId,
  setHoveredBlockId,
  setDragOverIndex,
  handleDuplicateBlock,
  handleDeleteBlock,
  handleUpdateBlockContent,
  handleUpdateBlockSettings,
}) => {
  const { type, content } = block;

  const handleImageUpload = (
    e,
    buttonIndex = null,
    columnIndex = null,
    isHalfText = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (buttonIndex !== null) {
        const newBlocks = [...template.blocks];
        newBlocks[index].buttons[buttonIndex].settings.imageUrl = reader.result;
        setTemplate({ ...template, blocks: newBlocks });
      } else if (columnIndex !== null) {
        const newBlocks = [...template.blocks];
        newBlocks[index].columns[columnIndex].content = reader.result;
        setTemplate({ ...template, blocks: newBlocks });
      } else if (isHalfText) {
        const newBlocks = [...template.blocks];
        newBlocks[index].imageUrl = reader.result;
        setTemplate({ ...template, blocks: newBlocks });
      } else {
        handleUpdateBlockContent(index, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const shouldShowToolbar = isHovered || isActive;

  // Padding (separate)
  const topPad = settings?.paddingTop ?? settings?.padding ?? '0';
  const bottomPad = settings?.paddingBottom ?? settings?.padding ?? '0';

  const isSpacer = type === 'spacer';
  const isFooter =
    type === 'footer' ||
    type === 'footer_general_kz' ||
    type === 'footer_sendpulse';

  const blockStyle = {
    backgroundColor: settings?.backgroundColor || 'white',
    paddingTop: isSpacer || isFooter ? '0' : topPad,
    paddingBottom: isSpacer || isFooter ? '0' : bottomPad,
    paddingLeft: type === 'image' || isSpacer || isFooter ? '0' : '12%',
    paddingRight: type === 'image' || isSpacer || isFooter ? '0' : '12%',
    position: 'relative',
    cursor: 'pointer',
    border: isActive ? '2px solid #4299e1' : 'none',
    transition: 'all 0.2s ease',
    lineHeight: type === 'image' ? 0 : undefined,
  };

  const contentStyle = {
    color: settings?.color,
    fontSize: settings?.fontSize,
    textAlign: settings?.textAlign,
    whiteSpace: 'pre-wrap',
  };

  const imgBlockStyle = { maxWidth: '100%', border: 0, display: 'block' };

  const LANGUAGE_STRINGS = {
    ru: { questions: 'Есть вопросы?' },
    kz: { questions: 'Сұрақтарыңыз бар ма?' },
  };

  // --- Editor preview for footer ---
  const FooterPreview = (type = { type }) => {
    const canvas = settings?.canvascolor || '#f5f5f5';
    const text = settings?.textcolor || '#000000';
    const disclaimer = settings?.disclaimercolor || '#555555';
    const urls = settings?.urls || {};

    console.log('type = ', type);

    return (
      <table {...tableProps}>
        <tbody>
          <tr>
            <td
              style={{
                height: 50,
                fontSize: 0,
                lineHeight: 0,
                backgroundColor: canvas,
              }}>
              &nbsp;
            </td>
          </tr>

          {/* Socials */}
          <tr>
            <td style={{ backgroundColor: canvas }} align='center'>
              <table
                {...tableProps}
                style={{ width: '100%', margin: 0, padding: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ width: 120 }}>&nbsp;</td>
                    {[
                      ['facebook', 'Facebook'],
                      ['instagram', 'Instagram'],
                      ['vkontakte', 'VK'],
                      ['youtube', 'YouTube'],
                      ['twitter', 'Twitter'],
                      ['linkedin', 'LinkedIn'],
                    ].map(([key, alt]) => (
                      <td key={key} style={{ padding: '0 16px' }}>
                        <a href={urls?.[key] || '#'} title='Samsung Kazakhstan'>
                          <img
                            width='57'
                            src={getImagePath(socialIcons[key])}
                            alt={alt}
                            style={{ display: 'block', border: 0 }}
                          />
                        </a>
                      </td>
                    ))}
                    <td style={{ width: 120 }}>&nbsp;</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Contact */}
          <tr>
            <td
              style={{
                backgroundColor: canvas,
                textAlign: 'center',
                paddingTop: 16,
                paddingLeft: '10%',
                paddingRight: '10%',
              }}>
              <h1
                style={{
                  margin: '0 0 13px 0',
                  fontFamily: settings?.fontFamily || 'Arial, sans-serif',
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: text,
                  lineHeight: 1,
                }}>
                {LANGUAGE_STRINGS[type === 'footer' ? 'ru' : 'kz'].questions}
                {/* call footer only when the component is added */}
              </h1>
              <table
                {...tableProps}
                style={{
                  width: 'auto',
                  margin: '0 auto',
                  textAlign: 'center',
                  color: text,
                }}>
                <tbody>
                  <tr>
                    <td align='center' style={{ padding: 7 }}>
                      <a
                        href={urls?.livechat || '#'}
                        style={{
                          fontFamily:
                            settings?.fontFamily || 'Arial, sans-serif',
                          fontSize: 11,
                          color: text,
                          textDecoration: 'none',
                        }}>
                        <img
                          width='11'
                          src={getImagePath(socialIcons['livechat'])}
                          alt='online chat'
                        />{' '}
                        Онлайн чат
                      </a>
                    </td>
                    <td align='center' style={{ padding: 7 }}>
                      <a
                        href={urls?.call || '#'}
                        style={{
                          fontFamily:
                            settings?.fontFamily || 'Arial, sans-serif',
                          fontSize: 11,
                          color: text,
                          textDecoration: 'none',
                        }}>
                        <img
                          width='11'
                          src={getImagePath(socialIcons['call'])}
                          alt='call center'
                        />{' '}
                        Call Center 7700
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Legal */}
          <tr>
            <td style={{ backgroundColor: canvas }} align='center'>
              <table
                {...tableProps}
                style={{
                  width: 500,
                  margin: '0 auto',
                  textAlign: 'center',
                  color: disclaimer,
                }}>
                <tbody>
                  <tr>
                    <td style={{ height: 26 }}>&nbsp;</td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontSize: 14,
                        color: disclaimer,
                        fontFamily: settings?.fontFamily || 'Arial, sans-serif',
                      }}>
                      {type !== 'footer_sendpulse' ? (
                        <p>
                          Вы получили это письмо, потому что подписались
                          на&nbsp;рассылку Samsung. Не&nbsp;отвечайте
                          на&nbsp;данное письмо. Оно является автоматической
                          рассылкой. Чтобы отказаться от получения наших
                          рассылок, пожалуйста,
                          перейдите&nbsp;по&nbsp;этой&nbsp;
                          {urls?.optout ? (
                            <a
                              href={urls.optout}
                              style={{
                                textDecoration: 'underline',
                                color: disclaimer,
                              }}>
                              ссылке
                            </a>
                          ) : (
                            'ссылке.'
                          )}
                          .
                        </p>
                      ) : null}
                      <br />©{new Date().getFullYear()} Samsung Electronics Co.,
                      Ltd. Все права защищены.
                      <br />
                      ТОО «SAMSUNG ELECTRONICS CENTRAL EURASIA»
                      <br />
                      (САМСУНГ ЭЛЕКТРОНИКС ЦЕНТРАЛЬНАЯ ЕВРАЗИЯ)
                      <br />
                      Республика Казахстан, г. Алматы, 050000, улица Желтоксан,
                      д. 115,
                      <br />
                      Торгово-офисный центр «Kaisar Plaza», 3 этаж.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ height: 24 }}>&nbsp;</td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        height: 24,
                        fontSize: 14,
                        fontFamily: settings?.fontFamily || 'Arial, sans-serif',
                      }}>
                      <a
                        href={urls?.legal || '#'}
                        style={{
                          fontSize: 14,
                          color: settings?.textcolor || '#000',
                          textDecoration: 'underline',
                        }}>
                        Правовая информация
                      </a>
                      &nbsp;|&nbsp;
                      <a
                        href={urls?.privacy || '#'}
                        style={{
                          fontSize: 14,
                          color: settings?.textcolor || '#000',
                          textDecoration: 'underline',
                        }}>
                        Политика конфиденциальности
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ height: 115 }}>&nbsp;</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  let blockContent;

  switch (type) {
    case 'header':
      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td
                style={{
                  textAlign: settings?.textAlign || 'left',
                }}>
                <h1
                  style={contentStyle}
                  contentEditable={isActive}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleUpdateBlockContent(index, e.target.innerText)
                  }>
                  {content}
                </h1>
              </td>
            </tr>
          </tbody>
        </table>
      );
      break;

    case 'text':
      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td style={{ textAlign: settings?.textAlign || 'left' }}>
                <p
                  style={contentStyle}
                  contentEditable={isActive}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleUpdateBlockContent(index, e.target.innerText)
                  }>
                  {content}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      );
      break;

    case 'image':
      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td style={{ textAlign: settings?.textAlign || 'left' }}>
                {settings?.linkUrl ? (
                  <a
                    href={`${settings.linkUrl}`}
                    target='_blank'
                    rel='noopener noreferrer'>
                    <img
                      src={content}
                      alt={settings?.altText || ''}
                      style={imgBlockStyle}
                    />
                  </a>
                ) : (
                  <img
                    src={content}
                    alt={settings?.altText || ''}
                    style={imgBlockStyle}
                  />
                )}
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
                              placeholder='Image URL'
                              value={content}
                              onChange={(e) =>
                                handleUpdateBlockContent(index, e.target.value)
                              }
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
                                  e.target.value
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
                                  e.target.value
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
                                  e.target.value
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
      break;

    case 'button':
      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td style={{ textAlign: settings?.textAlign || 'center' }}>
                <a
                  href={`${settings?.linkUrl}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ display: 'inline-block' }}>
                  <img
                    src={settings?.imageUrl}
                    alt={settings?.imageAlt}
                    style={{
                      display: 'block',
                      margin: '0 auto',
                      maxWidth: '100%',
                      height: 'auto',
                      border: 0,
                    }}
                  />
                </a>
                {isActive && (
                  <div className='button-settings'>
                    <input
                      type='file'
                      accept='image/*'
                      className='settings-input'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () =>
                          handleUpdateBlockSettings(
                            index,
                            'imageUrl',
                            reader.result
                          );
                        reader.readAsDataURL(file);
                      }}
                      style={{ marginBottom: 8 }}
                    />
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='Image URL'
                      value={settings?.imageUrl || ''}
                      onChange={(e) =>
                        handleUpdateBlockSettings(
                          index,
                          'imageUrl',
                          e.target.value
                        )
                      }
                    />
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='Alt text'
                      value={settings?.imageAlt || ''}
                      onChange={(e) =>
                        handleUpdateBlockSettings(
                          index,
                          'imageAlt',
                          e.target.value
                        )
                      }
                    />
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='Link URL'
                      value={settings?.linkUrl || ''}
                      onChange={(e) =>
                        handleUpdateBlockSettings(
                          index,
                          'linkUrl',
                          e.target.value
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
                          e.target.value
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
      break;

    case 'buttonCoded': {
      const buttonStyles = {
        textDecoration: 'none',
        letterSpacing: 0,
        display: 'inline',
        borderRadius: '30px',
        fontWeight: 'bold',
        fontSize: settings?.fontSize,
        color: settings?.color,
        padding: settings?.padding,
        backgroundColor: settings?.buttonBgColor,
        border: settings?.border,
      };
      blockContent = (
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
                  <p style={buttonStyles}>{content}</p>
                </a>
                {isActive && (
                  <div className='button-settings'>
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='Click Me'
                      value={content || ''}
                      onChange={(e) =>
                        handleUpdateBlockSettings(
                          index,
                          'content',
                          e.target.value
                        )
                      }
                    />
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='Link URL'
                      value={settings?.linkUrl || ''}
                      onChange={(e) =>
                        handleUpdateBlockSettings(
                          index,
                          'linkUrl',
                          e.target.value
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
                          e.target.value
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
      break;
    }

    case 'buttonGroup': {
      const container = {
        display: 'flex',
        flexDirection: settings?.inline ? 'row' : 'column',
        gap: settings?.gap,
        justifyContent: 'center',
      };
      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center' }}>
                <div style={container}>
                  {block.buttons?.map((button, buttonIndex) => (
                    <div key={buttonIndex}>
                      <a
                        href={`${button.settings?.linkUrl}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{ display: 'inline-block' }}>
                        <img
                          src={button.settings?.imageUrl}
                          alt={button.settings?.imageAlt}
                          style={{
                            display: 'block',
                            margin: '0 auto',
                            maxWidth: '100%',
                            height: 'auto',
                            border: 0,
                          }}
                        />
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
                            placeholder='Image URL'
                            value={button.settings?.imageUrl || ''}
                            onChange={(e) => {
                              const newBlocks = [...template.blocks];
                              newBlocks[index].buttons[
                                buttonIndex
                              ].settings.imageUrl = e.target.value;
                              setTemplate({ ...template, blocks: newBlocks });
                            }}
                          />
                          <input
                            type='text'
                            className='settings-input'
                            placeholder='Alt text'
                            value={button.settings?.imageAlt || ''}
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
                            value={button.settings?.linkUrl || ''}
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
                            value={button.settings?.linkLabel || ''}
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
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      );
      break;
    }

    case 'divider':
      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td>
                <table {...tableProps}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          height: settings?.lineHeight || '1px',
                          backgroundColor: settings?.lineColor || '#ddd',
                        }}
                      />
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      );
      break;

    case 'spacer':
      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td>
                <table {...tableProps}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          backgroundColor:
                            settings?.backgroundColor || '#e5e5e5',
                          height: settings?.height || '40px',
                        }}
                      />
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      );
      break;

    case 'columns': {
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
            content: '',
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

      const updateCol = (colIndex, path, value) => {
        const newBlocks = [...template.blocks];
        const col = { ...(newBlocks[index].columns?.[colIndex] || {}) };
        if (path === 'content') col.content = value;
        else col.settings = { ...(col.settings || {}), [path]: value };
        const arr = [...(newBlocks[index].columns || [])];
        arr[colIndex] = col;
        newBlocks[index].columns = arr;
        setTemplate({ ...template, blocks: newBlocks });
      };

      const onUpload = (e, colIndex) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateCol(colIndex, 'content', reader.result);
        reader.readAsDataURL(file);
      };

      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td>
                <table {...tableProps} className='columns-container'>
                  <tbody>
                    <tr>
                      {cols.map((c, colIndex) => (
                        <td
                          key={colIndex}
                          width={widthPercent}
                          style={{
                            paddingLeft: colIndex === 0 ? 0 : halfGap,
                            paddingRight: colIndex === count - 1 ? 0 : halfGap,
                          }}>
                          {c?.settings?.linkUrl ? (
                            <a
                              href={`${c.settings.linkUrl}`}
                              target='_blank'
                              rel='noopener noreferrer'>
                              <img
                                src={c?.content}
                                alt={c?.settings?.altText || ''}
                                style={imgBlockStyle}
                              />
                            </a>
                          ) : (
                            <img
                              src={c?.content}
                              alt={c?.settings?.altText || ''}
                              style={imgBlockStyle}
                            />
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
                                placeholder='Image URL'
                                value={c?.content || ''}
                                onChange={(e) =>
                                  updateCol(colIndex, 'content', e.target.value)
                                }
                              />
                              <input
                                type='text'
                                className='settings-input'
                                placeholder='Alt text'
                                value={c?.settings?.altText || ''}
                                onChange={(e) =>
                                  updateCol(colIndex, 'altText', e.target.value)
                                }
                              />
                              <input
                                type='text'
                                className='settings-input'
                                placeholder='Link URL (optional)'
                                value={c?.settings?.linkUrl || ''}
                                onChange={(e) =>
                                  updateCol(colIndex, 'linkUrl', e.target.value)
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
                                    e.target.value
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
                      ))}
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
      break;
    }

    case 'halfText': {
      const imageContainerStyle = {
        width: settings?.imageWidth,
        display: 'inline-block',
        verticalAlign: 'top',
      };

      const textContainerStyle = {
        width: `calc(100% - ${settings?.imageWidth})`,
        display: 'inline-block',
        verticalAlign: 'top',
        padding: '0 20px',
      };

      const halfTextContentStyle = {
        color: settings?.color,
        fontSize: settings?.fontSize,
        textAlign: settings?.textAlign,
        fontFamily: settings?.fontFamily,
      };

      const tableStyle = {
        backgroundColor: settings?.backgroundColor,
        padding: settings?.padding,
        width: '100%',
      };

      const renderImage = () =>
        settings?.imageLinkUrl ? (
          <a
            href={`${settings.imageLinkUrl}`}
            target='_blank'
            rel='noopener noreferrer'>
            <img
              src={block.imageUrl}
              alt={settings?.altText || ''}
              style={imgBlockStyle}
            />
          </a>
        ) : (
          <img
            src={block.imageUrl}
            alt={settings?.altText || ''}
            style={imgBlockStyle}
          />
        );

      const Button = () =>
        settings?.showButton ? (
          <a
            href={`${settings?.buttonUrl}`}
            target='_blank'
            rel='noopener noreferrer'
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: settings?.buttonColor,
              color: settings?.buttonTextColor,
              textDecoration: 'none',
              borderRadius: 4,
              marginTop: 16,
            }}>
            {settings?.buttonText}
          </a>
        ) : null;

      const TextBlock = () => (
        <div>
          <div
            style={halfTextContentStyle}
            contentEditable={isActive}
            suppressContentEditableWarning
            onBlur={(e) => handleUpdateBlockContent(index, e.target.innerHTML)}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <Button />
        </div>
      );

      blockContent = (
        <table {...tableProps} style={tableStyle}>
          <tbody>
            <tr>
              <td>
                <table {...tableProps}>
                  <tbody>
                    <tr>
                      <td
                        style={
                          settings?.imagePosition === 'left'
                            ? imageContainerStyle
                            : textContainerStyle
                        }>
                        {settings?.imagePosition === 'left' ? (
                          renderImage()
                        ) : (
                          <TextBlock />
                        )}
                      </td>
                      <td
                        style={
                          settings?.imagePosition === 'left'
                            ? textContainerStyle
                            : imageContainerStyle
                        }>
                        {settings?.imagePosition === 'left' ? (
                          <TextBlock />
                        ) : (
                          renderImage()
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      );
      break;
    }

    case 'footer':
    case 'footer_general_kz':
    case 'footer_sendpulse':
      blockContent = <FooterPreview type={type} />;
      break;

    default:
      blockContent = <div>Unknown block type</div>;
  }

  return (
    <div
      key={block.id}
      className={`block-container ${
        dragOverIndex === index ? 'drag-over' : ''
      }`}
      data-index={index}
      draggable
      onMouseEnter={() => !isNestedBlock && setHoveredBlockId(block.id)}
      onMouseLeave={() => !isNestedBlock && setHoveredBlockId(null)}
      onDragStart={(e) => {
        e.stopPropagation();
        handleDragStart(e, block);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDragOver(e, index);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setDragOverIndex(null);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDrop(e, index);
      }}
      onClick={() => !isNestedBlock && setActiveBlockId(block.id)}>
      <div style={blockStyle}>
        {!showPreview && !isNestedBlock && (
          <div
            className='block-type-indicator'
            style={{
              color:
                type === 'header' || type === 'text'
                  ? settings?.color
                  : undefined,
            }}>
            <GripVertical size={14} className='drag-handle' />
            <div className='block-type-text'>{type}</div>
          </div>
        )}

        {!showPreview && shouldShowToolbar && !isNestedBlock && (
          <div className='block-actions'>
            <button
              className='action-button'
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicateBlock(index);
              }}>
              <Copy size={14} className='action-icon' />
            </button>
            <button
              className='action-button'
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBlock(index);
              }}>
              <Trash2 size={14} className='action-icon' />
            </button>
          </div>
        )}

        {blockContent}

        {!showPreview && isActive && !isNestedBlock && (
          <div className='block-settings'>
            <div className='control-flex margin-bottom-small'>
              <input
                type='color'
                value={settings?.backgroundColor || '#ffffff'}
                onChange={(e) =>
                  handleUpdateBlockSettings(
                    index,
                    'backgroundColor',
                    e.target.value
                  )
                }
                className='color-input'
              />

              {type === 'spacer' && (
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Height (e.g. 40px)'
                  value={settings?.height || ''}
                  onChange={(e) =>
                    handleUpdateBlockSettings(index, 'height', e.target.value)
                  }
                  style={{ width: 80 }}
                />
              )}

              {type === 'divider' && (
                <>
                  <input
                    type='color'
                    value={settings?.lineColor || '#dddddd'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'lineColor',
                        e.target.value
                      )
                    }
                    className='color-input'
                  />
                  <input
                    type='text'
                    className='settings-input'
                    placeholder='Height (e.g. 1px)'
                    value={settings?.lineHeight || ''}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'lineHeight',
                        e.target.value
                      )
                    }
                    style={{ width: 80 }}
                  />
                </>
              )}

              {(type === 'header' ||
                type === 'text' ||
                type === 'halfText') && (
                <>
                  <input
                    type='color'
                    value={settings?.color || '#000000'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(index, 'color', e.target.value)
                    }
                    className='color-input'
                  />
                  <input
                    type='text'
                    className='control-select'
                    value={settings?.fontSize || ''}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'fontSize',
                        e.target.value
                      )
                    }
                  />
                </>
              )}

              {/* Separate vertical paddings */}
              {type !== 'spacer' && (
                <>
                  <select
                    className='control-select flex-grow'
                    value={settings?.paddingTop ?? settings?.padding ?? '10px'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'paddingTop',
                        e.target.value
                      )
                    }
                    title='Padding top'>
                    <option value='0px'>No padding top</option>
                    <option value='16px'>Small top</option>
                    <option value='24px'>Medium top</option>
                    <option value='40px'>Large top</option>
                  </select>

                  <select
                    className='control-select flex-grow'
                    value={
                      settings?.paddingBottom ?? settings?.padding ?? '10px'
                    }
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'paddingBottom',
                        e.target.value
                      )
                    }
                    title='Padding bottom'>
                    <option value='0px'>No padding bottom</option>
                    <option value='16px'>Small bottom</option>
                    <option value='24px'>Medium bottom</option>
                    <option value='40px'>Large bottom</option>
                  </select>
                </>
              )}

              {type === 'columns' && (
                <>
                  <div
                    className='control-flex'
                    style={{ flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      Column gap
                    </div>
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='e.g. 16px'
                      value={settings?.columnGap || ''}
                      onChange={(e) =>
                        handleUpdateBlockSettings(
                          index,
                          'columnGap',
                          e.target.value
                        )
                      }
                      style={{ width: 160 }}
                    />
                  </div>
                </>
              )}

              {type === 'buttonGroup' && (
                <div className='checkbox-container'>
                  <input
                    type='checkbox'
                    id={`inline-${block.id}`}
                    checked={!!settings?.inline}
                    onChange={(e) => {
                      const newBlocks = [...template.blocks];
                      newBlocks[index].settings.inline = e.target.checked;
                      setTemplate({ ...template, blocks: newBlocks });
                    }}
                  />
                  <label htmlFor={`inline-${block.id}`}>
                    Display buttons inline
                  </label>
                </div>
              )}

              {(type === 'header' ||
                type === 'text' ||
                type === 'halfText') && (
                <select
                  className='control-select'
                  value={settings?.textAlign || 'left'}
                  onChange={(e) =>
                    handleUpdateBlockSettings(
                      index,
                      'textAlign',
                      e.target.value
                    )
                  }>
                  <option value='left'>Left</option>
                  <option value='center'>Center</option>
                  <option value='right'>Right</option>
                </select>
              )}

              {(type === 'footer' ||
                type === 'footer_general_kz' ||
                type === 'footer_sendpulse') && (
                <div className='control-flex margin-bottom-small'>
                  <input
                    type='color'
                    value={settings?.canvascolor || '#f5f5f5'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'canvascolor',
                        e.target.value
                      )
                    }
                    className='color-input'
                  />
                  <input
                    type='color'
                    value={settings?.textcolor || '#000000'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'textcolor',
                        e.target.value
                      )
                    }
                    className='color-input'
                  />
                  <input
                    type='color'
                    value={settings?.disclaimercolor || '#555555'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'disclaimercolor',
                        e.target.value
                      )
                    }
                    className='color-input'
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockRenderer;
