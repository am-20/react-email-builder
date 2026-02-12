/**
 * Email footer translations for different languages
 * Used in footer blocks for multi-language support
 */

/**
 * Kazakh translations (KZ)
 */
export const translationsKZ = {
  questions: 'Сұрақтарыңыз бар ма?',
  disclaimer:
    'Сіз Samsung хабарламаларының таратылымына жазылғандықтан осы хатты алдыңыз. Осы хатқа жауап қайтармаңыз. Бұл автоматты түрде жолданатын хабарлама. Біздің хабарламаларымызды алудан бас тарту үшін, осы ',
  link: 'сілтеме',
  disclaimer_end: 'арқылы өтуіңізді сұраймыз',
  all_rights: ' Барлық құқықтар қорғалған.',
  address:
    'ТОО «SAMSUNG ELECTRONICS CENTRAL EURASIA» ЖШС (САМСУНГ ЭЛЕКТРОНИКС ОРТАЛЫҚ ЕУРАЗИЯ) Қазақстан Республикасы, Алматы қ., 050000, Желтоқсан көшесі, 115 үй, «Kaisar Plaza» сауда-кеңсе орталығы, 3-қабат.',
  legal: 'Құқықтық ақпарат',
  privacy: 'Құпиялылық саясаты',
};

/**
 * Russian translations (RU)
 */
export const translationsRU = {
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
};

/**
 * Get translations for a specific language
 * @param {string} lang - Language code ('kz' or 'ru')
 * @returns {object} Translation object
 */
export const getTranslations = (lang) => {
  return lang === 'kz' ? translationsKZ : translationsRU;
};
