import * as types from './constants'


//defaults
export const defaultActionTodo = (lengthRows) => {
    return (
        { type: types.DEFAULT_ACTION ,
            lengthRows
        }
    )
}
export const defaultActionTodo_sucsess = (lengthRows) => {
    return (
        { type: types.DEFAULT_ACTION_SUCCESS ,
            lengthRows
        }
    )
}
//query
export const query_todo = (page,limit,testData) => {
    return (
        {
            type: types.QUERY_TODO,
            limit,
            page,
            testData
        }
    )
}
export const query_todo_sucsses = (data) => {
    return (
        {
            type: types.QUERY_TODO_SUCSESS,
            data
        }
    )
}
export const query_todo_failure = (data) => {
    return (
        {
            type: types.QUERY_TODO_FAILURE,
            data
        }
    )
}
//create
export const create_todo = () => {
    return (
        {
            type: types.CREATE_TODO
        }
    )
}
export const create_todo_sucsses = (data) => {
    return (
        {
            type: types.CREATE_TODO_SUCSSES,
            data
        }
    )
}
export const create_todo_failure = (data) => {
    return (
        {
            type: types.CREATE_TODO_FAILURE,
            data
        }
    )
}
//update
export const update_todo = () => {
    return (
        { type: types.UPDATE_TODO }
    )
}
export const update_todo_sucsses = (data) => {
    return (
        {
            type: types.UPDATE_TODO_SUCSSES,
            data
        }
    )
}
export const update_todo_failure = (data) => {
    return (
        {
            type: types.UPDATE_TODO_FAILURE,
            data
        }
    )
}
//delete
export const delete_todo = (data) => {
    return (
        { type: types.DELETE_TODO,data }
    )
}
export const delete_todo_sucsses = (data) => {
    return (
        {
            type: types.DELETE_TODO_SUCSSES,
            data
        }
    )
}
export const delete_todo_failure = (data) => {
    return (
        {
            type: types.DELETE_TODO_FAILURE,
            data
        }
    )
}