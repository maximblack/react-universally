/* @flow */
/* eslint-disable import/prefer-default-export */

import { addLocaleData } from 'react-intl'
import type { Language } from '../types/model';
import type { Action, ThunkAction } from '../types/redux';

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

    const messages = {
      'app.header.test': 'Testing locales, ' + locale
    };

    const localeData = require(`../../locale-data/react-intl/${locale}`)
    addLocaleData(localeData);

    dispatch(setLocaleSuccess({
      locale,
      messages
    }));

    /*return axios
      .get(`getLocale/${locale}`)
      .then(({ data }) => dispatch(setLocaleEnd(data)));*/
  };
}
