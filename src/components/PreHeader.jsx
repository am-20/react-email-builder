import React from 'react';

const PreHeader = ({ template, onViewInBrowser }) => {
  return (
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
                {template.titleLinkLabel ? (
                  <a href="#" _label={template.titleLinkLabel} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {template.title || 'Untitled Email Template'}
                  </a>
                ) : (
                  template.title || 'Untitled Email Template'
                )}
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
                onClick={onViewInBrowser}
              >
                View in Browser →
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PreHeader; 