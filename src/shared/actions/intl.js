/* @flow */
/* eslint-disable import/prefer-default-export */

import type { Language } from '../types/model';
import type { Action, ThunkAction } from '../types/redux';
import { formatTranslationMessages } from '../utils/intl';
import { safeConfigGet } from '../utils/config';

function setLocaleStart(locale: string) : Action {
  return { type: 'SET_LOCALE_START', payload: locale };
}

function setLocaleSuccess(locale: Language) : Action {
  return { type: 'SET_LOCALE_SUCCESS', payload: locale };
}

export function setAvailableLocales(locales: string[]) : Action {
  return { type: 'SET_AVAILABLE_LOCALES', payload: locales };
}

export function setLocale(locale: string) : ThunkAction {
  return (dispatch, getState, { axios }) => {
    dispatch(setLocaleStart(locale));

    return axios
      .get(`http://${safeConfigGet(['host'])}:${safeConfigGet(['port'])}/getTranslations/${locale}`)
      .then(({ data }) => dispatch(
        setLocaleSuccess({
          locale,
          messages: formatTranslationMessages(data)
        })
      )).then(() => {
        if (process.env.IS_CLIENT) {
          const maxAge = 3650 * 24 * 3600; // 10 years in seconds
          document.cookie = `lang=${locale};path=/;max-age=${maxAge}`;
        }
      });

  };
}
