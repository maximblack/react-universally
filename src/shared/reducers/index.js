/* @flow */

import { combineReducers } from 'redux';
import type { Reducer } from 'redux';
import type { Action } from '../types/redux';

import posts, * as FromPosts from './posts';
import intl from './intl';
import type { State as PostsState } from './posts';
import type { State as IntlState } from './intl';

// -----------------------------------------------------------------------------
// EXPORTED REDUCER STATE TYPE

export type State = {
  posts: PostsState,
  intl: IntlState
};

// -----------------------------------------------------------------------------
// REDUCER

const rootReducer: Reducer<State, Action> = combineReducers({
  posts,
  intl
});

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getPostById(state: State, id: number) {
  return FromPosts.getById(state.posts, id);
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default rootReducer;
