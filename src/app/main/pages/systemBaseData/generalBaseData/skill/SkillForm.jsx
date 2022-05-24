import React, {useState} from "react";
import ActionBox from "../../../../components/ActionBox";
import FormPro from "../../../../components/formControls/FormPro";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {SERVER_URL} from "../../../../../../configs";
import {Button} from "@material-ui/core";
import {useDispatch} from "react-redux";
import axios from "axios";

const skillTypes = [
    {enumId: "group", description: "گروه مهارت"},
    {enumId: "skill", description: "مهارت"}
]

export default function SkillForm({actionObject, setActionObject, tableContent, setTableContent}){
    const dispatch = useDispatch();
    const formDefaultValues = {
        status: 'Y',
    }
    const [skillTypeIsDisable, setSkillTypeIsDisable] = useState(false)
    const [formValues, setFormValues] = useState(formDefaultValues)
    const [formValidation, setFormValidation] = useState({});
    const skill_type_is_disable = ()=>{
        if(actionObject && (!formValues.parentSkillId || formValues.parentSkillId!==formValues.skillId)){
            return tableContent.filter(i=>i.parentSkillId===formValues.skillId).length>0
        }
        return false
    }
    const formStructure = [{
        name    : "skillCode",
        label   : "کد",
        type    : "text",
        required: true
    },{
        name    : "title",
        label   : "عنوان",
        type    : "text",
        required: true
    },{
        name    : "sequenceNum",
        label   : "ترتیب نمایش",
        type    : "number",
    },{
        name    : "type",
        label   : "نوع",
        type    : "select",
        options : skillTypes,
        required: true,
        disableClearable: true,
        disabled: skillTypeIsDisable //skill_type_is_disable()
    },{
        name    : "parentSkillId",
        label   : "گروه مهارت",
        type    : "select",
        options : tableContent.filter(i=>!i.parentSkillId && i.skillId!==formValues.skillId),
        optionIdField   : "skillId",
        optionLabelField: "title",
        display : formValues.type==="skill"
    },{
        name    : "status",
        label   : "فعال",
        type    : "indicator",
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "textarea",
        col     : 12
    }]
    function handleSubmit() {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        if(actionObject){
            handlePut()
        }else{
            handlePost()
        }
    }
    function handleReset() {
        setActionObject(null)
    }
    function handlePost(){
        axios.post(SERVER_URL + "/rest/s1/orgStructure/skill", formValues,{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            const newData = Object.assign({},formValues,res.data)
            setTableContent(tableContent.concat(newData))
            setActionObject(null)
            setFormValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد.'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'بروز خطا در ثبت اطلاعات!'));
        });
    }
    function handlePut(){
        const packet = {
            ...formValues,
            parentSkillId: formValues.type==="skill" ? formValues.parentSkillId || formValues.skillId : formValues.parentSkillId
        }
        axios.put(SERVER_URL +"/rest/s1/orgStructure/skill", packet,{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(() => {
            const newData = Object.assign([],tableContent)
            const index = newData.findIndex(i=>i.skillId===actionObject.skillId)
            newData[index] = packet
            setTableContent(newData)
            setActionObject(null)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد.'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'بروز خطا در ثبت اطلاعات!'));
        });
    }

    React.useEffect(()=>{
        if(actionObject){
            setFormValues({...actionObject, type: actionObject.parentSkillId ? "skill" : "group"})
        }else{
            setFormValues(formDefaultValues)
        }
        if (actionObject && !actionObject.parentSkillId && tableContent.filter(i=>i.parentSkillId===actionObject.skillId).length>0){
            setSkillTypeIsDisable(true)
        } else {
            setSkillTypeIsDisable(false)
        }
    },[actionObject]);

    React.useEffect(()=>{
        if(formValues.type==="group") {
            setFormValues(prevState => ({
                ...prevState,
                parentSkillId: null
            }))
        }
    },[formValues.type])

    return(
        <FormPro formValues={formValues} setFormValues={setFormValues} formDefaultValues={formDefaultValues}
                 formValidation={formValidation} setFormValidation={setFormValidation}
                 submitCallback={handleSubmit} resetCallback={handleReset}
                 append={formStructure}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">{actionObject? "ویرایش": "افزودن"}</Button>
                     <Button type="reset" role="secondary">لغو</Button>
                 </ActionBox>}
        />
    )
}
