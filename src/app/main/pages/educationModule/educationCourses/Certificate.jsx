
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../../../../../configs";
import { Box, Button, Card, Grid, CardHeader, Checkbox } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import FormPro from 'app/main/components/formControls/FormPro';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';


const Certificate = (props) => {
    const { curriculumCourseId, saveDate, checkCertificateA, checkProfileA, checkSkillA, checkCertificate, checkProfile, checkSkill, setcheckCertificate,
        setCheckProfileA, setCheckSkillA, setCheckProfile, setCheckSkill, setcheckCertificateA, formValuesAssessmenet, setFormValuesAssessmenet, formValues, setFormValues
    } = props


    const [FormValidation, setFormValidation] = React.useState({});
    const [FormValidationAssessmenet, setFormValidationAssessmenet] = React.useState({});





    const [disabledCheckCertificate, setdisabledCheckCertificate] = useState(false)
    const [disabledCheckProfile, setdisabledCheckProfile] = useState(false)
    const [disabledCheckSkill, setdisabledCheckSkill] = useState(false)

    const [disabledCheckCertificateA, setdisabledCheckCertificateA] = useState(false)
    const [disabledCheckProfileA, setdisabledCheckProfileA] = useState(false)
    const [disabledCheckSkillA, setdisabledCheckSkillA] = useState(false)

    const [ompetencies, setOmpetencies] = useState([]);




    const dispatch = useDispatch()
    const axiosKey = {
        headers: {
            api_key: localStorage.getItem("api_key"),
        },
    };




    const FormStructure = [


        {
            label: "انتخاب بر اساس تاریخ",


            type: "component",
            component: <Checkbox disabled={disabledCheckCertificate} onChange={e => {
                setcheckCertificate(e.target.checked)


            }} fontSize="small" />,
            col: 1,
        },


        {
            label: "زمان تخصیص گواهینامه",
            name: "competenciesAssigneeDate",
            type: "date",
            disabled: checkCertificate ? false : true,

            col: 11,
        },

        {

            label: "انتخاب بر اساس تاریخ",

            type: "component",
            component: <Checkbox disabled={disabledCheckProfile} onChange={e => {
                setCheckProfile(e.target.checked)

            }} fontSize="small" />,
            col: 1,
        },

        {
            label: "       زمان تخصیص شایستگی",
            name: "profileDate",
            type: "date",
            disabled: checkProfile ? false : true,

            col: 11,
        },
        {
            label: "انتخاب بر اساس تاریخ",

            type: "component",
            component: <Checkbox disabled={disabledCheckSkill} onChange={e => {
                setCheckSkill(e.target.checked)


            }} fontSize="small" />,
            col: 1,
        },

        {
            label: "        زمان تخصیص مهارت",
            name: "skillAssigneeDate",
            type: "date",
            disabled: checkSkill ? false : true,

            col: 11,
        },

    ]

    const FormStructureAssessment = [

        {
            label: "انتخاب براساس ارزیابی‌های دوره",
            type: "component",
            // component:  uncheckC? <RadioButtonUncheckedIcon onClick={handleUNCheckCertificate} fontSize="small" />: <RadioButtonCheckedIcon onClick={handleCheckCertificate} fontSize="small" />,
            component: <Checkbox disabled={disabledCheckCertificateA} onChange={e => {

                setcheckCertificateA(e.target.checked)


            }} fontSize="small" />,
            col: 1,
        },


        {
            label: "زمان تخصیص گواهینامه",
            name: "competenciesAssigneeDate",
            type: "select",
            options: ompetencies,
            optionIdField: "questionnaireAppId",
            optionLabelField: "title",
            disabled: checkCertificateA ? false : true,

            col: 11,
        },

        {

            label: "انتخاب براساس ارزیابی‌های دوره",

            type: "component",
            component: <Checkbox disabled={disabledCheckProfileA} onChange={e => {
                setCheckProfileA(e.target.checked)

            }} fontSize="small" />,
            col: 1,
        },

        {
            label: " زمان تخصیص شایستگی",
            name: "profileDate",
            type: "select",
            options: ompetencies,
            optionIdField: "questionnaireAppId",
            optionLabelField: "title",
            disabled: checkProfileA ? false : true,

            col: 11,
        },
        {
            label: "انتخاب براساس ارزیابی‌های دوره",

            type: "component",
            component: <Checkbox disabled={disabledCheckSkillA} onChange={e => {
                setCheckSkillA(e.target.checked)


            }} fontSize="small" />,
            col: 1,
        },

        {
            label: " زمان تخصیص مهارت",
            name: "skillAssigneeDate",
            type: "select",
            options: ompetencies,
            optionIdField: "questionnaireAppId",
            optionLabelField: "title",
            disabled: checkSkillA ? false : true,

            col: 11,
        },

    ]

   

    let CurriculumCourseId = curriculumCourseId[0]?.curriculumCourseId

    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/training/getQuestAppCurriculumCourse?curriculumCourseId=" + CurriculumCourseId, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {


            setOmpetencies(res.data.result)
            //    let resulttt= ompetencies.push({title:"اتمام دوره آموزشی",thruDate:"End"})

        }).catch(() => {
        });

    }, []);


    // useEffect(() => {
    //     axios.get(SERVER_URL + "/rest/s1/questionnaire/getEducationalProfileList?curriculumCourseId=" + curriculumCourseId, {
    //         headers: { 'api_key': localStorage.getItem('api_key') }
    //     }).then(res => {
    //         setOmpetencies(res.data.result)

    //     }).catch(() => {
    //     });

    // }, []);
    useEffect(() => {
        if (checkCertificate || checkSkill || checkProfile) {
            setdisabledCheckProfileA(true)
            setdisabledCheckCertificateA(true)
            setdisabledCheckSkillA(true)

        }
        else {
            setdisabledCheckProfileA(false)
            setdisabledCheckCertificateA(false)
            setdisabledCheckSkillA(false)

        }
        if (checkCertificateA || checkSkillA || checkProfileA) {
            setdisabledCheckProfile(true)
            setdisabledCheckCertificate(true)
            setdisabledCheckSkill(true)

        }
        else {
            setdisabledCheckProfile(false)
            setdisabledCheckCertificate(false)
            setdisabledCheckSkill(false)

        }

    }, [checkCertificate, checkSkill, checkProfile, checkSkillA, checkProfileA, checkCertificateA]);

    return (
        <Box >

            <CardHeader title={" مدیریت گواهینامه"} />

            <Grid container direction="row">

                <Grid item md="6" xs="12">
                   
                    <Card style={{ padding: 5 ,margin:5}}>
                    <Box style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <h6>انتخاب براساس  تاریخ</h6>
                    </Box>
                        <FormPro
                            append={FormStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            setFormValidation={setFormValidation}
                            formValidation={FormValidation}

                        />
                    </Card>
                </Grid>

                <Grid item md="6" xs="12">
                  
                    <Card style={{ padding: 5 ,margin:5 }}>
                    <Box style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <h6>انتخاب براساس ارزیابی‌های دوره</h6>
                    </Box>
                        <FormPro
                            append={FormStructureAssessment}
                            formValues={formValuesAssessmenet}
                            setFormValues={setFormValuesAssessmenet}
                            setFormValidation={setFormValidationAssessmenet}
                            formValidation={FormValidationAssessmenet}

                        />
                    </Card>
                </Grid>

            </Grid>
            {/* <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", width: "95%" }}>
                <Button onClick={saveDate} type="submit" style={{ width: 120, height: 40, backgroundColor: "#24a0ed ", color: "white", marginRight: "86%", marginBottom: "2%" }} >
                    تایید
                </Button>
            </Box> */}


        </Box>
    )
}


export default Certificate;


