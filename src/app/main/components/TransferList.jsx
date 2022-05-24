import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ListPro from "./ListPro";
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(0.5, 0),
        width: "100%",
        minWidth: "38px",
    },
}));

const default_promise = (items) => new Promise(resolve => resolve(items))

export default function TransferList({rightTitle, rightContext, rightItemLabelPrimary, rightItemLabelSecondary,
                                         leftTitle, leftContext, leftItemLabelPrimary, leftItemLabelSecondary,
                                         onMoveRight=default_promise, onMoveLeft=default_promise,
                                         rightFilterForm, leftFilterForm, disabled=false}) {
    const classes = useStyles();
    const leftChecked = leftContext?.list?.filter(i=>i.checked===true) || [];
    const rightChecked = rightContext?.list?.filter(i=>i.checked===true) || [];
    const leftRowsPerPage = (!leftItemLabelSecondary && rightItemLabelSecondary) ? 6 : 5
    const rightRowsPerPage = (!rightItemLabelSecondary && leftItemLabelSecondary) ? 6 : 5

    function uncheck_items(items) {
        return items.map(itm=>({...itm, checked: false}))
    }
    function handle_move_left() {
        let uncheckItems = uncheck_items(rightChecked)
        onMoveLeft(uncheckItems).then(items=>{
            rightContext.remove(items)
            leftContext.add(items)
        }).catch(()=>{})
    }
    function handle_move_right() {
        let uncheckItems = uncheck_items(leftChecked)
        onMoveRight(uncheckItems).then(items=>{
            rightContext.add(items)
            leftContext.remove(items)
        }).catch(()=>{})
    }

    return (
        <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            // className={classes.root}
        >
            <Grid item xs>
                <Card variant="outlined">
                    <ListPro
                        title={rightTitle}
                        context={rightContext}
                        itemLabelPrimary={rightItemLabelPrimary}
                        itemLabelSecondary={rightItemLabelSecondary}
                        rowsPerPage={rightRowsPerPage}
                        filterForm={rightFilterForm}
                        disabled={disabled}
                    />
                </Card>
            </Grid>
            <Grid item xs={12} sm={1}>
                <Grid container direction="column" alignItems="center">
                    <Tooltip title={`افزودن به ${leftTitle}`}>
                        <span>
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handle_move_left}
                                disabled={rightChecked.length === 0 || disabled}
                                aria-label="move selected to left"
                            >&gt;</Button>
                        </span>
                    </Tooltip>
                    <Tooltip title={`حذف از ${leftTitle}`}>
                        <span>
                           <Button
                               variant="outlined"
                               size="small"
                               className={classes.button}
                               onClick={handle_move_right}
                               disabled={leftChecked.length === 0 || disabled}
                               aria-label="move selected to right"
                           >&lt;</Button>
                        </span>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid item xs>
                <Card variant="outlined">
                    <ListPro
                        title={leftTitle}
                        context={leftContext}
                        itemLabelPrimary={leftItemLabelPrimary}
                        itemLabelSecondary={leftItemLabelSecondary}
                        rowsPerPage={leftRowsPerPage}
                        filterForm={leftFilterForm}
                        disabled={disabled}
                    />
                </Card>
            </Grid>
        </Grid>
    )
}
