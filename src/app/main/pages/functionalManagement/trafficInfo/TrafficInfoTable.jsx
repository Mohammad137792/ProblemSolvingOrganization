import React from "react";
import TableProBase from "../../../components/TableProBase";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {withStyles} from "@material-ui/styles";
import TablePro, {useStyles} from "../../../components/TablePro";
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Checkbox from "@material-ui/core/Checkbox";

class TrafficInfoTable extends TableProBase {
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
                    {selectable && <HeadCellSelect/>}
                    {showRowNumber && <HeadCellNumber/>}
                    {columns.map((col,ind)=>(
                        <HeadCellLabel key={ind} col={col}/>
                    ))}
                    <TableCell style={{width:rowNumberWidth}}/>
                </TableRow>
            </TableHead>
        )
    }
    TRow ({index, rowData}){
        const {classes, selectedRows, setSelectedRows, singleSelect, isSelected, selectable, showRowNumber, rowCondition, columns, innerColumns} = this.props;
        const [removing, setRemoving] = React.useState(false);
        const [editing, setEditing] = React.useState(false);
        const [open, setOpen] = React.useState(false);
        const numberOfCols = 1 + columns.length + (showRowNumber?1:0) + (selectable?1:0)
        const RenderCellsEdit = this.RenderCellsEdit.bind(this)
        const RenderCellsShow = this.RenderCellsShow.bind(this)
        const handleClick = (event, name) => {
            if(selectable) {
                const selectedIndex = selectedRows.indexOf(name);
                let newSelected = [];

                if (singleSelect) {
                    newSelected = newSelected.concat(name);
                } else {
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
                }
                setSelectedRows(newSelected)
            }
        };
        const isItemSelected = isSelected(rowData,selectedRows);
        const get_className = () => {
            if(removing)
                return classes.selected
            if(rowCondition) {
                switch (rowCondition(rowData)) {
                    case "success":
                        return classes.rowSuccess
                    case "warning":
                        return classes.rowWarning
                    case "error":
                        return classes.rowError
                    case "info":
                        return classes.rowInfo
                    case "disabled":
                        return classes.rowDisabled
                    case "default":
                    default:
                        return ""
                }
            }
            return ""
        }
        return (
            <React.Fragment>
                <TableRow key={index} hover selected={isItemSelected} className={get_className()}
                          onClick={(event) => handleClick(event, rowData)}
                >
                    {selectable && (
                        <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} style={{padding:'0'}}/>
                        </TableCell>
                    )}
                    {showRowNumber &&
                    <TableCell>{index+1}</TableCell>
                    }
                    {editing? (
                        <RenderCellsEdit rowData={rowData} setEditing={setEditing}/>
                    ) : (
                        <RenderCellsShow rowData={rowData} setEditing={setEditing} removing={removing} setRemoving={setRemoving}/>
                    )}
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                    </TableCell>
                </TableRow>
                {open &&
                <TableRow>
                    <TableCell colSpan={numberOfCols} padding="none">
                        <TablePro
                            columns={innerColumns}
                            rows={rowData.timesheet}
                            showTitleBar={false}
                        />
                    </TableCell>
                </TableRow>
                }
            </React.Fragment>
        )
    }

    render() {
        return super.render();
    }
}

export default withStyles(useStyles)(TrafficInfoTable);
