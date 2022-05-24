import React, {useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import TablePro from "../../../../components/TablePro";

export default function JobCondition({jobId}) {
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = React.useState([]);
    const tableCols = [
        {name: "title", label: "عنوان شرایط کاری", type: "text", style: {width:"40%"}},
        {name: "description", label: "توضیحات", type: "text", style: {width:"unset"}},
    ]

    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/orgStructure/entity/JobDetail",{
                headers: {'api_key': localStorage.getItem('api_key')},
                params: rowData
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
        })
    }

    const handleEdit = (formData)=>{
        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + "/rest/s1/orgStructure/entity/JobDetail", formData,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(() => {
                resolve(formData)
            }).catch(err => {
                console.log('edit job condition error..', err);
                reject(err)
            });
        })
    }

    const handleCreate = (formData)=>{
        formData.jobId = jobId;
        formData.jobDetailTypeEnumId = "JbdWorkingConditions";
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/orgStructure/entity/JobDetail", formData,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then((res) => {
                formData.jobDetailId = res.data.jobDetailId;
                resolve(formData)
            }).catch(err => {
                console.log('create job condition error..', err);
                reject(err)
            });
        })
    }

    React.useEffect(()=>{
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/orgStructure/entity/JobDetail", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                jobId: jobId,
                jobDetailTypeEnumId: "JbdWorkingConditions"
            }
        }).then(res => {
            setTableData(res.data)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            console.log('get job condition error..', err);
        });
    },[jobId]);

    return (
        <TablePro
            title="شرایط کاری"
            columns={tableCols}
            rows={tableData}
            setRows={setTableData}
            loading={loading}
            add="inline"
            addCallback={handleCreate}
            edit="inline"
            editCallback={handleEdit}
            removeCallback={handleRemove}
            fixedLayout
        />
    )
}
