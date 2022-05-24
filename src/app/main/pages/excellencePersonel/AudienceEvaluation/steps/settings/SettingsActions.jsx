import React, {useEffect, useState} from "react";
import TablePro from "../../../../../components/TablePro";
import useListState from "../../../../../reducers/listState";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
import axios from "../../../../../api/axiosRest";

export default function SettingsActions({formVariables,set_formValues,set_formVariables}) {
    const primaryKey = "id0"
    const dataList = useListState(primaryKey,[])
    const [fieldsInfo, setFieldsInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [tableContent,setTableContent]=useState([]);
    const [editing, setEditing] = useState(false);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
      }

    const tableColumns = [{
        name    : "title",
        label   : "عنوان",
        type    : "text",
        readOnly : true
    },{
        name    : "emplDescription",
        label   : "مسئول",
        type    : "text",
        readOnly : true
    },{
        name    : "actionTypeDescription",
        label   : "نوع اقدام",
        type    : "text",
        readOnly : true
    },{
        name    : "emplFullName",
        label   : "پرسنل",
        type    : "text",
        readOnly : true
    },{
        name    : "TotalDutyList",
        label   : "لیست وظایف",
        type    : "text",
        readOnly : true
    },{
        name    : "status",
        label   : "وضعیت",
        type: "indicator",
         indicator: {'true':true,'false':false }
    }]

    
    useEffect(()=>{
        if(formVariables?.payslipActionList){
            setTableContent(formVariables.payslipActionList)
            setLoading(false)
        }
    },[formVariables])

    useEffect(()=>{
        if(editing){
            console.log('tableContent',tableContent)
            set_formVariables({...formVariables,'payslipActionList':tableContent})
            setEditing(false)

        }
    },[tableContent])

    useEffect(()=>{
        set_formValues(prevState=>({
            ...prevState,
            actions: dataList.list
        }))
    },[dataList.list])

    console.log('formVariables',formVariables)
    const handleEdit = (newData) => {
        return new Promise((resolve, reject) => {
            setEditing(true)
            resolve(newData)
        })  
    }

    return (
        <TablePro
            rows={tableContent}
            setRows={setTableContent}
            loading={loading}
            columns={tableColumns}
            showTitleBar={false}
            edit="inline"
            editCallback={handleEdit}
        />
    )
}
