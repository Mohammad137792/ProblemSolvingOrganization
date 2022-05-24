import FormPro from "../../../../components/formControls/FormPro";
import TablePro from 'app/main/components/TablePro';
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider, Typography } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';
import checkPermis from "app/main/components/CheckPermision";


const FurtherInformation = (props) => {

    const {formValues, setFormValues, jobAdvantages, setJobAdvantages, confirmation = false} = props

    const datas = useSelector(({ fadak }) => fadak);

    const [fieldInfo , setFieldInfo] = useState({});

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[
        {
            name    : "facilityId",
            label   : "محل استقرار فرد در سازمان",
            type    : "select",
            options : fieldInfo.facility ?? [] ,
            optionLabelField :"facilityName",
            optionIdField:"facilityId",
            disabled : confirmation ,
            col     : 3
        },{
            name    : "address",
            label   : "آدرس محل استقرار",
            type    : "text",
            disabled : true ,
            col     : 6
        },{
            name    : "partyClassificationId",
            label   : "تقویم کاری",
            type    : "select",
            options : fieldInfo.partyClassificationIdList ?? [] ,
            optionLabelField :"description",
            optionIdField:"partyClassificationId",
            disabled : confirmation ,
        },{
            name    : "travelNeeded",
            label   : "نیاز به سفر",
            type    : "indicator",
            disabled : confirmation ,
        },{
            name    : "payGroupPartyClassificationId",
            label   : "گروه حقوق و دستمزد" ,
            type    : "select",
            options : fieldInfo.payment ?? [],
            optionLabelField :"description",
            optionIdField:"payGroupPartyClassificationId",
            disabled : confirmation ,
            col : 3
        },{
            type    : "group",
            items   : [{
                name    : "minPayGrade",
                label   : "حداقل حقوق" ,
                type    : "number",
                disabled : confirmation ,
                style:  {width:"70%" , marginLeft : "2%"}
            },{
                type    : "component",
                component : <p>ریال</p> , 
                style:  {width:"30%" , marginRight : "2%"}
            }],
            col : 3
        },{
            type    : "group",
            items   : [{
                name    : "maxPayGrade",
                label   : "حداکثر حقوق" ,
                type    : "number",
                disabled : confirmation ,
                style:  {width:"70%" , marginLeft : "2%"}
            },{
                type    : "component",
                component : <p>ریال</p> , 
                style:  {width:"30%" , marginRight : "2%"}
            }],
            col : 3
        }]

    const tableCols = [
        {name: "advantage", label: "مزایا", type: "text" },
    ]

    const handleRemove = (rowData) => {
        return new Promise((resolve, reject) => {
            if(!confirmation){resolve()}
            if(confirmation){
                axios.delete(`${SERVER_URL}/rest/s1/humanres/jobAdvantages?jobAdvantagesId=${rowData?.jobAdvantagesId}` , axiosKey).then((res)=>{
                    resolve()
                }).catch(()=>{
                    reject()
                })
            }
        })
    }

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/complementryInfo`, axiosKey).then((res)=>{
            fieldInfo.facility = res.data?.complementryInfo?.faclityList
            fieldInfo.partyClassificationIdList = res.data?.partyClassificationIdList
            axios.get(`${SERVER_URL}/rest/s1/payroll/payGroup`, axiosKey).then((pay)=>{
                fieldInfo.payment = pay.data.payGroupList
                setFieldInfo(Object.assign({},fieldInfo))
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    React.useEffect(()=>{
        if(formValues?.facilityId && formValues?.facilityId != ""){
            axios.get(`${SERVER_URL}/rest/s1/humanres/FacilityAddress?facilityId=${formValues?.facilityId}`, axiosKey).then((addressInfo)=>{
                const address = addressInfo.data?.Address
                formValues.address = `${(address?.country ? (address?.country + "،") : "") + (address?.province ? (address?.province + "،") : "")  + (address?.county ? (address?.county +  "،" ) : "") + (address?.city ? (address?.city + "،") :  "") + (address?.district ? (address?.district + "،" ) : "") + (address?.street ?? "") }`
                setFormValues(Object.assign({},formValues))
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }
        if(!formValues?.facilityId || formValues?.facilityId == ""){
            formValues.address = ""
            setFormValues(Object.assign({},formValues))
        }
    },[formValues?.facilityId])

    const handleAdd = (newData) => {
        return new Promise((resolve, reject) => {
            if(!confirmation){resolve(newData)}
            if(confirmation){
                axios.post(`${SERVER_URL}/rest/s1/humanres/jobAdvantages` , {...newData , jobRequistionId : formValues?.jobRequistionId} , axiosKey).then((add)=>{
                    resolve({...newData , jobAdvantagesId : add.data?.jobAdvantagesId})
                }).catch(()=>{
                    reject()
                })
            }
        })
    }

    return (
        <div>
            <Box mb={2}/>
            <CardHeader title = "اطلاعات تکمیلی شغل" />
            <FormPro
                prepend={formStructure}
                formValues={formValues} setFormValues={setFormValues}
            />
            <Box mb={2}/>
            <TablePro
                title="مزایا"
                columns={tableCols}
                rows={jobAdvantages}
                setRows={setJobAdvantages}
                add={(checkPermis("humanResourcesPlanning/creatingJobNeeds/furtherInformation/add", datas) && !confirmation) ? "inline" : false }
                addCallback={handleAdd}
                removeCondition={(row) =>
                    checkPermis("humanResourcesPlanning/creatingJobNeeds/furtherInformation/delete", datas) && !confirmation
                }
                removeCallback={handleRemove}
            />
        </div>
    );
};

export default FurtherInformation;