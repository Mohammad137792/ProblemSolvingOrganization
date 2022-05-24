import React, {useState,useEffect} from 'react';
import {Button, } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import axios from "axios";
import {AXIOS_TIMEOUT , SERVER_URL} from "../../../../../../configs";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {useDispatch} from "react-redux";


const EducationalProfileForm = (props) =>{

    const {initData,tableContent,data,setData} = props

    const formDefaultValues = [];

    const [courseTitles,setCourseTitles] = useState(false)
    const [formValidation, setFormValidation] = useState({});
    const [enableUpload, setEnableUpload] = useState(false);

    const [formValues, setFormValues] = useState( formDefaultValues );

    const formStructure = [{
        label:  "عنوان دوره ",
        name:   "courseId",
        type:   "select",
        optionLabelField: 'title',
        optionIdField:'courseId',
        required: true,
        options:courseTitles,
        filterOptions: options =>  formValues["institutePartyId"] ? options.filter(o=>o["instructorPartyId"].indexOf(formValues["institutePartyId"])>=0) :
        formValues["instructorPartyId"] && !formValues["institutePartyId"] ? options.filter(o=>o["instructorPartyId"].indexOf(formValues["instructorPartyId"])>=0) : options
    },{
        label:  "موسسه برگزار کننده",
        name:   "institutePartyId",
        type:   "select",
        options: initData.institutes ,//[{enumId:1,description:"institute 1"},{enumId:2,description:"institute 2"}]
        filterOptions: options =>  formValues["courseId"] ? options.filter(o=>o["courses"].indexOf(formValues["courseId"]) >= 0 )  : options
    },{
        label:  "مدرس دوره",
        name:   "instructorPartyId",
        optionLabelField: 'name',
        optionIdField:'enumId',
        type:   "select",
        options: initData.instructors ,
        filterOptions: options => formValues["institutePartyId"]  ? options.filter(o=>o["parentEnumId"] == formValues["institutePartyId"]) :
        formValues["courseId"] ?  options.filter(o=>o["courses"].indexOf(formValues["courseId"]) >= 0 ) : options
    },{
        label:  "مدت زمان(ساعت)",
        name:   "duration",
        type:   "number",
        required: false,
    },{
        label:  "تاریخ شروع",
        name:   "fromDate",
        type:   "date",
        required: true,
    },{
        label:  "تاریخ پایان",
        name:   "thruDate",
        type:   "date",
        required: true,
    },{
        label:  "گواهینامه",
        name:   "certification",
        type:   "select",
        options: [{enumId:0,description:"دارد"},{enumId:1,description:"ندارد"}]
    },{
        label:  "پیوست(گواهینامه ها)",
        name:   "certificate",
        type:   "inputFile",
        disabled : enableUpload,
    }]

    const dispatch = useDispatch();

    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    };

    function sendCertificateFile(bodyFormData){
        return axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile",bodyFormData, config)
    }

    function sendForm(fileName){
        if(fileName){
            formValues.fileName = fileName
        }
        return axios.post(SERVER_URL + "/rest/s1/training/addCourse", {data:formValues},  {
            headers: {'api_key': localStorage.getItem('api_key')}
        })

    }

    function submitCourse(){
        let formIsValid = true
        if(!formValues['institutePartyId'] && !formValues['instructorPartyId']){
            formIsValid = false
        }


        if(formIsValid){
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));

            console.log('formValues',formValues)
            if(formValues.certificate){
                let bodyFormData = new FormData();
                bodyFormData.append("file", formValues.certificate)

                sendCertificateFile(bodyFormData)
                    .then(res => {
                        let fileName = res.data.name

                        sendForm(fileName)
                            .then(res => {
                                setData(!data)
                                resetForm()
                                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                            }).catch(() => {
                            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات2 رخ داده است.'));
                        });
                    }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات1 رخ داده است.'));
                });
            }
            else{
                sendForm()
                    .then(res => {
                         setData(!data)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                        resetForm()
                    }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
                });
            }
        }
         else{
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'موسسه یا مدرس برگزار کننده را انتخاب کنید.'));
        }

    }

    function resetForm(){
        setFormValues('')
    }

    function pageDefaultValues(){
        // let titles = initData.courseTitles

        console.log("initData",initData)

        setCourseTitles(initData.courseTitles)
        const defaultCert = {
            "certification":1
        }
        setFormValues(defaultCert)
        // if(titles){
        //     let arr = []
        //     for(let i=0 ; i < titles.length ; i++){
        //         arr.push({enumId:titles[i].courseId , description:titles[i].title})
        //         if(i==titles.length-1){
        //             setCourseTitles(arr)
        //         }
        //     }

        // }

    }


    useEffect(()=>{
        pageDefaultValues()
    },[initData]);


    useEffect(()=>{
            setEnableUpload(formValues.certification)
    },[formValues]);


    return (
            <FormPro
                append={formStructure}
                formValues={formValues}
                formDefaultValues={formDefaultValues}
                setFormValues={setFormValues}
                formValidation={formValidation}
                setFormValidation={setFormValidation}

                submitCallback={submitCourse}
                resetCallback={resetForm}
                actionBox={<ActionBox>
                    <Button type="submit" role="primary">افزودن</Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>}
            />
    )
}

export default EducationalProfileForm