import React, { useState } from 'react';
import Card from "@material-ui/core/Card";
import TablePro from "../../../../../components/TablePro";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../../../../components/ActionBox";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../../../configs";
import axios from "axios";
import {useSelector , useDispatch} from "react-redux";
import {Image} from "@material-ui/icons"
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Box} from "@material-ui/core";
import AddStepToPath from './addStepToPath/AddStepToPath';
import checkPermis from "app/main/components/CheckPermision";


const DefineAttractionPath = () => {

    const [tableContent,setTableContent]=useState([]);
    const [loading, setLoading] = useState(true);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [fieldInfo , setFieldInfo] = useState({contentTypeEnumId : []});
    const [formValues, setFormValues] = React.useState({});
    const [formValidation, setFormValidation] = React.useState({});
    const [waiting, set_waiting] = useState(false) 
    const [editing,setEditing] = useState(false) 
    const [dependent,setDependent] = useState(false) 
    const [recruitmentRouteId,setRecruitmentRouteId] = useState()

    const datas = useSelector(({ fadak }) => fadak);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[
        {
            name    : "routeCode",
            label   : "کد مسیر",
            type    : "number",
            required : true ,
            col     : 3
        },{
            name    : "routeTitle",
            label   : "عنوان مسیر",
            type    : "text",
            required : true  ,
            col     : 6
        },{
            name    : "emplPositionId",
            label   : "انتخاب پست",
            type    : "multiselect",
            options : fieldInfo.position,
            optionLabelField :"description",
            optionIdField:"emplPositionId",
            required : true  ,
            col     : 3
        }]

    const tableCols = [
        { name : "routeCode", label: "کد مسیر", type: "number" , style: {minWidth:"80px"} },
        { name : "routeTitle", label: "عنوان مسیر", type: "text", style: {minWidth:"120px"} },
        { name : "emplPosition", label: "پست", type: "text", style: {minWidth:"120px"} },
    ]

    
    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/fadak/emplPosition`, axiosKey).then((empres)=>{
            fieldInfo.position = empres.data.position
            setFieldInfo(Object.assign({},fieldInfo))
            axios.get(`${SERVER_URL}/rest/s1/humanres/RecruitmentRoute`, axiosKey).then((res)=>{
                setLoading(false)
                setTableContent(res.data.RecruitmentList)
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
            })
        })
    }

    React.useEffect(()=>{
        if(loading){
            getData()
        }
    },[loading])

    const handleSubmit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.post(`${SERVER_URL}/rest/s1/humanres/RecruitmentRoute` , formValues , axiosKey).then((res)=>{
            console.log("res" , res.data);
            setLoading(true)
            setDependent(true)
            set_waiting(false)
            setEditing(true)
            setRecruitmentRouteId(res.data.recruitmentRouteId)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
        });
    }

    const handleEdit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.put(`${SERVER_URL}/rest/s1/humanres/RecruitmentRoute` , formValues , axiosKey).then((res)=>{
            setLoading(true)
            setDependent(false)
            set_waiting(false)
            setEditing(false)
            setFormValues({})
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
        });
    }

    const resetCallback = () => {
        setDependent(false)
        setFormValues({})
        set_waiting(false)
        setEditing(false)
    }

    const editCallback = (row) => {
        setDependent(true)
        setFormValues(row)
        setEditing(true)
        setRecruitmentRouteId(row.recruitmentRouteId)
    }

    const handleRemove = (row) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/humanres/RecruitmentRoute?recruitmentRouteId=${row.recruitmentRouteId }`, axiosKey).then(()=>{
                resetCallback()
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
                        <Box mb={2}/>
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
                            actionBox={
                                checkPermis("humanResourcesPlanning/basicDefinitionsOfHumanResourcesPlanning/DefineAttractionPath/add", datas) ?
                                <ActionBox>
                                    <Button type="submit" role="primary"
                                        disabled={waiting}
                                        endIcon={waiting?<CircularProgress size={20}/>:null}
                                    >{editing?"ویرایش":"افزودن موارد تکمیلی"}</Button>
                                    <Button type="reset" role="secondary">لغو</Button>
                                </ActionBox>
                            :""}
                        />              
                    </CardContent>
                </Card>
                <Box mb={2}/>
                {dependent ?
                    <div> 
                        <AddStepToPath recruitmentRouteId={recruitmentRouteId}/>
                        <Box mb={2}/>
                    </div>
                    :""
                }
                <Card>
                    <CardContent>
                        <TablePro
                            title="لیست مسیر های جذب داوطلبان"
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                            editCondition={(row) =>
                                checkPermis("humanResourcesPlanning/basicDefinitionsOfHumanResourcesPlanning/DefineAttractionPath/edit", datas) 
                            }
                            edit="callback"
                            editCallback={editCallback}
                            removeCondition={(row) =>
                                checkPermis("humanResourcesPlanning/basicDefinitionsOfHumanResourcesPlanning/DefineAttractionPath/delete", datas) 
                            }
                            removeCallback={handleRemove}
                        />
                    </CardContent>
                </Card>
           </CardContent> 
        </Card>                                        
    );
};

export default DefineAttractionPath;