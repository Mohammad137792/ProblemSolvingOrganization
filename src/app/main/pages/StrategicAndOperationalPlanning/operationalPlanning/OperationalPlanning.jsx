import React, { useEffect, useState } from 'react'
import { FusePageSimple } from '@fuse'
import { Box, Card, CardHeader, CardContent, Divider, Grid } from '@material-ui/core'
import TablePro from '../../../components/TablePro'
import { SERVER_URL } from '../../../../../configs'
import axios from 'axios'
//components
import OperationalPlanningForm from './OperationalPlanningForm'
import OperationalPlanningTabs from './OperationalPlanningTabs'

import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import { useDispatch, useSelector } from "react-redux";

import checkPermis from "app/main/components/CheckPermision";

function OperationalPlanning() {

    const [actionObject, setActionObject] = useState(null); //projectId
    const [tableContent, setTableContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataOption, setDataOption] = useState({});
    const [formValues, setFormValues] = useState({});
    const dispatch = useDispatch();

    const datas = useSelector(({ fadak }) => fadak);
    

    const formStructure = [{
        label: "کد",
        name: "universalId",
        type: "text",
        col: 2

    },{
        label: "عنوان برنامه",
        name: "workEffortName",
        type: "text",
        validator: values=>{
            return new Promise(resolve => {
                if(values.workEffortName.replace(/ /g, '') == ""){
                    resolve({error: true, helper: "تعیین این فیلد الزامی است!"})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        col: 10,
        required: true,

    },
    // {
    //     label: "هدف",
    //     name: "purposeEnumId",
    //     type: "select",
    //     options: 'workEffortPurpose',
    //     col: 12
    // },
    // {
    //     label: "دوره",
    //     name: "timePeriodId",
    //     type: "select",
    //     options: dataOption?.timePeriod ?? [],
    //     optionLabelField: "periodName",
    //     optionIdField: "timePeriodId",
    //     required : true
       
    // },
    {
        label: "واحد سازمانی",
        name: "ownerPartyId",
        type: "select",
        options: dataOption.resultRest,
        optionLabelField: "organizationName",
        optionIdField: "partyId",
        required: true,
    },{
        label: " تاریخ شروع برنامه‌ریزی  شده",
        name: "estimatedStartDate",
        type: "date",


    },{
        label: "تاریخ پایان برنامه‌ریزی  شده",
        name: "estimatedCompletionDate",
        type: "date",
    },{
        label: "مدت زمان برنامه‌ریزی  شده",
        name: "estimatedWorkDuration",
        type: "text",
    },{
        label: "وضعیت",
        name: "statusId",
        type: "select",
        options: dataOption.statuslist,
        optionLabelField: "description",
        optionIdField: "statusId",
        col: 3
    },{
        label: " تاریخ شروع واقعی",
        name: "actualStartDate",
        type: "date",
    },{
        label: "تاریخ پایان واقعی",
        name: "actualCompletionDate",
        type: "date",
    },{
        label: "مدت زمان واقعی",
        name: "actualWorkDuration",
        type: "number",
    },{
        label: "ضریب اهمیت",
        name: "priority",
        type: "number",
        col: 3
    },{
        label: "درصد پیشرفت",
        name: "percentComplete",
        type: "number",
        col: 3,

    },{
        name: 'actualBudget',
        label: "بودجه",
        type: "number",
        col: 3
    },{
        name: "actualCost",
        label: "هزینه واقعی",
        type: "text",
        col: 3
    },{
        name: "description",
        label: "توضیحات",
        type: "textarea",
        col: 12
    }]

    const tableColsForTable = [
        {
            label: "عنوان برنامه",
            name: "workEffortName",
            type: "text",
            col: 10
    
        },
         {
            label: "درصد پیشرفت",
            name: "percentComplete",
            type: "number",
            col: 3,
            disabled : true
    
        },
     
        {
            label: "واحد سازمانی",
            name: "ownerPartyId",
            type: "select",
            options: dataOption.resultRest,
            optionLabelField: "organizationName",
            optionIdField: "partyId"
        }, 
        {
            label: "ضریب اهمیت",
            name: "priority",
            type: "number",
            col: 3
        },
        
        ]

    /* get data with reqest by axios and useEffect */
    useEffect(() => {
        /* get select option data */
        getOption()
        /* get table data from workEffort entity */
        getTableData()

    }, [])

    const getOption = () => {
        let configOrgList = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/planning/orgList`,
            headers: { 'api_key': localStorage.getItem('api_key') },
        }
        let configPersonList = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/planning/personList`,
            headers: { 'api_key': localStorage.getItem('api_key') },
        }

        let configTimePr = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/planning/TimePeriod?timePeriodTypeId=`,
            headers: { 'api_key': localStorage.getItem('api_key') },
        }

        axios(configOrgList).then(response => {
            axios(configPersonList).then(response2nd => {
                // setOpt(response.data.resultRest)
                setDataOption(  prevstate => ({ ...prevstate ,...response.data, person: response2nd.data }))
            })
        })

        axios(configTimePr).then(response => {
            setDataOption(prevState =>  ({...prevState, timePeriod : response.data.result }))
        })

    }

    const getTableData = () => {
        let config = {
            method: 'get',
            url: `${SERVER_URL}/rest/s1/planning/workEffort`,
            headers: { 'api_key': localStorage.getItem('api_key') },

        }
        axios(config).then(response => {
            console.log("response.data.workEffortProjectResult" , response.data.workEffortProjectResult);
            setTableContent(response.data.workEffortProjectResult)
            setLoading(false)
        })
    }

    const deleteProgram = (data) => {
        let config = {
            method: 'delete',
            url: `${SERVER_URL}/rest/s1/planning/WorkEffort?workEffortId=${data.workEffortId}`,
            headers: { 'api_key': localStorage.getItem('api_key') },

        }
        return new Promise((resolve, reject) => {
            axios(config).then(response => {
                resolve()
                setTableContent(response.data)
                getTableData()
                setActionObject(null)
                setFormValues({})

            }).catch(err => {
                reject("امکان حذف این ردیف وجود ندارد!")
            })
        })

    }

    /* functions */

    const handleEdit = (id) => {
        setActionObject(id)
        // setTableContent(id)
    }

    return (
        <FusePageSimple
            header={<CardHeader title=" برنامه ریزی عملیاتی" />}
            content={
                <Box p={2}>
                    {checkPermis("strategicAndOperationalPlanning/operationalPlanning/mainPage/add", datas) &&
                    <Card >
                        <CardHeader title="تعریف برنامه عملیاتی  " />
                        <CardContent>
                            <Grid container spacing={2} width={100}>
                                <Grid item xs={12} width={100}>
                                    <OperationalPlanningForm formStructure={formStructure} actionObject={actionObject} setActionObject={setActionObject} dataOption={dataOption} getTableData={getTableData}
                                                             formValues={formValues} setFormValues={setFormValues} />
                                </Grid>

                                {actionObject &&
                                    <React.Fragment>
                                        <Grid item xs={12}>
                                            <Divider variant="fullWidth" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <OperationalPlanningTabs actionObject={actionObject} dataOption={dataOption} />

                                        </Grid>
                                    </React.Fragment>
                                }
                            </Grid>
                        </CardContent>
                    </Card>
                    } 
                    <Box m={2} />
                    <Card >
                        <TablePro
                            title="لیست برنامه‌ها"
                            columns={tableColsForTable}
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                            removeCallback={deleteProgram}
                            removeCondition={(row) =>
                                checkPermis("strategicAndOperationalPlanning/operationalPlanning/mainPage/delete", datas) 
                            }
                            edit={"callback"}
                            editCallback={handleEdit}
                            editCondition={(row) =>
                                checkPermis("strategicAndOperationalPlanning/operationalPlanning/mainPage/edit", datas) 
                            }
                        />
                    </Card>
                </Box>
            }
        />
    )

}
export default OperationalPlanning

