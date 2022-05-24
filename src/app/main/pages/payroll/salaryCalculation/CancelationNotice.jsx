import React, {useState,useEffect} from "react";
import useListState from "../../../reducers/listState";
import {Box, Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from "../../../components/formControls/FormPro";
import Card from "@material-ui/core/Card";
import CommentBox from "../../../components/CommentBox";
import ActionBox from "../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import TabPro from "../../../components/TabPro";
import ConfirmDialog, {useDialogReducer} from "../../../components/ConfirmDialog";
import TablePro from "../../../components/TablePro";
import CheckingPayslip from "./steps/checking/CheckingPayslip";
import PaymentAccount from "./verificationTabs/PaymentAccount";
import CheckingAccounting from "./steps/checking/CheckingAccounting";
import SettingsInsurance from "./steps/settings/SettingsInsurance";
import SettingsTaxation from "./steps/settings/SettingsTaxation";
import axios from "../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';

export default function SalaryVerification({formVariables, submitCallback, taskId}) {
    const dialogCancellation = useDialogReducer(handle_cancel)
    const [waiting, set_waiting] = useState(null)
    const [actions, set_actions] = useState([])
    const dispatch = useDispatch();
    const dataList = useListState("levelId")
    const [fieldsInfo, setFieldsInfo] = useState({
        payslipType: [],
        periodTime: [],
        paygroup: []
    });
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
      }

      console.log('formVariables',formVariables)
    const vouchers = useListState("voucherTemplateId",formVariables?.vouchers)
   
    const comments = useListState("id",formVariables?.comments || [])
        
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
            name    : "fromDate",
            label   : "از تاریخ",
            type    : "display",
            options : "Date",
        },{
            name    : "thruDate",
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
            label   : "تاریخ پرداخت حقوق و دستمزد",
            type    : "display",
            options : "Date",
            group   : "insuranceSettings"
        },{
            name    : "payArrearsFromDate",
            label   : "خروجی ها",
            type    : "display",
            options : "Date",
            group   : "insuranceSettings",
            col     :6
        },
        // {
        //     name    : "payArrearsThruDate",
        //     label   : "پرداخت معوقات تا تاریخ",
        //     type    : "display",
        //     options : "Date",
        //     group   : "insuranceSettings"
        // },{
        //     name    : "payArrearsPercent",
        //     label   : "درصد پرداخت معوقات",
        //     type    : "display",
        //     group   : "insuranceSettings"
        // },{
        //     name    : "xxx1",
        //     label   : "روش های ارسال فیش حقوقی",
        //     type    : "select",
        //     options : "Test1",
        // },
        {
            name    : "xxx2",
            label   : "مجموع حقوق پرداختی",
            type    : "display",
        },{
            name    : "xxx3",
            label   : "مجموع بیمه پرداختی",
            type    : "display",
        },{
            name    : "xxx4",
            label   : "مجموع مالیات پرداختی",
            type    : "display",
        }]

    const personnelPayslips =  formVariables?.personnel || []
    
    const outputs = formVariables?.outputs || []
    const formDefaultValues = {}
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const tabsProps = {formValues, set_formValues, formValidation, set_formValidation}

    const tabs = [{
        label: "فیش حقوقی",
        panel: <CheckingPayslip rows={personnelPayslips}/>
    },{
        label: "سند حسابداری",
        panel: <CheckingAccounting context={vouchers}/>
    }]

    const getData = () => {
        axios.get(SERVER_URL + `/rest/s1/payroll/PaygroupData`, axiosKey).then(res => { /* todo: rest? */
            setFieldsInfo(res.data)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    function handle_accept(action) {
        const packet = {
            ...formVariables,
            vouchers: vouchers.list,
            actions,
            vocherCalculationSuccess :action
        }
        console.log("packet",packet)
        set_waiting("accept")
        // setTimeout(()=>set_waiting(null),2000)


        submitCallback(packet)

    }

    function handle_cancel() {
        set_waiting("cancel")
        setTimeout(()=>set_waiting(null),2000)
    }

    
    useEffect(()=>{
        getData()
        
        if(formVariables){
            set_formValues(formVariables)
            if(formVariables.comments)
            comments.set(formVariables.comments)
        vouchers.set(formVariables.vouchers)
        }
    },[])
    


    return (
        <React.Fragment>
            <Box my={2}>
            <Card >
                <CardHeader title="ارسال حقوق و دستمزد برای تایید و پرداخت"/>
                <CardContent>
                    <FormPro
                        formValues={formVariables}
                        // setFormValues={set_formVariables}
                        prepend={formStructure}
                    />
                    <Box my={2}>
                        <Card variant="outlined">
                            <TabPro tabs={tabs}/>
                        </Card>
                    </Box>
                    <Card variant="outlined">
                        <CommentBox context={comments}/>
                    </Card>
                    <Box mt={2}>
                        <ActionBox>
                            <Button role="primary" disabled={waiting} onClick={()=>{handle_accept("confirmed")}} endIcon={waiting==="accept"?<CircularProgress size={20}/>:null}>
                                تایید
                            </Button>
                            <Button role="secondary" disabled={waiting} onClick={()=>{handle_accept("reOrder")}} >
                                اصلاح
                            </Button>
                            <Button role="secondary" disabled={waiting} onClick={()=>{handle_accept("canceled")}} endIcon={waiting==="cancel"?<CircularProgress size={20}/>:null} >
                                رد فرآیند
                            </Button>
                        </ActionBox>
                    </Box>
                </CardContent>
                <ConfirmDialog
                    dialogReducer={dialogCancellation}
                    title="آیا از رد این فرآیند اطمینان دارید؟"
                />
            </Card>
            </Box>
        </React.Fragment>
    )
}
