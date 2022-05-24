import React from 'react';
import FormPro from '../../../../components/formControls/FormPro';
import {Button, CardContent} from "@material-ui/core";
import ActionBox from "../../../../components/ActionBox";
import {useSelector} from "react-redux";
import {AXIOS_TIMEOUT , SERVER_URL} from "../../../../../../configs";
import axios from "axios";
import {useDispatch} from 'react-redux'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";

const OrganizationForm = ({...restProps}) => {
    const {formValues, setFormValues , setTableContent , tableContent , setLoading , loading , edit , setEdit } = restProps
    const [formValidation, setFormValidation] =React.useState();
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
    const [organizationUnit,setOrganizationUnit]=React.useState([])
    const [emplPosition,setEmplPosition]=React.useState([])
    const [companyPositions,setCompanyPositions]=React.useState([])
    const [EntRoleType , setEntRoleType]=React.useState([])
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const dispatch = useDispatch();
    const formStructure = [{
        name    : "organizationUnit",
        label   : "واحد سازمانی",
        type    : "select",
        options : edit ? "OrganizationUnit" : organizationUnit,
        optionIdField  : "partyId",
        optionLabelField  : "organizationName" ,
        required: true,
        col     : 3 ,
        readOnly: edit ? true : false
    },{
        label:  "پست سازمانی",
        name:   "emplPositionId",
        type:   "select",
        options : edit ? "EmplPosition" : emplPosition,
        filterOptions   : options => options.filter(o=>o.organizationPartyId===formValues["organizationUnit"]),
        optionLabelField  : "description" ,
        optionIdField: "emplPositionId",
        required: true,
        col     : 3 ,
        readOnly: edit ? true : false
    },{
        label:  "پست اصلی",
        name:   "mainPosition",
        type:   "indicator",
        col     : 3
    },{
        label:  "نقش",
        name:   "roleTypeId",
        type:   "select",
        options: EntRoleType ,
        optionIdField  : "roleTypeId",
        optionLabelField  : "description" ,
        filterOptions   : options => options.filter(o=>o.parentTypeId==="OrganizationalRole"),
        required: true,
        col     : 3 ,
        readOnly: edit ? true : false
    },{
        label:  "از تاریخ",
        name:   "fromDate",
        type:   "date",
        col     : 4 , 
        readOnly: edit ? true : false
    },{
        label:  "تا تاریخ",
        name:   "thruDate",
        type:   "date",
        col     : 4 ,
        validator : values => {
            return new Promise((resolve,reject) => {
                if(formValues.thruDate && formValues.thruDate != ""){
                    if (new Date(formValues.fromDate).getTime() >= new Date(formValues.thruDate).getTime()){
                        resolve({error: true, helper: "تاریخ وارد شده نامعتبر است"})
                    }
                    else{
                        resolve({error: false , helper: ""})
                    }
                }
                else{
                    resolve({error: false , helper: ""})
                }
            })
        }
    },{
        label:  "درصد اشتغال",
        name:   "occupancyRate",
        type:   "number",
        col     : 4 ,
    }]

    React.useEffect(()=>{
        if (loading){
            let moment = require('moment-jalaali')
            const formDefaultValues = {
                fromDate: moment().format("Y-MM-DD") ,
                mainPosition : "Y"
            }
            setFormValues(formDefaultValues)
        }
    },[loading])
    React.useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/fadak/organizationInformationFields?partyRelationshipId=${partyRelationshipId}`  , axiosKey)
        .then((res)=>{
            setOrganizationUnit(res.data.fieldInfo.orgList)
            setEntRoleType(res.data.fieldInfo.RoleType)
            axios.get(SERVER_URL + `/rest/s1/fadak/orgInfoEmplPosition?partyRelationshipId=${partyRelationshipId}`  , axiosKey)
            .then((resp)=>{
                setEmplPosition(resp.data.result)
                setCompanyPositions(resp.data.companyPositions)
            })
        })
    },[])
    const handleEdit = ()=>{
        dispatch(setAlertContent(ALERT_TYPES.WARNING, ' درحال ارسال اطلاعات '));
        if(formValues.mainPosition=="Y"){
            axios.get(SERVER_URL + "/rest/s1/fadak/entity/EmplPositionParty?partyId=" + partyId , axiosKey)
            .then((getData) => {
                if(getData.data.result.length>0){
                    companyPositions.map((companyPosition,index)=>{
                        getData.data.result.map((item)=>{
                            if(companyPosition.emplPositionId==item.emplPositionId){
                                item={...item , mainPosition : "N"}
                                axios.put(SERVER_URL + "/rest/s1/fadak/entity/EmplPositionParty" , {data : item } , axiosKey) 
                            }
                        })
                        if(index==companyPositions.length-1){
                            let data = {...formValues, fromDate : new Date(formValues.fromDate).getTime() , thruDate : formValues.thruDate ? new Date(formValues.thruDate).getTime() : "" , partyId : partyId }
                            axios.put(SERVER_URL + "/rest/s1/fadak/entity/EmplPositionParty" , {data : data}  , axiosKey)
                            .then((res) => {
                                setFormValues({})
                                setEdit(false) 
                                setLoading(true)
                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "تغییرات ردیف مورد نظر با موفقیت انجام شد."));
                            })
                        }  
                    })  
                }
                else {
                    let data = {...formValues, fromDate : new Date(formValues.fromDate).getTime() , thruDate : formValues.thruDate ? new Date(formValues.thruDate).getTime() : "" , partyId : partyId }
                    axios.put(SERVER_URL + "/rest/s1/fadak/entity/EmplPositionParty" , {data : data}  , axiosKey)
                    .then((res) => {
                        setFormValues({})
                        setEdit(false)
                        setLoading(true)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "تغییرات ردیف مورد نظر با موفقیت انجام شد."));
                    })
                }
            })
        }
        if(formValues.mainPosition=="N"){
            let data = {...formValues, fromDate : new Date(formValues.fromDate).getTime() , thruDate : formValues.thruDate ? new Date(formValues.thruDate).getTime() : "" , partyId : partyId }
            axios.put(SERVER_URL + "/rest/s1/fadak/entity/EmplPositionParty" , {data : data}  , axiosKey)
            .then((res) => {
                setFormValues({})
                setEdit(false)
                setLoading(true)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "تغییرات ردیف مورد نظر با موفقیت انجام شد."));
            })
        }
    }
    const handleCreate = ()=>{
        dispatch(setAlertContent(ALERT_TYPES.WARNING, ' درحال ارسال اطلاعات '));
        if(formValues.mainPosition=="Y"){
            axios.get(SERVER_URL + "/rest/s1/fadak/entity/EmplPositionParty?partyId=" + partyId , axiosKey)
            .then((getData) => {
                if(getData.data.result.length>0){
                    companyPositions.map((companyPosition,index)=>{
                        getData.data.result.map((item)=>{
                            if(companyPosition.emplPositionId==item.emplPositionId){
                                item={...item , mainPosition : "N"}
                                axios.put(SERVER_URL + "/rest/s1/fadak/entity/EmplPositionParty", {data : item } , axiosKey)
                            }
                        })
                        if(index==companyPositions.length-1){
                            let data = {...formValues, fromDate : new Date(formValues.fromDate).getTime() , thruDate : formValues.thruDate ? new Date(formValues.thruDate).getTime() : "" , partyId : partyId }
                            axios.post(SERVER_URL + "/rest/s1/fadak/entity/EmplPositionParty" , {data : data}  , axiosKey)
                            .then((res) => {
                                setFormValues({})
                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                                setLoading(true)
                            })
                        }  
                    })  
                }
                else {
                    let data = {...formValues, fromDate : new Date(formValues.fromDate).getTime() , thruDate : formValues.thruDate ? new Date(formValues.thruDate).getTime() : "" , partyId : partyId }
                    axios.post(SERVER_URL + "/rest/s1/fadak/entity/EmplPositionParty" , {data : data}  , axiosKey)
                    .then((res) => {
                        setFormValues({})
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                        setLoading(true)
                    }).catch(()=>{
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات موفقیت آمیز نبود '));
                    })
                }
            })
        }
        else{
            let data = {...formValues, fromDate : new Date(formValues.fromDate).getTime() , thruDate : formValues.thruDate ? new Date(formValues.thruDate).getTime() : "" , partyId : partyId }
            axios.post(SERVER_URL + "/rest/s1/fadak/entity/EmplPositionParty" , {data : data}  , axiosKey)
            .then((res) => {
                setFormValues({})
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                setLoading(true)
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات موفقیت آمیز نبود '));
            })
        }
    }
    const handleReset=()=>{
        setEdit(false)
        setLoading(true)
    }

    return (
        <FormPro
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{
                if(edit){
                    handleEdit()
                }else{
                    handleCreate()
                }
                
            }}
            resetCallback={handleReset}
            append={formStructure}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">{edit?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    );
};

export default OrganizationForm;