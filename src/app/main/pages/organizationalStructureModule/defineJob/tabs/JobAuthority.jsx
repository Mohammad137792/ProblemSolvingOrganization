import React, {useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import TablePro from "../../../../components/TablePro";

export default function JobAuthority({jobId}) {
    const [loading, setLoading] = useState(true);
    const [importanceDegrees, setImportanceDegrees] = useState([]);
    const [tableData, setTableData] = React.useState([]);
    const tableCols = [
        {name: "title", label: "عنوان", type: "text", style: {width:"20%"}},
        {name: "jobAuthorityTypeEnumId", label: "نوع", type: "select", options: "JobAuthorityType", style: {width:"15%"}},
        {name: "degreeOfImportanceEnumId", label: "درجه اهمیت", type: "select", options: importanceDegrees, style: {width:"15%"}},
        {name: "description", label: "توضیحات", type: "text", style: {width:"unset"}},
    ]

    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/orgStructure/entity/JobAuthority",{
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
            axios.put(SERVER_URL + "/rest/s1/orgStructure/entity/JobAuthority", formData,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(() => {
                resolve(formData)
            }).catch(err => {
                console.log('edit job authority error..', err);
                reject(err)
            });
        })
    }

    const handleCreate = (formData)=>{
        formData.jobId = jobId;
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/orgStructure/entity/JobAuthority", formData,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then((res) => {
                formData.jobAuthorityId = res.data.jobAuthorityId;
                resolve(formData)
            }).catch(err => {
                console.log('create job authority error..', err);
                reject(err)
            });
        })
    }

    React.useEffect(()=>{
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/orgStructure/entity/JobAuthority", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                jobId: jobId,
            }
        }).then(res => {
            setTableData(res.data)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            console.log('get job authority error..', err);
        });
    },[jobId]);

    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=OrdinalScale", {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setImportanceDegrees(res.data.result.filter( item=>
                item.parentEnumId === "SevenPointLikertScale"
            ));
        }).catch(err => {
            console.log('get importance degrees error..', err);
        });
    },[]);

    return (
        <TablePro
            title="تصمیمات، اختیارات و ابعاد"
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
