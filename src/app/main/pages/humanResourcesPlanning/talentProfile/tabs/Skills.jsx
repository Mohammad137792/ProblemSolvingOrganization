import FormPro from "../../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import TablePro from 'app/main/components/TablePro';
import ActionBox from "../../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider, Grid } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../../configs";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import { Description, Image, TrendingUpRounded } from "@material-ui/icons"



const Skills = () => {

    const [tableContent,setTableContent]=useState([]);
    const [loading, setLoading] = useState(true);

    const datas =  useSelector(({ fadak }) => fadak);

    const dispatch = useDispatch();

    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser && partyIdUser !== null) ? partyIdUser : partyIdLogin


    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    React.useEffect(()=>{
        if(loading){
            getTableData()
        }
    },[loading])

    const getTableData = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/PartySkill?partyId=${partyId}`, axiosKey).then((response)=>{
            console.log("response" , response.data);
            setTableContent(response.data?.skillList)
            setLoading(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const tableCols = [
        { name: "parentSkillTypeEnum", label:"نوع مهارت", type: "text" , style: {minWidth:"80px"}},
        { name : "languageTypeEnum", label: "انواع مهارت های زبان", type: "text" , style: {minWidth:"80px"} },
        { name : "skillLevelTitle", label:"سطح مهارت", type: "text" , style: {minWidth:"60px"} },
        { name : "skillTypeEnum", label: "انواع مهارت های تکمیلی", type: "text", style: {minWidth:"90px"} },
        { name : "skillTitle", label:"عنوان مهارت تکمیلی", type: "text" ,  style: {minWidth:"90px"}},
        { name : "startedUsingDate", label:"تاریخ یادگیری", type: "date" ,  style: {minWidth:"140px"}}
    ]

    const handleRemove = (data) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/humanres/PartySkill?skillTypeEnumId=${data?.skillTypeEnumId ?? data?.languageTypeEnumId}`, axiosKey).then((response)=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    }

    return (
        <Card>
            <CardContent>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={9}>
                                <TablePro
                                    title="لیست مهارت ها"
                                    columns={tableCols}
                                    rows={tableContent}
                                    setRows={setTableContent}
                                    loading={loading}
                                    add= {partyId == partyIdLogin ? "external" : false}
                                    addForm={<SkillsForm loading={loading} setLoading={setLoading} />}
                                    edit="external"
                                    editForm={<SkillsForm editing={true} loading={loading} setLoading={setLoading} />}
                                    removeCondition={(row) => partyId == partyIdLogin}
                                    editCondition ={(row) => partyId == partyIdLogin}
                                    removeCallback={handleRemove}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Attachment partyId={partyId} partyIdLogin={partyIdLogin}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};

export default Skills;

function Attachment (props) {

    const {partyId, partyIdLogin} = props

    const [tableContent, setTableContent] = React.useState([]);
    const [loading,setLoading]=useState(true)

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        {name: "observeFile", label: "دانلود فایل" , style: {width:"50%"}}
    ]

    React.useEffect(()=>{
        if (loading){
            getData()
        }
    },[loading])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/PartyContent?partyId=${partyId}`, axiosKey).then((response)=>{
            if(response.data?.contentList.length > 0){
                let tableDataArray = []
                response.data.contentList.map((item,index)=>{
                    let data={...item,
                            observeFile : <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item?.contentLocation}
                            target="_blank" >  <Image />  </Button> ,
                        }
                    tableDataArray.push(data)
                    if (index== response.data?.contentList.length-1){
                        setTableContent(tableDataArray)
                        setLoading(false)
                    }
                })
            }
            else {
                setTableContent([])
                setLoading(false)
            }
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const handleRemove = (data)=>{
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/humanres/PartyContent?partyContentId=${data?.partyContentId}`, axiosKey).then((response)=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    }

    return (
        <TablePro
            title="پیوست رزومه"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add= {partyId == partyIdLogin ? "external" : false}
            addForm={<AttachmentsForm loading={loading} setLoading={setLoading} />}
            removeCondition={(row) => partyId == partyIdLogin}
            removeCallback={handleRemove}
            loading={loading}
            fixedLayout
        />
    )
};

