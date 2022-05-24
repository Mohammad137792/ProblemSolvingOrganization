import React, {useState,useEffect} from "react";
import {Box, Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import useListState from "../../../../../reducers/listState";
import Card from "@material-ui/core/Card";
import CheckingPayslip from "../../steps/checking/CheckingPayslip";
import axios from "../../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';


export default function PayslipPrint({formVariables, submitCallback, taskId , step}) {

    const [waiting, set_waiting] = useState(null)
    const [openModal, setOpenModal] = useState(false);
    const [dataModal, setDataModal] = useState({});
    const [tableContent, setTableContent] = useState([]);
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
    const personnelPayslips =  formVariables?.personnel || []
 

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
    
    const tableColumns = [
        {
        name: "title",
        label: "عامل حقوق",
        type: "text",
        style: { width: "7.5%" },
        readOnly: true,
        },
        {
        name: "PayGroupFactorDescription",
        label: "گروه عامل حقوق",
        type: "text",
        style: { width: "7.5%" },
        readOnly: true,
        },
        {
        name: "isDeduct",
        label: "نوع عامل حقوق",
        type: "select",
        options: [
            { desc: "معوقات", id: "Y" },
            { desc: "کسورات", id: "N" },
        ],
        optionLabelField: "desc",
        optionIdField: "id",
        style: { width: "7.5%" },
        readOnly: true,
        },
        {
        name: "calcTypeDescription",
        label: "نوع محاسبات",
        type: "text",
        style: { width: "15%" },
        readOnly: true,
        },
        {
        name: "arrearsPay",
        label: "پرداخت معوقات",
        type: "indicator",
        style: { width: "5%" },
        disabaled: true,
        },
        {
        name: "id5",
        label: "باز خرید از تاریخ",
        type: "date",
        style: { width: "10%" },
        },
        {
        name: "id7",
        label: "باز خرید تا تاریخ",
        type: "date",
        style: { width: "10%" },
        },
        {
        name: "id8",
        label: "درصد باز خرید",
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
        getData()
    },[])


    useEffect(()=>{
        if(formVariables?.personnel){
            personnel.set(formVariables?.personnel)
            comments.set(formVariables?.comments)
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
            <CardHeader title="چاپ فیش حقوقی"/>
            <CardContent>
                <Box my={2}>
                    <Card variant="outlined">
                       <CheckingPayslip rows={personnelPayslips}/>
                    </Card>
                </Box>
            </CardContent>
        </React.Fragment>
    )
}
