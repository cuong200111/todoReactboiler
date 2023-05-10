import { fromJS } from 'immutable'

import * as types from './constants'



export const initialState = fromJS({
    dataTodo: []
})
function reducerTodoList(state = initialState, action) {
    switch (action.type) {

        case types.QUERY_TODO_SUCSESS:

            return state.set('data', action.data)
        case types.DEFAULT_ACTION_SUCCESS:
            return state.set('lengthRows', action.lengthRows)
        default:

            return state
    }
}

export default reducerTodoList