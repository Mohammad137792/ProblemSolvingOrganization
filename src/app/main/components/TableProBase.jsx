import Switch from "@material-ui/core/Switch";
import DisplayField from "./DisplayField";
import React, { useState } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableBody from "@material-ui/core/TableBody";
import { useDispatch, useSelector } from "react-redux";
import { ALERT_TYPES, setAlertContent } from "../../store/actions/fadak";
import FormInput from "./formControls/FormInput";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import { Button, MenuItem, Select } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import TablePagination from "@material-ui/core/TablePagination";
import { getDescription } from "./formControls/FormInputSelect";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { CSVLink } from "react-csv";
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";
import AddIcon from "@material-ui/icons/Add";
import FilterListRoundedIcon from "@material-ui/icons/FilterListRounded";
import Collapse from "@material-ui/core/Collapse";
import CardHeader from "@material-ui/core/CardHeader";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

function requiredPlaceholder(label, required) {
    return `${label}${required ? '*' : ''}`
}

function validateForm(columns, formValues, setFormValidation) {
    return new Promise((resolve, reject) => {
        let requiredError = false
        let validationBuffer = {}
        const buffer = (group, name, value) => {
            if (group) {
                validationBuffer[group][name] = value
            } else {
                validationBuffer[name] = value
            }
        }
        for (let i in columns) {
            const input = columns[i]
            if (input.required && !formValues[input.name]) {
                buffer(input.group, input.name, {
                    error: true
                })
                requiredError = true
            }
        }
        setFormValidation(validationBuffer)
        if (requiredError) {
            reject()
        } else {
            resolve()
        }
    })
}

function getDateString(date) {
    let moment = require('moment-jalaali')
    return date ? moment(date).format('jYYYY/jM/jD') : "-"
}

function getHourString(value) {
    if (value) {
        const h = Math.floor(value / 60)
        const m = value - h * 60
        const hh = h < 10 ? "0" + h : h.toString()
        const mm = m < 10 ? "0" + m : m.toString()
        return `${hh}:${mm}`
    }
    return ""
}

function showIndicator(value, indicator) {
    return <Switch checked={value === indicator.true} size="small" style={{ cursor: 'default' }} />
}


function IsChecked(data, name, rowData, indx) {
    if (data[indx]) {
        let children = data.filter(x => x.userPermissionId.startsWith(data[indx].userPermissionId + "/")),
            checkedCountd = children.filter(x => x[name])
        return checkedCountd.length == children.length
    }

}

function IsAllUnchecked(data, name, rowData, indx) {
    if (data[indx]) {
        let children = data.filter(x => x.userPermissionId.startsWith(data[indx].userPermissionId + "/")),
            checkedCountd = children.filter(x => x[name])
        return checkedCountd.length == 0
    }

}

function isIndeterminate(data, name, rowData, indx) {
    if (data[indx]) {
        let children = data.filter(x => x.userPermissionId.startsWith(data[indx].userPermissionId + "/")),
            checkedCountd = children.filter(x => x[name])

        return checkedCountd.length > 0 && checkedCountd.length < children.length
    }
}

function showCheckBox(col, rowData, indx, isCollapsible) {
    let checkBoxElement = isCollapsible ?
        <Checkbox
            onClick={() => { changeCheckbox(col, col.data, col.name, rowData, indx) }}
            checked={IsChecked(col.data, col.name, rowData, indx) || rowData[col.name]}
            indeterminate={isIndeterminate(col.data, col.name, rowData, indx)}
            style={{ padding: '0' }}
        /> :
        <Checkbox
            onClick={() => { changeCheckbox(col, col.data, col.name, rowData, indx) }}
            checked={rowData[col.name]}
            style={{ padding: '0' }}
        />

    return checkBoxElement
}

const changeCheckbox = (col, data, name, rowData, indx) => {
    let nData = data.slice(0),
        isParent = !!nData.find(x => x.parentId == nData[indx].id),
        newState = !nData[indx][name],
        children = nData.filter(x => x.userPermissionId.startsWith(nData[indx].userPermissionId + "/")).map(x => x.id)
    if (isParent) {
        for (let item of nData) {
            if (children.indexOf(item.id) >= 0) {
                item[name] = newState
            }
        }

    }

    nData[indx][name] = newState

    let parentId = nData[indx].parentId
    while (parentId) {
        let ind = nData.findIndex(x => x.id == parentId)
        if (IsChecked(nData, name, rowData, ind)) {
            nData[ind][name] = true
        }
        parentId = nData[ind].parentId
    }

    col.setData(nData)
}



