import React from "react";
import TableProBase from "./TableProBase";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/styles";
import {useStyles} from "./TablePro";
import TablePagination from "@material-ui/core/TablePagination";
import axios from "../api/axiosRest";
import TableBody from "@material-ui/core/TableBody";

class TableProAjax extends TableProBase{
    constructor(props) {
        super(props);
        // this.defaultTexts = {
        //     removeDialog: "آیا از حذف این ردیف اطمینان دارید؟",
        //     removeAlertSuccess: "ردیف مورد نظر با موفقیت حذف شد.",
        //     removeAlertFailed: "خطا در عملیات حذف!",
        //     editAlertSuccess: "تغییرات ردیف مورد نظر با موفقیت انجام شد.",
        //     editAlertFailed: "خطا در عملیات ویرایش!",
        //     addAlertSuccess: "ردیف مورد نظر با موفقیت اضافه شد.",
        //     addAlertFailed: "خطا در عملیات افزودن!",
        //     alertFormRequired: "باید تمام فیلدهای ضروری وارد شوند!",
        // }
        this.state = {
            order:          "asc",
            orderBy:        "",
            rowsPerPage:    5,
            page:           0,
            rows:           [],
            count:          0,
            formData:       {},
            showForm:       null,
            showFilter:     false,
            showAddForm:    false,
            loading:        true,
        }
    }

    static propTypes = {
        texts:          PropTypes.objectOf(PropTypes.string),
        className:      PropTypes.string,
        url:            PropTypes.string,
        title:          PropTypes.string,
        defaultOrderBy: PropTypes.string,
        columns:        PropTypes.arrayOf(PropTypes.object).isRequired,
        setRows:        PropTypes.func,
        selectedRows:   PropTypes.arrayOf(PropTypes.object),
        setSelectedRows:PropTypes.func,
        isSelected:     PropTypes.func,
        size:           PropTypes.oneOf(["small","medium"]),
        showTitleBar:   PropTypes.bool,
        showRowNumber:  PropTypes.bool,
        rowNumberWidth: PropTypes.string,
        fixedLayout:    PropTypes.bool,
        removeCallback: PropTypes.func,
        selectable:     PropTypes.bool,
        singleSelect:   PropTypes.bool,
        actions:        PropTypes.arrayOf(PropTypes.object),
        rowActions:     PropTypes.arrayOf(PropTypes.object),
        filter:         PropTypes.oneOf([false, "external"]),
        filterForm:     PropTypes.node,
        // add:            PropTypes.oneOf([false, "external", "inline"]),
        // addForm:        PropTypes.node,
        // addCallback:    PropTypes.func,
        // edit:           PropTypes.oneOf([false, "external", "inline", "callback"]),
        // editForm:       PropTypes.node,
        // editCallback:   PropTypes.func,
        exportCsv:      PropTypes.string,
        csvRenderer:    PropTypes.func,
    }

    updateRows = (pageIndex=0, pageSize=this.state.rowsPerPage) => {
        this.setState({
            loading: true,
            rowsPerPage: pageSize
        });
        axios.get(this.props.url, {
            params: {
                pageIndex: pageIndex,
                pageSize: pageSize,
                orderByField: this.state.orderBy,
                order: this.state.order,
            }
        }).then(res => {
            this.setState({
                page: pageIndex,
                rows: res.data.rows,
                count: res.data.count,
                loading: false
            });
        }).catch(() => {
            this.setState({
                loading: false
            });
        });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.order!==this.state.order || prevState.orderBy!==this.state.orderBy || prevProps.url!==this.props.url){
            this.updateRows(this.state.page,this.state.rowsPerPage)
        }
    }

    componentDidMount() {
        this.updateRows()
    }

    RenderRemindRow() {
        const { columns, pagination, selectable, showRowNumber} = this.props;
        const { rowsPerPage, rows} = this.state;
        const colsCount = columns.length + (showRowNumber?1:0) + (selectable?1:0)
        const RowRem = this.RowRem.bind(this)
        const rem = rowsPerPage - rows.length;
        const remRowsHeight = `${53 * rem}px`;
        if(pagination && rem>0)
            return <RowRem colSpan={colsCount} height={remRowsHeight}/>
        else return null
    }
    RenderRows ({rows}){
        const {rowsPerPage, page} = this.state;
        const TRow = this.TRow.bind(this)
        return rows.map((rowData, index) => (
                    <TRow key={index} index={page * rowsPerPage + index} rowData={rowData}/>
                )
            )
    }
    TBody = ()=>{
        const { columns, selectable, showRowNumber, pagination} = this.props;
        const { rowsPerPage, rows, loading} = this.state;
        const rowsHeight = pagination ? `${53 * rowsPerPage}px` : "53px";
        const colsCount = columns.length + (showRowNumber?1:0) + (selectable?1:0)
        const RowLoading = this.RowLoading.bind(this)
        const RowEmpty = this.RowEmpty.bind(this)
        const RenderRows = this.RenderRows.bind(this)
        const RenderRemindRow = this.RenderRemindRow.bind(this)
        return(
            <TableBody>
                {loading ? (
                    <RowLoading colSpan={colsCount} height={rowsHeight}/>
                ): rows.length>0 ?(
                    <>
                        <RenderRows rows={rows}/>
                        <RenderRemindRow/>
                    </>
                ):(
                    <RowEmpty colSpan={colsCount} height={rowsHeight}/>
                )}
            </TableBody>
        )
    }
    Pagination = ()=>{
        const handleChangePage = (event, newPage) => {
            this.updateRows(newPage)
        };
        const handleChangeRowsPerPage = (event) => {
            this.updateRows(0, parseInt(event.target.value, 10))
            this.setState({
                page: 0,
                rowsPerPage: parseInt(event.target.value, 10)
            });
        };
        return(
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={this.state.count}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                backIconButtonText="صفحه قبلی"
                nextIconButtonText="صفحه بعدی"
                labelRowsPerPage="میزان نمایش در هر صفحه"
                labelDisplayedRows={({from, to, count}) => (` نمایش ${from} - ${to} از ${count} داده `)}
            />
        )
    }
}

export default withStyles(useStyles)(TableProAjax);
