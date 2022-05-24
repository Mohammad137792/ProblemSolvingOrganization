import TablePro from 'app/main/components/TablePro'
import React, { useState, useEffect } from 'react'
import instanceAxios from 'app/main/api/axiosRest'


function TimePer(props) {
    const [tableData, setTableData] = useState([])



    const handleAdd = (newData) => {
        let postData = Object.assign({}, newData, { workEffortId: props.actionObject?.workEffortId })
        console.log("propsssDataaa", newData)
        return new Promise((resolve, reject) => {
            instanceAxios.post("/s1/kavepars/workEffortTimePre", postData , {  headers: { 'api_key': localStorage.getItem('api_key') }})
                .then(() => {
                    // setTableData
                    resolve(postData)
                }).catch(() => {
                    reject()
                })
        })
    }

    const handleEdite = (newData) => {
        let postData = Object.assign({}, newData, { workEffortId: props.actionObject?.workEffortId })
        console.log("propsssDataaa", newData)
        return new Promise((resolve, reject) => {
            instanceAxios.put("/s1/kavepars/workEffortTimePre", postData , {  headers: { 'api_key': localStorage.getItem('api_key') }})
                .then(() => {
                    // setTableData
                    resolve(postData)
                }).catch(() => {
                    reject()
                })
        })
    }


    const handlerRemove= (newData) => {
        let postData = Object.assign({}, newData, { workEffortId: props.actionObject?.workEffortId })
        return new Promise((resolve, reject) => {
            instanceAxios.delete(`/s1/kavepars/workEffortTimePre?workEffortId=${props.actionObject?.workEffortId}&timePeriodId=${newData.timePeriodId}`,{  headers: { 'api_key': localStorage.getItem('api_key') }})
                .then(() => {
                    resolve()
                }).catch(() => {
                    reject()
                })
        })
    }
    const tableCols = [
        {
            label: "دوره",
            name: "timePeriodId",
            type: "select",
            options: props?.dataOption?.timePeriod ?? [],
            optionLabelField: "periodName",
            optionIdField: "timePeriodId",
            required : true
       },
       {
        label: "درصد پیشرفت",
        name: "percentComplete",
        type: "number",

    },
    ]



    useEffect(()=>{
        instanceAxios.get(`/s1/kavepars/workEffortTimePre?workEffortId=${props.actionObject?.workEffortId ?? 0}` , {  headers: { 'api_key': localStorage.getItem('api_key') }}).then(res =>{
            setTableData(res.data.resultRest)
        })
    },[])

   
    return (

        <>
            <TablePro
                title="دوره های برنامه"
                columns={tableCols}
                rows={tableData}
                setRows={setTableData}
                add="inline"
                addCallback={handleAdd}
                edit="inline"
                editCallback={handleEdite}
                delete="inline"
                removeCallback={handlerRemove}

                

            />
        </>
    )
}

export default TimePer