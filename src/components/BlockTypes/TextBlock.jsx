import React from 'react';

const tableProps = {
  role: 'presentation',
  width: '100%',
  cellSpacing: '0',
  cellPadding: '0',
  border: '0',
};

/**
 * TextBlock - Renders editable text content using contentEditable
 * Matches the exact structure and behavior from the original code
 */
const TextBlock = ({
  content,
  settings,
  index,
  isActive,
  contentStyle,
  handleUpdateBlockContent,
}) => {
  return (
    <table {...tableProps}>
      <tbody>
        <tr>
          <td style={{ textAlign: settings?.textAlign || 'left' }}>
            <p
              style={{ ...contentStyle, padding: '8px 0' }}
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
};

export default TextBlock;
