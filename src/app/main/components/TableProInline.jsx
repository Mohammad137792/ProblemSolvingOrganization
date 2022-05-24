import React, { useEffect } from 'react'
import TableProBase from './TableProBase'
import {
    TableCell, IconButton, Typography, Tooltip, CircularProgress
} from "@material-ui/core";

import DisplayField from "./DisplayField";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/styles";
import FormInput from "./formControls/FormInput";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import {useDispatch, useSelector} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../store/actions/fadak";




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
        right: "8px",
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


function getCellContent(col, rowData) {

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
            value = rowData?.[col?.name] ?? "-";
    }
    return value
}

class TableProinline extends TableProBase {
    constructor(props) {
        super(props)
        // console.log('dababad', this.props)
        this.state = {
            order: "asc",
            orderBy: "",//this.props.defaultOrderBy,
            rowsPerPage: 5,
            page: 0,
            // selected:       [],
            formData: {},
            showForm: null,
            showFilter: false,
            showAddForm: false,
            dataSate: [],
            setEd: false,
        }
    }


    RenderCellsShow({ rowData, setEditing, removing, setRemoving, ...a }) {
        const { classes, columns, rows, setRows, rowActions, size, edit, editCallback, setTableContent2 } = this.props;
        const texts = Object.assign({}, this.defaultTexts, this.props.texts)
        const [displayDialog, setDisplayDialog] = React.useState(false);
        const [loading, setLoading] = React.useState(false);
        const [formData, setFormData] = React.useState(rowData);

        const [formData2, setFormData2] = React.useState();

        const dispatch = useDispatch();

        function handleEditCancel() {
            const ind = rows.indexOf(rowData)
            let newData = Object.assign([], rows);
            newData[ind] = rowData;
            setRows(newData)


            setEditing(false)
        }
        function handleEdit() {
            setLoading(true)
            const ind = rows.indexOf(rowData)
            let newData = Object.assign([], rows);
            newData[ind] = formData;
            setRows(newData)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, texts.editAlertSuccess));


        }
        return (
            <React.Fragment>
                {columns.slice(0, -1).map((col, idx) => (
                    <TableCell key={idx + col.name} style={col.style}>
                        <this.CellContent col={col} rowData={rowData}
                            setFormData={setFormData} formData={formData}
                        />
                    </TableCell>
                ))}
                {columns.slice(-1).map((col, ind) => (
                    <TableCell key={ind} style={{ ...col.style, paddingLeft: '110px' }}>
                        <this.CellContent col={col} rowData={rowData}
                            setFormData={setFormData} formData={formData}
                        />  
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


    CellContent({ col, rowData, setFormData, formData }) {
        let value = getCellContent(col, rowData);

        if (col?.bool === 'true') {

            col.options = formData?.s 
            col.optionIdField =  formData?.s[0]?.optionValue !== "qualitative" ? "description"  : "sequenceNum"

            return (


                <FormInput {...col} style={{}} placeholder={requiredPlaceholder(col.label, col.required)} label={null} size="small" variant="standard"
                    grid={false}
                    valueObject={formData} valueHandler={setFormData}
                />
            )
        }
        return (
            <Typography noWrap>
                {value}
            </Typography>
        )

    }

}

export default withStyles(useStyles)(TableProinline)
