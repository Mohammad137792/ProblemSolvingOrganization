import React, {useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import {Button, Grid} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import TablePro from "../../../../components/TablePro";

export default function JobResponsibility({jobId}) {
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = React.useState([]);
    const tableCols = [
        {name: "title", label: "عنوان مسئولیت", type: "text", style: {width:"20%"}},
        {name: "activityPercentage", label: "درصد فعالیت", type: "number", style: {width:"15%"}},
        {name: "activity", label: "فعالیت های مرتبط", type: "text", style: {width:"25%"}},
        {name: "result", label: "نتیجه مورد انتظار", type: "text", style: {width:"25%"}},
    ]

    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/orgStructure/entity/JobResponsibility",{
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
        axios.get(SERVER_URL + "/rest/s1/orgStructure/entity/JobResponsibility", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                jobId: jobId,
            }
        }).then(res => {
            setTableData(res.data)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            console.log('get job responsibility error..', err);
        });
    },[jobId]);

    return (
        <TablePro
            title="مسئولیت ها و وظایف"
            columns={tableCols}
            rows={tableData}
            setRows={setTableData}
            add="external"
            addForm={<ExternalForm jobId={jobId}/>}
            edit="external"
            editForm={<ExternalForm jobId={jobId} editing={true}/>}
            removeCallback={handleRemove}
            loading={loading}
            fixedLayout
        />
    )
}
function ExternalForm({editing=false, jobId,...restProps}) {
    const {formValues, setFormValues, successCallback, failedCallback, handleClose} = restProps;
    const formStructure = [
        {name: "title", label: "عنوان مسئولیت", type: "text", col: 4},
        {name: "activityPercentage", label: "درصد فعالیت", type: "number", col: 2},
        {type: "component", component: <Grid item xs={false} md={6}/>},
        {name: "activity", label: "فعالیت های مرتبط", type: "textarea", col: 6},
        {name: "result", label: "نتیجه مورد انتظار", type: "textarea", col: 6},
    ]
    const handleEdit = (formData)=>{
        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + "/rest/s1/orgStructure/entity/JobResponsibility", formData,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(() => {
                resolve(formData)
            }).catch(err => {
                console.log('edit job responsibility error..', err);
                reject(err)
            });
        })
    }
    const handleCreate = (formData)=>{
        formData.jobId = jobId;
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/orgStructure/entity/JobResponsibility", formData,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then((res) => {
                formData.jobResponsibilityId = res.data.jobResponsibilityId;
                resolve(formData)
            }).catch(err => {
                console.log('create job responsibility error..', err);
                reject(err)
            });
        })
    }
    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={()=>{
                if(editing){
                    handleEdit(formValues).then((data)=>{
                        setFormValues({})
                        successCallback(data)
                    }).catch(()=>{
                        failedCallback()
                    })
                }else{
                    handleCreate(formValues).then((data)=>{
                        setFormValues({})
                        successCallback(data)
                    }).catch(()=>{
                        failedCallback()
                    })
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
