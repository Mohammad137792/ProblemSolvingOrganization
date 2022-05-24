import React, { useState } from 'react';
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../../../components/ActionBox";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../../configs";
import axios from "axios";
import {useSelector , useDispatch} from "react-redux";
import {Image} from "@material-ui/icons"
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Box} from "@material-ui/core";
import checkPermis from "app/main/components/CheckPermision";

const formDefaultValues = {creationDate : new Date() , active : "Y"}

const TemplateDefinition = () => {

    const [tableContent,setTableContent]=useState([]);
    const [loading, setLoading] = useState(true);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [fieldInfo , setFieldInfo] = useState({contentTypeEnumId : []});
    const [formValues, setFormValues] = React.useState(formDefaultValues);
    const [formValidation, setFormValidation] = React.useState({});
    const [waiting, set_waiting] = useState(false) 
    const [editing,setEditing] = useState(false) 

    const dispatch = useDispatch();

    const datas = useSelector(({ fadak }) => fadak);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[
        {
            name    : "templateTitle",
            label   : "نام الگو متنی",
            type    : "text",
            required : true ,
            col     : 3
        },{
            name    : "creationDate",
            label   : "تاریخ ایجاد",
            type    : "date",
            readOnly: true  ,
            col     : 3
        },{
            name    : "templateCategoryEnumId",
            label   : "دسته بندی الگو متنی",
            type    : "select",
            options : fieldInfo.templateCategoryEnumId,
            optionLabelField :"description",
            optionIdField:"enumId",
            required : true ,
            col     : 3 ,
        },{
            name    : "active",
            label   : "فعال",
            type    : "indicator",
            col     : 3
        },{
            type    : "component",
            component : <p>تاریخ استفاده از الگو متنی :</p> ,
            col     : 3
        },{
            name    : "fromDate",
            label   : "از تاریخ",
            type    : "date",
            col     : 3
        },{
            name    : "thruDate",
            label   : "تا تاریخ",
            type    : "date",
            col     : 3
        },{
            name    : "templateText",
            label   : "ورود متن الگو متنی",
            type    : "textarea",
            required : true ,
            col     : 12
        }]

    const tableCols = [
        { name : "templateTitle", label: "نام الگو متنی", type: "text" , style: {minWidth:"80px"} },
        { name : "templateCategoryEnumId", label: "دسته بندی الگو متنی", type: "select", options : fieldInfo.templateCategoryEnumId , optionLabelField :"description", optionIdField:"enumId" ,  style: {minWidth:"120px"} },
        { name : "creationDate", label:"تاریخ ایجاد", type: "date" ,  style: {minWidth:"120px"}},
        { name : "fromDate", label:"استفاده از تاریخ", type: "date" ,  style: {minWidth:"120px"}},
        { name : "thruDate", label:"استفاده تا تاریخ", type: "date" ,  style: {minWidth:"120px"}},
        { name : "active", label:"فعال", type: "indicator" ,  style: {minWidth:"120px"}},
    ]

    
    const getData = () => {

        axios.get(`${SERVER_URL}/rest/s1/fadak/entity/Enumeration?enumTypeId=TemplateCategory`, axiosKey).then((enums)=>{
            fieldInfo.templateCategoryEnumId = enums.data.result
            setFieldInfo(Object.assign({},fieldInfo))
            axios.get(`${SERVER_URL}/rest/s1/humanres/template `, axiosKey).then((res)=>{
                setLoading(false)
                setTableContent(res.data.templateList)
            })
            .catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
                })
        })
        .catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    React.useEffect(()=>{
        if(loading){
            getData()
        }
    },[loading])

    const handleSubmit = () => {
        set_waiting(true)
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        delete formValues.creationDate;
        axios.post(`${SERVER_URL}/rest/s1/humanres/template`, formValues , axiosKey).then((res)=>{
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            resetCallback()
            set_waiting(false)
            setLoading(true)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
        });
    }

    const handleEdit = () => {
        set_waiting(true)
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        delete formValues.creationDate;
        axios.put(`${SERVER_URL}/rest/s1/humanres/template `, formValues , axiosKey).then((res)=>{
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
            resetCallback()
            set_waiting(false)
            setLoading(true)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
        });

    }

    const resetCallback = () => {
        setFormValues(formDefaultValues)
        setEditing(false)
        set_waiting(false)
    }

    const editCallback = (rowData) => {
        setFormValues(rowData)
        setEditing(true)
    }

    const handleRemove = (row) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/humanres/template?templateId=${row.templateId}`, axiosKey).then(()=>{
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
                            formDefaultValues={formDefaultValues}
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
                                checkPermis("humanResourcesPlanning/basicDefinitionsOfHumanResourcesPlanning/templateDefinition/add", datas) ? 
                                    <ActionBox>
                                        <Button type="submit" role="primary"
                                            disabled={waiting}
                                            endIcon={waiting?<CircularProgress size={20}/>:null}
                                        >{editing?"ویرایش":"افزودن"}</Button>
                                        <Button type="reset" role="secondary">لغو</Button>
                                    </ActionBox> : ""}
                        />              
                    </CardContent>
                </Card>
                <Box mb={2}/>
                <Card>
                    <CardContent>
                        <TablePro
                            title="لیست الگو های متنی  "
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                            edit="callback"
                            editCondition={(row) =>
                                checkPermis("humanResourcesPlanning/basicDefinitionsOfHumanResourcesPlanning/templateDefinition/edit", datas) 
                            }
                            editCallback={editCallback}
                            removeCondition={(row) =>
                                checkPermis("humanResourcesPlanning/basicDefinitionsOfHumanResourcesPlanning/templateDefinition/delete", datas) 
                            }
                            removeCallback={handleRemove}
                        />
                    </CardContent>
                </Card>
           </CardContent> 
        </Card>                                        
    );
};

export default TemplateDefinition;