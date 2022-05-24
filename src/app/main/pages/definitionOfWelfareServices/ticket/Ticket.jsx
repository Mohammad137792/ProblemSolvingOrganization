import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {Button, CardContent , Box, Card, CardHeader ,Collapse,Grid } from "@material-ui/core";
import TablePro from 'app/main/components/TablePro';
import SupplyRequest from './SupplyRequest'
import RequestInfo from './RequestInfo';
import CapacitySeparation from './CapacitySeparation';
import ActionBox from './../../../components/ActionBox';
import FormPro from './../../../components/formControls/FormPro';
import {useSelector} from "react-redux";

const Ticket = () => {
    const[tableContent,setTableContent]=useState([])
    const[loading,setLoading]=useState(true)
    const [edit,setEdit]=useState(false)
    const [formValues, setFormValues]=useState({})
    const [formValidation, setFormValidation] =React.useState({});
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [welfareId,setWelfareId]=useState()
    const[confirmForm,setConfirmForm]=React.useState(false);
    const [requestFormValues, setRequestFormValues] = React.useState({});
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const tableCols = [
        {label:  "کد", name:   "welfareCode", type:   "text" , style: {width:"10%"}},
        {label:  "عنوان", name:   "title", type:   "text" , style: {width:"20%"}},
        {label:  "تاریخ ایجاد", name:   "date", type:   "date", style: {width:"10%"} },
        {label:  "نوع حمل و نقل", name:   "transportationTypeEnumId", type:   "select", options : "TransportationType" , style: {width:"20%"}},
        {label:  " کلاس حمل و نقل", name:   "transportationClass" , type:   "select", options : "TransportationClass" , style: {width:"20%"}} ,
        {label:  "فعال", name:   "statusId", type:   "indicator", style: {width:"20%"}}
    ]
    const formStructure = [{
        label:  "کد خدمت رفاهي",
        name:   "welfareCode",
        type:   "text",
        col     : 3
    },{
        label:  " عنوان خدمت رفاهي",
        name:   "title",
        type:   "text",
        col     : 3
    },{
        label:  "تاريخ ايجاد",
        name:   "date",
        type:   "date",
        col     : 3
    },{
        label:  "فعال",
        name:   "statusId",
        type:   "indicator" ,
        col     : 3
    },{
        label:  "شرح خدمت",
        name:   "description",
        type:   "textarea",
        rows : 4 ,
        col     : 6
    },{
        label:  "شرايط و ضوابط",
        name:   "terms",
        type:   "textarea",
        rows : 4 ,
        col     : 6
    },{
        label:  "سهمیه کل",
        name:   "capacity",
        type:   "number",
        col     : 4

    },{
        label:  "سهمیه هر فرد",
        name:   "capacityPerPerson",
        type:   "number",
        col     : 4
    },{
        type    : "group",
        items   : [{
            label:  "حداکثر مهلت ارسال درخواست",
            name:   "timeInterval",
            type:   "number",
        },{
            label   : "روز قبل از تاریخ سفر",
            type    : "text",
            disabled: true,
            fullWidth: false,
            style:  {minWidth:"137px"}
        }],
        col     : 4
    }]
    const handleCreate=()=>{
        axios.get(SERVER_URL + "/rest/s1/training/companyPartyId?partyRelationshipId=" + partyRelationshipId, axiosKey)
        .then(companyId=>{
            let postData={
                welfareTypeEnumId : "Ticket" ,
                companyPartyId : companyId.data.partyId ,
                welfareCode : formValues.welfareCode ,
                title : formValues.title,
                date : formValues.date,
                statusId : formValues.statusId == "Y" ? "activeWelfare" : "deactiveWelfare" ,
                description : formValues.description,
                terms : formValues.terms,
                capacityPerPerson : formValues.capacityPerPerson,
                capacity : formValues.capacity ,
                timeInterval : formValues.timeInterval
            }
            axios.post(SERVER_URL + "/rest/s1/welfare/entity/Welfare" , postData , axiosKey )
                .then(()=>{
                    axios.get(SERVER_URL + "/rest/s1/welfare/entity/Welfare" , axiosKey )
                        .then((WelfareId)=>{
                            setWelfareId(WelfareId.data[WelfareId.data.length-1].welfareId)
                            setEdit(true)
                            setConfirmForm(true)
                        })
                })
        })
    }
    
    React.useEffect(()=>{
        if (!edit){
            let moment = require('moment-jalaali')
            const formDefaultValues = {
                date: moment().format("Y-MM-DD") ,
                statusId : "Y"
            }
            setFormValues(formDefaultValues)
        }
        if(edit){
            axios.get(SERVER_URL + "/rest/s1/welfare/entity/Ticket?welfareId=" + welfareId , axiosKey )
                .then((info)=>{
                    // console.log("setRequestFormValues" ,info.data );
                    setRequestFormValues(info.data[0]??{})
                })
        }
    },[edit])
    React.useEffect(()=>{
        if(loading){
            axios.get(SERVER_URL + "/rest/s1/training/companyPartyId?partyRelationshipId=" + partyRelationshipId, axiosKey)
                .then(companyId=>{
                    axios.get(SERVER_URL + `/rest/s1/welfare/entity/Welfare?companyPartyId=${companyId.data.partyId}&welfareTypeEnumId=${"Ticket"}` , axiosKey )
                        .then((info)=>{
                            let tableData=[]
                            if(info.data.length>0){
                                info.data.map((item,index)=>{
                                    axios.get(SERVER_URL + "/rest/s1/welfare/entity/Ticket?welfareId=" + item.welfareId , axiosKey )
                                    .then((info)=>{
                                        if(item.statusId=="activeWelfare"){
                                            item={...item,statusId:"Y" ,transportationTypeEnumId : info.data[0]?.transportationTypeEnumId??"" , transportationClass : info.data[0]?.transportationClass ??"" }
                                            tableData.push(item)
                                        }
                                        if(item.statusId=="deactiveWelfare"){
                                            item={...item,statusId:"N" ,transportationTypeEnumId : info.data[0]?.transportationTypeEnumId??"" , transportationClass : info.data[0]?.transportationClass ??""}
                                            tableData.push(item)
                                        }
                                        if(index==info.data.length-1){
                                            setTimeout(()=>{
                                                setTableContent(tableData)
                                                setLoading(false)
                                            },50)
                                        }
                                    })
                                })
                            }
                            else{
                                setTableContent(tableData)
                                setLoading(false)
                            }
                        })
                })
        }
    },[loading])
    const handleRemove =(rowData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/welfare/entity/Welfare",{
                headers: {'api_key': localStorage.getItem('api_key')},
                params: rowData
            }).then( () => {
                resolve()
            }).catch(()=>{
                reject("امکان حذف این ردیف وجود ندارد!")
            });
        })
    }
    const handleEdit =(rowData)=>{
        setWelfareId(rowData.welfareId)
        setEdit(true)
        setFormValues(rowData)

    }
    const handleReset =()=>{
        setEdit(false)
    }
    const submit =()=>{
        const welfateData=Object.assign({},formValues,{welfareId : welfareId},{statusId : formValues.statusId == "Y" ? "activeWelfare" : "deactiveWelfare" })
        axios.put(SERVER_URL + "/rest/s1/welfare/entity/Welfare" , welfateData , axiosKey )
            .then(()=>{
                if (confirmForm){
                    const ticketEntity=Object.assign({},requestFormValues,{welfareId : welfareId})
                    axios.post(SERVER_URL + "/rest/s1/welfare/entity/Ticket" , ticketEntity , axiosKey )
                        .then(()=>{
                            setConfirmForm(false)
                            setEdit(false)
                            setFormValues({})
                            setLoading(true)
                        })
                } 
                if(!confirmForm){
                    const ticketEntity=Object.assign({},requestFormValues,{welfareId : welfareId})
                    axios.put(SERVER_URL + "/rest/s1/welfare/entity/Ticket" , ticketEntity , axiosKey )
                        .then(()=>{
                            setConfirmForm(false)
                            setEdit(false)
                            setFormValues({})
                            setLoading(true)
                        })
                }

            })
    }
    console.log("requestFormValues" , requestFormValues);
    return (
        <>
            <Card>
                <CardContent>
                    <Card>
                        <CardContent>
                            <>
                                <FormPro
                                    append={formStructure}
                                    formValues={formValues}
                                    setFormValues={setFormValues}
                                    formValidation={formValidation}
                                    setFormValidation={setFormValidation}
                                    submitCallback={()=>{
                                        if(edit){
                                            // putInfo(formValues)
                                        }else{
                                            handleCreate(formValues)
                                        }
                                    }}
                                    // resetCallback={handleReset}
                                    actionBox={
                                        !edit ? 
                                            <ActionBox>
                                                <Button type="submit" role="primary" >
                                                    ثبت و افزودن موارد تکمیلی
                                                </Button>
                                                <Button type="reset" role="secondary">لغو</Button>
                                            </ActionBox>
                                        :""
                                    }
                                />
                                {edit ? 
                                    <Grid container spacing={2} >
                                        <Grid item xs={12} >
                                            <RequestInfo requestFormValues={requestFormValues} setRequestFormValues={setRequestFormValues} welfareId={welfareId}/>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <CapacitySeparation welfareId={welfareId}/>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <DateSection welfareId={welfareId}/>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <SupplyRequest formValues={formValues} setFormValues={setFormValues} />
                                        </Grid>
                                        <Grid item xs={12}  style={{ display: 'flex', justifyContent: 'flex-end' ,marginTop:'15px'}}>
                                            {confirmForm ? "" : <Button onClick={handleReset} variant= "outlined">لغو</Button> }
                                            <Button onClick={submit} variant = "contained" color="secondary" style={{marginRight : "1rem"}}>ثبت اطلاعات</Button>
                                        </Grid>
                                    </Grid>
                                    :""}
                            </>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <TablePro
                                title="لیست بلیط ها"
                                columns={tableCols}
                                rows={tableContent}
                                setRows={setTableContent}
                                edit="callback"
                                editCallback={handleEdit}
                                removeCallback={handleRemove}
                                loading={loading}
                            /> 
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </>
    );
};

