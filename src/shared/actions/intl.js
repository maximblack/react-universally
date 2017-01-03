/* @flow */
/* eslint-disable import/prefer-default-export */

import ms from 'ms';
import type { Language } from '../types/model';
import type { Action, ThunkAction } from '../types/redux';
import { selectLoadedMessages } from '../reducers/intl';
import { formatTranslationMessages, registerLocaleData } from '../utils/intl';
import { safeConfigGet } from '../utils/config';

const LOCALE_KEY = safeConfigGet(['cookies', 'localeName']);
const LOCALE_MAX_AGE = ms(safeConfigGet(['cookies', 'localeMaxAge'])) / 1000;

function setLocaleStart(locale: string) : Action {
  return { type: 'SET_LOCALE_START', payload: locale };
}

function setLocaleSuccess(locale: Language, withMessages: bool = true) : Action {
  return {
    type: 'SET_LOCALE_SUCCESS',
    payload: {
      ...locale,
      withMessages,
    },
  };
}

export function setAvailableLocales(locales: string[]) : Action {
  return { type: 'SET_AVAILABLE_LOCALES', payload: locales };
}

export function setLocale(locale: string) : ThunkAction {
  return (dispatch, getState, { axios }) => {
    dispatch(setLocaleStart(locale));

    // Check if not loaded previously
    const loadedMessages = selectLoadedMessages()(getState());
    if (loadedMessages.includes(locale)) {
      return dispatch(setLocaleSuccess({
        locale,
      }, false));
    }

    let messages;
    return axios
      .get(`http://${safeConfigGet(['host'])}:${safeConfigGet(['port'])}/getTranslations/${locale}`)
      .then(({ data }) => (messages = data) && registerLocaleData(locale))
      .then(() => dispatch(
        setLocaleSuccess({
          locale,
          messages: formatTranslationMessages(messages),
        }),
      ))
      .then(() => {
        if (process.env.IS_CLIENT) {
          document.cookie = `${LOCALE_KEY}=${locale};path=/;max-age=${LOCALE_MAX_AGE}`;
        }
      });
  };
}
