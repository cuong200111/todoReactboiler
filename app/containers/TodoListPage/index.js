import React, { memo, useEffect, useState } from "react";
import { Button, Fab, Grid, Hidden, Paper, TablePagination } from "@material-ui/core";
import { Grid as GridTable, Table, VirtualTable, PagingPanel, TableFixedColumns, TableHeaderRow, TableSelection } from "@devexpress/dx-react-grid-material-ui";
import { CustomPaging, IntegratedSelection, PagingState, SelectionState } from "@devexpress/dx-react-grid";
import { compose } from "redux";
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import * as types from './action'
import { connect } from "react-redux";
import { Delete, Notifications } from "@material-ui/icons";
import reducer from './reducer'
import saga from './saga'
import { createSelector, createStructuredSelector } from "reselect";
import makeSelectTodo from "./selector";
import { fromJS } from 'immutable'
import './index.css'
import { makeStyles } from "@material-ui/styles";
const useStyle = makeStyles({
    fabStyle: {
        backgroundColor: "#ff00007d !important",
        "&:hover": {
            backgroundColor: "red !important",
        }
    }
})
function TodoListPage({ query, Todo, deleteTodos, updateTodos }) {

    const classes = useStyle()


    useInjectReducer({ key: "Todo", reducer });
    useInjectSaga({ key: "Todo", saga });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [pageSize, setPageSize] = useState(0);
    const dataRowCls = [{ title: "stt", name: "stt", checked: true }, { title: "Name Todo", name: "NameTodo", checked: true }, { title: "userID", name: "userid", checked: true }]
    const [rows, setRows] = useState([])
    const rowCls = dataRowCls
    const [testData, setTestData] = useState(false)
    const [counts, setCount] = useState(0)


    
    const TableRow = ({ row, ...restProps }) => {
        return <Table.Row
            {...restProps}
            onMouseOver={(e)=>{
                console.log(e.target.style = 'cursor:pointer')
            }}
            onClick={()=>{
                handleRow()
            }}
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

        Todo.dataDelete && setTestData(Todo.dataDelete)
        const newArr = Todo.data && Todo.data.data.map((item, index) => {
            if (testData) {
                return item
            } else {
                item.checked = true
                item.userid = item.userId
                item.NameTodo = item.title
                item.stt = item.id
                return item
            }

        })
        setRows(testData ? Todo.data.data : newArr ? newArr : [])
        setCount(newArr && Todo.data.length ? Todo.data.length : 0)
    }, [Todo.data, Todo.dataDelete, testData])
    useEffect(() => {
        query(pageSize, rowsPerPage, testData)
    }, [rowsPerPage, pageSize, testData])



    const [selection, setSelection] = useState([]);

    const handleSelectionChange = (selectedRows) => {
        setSelection(selectedRows);
    };
    const DeleteTodo = () => {
        const data = rows.filter((item, index) => selection.includes(index))
        const dat = testData && testData ? testData : Todo.data.firstData
        const newArr = dat.map((item, index) => {
            return {
                checked: !testData ? true : true,
                userid: !testData ? item.userId : item.userid,
                NameTodo: !testData ? item.title : item.NameTodo,
                stt: !testData ? item.id : item.stt
            }
        })
        const newData = newArr.filter((item, index) => {
            return data.every(itemz => itemz.stt !== item.stt)
        })
        deleteTodos(newData)
        setSelection([])
    }
    const [activeAction, setActiveAction] = useState({
        update: false,
        delete: false,
        add: false
    })
    console.log(activeAction);
    const handleAction = (action) => {

        if (action === 'xóa') {

            setActiveAction({

                update: false,
                delete: true,
                add: false

            })
        }
        if (action === 'thêm') {

            setActiveAction({

                update: false,
                delete: false,
                add: true

            })
        }
        if (action === 'sửa') {

            setActiveAction({

                update: true,
                delete: false,
                add: false

            })
        }
    }
    const handleRow = ()=>{
        
    }
    return (
        <div style={{ height: "100vh", width: "100vw", backgroundColor: "black", padding: 50 }}>

            <div  style={{ height: "100%", width: "100%", display: "flex", borderRadius: "10px", overflow: "hidden" }}>
                <Paper style={{ width: "50%", height: "100%", backgroundColor: "white" }}>
                    <GridTable rows={rows} columns={rowCls}>
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

                        <SelectionState selection={selection} onSelectionChange={handleSelectionChange} />
                        <IntegratedSelection />
                        {activeAction.delete? <TableSelection
                            selectByRowClick
                            highlightRow
                            showSelectionColumn={true}
                            showSelectAll={true}

                        />:''}

                    </GridTable>


                    <TablePagination

                        component="div"

                        count={counts && counts}
                        page={pageSize}
                        onChangePage={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                    <Button onClick={() => { handleAction('thêm') }} variant="outlined" color="primary">Thêm</Button>
                    <Button onClick={() => { handleAction('sửa') }} style={{ margin: "0 10px" }} variant="outlined" color="primary">Sửa</Button>
                    <Button onClick={() => { handleAction('xóa') }} variant="outlined" color="primary">Xóa</Button>
                </Paper>
                <div style={{ position: "relative", borderLeft: "1px solid #0000004f", width: "50%", height: "100%", backgroundColor: "white" }}>
                    <Grid style={{ justifyContent: "center", padding: "10px 0", position: "absolute", left: "1%" }}>
                        {selection.length > 0 ?
                            <Fab size="small" className={classes.fabStyle} onClick={DeleteTodo}>
                                <Delete style={{ color: "white" }} />
                            </Fab> : ""
                        }
                    </Grid>
                    <Grid style={{ marginTop: "100px" }}>

                    </Grid>
                </div>
            </div>
        </div>
    )
}
const mapStateToProps = createStructuredSelector({
    Todo: makeSelectTodo()
});
function mapDispathToProps(dispatch) {
    return {
        query: (limit, page, testData) => {
            dispatch(types.query_todo(limit, page, testData))
        },

        deleteTodos: (data) => {
            dispatch(types.delete_todo(data))
        },
        updateTodos: () => {
            dispatch(types.update_todo())
        }
    }
}
const withConnect = connect(mapStateToProps, mapDispathToProps)




export default compose(withConnect, memo)(TodoListPage)