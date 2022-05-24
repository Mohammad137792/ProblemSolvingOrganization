import React, { useState, useEffect } from 'react'

import TablePro from './../../../../components/TablePro'
import FormPro from './../../../../components/formControls/FormPro'
import { Button } from '@material-ui/core'
import ActionBox from './../../../../components/ActionBox'
import axios from 'axios'
import { SERVER_URL } from '../../../../../../configs'
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";

import checkPermis from "app/main/components/CheckPermision";

import CircularProgress from "@material-ui/core/CircularProgress";

export default function Tasks({ actionObject, dataOption }) {

    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [opt, setOpt] = useState()
    const [data, setData] = useState([])


    const dispatch = useDispatch();

    const datas = useSelector(({ fadak }) => fadak);

    const tableCols = [
        { name: "workEffortName", label: "عنوان اقدام", type: "text"  },
        // { name: "partyId", label: "مسئول", type: "select", options: dataOption?.person?.resultRest, optionLabelField: "userFullName", optionIdField: "partyId" },
        // { name: "workEffortContentId", label: "مصوبه مربوطه ", type: "select", options: opt?.resol, optionLabelField: "description", optionIdField: "workEffortContentId" },
        // , {
        //     label: " تاریخ شروع برنامه ریزی شده",
        //     name: "estimatedStartDate",
        //     type: "date",
        // }, {
        //     label: "تاریخ پایان برنامه ریزی شده",
        //     name: "estimatedCompletionDate",
        //     type: "date",
        // },

        // , {
        //     label: "تاریخ پایان واقعی",
        //     name: "actualCompletionDate",
        //     type: "date",


        // }, {
        //     label: "مدت زمان واقعی",
        //     name: "actualWorkDuration",
        //     type: "number",


        // },
        ,{ name: "priority", label: "ضریب اهمیت ", type: "number" },
        { name: "percentComplete", label: "درصد پیشرفت ", type: "number" },
        // { name: "description", label: " توضیحات ", type: "textarea", col: 12 },
    ]

    useEffect(() => {
        getTableData()
    }, [actionObject])

    const getTableData = () => {
        let config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/planning/WorkEffort?workEffortTypeEnumId=WetTask`,
            headers: { 'api_key': localStorage.getItem('api_key') },

        }
        let configPty = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/planning/workPtyAndContent`,
            headers: { 'api_key': localStorage.getItem('api_key') },

        }

        axios(config).then(response => {

            axios(configPty).then(res => {
                let obj = {}
                res.data?.person && res.data.person.map((item, index) => {
                    if (!obj[item.workEffortId]) {
                        obj[item.workEffortId] = []
                    }
                    obj[item.workEffortId].push(item)
                })

                let obj_content = {}
                res.data?.content && res.data.content.map((item, index) => {
                    if (!obj_content[item.workEffortId]) {
                        obj_content[item.workEffortId] = []
                    }
                    obj_content[item.workEffortId].push(item)
                })


                let list = response.data.result.map((item) => {

                    if (obj[item.workEffortId]) {
                        return { ...item, ...obj[item.workEffortId][0] }
                    }

                    else {
                        return item
                    }
                })

                list = list.map((item) => {
                    if (obj_content[item.workEffortId]) {
                        return { ...item, ...obj_content[item.workEffortId][0], partyIdLast: item.partyId }
                    }
                    else {
                        return item
                    }
                })

                let rootList = []
                let subList = []
                list.filter(ele => {
                    if (ele?.rootWorkEffortId) {
                        rootList.push(ele)
                    }
                    if (ele?.parentWorkEffortId) {
                        subList.push(ele)
                    }
                })

                let ListId = rootList.filter(ele => {
                    if (ele?.rootWorkEffortId === actionObject?.workEffortId) {
                        return ele
                    }
                })

                setTableData([])

                if (ListId.length != 0) {
                    for (let ele in ListId) {
                        let dataTree = []
                        setData(prevState => {
                            return [...prevState, ListId[ele]]
                        })
                        setTableData(prevState => {
                            return [...prevState, ...dataTree.concat(ListId[ele])]
                        })
                        setLoading(false)

                    }
                }
                if (ListId.length == 0) {
                    setLoading(false)
                }

            })
        })

        let configs = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/planning/WorkEffortContent?workEffortId=${actionObject?.workEffortId}`,
            headers: { 'api_key': localStorage.getItem('api_key') },

        }
        axios(configs).then(response => {
            setOpt(prevState => ({ resol: response.data.result }))
        })

    }

    const deleteProgram = (data) => {

        let config = {
            method: 'delete',
            url: `${SERVER_URL}/rest/e1/WorkEffort?workEffortId=${data.workEffortId}`,
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
            add= {checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/tasks/add", datas) ? 'external' : false }
            addForm={<ExternalForm  opt={opt} getTableData={getTableData}  dataOption={dataOption} actionObject={actionObject} setLoading={setLoading} tableData={tableData}/>}
            editForm={<ExternalForm editing={true}  opt={opt} getTableData={getTableData}  dataOption={dataOption} actionObject={actionObject} setLoading={setLoading} tableData={tableData}/>}
            edit="external"
            editCondition={(row) =>
                checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/tasks/edit", datas) 
            }
            removeCallback={deleteProgram}
            removeCondition={(row) =>
                checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/tasks/delete", datas) 
            }
            showRowNumber={false}
        />

    )

}

function ExternalForm({ editing = false, dataOption, data, getTableData, opt, setData, ...restProps }) {

    const { formValues, setFormValues, successCallback, failedCallback, handleClose, actionObject, setLoading, tableData } = restProps;

    const [formValidation, setFormValidation] = React.useState({});

    const [waiting, set_waiting] = useState(false) 

    const [parentWorkEffortId,setParentWorkEffortId] = useState ([])

    const dispatch = useDispatch();

    const formStructure = [
        { name: "workEffortName", label: "عنوان اقدام", type: "text", col: 3 , required: true },
        // { name: "partyId", label: "مسئول", type: "select", options: dataOption?.person?.resultRest, optionLabelField: "userFullName", optionIdField: "partyId", col: 2 },
        { name: "parentWorkEffortId", label: "اقدام بالاتر ", type: "select", options: parentWorkEffortId, optionLabelField: "workEffortName", optionIdField: "workEffortId" , col: 3},
        // { name: "workEffortContentId", label: "مصوبه مربوطه ", type: "select", options: opt?.resol, optionLabelField: "description", optionIdField: "workEffortContentId", col: 3 },
        , {
            label: " تاریخ شروع برنامه ریزی شده",
            name: "estimatedStartDate",
            type: "date",
            col: 3
        }, {
            label: "تاریخ پایان برنامه ریزی شده",
            name: "estimatedCompletionDate",
            type: "date",
            col: 3
        },{
            label: "تاریخ پایان واقعی",
            name: "actualCompletionDate",
            type: "date",
            col: 3
        },{
            label: "مدت زمان واقعی",
            name: "actualWorkDuration",
            type: "number",
            col: 3
        },
        { name: "priority", label: "ضریب اهمیت ", type: "number" , col: 3},
        { name: "percentComplete", label: "درصد پیشرفت ", type: "number" , col: 3 },
        { name: "description", label: " توضیحات ", type: "textarea" , col: 12 },
    ]

    const handleSubmit = () => {

        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)

        if (editing) {
            handleEdit()
        } else if (!editing) {

            const data = { ...formValues, workEffortTypeEnumId: "WetTask", rootWorkEffortId : actionObject.workEffortId }

            const config = {
                method: 'post',
                url: `${SERVER_URL}/rest/s1/planning/workEffort`,
                headers: { 'api_key': localStorage.getItem('api_key') },
                data: data

            }
            axios(config).then(response => {

                getTableData()
                setLoading(true)
                setFormValues({})
                handleClose()
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                set_waiting(false)

            }).catch(err => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
                set_waiting(false)
             })
        }

    }

    const handleEdit =  () => {

        let data = { ...formValues }
        set_waiting(true)

        const config = {
            method: 'put',
            url: `${SERVER_URL}/rest/s1/planning/workEffort`,
            headers: { 'api_key': localStorage.getItem('api_key') },
            data: data

        }

        axios(config).then(response => {

            getTableData()
            setLoading(true)
            setFormValues({})
            handleClose()
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
            set_waiting(false)

        }).catch(err => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
            set_waiting(false)
        })

    }

    useEffect(() => {
        Higheraction();
    }, [formValues?.workEffortId,tableData])

    function Higheraction () {
        axios.get(SERVER_URL + `/rest/s1/workEffort/parentWorkeffortField?workeffortTypeEnumId=WetTask&rootWorkEffortId=${actionObject?.workEffortId}&workEffortId=${formValues?.workEffortId ?? ""}`, {
            headers: {'api_key': localStorage.getItem('api_key')},
        })
        .then((res) => {
            setParentWorkEffortId(res.data.result)
        });
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
            submitCallback={handleSubmit}
            resetCallback={handleReset}
            actionBox={<ActionBox>
                <Button type="submit" role="primary"
                    disabled={waiting}
                    endIcon={waiting?<CircularProgress size={20}/>:null}
                > {editing ? 'ویرایش' : 'افزودن'}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}
