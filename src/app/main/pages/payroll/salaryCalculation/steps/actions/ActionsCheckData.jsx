import React, {useEffect,useState}from "react";
import {CardContent, CardHeader} from "@material-ui/core";
import FormPro from "../../../../../components/formControls/FormPro";
import axios from "../../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
export default function ActionsCheckData({formVariables}) {
    const [fieldsInfo, setFieldsInfo] = useState({});
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
        options : "EmplPosition",
        optionIdField: "emplPositionId",
    },{
        name    : "payslipTypeId",
        label   : "نوع فیش حقوقی",
        type    : "display",
        options : fieldsInfo?.payslipType,
        optionIdField   : "payslipTypeId",
        optionLabelField: "title",
    },{
        name    : "timePeriodId",
        label   : "دوره زمانی",
        type    : "display",
        options : fieldsInfo?.periodTime,
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
        options : fieldsInfo?.paygroup,
        optionIdField   : "partyClassificationId",
        optionLabelField: "description",
    },{
        name    : "payArrearsFromDate",
        label   : "پرداخت معوقات از تاریخ",
        type    : "display",
        options : "Date",
        value   :formVariables?.insuranceSettings?.payArrearsFromDate
    },{
        name    : "payArrearsThruDate",
        label   : "پرداخت معوقات تا تاریخ",
        type    : "display",
        options : "Date",
        value   :formVariables?.insuranceSettings?.payArrearsThruDate
    },{
        name    : "payArrearsPercent",
        label   : "درصد پرداخت معوقات",
        type    : "display",
        value   :formVariables?.insuranceSettings?.payArrearsPercent
    },{
        name    : "paymentDate",
        label   : "تاریخ پرداخت حقوق و دستمزد",
        type    : "display",
        options : "Date",
    },{
        name    : "payslipDescription",
        label   : "توضیحات فیش حقوقی",
        type    : "display",
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "display",
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
            <CardHeader title="بررسی اطلاعات محاسبه حقوق و دستمزد"/>
            <CardContent>
                <FormPro
                    formValues={formVariables}
                    prepend={formStructure}
                />
            </CardContent>
        </React.Fragment>
    )
}
