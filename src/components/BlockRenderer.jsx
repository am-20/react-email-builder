// BlockRenderer.jsx
import React, { useState } from 'react';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { getImagePath, socialIcons } from '../utils/imageUtils';
import { addFileAsset } from '../utils/assets';
import RoundContainer from './RoundContainer';
import { createNewBlock } from '../handlers/EmailBuilderHandlers';

const tableProps = {
  role: 'presentation',
  width: '100%',
  cellSpacing: '0',
  cellPadding: '0',
  border: '0',
};

const LANGUAGE_STRINGS = {
  ru: {
    questions: 'Есть вопросы?',
    disclaimer:
      'Вы получили это письмо, потому что подписались на рассылку Samsung. Не отвечайте на данное письмо. Оно является автоматической рассылкой. Чтобы отказаться от получения наших рассылок, пожалуйста, перейдите по этой ',
    link: 'ссылке',
    disclaimer_end: '',
    all_rights: ' Все права защищены.',
    address:
      'ТОО «SAMSUNG ELECTRONICS CENTRAL EURASIA» (САМСУНГ ЭЛЕКТРОНИКС ЦЕНТРАЛЬНАЯ ЕВРАЗИЯ) Республика Казахстан, г. Алматы, 050000, улица Желтоксан, д. 115, Торгово-офисный центр «Kaisar Plaza», 3 этаж.',
    legal: 'Правовая информация',
    privacy: 'Политика конфиденциальности',
  },
  kz: {
    questions: 'Сұрақтарыңыз бар ма?',
    disclaimer:
      'Сіз Samsung хабарламаларының таратылымына жазылғандықтан осы хатты алдыңыз. Осы хатқа жауап қайтармаңыз. Бұл автоматты түрде жолданатын хабарлама. Біздің хабарламаларымызды алудан бас тарту үшін, осы ',
    link: 'сілтеме',
    disclaimer_end: ' арқылы өтуіңізді сұраймыз',
    all_rights: ' Барлық құқықтар қорғалған.',
    address:
      'ТОО «SAMSUNG ELECTRONICS CENTRAL EURASIA» ЖШС (САМСУНГ ЭЛЕКТРОНИКС ОРТАЛЫҚ ЕУРАЗИЯ) Қазақстан Республикасы, Алматы қ., 050000, Желтоқсан көшесі, 115 үй, «Kaisar Plaza» сауда-кеңсе орталығы, 3-қабат.',
    legal: 'Құқықтық ақпарат',
    privacy: 'Құпиялылық саясаты',
  },
};

const socials = [
  ['facebook', 'Facebook'],
  ['instagram', 'Instagram'],
  ['vkontakte', 'VK'],
  ['youtube', 'YouTube'],
  ['twitter', 'Twitter'],
  ['linkedin', 'LinkedIn'],
];

const IMG_BLOCK_STYLE = {
  maxWidth: '100%',
  border: 0,
  display: 'block',
  margin: '0 auto',
};

