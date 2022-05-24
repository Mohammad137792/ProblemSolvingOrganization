import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Grid, CardContent, CardHeader, Button } from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import { SERVER_URL } from 'configs';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { useSelector } from 'react-redux';
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircle from '@material-ui/icons/CheckCircle';
import CircularProgress from "@material-ui/core/CircularProgress";
import EvaluationInfo from './EvaluationInfo';


const AssigneeEvaluatorManager = (props) => {
    const { formVariables, submitCallback = true } = props;
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [formValuesAppraisee, setFormValuesAppraisee] = useState([]);
    const [EvaluationMethodEnumId, setEvaluationMethodEnumId] = useState([])
    const [applicationForm, setApplicationForm] = useState([])
    const [applicationType, setApplicationType] = useState([])
    const [table, setTable] = useState([])
    const [loding, setLoiding] = useState(true)
    const [formValuesDefineEvaluation, setFormValuesDefineEvaluation] = useState([])
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [activeStep, setActiveStep] = useState(0);
    const [stepList, setStepList] = useState([]);
    const username = useSelector(({ auth }) => auth.user.data.username);
    const [waiting, setWaiting] = useState(false)
    const [waiting1, setWaiting1] = useState(false)
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const tableColsEvaluator = [
        { name: "fullName", type: "select", label: "نام ارزیاب", options: organizationUnit.employees, optionLabelField: "name", optionIdField: "partyRelationshipId", style: { width: "150px" }, required: true },
        // { name: "unit", type: "select", label: "واحد سازمانی", options: organizationUnit.units, optionLabelField: "organizationName", optionIdField: "partyId", style: { width: "150px" } },
        // { name: "position", type: "select", label: "پست سازمانی", options: organizationUnit.positions, optionLabelField: "description", optionIdField: "enumId", style: { width: "150px" } },
        { name: "applicationType", type: "select", label: "دسته بندی", options: applicationType, optionLabelField: "description", optionIdField: "enumId", style: { width: "150px" }, required: true, disabled: true },

    ]

    const formStructureEvaluation = [
        {
            name: "code",
            label: "کد رهگیری دوره ارزیابی",
            type: "text",
            readOnly: true,
            col: 4
        }, {
            name: "evaluationPeriodTitle",
            label: " عنوان دوره ارزیابی",
            type: "text",
            col: 4,
            readOnly: true,


        }, {
            name: "evaluationMethodEnumId",
            label: "روش ارزیابی",
            type: "select",
            options: EvaluationMethodEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            readOnly: true,
            col: 4
        }, {
            name: "fromDate",
            label: "تاریخ شروع ارزیابی",
            type: "date",
            readOnly: true,
            col: 4
        }, {
            name: "thruDate",
            label: "تاریخ پایان ارزیابی",
            type: "date",
            readOnly: true,
            col: 4
        },
        , {
            name: "description",
            label: "  توضیحات",
            type: "textarea",
            readOnly: true,
            col: 4
        }
    ]



    const formStructureAppraisee = [
        {
            name: "pseudoId",
            label: "کد  پرسنلی",
            type: "text",
            readOnly: true,
            col: 3
        }, {
            name: "fullName",
            label: "نام و نام خانوادگی",
            type: "text",
            col: 3,
            readOnly: true,


        }, {
            name: "organizationName",
            label: " واحد سازمانی",
            type: "text",

            readOnly: true,
            col: 3
        }, {
            name: "emplPosition",
            label: "پست سازمانی",
            type: "text",

            readOnly: true,
            col: 3
        }

    ]

    useEffect(() => {
        let obj = {}
        let array = []

        setActiveStep(formVariables.managerList.value.find(rm => (rm.username === username))?.sequence + 1)
        obj.fullName = formVariables.evaluation.value.fullName
        array.push(obj)
        setStepList(array.concat(formVariables.managerList.value))
    }, []);

    useEffect(() => {

        let dataTable = []
        dataTable = formVariables?.evaluation?.value?.Evaluater
        setFormValuesAppraisee(formVariables?.evaluation?.value)
        setTable(dataTable)
        setFormValuesDefineEvaluation(prevState => ({
            ...prevState,
            code: formVariables?.trackingCode?.value,
            evaluationPeriodTitle: formVariables?.EvaluationPeriod?.value.evaluationPeriodTitle,
            evaluationMethodEnumIdDis: formVariables?.EvaluationPeriod?.value.evaluationMethodEnumIdDis,
            fromDate: new Date(formVariables?.EvaluationPeriod?.value.fromDate).toLocaleDateString('fa-IR'),
            thruDate: new Date(formVariables?.EvaluationPeriod?.value.thruDate).toLocaleDateString('fa-IR'),
            description: formVariables?.EvaluationPeriod?.value.description,
        }))


    }, [])



    const getEnum = () => {
        // axios.get(SERVER_URL + "/rest/s1/evaluation/getApplicationType?categoryEnumId=QcPerformanceEvaluation", {
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

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluationMethod", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setEvaluationMethodEnumId(res.data.result)

        }).catch(err => {
        });

    }




    const getOrgInfo = () => {
        axios
            .get(
                SERVER_URL + "/rest/s1/fadak/allCompaniesFilter?isLoggedInUserData=true",
                axiosKey
            )
            .then((res) => {
                const orgMap = {
                    units: res.data.data.units,
                    subOrgans: res.data.data.companies,
                    positions: res.data.data.emplPositions,
                    employees: res.data.data.persons,
                };
                setOrganizationUnit(orgMap);
                setLoiding(false)

            })
            .catch(() => { });
    }

    useEffect(() => {
        getEnum();
        getOrgInfo()


    }, []);




    const handleEditEvaluatorTable = (newData, oldData) => {
        return new Promise((resolve, reject) => {
            const listTableContentE = [...table];
            let index = listTableContentE.findIndex(ele => ele === oldData)
            let reduser = listTableContentE.splice(index, 1)
            // setTable(listTableContentE)
            let array = []
            array.push(newData)

            setTable(prevState => { return [...prevState, ...array] })

            resolve()

            // let newArray=table.filter(item=>item!==oldData)


            // setTable(prevState => { return [...prevState, ...newArray] })

            // Appraisee.map((item, index) => {
            //     item.Evaluater = table

            // })



        })
    }

    const handleAccept = () => {
        setWaiting(true)
        formVariables.evaluation.value.Evaluater = table
        let ind = formVariables.evaluation.value.managerList?.findIndex(item => item.sequence !== undefined && item.username === username)
        if (ind >= 0)
            formVariables.evaluation.value.managerList[ind].accept = "Y"
        let arry = []
        arry.push(formVariables.evaluation.value)

        let finalResult = Object.assign(formVariables?.evaluation?.value, table)
        if (ind >= 0)
            finalResult.managerList[ind].accept = "Y"

        let data = {
            // continue:"cancel",
            evaluation: finalResult,
            resultManagerForm: true,
            NewAppraiseeM: formVariables?.NewAppraiseeM?.value ? arry.concat(formVariables?.NewAppraiseeM?.value.filter(item => item.partyRelationshipId !== finalResult.partyRelationshipId)) : arry
            // NewAppraiseeM:  arry
        }
        submitCallback(data)

    }
    const handleSave = () => {
        setWaiting1(true)
        formVariables.evaluation.value.Evaluater = table
        let ind = formVariables.evaluation.value.managerList?.findIndex(item => item.sequence !== undefined && item.username === username)
        if (ind >= 0)
            formVariables.evaluation.value.managerList[ind].accept = "Y"
        let arry = []
        arry.push(formVariables.evaluation.value)

        let finalResult = Object.assign(formVariables?.evaluation?.value, table)
        if (ind >= 0)
            finalResult.managerList[ind].accept = "Y"

        let data = {
            evaluation: finalResult,
            // continue:"save",
            resultManagerForm: false,
            NewAppraiseeM: formVariables?.NewAppraiseeM?.value ? arry.concat(formVariables?.NewAppraiseeM?.value.filter(item => item.partyRelationshipId !== finalResult.partyRelationshipId)) : arry
            // NewAppraiseeM:  arry
        }
        submitCallback(data)


    }

    return (
        <Box style={{ marginBottom: 10 }}>
            <Card style={{ padding: 1, backgroundColor: "#ddd", margin: 5 }} >
                <Card>
                    {/* <CardHeader title="دوره ارزیابی" />
                    <FormPro
                        formValues={formValuesDefineEvaluation}
                        setFormValues={setFormValuesDefineEvaluation}
                        append={formStructureEvaluation}


                    /> */}
                    <EvaluationInfo profileValues={formValuesDefineEvaluation} />
                </Card>
            </Card>

            <Card style={{ padding: 1, backgroundColor: "#ddd", margin: 5 }} >
                <Card style={{ padding: 5 }}>
                    <CardHeader title="مشخصات ارزیابی شونده " />
                    <FormPro
                        formValues={formValuesAppraisee}
                        setFormValues={setFormValuesAppraisee}
                        append={formStructureAppraisee}

                    />
                </Card>
            </Card>
            <Card style={{ padding: 1, backgroundColor: "#ddd", margin: 5 }} >
                <Card style={{ padding: 5 }}>
                    <CardHeader title=" وضعیت پیشنهاد ارزیاب " />
                    {formVariables.evaluation.value?.managerList ? <Stepper alternativeLabel activeStep={activeStep}>
                        {formVariables.evaluation.value.managerList.map((step, index) => (
                            <Step key={index}>
                                <StepLabel icon={step.accept === "Y" ? <CheckCircle style={{ color: "green" }} /> : <CancelIcon style={{ color: "orange" }} />}>{step.fullName}</StepLabel>
                            </Step>
                        ))}
                    </Stepper> : ""}
                </Card>
            </Card>
            <Card style={{ padding: 1, backgroundColor: "#ddd", margin: 5 }} >
                <Card style={{ padding: 5 }}>
                    <TablePro
                        fixedLayout={true}
                        title="لیست ارزیاب ها"
                        columns={tableColsEvaluator}
                        rows={table}
                        setRows={setTable}
                        editCallback={handleEditEvaluatorTable}
                        edit="inline"
                        loading={loding}

                    />
                </Card>
            </Card>

            <Grid item xs={12} style={{ marginTop: 10 }}>
                <ActionBox>
                    <Button type="button" onClick={handleAccept} role="primary" disabled={waiting1 ? waiting1 : waiting} endIcon={waiting ? <CircularProgress size={20} /> : null}>ارسال جهت تایید</Button>

                    {/* <Button type="button" onClick={handleSave} role="secondary" disabled={waiting ? waiting : waiting1} endIcon={waiting1 ? <CircularProgress size={20} /> : null}>ثبت موقت</Button> */}

                </ActionBox>
            </Grid>


        </Box>
    );
};

export default AssigneeEvaluatorManager;