import React from 'react';

const PreHeader = ({ template = {}, onViewInBrowser }) => {
  const title = template?.title || 'Untitled Email Template';
  const titleLabel = template?.titleLinkLabel;
  const unsubLabel = template?.titleLinkLabelUnsub || '';
  const unsubHref =
    '<%@ include option="NmsServer_URL" %>/webApp/smgUnsub?id=<%= escapeUrl(recipient.cryptedId)%>&lang=sece_ru';

  return (
    <div className='pre-header'>
      <table
        role='presentation'
        width='100%'
        cellSpacing='0'
        cellPadding='0'
        border='0'
        style={{
          width: '100%',
          margin: '0 auto',
          padding: 0,
          textAlign: 'center',
        }}>
        <tbody>
          <tr>
            {/* Left: Title */}
            <td align='left' valign='middle' style={{ padding: 20 }}>
              <span
                style={{
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  fontSize: 12,
                  color: '#000',
                  lineHeight: 1.1,
                  margin: 0,
                  display: 'inline-block',
                }}>
                <span {...(titleLabel ? { _label: titleLabel } : {})}>
                  {title}
                </span>
              </span>
            </td>

            {/* Middle/Right: View in Browser */}
            <td align='right' valign='middle' style={{ padding: 20 }}>
              <a
                href='#'
                _label='Mirror Page'
                _type='mirrorPage'
                style={{
                  color: '#000',
                  textDecoration: 'underline',
                  fontSize: 12,
                }}
                onClick={(e) => {
                  if (onViewInBrowser) onViewInBrowser(e);
                  else e.preventDefault();
                }}>
                View in Browser →
              </a>
            </td>

            {/* Right: Unsubscribe */}
            <td
              align='right'
              valign='middle'
              style={{ padding: '20px 20px 20px 0' }}>
              <a
                href={unsubHref}
                _type='optout'
                _label={unsubLabel}
                style={{
                  fontSize: 12,
                  color: '#000',
                  textDecoration: 'underline',
                }}>
                Отписаться
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PreHeader;
