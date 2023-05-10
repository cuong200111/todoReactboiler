

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => {

    return state.Todo || initialState
};

const makeSelectTodo = () =>
  createSelector(
    selectHome,
    homeState => homeState.toJS(),
  );

export default makeSelectTodo