const FooterPreview = React.memo(function FooterPreview({ type, settings }) {
  const canvas = settings?.canvascolor || '#f5f5f5';
  const text = settings?.textcolor || '#000000';
  const disclaimer = settings?.disclaimercolor || '#555555';
  const urls = settings?.urls || {};
  const lang = type === 'footer_general_kz' ? 'kz' : 'ru';
  const dict = LANGUAGE_STRINGS[lang];

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
                  {socials.map(([key, alt]) => (
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
              {dict.questions}
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
                        fontFamily: settings?.fontFamily || 'Arial, sans-serif',
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
                        fontFamily: settings?.fontFamily || 'Arial, sans-serif',
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
                      <>
                        <p>
                          {dict.disclaimer}
                          {urls?.optout ? (
                            <a
                              href={urls.optout}
                              style={{
                                textDecoration: 'underline',
                                color: disclaimer,
                              }}>
                              {dict.link}
                            </a>
                          ) : (
                            dict.link
                          )}
                          {dict.disclaimer_end}.
                        </p>
                        <br />
                      </>
                    ) : null}
                    ©{new Date().getFullYear()} Samsung Electronics Co., Ltd.{' '}
                    {dict.all_rights}
                    <br />
                    {dict.address}
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
                      {dict.legal}
                    </a>
                    &nbsp;|&nbsp;
                    <a
                      href={urls?.privacy || '#'}
                      style={{
                        fontSize: 14,
                        color: settings?.textcolor || '#000',
                        textDecoration: 'underline',
                      }}>
                      {dict.privacy}
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
});

export { FooterPreview };

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
  activeBlockId,
  hoveredBlockId,
}) => {
  const { type, content } = block;
  const [manualUrlValue, setManualUrlValue] = useState(
    settings?.imagePath || ''
  );
  const shouldShowToolbar = isHovered || isActive;

  // Padding (separate)
  const topPad = settings?.paddingTop ?? settings?.padding ?? '0';
  const bottomPad = settings?.paddingBottom ?? settings?.padding ?? '0';

  const isSpacer = type === 'spacer';
  const isFooter =
    type === 'footer' ||
    type === 'footer_general_kz' ||
    type === 'footer_sendpulse';
  const isRound = type === 'roundContainer';

  const blockStyle = {
    backgroundColor: settings?.backgroundColor || 'white',
    paddingTop: isSpacer || isFooter || isRound ? '0' : topPad,
    paddingBottom: isSpacer || isFooter || isRound ? '0' : bottomPad,
    paddingLeft:
      type === 'image' || isSpacer || isFooter || isRound ? '0' : '12%',
    paddingRight:
      type === 'image' || isSpacer || isFooter || isRound ? '0' : '12%',
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

  let blockContent;
  const [btnManual, setBtnManual] = useState(settings?.imagePath || '');

  const handleAddChild = (parentIndex, type, insertAt) => {
    setTemplate((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const child = createNewBlock(type, next) || createNewBlock(type);

      if (!Array.isArray(next.blocks[parentIndex].children)) {
        next.blocks[parentIndex].children = [];
      }
      const arr = next.blocks[parentIndex].children;

      if (
        Number.isInteger(insertAt) &&
        insertAt >= 0 &&
        insertAt <= arr.length
      ) {
        arr.splice(insertAt, 0, child);
      } else {
        arr.push(child);
      }

      return next;
    });
  };

  const handleImageUpload = (
    e,
    buttonIndex = null,
    columnIndex = null,
    isHalfText = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const asset = addFileAsset(file); // { path: "i/1.png", previewUrl: "blob:..." }

    setTemplate((prev) => {
      const newBlocks = [...prev.blocks];

      if (buttonIndex !== null) {
        const btn = newBlocks[index].buttons[buttonIndex];
        btn.settings = {
          ...(btn.settings || {}),
          imagePath: asset.path,
          imagePreviewUrl: asset.previewUrl,
        };
      } else if (columnIndex !== null) {
        const col = newBlocks[index].columns[columnIndex] || {};
        col.imagePath = asset.path;
        col.imagePreviewUrl = asset.previewUrl;
        // legacy fallback
        col.content = asset.previewUrl;
        newBlocks[index].columns[columnIndex] = col;
      } else if (isHalfText) {
        const blk = newBlocks[index];
        blk.imagePath = asset.path;
        blk.imagePreviewUrl = asset.previewUrl;
        if ('imageUrl' in blk) delete blk.imageUrl;
      } else {
        const blk = newBlocks[index];
        blk.settings = {
          ...(blk.settings || {}),
          imagePath: asset.path,
          imagePreviewUrl: asset.previewUrl,
        };
        if (typeof blk.content !== 'undefined') blk.content = asset.previewUrl;
      }

      return { ...prev, blocks: newBlocks };
    });

    setManualUrlValue(asset.path);
  };

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

    case 'image': {
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

      const ImageEl =
        srcForEditor &&
        (settings?.linkUrl ? (
          <a
            href={`${settings.linkUrl}`}
            target='_blank'
            rel='noopener noreferrer'>
            <img
              src={srcForEditor}
              alt={settings?.altText || ''}
              style={IMG_BLOCK_STYLE}
            />
          </a>
        ) : (
          <img
            src={srcForEditor}
            alt={settings?.altText || ''}
            style={IMG_BLOCK_STYLE}
          />
        ));

      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td style={{ textAlign: settings?.textAlign || 'left' }}>
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
    }

    case 'button': {
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

        setBtnManual(asset.path);
      };

      const manualBtn = (e) => {
        const url = e.target.value;
        setBtnManual(url);
        handleUpdateBlockSettings(index, 'imagePath', url);
        handleUpdateBlockSettings(index, 'imagePreviewUrl', url);
      };

      blockContent = (
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
                      value={btnManual}
                      onChange={manualBtn}
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
    }

    case 'buttonCoded': {
      const buttonStyles = {
        textDecoration: 'none',
        letterSpacing: 0,
        display: 'inline',
        borderRadius: settings?.borderRadius,
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
                  <p style={buttonStyles}>{settings?.content || 'Click Me'}</p>
                </a>
                {isActive && (
                  <div className='button-settings'>
                    <input
                      type='text'
                      className='settings-input'
                      placeholder='Click Me'
                      value={settings?.content || ''}
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
                              onChange={(e) =>
                                handleImageUpload(e, buttonIndex)
                              }
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
                                const btn =
                                  newBlocks[index].buttons[buttonIndex];
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
      break;
    }

    case 'buttonCodedGroup': {
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

      blockContent = (
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
                                updateBtn(
                                  buttonIndex,
                                  'content',
                                  e.target.value
                                )
                              }
                            />

                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link URL'
                              value={s.linkUrl || ''}
                              onChange={(e) =>
                                updateBtn(
                                  buttonIndex,
                                  'linkUrl',
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type='text'
                              className='settings-input'
                              placeholder='Link label'
                              value={s.linkLabel || ''}
                              onChange={(e) =>
                                updateBtn(
                                  buttonIndex,
                                  'linkLabel',
                                  e.target.value
                                )
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
                                <span
                                  style={{ fontSize: 12, color: '#6b7280' }}>
                                  Bg
                                </span>
                                <input
                                  type='color'
                                  value={s.buttonBgColor ?? '#000000'}
                                  onChange={(e) =>
                                    updateBtn(
                                      buttonIndex,
                                      'buttonBgColor',
                                      e.target.value
                                    )
                                  }
                                  className='color-input'
                                />
                              </div>

                              <div
                                className='control-flex'
                                style={{ alignItems: 'center', gap: 6 }}>
                                <span
                                  style={{ fontSize: 12, color: '#6b7280' }}>
                                  Text
                                </span>
                                <input
                                  type='color'
                                  value={s.color ?? '#ffffff'}
                                  onChange={(e) =>
                                    updateBtn(
                                      buttonIndex,
                                      'color',
                                      e.target.value
                                    )
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
                                  updateBtn(
                                    buttonIndex,
                                    'padding',
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type='number'
                                className='settings-input'
                                placeholder='Font size (px)'
                                value={
                                  s.fontSize ? parseInt(s.fontSize, 10) : ''
                                }
                                onChange={(e) =>
                                  updateBtn(
                                    buttonIndex,
                                    'fontSize',
                                    e.target.value ? `${e.target.value}px` : ''
                                  )
                                }
                              />

                              <input
                                type='text'
                                className='settings-input'
                                placeholder='Border (e.g. 1px solid #000)'
                                value={s.border ?? '1px solid #000000'}
                                onChange={(e) =>
                                  updateBtn(
                                    buttonIndex,
                                    'border',
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type='number'
                                className='settings-input'
                                placeholder='Border radius (px)'
                                value={
                                  s.borderRadius
                                    ? parseInt(s.borderRadius, 10)
                                    : ''
                                }
                                onChange={(e) =>
                                  updateBtn(
                                    buttonIndex,
                                    'borderRadius',
                                    e.target.value ? `${e.target.value}px` : ''
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

      blockContent = (
        <table {...tableProps}>
          <tbody>
            <tr>
              <td>
                <table {...tableProps} className='columns-container'>
                  <tbody>
                    <tr>
                      {cols.map((c, colIndex) => {
                        const colSrc =
                          c?.imagePreviewUrl ||
                          c?.imagePath ||
                          c?.content ||
                          '';
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
                                    updateCol(
                                      colIndex,
                                      'imagePath',
                                      url,
                                      false
                                    );
                                    updateCol(
                                      colIndex,
                                      'imagePreviewUrl',
                                      url,
                                      false
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
                                      true
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
                                      true
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
                                      true
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
      break;
    }

    case 'columnsContent': {
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

      blockContent = (
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
                                fontWeight: settings?.isBold
                                  ? 'bold'
                                  : 'normal',
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
                                    updateCol(
                                      colIndex,
                                      'imagePath',
                                      url,
                                      false
                                    );
                                    updateCol(
                                      colIndex,
                                      'imagePreviewUrl',
                                      url,
                                      false
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
                                      true
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
                                      true
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
                                      true
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
                                      e.target.value
                                        ? `${e.target.value}px`
                                        : '',
                                      true
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
                                      e.target.value
                                        ? `${e.target.value}px`
                                        : '',
                                      true
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

      const handleManualUrlHalf = (e) => {
        const url = e.target.value;
        setManualUrlValue(url);
        setTemplate((prev) => {
          const newBlocks = [...prev.blocks];
          const blk = { ...(newBlocks[index] || {}) };
          blk.imagePath = url;
          blk.imagePreviewUrl = url;
          if ('imageUrl' in blk) delete blk.imageUrl;
          newBlocks[index] = blk;
          return { ...prev, blocks: newBlocks };
        });
      };

      const srcForHalfText =
        block.imagePreviewUrl ||
        block.imagePath ||
        settings?.imagePath ||
        settings?.imagePreviewUrl ||
        settings?.imageUrl ||
        'https://placehold.co/320x100';

      const ImageEl = settings?.imageLinkUrl ? (
        <a
          href={settings.imageLinkUrl}
          target='_blank'
          rel='noopener noreferrer'>
          <img
            src={srcForHalfText}
            alt={settings?.altText || ''}
            style={IMG_BLOCK_STYLE}
          />
        </a>
      ) : (
        <img
          src={srcForHalfText}
          alt={settings?.altText || ''}
          style={IMG_BLOCK_STYLE}
        />
      );

      const Button = settings?.showButton ? (
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

      const TextBlock = (
        <div>
          <div
            style={halfTextContentStyle}
            contentEditable={isActive}
            suppressContentEditableWarning
            onBlur={(e) => handleUpdateBlockContent(index, e.target.innerHTML)}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {Button}
        </div>
      );

      const imageLeft = settings?.imagePosition === 'left';

      blockContent = (
        <>
          <table {...tableProps}>
            <tbody>
              <tr>
                <td
                  style={imageLeft ? imageContainerStyle : textContainerStyle}>
                  {imageLeft ? ImageEl : TextBlock}
                </td>
                <td
                  style={imageLeft ? textContainerStyle : imageContainerStyle}>
                  {imageLeft ? TextBlock : ImageEl}
                </td>
              </tr>
            </tbody>
          </table>

          {isActive && (
            <div className='image-settings' style={{ marginTop: 12 }}>
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
                placeholder='Image path or URL (used in export)'
                value={manualUrlValue}
                onChange={handleManualUrlHalf}
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
                placeholder='Link URL (optional)'
                value={settings?.imageLinkUrl || ''}
                onChange={(e) =>
                  handleUpdateBlockSettings(
                    index,
                    'imageLinkUrl',
                    e.target.value
                  )
                }
              />

              <div className='control-flex' style={{ gap: 8 }}>
                <select
                  className='control-select'
                  value={settings?.imagePosition || 'left'}
                  onChange={(e) =>
                    handleUpdateBlockSettings(
                      index,
                      'imagePosition',
                      e.target.value
                    )
                  }>
                  <option value='left'>Image left</option>
                  <option value='right'>Image right</option>
                </select>

                <input
                  type='number'
                  className='control-select'
                  placeholder='Image width (%)'
                  value={
                    settings?.imageWidth
                      ? parseInt(settings.imageWidth, 10)
                      : ''
                  }
                  onChange={(e) =>
                    handleUpdateBlockSettings(
                      index,
                      'imageWidth',
                      e.target.value ? `${e.target.value}%` : ''
                    )
                  }
                />
              </div>
            </div>
          )}
        </>
      );

      break;
    }

    case 'roundContainer': {
      const handleUpdateNestedContent = (childIndex, content) => {
        setTemplate((prev) => {
          const next = JSON.parse(JSON.stringify(prev));
          if (
            Array.isArray(next.blocks[index].children) &&
            next.blocks[index].children[childIndex]
          ) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const removeInlineStyles = (el) => {
              if (el.style) el.removeAttribute('style');
              Array.from(el.children).forEach(removeInlineStyles);
            };
            removeInlineStyles(tempDiv);
            const sanitizedContent = tempDiv.innerHTML;
            next.blocks[index].children[childIndex] = {
              ...next.blocks[index].children[childIndex],
              content: sanitizedContent,
            };
          }
          return next;
        });
      };

      const handleUpdateNestedSettings = (childIndex, setting, value) => {
        setTemplate((prev) => {
          const next = JSON.parse(JSON.stringify(prev));
          if (
            Array.isArray(next.blocks[index].children) &&
            next.blocks[index].children[childIndex]
          ) {
            next.blocks[index].children[childIndex] = {
              ...next.blocks[index].children[childIndex],
              settings: {
                ...(next.blocks[index].children[childIndex].settings || {}),
                [setting]: value,
              },
            };
          }
          return next;
        });
      };

      const handleDeleteNestedBlock = (childIndex) => {
        setTemplate((prev) => {
          const next = JSON.parse(JSON.stringify(prev));
          if (Array.isArray(next.blocks[index].children)) {
            next.blocks[index].children = next.blocks[index].children.filter(
              (_, i) => i !== childIndex
            );
          }
          return next;
        });
        setActiveBlockId(null);
      };

      const handleDuplicateNestedBlock = (childIndex) => {
        setTemplate((prev) => {
          const next = JSON.parse(JSON.stringify(prev));
          if (
            Array.isArray(next.blocks[index].children) &&
            next.blocks[index].children[childIndex]
          ) {
            const childToDuplicate = JSON.parse(
              JSON.stringify(next.blocks[index].children[childIndex])
            );
            childToDuplicate.id = `${childToDuplicate.type}-${Date.now()}`;
            next.blocks[index].children.splice(
              childIndex + 1,
              0,
              childToDuplicate
            );
          }
          return next;
        });
      };

      blockContent = (
        <RoundContainer
          key={index}
          index={index}
          block={block}
          settings={block.settings}
          renderChild={(child, childIndex) => (
            <BlockRenderer
              key={`${block.id}-${childIndex}`}
              block={child}
              index={childIndex}
              isActive={activeBlockId === child.id}
              isHovered={hoveredBlockId === child.id}
              isNestedBlock={true}
              showPreview={showPreview}
              dragOverIndex={dragOverIndex}
              settings={child.settings}
              template={template}
              setTemplate={setTemplate}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              setActiveBlockId={setActiveBlockId}
              setHoveredBlockId={setHoveredBlockId}
              setDragOverIndex={setDragOverIndex}
              handleDuplicateBlock={handleDuplicateNestedBlock}
              handleDeleteBlock={handleDeleteNestedBlock}
              handleUpdateBlockContent={handleUpdateNestedContent}
              handleUpdateBlockSettings={handleUpdateNestedSettings}
              activeBlockId={activeBlockId}
              hoveredBlockId={hoveredBlockId}
            />
          )}
          handleUpdateBlockSettings={handleUpdateBlockSettings}
          onAddChild={handleAddChild}
        />
      );
      break;
    }

    case 'footer':
    case 'footer_general_kz':
    case 'footer_sendpulse':
      blockContent = <FooterPreview type={type} settings={settings} />;
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
        if (isNestedBlock) {
          let element = e.currentTarget;
          while (element && element.parentElement) {
            element = element.parentElement;
            if (
              element.hasAttribute &&
              element.hasAttribute('data-round-container-content')
            ) {
              const dragData = e.dataTransfer?.types || [];
              const isNewComponent =
                dragData.includes('text/block-type') ||
                dragData.includes('application/x-block-type') ||
                dragData.includes('text/plain');
              if (isNewComponent) return;
            }
          }
        }
        if (type === 'roundContainer') {
          const target = e.target;
          let element = target;
          while (element && element !== e.currentTarget) {
            if (
              element.hasAttribute &&
              element.hasAttribute('data-round-container-content')
            )
              return;
            element = element.parentElement;
          }
        }
        e.preventDefault();
        e.stopPropagation();
        handleDragOver(e, index);
      }}
      onDragLeave={(e) => {
        if (isNestedBlock) {
          let element = e.currentTarget;
          while (element && element.parentElement) {
            element = element.parentElement;
            if (
              element.hasAttribute &&
              element.hasAttribute('data-round-container-content')
            ) {
              const dragData = e.dataTransfer?.types || [];
              const isNewComponent =
                dragData.includes('text/block-type') ||
                dragData.includes('application/x-block-type') ||
                dragData.includes('text/plain');
              if (isNewComponent) return;
            }
          }
        }
        if (type === 'roundContainer') {
          const target = e.target;
          let element = target;
          while (element && element !== e.currentTarget) {
            if (
              element.hasAttribute &&
              element.hasAttribute('data-round-container-content')
            )
              return;
            element = element.parentElement;
          }
        }
        e.stopPropagation();
        setDragOverIndex(null);
      }}
      onDrop={(e) => {
        if (isNestedBlock) {
          let element = e.currentTarget;
          while (element && element.parentElement) {
            element = element.parentElement;
            if (
              element.hasAttribute &&
              element.hasAttribute('data-round-container-content')
            ) {
              const type =
                e.dataTransfer.getData('text/block-type') ||
                e.dataTransfer.getData('application/x-block-type') ||
                e.dataTransfer.getData('text/plain');
              if (type) return;
            }
          }
        }
        if (type === 'roundContainer') {
          const target = e.target;
          let element = target;
          while (element && element !== e.currentTarget) {
            if (
              element.hasAttribute &&
              element.hasAttribute('data-round-container-content')
            )
              return;
            element = element.parentElement;
          }
        }
        e.preventDefault();
        e.stopPropagation();
        handleDrop(e, index);
      }}
      onClick={(e) => {
        if (isNestedBlock) e.stopPropagation();
        setActiveBlockId(block.id);
      }}>
      <div style={blockStyle}>
        {!showPreview && (
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

        {!showPreview && shouldShowToolbar && (
          <div className='block-actions' style={{ zIndex: 20 }}>
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

        {!showPreview && isActive && (
          <div className='block-settings'>
            <div className='control-flex margin-bottom-small'>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                Background color
              </div>
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

              {type === 'buttonCoded' && (
                <>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginTop: '8px',
                    }}>
                    Button's background color
                  </div>
                  <input
                    type='color'
                    value={settings?.buttonBgColor || '#000000'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'buttonBgColor',
                        e.target.value
                      )
                    }
                    className='color-input'
                  />
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginTop: '8px',
                    }}>
                    Button's text color
                  </div>
                  <input
                    type='color'
                    value={settings?.color || '#ffffff'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(index, 'color', e.target.value)
                    }
                    className='color-input'
                  />
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginTop: '8px',
                    }}>
                    Button's text font size
                  </div>
                  <input
                    type='number'
                    className='control-select'
                    value={
                      settings?.fontSize ? parseInt(settings.fontSize, 10) : ''
                    }
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'fontSize',
                        e.target.value ? `${e.target.value}px` : ''
                      )
                    }
                  />
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginTop: '8px',
                    }}>
                    Border
                  </div>
                  <input
                    type='text'
                    className='control-select'
                    value={settings?.border || '1px solid #000000'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(index, 'border', e.target.value)
                    }
                  />
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginTop: '8px',
                    }}>
                    Button's inner paddings
                  </div>
                  <input
                    type='text'
                    className='control-select'
                    value={settings?.padding || '12px 24px'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'padding',
                        e.target.value
                      )
                    }
                  />
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginTop: '8px',
                    }}>
                    Button's border radius
                  </div>
                  <input
                    type='number'
                    className='control-select'
                    value={
                      settings?.borderRadius
                        ? parseInt(settings.borderRadius, 10)
                        : ''
                    }
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'borderRadius',
                        e.target.value ? `${e.target.value}px` : ''
                      )
                    }
                  />
                </>
              )}

              {type === 'spacer' && (
                <input
                  type='number'
                  className='settings-input'
                  placeholder='Height (px)'
                  value={settings?.height ? parseInt(settings.height, 10) : ''}
                  onChange={(e) =>
                    handleUpdateBlockSettings(
                      index,
                      'height',
                      e.target.value ? `${e.target.value}px` : ''
                    )
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
                    type='number'
                    className='settings-input'
                    placeholder='Height (px)'
                    value={
                      settings?.lineHeight
                        ? parseInt(settings.lineHeight, 10)
                        : ''
                    }
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'lineHeight',
                        e.target.value ? `${e.target.value}px` : ''
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
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginTop: '8px',
                    }}>
                    Text color
                  </div>
                  <input
                    type='color'
                    value={settings?.color || '#000000'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(index, 'color', e.target.value)
                    }
                    className='color-input'
                  />
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginTop: '8px',
                    }}>
                    Font size
                  </div>
                  <input
                    type='number'
                    className='control-select'
                    value={
                      settings?.fontSize ? parseInt(settings.fontSize, 10) : ''
                    }
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'fontSize',
                        e.target.value ? `${e.target.value}px` : ''
                      )
                    }
                  />
                </>
              )}

              {/* Separate vertical paddings */}
              {type !== 'spacer' &&
                type !== 'buttonCoded' &&
                type !== 'roundContainer' && (
                  <>
                    <select
                      className='control-select flex-grow'
                      value={
                        settings?.paddingTop ?? settings?.padding ?? '10px'
                      }
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

              {(type === 'columns' || type === 'columnsContent') && (
                <div
                  className='control-flex'
                  style={{ flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>
                    Column gap
                  </div>
                  <input
                    type='number'
                    className='settings-input'
                    placeholder='Column gap (px)'
                    value={
                      settings?.columnGap
                        ? parseInt(settings.columnGap, 10)
                        : ''
                    }
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'columnGap',
                        e.target.value ? `${e.target.value}px` : ''
                      )
                    }
                    style={{ width: 80 }}
                  />
                </div>
              )}

              {type === 'columnsContent' && (
                <>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginTop: '8px',
                    }}>
                    Text color
                  </div>
                  <input
                    type='color'
                    value={settings?.color || '#000000'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(index, 'color', e.target.value)
                    }
                    className='color-input'
                  />
                  <div
                    className='checkbox-container'
                    style={{ marginTop: '8px' }}>
                    <input
                      type='checkbox'
                      id={`inline-${block.id}`}
                      checked={!!settings?.hidetitle}
                      onChange={(e) => {
                        const newBlocks = [...template.blocks];
                        newBlocks[index].settings.hidetitle = e.target.checked;
                        setTemplate({ ...template, blocks: newBlocks });
                      }}
                    />
                    <label htmlFor={`inline-${block.id}`}>Hide title</label>
                  </div>
                  <div className='checkbox-container'>
                    <input
                      type='checkbox'
                      id={`inline-${block.id}`}
                      checked={!!settings?.isBold}
                      onChange={(e) => {
                        const newBlocks = [...template.blocks];
                        newBlocks[index].settings.isBold = e.target.checked;
                        setTemplate({ ...template, blocks: newBlocks });
                      }}
                    />
                    <label htmlFor={`inline-${block.id}`}>Is bold</label>
                  </div>
                </>
              )}

              {(type === 'buttonGroup' || type === 'buttonCodedGroup') && (
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
                type === 'button' ||
                type === 'buttonCoded' ||
                type === 'halfText') && (
                <>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginTop: '8px',
                    }}>
                    Text align
                  </div>
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
                </>
              )}

              {type === 'image' && (
                <select
                  className='control-select'
                  value={settings?.margin || '0 auto'}
                  onChange={(e) =>
                    handleUpdateBlockSettings(index, 'margin', e.target.value)
                  }>
                  <option value='0'>Left</option>
                  <option value='0 auto'>Center</option>
                </select>
              )}

              {type === 'roundContainer' && (
                <>
                  <div>
                    <div className='control-flex'>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>
                        Canvas
                      </span>
                      <input
                        type='color'
                        value={settings?.canvasColor || '#CFCFCF'}
                        onChange={(e) =>
                          handleUpdateBlockSettings(
                            index,
                            'canvasColor',
                            e.target.value
                          )
                        }
                        className='color-input'
                      />
                    </div>

                    <div
                      className='control-flex'
                      style={{ gap: 8, flexWrap: 'wrap', marginTop: '16px' }}>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        BG width (%)
                      </div>
                      <input
                        type='number'
                        min='10'
                        max='100'
                        step='1'
                        className='settings-input'
                        value={settings?.bgWidth ?? 88}
                        onChange={(e) =>
                          handleUpdateBlockSettings(
                            index,
                            'bgWidth',
                            Number(e.target.value)
                          )
                        }
                        style={{ width: 90 }}
                      />
                    </div>

                    <div
                      className='control-flex'
                      style={{ gap: 8, flexWrap: 'wrap', marginTop: '16px' }}>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>
                        Border
                      </span>
                      <input
                        type='color'
                        value={settings?.borderColor || '#FFFFFF'}
                        onChange={(e) =>
                          handleUpdateBlockSettings(
                            index,
                            'borderColor',
                            e.target.value
                          )
                        }
                        className='color-input'
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type='number'
                          value={settings?.borderWidth ?? 3}
                          onChange={(e) =>
                            handleUpdateBlockSettings(
                              index,
                              'borderWidth',
                              Number(e.target.value)
                            )
                          }
                          placeholder='Width'
                          className='settings-input'
                          style={{ width: 60 }}
                        />
                        <select
                          value={settings?.borderType || 'solid'}
                          onChange={(e) =>
                            handleUpdateBlockSettings(
                              index,
                              'borderType',
                              e.target.value
                            )
                          }
                          className='control-select'
                          style={{ width: 90 }}>
                          <option value='solid'>solid</option>
                          <option value='dashed'>dashed</option>
                          <option value='dotted'>dotted</option>
                        </select>
                        <input
                          type='number'
                          value={settings?.borderRadius ?? 24}
                          onChange={(e) =>
                            handleUpdateBlockSettings(
                              index,
                              'borderRadius',
                              Number(e.target.value)
                            )
                          }
                          placeholder='Radius'
                          className='settings-input'
                          style={{ width: 70 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          color: '#6b7280',
                          marginTop: '16px',
                        }}>
                        Paddings (top/bottom)
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type='number'
                          className='settings-input'
                          value={settings?.paddingInnerTop ?? 64}
                          onChange={(e) =>
                            handleUpdateBlockSettings(
                              index,
                              'paddingInnerTop',
                              Number(e.target.value)
                            )
                          }
                          style={{ width: 70 }}
                        />
                        <input
                          type='number'
                          className='settings-input'
                          value={settings?.paddingInnerBottom ?? 64}
                          onChange={(e) =>
                            handleUpdateBlockSettings(
                              index,
                              'paddingInnerBottom',
                              Number(e.target.value)
                            )
                          }
                          style={{ width: 70 }}
                        />
                      </div>
                    </div>
                  </div>
                </>
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
