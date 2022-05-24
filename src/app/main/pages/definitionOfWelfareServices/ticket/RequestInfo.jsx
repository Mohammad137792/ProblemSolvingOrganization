import React from 'react';
import TablePro from 'app/main/components/TablePro';
import {Button, CardContent , Box, Card, CardHeader ,Collapse,Grid} from "@material-ui/core";
import FormPro from './../../../components/formControls/FormPro';
import ActionBox from './../../../components/ActionBox';
import { useEffect, useState } from 'react';
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../configs";
import axios from "axios";
import {Image} from "@material-ui/icons"
import Cost from './Cost';

const RequestInfo = (props) => {
    const {requestFormValues, setRequestFormValues , welfareId} = props
    const [transportationInfo,setTransportationInfo]=useState([])
    const [railWayEnumId,setRailWayEnumId]=useState()
    const [EntGeo,setEntGeo]=useState([])
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [
        {
            label: "نوع حمل و نقل",
            name:   "transportationTypeEnumId",
            type:   "select",
            options : transportationInfo ,
            optionLabelField : "description" ,
            optionIdField : "enumId" ,
            col     : 4
        },{
            label:  "کلاس حمل و نقل",
            name:   "transportationClass",
            type:   "select",
            options : "TransportationClass" ,
            col     : 4
        },requestFormValues?.transportationTypeEnumId==railWayEnumId ? {
            label:  "نوع کوپه",
            name:   "coupeType" ,
            type:   "select",
            options :  "CoupeType" ,
            col     : 4
        } : {
            type    : "component",
            component: "" ,
            col     : 4
        },{
            label:  "مبدا",
            name:   "origin",
            type:   "select",
            options : EntGeo ,
            optionLabelField : "geoName" ,
            optionIdField : "geoId" ,
            filterOptions   : options => options.filter(o=>o.geoTypeEnumId==="GEOT_CITY"),
            col     : 3
        },{
            label:  "مقصد",
            name:   "destination",
            type:   "select",
            options : EntGeo ,
            filterOptions   : options => options.filter(o=>o.geoTypeEnumId==="GEOT_CITY"),
            optionLabelField : "geoName" ,
            optionIdField : "geoId",
            col     : 3
        },{
            label:  "نوع بلیط",
            name:   "ticketTypeEnumId",
            type:   "select",
            options : "TicketType" ,
            optionLabelField : "description" ,
            optionIdField : "enumId" ,
            filterOptions   : options => options.filter(o=>!o.parentEnumId),
            col     : 3
        },{
            label:  "تعداد مسافران مجاز",
            name:   "accompany",
            type:   "number",
            col     : 3
        },{
            label:  "قوانین لغو درخواست",
            name:   "description",
            type:   "textarea",
            rows : 6 ,
            col     : 12
        }]  
    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=TransportationType"   , axiosKey )
            .then((info)=>{
                setTransportationInfo(info.data)
                info.data.map((item)=>{
                    if(item.description == "قطار"){
                        setRailWayEnumId(item.enumId)
                    }
                })
            })
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/GEO" , axiosKey)
            .then(GEO=>{
                setEntGeo(GEO.data.result)
            })
    },[]) 
    console.log("setRequestFormValues" , requestFormValues );
    return (
        <>
            <FormPro 
                prepend={formStructure}
                formValues={requestFormValues}
                setFormValues={setRequestFormValues}
            />
            <Grid container spacing={2} >
                <Grid item xs={12} md={6} >
                    <Attachments welfareId={welfareId}/>
                    {/* <CompetenceTable/> */}
                </Grid>
                <Grid item xs={12} md={6} >
                    <RequiredDocuments welfareId={welfareId}/>
                </Grid>
                <Grid item xs={12} >
                    <Cost ticketTypeEnumId={requestFormValues.ticketTypeEnumId} welfareId={welfareId}/>
                </Grid>
            </Grid>
        </>
    );
};


export default RequestInfo;

