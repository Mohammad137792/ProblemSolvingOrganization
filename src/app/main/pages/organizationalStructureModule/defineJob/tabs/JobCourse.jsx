import React, {useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import TablePro from "../../../../components/TablePro";

export default function JobCourse({jobId}) {
    const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = React.useState([]);
    const tableCols = [
        {name: "courseId", label: "عنوان دوره", type: "select", options: courses, optionIdField: "courseId", optionLabelField: "title", required: true, style: {width:"20%"}},
        {name: "hasLicense", label: "دارای مدرک", type: "indicator", style: {width:"20%"}},
        {name: "courseLength", label: "طول دوره (ساعت)", type: "number", style: {width:"20%"}},
        {name: "description", label: "توضیحات", type: "text", style: {width:"40%"}},
    ];

    const handleRemove = (rowData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/orgStructure/entity/JobCourse",{
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
        const packet = {
            newJobCourse: formData,
            oldJobCourse: rowData
        };
        return new Promise((resolve, reject) => {
            const ind = findSimilar(formData)
            if(ind>-1 && formData.courseId!==rowData.courseId ){
                reject("نیاز آموزشی اضافه شده تکراری است!")
            }else {
                axios.put(SERVER_URL + "/rest/s1/orgStructure/job/course", packet, {
                    headers: {'api_key': localStorage.getItem('api_key')},
                }).then(() => {
                    resolve(formData)
                }).catch(err => {
                    reject(err)
                });
            }
        })
    };

    const handleCreate = (formData)=>{
        formData.jobId = jobId;
        return new Promise((resolve, reject) => {
            const ind = findSimilar(formData)
            if(ind>-1){
                reject("نیاز آموزشی اضافه شده تکراری است!")
            }else {
                axios.post(SERVER_URL + "/rest/s1/orgStructure/entity/JobCourse", formData, {
                    headers: {'api_key': localStorage.getItem('api_key')},
                }).then(() => {
                    resolve(formData)
                }).catch(err => {
                    reject(err)
                });
            }
        })
    };

    const findSimilar = (row)=>{
        const ind = tableData.findIndex(i=>i.courseId===row.courseId)
        return ind
    }

    React.useEffect(()=>{
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/orgStructure/job/course", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                jobId: jobId
            }
        }).then(res => {
            setTableData(res.data.jobCourses)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        });
    },[jobId]);

    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/training/entity/Course?pageSize=10000", {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setCourses(res.data);
        }).catch(err => {
            console.log('get courses error..', err);
        });
    },[]);

    return (
        <TablePro
            title="نیاز آموزشی"
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
