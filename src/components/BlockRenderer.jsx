// BlockRenderer.jsx
import React, { useState } from 'react';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { getImagePath, socialIcons } from '../utils/imageUtils';
import { addFileAsset } from '../utils/assets';
import RoundContainer from './RoundContainer';
import { createNewBlock } from '../handlers/EmailBuilderHandlers';
import {
  SpacerBlock,
  DividerBlock,
  TextBlock,
  ImageBlock,
  HeaderBlock,
  ButtonBlock,
  ButtonCodedBlock,
  ButtonGroupBlock,
  ButtonCodedGroupBlock,
  ColumnsBlock,
  ColumnsContentBlock,
} from './BlockTypes';

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

// Common style constants
const DEFAULT_FONT_FAMILY = 'SamsungOne, Arial, Helvetica, sans-serif';
const FALLBACK_FONT = 'Arial, sans-serif';

const COMMON_INPUT_STYLE = {
  width: 90,
};

const CONTROL_LABEL_STYLE = {
  fontSize: 12,
  color: '#6b7280',
};

// Utility: Check if drag event should stop propagation for nested/round container blocks
const shouldStopDragPropagation = (e, isNestedBlock, type) => {
  // Check for nested block within round container
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
        if (isNewComponent) return true;
      }
    }
  }

  // Check for round container
  if (type === 'roundContainer') {
    const target = e.target;
    let element = target;
    while (element && element !== e.currentTarget) {
      if (
        element.hasAttribute &&
        element.hasAttribute('data-round-container-content')
      ) {
        return true;
      }
      element = element.parentElement;
    }
  }

  return false;
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
                    <br />©{new Date().getFullYear()} Samsung Electronics Co.,
                    Ltd. {dict.all_rights}
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
    settings?.imagePath || block.imagePath || '',
  );

  const shouldShowToolbar = isHovered || isActive;

  // Padding (separate)
  const topPad = settings?.paddingTop ?? settings?.padding ?? '0';
  const bottomPad = settings?.paddingBottom ?? settings?.padding ?? '0';

  const isSpacer = type === 'spacer';
  const isFooter = type === 'footer' || type === 'footer_general_kz';
  const isRound = type === 'roundContainer';

  const blockStyle = {
    backgroundColor: settings?.backgroundColor || 'white',
    paddingTop: isSpacer || isFooter || isRound ? '0' : topPad,
    paddingBottom: isSpacer || isFooter || isRound ? '0' : bottomPad,
    paddingLeft:
      type === 'image' || isSpacer || isFooter || isRound ? '0' : '8%',
    paddingRight:
      type === 'image' || isSpacer || isFooter || isRound ? '0' : '8%',
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
    isHeader = false,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // { path: "i/1.png", previewUrl: "blob:..." }
    const asset = addFileAsset(file);

    // For nested blocks with header images, use handleUpdateBlockSettings
    if (
      isNestedBlock &&
      isHeader &&
      buttonIndex === null &&
      columnIndex === null
    ) {
      handleUpdateBlockSettings(index, 'imagePath', asset.path);
      handleUpdateBlockSettings(index, 'imagePreviewUrl', asset.previewUrl);
      setManualUrlValue(asset.path);
      return;
    }

    setTemplate((prev) => {
      const newBlocks = [...prev.blocks];
      const blk = newBlocks[index];

      if (buttonIndex !== null) {
        // BUTTON IMAGE
        const btn = blk.buttons[buttonIndex];
        btn.settings = {
          ...(btn.settings || {}),
          imagePath: asset.path,
          imagePreviewUrl: asset.previewUrl,
        };
      } else if (columnIndex !== null) {
        // COLUMNS / COLUMN CONTENT IMAGE
        const col = blk.columns[columnIndex] || {};
        col.imagePath = asset.path;
        col.imagePreviewUrl = asset.previewUrl;

        // legacy fallback if some old column types still read content
        if (typeof col.content !== 'undefined') {
          col.content = asset.previewUrl;
        }

        blk.columns[columnIndex] = col;
      } else if (isHeader) {
        // HEADER IMAGE
        blk.settings = {
          ...(blk.settings || {}),
          imagePath: asset.path,
          imagePreviewUrl: asset.previewUrl,
        };

        if (blk.settings && 'imageUrl' in blk.settings) {
          delete blk.settings.imageUrl;
        }
      } else {
        // GENERIC IMAGE BLOCKS
        blk.settings = {
          ...(blk.settings || {}),
          imagePath: asset.path,
          imagePreviewUrl: asset.previewUrl,
        };

        // Only image-type blocks should have their content replaced by the blob
        if (blk.type === 'image') {
          blk.content = asset.previewUrl;
        }
      }

      newBlocks[index] = blk;
      return { ...prev, blocks: newBlocks };
    });

    setManualUrlValue(asset.path);
  };

  switch (type) {
    case 'header':
      blockContent = (
        <HeaderBlock
          content={content}
          settings={settings}
          index={index}
          isActive={isActive}
          contentStyle={contentStyle}
          handleUpdateBlockContent={handleUpdateBlockContent}
          handleImageUpload={handleImageUpload}
        />
      );
      break;

    case 'text':
      blockContent = (
        <TextBlock
          content={content}
          settings={settings}
          index={index}
          isActive={isActive}
          contentStyle={contentStyle}
          handleUpdateBlockContent={handleUpdateBlockContent}
        />
      );
      break;

    case 'image':
      blockContent = (
        <ImageBlock
          settings={settings}
          index={index}
          isActive={isActive}
          manualUrlValue={manualUrlValue}
          setManualUrlValue={setManualUrlValue}
          handleImageUpload={handleImageUpload}
          handleUpdateBlockSettings={handleUpdateBlockSettings}
        />
      );
      break;

    case 'button':
      blockContent = (
        <ButtonBlock
          settings={settings}
          index={index}
          isActive={isActive}
          setTemplate={setTemplate}
          handleUpdateBlockSettings={handleUpdateBlockSettings}
        />
      );
      break;

    case 'buttonCoded':
      blockContent = (
        <ButtonCodedBlock
          settings={settings}
          index={index}
          isActive={isActive}
          handleUpdateBlockSettings={handleUpdateBlockSettings}
        />
      );
      break;

    case 'buttonGroup':
      blockContent = (
        <ButtonGroupBlock
          block={block}
          settings={settings}
          index={index}
          isActive={isActive}
          template={template}
          setTemplate={setTemplate}
          handleImageUpload={handleImageUpload}
        />
      );
      break;

    case 'buttonCodedGroup':
      blockContent = (
        <ButtonCodedGroupBlock
          block={block}
          settings={settings}
          index={index}
          isActive={isActive}
          template={template}
          setTemplate={setTemplate}
        />
      );
      break;

    case 'divider':
      blockContent = <DividerBlock settings={settings} />;
      break;

    case 'spacer':
      blockContent = <SpacerBlock settings={settings} />;
      break;

    case 'columns':
      blockContent = (
        <ColumnsBlock
          block={block}
          settings={settings}
          index={index}
          isActive={isActive}
          template={template}
          setTemplate={setTemplate}
        />
      );
      break;

    case 'columnsContent':
      blockContent = (
        <ColumnsContentBlock
          block={block}
          settings={settings}
          index={index}
          isActive={isActive}
          contentStyle={contentStyle}
          template={template}
          setTemplate={setTemplate}
        />
      );
      break;

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
              (_, i) => i !== childIndex,
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
              JSON.stringify(next.blocks[index].children[childIndex]),
            );
            childToDuplicate.id = `${childToDuplicate.type}-${Date.now()}`;
            next.blocks[index].children.splice(
              childIndex + 1,
              0,
              childToDuplicate,
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
        if (shouldStopDragPropagation(e, isNestedBlock, type)) return;
        e.preventDefault();
        e.stopPropagation();
        handleDragOver(e, index);
      }}
      onDragLeave={(e) => {
        if (shouldStopDragPropagation(e, isNestedBlock, type)) return;
        e.stopPropagation();
        setDragOverIndex(null);
      }}
      onDrop={(e) => {
        if (shouldStopDragPropagation(e, isNestedBlock, type)) return;
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
                    e.target.value,
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
                        e.target.value,
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
                        e.target.value ? `${e.target.value}px` : '',
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
                        e.target.value,
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
                        e.target.value ? `${e.target.value}px` : '',
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
                      e.target.value ? `${e.target.value}px` : '',
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
                        e.target.value,
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
                        e.target.value ? `${e.target.value}px` : '',
                      )
                    }
                    style={{ width: 80 }}
                  />
                </>
              )}

              {(type === 'header' || type === 'text') && (
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
                        e.target.value ? `${e.target.value}px` : '',
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
                          e.target.value,
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
                          e.target.value,
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
                        e.target.value ? `${e.target.value}px` : '',
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
                      handleUpdateBlockSettings(
                        index,
                        'inline',
                        e.target.checked,
                      );
                    }}
                  />
                  <label htmlFor={`inline-${block.id}`}>
                    Display buttons inline
                  </label>
                </div>
              )}

              {type === 'header' && (
                <div className='checkbox-container'>
                  <input
                    type='checkbox'
                    id={`inline-${block.id}`}
                    checked={!!settings?.isImage}
                    onChange={(e) => {
                      handleUpdateBlockSettings(
                        index,
                        'isImage',
                        e.target.checked,
                      );
                    }}
                  />
                  <label htmlFor={`inline-${block.id}`}>Display image</label>
                </div>
              )}

              {(type === 'header' ||
                type === 'text' ||
                type === 'button' ||
                type === 'buttonCoded') && (
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
                        e.target.value,
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
                  <option value='0 0 0 auto'>Right</option>
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
                            e.target.value,
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
                            Number(e.target.value),
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
                            e.target.value,
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
                              Number(e.target.value),
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
                              e.target.value,
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
                              Number(e.target.value),
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
                              Number(e.target.value),
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
                              Number(e.target.value),
                            )
                          }
                          style={{ width: 70 }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {(type === 'footer' || type === 'footer_general_kz') && (
                <div className='control-flex margin-bottom-small'>
                  <input
                    type='color'
                    value={settings?.canvascolor || '#f5f5f5'}
                    onChange={(e) =>
                      handleUpdateBlockSettings(
                        index,
                        'canvascolor',
                        e.target.value,
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
                        e.target.value,
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
                        e.target.value,
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