function AttachmentsForm (restProps) {

    const {formValues, setFormValues, successCallback, failedCallback, handleClose, setLoading} = restProps;

    const [waiting, set_waiting] = useState(false)  

    const contentIdFormData = new FormData()  

    const dispatch = useDispatch();

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
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        contentIdFormData.append("file", formValues.contentLocation)
        axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", contentIdFormData, config).then((res)=>{
            axios.post(SERVER_URL + `/rest/s1/humanres/PartyContent` , {contentLocation : res.data?.name} , axiosKey).then((upload)=>{
                setLoading(true)
                set_waiting(false)
                setFormValues({})
                handleClose()
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
                set_waiting(false)
            });
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            set_waiting(false)
        });
    }

    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={handleCreate}
            resetCallback={()=>{
                setFormValues({})
                handleClose()
                set_waiting(false)
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

function SkillsForm ({editing=false,...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading} = restProps;

    const [formValidation, setFormValidation] = React.useState({});
    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        type    : "component",
        component : <Fields formValues={formValues} setFormValues={setFormValues} formValidation={formValidation} setFormValidation={setFormValidation} editing={editing} /> ,
        col     : 6
    },{
        type    : "component",
        component : <DescriptionPart formValues={formValues} setFormValues={setFormValues} formValidation={formValidation} setFormValidation={setFormValidation} /> ,
        col     : 6
    }]

    const handleEdit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.put(`${SERVER_URL}/rest/s1/humanres/PartySkill`, formValues , axiosKey).then((response)=>{
            setLoading(true)
            resetCallback()
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
            set_waiting(false)
        });
    }

    const handleSubmit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.post(`${SERVER_URL}/rest/s1/humanres/PartySkill`, formValues , axiosKey).then((response)=>{
            setLoading(true)
            resetCallback()
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            set_waiting(false)
        });
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


function Fields (props) {

    const {formValues, setFormValues, formValidation, setFormValidation, editing } = props

    const [fieldsInfo , setFieldsInfo] = useState({});

    const dispatch = useDispatch();
    
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {

        axios.get(`${SERVER_URL}/rest/s1/fadak/getEnums?enumTypeList=SkillType,LanguageType`, axiosKey).then((response)=>{
            console.log("response" , response.data?.enums);
            setFieldsInfo(response.data?.enums)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const level = [{
        SkillLevel : 1,
        description : "ضعیف"
    },{
        SkillLevel : 2,
        description : "متوسط"
    },{
        SkillLevel : 3,
        description : "قوی"
    }]

    const fieldsStructure = [{
        name    : "parentSkillTypeEnumId",
        label   : "نوع مهارت",
        type    : "select",
        options : fieldsInfo?.SkillType,
        optionLabelField :"description",
        optionIdField:"enumId",
        filterOptions: (options) => options.filter((o) =>  !o?.parentEnumId || o?.parentEnumId == null),
        disabled : editing ? true : false ,
        col     : 6
    },{
        name    : "skillTypeEnumId",
        label   : "انواع مهارت های تکمیلی",
        type    : "select",
        options : fieldsInfo?.SkillType,
        optionLabelField :"description",
        optionIdField:"enumId",
        filterOptions: (options) => options.filter((o) =>  o?.parentEnumId  && o?.parentEnumId == "SupplementSkill"),
        disabled : editing ? true : false ,
        display : formValues?.parentSkillTypeEnumId == "SupplementSkill" ,
        col     : 6
    },{
        name    : "skillTitle",
        label   : "عنوان مهارت",
        type    : "text",
        display : formValues?.parentSkillTypeEnumId == "SupplementSkill" ,
        col     : 6
    },{
        name    : "languageTypeEnumId",
        label   : "انتخاب زبان",
        type    : "select",
        options : fieldsInfo?.LanguageType,
        optionLabelField :"description",
        optionIdField:"enumId",
        display : formValues?.parentSkillTypeEnumId != null && formValues?.parentSkillTypeEnumId == "LanguageSkill" ,
        col     : 6
    },{
        name    : "skillTypeEnumId",
        label   : "انواع مهارت های زبان",
        type    : "select",
        options : fieldsInfo?.SkillType,
        optionLabelField :"description",
        optionIdField:"enumId",
        filterOptions: (options) => options.filter((o) =>  o?.parentEnumId  && o?.parentEnumId == "LanguageSkill"),
        display : formValues?.parentSkillTypeEnumId != null && formValues?.parentSkillTypeEnumId == "LanguageSkill" ,
        disabled : editing ? true : false ,
        col     : 6
    },{
        name    : "skillLevel",
        label   : "سطح مهارت",
        type    : "select",
        options : level,
        optionLabelField :"description",
        optionIdField:"SkillLevel",
        col     : 6
    },{
        name    : "startedUsingDate",
        label   : "تاریخ یادگیری",
        type    : "date",
        col     : 6 ,
    }]

    return(
        <FormPro
            prepend={fieldsStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
        />
    )

}

function DescriptionPart (props) {

    const {formValues, setFormValues, formValidation, setFormValidation } = props

    const desc = [{
        name    : "description",
        label   : "توضیحات",
        type    : "textarea",
        col     : 12 ,
        rows    : 10
    }]

    return(
        <FormPro
            prepend={desc}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
        />
    )
}