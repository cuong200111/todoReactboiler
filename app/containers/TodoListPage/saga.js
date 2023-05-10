import { put, takeLatest, call } from 'redux-saga/effects'
import * as actionTypes from './action'
import * as constantsTypes from './constants'
const url = 'https://jsonplaceholder.typicode.com/todos'
const datas = async () => {
    const fetchData = await fetch(url)
    const data = await fetchData.json()
    return data
}
export function* defaultAction(action) {
    try {
        const data = yield call(datas)
        yield put(actionTypes.defaultActionTodo_sucsess(data.length))
      
    } catch (error) {
   console.log(error)
    }
}

export function* queryTodo(action) {
    const {limit,page} = action
    const startIndex = limit*page
    const endIndex = (limit*page) +limit
    console.log(page);
    try {
        const data = yield call(datas)
        const newData = data.slice(startIndex,endIndex)
        yield put(actionTypes.query_todo_sucsses(newData))
      
    } catch (error) {
   
        yield put(actionTypes.query_todo_failure(error))
    }
}












export default function* todoSaga() {
    yield takeLatest(constantsTypes.QUERY_TODO, queryTodo)
    yield takeLatest(constantsTypes.DEFAULT_ACTION,defaultAction)
} 