function RequiredDocuments(props) {
    const {welfareId}=props
    const [tableContent, setTableContent] = React.useState([]);
    const[loading,setLoading]=useState(true)
    const tableCols = [
        {name: "documentTypeEnumId", label: "نام مدرک", type: "select" , options : "PartyContentType" },
    ]
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    React.useEffect(()=>{
        if (loading){
            axios.get(SERVER_URL + `/rest/s1/welfare/entity/WelfareDocument?welfareId=${welfareId}` , axiosKey )
            .then((getData)=>{
                setTableContent(getData.data)
                setLoading(false)
            })
        }
    },[loading])
    const handleAdd = (newData)=>{
        let postData=Object.assign({},newData,{welfareId : welfareId})
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/welfare/entity/WelfareDocument" , postData , axiosKey )
                .then(()=>{
                    setLoading(true)
                    resolve()
                }).catch(()=>{
                    reject()
                })
        })
    }
    const handleRemove = (oldData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/welfare/entity/WelfareDocument?welfareDocumentId=" + oldData.welfareDocumentId  , axiosKey )
                .then(()=>{
                    setLoading(true)
                    resolve()
                }).catch(()=>{
                    reject()
                })
        })
    }
    return(
        <TablePro
            title="مدارک مورد نیاز"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add="inline"
            addCallback={handleAdd}
            removeCallback={handleRemove}
            loading={loading}
        />
    )
}
 function Attachments({formValues, setFormValues ,welfareId }) {
    const [tableContent, setTableContent] = React.useState([]);
    const[loading,setLoading]=useState(true)
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const tableCols = [
        {name: "attachmentsType", label: "نوع پیوست", type: "select" , options : "WelfareContent" , style: {width:"40%"}},
        {name: "observeFile", label: "دانلود فایل" , style: {width:"40%"}}
    ]
    React.useEffect(()=>{
        if (loading){
            axios.get(SERVER_URL + `/rest/s1/welfare/entity/WelfareContent?welfareId=${welfareId}` , axiosKey )
            .then((getData)=>{
                let tableData=[]
                if( getData.data.length>0){
                    getData.data.map((item,index)=>{
                        console.log("item.contentLocation" , item.contentLocation);
                        let data={
                            observeFile : <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.contentLocation}
                            target="_blank" >  <Image />  </Button> ,
                            welfareContentId : item.welfareContentId ,
                            attachmentsType : item.welfareContentTypeEnumId
                        }
                        tableData.push(data)
                        if (index==getData.data.length-1){
                            setTimeout(()=>{
                                setTableContent(tableData)
                                setLoading(false)
                            },50)
                        }
                    })
                }
                if( getData.data.length==0){
                    setTableContent(tableData)
                    setLoading(false)
                }
            })
        }
    },[loading])
    const handleRemove = (data)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/welfare/entity/WelfareContent?welfareContentId=" + data.welfareContentId  , axiosKey )
            .then(()=>{
                setLoading(true)
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    }
    return (
        <TablePro
            title="پیوست"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add="external"
            addForm={<AttachmentsForm welfareId={welfareId} loading={loading} setLoading={setLoading}  />}
            removeCallback={handleRemove}
            loading={loading}
            fixedLayout
        />
    )
}

function AttachmentsForm({welfareId , loading , setLoading ,...restProps}) {
    const {formValues, setFormValues, successCallback, failedCallback, handleClose} = restProps;
    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    }
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [{
        label:  "نوع پیوست",
        name:   "attachmentsType",
        type:   "select",
        options : "WelfareContent" ,
        col     : 6
    },{
        label:  "پیوست",
        name:   "contentLocation",
        type:   "inputFile",
        col     : 6
    }]

    const handleCreate = (formData)=>{
        return new Promise((resolve, reject) => {
            const attachFile = new FormData();
            attachFile.append("file", formValues.contentLocation);
            axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", attachFile, config)
                .then(res => {
                    const postData={
                        welfareId : welfareId ,
                        contentLocation : res.data.name ,
                        welfareContentTypeEnumId : formValues.attachmentsType
                    }
                    axios.post(SERVER_URL + "/rest/s1/welfare/entity/WelfareContent" , postData , axiosKey )
                        .then(()=>{
                            setLoading(true)
                            handleClose()
                            resolve(formData)
                        })
                })
        })
    }
    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={()=>{
                handleCreate(formValues).then((data)=>{
                    successCallback(data)
                })
            }}
            resetCallback={()=>{
                setFormValues({})
                handleClose()
            }}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">افزودن</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}