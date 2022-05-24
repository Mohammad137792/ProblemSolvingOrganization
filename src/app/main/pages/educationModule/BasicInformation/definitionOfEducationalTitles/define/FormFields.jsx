import React from 'react';
import FormPro from '../../../../../components/formControls/FormPro';
import ActionBox from "../../../../../components/ActionBox";
import {Button, } from "@material-ui/core";
import axios from "axios";
import {SERVER_URL} from "../../../../../../../configs";
import {useSelector} from "react-redux";
import {Card, CardContent, CardHeader ,Grid , TextField, Typography} from "@material-ui/core"
import CompetenceTable from "./CompetenceTable"
import SkillTable from "./SkillTable"
import { useDispatch } from "react-redux";
import { ALERT_TYPES, setAlertContent, submitPost } from "../../../../../../store/actions/fadak";


const FormFields = (props) => {
    const {setLoading , loading , edit , setEdit , formValues , setFormValues , confirmForm , setConfirmForm  , storeFormValues , setStoreFormValues , editable , setEditable} = props
    const [formValidation, setFormValidation] =React.useState({});
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [companyId,setCompanyId] = React.useState();
    const [courseId,setCourseId] = React.useState();
    const [EntCourse,setEntCourse] = React.useState([]);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        label:  "کد دوره",
        name:   "courseCode",
        type:   "text",
        required: true,
        col     : 4 ,
        readOnly: (confirmForm || !editable)  ? true : false ,
        validator: values=>{
            return new Promise(resolve => {
                if(values.courseCode.replace(/ /g, '') == ""){
                    resolve({error: true, helper: "تعیین این فیلد الزامی است!"})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        }
    },{
        label:  "عنوان دوره ",
        name:   "title",
        type:   "text",
        required: true,
        col     : 4 ,
        readOnly: (confirmForm || !editable)  ? true : false ,
        validator: values=>{
            return new Promise(resolve => {
                if(values.title.replace(/ /g, '') == ""){
                    resolve({error: true, helper: "تعیین این فیلد الزامی است!"})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        }
    },{
        label:  "وضعیت دوره",
        name:   "type",
        type:   "select",
        options: "CourseType",
        filterOptions: options => options.filter(o=>o["enumId"]!="temporarily") ,
        col     : 4 ,
        readOnly: (confirmForm || !editable)  ? true : false,
        validator: values=>{
            return new Promise(resolve => {
                console.log("values.type" , values.type);
                if(storeFormValues.type == "temporarily" && (values.type == "temporarily" || values.type == null )){
                    resolve({error: true, helper: "تعیین وضعیت دوره الزامی است"})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        }
    },{
        label:  "نوع دوره",
        name:   "category",
        type:   "select",
        options: "CourseCategory",
        col     : 4 ,
        required: true,
        readOnly: (confirmForm || !editable)  ? true : false
    },{
        label:  "پیش نیاز",
        name:   "preRequisite",
        type:   "select",
        options: "Existence",
        optionLabelField : "description",
        optionIdField : "enumId",
        col     : 4 ,
        readOnly: (confirmForm || !editable)  ? true : false
    },{
        label:  "عنوان دوره پیش نیاز",
        name:   "prerequisiteCoursesTitle",
        type:   "multiselect",
        options: EntCourse ,
        optionLabelField : "title",
        optionIdField : "courseId",
        filterOptions: options => options.filter(o=>o["courseId"] != formValues?.courseId ) ,
        col     : 4 ,
        required: (formValues?.preRequisite=="exist" ) ? true : false ,
        disabled: !formValues?.preRequisite || formValues?.preRequisite==="notExist" ,
        readOnly: (confirmForm || !editable)  ? true : false ,
        validator: values=>{
            return new Promise(resolve => {
                if(values.preRequisite == "exist" && (!values.prerequisiteCoursesTitle || values.prerequisiteCoursesTitle == "[]" )){
                    resolve({error: true, helper: "عنوان دوره ی پیش نیاز را انتخاب کنید"})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        }
    }]

    React.useEffect(()=>{
        if((!formValues?.prerequisiteCoursesTitle || formValues?.prerequisiteCoursesTitle == "[]") && (formValues?.preRequisite != "" && formValues?.preRequisite)){
            formValues.preRequisite = "notExist"
            setFormValues(Object.assign({},formValues))
        }
    },[formValues?.prerequisiteCoursesTitle])

    React.useEffect(()=>{
        if((!formValues?.preRequisite || formValues?.preRequisite == "" || formValues?.preRequisite == "notExist")){
            formValues.prerequisiteCoursesTitle = "[]"
            setFormValues(Object.assign({},formValues))
        }
    },[formValues?.preRequisite])

    React.useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/training/defineCourseFields?partyRelationshipId=${partyRelationshipId}`, axiosKey).then(opt=>{
            setEntCourse(opt.data.response.course)
            setCompanyId(opt.data.response.companyPartyId)
        })
    },[partyRelationshipId]) 

    const handleCreate =()=>{
        if(!edit){
            axios.post(SERVER_URL + `/rest/s1/training/defineCourse?preRequestedCourses=${formValues?.prerequisiteCoursesTitle ? JSON.parse(formValues.prerequisiteCoursesTitle) : []}&companyPartyId=${companyId}` , {formData : formValues} , axiosKey)
            .then(reponse=>{
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                setConfirmForm(true)
                setEdit(true)
                setLoading(true)
                setCourseId(reponse.data.courseId)
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات موفقیت آمیز نبود !'));
            })
        }
        if(edit && !confirmForm){
            formValues.courseId = formValues.courseId ?? courseId
            axios.post(SERVER_URL + `/rest/s1/training/editDefineCourse?preRequestedCourses=${formValues?.prerequisiteCoursesTitle ? JSON.parse(formValues.prerequisiteCoursesTitle) : []}&companyPartyId=${companyId}&storePreRequestedCourses=${storeFormValues?.prerequisiteCoursesTitle ? JSON.parse(storeFormValues.prerequisiteCoursesTitle) : []}` , {formData : formValues} , axiosKey)
            .then(reponse=>{
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                setConfirmForm(false)
                setEdit(false)
                setFormValues({})
                setLoading(true)
                setCourseId(reponse.data.courseId)
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ثبت اطلاعات موفقیت آمیز نبود !'));
            })
        }
        if(edit && confirmForm){
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            setConfirmForm(false)
            setEdit(false)
            setFormValues({})
            setLoading(true)
        }
    }

    const handleReset =()=>{
        setEdit(false)
        setConfirmForm(false)
        setFormValues({})
        setStoreFormValues([])
        setLoading(true)
        setEditable(true)
    }

    return (
        <>
            <CardHeader title={"تعریف دوره آموزشی"} />
            <FormPro
                prepend={formStructure}
                formValues={formValues}
                setFormValues={setFormValues}
                formValidation={formValidation}
                setFormValidation={setFormValidation}
                submitCallback={handleCreate }
                resetCallback={handleReset}
                actionBox={
                    <>  
                        {editable ?
                        (edit && confirmForm ) ?
                            <ActionBox>
                                <Button type="submit" role="primary" >{(edit && confirmForm) ? "ثبت دوره جدید" : (edit && !confirmForm) ? "ویرایش" : "ثبت و افزودن موارد تکمیلی"} </Button>
                            </ActionBox> 
                        :
                            <ActionBox>
                                <Button type="submit" role="primary" >{(edit && confirmForm) ? "ثبت دوره جدید" : (edit && !confirmForm) ? "ویرایش" : "ثبت و افزودن موارد تکمیلی"} </Button>
                               <Button type="reset" role="secondary" >لغو</Button>
                            </ActionBox> 
                        :
                            <ActionBox>
                                <Button type="reset" role="secondary" >تایید</Button>
                            </ActionBox> 
                        }
                    </>
                }
            />
            {
                edit ? 
                    <Grid container spacing={2} >
                        <Grid item xs={12} md={6}>
                            <CompetenceTable formValues={formValues} setFormValues={setFormValues} editing={edit} courseId={courseId} resetMainTable={setLoading} editable={editable}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <SkillTable formValues={formValues} setFormValues={setFormValues} editing={edit} courseId={courseId} resetMainTable={setLoading} editable={editable}/>
                        </Grid>
                    </Grid>
                : "" 
            }     
        </>
    );
};

export default FormFields;