import {
  SET_LOCALE_START,
  SET_LOCALE_SUCCESS,
  SET_LOCALE_ERROR,
} from '../constants';

const query = `
  query ($locale:String!) {
    intl (locale:$locale) {
      id
      message
    }
  }
`;

export function setLocale({ locale }) {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch({
      type: SET_LOCALE_START,
      payload: {
        locale,
      },
    });

    try {
      const { data } = await graphqlRequest(query, { locale });
      const messages = data.intl.reduce((msgs, msg) => {
        msgs[msg.id] = msg.message; // eslint-disable-line no-param-reassign
        return msgs;
      }, {});
      dispatch({
        type: SET_LOCALE_SUCCESS,
        payload: {
          locale,
          messages,
        },
      });

      // remember locale for every new request
      if (process.env.BROWSER) {
        const maxAge = 3650 * 24 * 3600; // 10 years in seconds
        document.cookie = `lang=${locale};path=/;max-age=${maxAge}`;
      }
    } catch (error) {
      dispatch({
        type: SET_LOCALE_ERROR,
        payload: {
          locale,
          error,
        },
      });
      return false;
    }

    return true;
  };
}


/*import { createDuck } from 'redux-duck'
import { createSelector } from 'reselect'
import { getLocaleData, registerLocaleData } from '../utils/intl'

export const KEY = 'intl'

export const initialState = {}

export const duck = createDuck(KEY)

export const CHANGE_LOCALE = duck.defineType('CHANGE_LOCALE')

export const changeLocale = duck.createAction(CHANGE_LOCALE)

export const selectIntlState = () => (state) => state[KEY]

export const selectIntlLocale = () => createSelector(
  selectIntlState(),
  (substate) => substate.locale
)

export default duck.createReducer({
  [CHANGE_LOCALE]: (state, {payload}) => {
    if (payload === state.locale) {
      return state
    }

    const {locale, messages} = getLocaleData(payload)

    registerLocaleData(locale)

    return {locale, messages}
  },
}, initialState)*/
