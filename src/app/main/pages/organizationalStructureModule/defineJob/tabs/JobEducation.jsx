import React, {useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import TablePro from "../../../../components/TablePro";

export default function JobEducation({jobId}) {
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = React.useState([]);
    const tableCols = [
        {name: "qualificationTypeEnumId", label: "مقطع تحصیلی", type: "select", options: "QualificationType",
            filterOptions: options => options.filter(o=>o.enumId!=="WorkExperience"),
            required: true, disableClearable: true, style: {width:"20%"}},
        {name: "fieldEnumId", label: "رشته تحصیلی", type: "select", options: "UniversityFields", disableClearable: true, style: {width:"20%"}},
        {name: "description", label: "توضیحات", type: "text", style: {width:"60%"}},
    ];

    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/orgStructure/entity/JobEducation",{
                headers: {'api_key': localStorage.getItem('api_key')},
                params: rowData
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
        })
    };

    const handleEdit = (formData,rowData)=>{
        return new Promise((resolve, reject) => {
            const ind = findSimilar(formData)
            if(ind>-1 && (formData.fieldEnumId!==rowData.fieldEnumId || formData.qualificationTypeEnumId!==rowData.qualificationTypeEnumId)){
                reject("تحصیلات انتخاب شده تکراری است!")
            }else {
                axios.put(SERVER_URL + "/rest/s1/orgStructure/entity/JobEducation", formData, {
                    headers: {'api_key': localStorage.getItem('api_key')},
                }).then(() => {
                    resolve(formData)
                }).catch(() => {
                    reject()
                });
            }
        })
    };

    const handleCreate = (formData)=>{
        formData.jobId = jobId;
        return new Promise((resolve, reject) => {
            const ind = findSimilar(formData)
            if(ind>-1){
                reject("تحصیلات اضافه شده تکراری است!")
            }else {
                axios.post(SERVER_URL + "/rest/s1/orgStructure/entity/JobEducation", formData, {
                    headers: {'api_key': localStorage.getItem('api_key')},
                }).then((res) => {
                    formData.jobEducationId = res.data.jobEducationId;
                    resolve(formData)
                }).catch(() => {
                    reject()
                });
            }
        })
    };

    const findSimilar = (row)=>{
        const ind = tableData.findIndex(i=>i.fieldEnumId===row.fieldEnumId && i.qualificationTypeEnumId===row.qualificationTypeEnumId)
        return ind
    }

    React.useEffect(()=>{
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/orgStructure/entity/JobEducation", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                jobId: jobId
            }
        }).then(res => {
            setTableData(res.data)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        });
    },[jobId]);

    return (
        <TablePro
            title="تحصیلات"
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
