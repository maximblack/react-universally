import { addLocaleData } from 'react-intl'
import areIntlLocalesSupported from 'intl-locales-supported';

export function formatTranslationMessage ({id, defaultMessage, message}) {
  return {
    [id]: message || defaultMessage
  }
}

export function formatTranslationMessages (messages) {
  return Object.keys(messages)
    .map((key) => formatTranslationMessage(messages[key]))
    .reduce((map, message) => ({...map, ...message}), {})
}

export function getLocaleData (locale) {
  const messages = getTranslationMessages(locale)

  return {locale, messages}
}

/*export function getTranslationMessages (locale) {
  let formattedMessages = {}
  let messages

  try {
    messages = require(`../../translations/${locale}.json`)
    formattedMessages = formatTranslationMessages(messages)
  } catch (e) {
    // TODO
    // throw error when e.code !== 'MODULE_NOT_FOUND'
    // or e.message.indexOf('translations/' + locale) === -1
    console.warn('locale does not exists or something is wrong ' +
      'with translations/' + locale, e)
  }

  return formattedMessages
}*/

export function polyfillIntlApi (locale) {
  return import('intl')
    .then(() => import(`../../locale-data/intl/${locale}`))
}

export function polyfillNodeIntlApi (locale) {
  if (!global.Intl) {
    global.Intl = require('intl')
  } else {
    if (!areIntlLocalesSupported([].concat(locale))) {
      const IntlPolyfill = require('intl');
      Intl.NumberFormat   = IntlPolyfill.NumberFormat
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
    }
  }
}

export function registerLocaleData (locale) {
  import(`../../locale-data/react-intl/${locale}`).then((localeData) => {
    addLocaleData(localeData)
  })
}
