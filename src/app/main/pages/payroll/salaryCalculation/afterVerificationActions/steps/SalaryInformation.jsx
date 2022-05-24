import React, {useState,useEffect} from "react";
import {Box, Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from "../../../../../components/formControls/FormPro";
import useListState from "../../../../../reducers/listState";
import ListPro from "../../../../../components/ListPro";
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


export default function SalaryInformation({formVariables, submitCallback, taskId , step}) {

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

    const formStructure = [{
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
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "display",
        col     :6
    },{
        name    : "payslipDescription",
        label   : "توضیحات فیش حقوقی",
        type    : "display",
        col     :6
    }]
    
    useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(SERVER_URL + `/rest/s1/payroll/PaygroupData`, axiosKey).then(res => { /* todo: rest? */
            setFieldsInfo(res.data)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }


    return (
        <React.Fragment>
            <CardHeader title=""/>
            <CardContent>
                <FormPro
                    formValues={formVariables}
                    prepend={formStructure}
                />
               
              
            </CardContent>
           
        </React.Fragment>
    )
}
