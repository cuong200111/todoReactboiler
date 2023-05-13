import React, { Fragment, memo, useEffect, useState } from "react";
import { Button, Fab, Grid, Hidden, Input, InputAdornment, Paper, TableHead, TablePagination, TextField } from "@material-ui/core";
import { Grid as GridTable, Table, VirtualTable, PagingPanel, TableFixedColumns, TableHeaderRow, TableSelection } from "@devexpress/dx-react-grid-material-ui";
import { CustomPaging, IntegratedSelection, PagingState, SelectionState } from "@devexpress/dx-react-grid";
import { compose } from "redux";
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import * as types from './action'
import { connect } from "react-redux";
import { Delete, Notifications, Update } from "@material-ui/icons";
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
    const [valueID, setValueID] = useState('');
    const [valueNameTodo, setValueNameTodo] = useState('');
    useInjectReducer({ key: "Todo", reducer });
    useInjectSaga({ key: "Todo", saga });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [pageSize, setPageSize] = useState(0);
    const dataRowCls = [{ title: "stt", name: "stt", checked: true },
    { title: "Name Todo", name: "NameTodo", checked: true },
    { title: "userID", name: "userid", checked: true },
    { title: "action", name: "actionUpdate", checked: true }]
    const [rows, setRows] = useState([])
    const [rowCls, setRowCls] = useState(dataRowCls)
    const [itemRow, setItemRow] = useState(false)
    const [testData, setTestData] = useState(false)
    const [updateData, setUpdateData] = useState(false)
    const [counts, setCount] = useState(0)
    console.log(testData)
    const handleChangePage = (page, newPage) => {
        setPageSize(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPageSize(0);
    }

    useEffect(() => {


        console.log(Todo.dataUpdate)
        const testDataAction = testData && testData.some(item => item.title === "action")
        if (!testDataAction) {
            testData && testData.map((item, index) => {
                item.actionUpdate = <Fab key={index} onClick={(...rest) => {
                    setItemRow(item)
                }} className="handleUpdate" style={{ width: "35px", height: "20px" }} >
                    <Update fontSize="small" />
                </Fab>
                return item
            })
        }

        Todo.dataDelete && setTestData(Todo.dataDelete)
        Todo.dataUpdate && setUpdateData(Todo.dataUpdate)
        const newArr = Todo.data && Todo.data.data.map((item, index) => {
            if (testData) {
                return item
            } else {
                item.checked = true
                item.userid = item.userId
                item.NameTodo = item.title
                item.stt = item.id
                item.actionUpdate = <Fab key={index} onClick={(...rest) => {

                    setItemRow(item)
                }} className="handleUpdate" style={{ width: "35px", height: "20px" }} >
                    <Update fontSize="small" />
                </Fab>
                return item
            }

        })
        setRows(updateData ? updateData : testData ? Todo.data.data : newArr ? newArr : [])
        console.log(updateData, 'updateData')
        console.log(testData ? Todo.data.data : [], 'Todo.data.data')
        console.log(newArr, 'newArr')
        setCount(newArr && Todo.data.length ? Todo.data.length : 0)
    }, [Todo.data, Todo.dataDelete, Todo.dataUpdate, testData, updateData])
    useEffect(() => {
        const dataquery = updateData && updateData ? updateData : testData
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
                stt: !testData ? item.id : item.stt,

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


    const handleActionDel = () => {

        if (!activeAction.delete) {

            setActiveAction({

                update: false,
                delete: true,
                add: false

            })
        } else {
            setActiveAction({

                update: false,
                delete: false,
                add: false

            })
        }


    }

    const TableRow = ({ row, ...restProps }) => {

        return <Table.Row{...restProps}>
            {
                rowCls.map((item, index) => {
                    return (<React.Fragment key={index}>
                        <Table.Cell >{row[item.name]}</Table.Cell>
                    </React.Fragment>
                    )
                })
            }
        </Table.Row>
    }
    function DragColumn({ column, ...rest }) {
        return (<>
            <TableHeaderRow.Cell>
                {column.title}

            </TableHeaderRow.Cell>

        </>);
    }


    return (
        <div style={{ height: "100vh", width: "100vw", backgroundColor: "black", padding: 50 }}>

            <div style={{ height: "100%", width: "100%", display: "flex", borderRadius: "10px", overflow: "hidden" }}>
                <Paper style={{ width: "50%", height: "100%", backgroundColor: "white" }}>
                    <GridTable rows={rows} columns={rowCls}>
                        <PagingState
                            currentPage={rowsPerPage}
                            pageSize={pageSize}
                        />
                        <VirtualTable
                            rowComponent={(props) => (<TableRow {...props} />)}

                            messages={{ noData: 'Không có dữ liệu' }}
                        />

                        <CustomPaging totalCount={pageSize} />
                        <TableHeaderRow cellComponent={DragColumn} />

                        <SelectionState selection={selection} onSelectionChange={handleSelectionChange} />
                        <IntegratedSelection />
                        {activeAction.delete ? <TableSelection

                            selectByRowClick
                            highlightRow
                            showSelectionColumn={true}
                            showSelectAll={true}

                        /> : ''}

                    </GridTable>


                    <TablePagination

                        component="div"

                        count={counts && counts}
                        page={pageSize}
                        onChangePage={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />

                    <Button onClick={() => { handleActionDel() }} variant="outlined" color="primary">Xóa</Button>
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
                        {itemRow && itemRow ? <>
                            <Grid item container style={{ justifyContent: "space-around" }}>
                                <TextField label="ID cần thay đổi" variant="outlined" onChange={(e) => {

                                    setValueID(e.target.value)
                                }}
                                    InputProps={{

                                        startAdornment: <InputAdornment position="start" style={{ width: "18px" }}>ID</InputAdornment>,
                                        style: { padding: "0 15px" }
                                    }}
                                />
                                <TextField label="NameTodo" variant="outlined" onChange={(e) => {

                                    setValueNameTodo(e.target.value)
                                }}
                                    InputProps={{

                                        startAdornment: <InputAdornment position="start" style={{ width: "18px" }}>ID</InputAdornment>,
                                        style: { padding: "0 15px" }
                                    }}
                                />
                            </Grid>
                            <Grid style={{ padding: "0 20%" }}>

                                <Button onClick={() => {


                                }} style={{ width: "100%", marginTop: "20px" }} variant="outlined" color="secondary">Update</Button>
                            </Grid>
                        </> : ''}

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
     
    }
}
const withConnect = connect(mapStateToProps, mapDispathToProps)




export default compose(withConnect, memo)(TodoListPage)