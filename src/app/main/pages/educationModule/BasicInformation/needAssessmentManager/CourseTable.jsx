import React from "react";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import {withStyles} from "@material-ui/styles";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
// import {useStyles} from "../../../../components/TablePro"
import TableProBase from "../../../../components/TableProBase";
export const useStyles = theme => ({
    root: {
        '& thead tr th': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            '& .MuiCheckbox-root':{
                color: theme.palette.common.white,
            },
            padding: '11px 14px',
            '& .MuiTypography-body1':{
                lineHeight: '26px'
            }
        },
        '& tbody tr': {
            '& td': {
                // backgroundColor:"gray",
                position: 'relative',
                padding: '11px 14px',
                '& .MuiTypography-body1':{
                    lineHeight: '26px'
                }
            },
            '& $actionBox button': {
                display: 'none'
            },
            '&:hover': {
      
                '& $actionBox button': {
                    display: 'inline'
                }
            },
       
        },
      
    },
    tableLayoutFixed: {
        tableLayout: "fixed"
    },

    actionBox: {
        width: "fit-content",
        position: "absolute",
        right: "10px",
        top: "0px",
        backdropFilter: "blur(2px)",
    },
    editingActionBox: {
        width: "fit-content",
        position: "absolute",
        right: "8px",
        top: "0px",
        backdropFilter: "blur(2px)",
    },

    sortLabelActive: {
        color: theme.palette.common.white + "!important"
    },
    checkCell:{
        paddingTop: '7px',
        paddingBottom: 0,
        color: theme.palette.primary.main
    },
    borderTop: {
        borderTop: "1px solid #ddd"
    },
    marginEnd: {
        marginRight: theme.spacing(1)
    },
    dContent: {
        display: "contents"
    }
});

class CourseTable extends TableProBase{
    constructor() {
        super();
    }
    THead = ()=>{
        const {columns, showRowNumber, rowNumberWidth=this.props.fixedLayout?"35px":"1%", selectable} = this.props
        const HeadCellSelect = this.HeadCellSelect.bind(this)
        const HeadCellNumber = this.HeadCellNumber.bind(this)
        const HeadCellLabel = this.HeadCellLabel.bind(this)
        return(
            <TableHead>
                <TableRow>
                    <TableCell style={{width:rowNumberWidth}}/>
                    {selectable && <HeadCellSelect/>}
                    {showRowNumber && <HeadCellNumber/>}
                    {columns.map((col)=>(
                        <HeadCellLabel col={col}/>
                    ))}
                </TableRow>
            </TableHead>
        )
    }
    TBody = ()=>{
        const { columns, rows, loading, selectable, showRowNumber, pagination} = this.props;
        const { rowsPerPage} = this.state;
        const rowsHeight = pagination ? `${53 * rowsPerPage}px` : "53px";
        const colsCount = columns.length + (showRowNumber?1:0) + (selectable?1:0)
        const RowLoading = this.RowLoading.bind(this)
        const RowEmpty = this.RowEmpty.bind(this)
        const RenderRows = this.RenderRows.bind(this)
        const RenderRemindRow = this.RenderRemindRow.bind(this)
        const parentRows = rows.filter(i=>!i.parentSkillId || i.parentSkillId===i.skillId)
        return(
            <TableBody>
                {loading ? (
                    <RowLoading colSpan={colsCount} height={rowsHeight}/>
                ): parentRows.length>0 ?(
                    <>
                        <RenderRows rows={parentRows}/>
                        <RenderRemindRow/>
                    </>
                ):(
                    <RowEmpty colSpan={colsCount} height={rowsHeight}/>
                )}
            </TableBody>
        )
    }
    TRow ({index, rowData, collapsible=true, subIndex}){
        const {classes, rows, selectedRows, setSelectedRows, isSelected, selectable, showRowNumber} = this.props;
        const cx = require('classnames');
        const [removing, setRemoving] = React.useState(false);
        const [editing, setEditing] = React.useState(false);
        const [open, setOpen] = React.useState(false);
        const RenderCellsEdit = this.RenderCellsEdit.bind(this)
        const RenderCellsShow = this.RenderCellsShow.bind(this)
        const TRow = this.TRow.bind(this)
        const isCollapsible = rowData.skillId===rowData.parentSkillId ? false : collapsible
        const isParent = rowData.skillId===rowData.parentSkillId ? true : collapsible
        const handleClick = (event, name) => {
            if(selectable) {
                const selectedIndex = selectedRows.indexOf(name);
                let newSelected = [];

                if (selectedIndex === -1) {
                    newSelected = newSelected.concat(selectedRows, name);
                } else if (selectedIndex === 0) {
                    newSelected = newSelected.concat(selectedRows.slice(1));
                } else if (selectedIndex === selectedRows.length - 1) {
                    newSelected = newSelected.concat(selectedRows.slice(0, -1));
                } else if (selectedIndex > 0) {
                    newSelected = newSelected.concat(
                        selectedRows.slice(0, selectedIndex),
                        selectedRows.slice(selectedIndex + 1),
                    );
                }
                setSelectedRows(newSelected)
            }
        };
        const isItemSelected = isSelected(rowData,selectedRows);
        return (
            <React.Fragment>
                <TableRow key={index} hover selected={isItemSelected} style={{backgroundColor:isParent?"white":"#c8dbed"}}
                          className={cx(removing && classes.selected, (isParent && !isCollapsible) && "table-row-silver")}
                          onClick={(event) => handleClick(event, rowData)}
                >
                    <TableCell>
                        {isCollapsible &&
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon  style={{ color:"#a6b6c4"}}/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                        }
                    </TableCell>
                    {selectable && (
                        <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} style={{padding:'0'}}/>
                        </TableCell>
                    )}
                    {showRowNumber &&
                    <TableCell >{`${index+1}${isParent ? "" : ` - ${subIndex+1}`}`}</TableCell>
                    }
                    {editing? (
                        <RenderCellsEdit rowData={rowData} setEditing={setEditing}/>
                    ) : (
                        <RenderCellsShow rowData={rowData} setEditing={setEditing} removing={removing} setRemoving={setRemoving}/>
                    )}
                </TableRow>
                {open && rows.filter(i=>i.parentSkillId===rowData.skillId).map((row,ind)=>(
                    <TRow key={'c'+ind} rowData={row} index={index} subIndex={ind} collapsible={false}/>
                ))}
            </React.Fragment>
        )
    }
    Pagination = ()=>{
        const parentRows = this.props.rows.filter(i=>!i.parentSkillId || i.parentSkillId===i.skillId)
        const handleChangePage = (event, newPage) => {
            this.setState({page: newPage});
        };
        const handleChangeRowsPerPage = (event) => {
            this.setState({
                page: 0,
                rowsPerPage: parseInt(event.target.value, 10)
            });
        };
        return(
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={parentRows.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                labelRowsPerPage="?????????? ?????????? ???? ???? ????????"
                labelDisplayedRows={({from, to, count}) => (` ?????????? ${from} - ${to} ???? ${count} ???????? `)}
            />
        )
    }
    render() {
        return super.render();
    }
}
export default withStyles(useStyles)(CourseTable);
