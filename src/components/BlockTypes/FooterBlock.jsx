import React from 'react';
import { getImagePath, socialIcons } from '../../utils/imageUtils';

const tableProps = {
  role: 'presentation',
  width: '100%',
  cellSpacing: '0',
  cellPadding: '0',
  border: '0',
};

const LANGUAGE_STRINGS = {
  ru: {
    questions: 'Есть вопросы?',
    disclaimer:
      'Вы получили это письмо, потому что подписались на рассылку Samsung. Не отвечайте на данное письмо. Оно является автоматической рассылкой. Чтобы отказаться от получения наших рассылок, пожалуйста, перейдите по этой ',
    link: 'ссылке',
    disclaimer_end: '',
    all_rights: ' Все права защищены.',
    address:
      'ТОО «SAMSUNG ELECTRONICS CENTRAL EURASIA» (САМСУНГ ЭЛЕКТРОНИКС ЦЕНТРАЛЬНАЯ ЕВРАЗИЯ) Республика Казахстан, г. Алматы, 050000, улица Желтоксан, д. 115, Торгово-офисный центр «Kaisar Plaza», 3 этаж.',
    legal: 'Правовая информация',
    privacy: 'Политика конфиденциальности',
  },
  kz: {
    questions: 'Сұрақтарыңыз бар ма?',
    disclaimer:
      'Сіз Samsung хабарламаларының таратылымына жазылғандықтан осы хатты алдыңыз. Осы хатқа жауап қайтармаңыз. Бұл автоматты түрде жолданатын хабарлама. Біздің хабарламаларымызды алудан бас тарту үшін, осы ',
    link: 'сілтеме',
    disclaimer_end: ' арқылы өтуіңізді сұраймыз',
    all_rights: ' Барлық құқықтар қорғалған.',
    address:
      'ТОО «SAMSUNG ELECTRONICS CENTRAL EURASIA» ЖШС (САМСУНГ ЭЛЕКТРОНИКС ОРТАЛЫҚ ЕУРАЗИЯ) Қазақстан Республикасы, Алматы қ., 050000, Желтоқсан көшесі, 115 үй, «Kaisar Plaza» сауда-кеңсе орталығы, 3-қабат.',
    legal: 'Құқықтық ақпарат',
    privacy: 'Құпиялылық саясаты',
  },
};

const socials = [
  ['facebook', 'Facebook'],
  ['instagram', 'Instagram'],
  ['vkontakte', 'VK'],
  ['youtube', 'YouTube'],
  ['twitter', 'Twitter'],
  ['linkedin', 'LinkedIn'],
];

/**
 * FooterBlock - Renders Samsung footer with social links, contact info, and legal text
 * Supports both Russian (ru) and Kazakh (kz) languages
 */
