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

  const handleImageUpload = (e, buttonIndex = null, columnIndex = null, isHalfText = false) => {
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

  const [vertical] = (settings?.padding || '10px').split(' ');
  const isSpacer = block.type === 'spacer';
  const isFooter =
    block.type === 'footer' ||
    block.type === 'footer_general_kz' ||
    block.type === 'footer_sendpulse';

  const blockStyle = {
    backgroundColor: settings?.backgroundColor || 'white',
    paddingTop: isSpacer || isFooter ? '0' : vertical,
    paddingBottom: isSpacer || isFooter ? '0' : vertical,
    paddingLeft: block.type === 'image' || isSpacer || isFooter ? '0' : '12%',
    paddingRight: block.type === 'image' || isSpacer || isFooter ? '0' : '12%',
    position: 'relative',
    cursor: 'pointer',
    border: isActive ? '2px solid #4299e1' : 'none',
    transition: 'all 0.2s ease',
    lineHeight: block.type === 'image' ? 0 : undefined,
  };

  const contentStyle = {
    color: settings?.color,
    fontSize: settings?.fontSize,
    textAlign: settings?.textAlign,
  };

  const imgBlockStyle = { maxWidth: '100%', border: 0, display: 'block' };
  const tdPadX16 = { padding: '0 16px' };

  const renderSocials = (urls = {}) => {
    const items = [
      { key: 'facebook', icon: socialIcons.facebook, alt: 'Facebook' },
      { key: 'instagram', icon: socialIcons.instagram, alt: 'Instagram' },
      { key: 'vkontakte', icon: socialIcons.vkontakte, alt: 'VK' },
      { key: 'youtube', icon: socialIcons.youtube, alt: 'YouTube' },
      { key: 'twitter', icon: socialIcons.twitter, alt: 'Twitter' },
      { key: 'linkedin', icon: socialIcons.linkedin, alt: 'LinkedIn' },
    ];
    return items.map(({ key, icon, alt }) => (
      <td key={key} style={tdPadX16}>
        <a title='Samsung Kazakhstan' href={urls?.[key]}>
          <img
            width='57'
            src={getImagePath(icon)}
            alt={alt}
            style={{ display: 'block', border: 0 }}
          />
        </a>
      </td>
    ));
  };

  let blockContent;

  switch (type) {
    case 'header':
      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td style={{ textAlign: settings?.textAlign || 'left' }}>
                <h1
                  style={contentStyle}
                  contentEditable={isActive}
                  suppressContentEditableWarning
                  onBlur={(e) => handleUpdateBlockContent(index, e.target.innerText)}
                >
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
                <div
                  style={contentStyle}
                  contentEditable={isActive}
                  suppressContentEditableWarning
                  onBlur={(e) => handleUpdateBlockContent(index, e.target.innerHTML)}
                  dangerouslySetInnerHTML={{ __html: content }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      // allow new paragraphs
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
        <table {...tableProps}>
          <tbody>
            <tr>
              <td style={{ textAlign: settings?.textAlign || 'left' }}>
                {settings?.linkUrl ? (
                  <a href={`${settings.linkUrl}`} target='_blank' rel='noopener noreferrer'>
                    <img src={content} alt={settings?.altText || ''} style={imgBlockStyle} />
                  </a>
                ) : (
                  <img src={content} alt={settings?.altText || ''} style={imgBlockStyle} />
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
                              onChange={(e) => handleUpdateBlockContent(index, e.target.value)}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Alt text'
                              value={settings?.altText || ''}
                              onChange={(e) => handleUpdateBlockSettings(index, 'altText', e.target.value)}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link URL (optional)'
                              value={settings?.linkUrl || ''}
                              onChange={(e) => handleUpdateBlockSettings(index, 'linkUrl', e.target.value)}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link Label (optional)'
                              value={settings?.linkLabel || ''}
                              onChange={(e) => handleUpdateBlockSettings(index, 'linkLabel', e.target.value)}
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
                <a href={`${settings?.linkUrl}`} target='_blank' rel='noopener noreferrer' style={{ display: 'inline-block' }}>
                  <img
                    src={settings?.imageUrl}
                    alt={settings?.imageAlt}
                    style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto', border: 0 }}
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
                        reader.onloadend = () => handleUpdateBlockSettings(index, 'imageUrl', reader.result);
                        reader.readAsDataURL(file);
                      }}
                      style={{ marginBottom: 8 }}
                    />
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='Image URL'
                      value={settings?.imageUrl || ''}
                      onChange={(e) => handleUpdateBlockSettings(index, 'imageUrl', e.target.value)}
                    />
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='Alt text'
                      value={settings?.imageAlt || ''}
                      onChange={(e) => handleUpdateBlockSettings(index, 'imageAlt', e.target.value)}
                    />
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='Link URL'
                      value={settings?.linkUrl || ''}
                      onChange={(e) => handleUpdateBlockSettings(index, 'linkUrl', e.target.value)}
                    />
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='Link Label (optional)'
                      value={settings?.linkLabel || ''}
                      onChange={(e) => handleUpdateBlockSettings(index, 'linkLabel', e.target.value)}
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
        flexDirection: settings?.inline ? 'row' : 'column',
        gap: settings?.gap,
        justifyContent: 'center',
      };

      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center' }}>
                <div style={buttonContainerStyle}>
                  {block.buttons?.map((button, buttonIndex) => (
                    <div key={buttonIndex}>
                      <a href={`${button.settings?.linkUrl}`} target='_blank' rel='noopener noreferrer' style={{ display: 'inline-block' }}>
                        <img
                          src={button.settings?.imageUrl}
                          alt={button.settings?.imageAlt}
                          style={{ display: 'block', margin: '0 auto', maxWidth: '100%', height: 'auto', border: 0 }}
                        />
                      </a>
                      {isActive && (
                        <div className='button-settings'>
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
                              newBlocks[index].buttons[buttonIndex].settings.imageUrl = e.target.value;
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
                              newBlocks[index].buttons[buttonIndex].settings.imageAlt = e.target.value;
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
                              newBlocks[index].buttons[buttonIndex].settings.linkUrl = e.target.value;
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
                              newBlocks[index].buttons[buttonIndex].settings.linkLabel = e.target.value;
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
        <table {...tableProps}>
          <tbody>
            <tr>
              <td>
                <table {...tableProps}>
                  <tbody>
                    <tr>
                      <td style={{ height: settings?.lineHeight || '1px', backgroundColor: settings?.lineColor || '#dddddd' }} />
                    </tr>
                  </tbody>
                </table>
                {isActive && (
                  <table {...tableProps} className='control-flex margin-top-small'>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type='color'
                            className='color-input'
                            value={settings?.lineColor || '#dddddd'}
                            onChange={(e) => handleUpdateBlockSettings(index, 'lineColor', e.target.value)}
                          />
                        </td>
                        <td>
                          <select
                            className='control-select flex-grow'
                            value={settings?.lineHeight || '1px'}
                            onChange={(e) => handleUpdateBlockSettings(index, 'lineHeight', e.target.value)}
                          >
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
        <table {...tableProps}>
          <tbody>
            <tr>
              <td>
                <table {...tableProps}>
                  <tbody>
                    <tr>
                      <td style={{ backgroundColor: settings?.backgroundColor || '#e5e5e5', height: settings?.height || '40px' }} />
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      );
      break;

    case 'columns':
      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td>
                <table {...tableProps} className='columns-container'>
                  <tbody>
                    <tr>
                      <td width='50%'>
                        {block.columns?.[0]?.settings?.linkUrl ? (
                          <a href={`${block.columns[0].settings.linkUrl}`} target='_blank' rel='noopener noreferrer'>
                            <img src={block.columns[0].content} alt={block.columns?.[0]?.settings?.altText || ''} style={imgBlockStyle} />
                          </a>
                        ) : (
                          <img src={block.columns?.[0]?.content} alt={block.columns?.[0]?.settings?.altText || ''} style={imgBlockStyle} />
                        )}
                        {isActive && (
                          <div className='column-settings'>
                            <input type='file' accept='image/*' className='settings-input' onChange={(e) => handleImageUpload(e, null, 0)} style={{ marginBottom: 8 }} />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Image URL'
                              value={block.columns?.[0]?.content || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[0].content = e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Alt text'
                              value={block.columns?.[0]?.settings?.altText || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[0].settings.altText = e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link URL (optional)'
                              value={block.columns?.[0]?.settings?.linkUrl || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[0].settings.linkUrl = e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link Label (optional)'
                              value={block.columns?.[0]?.settings?.linkLabel || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[0].settings.linkLabel = e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                          </div>
                        )}
                      </td>

                      <td width='50%'>
                        {block.columns?.[1]?.settings?.linkUrl ? (
                          <a href={`${block.columns[1].settings.linkUrl}`} target='_blank' rel='noopener noreferrer'>
                            <img src={block.columns[1].content} alt={block.columns?.[1]?.settings?.altText || ''} style={imgBlockStyle} />
                          </a>
                        ) : (
                          <img src={block.columns?.[1]?.content} alt={block.columns?.[1]?.settings?.altText || ''} style={imgBlockStyle} />
                        )}
                        {isActive && (
                          <div className='column-settings'>
                            <input type='file' accept='image/*' className='settings-input' onChange={(e) => handleImageUpload(e, null, 1)} style={{ marginBottom: 8 }} />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Image URL'
                              value={block.columns?.[1]?.content || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[1].content = e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Alt text'
                              value={block.columns?.[1]?.settings?.altText || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[1].settings.altText = e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link URL (optional)'
                              value={block.columns?.[1]?.settings?.linkUrl || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[1].settings.linkUrl = e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link Label (optional)'
                              value={block.columns?.[1]?.settings?.linkLabel || ''}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].columns[1].settings.linkLabel = e.target.value;
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
          <a href={`${settings.imageLinkUrl}`} target='_blank' rel='noopener noreferrer'>
            <img src={block.imageUrl} alt={settings?.altText || ''} style={imgBlockStyle} />
          </a>
        ) : (
          <img src={block.imageUrl} alt={settings?.altText || ''} style={imgBlockStyle} />
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
            }}
          >
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
                      <td style={settings?.imagePosition === 'left' ? imageContainerStyle : textContainerStyle}>
                        {settings?.imagePosition === 'left' ? renderImage() : <TextBlock />}
                      </td>
                      <td style={settings?.imagePosition === 'left' ? textContainerStyle : imageContainerStyle}>
                        {settings?.imagePosition === 'left' ? <TextBlock /> : renderImage()}
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

    /* ======= FOOTERS (clean inline CSS) ======= */

    case 'footer':
      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td style={{ height: 50, fontSize: 0, lineHeight: 0, backgroundColor: settings?.canvascolor || '#f5f5f5' }}>&nbsp;</td>
            </tr>

            <tr>
              <td align='center' style={{ backgroundColor: settings?.canvascolor || '#f5f5f5' }}>
                <table {...tableProps} style={{ margin: '0 auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: 120 }}>&nbsp;</td>
                      {renderSocials(settings?.urls)}
                      <td style={{ width: 120 }}>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td align='center' style={{ backgroundColor: settings?.canvascolor || '#f5f5f5', padding: '16px 10%' }}>
                <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: '0 0 13px', color: settings?.textcolor, lineHeight: 1 }}>
                  Есть вопросы?
                </h1>
                <table role='presentation' cellSpacing='0' cellPadding='7' border='0' style={{ margin: '0 auto', textAlign: 'center', color: settings?.textcolor }}>
                  <tbody>
                    <tr>
                      <td align='center' style={{ padding: 7 }}>
                        <a href={settings?.urls?.livechat} style={{ fontSize: 11, color: settings?.textcolor, textDecoration: 'none' }}>
                          <img
                            src={settings?.theme === 'night' ? getImagePath(socialIcons.livechat) + '-white' : getImagePath(socialIcons.livechat)}
                            alt='chat'
                            width='13'
                            style={{ verticalAlign: 'middle' }}
                          />
                          &nbsp;&nbsp;Онлайн чат
                        </a>
                      </td>
                      <td align='center' style={{ padding: 7 }}>
                        <a href={settings?.urls?.call} style={{ fontSize: 11, color: settings?.textcolor, textDecoration: 'none' }}>
                          <img
                            src={settings?.theme === 'night' ? getImagePath(socialIcons.call) + '-white' : getImagePath(socialIcons.call)}
                            alt='call'
                            width='13'
                            style={{ verticalAlign: 'middle' }}
                          />
                          &nbsp;&nbsp;Call Center 7700
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td align='center' style={{ backgroundColor: settings?.canvascolor || '#f5f5f5' }}>
                <table {...tableProps} style={{ width: 500, margin: '0 auto', textAlign: 'center', color: settings?.disclaimercolor }}>
                  <tbody>
                    <tr><td style={{ height: 26 }}>&nbsp;</td></tr>
                    <tr>
                      <td style={{ fontSize: 14, color: settings?.disclaimercolor }}>
                        Вы получили это письмо, потому что подписались на&nbsp;рассылку Samsung. Не отвечайте на&nbsp;данное письмо. Оно является автоматической рассылкой.
                        Чтобы отказаться от получения наших рассылок, пожалуйста, перейдите по&nbsp;этой{' '}
                        <a
                          style={{ textDecoration: 'underline', color: settings?.disclaimercolor }}
                          href={settings?.urls?.optout}
                          _type='optout'
                          _label={settings?.linklabel}
                        >
                          ссылке
                        </a>.
                        <br /><br />
                        ©{new Date().getFullYear()} Samsung Electronics Co., Ltd. Все права защищены.<br />
                        ТОО &laquo;SAMSUNG ELECTRONICS CENTRAL EURASIA&raquo;<br />
                        (САМСУНГ ЭЛЕКТРОНИКС ЦЕНТРАЛЬНАЯ ЕВРАЗИЯ)<br />
                        Республика Казахстан, г. Алматы, 050000, улица Желтоксан, д. 115,<br />
                        Торгово-офисный центр &laquo;Kaisar Plaza&raquo;, 3 этаж.
                      </td>
                    </tr>
                    <tr><td style={{ height: 24 }}>&nbsp;</td></tr>
                    <tr>
                      <td style={{ fontSize: 14, color: settings?.disclaimercolor }}>
                        <a style={{ fontSize: 14, color: settings?.textcolor, textDecoration: 'underline' }} href={settings?.urls?.legal}>Правовая информация</a>
                        &nbsp;|&nbsp;
                        <a style={{ fontSize: 14, color: settings?.textcolor, textDecoration: 'underline' }} href={settings?.urls?.privacy}>Политика конфиденциальности</a>
                      </td>
                    </tr>
                    <tr><td style={{ height: 115 }}>&nbsp;</td></tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      );
      break;

    case 'footer_general_kz':
      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td style={{ height: 50, fontSize: 0, lineHeight: 0, backgroundColor: settings?.canvascolor || '#f5f5f5' }}>&nbsp;</td>
            </tr>
            <tr>
              <td align='center' style={{ backgroundColor: settings?.canvascolor || '#f5f5f5' }}>
                <table {...tableProps} style={{ margin: '0 auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: 120 }}>&nbsp;</td>
                      {renderSocials(settings?.urls)}
                      <td style={{ width: 120 }}>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td align='center' style={{ backgroundColor: settings?.canvascolor || '#f5f5f5', padding: '16px 10%' }}>
                <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: '0 0 13px', color: settings?.textcolor, lineHeight: 1 }}>
                  Сұрақтарыңыз бар ма?
                </h1>
                <table role='presentation' cellSpacing='0' cellPadding='7' border='0' style={{ margin: '0 auto', textAlign: 'center', color: settings?.textcolor }}>
                  <tbody>
                    <tr>
                      <td align='center' style={{ padding: 7 }}>
                        <a href={settings?.urls?.livechat} style={{ fontSize: 11, color: settings?.textcolor, textDecoration: 'none' }}>
                          <img
                            src={settings?.theme === 'night' ? getImagePath(socialIcons.livechat) + '-white' : getImagePath(socialIcons.livechat)}
                            alt='chat'
                            width='13'
                            style={{ verticalAlign: 'middle' }}
                          />
                          &nbsp;&nbsp;Онлайн чат
                        </a>
                      </td>
                      <td align='center' style={{ padding: 7 }}>
                        <a href={settings?.urls?.call} style={{ fontSize: 11, color: settings?.textcolor, textDecoration: 'none' }}>
                          <img
                            src={settings?.theme === 'night' ? getImagePath(socialIcons.call) + '-white' : getImagePath(socialIcons.call)}
                            alt='call'
                            width='13'
                            style={{ verticalAlign: 'middle' }}
                          />
                          &nbsp;&nbsp;Call Center 7700
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td align='center' style={{ backgroundColor: settings?.canvascolor || '#f5f5f5' }}>
                <table {...tableProps} style={{ width: 500, margin: '0 auto', textAlign: 'center', color: settings?.disclaimercolor }}>
                  <tbody>
                    <tr><td style={{ height: 26 }}>&nbsp;</td></tr>
                    <tr>
                      <td style={{ fontSize: 14, color: settings?.disclaimercolor }}>
                        Сіз Samsung хабарламаларының таратылымына жазылғандықтан осы хатты алдыңыз. Осы хатқа жауап қайтармаңыз. Бұл автоматты түрде жолданатын хабарлама.
                        Біздің хабарламаларымызды алудан бас тарту үшін, осы{' '}
                        <a style={{ textDecoration: 'underline', color: settings?.disclaimercolor }} href={settings?.urls?.optout} _type='optout' _label={settings?.linklabel}>
                          сілтеме
                        </a>{' '}
                        арқылы өтуіңізді сұраймыз.
                        <br /><br />©{new Date().getFullYear()} Samsung Electronics Co., Ltd. Барлық құқықтар қорғалған.
                        <br />&laquo;SAMSUNG ELECTRONICS CENTRAL EURASIA&raquo; ЖШС
                        <br />(САМСУНГ ЭЛЕКТРОНИКС ОРТАЛЫҚ ЕУРАЗИЯ)
                        <br />Қазақстан Республикасы, Алматы қ., 050000, Желтоқсан көшесі, 115 үй,
                        <br />&laquo;Kaisar Plaza&raquo; сауда-кеңсе орталығы, 3-қабат.
                      </td>
                    </tr>
                    <tr><td style={{ height: 24 }}>&nbsp;</td></tr>
                    <tr>
                      <td style={{ fontSize: 14, color: settings?.disclaimercolor }}>
                        <a style={{ fontSize: 14, color: settings?.textcolor, textDecoration: 'underline' }} href={settings?.urls?.legal}>Құқықтық ақпарат</a>
                        &nbsp;|&nbsp;
                        <a style={{ fontSize: 14, color: settings?.textcolor, textDecoration: 'underline' }} href={settings?.urls?.privacy}>Құпиялылық саясаты</a>
                      </td>
                    </tr>
                    <tr><td style={{ height: 115 }}>&nbsp;</td></tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      );
      break;

    case 'footer_sendpulse':
      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td style={{ height: 50, fontSize: 0, lineHeight: 0, backgroundColor: settings?.canvascolor || '#f5f5f5' }}>&nbsp;</td>
            </tr>
            <tr>
              <td align='center' style={{ backgroundColor: settings?.canvascolor || '#f5f5f5' }}>
                <table {...tableProps} style={{ margin: '0 auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: 120 }}>&nbsp;</td>
                      {renderSocials(settings?.urls)}
                      <td style={{ width: 120 }}>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td align='center' style={{ backgroundColor: settings?.canvascolor || '#f5f5f5', padding: '16px 10%' }}>
                <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: '0 0 13px', color: settings?.textcolor, lineHeight: 1 }}>
                  Есть вопросы?
                </h1>
                <table role='presentation' cellSpacing='0' cellPadding='7' border='0' style={{ margin: '0 auto', textAlign: 'center', color: settings?.textcolor }}>
                  <tbody>
                    <tr>
                      <td align='center' style={{ padding: 7 }}>
                        <a href={settings?.urls?.livechat} style={{ fontSize: 11, color: settings?.textcolor, textDecoration: 'none' }}>
                          <img
                            src={settings?.theme === 'night' ? getImagePath(socialIcons.livechat) + '-white' : getImagePath(socialIcons.livechat)}
                            alt='chat'
                            width='13'
                            style={{ verticalAlign: 'middle' }}
                          />
                          &nbsp;&nbsp;Онлайн чат
                        </a>
                      </td>
                      <td align='center' style={{ padding: 7 }}>
                        <a href={settings?.urls?.call} style={{ fontSize: 11, color: settings?.textcolor, textDecoration: 'none' }}>
                          <img
                            src={settings?.theme === 'night' ? getImagePath(socialIcons.call) + '-white' : getImagePath(socialIcons.call)}
                            alt='call'
                            width='13'
                            style={{ verticalAlign: 'middle' }}
                          />
                          &nbsp;&nbsp;Call Center 7700
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td align='center' style={{ backgroundColor: settings?.canvascolor || '#f5f5f5' }}>
                <table {...tableProps} style={{ width: 500, margin: '0 auto', textAlign: 'center', color: settings?.disclaimercolor }}>
                  <tbody>
                    <tr>
                      <td style={{ fontSize: 14, color: settings?.disclaimercolor }}>
                        <br />©{new Date().getFullYear()} Samsung Electronics Co., Ltd. Все права защищены.<br />
                        ТОО &laquo;SAMSUNG ELECTRONICS CENTRAL EURASIA&raquo;<br />
                        (САМСУНГ ЭЛЕКТРОНИКС ЦЕНТРАЛЬНАЯ ЕВРАЗИЯ)<br />
                        Республика Казахстан, г. Алматы, 050000, улица Желтоксан, д. 115,<br />
                        Торгово-офисный центр &laquo;Kaisar Plaza&raquo;, 3 этаж.
                      </td>
                    </tr>
                    <tr><td style={{ height: 24 }}>&nbsp;</td></tr>
                    <tr>
                      <td style={{ fontSize: 14, color: settings?.disclaimercolor }}>
                        <a style={{ fontSize: 14, color: settings?.textcolor, textDecoration: 'underline' }} href={settings?.urls?.legal}>Правовая информация</a>
                        &nbsp;|&nbsp;
                        <a style={{ fontSize: 14, color: settings?.textcolor, textDecoration: 'underline' }} href={settings?.urls?.privacy}>Политика конфиденциальности</a>
                      </td>
                    </tr>
                    <tr><td style={{ height: 115 }}>&nbsp;</td></tr>
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
      className={`block-container ${dragOverIndex === index ? 'drag-over' : ''}`}
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
      onClick={() => !isNestedBlock && setActiveBlockId(block.id)}
    >
      <div style={blockStyle}>
        {!showPreview && !isNestedBlock && (
          <div
            className='block-type-indicator'
            style={{ color: type === 'header' || type === 'text' ? settings?.color : undefined }}
          >
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
              }}
            >
              <Copy size={14} className='action-icon' />
            </button>
            <button
              className='action-button'
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBlock(index);
              }}
            >
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
                onChange={(e) => handleUpdateBlockSettings(index, 'backgroundColor', e.target.value)}
                className='color-input'
              />

              {type === 'spacer' && (
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Height (e.g. 40px)'
                  value={settings?.height || ''}
                  onChange={(e) => handleUpdateBlockSettings(index, 'height', e.target.value)}
                  style={{ width: 80 }}
                />
              )}

              {(type === 'header' || type === 'text' || type === 'halfText') && (
                <>
                  <input
                    type='color'
                    value={settings?.color || '#000000'}
                    onChange={(e) => handleUpdateBlockSettings(index, 'color', e.target.value)}
                    className='color-input'
                  />
                  <input
                    type='text'
                    className='control-select'
                    value={settings?.fontSize || ''}
                    onChange={(e) => handleUpdateBlockSettings(index, 'fontSize', e.target.value)}
                  />
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
                  <label htmlFor={`inline-${block.id}`}>Display buttons inline</label>
                </div>
              )}

              {type !== 'spacer' && (
                <select
                  className='control-select flex-grow'
                  value={settings?.padding || '10px'}
                  onChange={(e) => handleUpdateBlockSettings(index, 'padding', e.target.value)}
                >
                  <option value='0px'>No padding</option>
                  <option value='16px 0'>Small padding</option>
                  <option value='24px 0'>Medium padding</option>
                  <option value='40px 0'>Large padding</option>
                </select>
              )}

              {(type === 'header' || type === 'text' || type === 'image' || type === 'halfText') && (
                <select
                  className='control-select'
                  value={settings?.textAlign || 'left'}
                  onChange={(e) => handleUpdateBlockSettings(index, 'textAlign', e.target.value)}
                >
                  <option value='left'>Left</option>
                  <option value='center'>Center</option>
                  <option value='right'>Right</option>
                </select>
              )}

              {type === 'halfText' && (
                <>
                  <select
                    className='control-select'
                    value={settings?.imagePosition || 'left'}
                    onChange={(e) => handleUpdateBlockSettings(index, 'imagePosition', e.target.value)}
                  >
                    <option value='left'>Image Left</option>
                    <option value='right'>Image Right</option>
                  </select>
                  <select
                    className='control-select'
                    value={settings?.imageWidth || '40%'}
                    onChange={(e) => handleUpdateBlockSettings(index, 'imageWidth', e.target.value)}
                  >
                    <option value='30%'>30% Width</option>
                    <option value='40%'>40% Width</option>
                    <option value='50%'>50% Width</option>
                  </select>
                  <div className='checkbox-container'>
                    <input
                      type='checkbox'
                      id={`showButton-${block.id}`}
                      checked={!!settings?.showButton}
                      onChange={(e) => handleUpdateBlockSettings(index, 'showButton', e.target.checked)}
                    />
                    <label htmlFor={`showButton-${block.id}`}>Show Button</label>
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
                  value={settings?.buttonText || ''}
                  onChange={(e) => handleUpdateBlockSettings(index, 'buttonText', e.target.value)}
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Button URL'
                  value={settings?.buttonUrl || ''}
                  onChange={(e) => handleUpdateBlockSettings(index, 'buttonUrl', e.target.value)}
                />
                <input
                  type='color'
                  value={settings?.buttonColor || '#000000'}
                  onChange={(e) => handleUpdateBlockSettings(index, 'buttonColor', e.target.value)}
                  className='color-input'
                />
                <input
                  type='color'
                  value={settings?.buttonTextColor || '#ffffff'}
                  onChange={(e) => handleUpdateBlockSettings(index, 'buttonTextColor', e.target.value)}
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
                  style={{ marginBottom: 8 }}
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Image URL'
                  value={block.imageUrl || ''}
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
                  onChange={(e) => handleUpdateBlockSettings(index, 'altText', e.target.value)}
                />
                <input
                  type='text'
                  className='settings-input'
                  placeholder='Image Link URL (optional)'
                  value={settings?.imageLinkUrl || ''}
                  onChange={(e) => handleUpdateBlockSettings(index, 'imageLinkUrl', e.target.value)}
                />
              </div>
            )}

            {(type === 'footer' || type === 'footer_general_kz' || type === 'footer_sendpulse') && (
              <div className='control-flex margin-bottom-small'>
                <input
                  type='color'
                  value={settings?.canvascolor || '#f5f5f5'}
                  onChange={(e) => handleUpdateBlockSettings(index, 'canvascolor', e.target.value)}
                  className='color-input'
                />
                <input
                  type='color'
                  value={settings?.textcolor || '#000000'}
                  onChange={(e) => handleUpdateBlockSettings(index, 'textcolor', e.target.value)}
                  className='color-input'
                />
                <input
                  type='color'
                  value={settings?.disclaimercolor || '#555555'}
                  onChange={(e) => handleUpdateBlockSettings(index, 'disclaimercolor', e.target.value)}
                  className='color-input'
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
