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
import {useStyles} from "../../../components/TablePro"
import TableProBase from "../../../components/TableProBase";
import {makeStyles} from "@material-ui/core/styles";

class AccessCollapseTable extends TableProBase{
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
        const parentRows = rows.filter(i=>i.parentId == null)
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
    TRow ({index, rowData, collapsible=false, subIndex,prtIndx}){
        const {classes, rows, selectedRows, setSelectedRows, isSelected, selectable, showRowNumber,isOpen,setIsOpen} = this.props;
        const useStyles = makeStyles({
            'collapse-td':{
                '& td':{
                    padding: 0
                }

            },
            'collapseChild-1': {
                // '& td':{
                //     borderWidth:'2px',
                //     borderColor:'#989da6'
                // },
                '& td:first-child':{
                    paddingLeft:'32px !important'
                },
                '& td:nth-child(2)':{
                    paddingLeft:'32px !important'
                }
    
            } ,
            'collapseChild-2': {
                // '& td':{
                //     borderWidth:'2px'
                // },
                '& td:first-child':{
                    paddingLeft:'44px !important'
                },
                '& td:nth-child(2)':{
                    paddingLeft:'44px !important'
                }
    
            },
            'collapseChild-3': {
                '& td:first-child':{
                    paddingLeft:'60px !important'
                },
                '& td:nth-child(2)':{
                    paddingLeft:'60px !important'
                }
    
            }
        })
        const myClasses = useStyles();

        const cx = require('classnames');
        const [removing, setRemoving] = React.useState(false);
        const [editing, setEditing] = React.useState(false);
        const RenderCellsEdit = this.RenderCellsEdit.bind(this)
        const RenderCellsShow = this.RenderCellsShow.bind(this)
        const TRow = this.TRow.bind(this)
        const isCollapsible = rows.find(x=>x.parentId == rowData.id)
        const isParent = rows.find(x=>x.parentId == rowData.id)
        prtIndx = prtIndx ? prtIndx : 0
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
        const changeOpenState = () => {
            let opens = isOpen.slice(0)
            opens[rowData.id] = !opens[rowData.id]
            setIsOpen(opens)
        }
        const isItemSelected = isSelected(rowData,selectedRows);
        return (
            <React.Fragment>
                <TableRow key={index} hover selected={isItemSelected}
                          className={cx(removing && classes.selected, (isParent && !isCollapsible) && "table-row-silver",myClasses['collapse-td'],myClasses['collapseChild-'+prtIndx])}
                          onClick={(event) => handleClick(event, rowData)}
                >
                    <TableCell>
                        {isCollapsible &&
                        <IconButton aria-label="expand row" size="small" onClick={changeOpenState}>
                            {isOpen[rowData.id] ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                        }
                    </TableCell>
                    {editing? (
                        <RenderCellsEdit rowData={rowData} setEditing={setEditing}/>
                    ) : (
                        <RenderCellsShow isCollapsible={isCollapsible} rowData={rowData} setEditing={setEditing} removing={removing} setRemoving={setRemoving}/>
                    )}
                </TableRow>
                {isOpen[rowData.id] && rows.filter(i=>i.parentId===rowData.id).map((row,ind)=>(
                    <TRow key={'c'+ind} rowData={row} index={index} subIndex={ind} collapsible={isParent} prtIndx={prtIndx+1}/>
                ))}
            </React.Fragment>
        )
    }
    Pagination = ()=>{
        const parentRows = this.props.rows.filter(i=>!i.parentId || i.parentId===i.id)
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
                labelRowsPerPage="میزان نمایش در هر صفحه"
                labelDisplayedRows={({from, to, count}) => (` نمایش ${from} - ${to} از ${count} داده `)}
            />
        )
    }
    render() {
        return super.render();
    }
}
export default withStyles(useStyles)(AccessCollapseTable);
