import React, {useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import TablePro from "../../../../components/TablePro";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import {Button} from "@material-ui/core";

export default function JobGrade({jobId}) {
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = React.useState([]);
    const tableCols = [
        {name: "jobTitle", label: "عنوان طبقه شغل", type: "text", style: {width:"25%"}},
        {name: "jobTitleCode", label: "کد بیمه شغل", type: "text", style: {width:"15%"}},
        {name: "jobScore", label: "امتیاز طبقه شغلی", type: "number", style: {width:"20%"}},
        {name: "jobGradeEnumId", label: "طبقه", type: "select", options: "JobGrade", required: true, style: {width:"unset"}},
    ]

    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/orgStructure/entity/JobGrade",{
                headers: {'api_key': localStorage.getItem('api_key')},
                params: rowData
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
        })
    }

    React.useEffect(()=>{
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/orgStructure/job/grade", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                jobId: jobId,
            }
        }).then(res => {
            setTableData(res.data.jobGrades)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        });
    },[jobId]);

    return (
        <TablePro
            title="طبقه های شغلی"
            columns={tableCols}
            rows={tableData}
            setRows={setTableData}
            loading={loading}
            add="external"
            addForm={<ExternalForm tableData={tableData} jobId={jobId}/>}
            edit="external"
            editForm={<ExternalForm tableData={tableData} jobId={jobId} editing={true}/>}
            removeCallback={handleRemove}
            fixedLayout
        />
    )
}

function ExternalForm({editing=false, tableData, jobId,...restProps}) {
    const {formValues, setFormValues, oldData, successCallback, failedCallback, handleClose} = restProps;
    const [formValidation, setFormValidation] = useState({});
    const [jobTitles, setJobTitles] = useState([]);
    const pk = "insuranceNumberEnumId"
    const onChange = (newOption) => {
        setJobTitles([newOption])
    }
    const formStructure = [
        {
            name    : "insuranceNumberEnumId",
            label   : "عنوان طبقه شغل",
            type    : "select",
            options : jobTitles,
            required: true,
            long    : true,
            urlLong : "/rest/s1/fadak/long",
            changeCallback: onChange
        },{
            name    : "insuranceNumberEnumId",
            label   : "کد بیمه شغل",
            type    : "select",
            options : jobTitles,
            optionLabelField: "enumCode",
            required: true,
            long    : true,
            urlLong : "/rest/s1/orgStructure/job/jobTitle/searchJobTitleCode",
            changeCallback: onChange
        },{
            name    : "jobScore",
            label   : "امتیاز طبقه شغلی",
            type    : "number",
        },{
            name    : "jobGradeEnumId",
            label   : "طبقه",
            type    : "select",
            options : "JobGrade",
            required: true,
        }
    ]

    React.useEffect(() => {
        if(formValues[pk]) {
            axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumId=" + formValues[pk], {
                headers: {'api_key': localStorage.getItem('api_key')}
            }).then(res => {
                setJobTitles([res.data.result])
            }).catch(() => {
            });
        }
    }, [])

    const handleEdit = (formData)=>{
        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + "/rest/s1/orgStructure/entity/JobGrade", formData,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(() => {
                resolve(formData)
            }).catch(err => {
                reject(err)
            });
        })
    }

    const handleCreate = (formData)=>{
        formData.jobId = jobId;
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/orgStructure/entity/JobGrade", formData,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then((res) => {
                formData.jobGradeId = res.data.jobGradeId;
                resolve(formData)
            }).catch(err => {
                reject(err)
            });
        })
    }

    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{
                const ind = tableData.findIndex(i=>i[pk]===formValues[pk])
                const newFormValues = Object.assign({}, formValues, {
                    jobTitle: jobTitles[0].description ,
                    jobTitleCode: jobTitles[0].enumCode
                })
                if(editing){
                    if(ind>-1 && formValues[pk]!==oldData[pk]){
                        failedCallback("طبقه شغلی انتخاب شده تکراری است!")
                    }else {
                        handleEdit(newFormValues, oldData).then((data) => {
                            setFormValues({})
                            successCallback(data)
                        }).catch(() => {
                            failedCallback()
                        })
                    }
                }else{
                    if(ind>-1){
                        failedCallback("طبقه شغلی اضافه شده تکراری است!")
                    }else {
                        handleCreate(newFormValues).then((data) => {
                            setFormValues({})
                            successCallback(data)
                        }).catch(() => {
                            failedCallback()
                        })
                    }
                }
            }}
            resetCallback={()=>{
                setFormValues({})
                handleClose()
            }}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}