const FooterBlock = React.memo(function FooterBlock({ type, settings }) {
  const canvas = settings?.canvascolor || '#f5f5f5';
  const text = settings?.textcolor || '#000000';
  const disclaimer = settings?.disclaimercolor || '#555555';
  const urls = settings?.urls || {};
  const lang = type === 'footer_general_kz' ? 'kz' : 'ru';
  const dict = LANGUAGE_STRINGS[lang];

  return (
    <table {...tableProps}>
      <tbody>
        <tr>
          <td
            style={{
              height: 50,
              fontSize: 0,
              lineHeight: 0,
              backgroundColor: canvas,
            }}>
            &nbsp;
          </td>
        </tr>

        {/* Socials */}
        <tr>
          <td style={{ backgroundColor: canvas }} align='center'>
            <table
              {...tableProps}
              style={{ width: '100%', margin: 0, padding: 0 }}>
              <tbody>
                <tr>
                  <td style={{ width: 120 }}>&nbsp;</td>
                  {socials.map(([key, alt]) => (
                    <td key={key} style={{ padding: '0 16px' }}>
                      <a href={urls?.[key] || '#'} title='Samsung Kazakhstan'>
                        <img
                          width='57'
                          src={getImagePath(socialIcons[key])}
                          alt={alt}
                          style={{ display: 'block', border: 0 }}
                        />
                      </a>
                    </td>
                  ))}
                  <td style={{ width: 120 }}>&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        {/* Contact */}
        <tr>
          <td
            style={{
              backgroundColor: canvas,
              textAlign: 'center',
              paddingTop: 16,
              paddingLeft: '10%',
              paddingRight: '10%',
            }}>
            <h1
              style={{
                margin: '0 0 13px 0',
                fontFamily: settings?.fontFamily || 'Arial, sans-serif',
                fontSize: 24,
                fontWeight: 'bold',
                color: text,
                lineHeight: 1,
              }}>
              {dict.questions}
            </h1>
            <table
              {...tableProps}
              style={{
                width: 'auto',
                margin: '0 auto',
                textAlign: 'center',
                color: text,
              }}>
              <tbody>
                <tr>
                  <td align='center' style={{ padding: 7 }}>
                    <a
                      href={urls?.livechat || '#'}
                      style={{
                        fontFamily: settings?.fontFamily || 'Arial, sans-serif',
                        fontSize: 11,
                        color: text,
                        textDecoration: 'none',
                      }}>
                      <img
                        width='11'
                        src={getImagePath(socialIcons['livechat'])}
                        alt='online chat'
                      />{' '}
                      Онлайн чат
                    </a>
                  </td>
                  <td align='center' style={{ padding: 7 }}>
                    <a
                      href={urls?.call || '#'}
                      style={{
                        fontFamily: settings?.fontFamily || 'Arial, sans-serif',
                        fontSize: 11,
                        color: text,
                        textDecoration: 'none',
                      }}>
                      <img
                        width='11'
                        src={getImagePath(socialIcons['call'])}
                        alt='call center'
                      />{' '}
                      Call Center 7700
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        {/* Legal */}
        <tr>
          <td style={{ backgroundColor: canvas }} align='center'>
            <table
              {...tableProps}
              style={{
                width: 500,
                margin: '0 auto',
                textAlign: 'center',
                color: disclaimer,
              }}>
              <tbody>
                <tr>
                  <td style={{ height: 26 }}>&nbsp;</td>
                </tr>
                <tr>
                  <td
                    style={{
                      fontSize: 14,
                      color: disclaimer,
                      fontFamily: settings?.fontFamily || 'Arial, sans-serif',
                    }}>
                    <p>
                      {dict.disclaimer}
                      {urls?.optout ? (
                        <a
                          href={urls.optout}
                          style={{
                            textDecoration: 'underline',
                            color: disclaimer,
                          }}>
                          {dict.link}
                        </a>
                      ) : (
                        dict.link
                      )}
                      {dict.disclaimer_end}.
                    </p>
                    <br />©{new Date().getFullYear()} Samsung Electronics Co.,
                    Ltd. {dict.all_rights}
                    <br />
                    {dict.address}
                  </td>
                </tr>
                <tr>
                  <td style={{ height: 24 }}>&nbsp;</td>
                </tr>
                <tr>
                  <td
                    style={{
                      height: 24,
                      fontSize: 14,
                      fontFamily: settings?.fontFamily || 'Arial, sans-serif',
                    }}>
                    <a
                      href={urls?.legal || '#'}
                      style={{
                        fontSize: 14,
                        color: settings?.textcolor || '#000',
                        textDecoration: 'underline',
                      }}>
                      {dict.legal}
                    </a>
                    &nbsp;|&nbsp;
                    <a
                      href={urls?.privacy || '#'}
                      style={{
                        fontSize: 14,
                        color: settings?.textcolor || '#000',
                        textDecoration: 'underline',
                      }}>
                      {dict.privacy}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ height: 115 }}>&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
});

export default FooterBlock;
