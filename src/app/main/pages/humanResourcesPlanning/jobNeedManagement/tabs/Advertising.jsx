import { Card, CardContent, CardHeader, Button, Box } from '@material-ui/core';
import React, { useState } from 'react';
import FormPro from "../../../../components/formControls/FormPro";
import TablePro from 'app/main/components/TablePro';
import ActionBox from "../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../../configs";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';
import { Image, TrendingUpRounded } from "@material-ui/icons"
import checkPermis from "app/main/components/CheckPermision";
import {useDispatch, useSelector} from "react-redux";


const Advertising = (props) => {

    const {jobRequistionId, submitRef, submit=()=>{}} = props

    const [tableContent,setTableContent]=useState([]);

    const [loading, setLoading] = useState(true);

    const [fieldInfo , setFieldInfo] = useState([]);

    const datas =  useSelector(({ fadak }) => fadak);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[{
        name    : "advertisementTypeEnumId",
        label   : "نوع آگهی",
        type    : "select",
        options : fieldInfo ,
        optionLabelField :"description",
        optionIdField:"enumId",
        style:  {width:"30%"},
    },{
        name    : "fromDate",
        label   : "تاریخ شروع آگهی",
        type    : "date",
        required : true ,
        style:  {width:"20%"}
    },{
        name    : "thruDate",
        label   : "تاریخ انقضای آگهی",
        type    : "date",
        required : true ,
        style:  {width:"20%"}
    },{
        name    : "cost",
        label   : "هزینه آگهی (ریال)",
        type    : "number",
        style:  {width:"25%"}
    }]

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/fadak/entity/Enumeration?enumTypeId=AdvertisementType`, axiosKey).then((type)=>{
            setFieldInfo(type.data?.result)
        });
    }

    React.useEffect(()=>{
        if(loading){
            getList()
        }
    },[loading])
    
    const getList = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/Advertisement?jobRequistionId=${jobRequistionId}`, axiosKey).then((res)=>{
            setTableContent(res.data?.AdvertisementList)
            setLoading(false)
        })
    }

    const handleRemove = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/humanres/JobAdvertisement?advertisementId=" + oldData.advertisementId  , axiosKey )
            .then(()=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    }

    return (
        <div>
            <Card>
                <CardContent>
                    <TablePro
                        title="لیست آگهی ها "
                        columns={formStructure}
                        rows={tableContent}
                        setRows={setTableContent}
                        loading={loading}
                        add={checkPermis("humanResourcesPlanning/jobNeedManagement/advertising/add", datas) ? "external" : false }
                        addForm={<Form setLoading={setLoading}  jobRequistionId={jobRequistionId} fieldInfo={fieldInfo} />}
                        edit="external"
                        editForm={<Form setLoading={setLoading} editing={true} jobRequistionId={jobRequistionId} fieldInfo={fieldInfo}/>}
                        removeCondition={()=>checkPermis("humanResourcesPlanning/jobNeedManagement/advertising/delete", datas)}
                        editCondition ={()=>checkPermis("humanResourcesPlanning/jobNeedManagement/advertising/edit", datas)}
                        removeCallback={handleRemove}
                    />
                </CardContent>
            </Card>
            {/* <Box mb={2}/>
            <Card>
                <CardContent>
                    <Attachment jobRequistionId={jobRequistionId}/>
                </CardContent>
            </Card> */}
            <ActionBox>
                <Button
                    ref={submitRef}
                    type="submit"
                    role="primary"
                    style={{ display: "none" }}
                    onClick={submit}
                />
            </ActionBox>
        </div>
    );
};

export default Advertising;

function Attachment (props) {

    const {jobRequistionId} = props

    const [tableContent, setTableContent] = React.useState([]);
    const [loading,setLoading]=useState(true)

    const datas =  useSelector(({ fadak }) => fadak);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        {name: "observeFile", label: "دانلود فایل" , style: {width:"40%"}}
    ]

    React.useEffect(()=>{
        if (loading){
            getData()
        }
    },[loading])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/AdvertisementContent?jobRequistionId=${jobRequistionId}`, axiosKey).then((res)=>{
            console.log("ressssssss" , res.data);
            if(res.data?.requistionContentList.length > 0){
                let tableDataArray = []
                res.data.requistionContentList.map((item,index)=>{
                    let data={
                            observeFile : <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item?.contentLocation}
                            target="_blank" >  <Image />  </Button> ,
                            requistionContentId : item?.requistionContentId
                        }
                    tableDataArray.push(data)
                    if (index== res.data?.requistionContentList.length-1){
                        setTableContent(tableDataArray)
                        setLoading(false)
                    }
                })
            }
            else {
                setTableContent([])
                setLoading(false)
            }
        })
    }

    const handleRemove = (data)=>{
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/humanres/AdvertisementContent?requistionContentId=" + data.requistionContentId  , axiosKey )
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
            title="پیوست عکس و فیلم های نمایشی به داوطلبان"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add={checkPermis("humanResourcesPlanning/jobNeedManagement/advertising/addAttach", datas) ? "external" : false }
            addForm={<AttachmentsForm loading={loading} setLoading={setLoading}  jobRequistionId={jobRequistionId}/>}
            removeCondition={()=>checkPermis("humanResourcesPlanning/jobNeedManagement/advertising/deleteAttach", datas)}
            removeCallback={handleRemove}
            loading={loading}
            fixedLayout
        />
    )
};

function AttachmentsForm (restProps) {

    const {formValues, setFormValues, successCallback, failedCallback, handleClose, jobRequistionId, setLoading} = restProps;

    const [waiting, set_waiting] = useState(false)    

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
                        jobRequistionId : jobRequistionId ,
                        contentLocation : res.data.name ,
                    }
                    axios.post(SERVER_URL + "/rest/s1/humanres/AdvertisementContent" , postData , axiosKey )
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
                <Button type="submit" role="primary"
                        disabled={waiting}
                        endIcon={waiting?<CircularProgress size={20}/>:null}
                    >{"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}

function Form ({editing=false,...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading, jobRequistionId, fieldInfo} = restProps;

    const [formValidation, setFormValidation] = React.useState({});

    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[{
        name    : "advertisementTypeEnumId",
        label   : "نوع آگهی",
        type    : "select",
        options : fieldInfo ,
    },{
        name    : "fromDate",
        label   : "تاریخ شروع آگهی",
        type    : "date",
        required : true ,
    },{
        name    : "thruDate",
        label   : "تاریخ انقضای آگهی",
        type    : "date",
        required : true ,
    },{
        name    : "cost",
        label   : "هزینه آگهی (ریال)",
        type    : "number",
    }]

    const handleEdit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.put(`${SERVER_URL}/rest/s1/humanres/JobAdvertisement` , formValues , axiosKey).then((info)=>{
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
            set_waiting(false)
            resetCallback()
        }).catch(()=>{
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
        })
    }

    const handleSubmit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.post(SERVER_URL + "/rest/s1/humanres/JobAdvertisement" , {...formValues, jobRequistionId: jobRequistionId} , axiosKey ).then((info)=>{
            setLoading(true)
            set_waiting(false)
            resetCallback()
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
        }).catch(()=>{
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
        })
    }

    const resetCallback = () => {
        setFormValues({})
        handleClose()
        set_waiting(false)
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