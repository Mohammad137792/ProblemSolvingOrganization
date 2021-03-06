import React, {useState,useEffect} from "react";
import {Box, Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from "../../../../../components/formControls/FormPro";
import useListState from "../../../../../reducers/listState";
import CheckingAccounting from "../../steps/checking/CheckingAccounting";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CommentBox from "../../../../../components/CommentBox";
import CheckCircle from "@material-ui/icons/CheckCircleOutline";
import Error from "@material-ui/icons/ErrorOutline";
import {green, orange, red} from "@material-ui/core/colors";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ModalPro from "../../../../../components/ModalPro";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ActionBox from "../../../../../components/ActionBox";
import axios from "../../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
import TablePro from "../../../../../components/TablePro";


export default function FinancialRegistration({formVariables, submitCallback, taskId , step}) {

    const [waiting, set_waiting] = useState(null)
    const [openModal, setOpenModal] = useState(false);
    const [dataModal, setDataModal] = useState({});
    // const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
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
    const vouchers = useListState("voucherTemplateId",formVariables?.vouchers)
 

    console.log('personnel',formVariables)
    console.log('personnel',personnel)
    const comments = useListState("id",[])

    const formStructure = [
        {
        name    : "trackingCode",
        label   : "???? ????????????",
        type    : "display",
    },{
        name    : "createDate",
        label   : "?????????? ????????",
        type    : "display",
        options : "Date",
    },{
        name    : "producerFullName",
        label   : "???????? ??????????",
        type    : "display",
    },{
        name    : "producerEmplPositionId",
        label   : "?????? ?????????????? ???????? ??????????",
        type    : "display",
        options : "EmplPosition",
        optionIdField: "emplPositionId",

    },{
        name    : "payslipTypeId",
        label   : "?????? ?????? ??????????",
        type    : "display",
        options : fieldsInfo.payslipType,
        optionIdField   : "payslipTypeId",
        optionLabelField: "title",

    },{
        name    : "timePeriodId",
        label   : "???????? ??????????",
        type    : "display",
        options : fieldsInfo.periodTime,
        optionIdField   : "timePeriodId",
        optionLabelField: "periodName",

    },{
        name    : "fromDate",
        label   : "???? ??????????",
        type    : "display",
        options : "Date",
    },{
        name    : "thruDate",
        label   : "???? ??????????",
        type    : "display",
        options : "Date",
    },{
        name    : "partyClassificationId",
        label   : "???????? ??????????",
        type    : "display",
        options : fieldsInfo.paygroup,
        optionIdField   : "partyClassificationId",
        optionLabelField: "description",
    },{
        name    : "payArrearsFromDate",
        label   : "???????????? ???????????? ???? ??????????",
        type    : "display",
        options : "Date",
        group   : "insuranceSettings"
    },{
        name    : "payArrearsThruDate",
        label   : "???????????? ???????????? ???? ??????????",
        type    : "display",
        options : "Date",
        group   : "insuranceSettings"
    },{
        name    : "payArrearsPercent",
        label   : "???????? ???????????? ????????????",
        type    : "display",
        group   : "insuranceSettings"
    }]
    
    const tableColumns = [
        {
        name: "title",
        label: "???????? ????????",
        type: "text",
        style: { width: "7.5%" },
        readOnly: true,
        },
        {
        name: "PayGroupFactorDescription",
        label: "???????? ???????? ????????",
        type: "text",
        style: { width: "7.5%" },
        readOnly: true,
        },
        {
        name: "isDeduct",
        label: "?????? ???????? ????????",
        type: "select",
        options: [
            { desc: "????????????", id: "Y" },
            { desc: "????????????", id: "N" },
        ],
        optionLabelField: "desc",
        optionIdField: "id",
        style: { width: "7.5%" },
        readOnly: true,
        },
        {
        name: "calcTypeDescription",
        label: "?????? ??????????????",
        type: "text",
        style: { width: "15%" },
        readOnly: true,
        },
        {
        name: "arrearsPay",
        label: "???????????? ????????????",
        type: "indicator",
        style: { width: "5%" },
        disabaled: true,
        },
        {
        name: "id5",
        label: "?????? ???????? ???? ??????????",
        type: "date",
        style: { width: "10%" },
        },
        {
        name: "id7",
        label: "?????? ???????? ???? ??????????",
        type: "date",
        style: { width: "10%" },
        },
        {
        name: "id8",
        label: "???????? ?????? ????????",
        type: "number",
        style: { width: "40%" },
        },
    ];

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
        if(formVariables?.vouchers){
            vouchers.set(formVariables.vouchers)
        }
    },[formVariables])

    const getData = () => {
        axios.get(SERVER_URL + `/rest/s1/payroll/PaygroupData`, axiosKey).then(res => { /* todo: rest? */
            setFieldsInfo(res.data)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"?????????? ???? ???????????? ?????????????? ???? ???????? ??????."));
        });
    }


    return (
        <React.Fragment>
            <CardHeader title="?????? ?????? ????????"/>
            <CardContent>
                <Box my={2}>
                    <Card variant="outlined">
                        <CheckingAccounting context={vouchers} noEdit={true}/>
                    </Card>
                </Box>
              
            </CardContent>
        </React.Fragment>
    )
}
