import FormPro from "../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import TablePro from 'app/main/components/TablePro';
import ActionBox from "../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";


const Feedback=({workEffortId,setChangeInTabs,audience})=>{
  const [tableContent,setTableContent]=useState([]);
  const [loading, setLoading] = useState(true);
  const [formFields,setFormFields] = useState({feedbackAbout : [] , actions : [] , achievements : [] , toPartyId : [] , actionsAndAchievementsList : []});
  const dispatch = useDispatch();
  const partyId = useSelector(({auth}) => auth.user.data.partyId);

  
  const axiosKey = {
    headers: {
        'api_key': localStorage.getItem('api_key')
    }
    }

    const tableCols= [
    { name : "fromPartyIdFullName", label:"بازخورد دهنده", type: "text" },
    { name : "workEffortId", label : "بازخوردنسبت به", type : "select", options : formFields.actionsAndAchievementsList , optionLabelField :"workEffortName", optionIdField:"workEffortId"},
    { name : "toPartyId", label:"مخاطب بازخورد", type: "select" , options : formFields.toPartyId , optionLabelField :"employeeFullName" , optionIdField:"employeePartyId" },
    { name : "entryDate", label: "تاریخ ثبت", type: "date" },
    // { name : "degree", label:"درجه مطلوبیت", type: "range" },
    // { name : "condition", label:"وضعیت", type: "select" },
    { name : "body", label: "توضیحات", type: "textarea" },
    ]

    function Form ({editing=false, setChangeInTabs, ...restProps}) {

        const {formValues, setFormValues, handleClose, setLoading, formFields} = restProps;
        const [formValidation, setFormValidation] = React.useState({});
        const [feedback,setFeedback] = useState({actions : false , achievements : false });
        const [waiting, set_waiting] = useState(false)    

        //if formValue.feedbackAbout exist used this formStructure
        function FeedbackFormStructure ({formValues,setFormValues,formFields,formValidation, setFormValidation}) {
            const formStructure=[
                {
                    name    : "feedbackAbout",
                    label   : "بازخوردنسبت به",
                    type    : "select",
                    options : formFields.feedbackAbout ,
                    optionLabelField :"feedbackTitle",
                    optionIdField:"feedbackId",
                    required : true ,
                },feedback.actions ? {
                    name    : "actions",
                    label   : "اقدامات",
                    type    : "select",
                    options : formFields.actions ,
                    optionLabelField :"workEffortName",
                    optionIdField:"workEffortId",
                    required : feedback.actions ? true : false ,
                }:{
                    name    : "achievements",
                    label   : "دستاوردها",
                    type    : "select",
                    options : formFields.achievements ,
                    optionLabelField :"workEffortName",
                    optionIdField:"workEffortId",
                    required : feedback.achievements ? true : false ,
                },{
                    name    : "toPartyId",
                    label   : "مخاطب بازخورد",
                    type    : "select",
                    options : formFields.toPartyId,
                    optionLabelField :"employeeFullName",
                    optionIdField:"employeePartyId",
                    required : true ,
        
                },{
                    name    : "entryDate",
                    label   : "تاریخ ثبت",
                    type    : "date",
                    readOnly: true  ,
                }
            ]
        
            return(
                <FormPro
                    prepend={formStructure}
                    formValues={formValues} setFormValues={setFormValues}
                    formValidation={formValidation}
                    setFormValidation={setFormValidation}
                />
            )
        }
        //if formValues.feedbackAbout not exist used this formStructure
        function FreeFormStructure ({formValues,setFormValues,formFields,formValidation, setFormValidation}) {
            const formStructure=[
                {
                    name    : "feedbackAbout",
                    label   : "بازخوردنسبت به",
                    type    : "select",
                    options : formFields.feedbackAbout ,
                    optionLabelField :"feedbackTitle",
                    optionIdField:"feedbackId",
                    required : true ,
                },{
                    name    : "toPartyId",
                    label   : "مخاطب بازخورد",
                    type    : "select",
                    options : formFields.toPartyId,
                    optionLabelField :"employeeFullName",
                    optionIdField:"employeePartyId",
                    required : true ,
        
                },{
                    name    : "entryDate",
                    label   : "تاریخ ثبت",
                    type    : "date",
                    readOnly: true  ,
                }
            ]

            return(
                <FormPro
                    prepend={formStructure}
                    formValues={formValues} setFormValues={setFormValues}
                    formValidation={formValidation}
                    setFormValidation={setFormValidation}

                />
            )
        }

        const formStructure=[
            (feedback.actions || feedback.achievements) ? {
                name    : "feedback",
                type    : "component",
                component : <FeedbackFormStructure formValues={formValues} setFormValues={setFormValues} formFields={formFields} formValidation={formValidation}
                setFormValidation={setFormValidation}  />,
                col     : 12 ,
            }:{
                name    : "free",
                type    : "component",
                component : <FreeFormStructure formValues={formValues} setFormValues={setFormValues} formFields={formFields} formValidation={formValidation} 
                setFormValidation={setFormValidation} />,
                col     : 12 ,
            },{
                name    : "body",
                label   : "توضیحات",
                type    : "textarea",
                col     : 12 
            }
        ]
        
        useEffect(() => {
            if(formValues?.feedbackAbout && formValues?.feedbackAbout != ""){
                if (formValues?.feedbackAbout == "actions" ){
                    feedback.actions = true 
                    feedback.achievements = false 
                    setFeedback(Object.assign({},feedback))
                }
                if (formValues?.feedbackAbout == "achievements"){
                    feedback.actions = false 
                    feedback.achievements = true 
                    setFeedback(Object.assign({},feedback))
                }
            }
            if(!formValues?.feedbackAbout || formValues?.feedbackAbout == ""){
                feedback.actions = false 
                feedback.achievements = false 
                setFeedback(Object.assign({},feedback))
            }
        }, [formValues?.feedbackAbout])

        React.useEffect(()=>{
            if(!editing){
                setFormValues({entryDate : new Date()})
            }
        },[])

        const handleSubmit = () => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            formValues.fromPartyId = partyId
            formValues.communicationEventTypeId = "FeedBack"
            if(formValues.feedbackAbout == "actions"){formValues.workEffortId = formValues.actions}
            if(formValues.feedbackAbout == "achievements"){formValues.workEffortId = formValues.achievements}
            axios.post(`${SERVER_URL}/rest/s1/workEffort/communicationEvent` , {data : formValues} , axiosKey).then(res => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'))
                setLoading(true)
                resetCallback()
                setChangeInTabs(true)
                set_waiting(false)
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            });
        }
    
        const handleEdit = (data) => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            formValues.fromPartyId = partyId
            formValues.communicationEventTypeId = "FeedBack"
            if(formValues.feedbackAbout == "actions"){formValues.workEffortId = formValues.actions}
            if(formValues.feedbackAbout == "achievements"){formValues.workEffortId = formValues.achievements}
            axios.put(`${SERVER_URL}/rest/s1/workEffort/communicationEvent` , {data : formValues} , axiosKey).then(res => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'))
                setLoading(true)
                resetCallback()
                set_waiting(false)
                setChangeInTabs(true)
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
            });
        }

        const resetCallback = () => {
            setFormValues({entryDate : new Date()})
            handleClose()
        }

        return(
            <FormPro
                prepend={formStructure}
                formValues={formValues}
                setFormValues={setFormValues}
                formValidation={formValidation}
                setFormValidation={setFormValidation}
                resetCallback={resetCallback}
                submitCallback={()=>{
                    if(editing){
                        handleEdit()
                    }else{
                        handleSubmit()
                    }
                }}
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

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/workEffort/feedbackFormInfo?partyId=${partyId}&goalWorkEffortId=${workEffortId}`, axiosKey).then(res => {
            setFormFields(res.data.response)
            axios.post(`${SERVER_URL}/rest/s1/workEffort/getCommunicationEvent`, {actionsAndAchievementsList : {actions : res.data.response.actions , achievements : res.data.response.achievements }} , axiosKey).then(tableData => {
                setTableContent(tableData.data.response)
                setLoading(false)
            })
        })
    }

    useEffect(() => {
        if(loading){
            getData()
        }
    }, [partyId,loading])

    
    useEffect(() => {
        setLoading(true)
    }, [workEffortId,audience?.list])

    const handleRemove = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/workEffort/communicationEvent?workEffortId=${oldData.workEffortId}&communicationEventId=${oldData.communicationEventId}`, axiosKey).then(()=>{
                resolve()
                setLoading(true)
                setChangeInTabs(true)
            }).catch(()=>{
                reject()
            })
        })
    }

  return(
    <Card>
        <CardContent>
            <TablePro
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                loading={loading}
                add="external"
                addForm={<Form setLoading={setLoading} formFields={formFields} setChangeInTabs={setChangeInTabs} />}
                edit="external"
                editForm={<Form editing={true} setLoading={setLoading} formFields={formFields} setChangeInTabs={setChangeInTabs} />}
                removeCallback={handleRemove}
                fixedLayout
                // actions={[{
                //     title: "ثبت وقایع حساس",
                //     icon: EventNoteIcon ,
                //     onClick: () => {
                //         clickHandler()
                //     } ,
                //     disabled : "isDisabled"
                // }
                // ]}
            />
        </CardContent>
    </Card>
  )
}
export default Feedback

