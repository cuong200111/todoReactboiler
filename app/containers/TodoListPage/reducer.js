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
        case types.DELETE_TODO_SUCSSES:
            return state.set('dataDelete', action.data)
        case types.UPDATE_TODO_SUCSSES:
            return state.set('dataUpdate', action.data)
        default:

            return state
    }
}

export default reducerTodoList