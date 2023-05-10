import React, { memo, useEffect, useState } from "react";
import { Paper, TablePagination } from "@material-ui/core";
import { Grid, Table, VirtualTable, PagingPanel, TableFixedColumns, TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import { CustomPaging, PagingState } from "@devexpress/dx-react-grid";
import { compose } from "redux";
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import * as types from './action'
import { connect } from "react-redux";
import reducer from './reducer'
import saga from './saga'
import { createSelector, createStructuredSelector } from "reselect";
import makeSelectTodo from "./selector";
import { fromJS } from 'immutable'
function TodoListPage({ query, Todo ,countRows}) {

    useInjectReducer({ key: "Todo", reducer });
    useInjectSaga({ key: "Todo", saga });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [pageSize, setPageSize] = useState(0);
    const dataRowCls = [{ title: "stt", name: "stt", checked: true }, { title: "Name Todo", name: "NameTodo", checked: true }, { title: "userID", name: "userid", checked: true }]
    const dataRows = []
    const [rows, setRows] = useState(dataRows)
    const rowCls =dataRowCls
   const [limit,setLimit] = useState(0)
    const TableRow = ({ row, ...restProps }) => {
        return <Table.Row
            {...restProps}
            row={row}
        />
    }

    function DragColumn({ ...rest }) {

        return <TableHeaderRow.Cell {...rest} />;
    }
  
    const handleChangePage = (page, newPage) => {

        setPageSize(newPage);
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPageSize(0);
    }
  
    useEffect(() => {
        query(pageSize,rowsPerPage)
    }, [rowsPerPage,pageSize])

    useEffect(()=>{
        countRows()

    },[])
    useEffect(() => {
        if (Todo.data && Array.isArray(Todo.data)) {
            const newArr = Todo.data.map((item, index) => {
                item.checked = true
                item.userid = item.userId
                item.NameTodo = item.title
                item.stt = item.id
                delete item.id
                delete item.userId
                delete  item.title
                return item
            })
            console.log(newArr);
            setRows(newArr)
        }
    }, [Todo.data])

    return (
        <div style={{ height: "100vh", width: "100vw", backgroundColor: "black", display: "flex", padding: 50 }}>

            <Paper style={{ width: "50%", height: "100%", backgroundColor: "white", borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                <Grid rows={rows} columns={rowCls}>
                    <PagingState
                        currentPage={rowsPerPage}
                        pageSize={pageSize}
                    />
                    <VirtualTable
                        rowComponent={TableRow}

                        messages={{ noData: 'Không có dữ liệu' }}
                    />

                    <CustomPaging totalCount={pageSize} />
                    <TableHeaderRow cellComponent={DragColumn} />

                </Grid>
                <TablePagination
                    component="div"
                    count={Todo.lengthRows?Todo.lengthRows:0}
                    page={pageSize}
                    onChangePage={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <div style={{ borderLeft: "1px solid #0000004f", width: "50%", backgroundColor: "white", borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>

            </div>
        </div>
    )
}
const mapStateToProps = createStructuredSelector({
    Todo: makeSelectTodo()
});
function mapDispathToProps(dispatch) {
    return {
        query: (limit,page) => {
            dispatch(types.query_todo(limit,page))
        },
        countRows:()=>{
            dispatch(types.defaultActionTodo())
        }
    }
}
const withConnect = connect(mapStateToProps, mapDispathToProps)




export default compose(withConnect, memo)(TodoListPage)