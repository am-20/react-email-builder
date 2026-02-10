import React from 'react';

const tableProps = {
  role: 'presentation',
  width: '100%',
  cellSpacing: '0',
  cellPadding: '0',
  border: '0',
};

/**
 * SpacerBlock - Renders a vertical spacer with configurable height
 * Matches the exact nested table structure from the original code
 */
const SpacerBlock = ({ settings }) => {
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
                      backgroundColor: settings?.backgroundColor || '#e5e5e5',
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
};

export default SpacerBlock;
