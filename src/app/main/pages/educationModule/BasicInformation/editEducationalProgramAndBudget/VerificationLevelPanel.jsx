import React, {useEffect, useState} from "react";
import TablePro from "../../../../components/TablePro";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";

export default function VerificationLevelPanel({verificationId , title , verificationTableContent , setVerificationTableContent  }) {

    const [loading, setLoading] = useState(true);

    const tableCols = [
        {name: "sequence", label: "ترتیب", type: "number", required: true, style: {width:"20%"}},
        {name: "emplPositionId", label: "عنوان رده تایید", type: "select", options: "EmplPosition", optionIdField: "emplPositionId", required: true, style: {width:"40%"},
            filterOptions: options => options.filter(o=>!o.thruDate && o.statusId==="EmpsActive"),
            getOptionLabel: opt => opt ? (`${opt.pseudoId} ─ ${opt.description}` || "؟") : ""},
        {name: "reject", label: "امکان رد", type: "indicator"},
        {name: "modify", label: "امکان رد برای اصلاح", type: "indicator"},
    ]
    useEffect(()=>{
        if(verificationId){
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/VerificationLevel?verificationId=${verificationId}`,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then( res => {
                setLoading(false)
                setVerificationTableContent(res.data.result)
            }).catch(()=>{
                setLoading(false)
            });
        }
        else{
            setLoading(false)
            setVerificationTableContent([])
        }
    },[verificationId])
    const handleAdd = (newData)=>{
        newData.sequence = Number(newData.sequence)
        return new Promise((resolve, reject) => {
            if(verificationTableContent.findIndex(i=>i?.sequence===newData?.sequence)>-1){
                reject("شماره ترتیب انتخاب شده، تکراری است!")
            }else {
                resolve(newData)
            }
        })
    }
    const handleEdit = (newData, oldData)=>{
        newData.sequence = Number(newData.sequence)
        return new Promise((resolve, reject) => {
            if(verificationTableContent.findIndex(i=>i?.sequence===newData?.sequence)>-1 && oldData?.sequence!==newData?.sequence){
                reject("شماره ترتیب انتخاب شده، تکراری است!")
            }else {
                resolve(newData)
            }
        })
    }
    const handleRemove = (oldData)=>{
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
    return (
        <TablePro
            title={title ?? "لیست مراحل صدور"}
            defaultOrderBy='sequence'
            columns={tableCols}
            rows={verificationTableContent}
            setRows={setVerificationTableContent}
            loading={loading}
            add="inline"
            addCallback={handleAdd}
            edit="inline"
            editCallback={handleEdit}
            removeCallback={handleRemove}
            showRowNumber={false}
        />
    )
}
