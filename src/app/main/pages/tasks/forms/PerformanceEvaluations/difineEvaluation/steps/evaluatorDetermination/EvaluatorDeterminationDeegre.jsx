import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardContent, CardHeader, FormControl, InputLabel, makeStyles, MenuItem, Select } from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from 'app/main/components/ActionBox';
import { useDispatch } from "react-redux";
import { SERVER_URL } from 'configs';
import VerificatinLevel from './VerificatinLevel';
import TablePro from 'app/main/components/TablePro';



const EvaluatorDeterminationDeegre = (props) => {
    const { degree, setDegree, verificationSeniorManager, setVerificationSeniorManager, formValuesDifineEvaluator, setFormValuesDifineEvaluator, myElement,
        degreeEvaluationTableContent, showWarning, setShowWarning
        , setDegreeEvaluationTableContent } = props
    const [formValidationDifineEvaluator, setFormValidationDifineEvaluator] = useState([]);
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [applicationForm, setApplicationForm] = useState([])
    const [applicationType, setApplicationType] = useState([])
    const [deegreList, setDeegreList] = useState([])
    const [typeAccess, settypeAccess] = useState([]);
    const myRef = useRef(null)
    const scrollToRef = () => myRef.current.scrollIntoView()
    const dispatch = useDispatch()
    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 160,

        },
        selectEmpty: {
            marginTop: theme.spacing(3),
        },
    }));
    const classes = useStyles();


    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }


    const degreeEvaluationTableCols = [
        {
            name: "applicationType",
            label: " دسته بندی  ",
            type: "select",
            style: { minWidth: "90px" },
            options: applicationType,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 4,
            required: true
        },
        {
            name: "questionnaireId",
            label: "  فرم ارزیابی  ",
            type: "select",
            style: { minWidth: "90px" },
            options: applicationForm,
            optionLabelField: "name",
            optionIdField: "questionnaireId",
        },
        {
            name: "appraiserRate",
            type: "float",
            label: " ضریب اهمیت",
            style: { minWidth: "90px" },
        },

    ]
    const expertFormStructure = [
        {
            name: "organizationPartyId",
            label: "واحد سازمانی",
            type: "select",
            options: organizationUnit.units,
            optionLabelField: "unitOrganizationName",
            optionIdField: "unitPartyId",
            col: 6
        },
        {
            name: "emplPositionId",
            label: "پست سازمانی",
            type: "select",
            options: organizationUnit.positions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            col: 6,
            required: true,
            filterOptions: options => formValuesDifineEvaluator["organizationPartyId"] ? options.filter((o) => {
                let list = organizationUnit.units.find(x => x.unitPartyId == formValuesDifineEvaluator["organizationPartyId"])
                return list.emplPosition.indexOf(o["emplPositionId"]) >= 0
            }) :
                options,
        }
        , {
            name: "staff",
            label: "پیشنهاد توسط پرسنل ارزیابی شونده",
            type: "check",
            col: 6
        }
        ,
        formValuesDifineEvaluator.staff === true ? {
            name: "daysOfDefineEvaluator",
            label: " مهلت تعیین ارزیاب به روز",
            type: "number",
            required: true,
            col: 6
        } : {
            name: "empty",
            label: "",
            type: "text",
            disabled: true,
            style: { visibility: "hidden" },
            col: 4
        },
        ,
        formValuesDifineEvaluator.staff === true ? {
            name: "confirmationManager",
            label: "تایید ارزیاب توسط مدیران مستقیم",
            type: "check",
            col: 6
        } : {
            name: "empty",
            label: "",
            type: "text",
            disabled: true,
            style: { visibility: "hidden" },
            col: 4
        },

        formValuesDifineEvaluator.confirmationManager === true ? {
            name: "numsOfManager",
            label: "تعداد مدیران مستقیم",
            required: true,
            type: "number",
            col: 3
        } : {
            name: "empty",
            label: "",
            type: "text",
            disabled: true,
            style: { visibility: "hidden" },
            col: 4
        }
        ,
        formValuesDifineEvaluator.confirmationManager === true ? {

            name: "daysOfDefineEvaluatorByManager",
            label: " مهلت تایید ارزیاب به روز",
            type: "number",
            required: true,
            col: 3
        } : {
            name: "empty",
            label: "",
            type: "text",
            disabled: true,
            style: { visibility: "hidden" },
            col: 4
        }

    ];

    const getEnum = () => {
        // axios.post(SERVER_URL + "/rest/s1/evaluation/getApplicationType", { categoryEnumId: "QcPerformanceEvaluation" }, {
        //     headers: { 'api_key': localStorage.getItem('api_key') }
        // }).then(res => {
        //     setApplicationForm(res.data.result)
        // }).catch(err => {
        // });
        let filter = { categoryEnumId: "QcPerformanceEvaluation", subCategoryEnumId: "QcPEPerfomance" }
        axios.get(SERVER_URL + "/rest/s1/questionnaire/archive", {
            headers: { 'api_key': localStorage.getItem('api_key') }, params: filter
        }).then(res => {
            setApplicationForm(res.data.questionnaires)
        }).catch(() => {
        });


        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluatorLevel", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setApplicationType(res.data.result)
        }).catch(err => {
        });
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluationDegree", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {

            setDeegreList(res.data.result.sort(function (a, b) { return a.sequenceNum - b.sequenceNum }))
        }).catch(err => {
        });
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluatorSelection", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {

            settypeAccess(res.data.result)
        }).catch(err => {
        });

    }

    useEffect(() => {
        let data = {
            partyId: "",
        }
        axios.post(SERVER_URL + "/rest/s1/fadak/personLoginInfo", { data: data }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(response => {
            // axios
            //     .get(
            //         SERVER_URL + "/rest/s1/training/getNeedsAssessments",
            //         axiosKey
            //     )
            //     .then((res) => {
            //         const orgMap = {
            //             units: res.data.contacts.units.filter(item => item.parentOrg === response.data.result[0].companyPartyId),
            //             subOrgans: res.data.contacts.subOrgans.filter(item => item.partyId === response.data.result[0].companyPartyId),
            //             positions: res.data.contacts.posts.filter(post => res.data.contacts.units.filter(item => item.parentOrg === response.data.result[0].companyPartyId).find(unit => (unit.partyId === post.parentEnumId))),
            //             employees: res.data.contacts.employees.party.filter(item => item.ownerPartyId === response.data.result[0].companyPartyId),
            //         };
            //         setOrganizationUnit(orgMap);
            //     })
            //     .catch(() => {
            //     });

            axios
                .get(
                    SERVER_URL + "/rest/s1/fadak/allCompaniesFilter?isLoggedInUserData=true",
                    axiosKey
                )
                .then((res) => {
                    const orgMap = {
                        units: res.data.data.units.filter(item => item.companyPartyId === response.data.result[0]?.companyPartyId),
                        subOrgans: res.data.data.companies.filter(item => item.companyPartyId === response.data.result[0]?.companyPartyId),
                        positions: res.data.data.emplPositions.filter(item => item.companyPartyId === response.data.result[0]?.companyPartyId),
                        employees: res.data.data.persons.filter(item => item.companyPartyId === response.data.result[0]?.companyPartyId),
                    };
                    setOrganizationUnit(orgMap);

                })
                .catch(() => { });
        }).catch(err => { });
    }, []);


   

    useEffect(() => {

        setFormValuesDifineEvaluator(prevState => ({
            ...prevState,
            organizationPartyId: organizationUnit.positions?.find(item => item?.emplPositionId === formValuesDifineEvaluator["emplPositionId"])?.unitPartyId,
        }))

    }, [formValuesDifineEvaluator.emplPositionId])



    useEffect(() => {
        getEnum();
    }, []);
    useEffect(() => {
        if (!formValuesDifineEvaluator.staff) {
            setFormValuesDifineEvaluator(prevState => ({
                ...prevState,
                daysOfDefineEvaluator: "",
                confirmationManager: false,
                numsOfManager: "",
                daysOfDefineEvaluatorByManager: "",

            }))
        }
        if (!formValuesDifineEvaluator.confirmationManager) {
            setFormValuesDifineEvaluator(prevState => ({
                ...prevState,
                numsOfManager: "",
                daysOfDefineEvaluatorByManager: "",

            }))
        }
    }, [formValuesDifineEvaluator.staff, formValuesDifineEvaluator.confirmationManager]);


    const handleEditDegreeEvaluationTable = (newData, oldData) => {
        return new Promise((resolve, reject) => {
            const listTableContentE = [...degreeEvaluationTableContent];
            let fList = listTableContentE.findIndex(ele => ele === oldData)
            let reduser = listTableContentE.splice(fList, 1)
            setDegreeEvaluationTableContent(listTableContentE)
            let array = []
            if (newData.appraiserRate === "")
                newData.appraiserRate = 1
            array.push(newData)
            setDegreeEvaluationTableContent(prevState => { return [...prevState, ...array] })
            setShowWarning(false)
            resolve()

        })
    }
    const handle_submit = () => {

    }

    const handleChange = (event) => {
        setDegree(event.target.value);
        let rate = event.target.value
        let array = []
        let obj = { applicationType: undefined, questionnaireId: undefined, fullName: undefined, unit: undefined, position: undefined, psoudoId: undefined, appraiserRate: 1 }
        let size = parseInt(rate) / 90
        if (size - degreeEvaluationTableContent.length >= 0) {
            for (let i = 0; i < size - degreeEvaluationTableContent.length; i++) {
                array.push(obj)
            }
            setDegreeEvaluationTableContent(prevState => { return [...prevState, ...array] })
        }


        else {
            for (let i = 0; i < size; i++) {
                array.push(obj)
            }
            setDegreeEvaluationTableContent(array)

        }


    };
    useEffect(() => {
        scrollToRef()
    }, [])
    return (
        <>
            <Card ref={myRef}>
                <CardContent>
                    <CardHeader title="  درجه ارزیابی" />
                    <Box>
                        <FormControl variant="outlined" className={classes.formControl} >
                            <InputLabel id="demo-simple-select-outlined-label">درجه ارزیابی</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={degree}
                                onChange={handleChange}
                                label="degree"
                            >

                                {deegreList.map(item => (
                                    <MenuItem value={item.optionValue}>{item?.description}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    {showWarning ? <h6 style={{ color: "red", marginBottom: 0 }}>با توجه به درجه ارزیابی جدول را  پر کنید *</h6> : ""}
                    <TablePro
                        columns={degreeEvaluationTableCols}
                        rows={degreeEvaluationTableContent}
                        setRows={setDegreeEvaluationTableContent}
                        editCallback={handleEditDegreeEvaluationTable}
                        edit="inline"

                    />
                </CardContent>
            </Card>
            <Card style={{ margin: 5, height: 300 }}>
                <CardContent>
                    <CardHeader title=" کارشناس مسئول" />
                    <FormPro
                        formValues={formValuesDifineEvaluator}
                        setFormValues={setFormValuesDifineEvaluator}
                        append={expertFormStructure}
                        formValidation={formValidationDifineEvaluator}
                        setFormValidation={setFormValidationDifineEvaluator}
                        actionBox={<ActionBox style={{ display: "none" }}>
                            <Button ref={myElement} type="submit" role="primary">ثبت</Button>
                        </ActionBox>}
                        submitCallback={handle_submit}

                    />
                </CardContent>
            </Card>
            <VerificatinLevel
                verificationTitle="تنظیم سلسله مراتب تایید مدیران ارشد"
                typeAccess={typeAccess}
                verificationTableContent={verificationSeniorManager} setVerificationTableContent={setVerificationSeniorManager} />

        </>
    );
};

export default EvaluatorDeterminationDeegre;