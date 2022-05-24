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
import axios from "../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
import PayslipPrint from "../../print/payslip/PayslipPrint";

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

export default function Calculations({formVariables, submitCallback, taskId , step}) {
    const classes = useStyles();
    const [waiting, set_waiting] = useState(null)
    const [openModal, setOpenModal] = useState(false);
    const [dataModal, setDataModal] = useState({});
    const [fieldsInfo, setFieldsInfo] = useState({
        payslipType: [],
        periodTime: [],
        paygroup: []
    });

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
      }
    const personnel = useListState("userId",[])


    console.log('personnel',formVariables)
    console.log('personnel',personnel)
    const comments = useListState("id",[])

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

    const handleOpenModal = (rowData)=>{
        setDataModal(rowData)
        setOpenModal(true)
    }

    function handle_accept() {
        set_waiting("accept")
        setTimeout(()=>set_waiting(null),2000)
    }

    function handle_rerun() {
        set_waiting("rerun")
        setTimeout(()=>set_waiting(null),2000)
    }

    function submitForm(type){

        let submitData = step == "Voucher" ? {
            "VoucherCalculationStep":type
        } :
        {
            "calculationStep":type
        }
        submitCallback(submitData)

    }

    useEffect(()=>{
        getData()
    },[])


    useEffect(()=>{
        if(formVariables?.personnel){
            personnel.set(formVariables?.personnel)
            comments.set(formVariables?.comments||[])
        }

    },[formVariables])


    const getData = () => {
        axios.get(SERVER_URL + `/rest/s1/payroll/PaygroupData`, axiosKey).then(res => { /* todo: rest? */
            setFieldsInfo(res.data)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }


    return (
        <React.Fragment>
            <CardHeader title="محاسبه حقوق و دستمزد"/>
            <CardContent>
                <FormPro
                    formValues={formVariables}
                    prepend={formStructure}
                />
                <Box my={2}>
                    <Card variant="outlined">
                        <ListPro
                            title="لیست پرسنل"
                            context={personnel}
                            itemLabelPrimary={render_item}
                            selectable={false}
                            rowActions={[{
                                title: "پیش نمایش فیش حقوقی",
                                icon: VisibilityIcon,
                                onClick: (row) => handleOpenModal(row),
                                display: (row) => row.status === STATUS.SUCCESS
                            }]}
                        />
                    </Card>
                </Box>
                <Card variant="outlined">
                    <CommentBox context={comments}/>
                </Card>
                <Box mt={2}>
                    <ActionBox>
                        <Button role="primary" disabled={waiting} onClick={()=>submitForm("confirmed")} endIcon={waiting==="accept"?<CircularProgress size={20}/>:null}>
                            تایید
                        </Button>
                        <Button role="secondary" disabled={waiting} onClick={()=>submitForm("reOrder")} >
                            اصلاح
                        </Button>
                        <Button role="secondary" disabled={waiting} onClick={()=>submitForm("reCalculate")} endIcon={waiting==="rerun"?<CircularProgress size={20}/>:null} >
                            اجرای مجدد
                        </Button>
                    </ActionBox>
                </Box>
            </CardContent>
            <ModalPro
                title={`پیش نمایش فیش حقوقی ${dataModal.fullName}`}
                open={openModal}
                setOpen={setOpenModal}
                content={
                    <Box p={5}>
                        <PayslipPrint
                            data={{
                                // *******************************
                                // test data:
                                company: {
                                    logo: "b9f50a7c-aa3b-4970-bbfb-dc6199dea1b8.png",
                                },
                                person: {
                                    pseudoId: 1278,
                                    fullName: dataModal.fullName,
                                    nationalId: 4401234567,
                                    emplPosition: {
                                        emplPositionId: "101084",
                                        pseudoId: 1004,
                                        description: "منشی مدیر عامل"
                                    }
                                },
                                emplOrder: {},
                                factors: [{
                                    description: "عامل شماره یک",
                                    benefit: 1100,
                                },{
                                    description: "عامل شماره دو",
                                    benefit: 800,
                                },{
                                    description: "عامل شماره سه",
                                    deduction: 420,
                                }]
                                // *******************************
                            }}
                        />
                    </Box>
                }
            />
        </React.Fragment>
    )
}
