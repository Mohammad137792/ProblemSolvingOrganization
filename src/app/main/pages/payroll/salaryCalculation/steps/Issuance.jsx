import React, {useState,useEffect} from "react";
import {Box, Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import useListState from "../../../../reducers/listState";
import ListPro from "../../../../components/ListPro";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CommentBox from "../../../../components/CommentBox";
import CheckCircle from "@material-ui/icons/CheckCircleOutline";
import Error from "@material-ui/icons/ErrorOutline";
import {green, orange, red} from "@material-ui/core/colors";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ModalPro from "../../../../components/ModalPro";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ActionBox from "../../../../components/ActionBox";

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

export default function Issuance({formVariables, submitCallback, taskId,goToStep,fieldsInfo}) {
    const classes = useStyles();
    const [waiting, set_waiting] = useState(null)
    const errorList = useListState("id",formVariables.vouchersError||[])
    
    console.log('formVariables',formVariables)
    const comments = useListState("id",formVariables.comments || [])

    const formStructure = [
        {
        name    : "trackingCode",
        label   : "کد رهگیری",
        type    : "display",
    },{
        name    : "createDate",
        label   : "تاریخ صدور",
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
        name    : "payslipTypeId",
        label   : "نوع فیش حقوقی",
        type    : "display",
        options : fieldsInfo.payslipType,
        optionIdField   : "payslipTypeId",
        optionLabelField: "title",
    },{
        name    : "timePeriodId",
        label   : "دوره زمانی",
        type    : "display",
        options : fieldsInfo.periodTime,
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
    },{
        name    : "partyClassificationId",
        label   : "گروه حقوقی",
        type    : "display",
        options : fieldsInfo.paygroup,
        optionIdField   : "partyClassificationId",
        optionLabelField: "description",
    },{
        name    : "payArrearsFromDate",
        label   : "پرداخت معوقات از تاریخ",
        type    : "display",
        options : "Date",
        group   : "insuranceSettings"
    },{
        name    : "payArrearsThruDate",
        label   : "پرداخت معوقات تا تاریخ",
        type    : "display",
        options : "Date",
        group   : "insuranceSettings"
    },{
        name    : "payArrearsPercent",
        label   : "درصد پرداخت معوقات",
        type    : "display",
        group   : "insuranceSettings"
    }]

    function render_item(item) {
        return (
            <Grid container spacing={2} className={classes.row}>
                <Grid item>
                    {item.status === STATUS.SUCCESS && <CheckCircle fontSize={"small"} style={{color: green[500]}}/>}
                    {item.status === STATUS.WARNING && <Error fontSize={"small"} style={{color: orange[500]}}/>}
                    {item.status === STATUS.ERROR && <Error fontSize={"small"} style={{color: red[500]}}/>}
                </Grid>
                <Grid item xs={5} md={3}><Typography style={{color: red[900]}}>{item.statusTitle}</Typography></Grid>
                <Grid item xs={12} md={5}><Typography noWrap color="textSecondary">{item.description}</Typography></Grid>
            </Grid>
        )
    }

    function handle_accept() {
        set_waiting("accept")
        goToStep()
        // setTimeout(()=>set_waiting(null),2000)
    }

    function handle_rerun() {
        set_waiting("rerun")
        let packet = {
            vocherCalculationSuccess : "reOrder"
        }
        submitCallback(packet)
    }
  
    function handle_reCalculate() {
        set_waiting("reCalculate")
        let packet = {
            vocherCalculationSuccess : "reCalculate"
        }
        submitCallback(packet)
    }
  
    useEffect(()=>{
        if(formVariables?.comments)
            comments.add(formVariables.comments)
        if(formVariables?.vouchersError)
            errorList.set(formVariables.vouchersError)

    },[formVariables])

    return (
        <React.Fragment>
            <CardHeader title="صدور سند حسابداری و تولید خروجی ها"/>
            <CardContent>
                <FormPro
                    formValues={formVariables}
                    prepend={formStructure}
                />
                <Box my={2}>
                    <Card variant="outlined">
                        <ListPro
                            title="لیست خطاها"
                            context={errorList}
                            itemLabelPrimary={render_item}
                            selectable={false}
                        />
                    </Card>
                </Box>
                <Card variant="outlined">
                    <CommentBox context={comments}/>
                </Card>
                <Box mt={2}>
                    <ActionBox>
                        <Button role="primary" disabled={waiting} onClick={handle_accept} endIcon={waiting==="accept"?<CircularProgress size={20}/>:null}>
                            تایید
                        </Button>
                        <Button role="secondary" disabled={waiting}  onClick={handle_rerun} endIcon={waiting==="rerun"?<CircularProgress size={20}/>:null}>
                            اصلاح
                        </Button>
                        <Button role="secondary" disabled={waiting} onClick={handle_reCalculate} endIcon={waiting==="reCalculate"?<CircularProgress size={20}/>:null} >
                            اجرای مجدد
                        </Button>
                    </ActionBox>
                </Box>
            </CardContent>
        </React.Fragment>
    )
}
