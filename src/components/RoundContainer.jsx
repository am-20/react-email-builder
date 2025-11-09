import React from 'react';

export default function RoundContainer({
  index,
  block,
  settings,
  renderChild,                // (child, childIndex, parentIndex) => JSX
  handleUpdateBlockSettings,  // (blockIndex, key, value) => void
  onAddChild,                 // (parentIndex, type) => void
}) {
  const {
    canvasColor = '#CFCFCF',
    backgroundColor = '#FFFFFF',
    bgWidth = 88,                // percent
    borderColor = '#FFFFFF',
    borderWidth = 3,             // px
    borderType = 'solid',        // solid | dashed | dotted
    borderRadius = 24,           // px
    paddingTop = 8,              // px (outer, before the round table)
    paddingBottom = 8,           // px (outer, after the round table)
    paddingInnerTop = 64,        // px
    paddingInnerBottom = 64,     // px
  } = settings || {};

  // Basic inline styles to keep the preview email-safe
  const outerTDStyle = {
    backgroundColor: canvasColor,
    paddingTop: `${paddingInnerTop}px`,
    paddingBottom: `${paddingInnerBottom}px`,
    msoLineHeightRule: 'exactly',
  };

  const innerTableStyle = {
    borderCollapse: 'separate',
    border: `${borderWidth}px ${borderType} ${borderColor}`,
    borderRadius: `${borderRadius}px`,
    margin: '0 auto',
    width: `${bgWidth}%`,
    padding: 0,
    textAlign: 'center',
    backgroundColor,
  };

  const editorHintStyle = {
    fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
    fontSize: 12,
    color: '#666',
  };

// add near top inside RoundContainer
const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try { e.dataTransfer.dropEffect = 'copy'; } catch {}
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    // Support the common keys your toolbar might set:
    const type =
      e.dataTransfer.getData('text/block-type') ||
      e.dataTransfer.getData('application/x-block-type') ||
      e.dataTransfer.getData('text/plain');
  
    if (!type) return;
    onAddChild?.(index, type);
  };
  

  return (
    <>
      {paddingTop > 0 && (
        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
          <tbody>
            <tr>
              <td style={{ height: paddingTop, fontSize: 0, backgroundColor: canvasColor, border: 0 }}>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      )}

      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style={{ backgroundColor: canvasColor }}>
        <tbody>
          <tr>
            <td style={outerTDStyle}>
              <table role="presentation" align="center" cellPadding="0" cellSpacing="0" border="0" style={innerTableStyle}>
                <tbody>
                  <tr>
                  <td
                    data-round-container-content
                    style={{ padding: 0, position: 'relative' }}
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDragOver={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      try { e.dataTransfer.dropEffect = 'copy'; } catch {} 
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const type =
                        e.dataTransfer.getData('text/block-type') ||
                        e.dataTransfer.getData('application/x-block-type') ||
                        e.dataTransfer.getData('text/plain');
                        if (!type) return;
                        onAddChild?.(index, type);
                    }}
                    >
                    {Array.isArray(block.children) && block.children.length > 0 ? (
                      <>
                        {block.children.map((child, childIndex) => (
                          <React.Fragment key={child.id || childIndex}>
                            {/* Drop zone before each child */}
                            <div
                              data-round-container-content
                              style={{
                                minHeight: '20px',
                                padding: '4px 0',
                                position: 'relative',
                                zIndex: 10,
                              }}
                              onDragEnter={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.style.backgroundColor = 'rgba(66, 153, 225, 0.1)';
                              }}
                              onDragLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                try { e.dataTransfer.dropEffect = 'copy'; } catch {}
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.style.backgroundColor = 'transparent';
                                const type =
                                  e.dataTransfer.getData('text/block-type') ||
                                  e.dataTransfer.getData('application/x-block-type') ||
                                  e.dataTransfer.getData('text/plain');
                                if (!type) return;
                                onAddChild?.(index, type, childIndex);
                              }}                              
                            />
                            {renderChild(child, childIndex, index)}
                          </React.Fragment>
                        ))}
                        {/* Drop zone after last child */}
                        <div
                          data-round-container-content
                          style={{
                            minHeight: '20px',
                            padding: '4px 0',
                            position: 'relative',
                            zIndex: 10,
                          }}
                          onDragEnter={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.backgroundColor = 'rgba(66, 153, 225, 0.1)';
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            try { e.dataTransfer.dropEffect = 'copy'; } catch {}
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.style.backgroundColor = 'transparent';
                            const type =
                              e.dataTransfer.getData('text/block-type') ||
                              e.dataTransfer.getData('application/x-block-type') ||
                              e.dataTransfer.getData('text/plain');
                            if (!type) return;
                            const endIndex = Array.isArray(block.children) ? block.children.length : 0;
                            onAddChild?.(index, type, endIndex);
                          }}
                        />
                      </>
                    ) : (
                        <div data-round-container-content style={{ padding: 24, textAlign: 'center' }}>
                        <div style={{
                            fontFamily: 'SamsungOne, Arial, Helvetica, sans-serif',
                            fontSize: 12, color: '#666'
                        }}>
                            RoundContainer is empty. Drop components here or use the button below.
                        </div>
                        <button
                            type='button'
                            onClick={() => onAddChild?.(index, 'text')}
                            style={{
                            marginTop: 12,
                            background: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: 6,
                            padding: '6px 12px',
                            cursor: 'pointer',
                            }}
                        >
                            + Add Text Component
                        </button>
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

      {paddingBottom > 0 && (
        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
          <tbody>
            <tr>
              <td style={{ height: paddingBottom, fontSize: 0, backgroundColor: canvasColor, border: 0 }}>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}
