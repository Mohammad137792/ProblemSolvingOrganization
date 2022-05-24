import React, { useState, useEffect } from 'react'

import TablePro from './../../../../components/TablePro'
import FormPro from './../../../../components/formControls/FormPro'
import { Button } from '@material-ui/core'
import ActionBox from './../.././../../components/ActionBox'
import { SERVER_URL } from '../../../../../../configs'
import axios from 'axios'

import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import {useDispatch, useSelector} from "react-redux";

import checkPermis from "app/main/components/CheckPermision";

import CircularProgress from "@material-ui/core/CircularProgress";


export default function Documentation({ actionObject, dataOption }) {

    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [show, setShow] = useState(true)
    const [fieldInfo , setFieldInfo] = useState({});

    const datas = useSelector(({ fadak }) => fadak);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        { name: "description", label: "عنوان سند", type: "text" },
        {
            label: "نوع سند", name: "contentTypeEnumId", type: "select", options: fieldInfo?.contentTypeEnumId,
            optionIdField: "enumId",
            optionLabelField: "description"
        },
        { name: "contentDate", label: "تاریخ بارگذاری ", type: "date" },
        // { name: "fromDate", label: "تاریخ اقدام", type: "date" },
        // {
        //     label: "وضعیت", name: "statusId", type: "select", options: dataOption.statuslist,
        //     optionIdField: "statusId",
        //     optionLabelField: "description"
        // },
        { name: "contentfile", label: "فایل", type: "text" },
    ]

    const dispatch = useDispatch()

    useEffect(() => {
            getData()
    }, [actionObject?.workEffortId])

    const getData = () => {
        let configs = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/planning/WorkEffortContent?workEffortId=${actionObject?.workEffortId}`,
            headers: { 'api_key': localStorage.getItem('api_key') },
        }
        axios.get(`${SERVER_URL}/rest/s1/fadak/entity/Enumeration?enumTypeId=WorkeffortContentType`, axiosKey).then((contentType)=>{
            setFieldInfo({contentTypeEnumId : contentType.data.result})
            axios(configs).then(response => {
                let listOfData = []
                response.data.result.map(item => {
                    let row = {
                        workEffortContentId: item.workEffortContentId,
                        description: item.description,
                        contentDate: item.contentDate,
                        contentfile: item.contentLocation ? <Button variant="outlined" color="secondary" ><a href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.contentLocation} download>دانلود</a></Button> : ""
                        , fromDate: item.fromDate,
                        statusId: item.statusId,
                        contentTypeEnumId :item.contentTypeEnumId ?? ""
                    }
                    listOfData.push(row)
                })


                setTableData(listOfData)
                setLoading(false)
            })
        })
    }

    const handleRemove = (data) => {
        let config = {
            method: 'delete',
            url: `${SERVER_URL}/rest/s1/planning/WorkEffortContent?workEffortContentId=${data.workEffortContentId}`,
            headers: { 'api_key': localStorage.getItem('api_key') },

        }
        return new Promise((resolve, reject) => {
            axios(config).then(response => {
               
                getData()
                setLoading(true)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS,
                    'با موفقیت انجام شد'));

            }).catch(err => {
                reject('شما اجازه پاک کردن  را ندارید')
                dispatch(setAlertContent(ALERT_TYPES.WARNING,
                    'شما اجازه پاک کردن  را ندارید'));

            })
        })

    }

    return (
        <TablePro
            columns={tableCols}
            rows={tableData}
            setRows={setTableData}
            loading={loading}
            removeCallback={handleRemove}
            removeCondition={(row) =>
                checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/documentation/delete", datas) 
            }
            add={checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/documentation/add", datas) ? 'external' : false}
            addForm={<ExternalForm getData={getData} show={show} setShow={setShow} actionObject={actionObject} dataOption={dataOption} setTableData={setTableData} dispatch={dispatch} fieldInfo={fieldInfo} setLoading={setLoading}/>}
            editForm={<ExternalForm editing={true} getData={getData} show={show} setShow={setShow} actionObject={actionObject} dataOption={dataOption} setTableData={setTableData} dispatch={dispatch} fieldInfo={fieldInfo} setLoading={setLoading}/>}
            edit="external"
            editCondition={(row) =>
                checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/documentation/edit", datas) 
            }
            fixedLayout
        />
    )

}

function ExternalForm({ editing = false, getData, actionObject, dataOption, setTableData, dispatch, show, setShow, fieldInfo, ...restProps }) {

    const { formValues, setFormValues, successCallback, failedCallback, handleClose, setLoading } = restProps;

    const [waiting, set_waiting] = useState(false) 

    let moment = require('moment-jalaali')

    const contentFormData = new FormData()

    const formStructure = [
        { name: "description", label: "عنوان سند", type: "text", col: 12 },
        {
            label: "نوع سند", name: "contentTypeEnumId", type: "select", options: fieldInfo?.contentTypeEnumId,
            optionIdField: "enumId",
            optionLabelField: "description",
            col: 4
        },
        // {
        //     label: "وضعیت", name: "statusId", type: "select", options: dataOption.statuslist,
        //     optionLabelField: "description",
        //     optionIdField: "statusId", col: 3
        // },
        { name: "contentDate", label: "تاریخ بارگذاری ", type: "date", disabled: true , col: 4 },
        // { name: "fromDate", label: "تاریخ اقدام", type: "date" },
        { name: "contentfile", label: "بارگذاری فایل", type: "inputFile" , col: 4},

    ]

    useEffect(() => {
        if((!formValues?.description || formValues?.description == "") && (!formValues?.contentTypeEnumId || formValues?.contentTypeEnumId =="" ) && (!formValues?.contentfile || !formValues?.contentfile == "")){
            const formDefaultValues = {
                contentDate: moment().format("Y-MM-DD")
            }
            
            setFormValues(formDefaultValues)
        }
    }, [])

    /* action and submit for request  */
    const handleSubmit = async (row) => {
        contentFormData.append("file", formValues.contentfile)
        set_waiting(true)
        var contentLocation = ""

        if ( formValues.contentfile && typeof formValues?.contentfile !== 'string' && !formValues?.contentfile?.props) {
            await axios.post(`${SERVER_URL}/rest/s1/fadak/getpersonnelfile`, contentFormData, { headers: { 'api_key': localStorage.getItem('api_key') } }).then(response_upLoad => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS,
                    'با موفقیت انجام شد'));

                contentLocation = response_upLoad.data.name
            })
        }
        let data = {
            ...formValues,
            workEffortId: actionObject.workEffortId
        }
        contentLocation ? data.contentLocation = contentLocation : data.a = ''

        let configs = {
            method: 'post',
            url: `${SERVER_URL}/rest/s1/planning/WorkEffortContent`,
            headers: { 'api_key': localStorage.getItem('api_key') },
            data: data
        }

        axios(configs).then(res => {
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS,
                'با موفقیت انجام شد'));

            getData()
            setLoading(true)
            handleReset()
            set_waiting(false)
        }).catch(err => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR,
                'خطا در ثبت اطلاعات ، لطفا مجدد تلاش کنید.'))
            set_waiting(false)
        })
    }

    const handleReset = () => {

        handleClose()
        const formDefaultValues = {
            contentDate: moment().format("Y-MM-DD")
        }
        
        setFormValues(formDefaultValues)

    }

    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={handleSubmit}
            resetCallback={handleReset}
            actionBox={<ActionBox>
                <Button type="submit" role="primary"
                    disabled={waiting}
                    endIcon={waiting?<CircularProgress size={20}/>:null}
                >{editing ? "ویرایش" : "افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}
