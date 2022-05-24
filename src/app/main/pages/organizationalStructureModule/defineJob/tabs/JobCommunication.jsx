import React, {useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import {Button} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import TablePro from "../../../../components/TablePro";

export default function JobCommunication({jobId}) {
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = React.useState([]);
    const tableCols = [
        {name: "title", label: "نام واحد سازمانی", type: "text"},
        {name: "communicationTypeEnumId", label: "نوع ارتباط", type: "select", options: "CommunicationType"},
        {name: "communicationPlatformEnumId", label: "بستر ارتباط", type: "select", options: "CommunicationPlatform"},
        {name: "description", label: "توضیحات", type: "textarea", col: 12},
    ]

    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/orgStructure/entity/JobCommunication",{
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
        axios.get(SERVER_URL + "/rest/s1/orgStructure/entity/JobCommunication", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                jobId: jobId,
            }
        }).then(res => {
            setTableData(res.data)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            console.log('get job communication error..', err);
        });
    },[jobId]);

    return (
        <TablePro
            title="ارتباطات"
            columns={tableCols}
            rows={tableData}
            setRows={setTableData}
            add="external"
            addForm={<ExternalForm formStructure={tableCols} jobId={jobId}/>}
            edit="external"
            editForm={<ExternalForm formStructure={tableCols} jobId={jobId} editing={true}/>}
            removeCallback={handleRemove}
            loading={loading}
            fixedLayout
        />
    )
}


function ExternalForm({formStructure, editing=false, jobId,...restProps}) {
    const {formValues, setFormValues, successCallback, failedCallback, handleClose} = restProps;
    const handleEdit = (data)=>{
        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + "/rest/s1/orgStructure/entity/JobCommunication", data,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(() => {
                resolve(data)
            }).catch(err => {
                console.log('edit job communication error..', err);
                reject(err)
            });
        })
    }
    const handleCreate = (data)=>{
        data.jobId = jobId;
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/orgStructure/entity/JobCommunication", data,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then((res) => {
                data.jobCommunicationId = res.data.jobCommunicationId;
                resolve(data)
            }).catch(err => {
                console.log('create job communication error..', err);
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
