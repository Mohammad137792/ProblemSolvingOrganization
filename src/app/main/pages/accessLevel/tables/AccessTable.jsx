import React, { useEffect } from "react";

import { TableCell, IconButton, TableHead, TableRow, Checkbox, TableBody, TablePagination, Typography, Tooltip, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import { useStyles } from "../../../components/TablePro"
import TableProBase from "../../../components/TableProBase";

import DisplayField from "../../../components/DisplayField";
import Switch from "@material-ui/core/Switch";
import FormInput from "../../../components/formControls/FormInput";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import { useDispatch, useSelector } from "react-redux";
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";


function requiredPlaceholder(label, required) {
    return `${label}${required ? '*' : ''}`
}


function getDateString(date) {
    let moment = require('moment-jalaali')
    return date ? moment(date).format('jYYYY/jM/jD') : "-"
}

function showIndicator(value, indicator) {
    return <Switch checked={value === indicator.true} size="small" style={{ cursor: 'default' }} />
}


function getCellContent(col, rowData, isParent) {

    let value;
    switch (col.type) {
        case "date":
            value = getDateString(rowData[col.name])
            break
        case "select":
            const otherProps = {
                ...(col.optionLabelField && { optionLabelField: col?.optionLabelField }),
                ...(col.optionIdField && { optionIdField: col?.optionIdField }),
            }
            value = <DisplayField value={rowData?.[col?.name]} options={col?.options} appendOptions={col?.appendOptions} {...otherProps} />//getEnumDescription(enums,col.options,rowData[col.name])
            break
        case "indicator":
            value = showIndicator(rowData[col.name], col.indicator ?? { true: "Y", false: "N" })
            break
        case "render":
            value = col.render(rowData)
            break
        default:
            value = isParent ? rowData : rowData?.[col?.name] ?? "-";
    }



    return value
}

class AcessTable extends TableProBase {
    constructor() {
        super();
    }

    THead = () => {
        const { columns, showRowNumber, rowNumberWidth = this.props.fixedLayout ? "35px" : "1%", selectable } = this.props
        const HeadCellSelect = this.HeadCellSelect.bind(this)
        const HeadCellNumber = this.HeadCellNumber.bind(this)
        const HeadCellLabel = this.HeadCellLabel.bind(this)
        return (
            <TableHead>
                <TableRow>
                    <TableCell style={{ width: rowNumberWidth }} />
                    {selectable && <HeadCellSelect />}
                    {showRowNumber && <HeadCellNumber />}
                    {columns.map((col) => (
                        <HeadCellLabel col={col} />
                    ))}
                </TableRow>
            </TableHead>
        )
    }
    TBody = () => {
        const { columns, rows, loading, selectable, showRowNumber, pagination } = this.props;
        const { rowsPerPage } = this.state;
        const rowsHeight = pagination ? `${53 * rowsPerPage}px` : "53px";
        const colsCount = columns.length + (showRowNumber ? 1 : 0) + (selectable ? 1 : 0)
        const RowLoading = this.RowLoading.bind(this)
        const RowEmpty = this.RowEmpty.bind(this)
        const RenderRows = this.RenderRows.bind(this)
        const RenderRemindRow = this.RenderRemindRow.bind(this)


        // ['a', 'b']

        // const parentRowss = rows?.length && rows.filter(i => !i.parentSkillId || i.parentSkillId === i.skillId)

        const parentRows = Object.keys(rows)






        return (
            <TableBody>
                {loading ? (
                    <RowLoading colSpan={colsCount} height={rowsHeight} />
                ) : parentRows?.length > 0 ? (
                    <>
                        <RenderRows rows={parentRows} />
                        {/* <RenderRemindRow  /> */}
                    </>
                ) : (
                    <RowEmpty colSpan={colsCount} height={rowsHeight} />
                )}
            </TableBody>
        )
    }
    TRow({ index, rowData, collapsible = true, subIndex }) {
        const { classes, rows, selectedRows, setSelectedRows, isSelected, selectable, showRowNumber } = this.props;
        const [removing, setRemoving] = React.useState(false);
        const [editing, setEditing] = React.useState(false);
        const [open, setOpen] = React.useState(false);
        const RenderCellsEdit = this.RenderCellsEdit.bind(this)
        const RenderCellsShow = this.RenderCellsShow.bind(this)
        const TRow = this.TRow.bind(this)



        const isCollapsible = rows?.[rowData]?.length ? collapsible : false
        const isParent = rows?.[rowData] ? true : collapsible

        const handleClick = (event, name) => {
            if (selectable) {
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
        const isItemSelected = isSelected(rowData, selectedRows);
        return (
            <React.Fragment>
                <TableRow key={index} hover selected={isItemSelected} className={(removing) ? classes.selected : ""}
                    onClick={(event) => handleClick(event, rowData)}
                >
                    <TableCell>
                        {isCollapsible &&
                            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        }
                    </TableCell>

                    {showRowNumber &&
                        <TableCell>{`${index + 1}${isParent ? "" : ` - ${subIndex + 1}`}`}</TableCell>
                    }
                    {editing ? (
                        <RenderCellsEdit rowData={rowData} setEditing={setEditing} />
                    ) : (
                        <RenderCellsShow isParent={isParent} rowData={rowData} setEditing={setEditing} removing={removing} setRemoving={setRemoving} />
                    )}
                </TableRow>

                {open && rows[rowData].length && rows[rowData].map((row, ind) => (
                    <TRow key={'c' + ind} rowData={row} index={index} subIndex={ind} collapsible={false} />
                ))}
            </React.Fragment>
        )
    }
    Pagination = () => {


        const parentRows = Object.keys(this.props.rows)

        // const parentRows = this.props.rows?.length && this.props.rows.filter(i => !i.parentSkillId)
        const handleChangePage = (event, newPage) => {
            this.setState({ page: newPage });
        };
        const handleChangeRowsPerPage = (event) => {
            this.setState({
                page: 0,
                rowsPerPage: parseInt(event.target.value, 10)
            });
        };
        return (
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={parentRows?.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                labelRowsPerPage="میزان نمایش در هر صفحه"
                labelDisplayedRows={({ from, to, count }) => (` نمایش ${from} - ${to} از ${count} داده `)}
            />
        )
    }



    RenderCellsShow({ rowData, setEditing, removing, setRemoving, isParent, ...a }) {
        const { classes, columns, rows, setRows, rowActions, size, edit, editCallback, setTableContent2 } = this.props;
        const texts = Object.assign({}, this.defaultTexts, this.props.texts)
        const [displayDialog, setDisplayDialog] = React.useState(false);
        const [loading, setLoading] = React.useState(false);
        // const [formData, setFormData] = React.useState(rowData);


        const [formData, setFormData] = React.useState(rowData?.artifactGroupId ? rowData : { artifactGroupId: rowData, });


        const dispatch = useDispatch();



        const colDa = columns.slice(0, -1).map((col, idx) => col)

        console.log("showcolumns", columns)
        console.log("showcolumns colDa", colDa)


        // useEffect(() =>{
        //     console.log("asdkvavava" ,)
        // },[])




        function handleEditCancel() {
            if (!isParent) {
                const dateAdd = {

                }
                // let newData = Object.assign([], rows);

            }


            const ind = rows.indexOf(rowData)
            let newData = Object.assign([], rows);
            newData[ind] = rowData;
            console.log("showcolumns rowData", rowData)
            console.log("showcolumns newData[ind]", newData[ind])

            setRows(newData)
            setEditing(false)
        }
        function handleEdit() {

            setLoading(true)
            const artifactGroupId = formData.artifactGroupId
            const ind = rows[artifactGroupId].indexOf(rowData)
            let newData = Object.assign({}, rows);
            newData[artifactGroupId][ind] = formData;
            console.log("DataOF newData", newData)

            setRows(newData)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, texts.editAlertSuccess));



        }



        return (
            <React.Fragment>
                {   columns.slice(0, -1).map((col, idx) => (
                    <TableCell key={idx + col.name} idx={idx} style={col.style}>
                        <this.CellContent isParent={isParent} col={col} rowData={rowData}
                            setFormData={setFormData} formData={formData} rows={rows} setRows={setRows}
                        />
                    </TableCell>
                ))}
                {columns.slice(-1).map((col, ind) => (
                    <TableCell key={ind} style={{ ...col.style, paddingLeft: '110px' }}>
                        <this.CellContent isParent={isParent} col={col} rowData={rowData} rows={rows}
                            setFormData={setFormData} formData={formData} setRows={setRows}
                        />

                        { !isParent && < div className={classes.editingActionBox}>
                            <Tooltip title="لغو">
                                <IconButton onClick={handleEditCancel} size={texts.size} disabled={loading}>
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="تایید">
                                <IconButton onClick={handleEdit} size={texts.size}>
                                    {loading ? <CircularProgress size={24} /> : <DoneIcon />}
                                </IconButton>
                            </Tooltip>
                        </div>}

                    </TableCell>
                ))
                }
            </React.Fragment>
        )
    }


    CellContent({ col, rowData, setFormData, idx ,formData, isParent, rows, setRows }) {
        let value = getCellContent(col, rowData, isParent);
        if (col?.bool && !isParent) {
            return (
                <FormInput {...col} style={{}} placeholder={requiredPlaceholder(col.label, col.required)}
                    label={null} size="small" variant="standard"
                    grid={false} isParent={isParent}
                    valueObject={formData} valueHandler={setFormData}
                    rowDatas={rowData}
                    setRows={setRows}
                    rowss={rows}

                />
            )
        }

        return (
            <Typography noWrap>
                {value}
            </Typography>
        )

    }
    render() {
        return super.render();
    }
}
export default withStyles(useStyles)(AcessTable);