function getCellContent(col, rowData, indx, isCollapsible) {
    let value


    switch (col.type) {
        case "date":
            value = getDateString(rowData[col.name])
            break
        case "hour":
            value = getHourString(rowData[col.name])
            break
        case "select":
        case "multiselect":
            const otherProps = {
                ...(col.optionLabelField && { optionLabelField: col.optionLabelField }),
                ...(col.optionIdField && { optionIdField: col.optionIdField }),
                ...(col.type === "multiselect" && { multiselect: true }),
            }
            value = <DisplayField value={rowData[col.name]} options={col.options} appendOptions={col.appendOptions} {...otherProps} />//getEnumDescription(enums,col.options,rowData[col.name])
            break
        case "indicator":
            value = showIndicator(rowData[col.name], col.indicator ?? { true: "Y", false: "N" })
            break
        case "render":
            value = col.render(rowData)
            break
        case "accessCheckboxes":
            value = showCheckBox(col, rowData, indx, isCollapsible)
            break
        default:
            value = rowData[col.name] ?? "-";
    }
    return value
}

class TableProBase extends React.Component {
    constructor(props) {
        super(props);
        this.defaultTexts = {
            removeDialog: "آیا از حذف این ردیف اطمینان دارید؟",
            removeAlertSuccess: "ردیف مورد نظر با موفقیت حذف شد.",
            removeAlertFailed: "خطا در عملیات حذف!",
            editAlertSuccess: "تغییرات ردیف مورد نظر با موفقیت انجام شد.",
            editAlertFailed: "خطا در عملیات ویرایش!",
            addAlertSuccess: "ردیف مورد نظر با موفقیت اضافه شد.",
            addAlertFailed: "خطا در عملیات افزودن!",
            alertFormRequired: "باید تمام فیلدهای ضروری وارد شوند!",
            emptyRow: "داده ای وجود ندارد!",
        }
        this.state = {
            order: "asc",
            orderBy: "",
            rowsPerPage: 5,
            page: 0,
            rows: [],
            // selected:       [],
            formData: {},
            showForm: null,
            showFilter: false,
            showAddForm: false,
        }
        // this.TRow = this.TRow.bind(this);
    }
    static defaultProps = {
        texts: {},
        className: "",
        title: "",
        defaultOrderBy: "",
        columns: [],
        rows: [],
        setRows: null,
        selectedRows: [],
        setSelectedRows: () => { return false },
        isSelected: (row, selectedRows) => selectedRows.indexOf(row) !== -1,
        loading: false,
        size: "medium",
        showTitleBar: true,
        showRowNumber: true,
        // rowNumberWidth: "1%",
        fixedLayout: false,
        pagination: true,
        selectable: false,
        singleSelect: false,
        actions: [],
        rowActions: [],
        rowActionsDrop: null,
        IconComponent: null,
        rowCondition: null,
        filter: false,
        filterForm: null,
        add: false,
        addForm: null,
        addCallback: null,
        edit: false,
        editForm: null,
        editCallback: null,
        editCondition: () => { return true },
        removeCallback: null,
        removeCondition: () => { return true },
        exportCsv: null,
        csvRenderer: null,
        classes: {},
        sortable: true,
        expandable: false,
        rowDetailsRenderer: null,
        lightHeader: false,
    }
    static propTypes = {
        texts: PropTypes.objectOf(PropTypes.string),
        className: PropTypes.string,
        title: PropTypes.string,
        defaultOrderBy: PropTypes.string,
        columns: PropTypes.arrayOf(PropTypes.object).isRequired,
        rows: PropTypes.arrayOf(PropTypes.object),
        setRows: PropTypes.func,
        selectedRows: PropTypes.arrayOf(PropTypes.object),
        setSelectedRows: PropTypes.func,
        isSelected: PropTypes.func,
        loading: PropTypes.bool,
        size: PropTypes.oneOf(["small", "medium"]),
        showTitleBar: PropTypes.bool,
        showRowNumber: PropTypes.bool,
        rowNumberWidth: PropTypes.string,
        fixedLayout: PropTypes.bool,
        pagination: PropTypes.bool,
        removeCallback: PropTypes.func,
        removeCondition: PropTypes.func,
        selectable: PropTypes.bool,
        singleSelect: PropTypes.bool,
        actions: PropTypes.arrayOf(PropTypes.object),
        rowActions: PropTypes.arrayOf(PropTypes.object),
        rowActionsDrop: PropTypes.arrayOf(PropTypes.object),
        IconComponent: PropTypes.string,
        rowCondition: PropTypes.func,
        filter: PropTypes.oneOf([false, "external"]),
        filterForm: PropTypes.node,
        add: PropTypes.oneOf([false, "external", "inline"]),
        addForm: PropTypes.node,
        addCallback: PropTypes.func,
        edit: PropTypes.oneOf([false, "external", "inline", "callback"]),
        editForm: PropTypes.node,
        editCallback: PropTypes.func,
        editCondition: PropTypes.func,
        exportCsv: PropTypes.string,
        csvRenderer: PropTypes.func,
        sortable: PropTypes.bool,
        expandable: PropTypes.bool,
        rowDetailsRenderer: PropTypes.func,
        lightHeader: PropTypes.bool,
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.rows !== this.state.rows) {
            this.setState({ page: 0, rows: nextProps.rows })
        }
        return true
    }

    componentDidMount() {
        this.setState({ orderBy: this.props.defaultOrderBy })
    }

    CellContent({ col, rowData, indx, isCollapsible }) {
        let value = getCellContent(col, rowData, indx, isCollapsible);
        return (
            <Typography noWrap>
                {value}
            </Typography>
        )
    }
    HeadCellSelect = () => {
        const { selectedRows, setSelectedRows, singleSelect, rowNumberWidth = this.props.fixedLayout ? "35px" : "1%" } = this.props
        const { rows } = this.state
        const numSelected = selectedRows.length;
        const rowCount = rows.length;
        const handleSelectAllClick = (event) => {
            if (event.target.checked) {
                setSelectedRows(rows);
                return;
            }
            setSelectedRows([]);
        };
        return (
            <TableCell padding={"checkbox"} style={{ width: rowNumberWidth }}>
                {!singleSelect &&
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={handleSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                        style={{ padding: '0' }}
                    />
                }
            </TableCell>
        )
    }
    HeadCellNumber = () => {
        const { rowNumberWidth = this.props.fixedLayout ? "35px" : "1%" } = this.props
        return (
            <TableCell style={{ width: rowNumberWidth }}>
                <Typography noWrap>ردیف</Typography>
            </TableCell>
        )
    }
    HeadCellLabel = ({ col }) => {
        const { classes, sortable } = this.props
        const { orderBy, order } = this.state;
        const handleRequestSort = (event, property) => {
            const isAsc = orderBy === property && order === 'asc';
            this.setState({
                order: isAsc ? 'desc' : 'asc',
                orderBy: property
            });
        };
        const createSortHandler = (property) => (event) => {
            handleRequestSort(event, property);
        };
        return (
            <TableCell key={col.name} style={col.style} >
                {(col.sortable !== false && sortable) ? (
                    <TableSortLabel
                        active={orderBy === col.name}
                        direction={orderBy === col.name ? order : 'asc'}
                        onClick={createSortHandler(col.name)}
                        classes={{ root: classes.sortLabelActive, icon: classes.sortLabelActive }}
                    >
                        <Typography noWrap>{col.label}</Typography>
                    </TableSortLabel>
                ) : (
                    <Typography noWrap>{col.label}</Typography>
                )}
            </TableCell>
        )
    }
    THead = () => {
        const { columns, showRowNumber, selectable, expandable, lightHeader, rowNumberWidth = this.props.fixedLayout ? "35px" : "1%" } = this.props
        const HeadCellSelect = this.HeadCellSelect.bind(this)
        const HeadCellNumber = this.HeadCellNumber.bind(this)
        const HeadCellLabel = this.HeadCellLabel.bind(this)
        return (
            <TableHead>
                <TableRow className={lightHeader ? "light" : ""}>
                    {selectable && <HeadCellSelect />}
                    {showRowNumber && <HeadCellNumber />}
                    {columns.map((col, ind) => (
                        <HeadCellLabel key={ind} col={col} />
                    ))}
                    {expandable &&
                        <TableCell style={{ width: rowNumberWidth }} />
                    }
                </TableRow>
            </TableHead>
        )
    }
    RowLoading({ colSpan, height }) {
        return (
            <TableRow style={{ height: height }}>
                <TableCell colSpan={colSpan}>
                    <Box textAlign="center" color="text.secondary">
                        <CircularProgress />
                        <Typography variant={"body1"}>در حال دریافت اطلاعات</Typography>
                    </Box>
                </TableCell>
            </TableRow>
        )
    }
    RowEmpty({ colSpan, height }) {
        const text = this.defaultTexts.emptyRow
        return (
            <TableRow style={{ height: height }}>
                <TableCell colSpan={colSpan}>
                    <Typography color={"textSecondary"} align={"center"}>
                        {text}
                    </Typography>
                </TableCell>
            </TableRow>
        )
    }
    RowRem({ colSpan, height }) {
        return (
            <TableRow style={{ height: height }}>
                <TableCell colSpan={colSpan}>
                    <Typography color={"textSecondary"} />
                </TableCell>
            </TableRow>
        )
    }
    RenderRows({ rows }) {
        const { orderBy, order, rowsPerPage, page } = this.state;
        const persianAlphabets = [" ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "آ", "ا", "ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ", "د", "ذ", "ر", "ز", "ژ", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "و", "ه", "ی", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        function persianSort(x, y) {
            let i = 0;
            let maxLen = Math.min(x.length, y.length);
            while (persianAlphabets.indexOf(x[i]) === persianAlphabets.indexOf(y[i]) && i <= maxLen) {
                i++;
            }
            if (persianAlphabets.indexOf(x[i]) <
                persianAlphabets.indexOf(y[i])) {
                return -1;
            }
            if (persianAlphabets.indexOf(x[i]) >
                persianAlphabets.indexOf(y[i])) {
                return 1;
            }
            return 0;
        }
        function descendingComparator(a, b, orderBy) {
            if (!orderBy) {
                return 1;
            }
            if (!a[orderBy]) {
                return -1;
            }
            if (!b[orderBy]) {
                return 1;
            }
            if (typeof a[orderBy] === "number") {
                return b[orderBy] - a[orderBy]
            }
            return -persianSort(a[orderBy], b[orderBy])
        }
        function getComparator(order, orderBy) {
            return order === 'desc'
                ? (a, b) => descendingComparator(a, b, orderBy)
                : (a, b) => -descendingComparator(a, b, orderBy);
        }
        function stableSort(array, comparator) {
            const stabilizedThis = array.map((el, index) => [el, index]);
            stabilizedThis.sort((a, b) => {
                const order = comparator(a[0], b[0]);
                if (order !== 0) return order;
                return a[1] - b[1];
            });
            return stabilizedThis.map((el) => el[0]);
        }
        const TRow = this.TRow.bind(this)
        return stableSort(rows, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((rowData, index) => (
                <TRow key={index} index={page * rowsPerPage + index} rowData={rowData} />
            )
            )
    }
    RenderRemindRow() {
        const { columns, pagination, selectable, showRowNumber } = this.props;
        const { rowsPerPage, page, rows } = this.state;
        const colsCount = columns.length + (showRowNumber ? 1 : 0) + (selectable ? 1 : 0)
        const RowRem = this.RowRem.bind(this)
        const rem = rowsPerPage - rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length;
        const remRowsHeight = `${53 * rem}px`;
        if (pagination && rem > 0)
            return <RowRem colSpan={colsCount} height={remRowsHeight} />
        else return null
    }
    TBody = () => {
        const { columns, loading, selectable, showRowNumber, pagination, expandable } = this.props;
        const { rowsPerPage, rows } = this.state;
        const rowsHeight = pagination ? `${53 * rowsPerPage}px` : "53px";
        const colsCount = columns.length + (showRowNumber ? 1 : 0) + (selectable ? 1 : 0) + (expandable ? 1 : 0)
        const RowLoading = this.RowLoading.bind(this)
        const RowEmpty = this.RowEmpty.bind(this)
        const RenderRows = this.RenderRows.bind(this)
        const RenderRemindRow = this.RenderRemindRow.bind(this)
        return (
            <TableBody>
                {loading ? (
                    <RowLoading colSpan={colsCount} height={rowsHeight} />
                ) : rows.length > 0 ? (
                    <>
                        <RenderRows rows={rows} />
                        <RenderRemindRow />
                    </>
                ) : (
                    <RowEmpty colSpan={colsCount} height={rowsHeight} />
                )}
            </TableBody>
        )
    }
    TRow({ index, rowData }) {
        const { classes, selectedRows, setSelectedRows, singleSelect, isSelected, selectable, showRowNumber, rowCondition, columns, expandable, rowDetailsRenderer } = this.props;
        const [removing, setRemoving] = React.useState(false);
        const [editing, setEditing] = React.useState(false);
        const [expanded, setExpanded] = React.useState(false);
        const numberOfCols = columns.length + (showRowNumber ? 1 : 0) + (selectable ? 1 : 0) + (expandable ? 1 : 0)
        const RenderCellsEdit = this.RenderCellsEdit.bind(this)
        const RenderCellsShow = this.RenderCellsShow.bind(this)
        const handleClick = (event, name) => {
            if (selectable) {
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
        const isItemSelected = isSelected(rowData, selectedRows);
        const get_className = () => {
            if (removing)
                return classes.selected
            if (rowCondition) {
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
                            <Checkbox checked={isItemSelected} style={{ padding: '0' }} />
                        </TableCell>
                    )}
                    {showRowNumber &&
                        <TableCell>{index + 1}</TableCell>
                    }
                    {editing ? (
                        <RenderCellsEdit rowData={rowData} setEditing={setEditing} />
                    ) : (
                        <RenderCellsShow rowData={rowData} setEditing={setEditing} removing={removing} setRemoving={setRemoving} />
                    )}
                    {expandable &&
                        <TableCell>
                            <IconButton aria-label="expand row" size="small" onClick={() => setExpanded(!expanded)}>
                                {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>
                    }
                </TableRow>
                {expanded &&
                    <TableRow>
                        <TableCell colSpan={numberOfCols} padding="none">
                            {rowDetailsRenderer(rowData)}
                        </TableCell>
                    </TableRow>
                }
            </React.Fragment>
        )
    }
    RenderCellsEdit({ rowData, setEditing }) {
        const { classes, columns, setRows, editCallback } = this.props;
        const { rows } = this.state
        const texts = Object.assign({}, this.defaultTexts, this.props.texts)
        const dispatch = useDispatch();
        const [loading, setLoading] = React.useState(false);
        const [formData, setFormData] = React.useState(rowData);
        const [formValidation, setFormValidation] = useState({});
        function handleEditCancel() {
            setEditing(false)
        }
        function handleEdit() {
            setLoading(true)
            validateForm(columns, formData, setFormValidation).then(() => {
                const ind = rows.indexOf(rowData)
                editCallback(formData, rowData, ind).then(() => {
                    setLoading(false)
                    setEditing(false)
                    let newData = Object.assign([], rows);
                    newData[ind] = formData;
                    setRows(newData)
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, texts.editAlertSuccess));
                }).catch((message = texts.editAlertFailed) => {
                    setLoading(false)
                    setEditing(false)
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, message));
                })
            }).catch(() => {
                setLoading(false)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, texts.alertFormRequired));
            })
        }

        return (
            <React.Fragment>
                {columns.slice(0, -1).map((col, ind) => (
                    <TableCell key={ind} style={{ ...col.style }}>
                        <FormInput {...col} style={{}} placeholder={requiredPlaceholder(col.label, col.required)} label={null} size="small" variant="standard" grid={false} valueObject={formData} valueHandler={setFormData} validationObject={formValidation} validationHandler={setFormValidation} />
                    </TableCell>
                ))}
                {columns.slice(-1).map((col, ind) => (
                    <TableCell key={ind} style={{ ...col.style, paddingLeft: '110px' }}>
                        <FormInput {...col} style={{}} label={null} placeholder={requiredPlaceholder(col.label, col.required)} size="small" variant="standard" grid={false} valueObject={formData} valueHandler={setFormData} validationObject={formValidation} validationHandler={setFormValidation} />
                        <div className={classes.editingActionBox}>
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
                        </div>
                    </TableCell>
                ))}
            </React.Fragment>
        )
    }
    RenderCellsShow({ rowData, setEditing, removing, setRemoving, isCollapsible }) {
        const { classes, columns, setRows, rowActions, rowActionsDrop, IconComponent, size, edit, editCallback, removeCallback, removeCondition, editCondition } = this.props;
        const { rows } = this.state
        const texts = Object.assign({}, this.defaultTexts, this.props.texts)
        const [displayDialog, setDisplayDialog] = React.useState(false);
        const [loading, setLoading] = React.useState(false);
        const dispatch = useDispatch();
        React.useEffect(() => {
            if (removing) {
                setDisplayDialog(true);
            }
        }, [removing])
        function handleRemoveConfirm() {
            setRemoving(true);
        }
        function handleRemoveCancel() {
            setRemoving(false)
            setDisplayDialog(false);
        }
        function handleRemove() {
            setLoading(true);
            setDisplayDialog(false)
            removeCallback(rowData).then((message = texts.removeAlertSuccess) => {
                setLoading(false)
                setRemoving(false)
                let newData = Object.assign([], rows);
                const ind = newData.indexOf(rowData)
                newData.splice(ind, 1);
                setRows(newData)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, message));
            }).catch((message = texts.removeAlertFailed) => {
                setLoading(false)
                setRemoving(false)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, message));
            })
        }
        const handleEdit = () => {
            switch (edit) {
                case "inline":
                    setEditing(true)
                    break;
                case "external":
                    this.toggleShowForm('edit-external', rowData)
                    break;
                case "callback":
                    editCallback(rowData)
                    break;
                default:
            }
        }

        const indx = rows.indexOf(rowData)

        return (
            <React.Fragment>
                {columns.slice(0, -1).map((col, idx) => (
                    <TableCell key={idx + col.name} style={col.style}>
                        <this.CellContent col={col} isCollapsible={isCollapsible} rowData={rowData} indx={indx} />
                    </TableCell>
                ))}
                {columns.slice(-1).map((col, idx) => (
                    <TableCell key={idx + col.name} style={col.style}>
                        <this.CellContent col={col} isCollapsible={isCollapsible} rowData={rowData} indx={indx} />
                        <div className={classes.actionBox} style={{ display: "flex", flexDirection: "row" }}>
                            {rowActions.filter(i => !i.display || (i.display && i.display(rowData) !== false)).map((act, idx) => (
                                <div style={act.style} key={idx}>
                                    <Tooltip title={act.title}>
                                        <IconButton onClick={() => act.onClick(rowData)} size={size} disabled={(act?.waiting == true || (act?.disabled && act.disabled(rowData) === true)) ? true : false}>
                                            {act?.waiting == true ? <CircularProgress size={20} /> : <act.icon />}
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            ))}

                            {(rowActionsDrop) &&
                                rowActionsDrop.map((act, idx) => (
                                    <div key={idx} >
                                        <Select
                                         MenuProps={{
                                            style: {
                                               maxHeight:500,
                                               marginLeft:"5%",
                                                  },
                                            }}
                                            disableUnderline
                                            style={{
                                                margin:5,
                                                padding:5,
                                                width: '30px',
                                            }}
                                            IconComponent={act.IconComponent}
                                            id="demo-simple-select"
                                        >
                                            {act.value.filter(i => !i.display || (i.display && i.display(rowData) !== false)).map((ico, ind) => (
                                                <div key={ind} >
                                                    <Tooltip title={ico.title}>
                                                        <IconButton onClick={() => ico.onClick(rowData)} size={size} disabled={(ico?.waiting == true || (ico?.disabled && ico.disabled(rowData) === true)) ? true : false}>
                                                            {ico?.waiting == true ? <CircularProgress size={20} /> : <MenuItem ><ico.icon style={ico.style} /></MenuItem>}
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            ))}
                                        </Select>

                                    </div>
                                ))


                            }
                            {(removeCallback && removeCondition(rowData)) &&
                                <React.Fragment>
                                    <Tooltip title="حذف">
                                        <IconButton onClick={handleRemoveConfirm} size={size}>
                                            {loading ? <CircularProgress size={24} /> : <DeleteIcon />}
                                        </IconButton>
                                    </Tooltip>
                                    <Dialog open={displayDialog}
                                        onClose={handleRemoveCancel}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description">
                                        <DialogTitle id="alert-dialog-title">{texts.removeDialog}</DialogTitle>
                                        {/*<DialogContent>*/}
                                        {/*    <DialogContentText id="alert-dialog-description">{texts.removeDialog}</DialogContentText>*/}
                                        {/*</DialogContent>*/}
                                        <DialogActions>
                                            <Button onClick={handleRemoveCancel} color="primary">خیر</Button>
                                            <Button onClick={handleRemove} color="primary" autoFocus>بلی</Button>
                                        </DialogActions>
                                    </Dialog>
                                </React.Fragment>
                            }
                            {(edit && editCondition(rowData)) &&
                                <Tooltip title="ویرایش">
                                    <IconButton onClick={handleEdit} size={size}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                        </div>
                    </TableCell>
                ))}
            </React.Fragment>
        )
    }
    toggleShowForm = (form, formData = {}) => {
        if (form && form !== this.state.showForm) {
            this.setState({
                showForm: form,
                formData
            })
        } else {
            this.setState({
                showForm: null,
                formData: {}
            })
        }
    }
    ExternalAddForm = () => {
        const { classes = {}, setRows } = this.props;
        const { rows } = this.state
        const texts = Object.assign({}, this.defaultTexts, this.props.texts)
        const dispatch = useDispatch();
        const [formValues, setFormValues] = React.useState({});
        const addSuccessCallback = (newData) => {
            setRows(rows.concat(newData))
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, texts.addAlertSuccess));
            this.toggleShowForm(null)
        }
        const addFailedCallback = (message = texts.addAlertFailed) => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, message));
        }
        return (
            <Collapse in={this.state.showForm === "add-external"} className={classes.borderTop}>
                <Box p={2}>
                    {React.cloneElement(this.props.addForm, {
                        formValues, setFormValues,
                        successCallback: addSuccessCallback,
                        failedCallback: addFailedCallback,
                        handleClose: () => this.toggleShowForm(null)
                    })}
                </Box>
            </Collapse>
        )
    }
    ExternalEditForm = () => {
        const [formValues, setFormValues] = React.useState(this.state.formData);
        const { classes, setRows } = this.props;
        const { rows } = this.state
        const texts = Object.assign({}, this.defaultTexts, this.props.texts)
        const dispatch = useDispatch();
        const oldData = this.state.formData
        const editSuccessCallback = (newData) => {
            let newRows = Object.assign([], rows)
            const ind = newRows.indexOf(oldData)
            newRows[ind] = newData
            setRows(newRows)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, texts.editAlertSuccess));
            this.toggleShowForm(null)
        }
        const editFailedCallback = (message = texts.editAlertFailed) => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, message));
        }
        return (
            <Collapse in={this.state.showForm === "edit-external"} className={classes.borderTop}>
                <Box p={2}>
                    {React.cloneElement(this.props.editForm, {
                        formValues, setFormValues, oldData,
                        successCallback: editSuccessCallback,
                        failedCallback: editFailedCallback,
                        handleClose: () => this.toggleShowForm(null)
                    })}
                </Box>
            </Collapse>
        )
    }
    InlineAddForm() {
        const { classes, columns, setRows, showRowNumber, addCallback } = this.props;
        const { rows } = this.state
        const texts = Object.assign({}, this.defaultTexts, this.props.texts)
        const dispatch = useDispatch();
        const [loading, setLoading] = React.useState(false);
        const [formData, setFormData] = React.useState({});
        const [formValidation, setFormValidation] = useState({});
        const handleAddConfirm = () => {
            setLoading(true)
            validateForm(columns, formData, setFormValidation).then(() => {
                addCallback(formData).then((newData) => {
                    setRows(rows.concat(newData))
                    setLoading(false)
                    handleAddCancel()
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, texts.addAlertSuccess));
                }).catch((message = texts.addAlertFailed) => {
                    setLoading(false)
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, message));
                })
            }).catch(() => {
                setLoading(false)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, texts.alertFormRequired));
            })

        }
        const handleAddCancel = () => {
            setFormData({})
            this.toggleShowForm(null)
        }
        return (
            <TableRow className={classes.formRow}>
                {showRowNumber && <TableCell />}
                {columns.slice(0, -1).map((col, ind) => (
                    <TableCell key={ind + col.name} style={{ ...col.style }}>
                        <FormInput {...col} style={{}} label={null} placeholder={requiredPlaceholder(col.label, col.required)} size="small" variant="standard" grid={false} valueObject={formData} valueHandler={setFormData} validationObject={formValidation} validationHandler={setFormValidation} />
                    </TableCell>
                ))}
                {columns.slice(-1).map((col) => (
                    <TableCell key={col.name} style={{ ...col.style, paddingLeft: '110px' }}>
                        <FormInput {...col} style={{}} label={null} placeholder={requiredPlaceholder(col.label, col.required)} size="small" variant="standard" grid={false} valueObject={formData} valueHandler={setFormData} validationObject={formValidation} validationHandler={setFormValidation} />
                        <div className={classes.editingActionBox}>
                            <Tooltip title="لغو">
                                <IconButton onClick={handleAddCancel} size={texts.size} disabled={loading}>
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="تایید">
                                <IconButton onClick={handleAddConfirm} size={texts.size}>
                                    {loading ? <CircularProgress size={24} /> : <DoneIcon />}
                                </IconButton>
                            </Tooltip>
                        </div>
                    </TableCell>
                ))}
            </TableRow>
        )
    }
    TTool = () => {
        const InlineAddForm = this.InlineAddForm.bind(this)
        if (this.state.showForm === "add-inline")
            return (
                <TableBody>
                    <InlineAddForm />
                </TableBody>
            )
        return null
    }
    getDataForExport = () => {
        const { rows } = this.state
        return rows
    }
    CSVExport = () => {
        const { classes, csvRenderer, exportCsv, columns } = this.props;
        const data = this.getDataForExport()
        const lists = useSelector(({ fadak }) => fadak.constData.list);
        function renderCsv(rows) {
            const csvData = rows.map((row, ind) => {
                let csvRow = { "ردیف": ind + 1 }
                columns.map(col => {
                    if (col.type === 'select') {
                        csvRow[col.label] = getDescription(col, row[col.name], lists)
                    } else if (col.type === 'indicator') {
                        const indicator = col.indicator ?? { true: "Y", false: "N" }
                        csvRow[col.label] = row[col.name] === indicator.true ? "فعال" : "غیرفعال"
                    } else {
                        csvRow[col.label] = getCellContent(col, row)
                    }
                })
                return csvRow
            })
            return csvData
        }
        return (
            <CSVLink data={csvRenderer ? csvRenderer(data) : renderCsv(data)} filename={exportCsv + ".csv"} className={classes.dContent}>
                <Tooltip title="خروجی اکسل">
                    <ToggleButton size={"small"}>
                        <AssignmentReturnedIcon />
                    </ToggleButton>
                </Tooltip>
            </CSVLink>
        )
    }
    ActionGroup = () => {
        const { classes } = this.props;
        const CSVExport = this.CSVExport.bind(this)
        return (
            <React.Fragment>
                <ToggleButtonGroup size="small" className={classes.marginEnd}>
                    {/*<ButtonGroup color={"primary"} className={classes.marginEnd}>*/}
                    {this.props.actions.map((act, ind) => (
                        <Tooltip key={ind} title={act.title}>
                            <ToggleButton onClick={act.onClick} size={"small"} value={ind}>
                                <act.icon />
                            </ToggleButton>
                        </Tooltip>
                    ))}
                    {this.props.exportCsv && (<CSVExport />)}
                    {/*<Tooltip title="Log">*/}
                    {/*    <Button onClick={()=>console.log('table states:',this.state)} size={"small"}>*/}
                    {/*        <DoneIcon/>*/}
                    {/*    </Button>*/}
                    {/*</Tooltip>*/}
                    {/*</ButtonGroup>*/}
                </ToggleButtonGroup>
                <ToggleButtonGroup size="small" >
                    {this.props.add && (
                        <Tooltip title="افزودن">
                            <ToggleButton
                                size={"small"}
                                onClick={() => this.toggleShowForm(`add-${this.props.add}`)}
                                selected={this.state.showForm === `add-${this.props.add}`} value="showAddForm"
                            >
                                <AddIcon />
                            </ToggleButton>
                        </Tooltip>
                    )}
                    {this.props.filter && (
                        <Tooltip title="فیلتر">
                            <ToggleButton
                                size={"small"}
                                onClick={() => this.toggleShowForm(`filter-${this.props.filter}`)}
                                selected={this.state.showForm === `filter-${this.props.filter}`} value="showFilter">
                                <FilterListRoundedIcon />
                            </ToggleButton>
                        </Tooltip>
                    )}
                </ToggleButtonGroup>
            </React.Fragment>
        )
    }
    Pagination = () => {
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
                count={this.state.rows.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                backIconButtonText="صفحه قبلی"
                nextIconButtonText="صفحه بعدی"
                labelRowsPerPage="میزان نمایش در هر صفحه"
                labelDisplayedRows={({ from, to, count }) => (` نمایش ${from} - ${to} از ${count} داده `)}
            />
        )
    }
    render() {
        const { classes } = this.props;
        if (!this.props.pagination && this.state.rowsPerPage !== 100) {
            this.setState({ rowsPerPage: 100 })
        }
        const cx = require('classnames');
        return (
            <div className={this.props.className}>
                {this.props.showTitleBar && (
                    <CardHeader
                        title={this.props.title}
                        action={<this.ActionGroup />}
                    />
                )}
                {this.props.filter === "external" && (
                    <Collapse in={this.state.showForm === "filter-external"} className={classes.borderTop}>
                        <Box p={2}>
                            {this.props.filterForm}
                        </Box>
                    </Collapse>
                )}
                {this.props.add === "external" && <this.ExternalAddForm />}
                {(this.props.edit === "external" && this.state.showForm === "edit-external") && <this.ExternalEditForm />}
                <TableContainer>
                    <Table size={this.props.size} className={cx(classes.root, this.props.fixedLayout && classes.tableLayoutFixed, this.props.className)}>
                        <this.THead />
                        <this.TTool />
                        <this.TBody />
                    </Table>
                </TableContainer>
                {this.props.pagination && (
                    <this.Pagination />
                )}
            </div>
        )
    }
}

export default TableProBase
