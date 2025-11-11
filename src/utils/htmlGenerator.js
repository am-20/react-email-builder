// HTML generation utilities

const inlineStyles = `
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

  /* Email-specific styles */
  .email-container {
    max-width: 640px;
    margin: 0 auto;
    background-color: #ffffff;
  }
  .pre-header {
    display: none;
    max-height: 0px;
    overflow: hidden;
  }
  .pre-header:active {
    max-height: none;
  }
`;

export const generateHtmlOutput = (template, renderBlockHtml) => {
  // Generate pre-header text
  const preHeaderText = template.title || 'View this email in your browser';

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${template.title || 'Email Template'}</title>
  <style type="text/css">
    ${inlineStyles}
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <!-- Pre-header -->
  <div class="pre-header" style="display: none; max-height: 0px; overflow: hidden;">
    ${preHeaderText}
  </div>
  <div class="pre-header" style="display: none; max-height: 0px; overflow: hidden;">
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <!-- Email wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td align="center">
        <!-- Email container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="640px" style="margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td>
              <!-- Header with title and view in browser link -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0 auto;padding:0;text-align:center;font-family: SamsungOne, Arial, Helvetica, sans-serif;background-color: #f5f5f5;">
                <tr>
                  <td style="padding: 20px;" align="left" valign="middle">
                    <span style="font-family: Arial, Helvetica, sans-serif;font-size:12px;text-align:center;color:#000000;margin:0;margin-bottom:6px;line-height:1.1;" ${
                      template.titleLinkLabel
                        ? `_label="${template.titleLinkLabel}"`
                        : ''
                    }>
                      ${template.title || 'Untitled Email Template'}
                    </span>
                  </td>
                  <td style="padding: 20px;" valign="middle" align="right">
                    <a href="#" onclick="window.open(URL.createObjectURL(new Blob([document.documentElement.outerHTML], { type: 'text/html' })), '_blank')" _label="Mirror Page" _type="mirrorPage" style="color:#000000;text-decoration:underline;font-size:12px;">View in Browser →</a>
                  </td>
                  <td style="padding: 20px 20px 20px 0;" valign="right" align="right">
                    <a style="font-size:12px;color:#000000;text-decoration:underline;" href="<%@ include option='NmsServer_URL' %>/webApp/smgUnsub?id=<%= escapeUrl(recipient.cryptedId)%>&lang=sece_ru" _type="optout" _label="${
                      template.titleLinkLabelUnsub
                    }">Отписаться</a>
                  </td>
                </tr>
              </table>

              <!-- Email content -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                ${template.blocks
                  .map((block) => renderBlockHtml(block, template))
                  .join('')}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export function generateRoundContainerHTML(block, ctx) {
  const s = block.settings || {};

  const canvasColor = s.canvasColor || '#CFCFCF';
  const backgroundColor = s.backgroundColor || '#FFFFFF';
  const bgWidth = Number(s.bgWidth ?? 88);
  const borderColor = s.borderColor || '#FFFFFF';
  const borderWidth = Number(s.borderWidth ?? 3);
  const borderType = s.borderType || 'solid';
  const borderRadius = Number(s.borderRadius ?? 24);
  const paddingTop = Number(s.paddingTop ?? 8);
  const paddingBottom = Number(s.paddingBottom ?? 8);
  const paddingInnerTop = Number(s.paddingInnerTop ?? 64);
  const paddingInnerBottom = Number(s.paddingInnerBottom ?? 64);

  // helper: children html
  const childrenHTML = (Array.isArray(block.children) ? block.children : [])
    .map((child) => ctx.generateBlockHTML(child, ctx)) // assumes you pass ctx with generateBlockHTML
    .join('');

  const topPadRow =
    paddingTop > 0
      ? `<tr><td style="mso-line-height-rule:exactly;height:${paddingTop}px;font-size:0;border:0;background-color:${canvasColor}" bgcolor="${canvasColor}" height="${paddingTop}">&nbsp;</td></tr>`
      : '';

  const bottomPadRow =
    paddingBottom > 0
      ? `<tr><td style="mso-line-height-rule:exactly;height:${paddingBottom}px;font-size:0;border:0;background-color:${canvasColor}" bgcolor="${canvasColor}" height="${paddingBottom}">&nbsp;</td></tr>`
      : '';

  return `
${topPadRow}
<tr>
  <td style="border:0;margin:0 auto;mso-line-height-rule:exactly;background-color:${canvasColor};padding-top:${paddingInnerTop}px;padding-bottom:${paddingInnerBottom}px;">
    <table align="center" cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:separate;border:${borderWidth}px ${borderType} ${borderColor};
             border-radius:${borderRadius}px;margin:0 auto;width:${bgWidth}%;
             padding:0;text-align:center;background-color:${backgroundColor};">
      <tbody>
        <tr>
          <td style="padding:0;">
            ${childrenHTML}
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>
${bottomPadRow}
`.trim();
}
