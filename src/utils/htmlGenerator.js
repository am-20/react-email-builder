// HTML generation utilities

export const generateHtmlOutput = (template, renderBlockHtml) => {
  return `
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
}; 