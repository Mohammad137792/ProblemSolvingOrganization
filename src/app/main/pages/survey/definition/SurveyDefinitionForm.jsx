import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import {Box, Button, CardContent} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import ActionBox from "../../../components/ActionBox";
import FormPro from "../../../components/formControls/FormPro";
import {useDispatch} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import axios from "../../../api/axiosRest";
import Divider from "@material-ui/core/Divider";
import SurveyParticipants from "./SurveyParticipants";

const formDefaultValues = {}

export default function SurveyDefinitionForm({objectId, set_objectId, dataList, set_dataList, questionnaires}) {
    const dispatch = useDispatch();
    const [formValues, set_formValues] = React.useState(formDefaultValues)
    const [formValidation, setFormValidation] = React.useState({});
    const formStructure = [{
        name    : "code",
        label   : "کد",
        type    : "text",
        required: true,
    },{
        name    : "name",
        label   : "عنوان",
        type    : "text",
        required: true,
    },{
        name    : "fromDate",
        label   : "تاریخ ارسال",
        type    : "date",
    },{
        name    : "thruDate",
        label   : "مهلت پاسخ",
        type    : "date",
    },{
        name    : "questionnaireId",
        label   : "فرم نظرسنجی",
        type    : "select",
        options : questionnaires,
        optionIdField: "questionnaireId",
        optionLabelField: "name",
        otherOutputs: [{name: "questionnaireName", optionIdField: "name"}]
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "textarea",
        col     : 12,
    }]

    const handle_submit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        if(objectId){
            handle_edit()
        }else{
            handle_create()
        }
    }

    const handle_edit = () => {
        axios.put("/s1/survey", formValues).then( () => {
            update_dataList("edit",formValues)
            set_objectId(null)
            set_formValues(formDefaultValues)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        });
    }

    const handle_create = ()=>{
        axios.post("/s1/survey", formValues).then( res => {
            const newObject = Object.assign({},formValues,{
                questionnaireAppId: res.data.questionnaireAppId,
                statusId: res.data.statusId,
            })
            update_dataList("add", newObject)
            set_objectId(newObject.questionnaireAppId)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        });
    }

    const update_dataList = (action, newObject)=>{
        set_dataList(prevState =>{
            let buffer = Object.assign([],prevState)
            if(action==="edit") {
                const index = buffer.findIndex(i=>i.questionnaireAppId===newObject.questionnaireAppId)
                buffer[index] = newObject;
            }else if (action==="add"){
                buffer.push(newObject)
            }
            return buffer
        })
        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد.'));
    }

    const handle_reset = ()=>{
        set_objectId(null)
    }

    React.useEffect(()=>{
        if(objectId) {
            set_formValues(dataList.find(i=>i.questionnaireAppId===objectId)||{})
        } else {
            set_formValues(formDefaultValues)
        }
    },[objectId])

    return (
        <Card>
            <CardHeader title="تعریف نظرسنجی"/>
            <CardContent>
                <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                         formValidation={formValidation} setFormValidation={setFormValidation}
                         prepend={formStructure}
                         actionBox={<ActionBox>
                             <Button type="submit" role="primary">{objectId?"ویرایش":"افزودن"}</Button>
                             <Button type="reset" role="secondary">لغو</Button>
                         </ActionBox>}
                         submitCallback={handle_submit} resetCallback={handle_reset}
                />
                {objectId &&
                <React.Fragment>
                    <Box my={2}>
                        <Divider variant="fullWidth"/>
                    </Box>
                    <SurveyParticipants questionnaireAppId={formValues.questionnaireAppId}/>
                </React.Fragment>
                }
            </CardContent>
        </Card>
    )
}
