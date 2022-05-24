import React, { useState,useEffect } from 'react';
import TablePro from "../../components/TablePro";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../components/ActionBox";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent, submitPost } from "../../../store/actions/fadak";

import axios from "axios";
import {SERVER_URL} from 'configs';
import CircularProgress from "@material-ui/core/CircularProgress";

const Indicator=({workEffortId})=>{

    const [parent,setParent]=useState([]);
    const [tableContent,setTableContent]=useState([{Measurementindex:''}]);
    const [disable,setDisable]=useState(true)
    const [selectType,setSselectType]=useState([])
    const [loading, setLoading] = useState(true);
    const [tableMeasurementIndex,setTableMeasurementIndex] = useState([])

    const selectMeasurementIndex =[
        {
            selectMeasurementIndex:'برای هدف',
            selectMeasurementIndexId:"goal"
        }, {
            selectMeasurementIndex:'برای اقدامات',
            selectMeasurementIndexId:"actions"
        }
    ]
    
    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[
        {
            name    : "workEffortName",
            label   : "عنوان شاخص",
            type    : "text",
            required : true ,
            
        },{
            name    : "purposeEnumId",
            label   : "نوع شاخص",
            type    : "select",
            options : selectType,
            optionLabelField :"description",
            optionIdField:"enumId"
        },{
            name    : "Measurementindex",
            label   : "شاخص سنجش برای",
            type    : "multiselect",
            options : selectMeasurementIndex,
            optionLabelField :"selectMeasurementIndex",
            optionIdField:"selectMeasurementIndexId",
            required : true ,
            validator: values=>{
                return new Promise(resolve => {
                    if(values.Measurementindex == "[]"){
                        resolve({error: true, helper: "تعیین این فیلد الزامی است!"})
                    }else{
                        resolve({error: false, helper: ""})
                    }
                })
            }
        },{
            name    : "parentWorkEffortId",
            label   : "اقدامات",
            type    : "multiselect",
            options : parent,
            optionLabelField :"workEffortName",
            optionIdField:"workEffortId",
            col     : 3,
            disabled: disable,
            validator: values=>{
                return new Promise(resolve => {
                    if(eval(values?.Measurementindex)?.includes("actions") && (!values.parentWorkEffortId || values.parentWorkEffortId == "[]")){
                        resolve({error: true, helper: "اقدام مورد نظر را انتخاب کنید!"})
                    }else{
                        resolve({error: false, helper: ""})
                    }
                })
            }
        },{
            name    : "description",
            label   : "توضیحات",
            type    : "textarea",
            col     : 12
        }
    ]
 
    const tableCols= [
        { name: "workEffortName", label:"عنوان شاخص", type: "text" },
        { name : "toWorkEffortIdTitles" , label: "شاخص سنجش",type : "text"} ,
        { name : "purposeEnumId",label   : "نوع شاخص",type : "select",options : selectType , optionLabelField :"description",optionIdField:"enumId"},
        { name: "description", label: "توضیحات", type: "text" },
    ]
   
    const handleRemove = (oldData)=>{
        return new Promise((resolve, reject) => {
            let send={
                "data":{
                "workEffortId":oldData.workEffortId,
                },
                "typeData":[
                   {
                    "type":"Assoc",
                    "json":{
                        "workEffortId":oldData.workEffortId,
                        "fromDate":oldData.fromDate,
                        "toWorkEffortId":oldData.toWorkEffortId,
                        "workEffortAssocTypeEnumId":"WeatRelatesTo"
                    }
                }]
            }
            axios.post(SERVER_URL + "/rest/s1/workEffort/deleteWorkEffort",send, {
                headers: {'api_key': localStorage.getItem('api_key')},
            })
            .then((res) => {
                setLoading(true)
                resolve()
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در  ارسال پیام!'));
                reject();
            });
        })
    }

    function GetData(){
        axios.get(SERVER_URL + "/rest/s1/workEffort/workeffort", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                rootWorkEffortId:workEffortId,
                workeffortTypeEnumId: "WetCriteria",
                typeData:"Assoc",
            }
        })
        .then((res) => {
            if(res.data.result.length != 0){
                let Tdata = []
                res.data.result.map((e,i)=>{
                    Tdata.push({...e,parentWorkEffortId : JSON.stringify(e.toWorkEffortId.filter((o) => o !== workEffortId)),Measurementindex : (!e.toWorkEffortId.includes(workEffortId)) ? JSON.stringify(["actions"]) : (e.toWorkEffortId.includes(workEffortId) && e.toWorkEffortId.length > 1) ? JSON.stringify(["actions" , "goal"]) :  JSON.stringify(["goal"]) })
                    if(i == res.data.result.length-1){
                        setTableContent(Tdata)
                        setLoading(false)
                    }
                })
            }
            else{
                setTableContent([])
                setLoading(false)
            }
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    function GetpurposeEnumId(){
        axios.get(SERVER_URL +`/rest/s1/fadak/entity/Enumeration?enumTypeId=WorkEffortPurpose&parentEnumId=KpiType`,axiosKey)
        .then((res) => {
            setSselectType(res.data.result)
        });
    }

    function Higheraction(){
        axios.get(SERVER_URL + `/rest/s1/workEffort/workeffort?workeffortTypeEnumId=WetTask&rootWorkEffortId=${workEffortId}`, {
            headers: {'api_key': localStorage.getItem('api_key')},
        })
        .then((res) => {
            let dataForTable = res.data.resultWorkEffort
            axios.get(SERVER_URL + `/rest/s1/workEffort/getAllWorkEffort`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then((all)=>{
                dataForTable.push(all.data.result.filter((o) => o["workEffortId"] == workEffortId)[0])
                setParent(res.data.resultWorkEffort.filter((o) => o.workEffortId !== workEffortId))
                setTableMeasurementIndex(dataForTable)
            })
        });
    }

    useEffect(() => {
        if(loading){
            GetData()
        }
    }, [loading])

    useEffect(() => {
        GetpurposeEnumId()
        Higheraction()
    }, [workEffortId])
    
    function Form ({formStructure, editing=false,...restProps}) {

        const {formValues, setFormValues, handleClose, setLoading} = restProps;

        const [formValidation, setFormValidation] = useState({});  
        const [waiting, set_waiting] = useState(false) 

        useEffect(() => {
            if(eval(formValues?.Measurementindex)?.includes("actions")){
                setDisable(false)
            }else{
                setDisable(true)
                formValues.parentWorkEffortId = ""
                setFormValues(Object.assign({},formValues))
            }
        },[formValues?.Measurementindex])   

        const handleSubmit = () => {
            const workEffortIdArray = [workEffortId]
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            let send={
                "data":{
                    "rootWorkEffortId":workEffortId,
                    "workEffortName":formValues.workEffortName,
                    "workEffortTypeEnumId":"WetCriteria",
                    "purposeEnumId":formValues.purposeEnumId,
                    "description":formValues.description,
                },
                "typeData":[{
                    "type":"Assoc",
                    "json":{
                        "workEffortId" : workEffortId ,
                        "toWorkEffortId": formValues?.Measurementindex == `["actions"]` ? eval(formValues?.parentWorkEffortId) : (formValues?.Measurementindex == `["goal"]` ? workEffortIdArray : [...eval(formValues?.parentWorkEffortId),workEffortId] ),
                        "workEffortAssocTypeEnumId":"WeatRelatesTo",
                        "fromDate" :  new Date()
                    }
                }],
            }
            axios.post(SERVER_URL +"/rest/s1/workEffort/modifyWorkEffort",send,axiosKey)
            .then((res) => {
                setLoading(true)
                resetCallback()
                set_waiting(false)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            });
        }

        const handleEdit = (rows) => {
            return new Promise((resolve, reject) => {
                const workEffortIdArray = [workEffortId]
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
                set_waiting(true)
                let send={
                    "data":{
                        "workEffortName":formValues.workEffortName,
                        "workEffortId":rows.workEffortId,
                        "purposeEnumId":formValues.purposeEnumId,
                        "description":formValues.description,
                    },
                    "typeData":[{
                        "type":"Assoc",
                        "json":{
                            "workEffortId":rows.workEffortId,
                            "fromDate":new Date(),
                            "toWorkEffortId":formValues?.Measurementindex == `["actions"]` ? eval(formValues?.parentWorkEffortId) : (formValues?.Measurementindex == `["goal"]` ? workEffortIdArray : [...eval(formValues?.parentWorkEffortId),workEffortId] ),
                            "workEffortAssocTypeEnumId":"WeatRelatesTo"
                        }
                    }],
                }
                axios.put(SERVER_URL +"/rest/s1/workEffort/updateWorkEffort",send,axiosKey)
                .then((res) => {
                    setLoading(true)
                    resetCallback()
                    set_waiting(false)
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
                });
            })
        }

        const resetCallback = () => {
            setFormValues({})
            handleClose()
        }

        return(
            <FormPro
                prepend={formStructure}
                formValues={formValues}
                setFormValues={setFormValues}
                formValidation={formValidation}
                setFormValidation={setFormValidation}
                submitCallback={()=>{
                    if(editing){
                        handleEdit(formValues)
                    }else{
                        handleSubmit(formValues)
                    }
                }}
                resetCallback={resetCallback}
                actionBox={<ActionBox>
                    <Button type="submit" role="primary"
                         disabled={waiting}
                         endIcon={waiting?<CircularProgress size={20}/>:null}
                    >{editing?"ویرایش":"افزودن"}</Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>}
            />
        )
    }

    return(
        <Card>
            <CardContent>
                <Card>
                    <CardContent>
                        <TablePro
                            title="شاخص"
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            add="external"
                            addForm={<Form formStructure={formStructure} setLoading={setLoading} />}
                            edit="external"
                            editForm={<Form formStructure={formStructure} editing={true} setLoading={setLoading}  />}
                            removeCallback={handleRemove}
                            fixedLayout
                            loading={loading}
                        />
                    </CardContent>
                </Card>
            </CardContent> 
        </Card>
    
    )
}
export default Indicator;