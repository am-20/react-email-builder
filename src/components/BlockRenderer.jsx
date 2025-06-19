import React from 'react';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { getImagePath, socialIcons } from '../utils/imageUtils';

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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (buttonIndex !== null) {
          // Handle buttonGroup image upload
          const newBlocks = [...template.blocks];
          newBlocks[index].buttons[buttonIndex].settings.imageUrl =
            reader.result;
          setTemplate({ ...template, blocks: newBlocks });
        } else if (columnIndex !== null) {
          // Handle columns image upload
          const newBlocks = [...template.blocks];
          newBlocks[index].columns[columnIndex].content = reader.result;
          setTemplate({ ...template, blocks: newBlocks });
        } else if (isHalfText) {
          // Handle halfText image upload
          const newBlocks = [...template.blocks];
          newBlocks[index].imageUrl = reader.result;
          setTemplate({ ...template, blocks: newBlocks });
        } else {
          // Handle regular image block upload
          handleUpdateBlockContent(index, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Only show toolbar for the main block, not for nested blocks
  const shouldShowToolbar = isHovered || isActive;

  const [vertical] = (settings?.padding || '10px').split(' ');
  const isImageOrSpacer = block.type === 'image' || block.type === 'spacer';
  const isFooter =
    block.type === 'footer' ||
    block.type === 'footer_general_kz' ||
    block.type === 'footer_sendpulse';

  const blockStyle = {
    backgroundColor: settings?.backgroundColor || 'white',
    paddingTop: isImageOrSpacer || isFooter ? '0' : vertical,
    paddingBottom: isImageOrSpacer || isFooter ? '0' : vertical,
    paddingLeft: isImageOrSpacer || isFooter ? '0' : '12%',
    paddingRight: isImageOrSpacer || isFooter ? '0' : '12%',
    position: 'relative',
    cursor: 'pointer',
    border: isActive ? '2px solid #4299e1' : 'none',
    transition: 'all 0.2s ease',
  };

  if (block.type === 'image') {
    blockStyle.lineHeight = 0;
  }

  const contentStyle = {
    color: settings?.color,
    fontSize: settings?.fontSize,
    textAlign: settings?.textAlign,
  };

  let blockContent;

  switch (type) {
    case 'header':
      blockContent = (
        <table
          role='presentation'
          width='100%'
          cellSpacing='0'
          cellPadding='0'
          border='0'>
          <tbody>
            <tr>
              <td style={{ textAlign: settings?.textAlign || 'left' }}>
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
        <table
          role='presentation'
          width='100%'
          cellSpacing='0'
          cellPadding='0'
          border='0'>
          <tbody>
            <tr>
              <td style={{ textAlign: settings?.textAlign || 'left' }}>
                <div
                  style={contentStyle}
                  contentEditable={isActive}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleUpdateBlockContent(index, e.target.innerHTML)
                  }
                  dangerouslySetInnerHTML={{ __html: content }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      // Allow Enter key for new paragraphs
                    }
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      );
      break;
    case 'image':
      blockContent = (
        <table
          role='presentation'
          width='100%'
          cellSpacing='0'
          cellPadding='0'
          border='0'>
          <tbody>
            <tr>
              <td style={{ textAlign: settings?.textAlign || 'left' }}>
                {settings?.linkUrl ? (
                  <a
                    href={`${settings.linkUrl}${
                      settings?.linkSuffix ||
                      '?content_type=text&creative=creative&segment=no-segment'
                    }`}
                    target='_blank'
                    rel='noopener noreferrer'>
                    <img
                      src={content}
                      alt={settings?.altText || ''}
                      style={{ maxWidth: '100%', border: '0' }}
                    />
                  </a>
                ) : (
                  <img
                    src={content}
                    alt={settings?.altText || ''}
                    style={{ maxWidth: '100%', border: '0' }}
                  />
                )}
                {isActive && (
                  <table
                    role='presentation'
                    width='100%'
                    cellSpacing='0'
                    cellPadding='0'
                    border='0'
                    style={{ marginTop: '8px' }}>
                    <tbody>
                      <tr>
                        <td>
                          <div className='button-settings'>
                            <input
                              type='file'
                              accept='image/*'
                              className='settings-input'
                              onChange={(e) => handleImageUpload(e)}
                              style={{ marginBottom: '8px' }}
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
                              placeholder='Link Suffix (optional)'
                              value={
                                settings?.linkSuffix ||
                                '?content_type=text&creative=creative&segment=no-segment'
                              }
                              onChange={(e) =>
                                handleUpdateBlockSettings(
                                  index,
                                  'linkSuffix',
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
        <table
          role='presentation'
          width='100%'
          cellSpacing='0'
          cellPadding='0'
          border='0'>
          <tbody>
            <tr>
              <td style={{ textAlign: settings.textAlign || 'center' }}>
                <a
                  href={`${settings.linkUrl}${
                    settings?.linkSuffix ||
                    '?content_type=text&creative=creative&segment=no-segment'
                  }`}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ display: 'inline-block' }}>
                  <img
                    src={settings.imageUrl}
                    alt={settings.imageAlt}
                    style={{
                      display: 'block',
                      margin: '0 auto',
                      maxWidth: '100%',
                      height: 'auto',
                      border: '0',
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
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            handleUpdateBlockSettings(
                              index,
                              'imageUrl',
                              reader.result
                            );
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ marginBottom: '8px' }}
                    />
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='Image URL'
                      value={settings.imageUrl}
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
                      value={settings.imageAlt}
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
                      value={settings.linkUrl}
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
                      placeholder='Link Suffix (optional)'
                      value={
                        settings?.linkSuffix ||
                        '?content_type=text&creative=creative&segment=no-segment'
                      }
                      onChange={(e) =>
                        handleUpdateBlockSettings(
                          index,
                          'linkSuffix',
                          e.target.value
                        )
                      }
                    />
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='Link Label (optional)'
                      value={settings.linkLabel || ''}
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
    case 'buttonGroup': {
      const buttonContainerStyle = {
        display: 'flex',
        flexDirection: block.settings.inline ? 'row' : 'column',
        gap: block.settings.gap,
        justifyContent: 'center',
      };

      blockContent = (
        <table
          role='presentation'
          width='100%'
          cellSpacing='0'
          cellPadding='0'
          border='0'>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center' }}>
                <div style={buttonContainerStyle}>
                  {block.buttons.map((button, buttonIndex) => (
                    <div key={buttonIndex}>
                      <a
                        href={`${button.settings.linkUrl}${
                          button.settings?.linkSuffix ||
                          '?content_type=text&creative=creative&segment=no-segment'
                        }`}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{ display: 'inline-block' }}>
                        <img
                          src={button.settings.imageUrl}
                          alt={button.settings.imageAlt}
                          style={{
                            display: 'block',
                            margin: '0 auto',
                            maxWidth: '100%',
                            height: 'auto',
                            border: '0',
                          }}
                        />
                      </a>
                      {isActive && (
                        <div className='button-settings'>
                          <input
                            type='file'
                            accept='image/*'
                            className='settings-input'
                            onChange={(e) => handleImageUpload(e, buttonIndex)}
                            style={{ marginBottom: '8px' }}
                          />
                          <input
                            type='text'
                            className='settings-input'
                            placeholder='Image URL'
                            value={button.settings.imageUrl}
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
                            value={button.settings.imageAlt}
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
                            value={button.settings.linkUrl}
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
                            placeholder='Link Suffix (optional)'
                            value={
                              button.settings?.linkSuffix ||
                              '?content_type=text&creative=creative&segment=no-segment'
                            }
                            onChange={(e) => {
                              const newBlocks = [...template.blocks];
                              newBlocks[index].buttons[
                                buttonIndex
                              ].settings.linkSuffix = e.target.value;
                              setTemplate({ ...template, blocks: newBlocks });
                            }}
                          />
                          <input
                            type='text'
                            className='settings-input'
                            placeholder='Link Label (optional)'
                            value={button.settings.linkLabel || ''}
                            onChange={(e) => {
                              const newBlocks = [...template.blocks];
                              newBlocks[index].buttons[
                                buttonIndex
                              ].settings.linkLabel = e.target.value;
                              setTemplate({ ...template, blocks: newBlocks });
                            }}
                          />
                        </div>
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
        <table
          role='presentation'
          width='100%'
          cellSpacing='0'
          cellPadding='0'
          border='0'>
          <tbody>
            <tr>
              <td>
                <table
                  role='presentation'
                  width='100%'
                  cellSpacing='0'
                  cellPadding='0'
                  border='0'>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          height: settings?.lineHeight || '1px',
                          backgroundColor: settings?.lineColor || '#dddddd',
                        }}></td>
                    </tr>
                  </tbody>
                </table>
                {isActive && (
                  <table
                    role='presentation'
                    width='100%'
                    cellSpacing='0'
                    cellPadding='0'
                    border='0'
                    className='control-flex margin-top-small'>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type='color'
                            className='color-input'
                            value={settings?.lineColor || '#dddddd'}
                            onChange={(e) =>
                              handleUpdateBlockSettings(
                                index,
                                'lineColor',
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <select
                            className='control-select flex-grow'
                            value={settings?.lineHeight || '1px'}
                            onChange={(e) =>
                              handleUpdateBlockSettings(
                                index,
                                'lineHeight',
                                e.target.value
                              )
                            }>
                            <option value='1px'>Thin</option>
                            <option value='2px'>Medium</option>
                            <option value='3px'>Thick</option>
                          </select>
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
    case 'spacer':
      blockContent = (
        <table
          role='presentation'
          width='100%'
          cellSpacing='0'
          cellPadding='0'
          border='0'>
          <tbody>
            <tr>
              <td>
                <table
                  role='presentation'
                  width='100%'
                  cellSpacing='0'
                  cellPadding='0'
                  border='0'>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          height: settings?.height || '40px',
                          backgroundColor:
                            settings?.backgroundColor || '#e5e5e5',
                        }}></td>
                    </tr>
                  </tbody>
                </table>
                {isActive && (
                  <table
                    role='presentation'
                    width='100%'
                    cellSpacing='0'
                    cellPadding='0'
                    border='0'
                    className='margin-top-small'>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type='range'
                            min='10'
                            max='100'
                            className='range-input'
                            value={parseInt(settings?.height) || 30}
                            onChange={(e) =>
                              handleUpdateBlockSettings(
                                index,
                                'height',
                                `${e.target.value}px`
                              )
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className='text-small text-center'>
                          {settings?.height || '30px'}
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
    case 'columns':
      blockContent = (
        <table
          role='presentation'
          width='100%'
          cellSpacing='0'
          cellPadding='0'
          border='0'>
          <tbody>
            <tr>
              <td>
                <table
                  role='presentation'
                  width='100%'
                  cellSpacing='0'
                  cellPadding='0'
                  border='0'
                  className='columns-container'>
                  <tbody>
                    <tr>
                      <td width='50%'>
                        {block.columns[0].settings?.linkUrl ? (
                          <a
                            href={`${block.columns[0].settings.linkUrl}${
                              block.columns[0].settings?.linkSuffix ||
                              '?content_type=text&creative=creative&segment=no-segment'
                            }`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            <img
                              src={block.columns[0].content}
                              alt={block.columns[0].settings?.altText || ''}
                              style={{ maxWidth: '100%', border: '0' }}
                            />
                          </a>
                        ) : (
                          <img
                            src={block.columns[0].content}
                            alt={block.columns[0].settings?.altText || ''}
                            style={{ maxWidth: '100%', border: '0' }}
                          />
                        )}
                        {isActive && (
                          <div className='column-settings'>
                            <input
                              type='file'
                              accept='image/*'
                              className='settings-input'
                              onChange={(e) => handleImageUpload(e, null, 0)}
                              style={{ marginBottom: '8px' }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Image URL'
                              value={block.columns[0].content}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[0].content =
                                  e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Alt text'
                              value={block.columns[0].settings?.altText || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[0].settings.altText =
                                  e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link URL (optional)'
                              value={block.columns[0].settings?.linkUrl || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[0].settings.linkUrl =
                                  e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link Suffix (optional)'
                              value={
                                block.columns[0].settings?.linkSuffix ||
                                '?content_type=text&creative=creative&segment=no-segment'
                              }
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[
                                  index
                                ].columns[0].settings.linkSuffix =
                                  e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link Label (optional)'
                              value={block.columns[0].settings?.linkLabel || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[0].settings.linkLabel =
                                  e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                          </div>
                        )}
                      </td>
                      <td width='50%'>
                        {block.columns[1].settings?.linkUrl ? (
                          <a
                            href={`${block.columns[1].settings.linkUrl}${
                              block.columns[1].settings?.linkSuffix ||
                              '?content_type=text&creative=creative&segment=no-segment'
                            }`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            <img
                              src={block.columns[1].content}
                              alt={block.columns[1].settings?.altText || ''}
                              style={{ maxWidth: '100%', border: '0' }}
                            />
                          </a>
                        ) : (
                          <img
                            src={block.columns[1].content}
                            alt={block.columns[1].settings?.altText || ''}
                            style={{ maxWidth: '100%', border: '0' }}
                          />
                        )}
                        {isActive && (
                          <div className='column-settings'>
                            <input
                              type='file'
                              accept='image/*'
                              className='settings-input'
                              onChange={(e) => handleImageUpload(e, null, 1)}
                              style={{ marginBottom: '8px' }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Image URL'
                              value={block.columns[1].content}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[1].content =
                                  e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Alt text'
                              value={block.columns[1].settings?.altText || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[1].settings.altText =
                                  e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link URL (optional)'
                              value={block.columns[1].settings?.linkUrl || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[1].settings.linkUrl =
                                  e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link Suffix (optional)'
                              value={
                                block.columns[1].settings?.linkSuffix ||
                                '?content_type=text&creative=creative&segment=no-segment'
                              }
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[
                                  index
                                ].columns[1].settings.linkSuffix =
                                  e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link Label (optional)'
                              value={block.columns[1].settings?.linkLabel || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[1].settings.linkLabel =
                                  e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                          </div>
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
    case 'halfText': {
      const imageContainerStyle = {
        width: settings.imageWidth,
        display: 'inline-block',
        verticalAlign: 'top',
      };

      const textContainerStyle = {
        width: `calc(100% - ${settings.imageWidth})`,
        display: 'inline-block',
        verticalAlign: 'top',
        padding: '0 20px',
      };

      const halfTextContentStyle = {
        color: settings.color,
        fontSize: settings.fontSize,
        textAlign: settings.textAlign,
        fontFamily: settings.fontFamily,
      };

      const tableStyle = {
        backgroundColor: settings.backgroundColor,
        padding: settings.padding,
        width: '100%',
      };

      const renderImage = () =>
        settings.imageLinkUrl ? (
          <a
            href={`${settings.imageLinkUrl}${
              settings?.imageLinkSuffix ||
              '?content_type=text&creative=creative&segment=no-segment'
            }`}
            target='_blank'
            rel='noopener noreferrer'>
            <img
              src={block.imageUrl}
              alt={settings.altText || ''}
              style={{ maxWidth: '100%', border: '0', display: 'block' }}
            />
          </a>
        ) : (
          <img
            src={block.imageUrl}
            alt={settings.altText || ''}
            style={{ maxWidth: '100%', border: '0', display: 'block' }}
          />
        );

      blockContent = (
        <table
          role='presentation'
          width='100%'
          cellSpacing='0'
          cellPadding='0'
          border='0'
          style={tableStyle}>
          <tbody>
            <tr>
              <td>
                <table
                  role='presentation'
                  width='100%'
                  cellSpacing='0'
                  cellPadding='0'
                  border='0'>
                  <tbody>
                    <tr>
                      <td
                        style={
                          settings.imagePosition === 'left'
                            ? imageContainerStyle
                            : textContainerStyle
                        }>
                        {settings.imagePosition === 'left' ? (
                          renderImage()
                        ) : (
                          <div>
                            <div
                              style={halfTextContentStyle}
                              contentEditable={isActive}
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleUpdateBlockContent(
                                  index,
                                  e.target.innerHTML
                                )
                              }
                              dangerouslySetInnerHTML={{ __html: content }}
                            />
                            {settings.showButton && (
                              <a
                                href={`${settings.buttonUrl}${
                                  settings?.buttonLinkSuffix ||
                                  '?content_type=text&creative=creative&segment=no-segment'
                                }`}
                                target='_blank'
                                rel='noopener noreferrer'
                                style={{
                                  display: 'inline-block',
                                  padding: '8px 16px',
                                  backgroundColor: settings.buttonColor,
                                  color: settings.buttonTextColor,
                                  textDecoration: 'none',
                                  borderRadius: '4px',
                                  marginTop: '16px',
                                }}>
                                {settings.buttonText}
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                      <td
                        style={
                          settings.imagePosition === 'left'
                            ? textContainerStyle
                            : imageContainerStyle
                        }>
                        {settings.imagePosition === 'left' ? (
                          <div>
                            <div
                              style={halfTextContentStyle}
                              contentEditable={isActive}
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleUpdateBlockContent(
                                  index,
                                  e.target.innerHTML
                                )
                              }
                              dangerouslySetInnerHTML={{ __html: content }}
                            />
                            {settings.showButton && (
                              <a
                                href={`${settings.buttonUrl}${
                                  settings?.buttonLinkSuffix ||
                                  '?content_type=text&creative=creative&segment=no-segment'
                                }`}
                                target='_blank'
                                rel='noopener noreferrer'
                                style={{
                                  display: 'inline-block',
                                  padding: '8px 16px',
                                  backgroundColor: settings.buttonColor,
                                  color: settings.buttonTextColor,
                                  textDecoration: 'none',
                                  borderRadius: '4px',
                                  marginTop: '16px',
                                }}>
                                {settings.buttonText}
                              </a>
                            )}
                          </div>
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
      blockContent = (
        <table
          role='presentation'
          width='100%'
          cellSpacing='0'
          cellPadding='0'
          border='0'>
          <tbody>
            <tr>
              <td
                style={{
                  height: '50px',
                  fontSize: '0',
                  backgroundColor: settings?.canvascolor,
                }}>
                &nbsp;
              </td>
            </tr>
            <tr>
              <td
                style={{ backgroundColor: settings?.canvascolor }}
                align='center'>
                <table
                  className='w100pc'
                  style={{ width: '100%', margin: '0', padding: '0' }}
                  cellPadding='0'
                  cellSpacing='0'>
                  <tbody>
                    <tr>
                      <td style={{ width: '120px' }}>&nbsp;</td>
                      <td
                        className='paddLR10px'
                        style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                        <a
                          title='Samsung Kazakhstan'
                          href={settings?.urls?.facebook}>
                          <img
                            border='0'
                            width='57'
                            src={getImagePath(socialIcons.facebook)}
                            alt='Facebook'
                          />
                        </a>
                      </td>
                      <td
                        className='paddLR10px'
                        style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                        <a
                          title='Samsung Kazakhstan'
                          href={settings?.urls?.instagram}>
                          <img
                            border='0'
                            width='57'
                            src={getImagePath(socialIcons.instagram)}
                            alt='Instagram'
                          />
                        </a>
                      </td>
                      <td
                        className='paddLR10px'
                        style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                        <a
                          title='Samsung Kazakhstan'
                          href={settings?.urls?.vkontakte}>
                          <img
                            border='0'
                            width='57'
                            src={getImagePath(socialIcons.vkontakte)}
                            alt='VK'
                          />
                        </a>
                      </td>
                      <td
                        className='paddLR10px'
                        style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                        <a
                          title='Samsung Kazakhstan'
                          href={settings?.urls?.youtube}>
                          <img
                            border='0'
                            width='57'
                            src={getImagePath(socialIcons.youtube)}
                            alt='Youtube'
                          />
                        </a>
                      </td>
                      <td
                        className='paddLR10px'
                        style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                        <a
                          title='Samsung Kazakhstan'
                          href={settings?.urls?.twitter}>
                          <img
                            border='0'
                            width='57'
                            src={getImagePath(socialIcons.twitter)}
                            alt='Twitter'
                          />
                        </a>
                      </td>
                      <td
                        className='paddLR10px'
                        style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                        <a
                          title='Samsung Kazakhstan'
                          href={settings?.urls?.linkedin}>
                          <img
                            border='0'
                            width='57'
                            src={getImagePath(socialIcons.linkedin)}
                            alt='LinkedIn'
                          />
                        </a>
                      </td>
                      <td style={{ width: '120px' }}>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td
                style={{ backgroundColor: settings?.canvascolor }}
                align='center'>
                <table
                  style={{
                    width: '500px',
                    margin: '0',
                    padding: '0',
                    textAlign: 'center',
                    color: settings?.disclaimercolor,
                  }}
                  cellPadding='0'
                  cellSpacing='0'
                  border='0'>
                  <tbody>
                    <tr>
                      <td style={{ height: '26px' }}>&nbsp;</td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          fontSize: '14px',
                          color: settings?.disclaimercolor,
                        }}>
                        Вы получили это письмо, потому что подписались
                        на&nbsp;рассылку Samsung. Не отвечайте на&nbsp;данное
                        письмо. Оно является автоматической рассылкой. Чтобы
                        отказаться от получения наших рассылок, пожалуйста,
                        перейдите по&nbsp;этой{' '}
                        <a
                          style={{
                            textDecoration: 'underline',
                            color: settings?.disclaimercolor,
                          }}
                          href={settings?.urls?.optout}
                          _type='optout'
                          _label={settings?.linklabel}>
                          ссылке
                        </a>
                        .<br />
                        <br />©{new Date().getFullYear()} Samsung Electronics
                        Co., Ltd. Все права защищены.
                        <br />
                        ТОО &laquo;SAMSUNG ELECTRONICS CENTRAL EURASIA&raquo;
                        <br />
                        (САМСУНГ ЭЛЕКТРОНИКС ЦЕНТРАЛЬНАЯ ЕВРАЗИЯ)
                        <br />
                        Республика Казахстан, г. Алматы, 050000, улица
                        Желтоксан, д. 115,
                        <br />
                        Торгово-офисный центр &laquo;Kaisar Plaza&raquo;, 3
                        этаж.
                      </td>
                    </tr>
                    <tr>
                      <td style={{ height: '24px' }} height='24'>
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          height: '24px',
                          color: settings?.disclaimercolor,
                          fontSize: '14px',
                        }}
                        height='24'>
                        <a
                          style={{
                            fontSize: '14px',
                            color: settings?.textcolor,
                            textDecoration: 'underline',
                          }}
                          href={settings?.urls?.legal}>
                          Правовая информация
                        </a>
                        &nbsp;|&nbsp;
                        <a
                          style={{
                            fontSize: '14px',
                            color: settings?.textcolor,
                            textDecoration: 'underline',
                          }}
                          href={settings?.urls?.privacy}>
                          Политика конфиденциальности
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ height: '115px' }} height='115'>
                        &nbsp;
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

        {!showPreview && isActive && !isNestedBlock && type !== 'footer' && (
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
                  <select
                    className='control-select'
                    value={settings?.fontSize}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'fontSize',
                        e.target.value
                      )
                    }>
                    <option value='8px'>8px</option>
                    <option value='16px'>16px</option>
                    <option value='24px'>24px</option>
                    <option value='32px'>32px</option>
                    <option value='40px'>40px</option>
                    <option value='48px'>48px</option>
                  </select>
                </>
              )}
              {type === 'buttonGroup' && (
                <div className='checkbox-container'>
                  <input
                    type='checkbox'
                    id={`inline-${block.id}`}
                    checked={settings?.inline}
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
              <select
                className='control-select flex-grow'
                value={settings?.padding}
                onChange={(e) =>
                  handleUpdateBlockSettings(index, 'padding', e.target.value)
                }>
                <option value='0px'>No padding</option>
                <option value='16px 0'>Small padding</option>
                <option value='24px 0'>Medium padding</option>
                <option value='40px 0'>Large padding</option>
              </select>
              {(type === 'header' ||
                type === 'text' ||
                type === 'image' ||
                type === 'halfText') && (
                <select
                  className='control-select'
                  value={settings?.textAlign}
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
              {type === 'halfText' && (
                <>
                  <select
                    className='control-select'
                    value={settings?.imagePosition}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'imagePosition',
                        e.target.value
                      )
                    }>
                    <option value='left'>Image Left</option>
                    <option value='right'>Image Right</option>
                  </select>
                  <select
                    className='control-select'
                    value={settings?.imageWidth}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'imageWidth',
                        e.target.value
                      )
                    }>
                    <option value='30%'>30% Width</option>
                    <option value='40%'>40% Width</option>
                    <option value='50%'>50% Width</option>
                  </select>
                  <div className='checkbox-container'>
                    <input
                      type='checkbox'
                      id={`showButton-${block.id}`}
                      checked={settings?.showButton}
                      onChange={(e) =>
                        handleUpdateBlockSettings(
                          index,
                          'showButton',
                          e.target.checked
                        )
                      }
                    />
                    <label htmlFor={`showButton-${block.id}`}>
                      Show Button
                    </label>
                  </div>
                </>
              )}
            </div>
            {type === 'halfText' && settings?.showButton && (
              <div className='control-flex margin-bottom-small'>
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Button Text'
                  value={settings?.buttonText}
                  onChange={(e) =>
                    handleUpdateBlockSettings(
                      index,
                      'buttonText',
                      e.target.value
                    )
                  }
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Button URL'
                  value={settings?.buttonUrl}
                  onChange={(e) =>
                    handleUpdateBlockSettings(
                      index,
                      'buttonUrl',
                      e.target.value
                    )
                  }
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Button Link Suffix (optional)'
                  value={
                    settings?.buttonLinkSuffix ||
                    '?content_type=text&creative=creative&segment=no-segment'
                  }
                  onChange={(e) =>
                    handleUpdateBlockSettings(
                      index,
                      'buttonLinkSuffix',
                      e.target.value
                    )
                  }
                />
                <input
                  type='color'
                  value={settings?.buttonColor}
                  onChange={(e) =>
                    handleUpdateBlockSettings(
                      index,
                      'buttonColor',
                      e.target.value
                    )
                  }
                  className='color-input'
                />
                <input
                  type='color'
                  value={settings?.buttonTextColor}
                  onChange={(e) =>
                    handleUpdateBlockSettings(
                      index,
                      'buttonTextColor',
                      e.target.value
                    )
                  }
                  className='color-input'
                />
              </div>
            )}
            {type === 'halfText' && (
              <div className='control-flex margin-bottom-small'>
                <input
                  type='file'
                  accept='image/*'
                  className='settings-input'
                  onChange={(e) => handleImageUpload(e, null, null, true)}
                  style={{ marginBottom: '8px' }}
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Image URL'
                  value={block.imageUrl}
                  onChange={(e) => {
                    const newBlocks = [...template.blocks];
                    newBlocks[index].imageUrl = e.target.value;
                    setTemplate({ ...template, blocks: newBlocks });
                  }}
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Alt text'
                  value={settings?.altText || ''}
                  onChange={(e) =>
                    handleUpdateBlockSettings(index, 'altText', e.target.value)
                  }
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Image Link URL (optional)'
                  value={settings?.imageLinkUrl || ''}
                  onChange={(e) =>
                    handleUpdateBlockSettings(
                      index,
                      'imageLinkUrl',
                      e.target.value
                    )
                  }
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Image Link Suffix (optional)'
                  value={
                    settings?.imageLinkSuffix ||
                    '?content_type=text&creative=creative&segment=no-segment'
                  }
                  onChange={(e) =>
                    handleUpdateBlockSettings(
                      index,
                      'imageLinkSuffix',
                      e.target.value
                    )
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockRenderer;
