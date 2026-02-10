import React from 'react';

const tableProps = {
  role: 'presentation',
  width: '100%',
  cellSpacing: '0',
  cellPadding: '0',
  border: '0',
};

/**
 * DividerBlock - Renders a horizontal divider line
 * Matches the exact nested table structure from the original code
 */
const DividerBlock = ({ settings }) => {
  return (
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
};

export default DividerBlock;
