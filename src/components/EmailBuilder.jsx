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
import './EmailBuilder.css';

const EmailBuilder = () => {
  // Email template structure
  const [template, setTemplate] = useState({
    id: `template-${Date.now()}`,
    title: 'Untitled Email Template',
    blocks: [
      {
        id: 'header-1',
        type: 'header',
        content: 'Welcome to our Newsletter',
        settings: {
          backgroundColor: '#ffffff',
          color: '#000000',
          fontSize: '48px',
          padding: '24px 0',
          textAlign: 'center',
          fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
        },
      },
      {
        id: 'text-1',
        type: 'text',
        content:
          'Thank you for subscribing to our newsletter. We are excited to share the latest updates with you.',
        settings: {
          backgroundColor: '#ffffff',
          color: '#000000',
          fontSize: '24px',
          padding: '24px 0',
          textAlign: 'center',
          fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
        },
      },
      {
        id: 'image-1',
        type: 'image',
        content: 'https://placehold.co/640x300',
        settings: {
          backgroundColor: '#ffffff',
          textAlign: 'center',
          altText: 'Featured image',
        },
      },
    ],
  });

  // Available components to add
  const components = [
    { type: 'header', label: 'Heading', icon: <Type size={16} /> },
    { type: 'text', label: 'Text Block', icon: <FileText size={16} /> },
    { type: 'image', label: 'Image', icon: <Image size={16} /> },
    { type: 'button', label: 'Button', icon: <Layout size={16} /> },
    { type: 'buttonGroup', label: 'Button Group', icon: <Layout size={16} /> },
    { type: 'divider', label: 'Divider', icon: <Columns size={16} /> },
    { type: 'spacer', label: 'Spacer', icon: <Layout size={16} /> },
    { type: 'columns', label: '2 Columns', icon: <Grid size={16} /> },
    { type: 'halfText', label: 'Half Text', icon: <FileText size={16} /> },
  ];

  // State for drag and drop
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [hoveredBlockId, setHoveredBlockId] = useState(null);

  // Drag and drop handlers
  const handleDragStart = (e, item, isNew = false) => {
    if (isNew) {
      setDraggedItem({ ...item, isNew: true });
    } else {
      setDraggedItem({
        ...item,
        isNew: false,
        index: parseInt(e.currentTarget.dataset.index),
      });
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex, parentBlockId = null) => {
    e.preventDefault();

    const newBlocks = [...template.blocks];

    if (draggedItem.isNew) {
      const newBlock = createNewBlock(draggedItem.type);
      newBlocks.splice(dropIndex, 0, newBlock);
    } else {
      const movedItem = newBlocks[draggedItem.index];
      newBlocks.splice(draggedItem.index, 1);
      newBlocks.splice(dropIndex, 0, movedItem);
    }

    setTemplate({ ...template, blocks: newBlocks });
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  // Create a new block based on type
  const createNewBlock = (type) => {
    const id = `${type}-${Date.now()}`;

    switch (type) {
      case 'header':
        return {
          id,
          type,
          content: 'New Heading',
          settings: {
            backgroundColor: '#ffffff',
            color: '#000000',
            fontSize: '48px',
            padding: '24px 0',
            textAlign: 'center',
            fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
          },
        };
      case 'text':
        return {
          id,
          type,
          content: 'Enter your text here...',
          settings: {
            backgroundColor: '#ffffff',
            color: '#000000',
            fontSize: '24px',
            padding: '24px 0',
            textAlign: 'center',
            fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
          },
        };
      case 'image':
        return {
          id,
          type,
          content: 'https://placehold.co/640x300',
          settings: {
            backgroundColor: '#ffffff',
            textAlign: 'center',
            altText: 'Image description',
          },
        };
      case 'button':
        return {
          id,
          type: 'button',
          content: 'https://placehold.co/80x40',
          settings: {
            backgroundColor: '#ffffff',
            padding: '10px',
            textAlign: 'center',
            // rename content → imageUrl for clarity
            imageUrl: 'https://placehold.co/80x40',
            imageAlt: 'Click me',
            linkUrl: '#',
            fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
          },
        };
      case 'buttonGroup':
        return {
          id,
          type,
          buttons: [
            {
              content: 'https://placehold.co/80x40',
              settings: {
                backgroundColor: '#ffffff',
                padding: '10px',
                textAlign: 'center',
                imageUrl: 'https://placehold.co/80x40',
                imageAlt: 'Button 1',
                linkUrl: '#',
                fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
              },
            },
            {
              content: 'https://placehold.co/80x40',
              settings: {
                backgroundColor: '#ffffff',
                padding: '10px',
                textAlign: 'center',
                imageUrl: 'https://placehold.co/80x40',
                imageAlt: 'Button 2',
                linkUrl: '#',
                fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
              },
            },
          ],
          settings: {
            backgroundColor: '#ffffff',
            padding: '10px',
            inline: true,
            gap: '20px',
          },
        };
      case 'divider':
        return {
          id,
          type,
          settings: {
            backgroundColor: '#ffffff',
            padding: '10px',
            lineColor: '#dddddd',
            lineHeight: '1px',
          },
        };
      case 'spacer':
        return {
          id,
          type,
          settings: {
            backgroundColor: '#ffffff',
            height: '40px',
          },
        };
      case 'columns':
        return {
          id,
          type,
          columns: [
            { 
              content: 'https://placehold.co/300x200', 
              settings: { 
                padding: '10px',
                altText: 'Left column image',
                linkUrl: ''
              } 
            },
            { 
              content: 'https://placehold.co/300x200', 
              settings: { 
                padding: '10px',
                altText: 'Right column image',
                linkUrl: ''
              } 
            },
          ],
          settings: {
            backgroundColor: '#ffffff',
            padding: '10px',
            columnGap: '20px',
          },
        };
      case 'halfText':
        return {
          id,
          type,
          content: 'Enter your text here...',
          imageUrl: 'https://placehold.co/300x200',
          settings: {
            backgroundColor: '#ffffff',
            color: '#000000',
            fontSize: '16px',
            padding: '24px 0',
            textAlign: 'left',
            fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
            imagePosition: 'right', // 'left' or 'right'
            imageWidth: '40%', // percentage of container width
            showButton: false,
            buttonText: 'Learn More',
            buttonUrl: '#',
            buttonColor: '#2563eb',
            buttonTextColor: '#ffffff',
          },
        };
      default:
        return {
          id,
          type,
          content: '',
          settings: { backgroundColor: '#ffffff' },
        };
    }
  };

  // Delete a block
  const handleDeleteBlock = (index) => {
    const newBlocks = [...template.blocks];
    newBlocks.splice(index, 1);
    setTemplate({ ...template, blocks: newBlocks });
    setActiveBlockId(null);
  };

  // Duplicate a block
  const handleDuplicateBlock = (index) => {
    const newBlocks = [...template.blocks];
    const duplicatedBlock = {
      ...newBlocks[index],
      id: `${newBlocks[index].type}-${Date.now()}`,
    };
    newBlocks.splice(index + 1, 0, duplicatedBlock);
    setTemplate({ ...template, blocks: newBlocks });
  };

  // Update block content
  const handleUpdateBlockContent = (index, content) => {
    // Create a temporary div to parse the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Remove all inline styles from the content
    const removeInlineStyles = (element) => {
      if (element.style) {
        element.removeAttribute('style');
      }
      Array.from(element.children).forEach(removeInlineStyles);
    };
    removeInlineStyles(tempDiv);
    
    // Get the sanitized content
    const sanitizedContent = tempDiv.innerHTML;
    
    const newBlocks = [...template.blocks];
    newBlocks[index] = { ...newBlocks[index], content: sanitizedContent };
    setTemplate({ ...template, blocks: newBlocks });
  };

  // Update block settings
  const handleUpdateBlockSettings = (index, setting, value) => {
    const newBlocks = [...template.blocks];
    newBlocks[index] = {
      ...newBlocks[index],
      settings: { ...newBlocks[index].settings, [setting]: value },
    };
    setTemplate({ ...template, blocks: newBlocks });
  };

  // Update template settings
  const handleUpdateTemplateSetting = (setting, value) => {
    setTemplate({ ...template, [setting]: value });
  };

  // Save template handler
  const handleSaveTemplate = () => {
    // Get the HTML output
    const htmlOutput = generateHtmlOutput();
    
    // Create a blob with the HTML data
    const blob = new Blob([htmlOutput], { type: 'text/html' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate HTML output
  const generateHtmlOutput = () => {
    let html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Template</title>
  <style type="text/css">
    /* Client-specific styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    
    /* Reset styles */
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    
    /* iOS BLUE LINKS */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <!-- Email wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td align="center">
        <!-- Pre-header -->
        <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="width:640px;margin:0 auto;padding:0;text-align:center;font-family: SamsungOne, Arial, Helvetica, sans-serif;">
          <tr>
            <td style="padding: 20px;" align="left" valign="middle">
              <span style="font-family: Arial, Helvetica, sans-serif;font-size:12px;text-align:center;color:#000000;margin:0;margin-bottom:6px;line-height:1.1;">${template.title}</span>
            </td>
            <td style="padding: 20px;" valign="middle" align="right">
              <a href="#" onclick="window.open(URL.createObjectURL(new Blob([document.documentElement.outerHTML], { type: 'text/html' })), '_blank')" _label="Mirror Page" _type="mirrorPage" style="color:#000000;text-decoration:underline;font-size:12px;">View in Browser →</a>
            </td>
          </tr>
        </table>
        <!-- Email container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="640px" style="margin: 0 auto;">
          <tr>
            <td>
              <!-- Email content -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                ${template.blocks.map(block => renderBlockHtml(block)).join('')}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    return html;
  };

  // Render a block as HTML
  const renderBlockHtml = (block) => {
    const { type, content, settings } = block;
    let blockHtml = '';

    const styleString = Object.entries(settings || {})
      .filter(([key]) => !['altText', 'buttonUrl', 'inline', 'gap', 'imagePosition', 'imageWidth', 'showButton', 'buttonText', 'buttonUrl', 'buttonColor', 'buttonTextColor'].includes(key))
      .map(([key, value]) => `${kebabCase(key)}: ${value};`)
      .join(' ');

    // Add padding styles for non-image and non-spacer blocks
    const paddingStyle = (type === 'image' || type === 'spacer') ? '' : 'padding-left: 12%; padding-right: 12%;';

    switch (type) {
      case 'header':
        blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
          <tr>
            <td style="text-align: ${settings.textAlign || 'left'};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="margin: 0; ${styleString}">
                    <h1 style="margin: 0; ${styleString}; padding: ${settings.padding || '24px 0'}">${content}</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;
        break;
      case 'text':
        blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
          <tr>
            <td style="text-align: ${settings.textAlign || 'left'};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="margin: 0; ${styleString}">
                    <div style="padding: ${settings.padding || '24px 0'}">${content}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;
        break;
      case 'image':
        if (settings.linkUrl) {
          blockHtml = `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
            <tr>
              <td style="text-align: ${settings.textAlign || 'left'};">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td>
                      <a href="${settings.linkUrl}">
                        <img src="${content}" alt="${settings.altText || ''}" style="max-width: 100%; border: 0; display: block;">
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>`;
        } else {
          blockHtml = `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
            <tr>
              <td style="text-align: ${settings.textAlign || 'left'};">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td>
                      <img src="${content}" alt="${settings.altText || ''}" style="max-width: 100%; border: 0; display: block;">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>`;
        }
        break;
      case 'button':
        blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
          <tr>
            <td style="text-align: ${settings.textAlign || 'center'}; padding: ${settings.padding || '10px'}">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <a href="${settings.linkUrl || '#'}" target="_blank" rel="noopener noreferrer">
                      <img src="${settings.imageUrl}" alt="${settings.imageAlt || ''}" style="max-width: 100%; display: block; margin: 0 auto; height: auto; border: 0;">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;
        break;
      case 'buttonGroup':
        const buttonStyle = block.settings.inline ? 'display: inline-block;' : 'display: block;';
        const gapStyle = block.settings.inline ? `margin-right: ${block.settings.gap};` : `margin-bottom: ${block.settings.gap};`;
        
        blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} ${paddingStyle}">
          <tr>
            <td style="text-align: center;">
              ${block.buttons.map((button, index) => `
                <div style="${buttonStyle} ${index < block.buttons.length - 1 ? gapStyle : ''}">
                  <a href="${button.settings.linkUrl || '#'}" target="_blank" rel="noopener noreferrer">
                    <img src="${button.settings.imageUrl}" alt="${button.settings.imageAlt || ''}" style="max-width: 100%; display: block; margin: 0 auto; height: auto; border: 0;">
                  </a>
                </div>
              `).join('')}
            </td>
          </tr>
        </table>`;
        break;
      case 'divider':
        blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="height: ${settings.lineHeight}; background-color: ${settings.lineColor};"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;
        break;
      case 'spacer':
        blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString}">
          <tr>
            <td style="height: ${settings.height};"></td>
          </tr>
        </table>`;
        break;
      case 'columns':
        blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${styleString} padding-left: 12%; padding-right: 12%;">
          <tr>
            <td width="50%">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    ${block.columns[0].settings?.linkUrl 
                      ? `<a href="${block.columns[0].settings.linkUrl}"><img src="${block.columns[0].content}" alt="${block.columns[0].settings?.altText || ''}" style="max-width: 100%; border: 0; display: block;"></a>`
                      : `<img src="${block.columns[0].content}" alt="${block.columns[0].settings?.altText || ''}" style="max-width: 100%; border: 0; display: block;">`
                    }
                  </td>
                </tr>
              </table>
            </td>
            <td width="50%">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    ${block.columns[1].settings?.linkUrl 
                      ? `<a href="${block.columns[1].settings.linkUrl}"><img src="${block.columns[1].content}" alt="${block.columns[1].settings?.altText || ''}" style="max-width: 100%; border: 0; display: block;"></a>`
                      : `<img src="${block.columns[1].content}" alt="${block.columns[1].settings?.altText || ''}" style="max-width: 100%; border: 0; display: block;">`
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>`;
        break;
      case 'halfText':
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

        blockHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              <td>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tbody>
                    <tr>
                      <td style={settings.imagePosition === 'left' ? imageContainerStyle : textContainerStyle}>
                        {settings.imagePosition === 'left' ? (
                          <img
                            src="${block.imageUrl}"
                            alt="${settings.altText || ''}"
                            style="max-width: 100%; border: 0; display: block;"
                          />
                        ) : (
                          <div>
                            <div
                              style={contentStyle}
                              contentEditable={isActive}
                              suppressContentEditableWarning
                              onBlur={(e) => handleUpdateBlockContent(index, e.target.innerHTML)}
                              dangerouslySetInnerHTML={{ __html: content }}
                            />
                            ${settings.showButton ? `
                              <a
                                href="${settings.buttonUrl}"
                                target="_blank"
                                rel="noopener noreferrer"
                                style="display: inline-block; padding: 8px 16px; background-color: ${settings.buttonColor}; color: ${settings.buttonTextColor}; text-decoration: none; border-radius: 4px; margin-top: 16px;">
                                ${settings.buttonText}
                              </a>
                            ` : ''}
                          </div>
                        )}
                      </td>
                      <td style={settings.imagePosition === 'left' ? textContainerStyle : imageContainerStyle}>
                        ${settings.imagePosition === 'left' ? (
                          <div>
                            <div
                              style={contentStyle}
                              contentEditable={isActive}
                              suppressContentEditableWarning
                              onBlur={(e) => handleUpdateBlockContent(index, e.target.innerHTML)}
                              dangerouslySetInnerHTML={{ __html: content }}
                            />
                            ${settings.showButton ? `
                              <a
                                href="${settings.buttonUrl}"
                                target="_blank"
                                rel="noopener noreferrer"
                                style="display: inline-block; padding: 8px 16px; background-color: ${settings.buttonColor}; color: ${settings.buttonTextColor}; text-decoration: none; border-radius: 4px; margin-top: 16px;">
                                ${settings.buttonText}
                              </a>
                            ` : ''}
                          </div>
                        ) : (
                          <img
                            src="${block.imageUrl}"
                            alt="${settings.altText || ''}"
                            style="max-width: 100%; border: 0; display: block;"
                          />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>`;
        break;
      default:
        blockHtml = '';
    }

    return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${settings.backgroundColor};">
      <tr>
        <td>
          ${blockHtml}
        </td>
      </tr>
    </table>`;
  };

  // Convert camelCase to kebab-case for CSS properties
  const kebabCase = (str) => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  };

  // Render block based on type
  const renderBlock = (block, index) => {
    const { type, content, settings } = block;
    const isActive = activeBlockId === block.id;
    const isHovered = hoveredBlockId === block.id;

    // Only show toolbar for the main block, not for nested blocks
    const shouldShowToolbar = isHovered || isActive;
    const isNestedBlock = block.parentId !== undefined;

    const [vertical] = (settings?.padding || '10px').split(' ');
    const isImageOrSpacer = block.type === 'image' || block.type === 'spacer';

    const blockStyle = {
      backgroundColor: settings?.backgroundColor || 'white',
      paddingTop: isImageOrSpacer ? '0' : vertical,
      paddingBottom: isImageOrSpacer ? '0' : vertical,
      paddingLeft: isImageOrSpacer ? '0' : '12%',
      paddingRight: isImageOrSpacer ? '0' : '12%',
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
          <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0">
            <tbody>
              <tr>
                <td style={{ textAlign: settings?.textAlign || 'left' }}>
                  <h1
                    style={contentStyle}
                    contentEditable={isActive}
                    suppressContentEditableWarning
                    onBlur={(e) => handleUpdateBlockContent(index, e.target.innerText)}>
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
          <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0">
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
          <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0">
            <tbody>
              <tr>
                <td style={{ textAlign: settings?.textAlign || 'left' }}>
                  {settings?.linkUrl ? (
                    <a href={settings.linkUrl} target="_blank" rel="noopener noreferrer">
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
                    <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0" style={{ marginTop: '8px' }}>
                      <tbody>
                        <tr>
                          <td>
                            <div className="button-settings">
                            <input
                              type="text"
                              className="settings-input"
                              placeholder="Image URL"
                              value={content}
                              onChange={(e) => handleUpdateBlockContent(index, e.target.value)}
                            />
                             <input
                              type="text"
                              className="settings-input"
                              placeholder="Alt text"
                              value={settings?.altText || ''}
                              onChange={(e) => handleUpdateBlockSettings(index, 'altText', e.target.value)}
                            />
                              <input
                              type="text"
                              className="settings-input"
                              placeholder="Link URL (optional)"
                              value={settings?.linkUrl || ''}
                              onChange={(e) => handleUpdateBlockSettings(index, 'linkUrl', e.target.value)}
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
          <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0">
            <tbody>
              <tr>
                <td style={{ textAlign: settings.textAlign || 'center' }}>
                  <a
                    href={settings.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
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
                    <div className="button-settings">
                      <input
                        type="text"
                        className="settings-input"
                        placeholder="Image URL"
                        value={settings.imageUrl}
                        onChange={(e) => handleUpdateBlockSettings(index, 'imageUrl', e.target.value)}
                      />
                      <input
                        type="text"
                        className="settings-input"
                        placeholder="Alt text"
                        value={settings.imageAlt}
                        onChange={(e) => handleUpdateBlockSettings(index, 'imageAlt', e.target.value)}
                      />
                      <input
                        type="text"
                        className="settings-input"
                        placeholder="Link URL"
                        value={settings.linkUrl}
                        onChange={(e) => handleUpdateBlockSettings(index, 'linkUrl', e.target.value)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        );
        break;
      case 'buttonGroup':
        const buttonContainerStyle = {
          display: 'flex',
          flexDirection: block.settings.inline ? 'row' : 'column',
          gap: block.settings.gap,
          justifyContent: 'center',
        };

        blockContent = (
          <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0">
            <tbody>
              <tr>
                <td style={{ textAlign: 'center' }}>
                  <div style={buttonContainerStyle}>
                    {block.buttons.map((button, buttonIndex) => (
                      <div key={buttonIndex}>
                        <a
                          href={button.settings.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
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
                          <div className="button-settings">
                            <input
                              type="text"
                              className="settings-input"
                              placeholder="Image URL"
                              value={button.settings.imageUrl}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].buttons[buttonIndex].settings.imageUrl = e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type="text"
                              className="settings-input"
                              placeholder="Alt text"
                              value={button.settings.imageAlt}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].buttons[buttonIndex].settings.imageAlt = e.target.value;
                                setTemplate({ ...template, blocks: newBlocks });
                              }}
                            />
                            <input
                              type="text"
                              className="settings-input"
                              placeholder="Link URL"
                              value={button.settings.linkUrl}
                              onChange={(e) => {
                                const newBlocks = [...template.blocks];
                                newBlocks[index].buttons[buttonIndex].settings.linkUrl = e.target.value;
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
      case 'divider':
        blockContent = (
          <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0">
            <tbody>
              <tr>
                <td>
                  <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style={{ height: settings?.lineHeight || '1px', backgroundColor: settings?.lineColor || '#dddddd' }}></td>
                      </tr>
                    </tbody>
                  </table>
                  {isActive && (
                    <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0" className="control-flex margin-top-small">
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="color"
                              className="color-input"
                              value={settings?.lineColor || '#dddddd'}
                              onChange={(e) => handleUpdateBlockSettings(index, 'lineColor', e.target.value)}
                            />
                          </td>
                          <td>
                            <select
                              className="control-select flex-grow"
                              value={settings?.lineHeight || '1px'}
                              onChange={(e) => handleUpdateBlockSettings(index, 'lineHeight', e.target.value)}>
                              <option value="1px">Thin</option>
                              <option value="2px">Medium</option>
                              <option value="3px">Thick</option>
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
          <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0">
            <tbody>
              <tr>
                <td>
                  <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style={{ height: settings?.height || '40px', backgroundColor: settings?.backgroundColor || '#e5e5e5' }}></td>
                      </tr>
                    </tbody>
                  </table>
                  {isActive && (
                    <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0" className="margin-top-small">
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              className="range-input"
                              value={parseInt(settings?.height) || 30}
                              onChange={(e) => handleUpdateBlockSettings(index, 'height', `${e.target.value}px`)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="text-small text-center">
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
          <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0">
            <tbody>
              <tr>
                <td>
                  <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0" className="columns-container">
                    <tbody>
                      <tr>
                        <td width="50%">
                          <img
                            src={block.columns[0].content}
                            alt={block.columns[0].settings?.altText || ''}
                            style={{ maxWidth: '100%', border: '0' }}
                          />
                          {isActive && (
                            <div className="column-settings">
                              <input
                                type="text"
                                className="settings-input"
                                placeholder="Image URL"
                                value={block.columns[0].content}
                                onChange={(e) => {
                                  const newBlocks = [...template.blocks];
                                  newBlocks[index].columns[0].content = e.target.value;
                                  setTemplate({ ...template, blocks: newBlocks });
                                }}
                              />
                              <input
                                type="text"
                                className="settings-input"
                                placeholder="Alt text"
                                value={block.columns[0].settings?.altText || ''}
                                onChange={(e) => {
                                  const newBlocks = [...template.blocks];
                                  newBlocks[index].columns[0].settings.altText = e.target.value;
                                  setTemplate({ ...template, blocks: newBlocks });
                                }}
                              />
                            </div>
                          )}
                        </td>
                        <td width="50%">
                          <img
                            src={block.columns[1].content}
                            alt={block.columns[1].settings?.altText || ''}
                            style={{ maxWidth: '100%', border: '0' }}
                          />
                          {isActive && (
                            <div className="column-settings">
                              <input
                                type="text"
                                className="settings-input"
                                placeholder="Image URL"
                                value={block.columns[1].content}
                                onChange={(e) => {
                                  const newBlocks = [...template.blocks];
                                  newBlocks[index].columns[1].content = e.target.value;
                                  setTemplate({ ...template, blocks: newBlocks });
                                }}
                              />
                              <input
                                type="text"
                                className="settings-input"
                                placeholder="Alt text"
                                value={block.columns[1].settings?.altText || ''}
                                onChange={(e) => {
                                  const newBlocks = [...template.blocks];
                                  newBlocks[index].columns[1].settings.altText = e.target.value;
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
      case 'halfText':
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

        blockContent = (
          <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0">
            <tbody>
              <tr>
                <td>
                  <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style={settings.imagePosition === 'left' ? imageContainerStyle : textContainerStyle}>
                          {settings.imagePosition === 'left' ? (
                            <img
                              src={block.imageUrl}
                              alt={settings.altText || ''}
                              style={{ maxWidth: '100%', border: '0', display: 'block' }}
                            />
                          ) : (
                            <div>
                              <div
                                style={contentStyle}
                                contentEditable={isActive}
                                suppressContentEditableWarning
                                onBlur={(e) => handleUpdateBlockContent(index, e.target.innerHTML)}
                                dangerouslySetInnerHTML={{ __html: content }}
                              />
                              {settings.showButton && (
                                <a
                                  href={settings.buttonUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
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
                        <td style={settings.imagePosition === 'left' ? textContainerStyle : imageContainerStyle}>
                          {settings.imagePosition === 'left' ? (
                            <div>
                              <div
                                style={contentStyle}
                                contentEditable={isActive}
                                suppressContentEditableWarning
                                onBlur={(e) => handleUpdateBlockContent(index, e.target.innerHTML)}
                                dangerouslySetInnerHTML={{ __html: content }}
                              />
                              {settings.showButton && (
                                <a
                                  href={settings.buttonUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
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
                            <img
                              src={block.imageUrl}
                              alt={settings.altText || ''}
                              style={{ maxWidth: '100%', border: '0', display: 'block' }}
                            />
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
        onClick={() => !isNestedBlock && setActiveBlockId(block.id)}>
        <div style={blockStyle}>
          {!showPreview && !isNestedBlock && (
            <div className="block-type-indicator" style={{ color: (type === 'header' || type === 'text') ? settings?.color : undefined }}>
              <GripVertical size={14} className="drag-handle" />
              <div className="block-type-text">{type}</div>
            </div>
          )}

          {!showPreview && shouldShowToolbar && !isNestedBlock && (
            <div className="block-actions">
              <button
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicateBlock(index);
                }}>
                <Copy size={14} className="action-icon" />
              </button>
              <button
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBlock(index);
                }}>
                <Trash2 size={14} className="action-icon" />
              </button>
            </div>
          )}

          {blockContent}

          {!showPreview && isActive && !isNestedBlock && (
            <div className="block-settings">
              <div className="control-flex margin-bottom-small">
                <input
                  type="color"
                  value={settings?.backgroundColor || '#ffffff'}
                  onChange={(e) =>
                    handleUpdateBlockSettings(index, 'backgroundColor', e.target.value)
                  }
                  className="color-input"
                />
                {(type === 'header' || type === 'text' || type === 'halfText') && (
                  <>
                    <input
                      type="color"
                      value={settings?.color || '#000000'}
                      onChange={(e) =>
                        handleUpdateBlockSettings(index, 'color', e.target.value)
                      }
                      className="color-input"
                    />
                    <select
                      className="control-select"
                      value={settings?.fontSize}
                      onChange={(e) =>
                        handleUpdateBlockSettings(index, 'fontSize', e.target.value)
                      }>
                      <option value="8px">8px</option>
                      <option value="16px">16px</option>
                      <option value="24px">24px</option>
                      <option value="32px">32px</option>
                      <option value="40px">40px</option>
                      <option value="48px">48px</option>
                    </select>
                  </>
                )}
                <select
                  className="control-select flex-grow"
                  value={settings?.padding}
                  onChange={(e) =>
                    handleUpdateBlockSettings(index, 'padding', e.target.value)
                  }>
                  <option value="0px">No padding</option>
                  <option value="16px 0">Small padding</option>
                  <option value="24px 0">Medium padding</option>
                  <option value="40px 0">Large padding</option>
                </select>
                {(type === 'header' || type === 'text' || type === 'image' || type === 'halfText') && (
                  <select
                    className="control-select"
                    value={settings?.textAlign}
                    onChange={(e) =>
                      handleUpdateBlockSettings(index, 'textAlign', e.target.value)
                    }>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                )}
                {type === 'halfText' && (
                  <>
                    <select
                      className="control-select"
                      value={settings?.imagePosition}
                      onChange={(e) =>
                        handleUpdateBlockSettings(index, 'imagePosition', e.target.value)
                      }>
                      <option value="left">Image Left</option>
                      <option value="right">Image Right</option>
                    </select>
                    <select
                      className="control-select"
                      value={settings?.imageWidth}
                      onChange={(e) =>
                        handleUpdateBlockSettings(index, 'imageWidth', e.target.value)
                      }>
                      <option value="30%">30% Width</option>
                      <option value="40%">40% Width</option>
                      <option value="50%">50% Width</option>
                    </select>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id={`showButton-${block.id}`}
                        checked={settings?.showButton}
                        onChange={(e) =>
                          handleUpdateBlockSettings(index, 'showButton', e.target.checked)
                        }
                      />
                      <label htmlFor={`showButton-${block.id}`}>Show Button</label>
                    </div>
                  </>
                )}
              </div>
              {type === 'halfText' && settings?.showButton && (
                <div className="control-flex margin-bottom-small">
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="Button Text"
                    value={settings?.buttonText}
                    onChange={(e) =>
                      handleUpdateBlockSettings(index, 'buttonText', e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="Button URL"
                    value={settings?.buttonUrl}
                    onChange={(e) =>
                      handleUpdateBlockSettings(index, 'buttonUrl', e.target.value)
                    }
                  />
                  <input
                    type="color"
                    value={settings?.buttonColor}
                    onChange={(e) =>
                      handleUpdateBlockSettings(index, 'buttonColor', e.target.value)
                    }
                    className="color-input"
                  />
                  <input
                    type="color"
                    value={settings?.buttonTextColor}
                    onChange={(e) =>
                      handleUpdateBlockSettings(index, 'buttonTextColor', e.target.value)
                    }
                    className="color-input"
                  />
                </div>
              )}
              {type === 'halfText' && (
                <div className="control-flex margin-bottom-small">
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="Image URL"
                    value={block.imageUrl}
                    onChange={(e) => {
                      const newBlocks = [...template.blocks];
                      newBlocks[index].imageUrl = e.target.value;
                      setTemplate({ ...template, blocks: newBlocks });
                    }}
                  />
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="Alt text"
                    value={settings?.altText || ''}
                    onChange={(e) =>
                      handleUpdateBlockSettings(index, 'altText', e.target.value)
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
              onDragStart={(e) => handleDragStart(e, component, true)}>
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
                  handleUpdateTemplateSetting('title', e.target.value)
                }
                className='settings-input full-width'
                placeholder='Enter template title'
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
            <button className='toolbar-button primary' onClick={handleSaveTemplate}>
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Pre-header Section */}
        <div className='pre-header'>
          <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" border="0" style={{ width: '100%', margin: '0 auto', padding: '0', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td style={{ padding: '20px' }} align="left" valign="middle">
                  <span style={{ 
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    fontSize: '12px',
                    textAlign: 'center',
                    color: '#000000',
                    margin: '0',
                    marginBottom: '6px',
                    lineHeight: '1.1'
                  }}>
                    {template.title || 'Untitled Email Template'}
                  </span>
                </td>
                <td style={{ padding: '20px' }} valign="middle" align="right">
                  <a 
                    href="#"
                    _label="Mirror Page"
                    _type="mirrorPage"
                    style={{
                      color: '#000000',
                      textDecoration: 'underline',
                      fontSize: '12px'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      const htmlOutput = generateHtmlOutput();
                      const blob = new Blob([htmlOutput], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      window.open(url, '_blank');
                    }}
                  >
                    View in Browser →
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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
              <pre className='code-output'>{generateHtmlOutput()}</pre>
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
                handleDrop(e, dragOverIndex ?? template.blocks.length);
                setDragOverIndex(null);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragOverIndex(null);
              }}
              style={{ width: '640px' }}>
              {template.blocks.map((block, index) => (
                <React.Fragment key={block.id}>
                  {/* show indicator above the block */}
                  {dragOverIndex === index && (
                    <div className='drop-indicator' />
                  )}
                  {renderBlock(block, index)}
                </React.Fragment>
              ))}

              {/* Drop placeholder for empty state */}
              {template.blocks.length === 0 && (
                <div
                  className='empty-placeholder'
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, 0)}>
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
                    handleDragOver(e, template.blocks.length)
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
