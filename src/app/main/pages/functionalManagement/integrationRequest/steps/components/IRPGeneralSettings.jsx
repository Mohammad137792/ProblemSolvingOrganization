import React, {useEffect, useState} from "react";
import axios from "../../../../../api/axiosRest";
import FormPro from "../../../../../components/formControls/FormPro";

export default function IRPGeneralSettings({formValues}) {
    const [data, set_data] = useState({
        timePeriodTypes: [],
        timePeriods: [],
    });

    const formStructure = [
        {
            name    : "trackingCode",
            label   : "کد رهگیری",
            type    : "display",
        },{
            name    : "createDate",
            label   : "تاریخ تجمیع",
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

    useEffect(() => {
        axios.get("/s1/payroll/entity/timePeriodType").then(res => {
            set_data(prevState => ({...prevState, timePeriodTypes: res.data.timePeriodTypeList}))
        }).catch(() => {});
        axios.get("/s1/payroll/timePeriodList").then(res => {
            set_data(prevState => ({...prevState, timePeriods: res.data.timePeriodList}))
        }).catch(() => {});
    },[])

    return (
        <FormPro
            formValues={formValues||{}}
            prepend={formStructure}
        />
    )
}
