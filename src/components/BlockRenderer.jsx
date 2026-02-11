// BlockRenderer.jsx
import React, { useState } from 'react';
import { GripVertical, Trash2, Copy } from 'lucide-react';
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
  FooterBlock,
} from './BlockTypes';
import {
  ColorControl,
  NumberControl,
  SelectControl,
  PaddingControl,
  AlignmentControl,
  TextControl,
  CheckboxControl,
  BorderControl,
} from './Controls';

const IMG_BLOCK_STYLE = {
  maxWidth: '100%',
  border: 0,
  display: 'block',
  margin: '0 auto',
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
      blockContent = <FooterBlock type={type} settings={settings} />;
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
      onMouseEnter={() => setHoveredBlockId(block.id)}
      onMouseLeave={() => setHoveredBlockId(null)}
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
              <ColorControl
                label="Background color"
                value={settings?.backgroundColor || '#ffffff'}
                onChange={(value) => handleUpdateBlockSettings(index, 'backgroundColor', value)}
              />

              {type === 'buttonCoded' && (
                <>
                  <ColorControl
                    label="Button's background color"
                    value={settings?.buttonBgColor || '#000000'}
                    onChange={(value) => handleUpdateBlockSettings(index, 'buttonBgColor', value)}
                  />
                  <ColorControl
                    label="Button's text color"
                    value={settings?.color || '#ffffff'}
                    onChange={(value) => handleUpdateBlockSettings(index, 'color', value)}
                  />
                  <NumberControl
                    label="Button's text font size"
                    value={settings?.fontSize}
                    onChange={(value) => handleUpdateBlockSettings(index, 'fontSize', value)}
                  />
                  <TextControl
                    label="Border"
                    value={settings?.border || '1px solid #000000'}
                    onChange={(value) => handleUpdateBlockSettings(index, 'border', value)}
                  />
                  <TextControl
                    label="Button's inner paddings"
                    value={settings?.padding || '12px 24px'}
                    onChange={(value) => handleUpdateBlockSettings(index, 'padding', value)}
                  />
                  <NumberControl
                    label="Button's border radius"
                    value={settings?.borderRadius}
                    onChange={(value) => handleUpdateBlockSettings(index, 'borderRadius', value)}
                  />
                </>
              )}

              {type === 'spacer' && (
                <NumberControl
                label="Height (px)"
                value={settings?.height}
                onChange={(value) => handleUpdateBlockSettings(index, 'height', value)}
              />
              )}

              {type === 'divider' && (
                <>
                  <ColorControl
                    label="Divider color"
                    value={settings?.lineColor || '#dddddd'}
                    onChange={(value) => handleUpdateBlockSettings(index, 'lineColor', value)}
                  />
                  <NumberControl
                    label="Height (px)"
                    value={settings?.lineHeight}
                    onChange={(value) => handleUpdateBlockSettings(index, 'lineHeight', value)}
                  />
                </>
              )}

              {(type === 'header' || type === 'text') && (
                <>
                  <ColorControl
                    label="Text color"
                    value={settings?.color || '#000000'}
                    onChange={(value) => handleUpdateBlockSettings(index, 'color', value)}
                  />
                  <NumberControl
                    label="Font size"
                    value={settings?.fontSize}
                    onChange={(value) => handleUpdateBlockSettings(index, 'fontSize', value)}
                  />
                </>
              )}

              {/* Separate vertical paddings */}
              {type !== 'spacer' &&
                type !== 'buttonCoded' &&
                type !== 'roundContainer' && (
                  <PaddingControl
                    paddingTop={settings?.paddingTop ?? settings?.padding ?? '10px'}
                    paddingBottom={settings?.paddingBottom ?? settings?.padding ?? '10px'}
                    onTopChange={(value) => handleUpdateBlockSettings(index, 'paddingTop', value)}
                    onBottomChange={(value) => handleUpdateBlockSettings(index, 'paddingBottom', value)}
                  />
                )}

              {(type === 'columns' || type === 'columnsContent') && (
                <NumberControl
                  label="Column gap"
                  value={settings?.columnGap}
                  onChange={(value) => handleUpdateBlockSettings(index, 'columnGap', value)}
                />
              )}

              {type === 'columnsContent' && (
                <>
                  <ColorControl
                    label="Text color"
                    value={settings?.color || '#000000'}
                    onChange={(value) => handleUpdateBlockSettings(index, 'color', value)}
                  />
                  <CheckboxControl
                    id={`hidetitle-${block.id}`}
                    label="Hide title"
                    checked={!!settings?.hidetitle}
                    onChange={(checked) => handleUpdateBlockSettings(index, 'hidetitle', checked)}
                    containerStyle={{ marginTop: 8 }}
                  />
                  <CheckboxControl
                    id={`isBold-${block.id}`}
                    label="Is bold"
                    checked={!!settings?.isBold}
                    onChange={(checked) => handleUpdateBlockSettings(index, 'isBold', checked)}
                  />
                </>
              )}

              {(type === 'buttonGroup' || type === 'buttonCodedGroup') && (
                <CheckboxControl
                  id={`inline-${block.id}`}
                  label="Display buttons inline"
                  checked={!!settings?.inline}
                  onChange={(checked) => handleUpdateBlockSettings(index, 'inline', checked)}
                />
              )}

              {type === 'header' && (
                <CheckboxControl
                  id={`isImage-${block.id}`}
                  label="Display image"
                  checked={!!settings?.isImage}
                  onChange={(checked) => handleUpdateBlockSettings(index, 'isImage', checked)}
                />
              )}

              {(type === 'header' ||
                type === 'text' ||
                type === 'button' ||
                type === 'buttonCoded' ||
                type === 'image') && (
                  <AlignmentControl
                    value={settings?.textAlign || 'left'}
                    onChange={(value) => handleUpdateBlockSettings(index, 'textAlign', value)}
                  />
              )}

              {type === 'roundContainer' && (
                <>
                  <ColorControl
                    label="Canvas"
                    value={settings?.canvasColor || '#CFCFCF'}
                    onChange={(value) => handleUpdateBlockSettings(index, 'canvasColor', value)}
                  />

                  <NumberControl
                    label="BG width (%)"
                    value={settings?.bgWidth ?? 88}
                    onChange={(value) => handleUpdateBlockSettings(index, 'bgWidth', value)}
                    addPx={false}
                    inputStyle={{ width: 90 }}
                    containerStyle={{ marginTop: 16 }}
                  />

                  <BorderControl
                    colorValue={settings?.borderColor || '#FFFFFF'}
                    widthValue={settings?.borderWidth ?? 3}
                    typeValue={settings?.borderType || 'solid'}
                    radiusValue={settings?.borderRadius ?? 24}
                    onColorChange={(value) => handleUpdateBlockSettings(index, 'borderColor', value)}
                    onWidthChange={(value) => handleUpdateBlockSettings(index, 'borderWidth', value)}
                    onTypeChange={(value) => handleUpdateBlockSettings(index, 'borderType', value)}
                    onRadiusChange={(value) => handleUpdateBlockSettings(index, 'borderRadius', value)}
                  />

                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
                      Paddings (top/bottom)
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <NumberControl
                        value={settings?.paddingInnerTop ?? 64}
                        onChange={(value) => handleUpdateBlockSettings(index, 'paddingInnerTop', value)}
                        addPx={false}
                        inputStyle={{ width: 70 }}
                      />
                      <NumberControl
                        value={settings?.paddingInnerBottom ?? 64}
                        onChange={(value) => handleUpdateBlockSettings(index, 'paddingInnerBottom', value)}
                        addPx={false}
                        inputStyle={{ width: 70 }}
                      />
                    </div>
                  </div>
                </>
              )}

              {(type === 'footer' || type === 'footer_general_kz') && (
                <div className='control-flex margin-bottom-small'>
                  <ColorControl
                    label="Canvas color"
                    value={settings?.canvascolor || '#f5f5f5'}
                    onChange={(value) => handleUpdateBlockSettings(index, 'canvascolor', value)}
                  />
                  <ColorControl
                    label="Text color"
                    value={settings?.textcolor || '#000000'}
                    onChange={(value) => handleUpdateBlockSettings(index, 'textcolor', value)}
                  />
                  <ColorControl
                    label="Disclaimer color"
                    value={settings?.disclaimercolor || '#555555'}
                    onChange={(value) => handleUpdateBlockSettings(index, 'disclaimercolor', value)}
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
