import React, {useEffect, useState} from "react";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import Box from "@material-ui/core/Box";
import axios from "../../../../api/axiosRest";
import Card from "@material-ui/core/Card";
import ListPro from "../../../../components/ListPro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CommentBox from "../../../../components/CommentBox";
import ActionBox from "../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import useListState from "../../../../reducers/listState";
import CheckCircle from "@material-ui/icons/CheckCircleOutline";
import {green, orange, red} from "@material-ui/core/colors";
import Error from "@material-ui/icons/ErrorOutline";
import Typography from "@material-ui/core/Typography";
import {useDialogReducer} from "../../../../components/ConfirmDialog";
import ModalPro from "../../../../components/ModalPro";
import {makeStyles} from "@material-ui/core/styles";

const STATUS = {
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error"
}

const useStyles = makeStyles((theme) => ({
    row: {
        height: 50,
        "& .MuiSvgIcon-root": {
            marginTop: "6px"
        },
        "& .MuiTypography-root": {
            lineHeight: "34px"
        }
    },
}));

export default function IRPCalculation({values, onSubmit, goBack, data}) {
    const classes = useStyles();
    const [waiting, set_waiting] = useState(null)
    const previewModal = useDialogReducer()
    const comments = useListState("id",[])
    const personnel = useListState("userId",[])

    const formStructure = [
        {
            name    : "trackingCode",
            label   : "کد رهگیری",
            type    : "display",
        },{
            name    : "createDate",
            label   : "تاریخ درخواست",
            type    : "display",
            options : "Date",
        },{
            name    : "producerFullName",
            label   : "تهیه کننده",
            type    : "display",
        },{
            name    : "producerEmplPositionId",
            label   : "پست سازمانی تهیه کننده",
            type    : "display",
            options : "EmplPosition",
            optionIdField: "emplPositionId",
        },{
            name    : "timePeriodTypeId",
            label   : "نوع دوره زمانی",
            type    : "display",
            options : data.timePeriodTypes,
            optionIdField   : "timePeriodTypeId",
        },{
            name    : "timePeriodId",
            label   : "دوره زمانی",
            type    : "display",
            options : data.timePeriods,
            optionIdField   : "timePeriodId",
            optionLabelField: "periodName",
        },{
            name    : "periodFromDate",
            label   : "از تاریخ",
            type    : "display",
            options : "Date",
        },{
            name    : "periodThruDate",
            label   : "تا تاریخ",
            type    : "display",
            options : "Date",
        }
    ]

    const handle_submit = (action) => () => {
        set_waiting(action)
        onSubmit(action).finally(()=>{
            set_waiting(null)
        })
    }

    const post_comment = (comment) => new Promise(resolve => resolve(comment))

    function render_item(item) {
        return (
            <Grid container spacing={2} className={classes.row}>
                <Grid item>
                    {item.status === STATUS.SUCCESS && <CheckCircle fontSize={"small"} style={{color: green[500]}}/>}
                    {item.status === STATUS.WARNING && <Error fontSize={"small"} style={{color: orange[500]}}/>}
                    {item.status === STATUS.ERROR && <Error fontSize={"small"} style={{color: red[500]}}/>}
                </Grid>
                {item.status === STATUS.SUCCESS && <>
                    <Grid item xs={5} md={3}><Typography>{item.fullName}</Typography></Grid>
                    <Grid item xs={5} md={3}><Typography>{item.value}</Typography></Grid>
                </>}
                {item.status === STATUS.WARNING && <>
                    <Grid item xs={5} md={3}><Typography style={{color: orange[900]}}>{item.fullName}</Typography></Grid>
                    <Grid item xs={5} md={3}><Typography style={{color: orange[900]}}>{item.errorTitle}</Typography></Grid>
                    <Grid item xs={12} md={5}><Typography noWrap color="textSecondary">{item.description}</Typography></Grid>
                </>}
                {item.status === STATUS.ERROR && <>
                    <Grid item xs={5} md={3}><Typography style={{color: red[900]}}>{item.fullName}</Typography></Grid>
                    <Grid item xs={5} md={3}><Typography style={{color: red[900]}}>{item.errorTitle}</Typography></Grid>
                    <Grid item xs={12} md={5}><Typography noWrap color="textSecondary">{item.description}</Typography></Grid>
                </>}
            </Grid>
        )
    }

    useEffect(() => {
        personnel.set(values.personnel||[])
    },[values])

    return (
        <React.Fragment>
            <CardHeader title="محاسبه کارکرد پرسنل"/>
            <CardContent>
                <FormPro
                    formValues={values.formValues||{}}
                    prepend={formStructure}
                />
                <Box m={2}/>
                <Card variant="outlined">
                    <ListPro
                        title="لیست پرسنل"
                        context={personnel}
                        itemLabelPrimary={render_item}
                        selectable={false}
                        rowActions={[{
                            title: "پیش نمایش",
                            icon: VisibilityIcon,
                            onClick: (row) => previewModal.show(row),
                            display: (row) => row.status === STATUS.SUCCESS
                        }]}
                    />
                </Card>
                <Box m={2}/>
                <Card variant="outlined">
                    <CommentBox context={comments} callback={post_comment}/>
                </Card>
                <Box mt={2}>
                    <ActionBox>
                        <Button role="primary" disabled={waiting} onClick={handle_submit("confirmed")} endIcon={waiting==="confirmed"?<CircularProgress size={20}/>:null}>
                            تایید
                        </Button>
                        <Button role="secondary" disabled={waiting} onClick={handle_submit("reCalculate")} endIcon={waiting==="reCalculate"?<CircularProgress size={20}/>:null} >
                            اجرای مجدد
                        </Button>
                        <Button role="secondary" disabled={waiting} onClick={goBack} >
                            بازگشت
                        </Button>
                    </ActionBox>
                </Box>
            </CardContent>
            <ModalPro
                title="پیش نمایش"
                open={previewModal.display}
                setOpen={previewModal.close}
                content={
                    <Box p={2}>
                        {JSON.stringify(previewModal.data)}
                    </Box>
                }
            />
        </React.Fragment>
    )
}
