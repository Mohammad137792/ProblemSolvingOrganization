import React, {useState} from "react";
import ActionBox from "../../../../components/ActionBox";
import FormPro from "../../../../components/formControls/FormPro";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {SERVER_URL} from "../../../../../../configs";
import {Button} from "@material-ui/core";
import {useDispatch} from "react-redux";
import axios from "axios";

export default function CMForm({actionObject, setActionObject, tableContent, setTableContent}){
    const dispatch = useDispatch();
    const moment = require('moment-jalaali');
    moment.loadPersian({dialect: 'persian-modern'})
    const formDefaultValues = {
        createDate: moment().format("YYYY-MM-DD"),
    }
    const [formValues, setFormValues] = useState(formDefaultValues)
    const [formValidation, setFormValidation] = useState({});
    const formStructure = [{
        label:  "تاریخ ایجاد",
        name:   "createDate",
        type:   "display",
        options:"Date",
    },{
        name    : "title",
        label   : "عنوان مدل شایستگی",
        type    : "text",
        required: true
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
        axios.post(SERVER_URL + "/rest/s1/orgStructure/competence/model", formValues,{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            const competenceModelId = res.data.competenceModelId
            const newData = Object.assign({},formValues,{competenceModelId})
            setTableContent(tableContent.concat(newData))
            setActionObject(newData.competenceModelId)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد.'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'بروز خطا در ثبت اطلاعات!'));
        });
    }
    function handlePut(){
        axios.put(SERVER_URL +"/rest/s1/orgStructure/entity/CompetenceModel", formValues,{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(() => {
            const newData = Object.assign([],tableContent)
            const index = newData.findIndex(i=>i.competenceModelId===actionObject)
            newData[index] = formValues
            setTableContent(newData)
            setActionObject(null)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد.'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'بروز خطا در ثبت اطلاعات!'));
        });
    }
    function handleGet(id){
        axios.get(SERVER_URL + "/rest/s1/orgStructure/competence/model", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {competenceModelId: id}
        }).then(res => {
            setFormValues(res.data.competenceModels[0])
        }).catch(err => {
            console.log('get error..', err);
        });
    }
    React.useEffect(()=>{
        if(actionObject){
            handleGet(actionObject)
        }else{
            setFormValues(formDefaultValues)
        }
    },[actionObject]);

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
