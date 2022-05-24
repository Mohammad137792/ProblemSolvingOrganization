

import React, { useState, useEffect } from 'react'

import TablePro from './../../../../components/TablePro'
import FormPro from './../../../../components/formControls/FormPro'
import { Button } from '@material-ui/core'
import ActionBox from './../.././../../components/ActionBox'
import axios from 'axios'
import { SERVER_URL } from '../../../../../../configs'
// import formData from 'app/store/reducers/kavepars/formData.reducers'

import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import {useDispatch, useSelector} from "react-redux";

import checkPermis from "app/main/components/CheckPermision";

import CircularProgress from "@material-ui/core/CircularProgress";

export default function Indicator({ actionObject, dataOption }) {
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = React.useState([]);
    const dispatch = useDispatch()

    const datas = useSelector(({ fadak }) => fadak);

    const tableCols = [
        { name: "workEffortName", label: "عنوان شاخص", type: "text", col: 4 , required: true,},
        { name: "percentComplete", label: "درصد پیشرفت", type: "number", col: 4 },
        { name: "statusId", label: "وضعیت  ", type: "select", options: dataOption?.statuslist, optionLabelField: "description", optionIdField: "statusId", col: 4 },
        { name: "description", label: "توضیحات  ", type: "textarea",  col: 12 },
    ]

    /* get data with reqest by axios and useEffect */
    useEffect(() => {
        /* get table data from workEffort entity */
        getTableData()

    }, [])

    const getTableData = () => {
        let config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/planning/workEffort?id=${actionObject?.workEffortId}`,
            headers: { 'api_key': localStorage.getItem('api_key') },

        }
        axios(config).then(response => {
            response.data?.workEffortSub && setTableData(response.data.workEffortSub.filter(item => item.workEffortTypeEnumId === "KPI"))
            setLoading(false)
        }).catch(err => { })

    }

    const handleRemove = (data) => {
        let config = {
            method: 'delete',
            url: `${SERVER_URL}/rest/s1/planning/WorkEffort?workEffortId=${data.workEffortId}`,
            headers: { 'api_key': localStorage.getItem('api_key') },

        }
        return new Promise((resolve, reject) => {
            axios(config).then(response => {
                setLoading(true)
                getTableData()
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
                checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/indicator/delete", datas) 
            }
            add={checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/indicator/add", datas) ? 'external' : false}
            addForm={<ExternalForm formStructure={tableCols} actionObject={actionObject} getTableData={getTableData} setLoading={setLoading}/>}
            edit="external"
            editForm={<ExternalForm formStructure={tableCols} actionObject={actionObject} editing={true} getTableData={getTableData} setLoading={setLoading} />}
            editCondition={(row) =>
                checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/indicator/edit", datas) 
            }
            fixedLayout
        />
    )

}

function ExternalForm({ editing = false, actionObject, getTableData, ...restProps }) {

    const { formValues, setFormValues, successCallback, failedCallback, handleClose, formStructure, setLoading } = restProps;

    const [formValidation, setFormValidation] = React.useState({});
    
    const [waiting, set_waiting] = useState(false) 
    
    const dispatch = useDispatch()

    /* action and submit for request  */
    const handleSubmit = () => {

        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)

        let config = {
            method: 'post',
            url: `${SERVER_URL}/rest/s1/planning/workEffort`,
            headers: { 'api_key': localStorage.getItem('api_key') },
            data: { ...formValues, workEffortTypeEnumId: "KPI", rootWorkEffortId: actionObject.workEffortId }

        }

        axios(config).then(response => {
            getTableData()
            setFormValues({})
            handleClose()
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            set_waiting(false)
        }).catch(err => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            set_waiting(false)
         })
    }

    const handleEdit = () => {

        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)

        let config = {
            method: 'put',
            url: `${SERVER_URL}/rest/s1/planning/workEffort`,
            headers: { 'api_key': localStorage.getItem('api_key') },
            data: formValues

        }

        axios(config).then(response => {
            getTableData()
            setFormValues({})
            handleClose()
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
            set_waiting(false)
        }).catch(err => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
            set_waiting(false)
         })
    }

    const handleReset = () => {
        setFormValues({})
        handleClose()
    }

    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=> editing ?  handleEdit() : handleSubmit() }
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