export default Ticket;



function DateSection(welfareId) {
    return (
        <Grid container spacing={2} >
            <Grid item xs={12} md={6}>
                <AdmittableTravelDate welfareInfo={welfareId}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <AdmittableRequestDate welfareInfo={welfareId} />
            </Grid>
        </Grid>
    )
}

function AdmittableTravelDate(props) {
    const {welfareInfo}=props
    const [tableContent, setTableContent] = React.useState([]);
    const[loading,setLoading]=useState(true)
    const tableCols = [
        {name: "fromDate", label: "از تاریخ", type: "date", style: {minWidth:"130px"}},
        {name: "thruDate", label: "تا تاریخ", type: "date" , style: {minWidth:"130px"}},
    ]
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    React.useEffect(()=>{
        if (loading){
            axios.get(SERVER_URL + `/rest/s1/welfare/entity/Time?welfareId=${welfareInfo.welfareId}&timeTypeId=${"TravelDate"}` , axiosKey )
            .then((getData)=>{
                setTableContent(getData.data)
                setLoading(false)
            })
        }
    },[loading])
    const handleAdd = (newData)=>{
        let postData=Object.assign({},newData,{timeTypeId : "TravelDate"} , welfareInfo)
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/welfare/entity/Time" , postData , axiosKey )
                .then(()=>{
                    setLoading(true)
                    resolve()
                }).catch(()=>{
                    reject()
                })
        })
    }
    const handleEdit = (newData, oldData)=>{
        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + "/rest/s1/welfare/entity/Time" , newData , axiosKey )
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
            axios.delete(SERVER_URL + "/rest/s1/welfare/entity/Time?timeId=" + oldData.timeId  , axiosKey )
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
            title="تاریخ مجاز سفر"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add="inline"
            addCallback={handleAdd}
            edit="inline"
            editCallback={handleEdit}
            removeCallback={handleRemove}
            loading={loading}
        />
    )
}
function AdmittableRequestDate(props) {
    const {welfareInfo}=props
    const [tableContent, setTableContent] = React.useState([]);
    const[loading,setLoading]=useState(true)
    const tableCols = [
        {name: "fromDate", label: "از تاریخ", type: "date", style: {minWidth:"130px"}},
        {name: "thruDate", label: "تا تاریخ", type: "date" , style: {minWidth:"130px"}},
    ]
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    React.useEffect(()=>{
        if (loading){
            axios.get(SERVER_URL + `/rest/s1/welfare/entity/Time?welfareId=${welfareInfo.welfareId}&timeTypeId=${"AuthorizedDate"}` , axiosKey )
            .then((getData)=>{
                setTableContent(getData.data)
                setLoading(false)
            })
        }
    },[loading])
    const handleAdd = (newData)=>{
        let postData=Object.assign({},newData,{timeTypeId : "AuthorizedDate"} , welfareInfo)
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/welfare/entity/Time" , postData , axiosKey )
                .then(()=>{
                    setLoading(true)
                    resolve()
                }).catch(()=>{
                    reject()
                })
        })
    }
    const handleEdit = (newData, oldData)=>{
        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + "/rest/s1/welfare/entity/Time" , newData , axiosKey )
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
            axios.delete(SERVER_URL + "/rest/s1/welfare/entity/Time?timeId=" + oldData.timeId  , axiosKey )
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
            title="تاریخ مجاز درخواست"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add="inline"
            addCallback={handleAdd}
            edit="inline"
            editCallback={handleEdit}
            removeCallback={handleRemove}
            loading={loading}
        />
    )
}


