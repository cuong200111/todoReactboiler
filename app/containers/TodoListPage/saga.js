import { put, takeLatest, call } from 'redux-saga/effects'
import * as actionTypes from './action'
import * as constantsTypes from './constants'
import  * as urlApi  from '../config'
import axios from 'axios'

const datas = async () => {
    const data = await axios.get(urlApi.Api1)
    return data.data
}


export function* queryTodo(action) {
    const { limit, page,testData } = action
    const startIndex = limit * page
    const endIndex = (limit * page) + limit

    try {
 
        const data2 = yield call(datas)
        const data = yield call(datas)
        const dataDelete = {data:testData&&testData.slice(startIndex, endIndex),length:testData.length}

        const newData =  {data:data.slice(startIndex, endIndex),length:data.length,firstData:data,updateData:data2}

        yield put(actionTypes.query_todo_sucsses(testData?dataDelete:newData))


    } catch (error) {

        yield put(actionTypes.query_todo_failure(error))
    }
}

export function* deleteTodo(action) {
    const { data } = action
    yield put(actionTypes.delete_todo_sucsses(data))
}
 function* updateTodo(action) {
    const { data2 } = action

   try {
    yield put(actionTypes.update_todo_sucsses(data2))
   } catch (error) {
    console.log(error);
   }
}









export default function* todoSaga() {
    yield takeLatest(constantsTypes.UPDATE_TODO,updateTodo)
    yield takeLatest(constantsTypes.QUERY_TODO, queryTodo)

    yield takeLatest(constantsTypes.DELETE_TODO, deleteTodo)
  
} 