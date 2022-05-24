import React from "react";
import {withStyles} from "@material-ui/styles";
import TableProBase from "../../../components/TableProBase";
import PropTypes from "prop-types";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {Box} from "@material-ui/core";
import FileTypeIcon from "./FileTypeIcon";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import AddIcon from "@material-ui/icons/Add";
import FilterListRoundedIcon from "@material-ui/icons/FilterListRounded";

export const useStyles = theme => ({
    root: {
        '& thead tr th': {
            '& .MuiCheckbox-root':{
                color: theme.palette.text.secondary,
            },
            '& .MuiSvgIcon-root':{
                color: theme.palette.text.secondary,
            },
            padding: '11px 14px',
            '& .MuiTypography-body1':{
                lineHeight: '26px',
                color: theme.palette.text.secondary,
            }
        },
        '& tbody tr': {
            cursor: "pointer",
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
    },
});

class FileExplorer extends TableProBase{
    constructor(props) {
        super(props);
        this.defaultTexts = {
            emptyRow: "فایلی برای نمایش وجود ندارد!",
        }
        this.state = {
            ...this.state,
            rowsPerPage:    10,
        }
    }
    static propTypes = {
        texts:          PropTypes.objectOf(PropTypes.string),
        className:      PropTypes.string,
        title:          PropTypes.object,
        defaultOrderBy: PropTypes.string,
        columns:        PropTypes.arrayOf(PropTypes.object).isRequired,
        rows:           PropTypes.arrayOf(PropTypes.object),
        setRows:        PropTypes.func,
        selectedRows:   PropTypes.arrayOf(PropTypes.object),
        setSelectedRows:PropTypes.func,
        isSelected:     PropTypes.func,
        loading:        PropTypes.bool,
        size:           PropTypes.oneOf(["small","medium"]),
        showTitleBar:   PropTypes.bool,
        showRowNumber:  PropTypes.bool,
        rowNumberWidth: PropTypes.string,
        fixedLayout:    PropTypes.bool,
        pagination:     PropTypes.bool,
        removeCallback: PropTypes.func,
        removeCondition:PropTypes.func,
        selectable:     PropTypes.bool,
        singleSelect:   PropTypes.bool,
        actions:        PropTypes.arrayOf(PropTypes.object),
        rowActions:     PropTypes.arrayOf(PropTypes.object),
        filter:         PropTypes.oneOf([false, "external"]),
        filterForm:     PropTypes.node,
        add:            PropTypes.oneOf([false, "external", "inline"]),
        addForm:        PropTypes.node,
        addCallback:    PropTypes.func,
        edit:           PropTypes.oneOf([false, "external", "inline", "callback"]),
        editForm:       PropTypes.node,
        editCallback:   PropTypes.func,
        editCondition:  PropTypes.func,
        exportCsv:      PropTypes.string,
        csvRenderer:    PropTypes.func,
        sortable:       PropTypes.bool,
        dblClickCallback:PropTypes.func,
        formActions:    PropTypes.arrayOf(PropTypes.object),
        showForm:       PropTypes.string,
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(nextProps.rows!==this.state.rows){
            this.setState({page: 0, rows: nextProps.rows})
        }
        if(nextProps.showForm!==this.state.showForm){
            this.setState({showForm: nextProps.showForm})
        }
        return true
    }

    TRow ({index, rowData}){
        const {classes, selectedRows, setSelectedRows, singleSelect, isSelected, selectable, showRowNumber, dblClickCallback} = this.props;
        const [removing, setRemoving] = React.useState(false);
        const [editing, setEditing] = React.useState(false);
        const [click, setClick] = React.useState(0);
        const RenderCellsEdit = this.RenderCellsEdit.bind(this)
        const RenderCellsShow = this.RenderCellsShow.bind(this)
        const handleClick = (name) => {
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
        React.useEffect(() => {
            const timer = setTimeout(() => {
                // simple click
                if (click === 1) handleClick(rowData);
                setClick(0);
            }, 250);
            // the duration between this click and the previous one
            // is less than the value of delay = double-click
            if (click === 2) {
                handleClick(rowData);
                dblClickCallback(rowData);
            }
            return () => clearTimeout(timer);
        }, [click]);
        return (
            <TableRow key={index} hover selected={isItemSelected} className={(removing)?classes.selected:""}
                      onClick={() => setClick(prev => prev + 1)}
            >
                <TableCell padding="checkbox">
                    <FileTypeIcon fileType={rowData.fileType}/>
                </TableCell>
                {showRowNumber &&
                <TableCell>{index+1}</TableCell>
                }
                {editing? (
                    <RenderCellsEdit rowData={rowData} setEditing={setEditing}/>
                ) : (
                    <RenderCellsShow rowData={rowData} setEditing={setEditing} removing={removing} setRemoving={setRemoving}/>
                )}
            </TableRow>
        )
    }
    ActionGroup = ()=>{
        const {classes} = this.props;
        const CSVExport = this.CSVExport.bind(this)
        return (
            <React.Fragment>
                <ToggleButtonGroup size="small" className={classes.marginEnd}>
                    {this.props.actions.map((act,ind)=>(
                        <Tooltip key={ind} title={act.title}>
                            <ToggleButton onClick={act.onClick} size={"small"} value={act.id} selected={this.state.showForm===act.id} disabled={act.disabled}>
                                <act.icon/>
                            </ToggleButton>
                        </Tooltip>
                    ))}
                    {this.props.exportCsv && ( <CSVExport/> )}
                </ToggleButtonGroup>
                {/*<ToggleButtonGroup size="small" className={classes.marginEnd}>*/}
                {/*    {this.props.formActions.map((act,ind)=>(*/}
                {/*        <Tooltip key={ind} title={act.title}>*/}
                {/*            <ToggleButton size={"small"} value={act.id}*/}
                {/*                          onClick={()=> this.toggleShowForm(act.id)}*/}
                {/*                          selected={this.state.showForm===act.id}>*/}
                {/*                <act.icon/>*/}
                {/*            </ToggleButton>*/}
                {/*        </Tooltip>*/}
                {/*    ))}*/}
                {/*</ToggleButtonGroup>*/}
                <ToggleButtonGroup size="small" >
                    {this.props.add && (
                        <Tooltip title="افزودن">
                            <ToggleButton
                                size={"small"}
                                onClick={()=> this.toggleShowForm(`add-${this.props.add}`)}
                                selected={this.state.showForm===`add-${this.props.add}`} value="showAddForm"
                            >
                                <AddIcon/>
                            </ToggleButton>
                        </Tooltip>
                    )}
                    {this.props.filter && (
                        <Tooltip title="فیلتر">
                            <ToggleButton
                                size={"small"}
                                onClick={()=> this.toggleShowForm(`filter-${this.props.filter}`)}
                                selected={this.state.showForm===`filter-${this.props.filter}`} value="showFilter">
                                <FilterListRoundedIcon/>
                            </ToggleButton>
                        </Tooltip>
                    )}
                </ToggleButtonGroup>
            </React.Fragment>
        )
    }
    render() {
        const {classes} = this.props;
        if(!this.props.pagination && this.state.rowsPerPage!==100){
            this.setState({rowsPerPage: 100})
        }
        const cx = require('classnames');
        const handleClose = ()=> {
            this.setState({showForm: null})
        }
        return(
            <div className={this.props.className}>
                {this.props.showTitleBar && (
                    <CardHeader
                        title={this.props.title}
                        action={<this.ActionGroup/>}
                    />
                )}
                {this.props.formActions.map((item,index)=>(
                    <Collapse key={index} in={this.state.showForm===item.id}>
                        <Box p={2}>
                            {React.cloneElement(item.form, {handleClose})}
                        </Box>
                    </Collapse>
                ))}
                {this.props.filter==="external" && (
                    <Collapse in={this.state.showForm==="filter-external"} className={classes.borderTop}>
                        <Box p={2}>
                            {this.props.filterForm}
                        </Box>
                    </Collapse>
                )}
                {/*{this.props.add==="external" && <this.ExternalAddForm/> }*/}
                {/*{(this.props.edit==="external" && this.state.showForm==="edit-external") && <this.ExternalEditForm/> }*/}
                <TableContainer>
                    <Table size={this.props.size} className={cx(classes.root,this.props.fixedLayout && classes.tableLayoutFixed,this.props.className)}>
                        <this.THead/>
                        <this.TTool/>
                        <this.TBody/>
                    </Table>
                </TableContainer>
                {this.props.pagination && (
                    <this.Pagination/>
                )}
            </div>
        )
    }
}

export default withStyles(useStyles)(FileExplorer);
