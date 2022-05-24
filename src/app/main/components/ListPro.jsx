import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FilterListRoundedIcon from "@material-ui/icons/FilterListRounded";
import ModalPro from "./ModalPro";

const useStyles = makeStyles((theme) => ({
    list: {
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        padding: 0
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    pagination: {
        justifyContent: "center",
        margin: theme.spacing(1),
    },
    listBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        position: "absolute"
    },
    actionBox: {
        marginTop: "8px"
    },
    disabledItem: {
        opacity: 0.54
    },
    row: {
        '& $rowActionBox button': {
            display: 'none'
        },
        '&:hover': {
            '& $rowActionBox button': {
                display: 'inline'
            }
        },
    },
    rowActionBox: {
        width: "fit-content",
        position: "absolute",
        right: "8px",
        top: "0px",
        backdropFilter: "blur(2px)",
    },
}));

export default function ListPro({context, title, itemLabelPrimary, itemLabelSecondary, rowsPerPage=5, filterForm,
                                    disabled, showTitleBar=true, selectable=true, rowActions}) {
    const classes = useStyles();
    const [page, set_page] = React.useState(1)
    const [modalFilterDisplay, set_modalFilterDisplay] = React.useState(false)
    // const [checked, set_checked] = React.useState([])
    const loading = context?.list===null
    const height = rowsPerPage * (itemLabelSecondary?60:50) //"unset"//
    const pagesCount = Math.ceil(context?.length/rowsPerPage) || 1
    const items = context?.list?.slice((page-1) * rowsPerPage,page * rowsPerPage) || []
    const numberOfChecked = context?.list?.filter(i=>i.checked===true).length || 0
    const totalCount = context?.length || 0
    const allChecked = numberOfChecked === totalCount && totalCount !== 0
    const handle_toggle_item = (item) => () => {
        const toggledItem = Object.assign({},item,{checked: item.checked!==true})
        context.update(toggledItem)
        // const currentIndex = checked.findIndex(i=>i[context.pk]===item[context.pk]);
        // const newChecked = [...checked];
        // if (currentIndex === -1) {
        //     newChecked.push(item);
        // } else {
        //     newChecked.splice(currentIndex, 1);
        // }
        // set_checked(newChecked)
    }
    const handle_change_page = (event, value) => {
        set_page(value)
    }
    const handleToggleAll = () => {
        let buffer = Object.assign([],context.list)
        buffer.forEach(itm=>{
            itm.checked = !allChecked
        })
        context.set(buffer)
    };

    return (
        <React.Fragment>
            {showTitleBar && <>
                <CardHeader
                    className={classes.cardHeader}
                    title={title}
                    subheader={selectable ? `${numberOfChecked} از ${totalCount} مورد انتخاب شده ` : null}
                    avatar={ selectable &&
                        <Checkbox
                            onClick={handleToggleAll}
                            checked={allChecked}
                            indeterminate={numberOfChecked !== totalCount && numberOfChecked !== 0}
                            disabled={totalCount === 0 || disabled}
                            inputProps={{'aria-label': 'all items selected'}}
                        />
                    }
                    action={
                        <Box className={classes.actionBox}>
                            {filterForm &&
                            <Tooltip title="فیلتر">
                                <span>
                                    <IconButton onClick={()=>set_modalFilterDisplay(true)} disabled={loading}>
                                        <FilterListRoundedIcon/>
                                    </IconButton>
                                </span>
                            </Tooltip>
                            }
                        </Box>
                    }
                />
                <Divider />
            </>}
            <List className={classes.list} style={{minHeight: height}} dense component="div" role="list">
                {loading && (
                    <Box color="text.secondary" className={classes.listBox}>
                        <CircularProgress />
                        <br/>
                        <Typography variant={"body1"}>در حال دریافت اطلاعات</Typography>
                    </Box>
                )}
                {context?.list!==null && context?.length===0 && (
                    <Box color="text.secondary" className={classes.listBox}>
                        <Typography variant={"body1"}>داده ای وجود ندارد!</Typography>
                    </Box>
                )}
                {context?.list && items.map((item,ind)=>(
                    <CustomListItem
                        key={ind}
                        item={item}
                        // checked={checked}
                        handle_toggle_item={handle_toggle_item(item)}
                        itemLabelPrimary={itemLabelPrimary}
                        itemLabelSecondary={itemLabelSecondary}
                        disabled={disabled || item.disabled}
                        selectable={selectable}
                        rowActions={rowActions}
                    />
                ))}
            </List>
            <Divider/>
            <Pagination
                classes={{ul: classes.pagination}}
                count={pagesCount}
                page={page}
                onChange={handle_change_page}
            />
            {filterForm &&
            <ModalPro
                title={`فیلتر ${title}`}
                open={modalFilterDisplay}
                setOpen={set_modalFilterDisplay}
                content={
                    React.cloneElement(filterForm, {handleClose: ()=>set_modalFilterDisplay(false)})
                }
            />
            }
        </React.Fragment>
    )
}

function CustomListItem({item, handle_toggle_item, itemLabelPrimary, itemLabelSecondary, checked, disabled, selectable, rowActions}) {
    const labelPrimary = typeof itemLabelPrimary==="function" ? itemLabelPrimary(item) : item[itemLabelPrimary]
    const labelSecondary = typeof itemLabelSecondary==="function" ? itemLabelSecondary(item) : item[itemLabelSecondary]
    const classes = useStyles();

    return (
        <ListItem className={classes.row} role="listitem" button={selectable && !disabled} onClick={(selectable && !disabled)?handle_toggle_item:null}>
            {selectable &&
            <ListItemIcon>
                <Checkbox
                    checked={item.checked === true}
                    // checked={checked.indexOf(item) !== -1}
                    tabIndex={-1}
                    disableRipple
                    disabled={disabled}
                />
            </ListItemIcon>
            }
            <ListItemText className={disabled?classes.disabledItem:""} primary={labelPrimary} secondary={labelSecondary}/>
            {rowActions &&
                <div className={classes.rowActionBox} style={{display: "flex" , flexDirection : "row"}}>
                    {rowActions.filter(i=>!i.display || (i.display && i.display(item)!==false)).map((act,idx)=>(
                        <Tooltip key={idx} title={act.title}>
                            <div style={act.style}>
                                <IconButton onClick={()=>act.onClick(item)} disabled={act?.waiting ?? ""}>
                                    {act?.waiting ? <CircularProgress size={20} /> : <act.icon/>}
                                </IconButton>
                            </div>
                        </Tooltip>
                    ))}
                </div>
            }
        </ListItem>
    )
}
