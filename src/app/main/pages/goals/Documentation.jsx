import React, { useState } from 'react';
import Card from "@material-ui/core/Card";
import TablePro from "../../components/TablePro";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../components/ActionBox";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../configs";
import axios from "axios";
import {useSelector , useDispatch} from "react-redux";
import {Image} from "@material-ui/icons"
import { ALERT_TYPES, setAlertContent } from "../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";


const Documentation=({workEffortId})=>{
    const [tableContent,setTableContent]=useState([]);
    const [loading, setLoading] = useState(true);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [fieldInfo , setFieldInfo] = useState({contentTypeEnumId : []});

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[
        {
            name    : "contentTypeEnumId",
            label   : "موضوع فایل",
            type    : "select",
            options : fieldInfo.contentTypeEnumId,
            optionLabelField :"description",
            optionIdField:"enumId",
            required : true ,
            col     : 4
        },{
            name    : "contentLocation",
            label   : "بارگذاری فایل",
            type    : "inputFile" ,
            required : true ,
            col     : 4
        },{
            name    : "contentDate",
            label   : "تاریخ بارگذاری",
            type    : "date",
            readOnly: true  ,
            col     : 4
        },{
            name    : "description",
            label   : "توضیحات",
            type    : "textarea",
            col     : 12 ,
        }
    ]

    const tableCols = [
        // { titleofDocumentation: "titleofDocumentation", label:"عنوان مستندات", type: "text" },
        { name : "contentDate", label: "تاریخ بارگذاری", type: "date" , style: {minWidth:"80px"} },
        { name : "fileObservation", label:"مشاهده فایل", type: "text" , style: {minWidth:"80px"} },
        { name : "contentTypeEnumId", label: "موضوع فایل", type: "select", options : fieldInfo.contentTypeEnumId , optionLabelField :"description", optionIdField:"enumId" ,  style: {minWidth:"120px"} },
        { name : "description", label:"توضیحات", type: "text" ,  style: {minWidth:"120px"}},
    ]

    const getData = () => {
        //get file subject list
        axios.get(`${SERVER_URL}/rest/s1/fadak/entity/Enumeration?enumTypeId=WorkeffortContentType`, axiosKey).then((contentType)=>{
            fieldInfo.contentTypeEnumId = contentType.data.result
            setFieldInfo(fieldInfo)
            //get table data
            axios.get(`${SERVER_URL}/rest/s1/workEffort/entity/workeffortContent?contentTypeEnumId=WorkeffortContentType&workEffortId=${workEffortId}`, axiosKey)
            .then((tableData)=>{
                if(tableData.data.tableData.length != 0){
                    let tableDataArray=[]
                    tableData.data.tableData.map((item,index)=>{
                        let data={...item,
                            fileObservation : <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.contentLocation}
                            target="_blank" >  <Image />  </Button> ,
                        }
                        tableDataArray.push(data)
                        if (index== tableData.data.tableData.length-1){
                            setTableContent(tableDataArray)
                            setLoading(false)
                        }
                    })
                }
                if(tableData.data.tableData.length == 0){
                    setTableContent([])
                    setLoading(false)
                }
            })
        })
    }

    React.useEffect(()=>{
        if(loading){
            getData()
        }
    },[partyRelationshipId,loading])

    const handleRemove = (oldData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/workEffort/uploadFile?workEffortContentId=${oldData.workEffortContentId}`, axiosKey).then(()=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    }

    function Form ({formStructure, editing=false,...restProps}) {

        const {formValues, setFormValues, handleClose, setLoading} = restProps;

        const [formValidation, setFormValidation] = React.useState({});
        const [waiting, set_waiting] = useState(false) 

        const dispatch = useDispatch();
        
        const config = { 
            timeout: AXIOS_TIMEOUT, 
            headers: {
             'Content-Type': 'application/x-www-form-urlencoded', 
            api_key: localStorage.getItem('api_key')
            }
        }            

        React.useEffect(()=>{
            if(!editing){
                setFormValues({contentDate : new Date()})
            }
        },[])

        const handleSubmit = () => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            const attachFile = new FormData(); 
            attachFile.append("file", formValues.contentLocation);
            axios.post(`${SERVER_URL}/rest/s1/workEffort/uploadFile?contentTypeEnumId=${formValues.contentTypeEnumId ?? ""}&contentDate=${formValues.contentDate ? new Date (formValues.contentDate).getTime() : ""}&description=${formValues.description ?? ""}&workEffortId=${workEffortId ?? ""}`,attachFile, config)
            .then(()=>{
                setLoading(true)
                resetCallback()
                set_waiting(false)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            });
        }

        const handleEdit = () => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            if(typeof(formValues.contentLocation) == "string"){
                axios.put(`${SERVER_URL}/rest/s1/workEffort/uploadFile`, {WorkeffortContent : formValues} ,axiosKey).then(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'))
                    setLoading(true)
                    resetCallback()
                    set_waiting(false)
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
                });
            }
            if(typeof(formValues.contentLocation) == "object"){
                const attachFile = new FormData(); 
                attachFile.append("file", formValues.contentLocation);
                axios.post(`${SERVER_URL}/rest/s1/workEffort/uploadFile?contentTypeEnumId=${formValues.contentTypeEnumId ?? ""}&contentDate=${formValues.contentDate ? new Date (formValues.contentDate).getTime() : ""}&description=${formValues.description ?? ""}&workEffortId=${formValues.workEffortId ?? ""}&workEffortContentId=${formValues.workEffortContentId ?? ""}`,attachFile, config)
                .then(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'))
                    setLoading(true)
                    resetCallback()
                    set_waiting(false)
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
                });
            }
        }

        const resetCallback = () => {
            setFormValues({contentDate : new Date()})
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
                        handleEdit()
                    }else{
                        handleSubmit()
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
                            title="مستندات"
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                            add="external"
                            addForm={<Form formStructure={formStructure}  setLoading={setLoading} />}
                            edit="external"
                            editForm={<Form formStructure={formStructure} editing={true} setLoading={setLoading}  />}
                            removeCallback={handleRemove}
                            fixedLayout
                        />
                    </CardContent>
                </Card>
           </CardContent> 
        </Card>
    )
}
export default Documentation






