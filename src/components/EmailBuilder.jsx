import React, { useState } from 'react';
import {
  GripVertical,
  Trash2,
  Copy,
  Settings,
  Type,
  Image,
  Grid,
  Columns,
  FileText,
  Save,
  Code,
  Eye,
  Layout,
} from 'lucide-react';
import { initialTemplate, components } from '../config/emailTemplateConfig.jsx';
import renderBlockHtml from './BlockHtmlRenderer';
import BlockRenderer from './BlockRenderer';
import PreHeader from './PreHeader';
import { generateHtmlOutput } from '../utils/htmlGenerator';
import {
  createNewBlock,
  handleDeleteBlock,
  handleDuplicateBlock,
  handleUpdateBlockContent,
  handleUpdateBlockSettings,
  handleUpdateTemplateSetting,
  handleSaveTemplate,
  handleDragStart,
  handleDragOver,
  handleDrop,
} from '../handlers/EmailBuilderHandlers';
import './EmailBuilder.css';

const EmailBuilder = () => {
  // Email template structure
  const [template, setTemplate] = useState(initialTemplate);

  // State for drag and drop
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [hoveredBlockId, setHoveredBlockId] = useState(null);

  const handleViewInBrowser = (e) => {
    e.preventDefault();
    const htmlOutput = generateHtmlOutput(template, renderBlockHtml);
    const blob = new Blob([htmlOutput], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className='email-builder'>
      {/* Components Sidebar */}
      <div className='sidebar'>
        <h2 className='sidebar-title'>Email Components</h2>
        <div className='component-list'>
          {components.map((component) => (
            <div
              key={component.type}
              className='component-item'
              draggable
              onDragStart={(e) =>
                handleDragStart(e, component, true, setDraggedItem)
              }>
              <div className='component-icon'>{component.icon}</div>
              {component.label}
            </div>
          ))}
        </div>

        <div className='template-settings'>
          <h3 className='settings-title'>Template Settings</h3>
          <div className='settings-group'>
            <div className='setting-item'>
              <label className='setting-label'>Template Title</label>
              <input
                type='text'
                value={template.title}
                onChange={(e) =>
                  handleUpdateTemplateSetting(
                    'title',
                    e.target.value,
                    template,
                    setTemplate
                  )
                }
                className='settings-input full-width'
                placeholder='Enter template title'
              />
            </div>
            <div className='setting-item'>
              <label className='setting-label'>
                Title Link Label (optional)
              </label>
              <input
                type='text'
                value={template.titleLinkLabel}
                onChange={(e) =>
                  handleUpdateTemplateSetting(
                    'titleLinkLabel',
                    e.target.value,
                    template,
                    setTemplate
                  )
                }
                className='settings-input full-width'
                placeholder='Enter link label for the title'
              />
            </div>
            <div className='setting-item'>
              <label className='setting-label'>
                Title Link Label Unsub (optional)
              </label>
              <input
                type='text'
                value={template.titleLinkLabelUnsub}
                onChange={(e) =>
                  handleUpdateTemplateSetting(
                    'titleLinkLabelUnsub',
                    e.target.value,
                    template,
                    setTemplate
                  )
                }
                className='settings-input full-width'
                placeholder='Enter link label for unsubcription'
              />
            </div>
            <div className='setting-item'>
              <label className='setting-label'>
                Footer Link Label (optional)
              </label>
              <input
                type='text'
                value={template.footerLinkLabel || ''}
                onChange={(e) =>
                  handleUpdateTemplateSetting(
                    'footerLinkLabel',
                    e.target.value,
                    template,
                    setTemplate
                  )
                }
                className='settings-input full-width'
                placeholder='Enter default link label for footer unsubscribe links'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className='main-area'>
        {/* Toolbar */}
        <div className='toolbar'>
          <div className='toolbar-title'>Email Editor</div>
          <div className='toolbar-actions'>
            <button
              className={`toolbar-button ${showPreview ? 'active' : ''}`}
              onClick={() => {
                setShowPreview(!showPreview);
                setShowCode(false);
              }}>
              <Eye size={16} />
              <span>Preview</span>
            </button>
            <button
              className={`toolbar-button ${showCode ? 'active' : ''}`}
              onClick={() => {
                setShowCode(!showCode);
                setShowPreview(false);
              }}>
              <Code size={16} />
              <span>HTML</span>
            </button>
            <button
              className='toolbar-button primary'
              onClick={() =>
                handleSaveTemplate(() =>
                  generateHtmlOutput(template, renderBlockHtml)
                )
              }>
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Pre-header Section */}
        <PreHeader template={template} onViewInBrowser={handleViewInBrowser} />

        {/* Canvas */}
        <div className='canvas-container'>
          {showCode ? (
            <div className='code-container'>
              <div className='code-header'>
                <button
                  className='close-button'
                  onClick={() => setShowCode(false)}>
                  Close
                </button>
              </div>
              <pre className='code-output'>
                {generateHtmlOutput(template, renderBlockHtml)}
              </pre>
            </div>
          ) : (
            <div
              className='email-canvas'
              onClick={(e) => {
                if (e.target === e.currentTarget) setActiveBlockId(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                // show indicator at end when dragging past last block
                setDragOverIndex(template.blocks.length);
              }}
              onDrop={(e) => {
                e.preventDefault();
                // drop at the last hover position (or at end)
                handleDrop(
                  e,
                  dragOverIndex ?? template.blocks.length,
                  draggedItem,
                  template,
                  setTemplate,
                  setDraggedItem,
                  setDragOverIndex,
                  createNewBlock
                );
                setDragOverIndex(null);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragOverIndex(null);
              }}
              style={{ width: '640px' }}>
              {template.blocks.map((block, index) => (
                <React.Fragment key={block.id}>
                  {dragOverIndex === index && (
                    <div className='drop-indicator' />
                  )}
                  <BlockRenderer
                    block={block}
                    index={index}
                    isActive={activeBlockId === block.id}
                    isHovered={hoveredBlockId === block.id}
                    isNestedBlock={block.parentId !== undefined}
                    showPreview={showPreview}
                    dragOverIndex={dragOverIndex}
                    settings={block.settings}
                    template={template}
                    setTemplate={setTemplate}
                    handleDragStart={(e) =>
                      handleDragStart(e, block, false, setDraggedItem)
                    }
                    handleDragOver={(e) =>
                      handleDragOver(e, index, setDragOverIndex)
                    }
                    handleDrop={(e) =>
                      handleDrop(
                        e,
                        index,
                        draggedItem,
                        template,
                        setTemplate,
                        setDraggedItem,
                        setDragOverIndex,
                        createNewBlock
                      )
                    }
                    setActiveBlockId={setActiveBlockId}
                    setHoveredBlockId={setHoveredBlockId}
                    setDragOverIndex={setDragOverIndex}
                    handleDuplicateBlock={(index) =>
                      handleDuplicateBlock(index, template, setTemplate)
                    }
                    handleDeleteBlock={(index) =>
                      handleDeleteBlock(
                        index,
                        template,
                        setTemplate,
                        setActiveBlockId
                      )
                    }
                    handleUpdateBlockContent={(index, content) =>
                      handleUpdateBlockContent(
                        index,
                        content,
                        template,
                        setTemplate
                      )
                    }
                    handleUpdateBlockSettings={(index, setting, value) =>
                      handleUpdateBlockSettings(
                        index,
                        setting,
                        value,
                        template,
                        setTemplate
                      )
                    }
                  />
                </React.Fragment>
              ))}

              {/* Drop placeholder for empty state */}
              {template.blocks.length === 0 && (
                <div
                  className='empty-placeholder'
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) =>
                    handleDrop(
                      e,
                      0,
                      draggedItem,
                      template,
                      setTemplate,
                      setDraggedItem,
                      setDragOverIndex,
                      createNewBlock
                    )
                  }>
                  Drag components here
                </div>
              )}

              {/* Final drop zone */}
              {template.blocks.length > 0 && draggedItem && (
                <div
                  className={`drop-zone ${
                    dragOverIndex === template.blocks.length ? 'active' : ''
                  }`}
                  onDragOver={(e) =>
                    handleDragOver(e, template.blocks.length, setDragOverIndex)
                  }></div>
              )}
              {dragOverIndex === template.blocks.length && (
                <div className='drop-indicator' />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailBuilder;
