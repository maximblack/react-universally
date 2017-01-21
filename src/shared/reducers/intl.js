/* @flow */

import { createSelector } from 'reselect';
import type { Reducer } from 'redux';
import type { Action } from '../types/redux';
import type { Language } from '../types/model';

// -----------------------------------------------------------------------------
// EXPORTED REDUCER STATE TYPE

export type State = { [locale: { key: string }]: Language };

// -----------------------------------------------------------------------------
// PRIVATES

export const KEY = 'intl';
export const LOCALE_KEY = 'locale';
export const AVAILABLE_LOCALES_KEY = 'available_locales';
export const MESSAGES_KEY = 'messages';

const defaultState = {
  initialNow: Date.now(),
};

// -----------------------------------------------------------------------------
// REDUCER

function intl(state: State = defaultState, action: Action) : State {
  switch (action.type) {
    case 'SET_AVAILABLE_LOCALES':
      return Object.assign({}, state, {
        [AVAILABLE_LOCALES_KEY]: action.payload,
      });
    case 'SET_LOCALE_START':
      const locale = state[action.payload] ? action.payload : state.locale;
      return Object.assign({}, state, {
        locale,
        newLocale: action.payload,
      });
    case 'SET_LOCALE_SUCCESS':
      return Object.assign({}, state, {
        locale: action.payload.locale,
        newLocale: null,
        messages: {
          ...state.messages,
          ...(action.payload.withMessages ? {
            [action.payload.locale]: action.payload.messages,
          } : {}),
        },
      });
    case 'SET_LOCALE_ERROR':
      return Object.assign({}, state, {
        newLocale: null,
      });
    default:
  }
  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export const selectIntlState = () => (state: State) => state[KEY];

export const selectAvailableLanguages = () => createSelector(
  selectIntlState(),
  subState => subState[AVAILABLE_LOCALES_KEY],
);

export const selectIntlLocale = () => createSelector(
  selectIntlState(),
  subState => subState[LOCALE_KEY],
);

export const selectLoadedMessages = () => createSelector(
  selectIntlState(),
  (subState) => {
    const loadedMessages = subState[MESSAGES_KEY] || {};
    return Object.keys(loadedMessages);
  },
);

// -----------------------------------------------------------------------------
// EXPORTED REDUCER

export default (intl: Reducer<State, Action>);
