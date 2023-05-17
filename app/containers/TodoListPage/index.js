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
import Alert from "./Alert";
import { makeStyles } from "@material-ui/styles";
import Dialog from "./dialog";

const useStyle = makeStyles({
    fabStyle: {
        backgroundColor: "#ff00007d !important",
        "&:hover": {
            backgroundColor: "red !important",
        }
    }
})
function TodoListPage({ query, Todo, deleteTodos, updateTodos }) {
    useInjectReducer({ key: "Todo", reducer });
    useInjectSaga({ key: "Todo", saga });

    const classes = useStyle()
    const dataRowCls = [{ title: "stt", name: "stt", checked: true },
    { title: "Name Todo", name: "NameTodo", checked: true },
    { title: "userID", name: "userid", checked: true },
    { title: "action", name: "actionUpdate", checked: true }]
    const [valueID, setValueID] = useState('');
    const [valueNameTodo, setValueNameTodo] = useState('');
    const [selection, setSelection] = useState([]);
    const [lengthSelection, setLengthSelection] = useState(0)
    const [activeAlert, setActiveAlert] = useState(false);
    const [dialogActive, setDialogActive] = useState(false)
    const [delSucsess, setDelSucsess] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [pageSize, setPageSize] = useState(0);
    const [rows, setRows] = useState([])
    const [rowCls, setRowCls] = useState(dataRowCls)
    const [itemRow, setItemRow] = useState(false)
    const [testData, setTestData] = useState(false)
    const [updateData, setUpdateData] = useState(false)
    const [counts, setCount] = useState(0)
    const [activeAction, setActiveAction] = useState({
        update: false,
        delete: false,
        add: false
    })
  
    //useEffect
    useEffect(() => {
        if (delSucsess) {
            setActiveAlert(true)
            setTimeout(() => {
                setActiveAlert(false)
                setDelSucsess(false)
            }, 2000);
            const data = rows.filter((item, index) => selection.includes(index))
            const dat = testData && testData ? testData : Todo.data.firstData
            const newArr = dat.map((item, index) => {
                return {
                    checked: !testData ? true : true,
                    userid: !testData ? item.id : item.userid,
                    NameTodo: !testData ? item.title : item.NameTodo,
                    stt: index

                }
            })

            const newData = newArr.filter((item, index) => {

                if (data.every(itemz => itemz.userid !== item.userid)) {
                    return item
                }

            }).map((item, index) => {
                item.stt = index + 1
                return item
            })

            deleteTodos(newData)
            setSelection([])
            setActiveAction({

                update: false,
                delete: false,
                add: false

            })
        }
    }, [delSucsess, dialogActive])

    useEffect(() => {
        const testDataAction = testData && testData.some(item => item.title === "action")
        if (!testDataAction) {
            testData && testData.map((item, index) => {
                item.actionUpdate = <Fab key={index} onClick={(...rest) => {
                        setUpdateData(false)
                        setActiveAlert(false)
                    setItemRow(item)
                    setActiveAction({
                        update: true,
                        delete: false,
                        add: false

                    })
                }} className="handleUpdate" style={{ width: "35px", height: "20px" }} >
                    <Update fontSize="small" />
                </Fab>
                return item
            })
        }

        Todo.dataDelete && setTestData(Todo.dataDelete)

        const newArr = Todo.data && Todo.data.data.map((item, index) => {
            if (testData) {
                return item
            } else {
                item.checked = true
                item.userid = item.id
                item.NameTodo = item.title
                item.stt = index + 1
                item.actionUpdate = <Fab key={index} onClick={(...rest) => {
                        setUpdateData(false)
                        setActiveAlert(false)
                    setItemRow(item)
                    setActiveAction({
                        update: true,
                        delete: false,
                        add: false

                    })
                }} className="handleUpdate" style={{ width: "35px", height: "20px" }} >
                    <Update fontSize="small" />
                </Fab>
                return item
            }

        })
        setRows(testData ? Todo.data.data : newArr ? newArr : [])

        setCount(newArr && Todo.data.length ? Todo.data.length : 0)
    }, [Todo.data, Todo.dataDelete, Todo.dataUpdate, testData])

    useEffect(() => {
        query(pageSize, rowsPerPage, testData)
    }, [rowsPerPage, pageSize, testData])


    //Event
    const handleChangePage = (page, newPage) => {
        setPageSize(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPageSize(0);
    }



    const handleSelectionChange = (selectedRows) => {
        setLengthSelection(selectedRows.length)
        setActiveAlert(false)
        setSelection(selectedRows);
    };
    const DeleteTodo = (e, i) => {
        setDelSucsess(e)
        setDialogActive(i)
    }



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
            <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", borderRadius: "10px", overflow: "hidden", backgroundColor: "white", position: "relative" }}>
                <Alert active={activeAlert || updateData ? true : false} msg={updateData?'Cập nhật Thành công':activeAlert?`Xóa thành công ${lengthSelection} item`:''} color="sucsess" style={{ top: "90%", left: "30%" }} />
                <Dialog onclick={DeleteTodo} dialogActive={dialogActive} />
                <Paper style={{ width: "100%", height: "74%" }}>
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
                <div style={{ position: "relative", borderLeft: "1px solid #0000004f", backgroundColor: "white" }}>
                    <Grid style={{ justifyContent: "center", padding: "10px 0", position: "absolute", left: "1%" }}>
                        {selection.length > 0 && activeAction.delete ?
                            <Fab size="small" className={classes.fabStyle} onClick={() => {
                                setDialogActive(true)
                                setActiveAlert(false)
                            }}>
                                <Delete style={{ color: "white" }} />
                            </Fab> : ""
                        }
                    </Grid>

                    <Grid style={{ marginTop: "10px" }}>
                        {itemRow && itemRow && activeAction.update && activeAction.update ? <>
                            <Grid item container style={{ justifyContent: "center" }}>
                                <TextField style={{ margin: "0 0px 25px 0px" }} value={valueID ? valueID : itemRow.userid} label="ID cần thay đổi" variant="outlined" onChange={(e) => {
                                    setValueID(e.target.value)
                                }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" style={{ width: "18px" }}>ID</InputAdornment>,
                                        style: { padding: "0 15px" }
                                    }}
                                />
                                <TextField style={{ margin: "0 0px 0px 73px" }} value={valueNameTodo ? valueNameTodo : itemRow.NameTodo} label="NameTodo" variant="outlined" onChange={(e) => {
                                    setValueNameTodo(e.target.value)
                                }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" style={{ width: "96px" }}>NameTodo</InputAdornment>,
                                        style: { padding: "0 15px" }
                                    }}
                                />
                            </Grid>
                            <Grid style={{ padding: "0 20%" }}>

                                <Button onClick={() => {
                                    setUpdateData(true)
                                    setTimeout(() => {
                                        setUpdateData(false)
                                    }, 2000)
                                    const stt = testData ? itemRow.userid : itemRow.id
                                    const data = testData ? testData : Todo.data.firstData
                                    const filterData = data.filter((item, index) => {
                                        if (item.userid === stt) {
                                            item.userid = valueID ? valueID : itemRow.userid
                                            item.NameTodo = valueNameTodo ? valueNameTodo : itemRow.NameTodo
                                            return item
                                        } else {
                                            item.userid = testData ? item.userid : item.id
                                            item.stt = index + 1
                                            item.NameTodo = testData ? item.NameTodo : item.title
                                            return item
                                        }

                                    })
                                    setTestData(filterData)
                                    setActiveAction({
                                        update: false,
                                        delete: false,
                                        add: false

                                    })
                                }} style={{ width: "100%", marginTop: "20px", padding: "20px 0" }} variant="outlined" color="secondary">Update</Button>
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