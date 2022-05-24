import React, { useState, useEffect } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardHeader, Collapse, Grid, Tooltip, CardContent, Typography } from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import { SERVER_URL } from 'configs';
import ActionBox from 'app/main/components/ActionBox';
import { ToggleButton } from '@material-ui/lab';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import TablePro from 'app/main/components/TablePro';
import ListProAccordion from 'app/main/components/ListProAccordion';
import useListState from 'app/main/reducers/listState';
import EvaluationInfo from '../EvaluatorSuugstion/EvaluationInfo';

const NoticeReject = (props) => {
    const { formVariables, submitCallback = true } = props;
    const [formValuesDefineEvaluation, setFormValuesDefineEvaluation] = useState([])
    const [EvaluationMethodEnumId, setEvaluationMethodEnumId] = useState([])
    const [applicationType, setApplicationType] = useState([])
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [formValues, setFormValues] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [loding, setLoding] = useState(true);
    const [tableContentVerif, setTableContentVerif] = useState([]);
    const personnel = useListState("partyRelationshipId", [])
    const [applicationForm, setApplicationForm] = useState([])
    const [loading, setLoading] = useState(true);


    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [
        { name: "unit", type: "select", label: "واحد سازمانی", options: organizationUnit.units, optionLabelField: "unitOrganizationName", optionIdField: "unitPartyId", col: 4, },
        {
            name: "position", type: "select", label: "پست سازمانی", options: organizationUnit.positions, optionLabelField: "description", optionIdField: "emplPositionId", col: 4,
            filterOptions: options => formValues["unit"] ? options.filter((o) => {
                let list = organizationUnit.units.find(x => x.unitPartyId == formValues["unit"])
                return list.emplPosition.indexOf(o["emplPositionId"]) >= 0
            }) :
                options,
        },
        {
            name: "fullName", type: "select", label: "نام ارزیابی شونده", options: organizationUnit.employees, optionLabelField: "name", optionIdField: "partyRelationshipId", col: 4,
            filterOptions: options =>
                formValues["position"] ? options.filter((o) => {
                    let list = organizationUnit.positions.find(x => x.emplPositionId == formValues["position"])
                    return list.person.indexOf(o["fromPartyId"]) >= 0
                }) :
                    formValues["unit"] ? options.filter((o) => {
                        let list = organizationUnit.units.find(x => x.unitPartyId == formValues["unit"])
                        return list.person.indexOf(o["fromPartyId"]) >= 0
                    }) :
                        options,
        },
    ]

    const tableColsVerif = [
        { name: "sequence", type: "number", label: " ترتیب تایید" },
        { name: "emplPositionId", type: "select", label: "پست سازمانی", options: organizationUnit.positions, optionLabelField: "description", optionIdField: "emplPositionId", col: 4 },
        { name: "status", type: "text", label: "وضعیت بررسی" },

    ]
    const tableColsEvaluator = [
        { name: "fullName", type: "select", label: "نام ارزیاب", options: organizationUnit.employees, optionLabelField: "name", optionIdField: "partyRelationshipId", style: { width: "150px" }, required: true },
        // { name: "unit", type: "select", label: "واحد سازمانی", options: organizationUnit.units, optionLabelField: "organizationName", optionIdField: "partyId", style: { width: "150px" } },
        // { name: "position", type: "select", label: "پست سازمانی", options: organizationUnit.positions, optionLabelField: "description", optionIdField: "enumId", style: { width: "150px" } },
        { name: "applicationType", type: "select", label: "دسته بندی", options: applicationType, optionLabelField: "description", optionIdField: "enumId", style: { width: "150px" }, required: true, disabled: true },
        { name: "appraiserRate", type: "float", label: " ضریب اهمیت", style: { width: "80px" }, required: true },
        { name: "questionnaireId", label: "فرم مربوطه", type: "select", options: applicationForm, optionLabelField: "name", optionIdField: "questionnaireId", style: { width: "200px" }, required: true },

    ]

    const getEnum = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluationMethod", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setEvaluationMethodEnumId(res.data.result)

        }).catch(err => {
        });
        let filter = { categoryEnumId: "QcPerformanceEvaluation" }
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

    }


    useEffect(() => {
        setFormValuesDefineEvaluation(prevState => ({
            ...prevState,
            code: formVariables?.trackingCode?.value,
            evaluationPeriodTitle: formVariables?.EvaluationPeriod?.value.evaluationPeriodTitle,
            evaluationMethodEnumIdDis: formVariables?.EvaluationPeriod?.value.evaluationMethodEnumIdDis,
            fromDate: new Date(formVariables?.EvaluationPeriod?.value.fromDate).toLocaleDateString('fa-IR'),
            thruDate: new Date(formVariables?.EvaluationPeriod?.value.thruDate).toLocaleDateString('fa-IR'),
            description: formVariables?.EvaluationPeriod?.value.description,
        }))
        personnel.set(formVariables.Appraisee.value)
        setTableContentVerif(formVariables.VerificationListOfSeniorManager.value)

    }, []);



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
                setLoading(false)

            })
            .catch(() => { });
    }

    useEffect(() => {
        getEnum();
        getOrgInfo()

    }, []);

    const submitSearch = () => {

        if (formValues.fullName !== undefined && formValues.fullName !== null) {
            personnel.set(formVariables.Appraisee.value.filter(item => item.partyRelationshipId === formValues.fullName))
        }
        else if (formValues.fullName === undefined || formValues.fullName === null) {

            if ((formValues.position !== undefined && formValues.position !== null) && (formValues.unit !== undefined && formValues.unit !== null))
                personnel.set(formVariables.Appraisee.value.filter(item => item.unitOrganizationId === formValues.unit && item.emplPositionId === formValues.position))
            if ((formValues.position === undefined || formValues.position === null) && (formValues.unit !== undefined && formValues.unit !== null))
                personnel.set(formVariables.Appraisee.value.filter(item => item.unitOrganizationId === formValues.unit))
            if ((formValues.unitOrganizationId === undefined || formValues.unitOrganizationId === null) && (formValues.position !== undefined && formValues.position !== null))
                personnel.set(formVariables.Appraisee.value.filter(item => item.emplPositionId === formValues.position))
        }
    }
    const handleReset = () => {
        setFormValues([])
        setExpanded(false)
        personnel.set(formVariables.Appraisee.value)


    }

    const accept = () => {

        submitCallback({})
    }
    return (

        <Box >

            <CardHeader title="تعیین ارزیاب" />
            <Card style={{ padding: 5, margin: 5 }}>
                <EvaluationInfo profileValues={formValuesDefineEvaluation} />
            </Card>

            <Card style={{ backgroundColor: "#ddd", padding: 1 }}>
                <Card >
                    <CardContent>
                        <CardHeader style={{ justifyContent: "spaceBetween", textAlign: "spaceBetween", color: "#000", height: 40, padding: 0 }}
                            actAsExpander={true}
                            title="لیست ارزیابی شونده ها"
                            showExpandableButton={true}
                            action={
                                <Tooltip title="    جستجوی ارزیابی شونده ها    ">
                                    <ToggleButton
                                        value="check"
                                        selected={expanded}
                                        onChange={() => setExpanded(prevState => !prevState)}
                                    >
                                        <FilterListRoundedIcon style={{ color: 'gray', fontSize: "1.5rem", border: "1 solid gray" }} />
                                    </ToggleButton>
                                </Tooltip>
                            }
                        />
                        {expanded ?
                            <Collapse in={expanded}>
                                <div>
                                    <hr color='#cbd0d4' style={{ width: "100%" }} />
                                    <FormPro
                                        append={formStructure}
                                        formValues={formValues}
                                        setFormValues={setFormValues}
                                        submitCallback={
                                            submitSearch
                                        }
                                        resetCallback={handleReset}
                                        actionBox={<ActionBox>
                                            <Button type="submit" role="primary">جستجو</Button>
                                            <Button type="reset" role="secondary">لغو</Button>
                                        </ActionBox>}
                                    />
                                </div>
                            </Collapse>
                            : ""}
                    </CardContent>
                    <Box style={{ marginTop: -30 }}>
                        <ListProAccordion
                            context={personnel}
                            renderAccordionSummary={(item) => <Typography>{`${item.pseudoId} ─ ${item.fullName}`}</Typography>}
                            renderAccordionDetails={(item) => (
                                <TablePro
                                    title={`لیست ارزیاب ها `}
                                    columns={tableColsEvaluator}
                                    rows={item?.newEvalutor ? item?.newEvalutor : item?.Evaluater}
                                    className="w-full"
                                    loading={loading}
                                />
                            )
                            }
                        />
                    </Box>
                </Card>
            </Card>
            <Card>
                <TablePro
                    fixedLayout={true}
                    title="لیست مراتب تایید"
                    columns={tableColsVerif}
                    rows={tableContentVerif}
                    setRows={setTableContentVerif}
                    loading={loading}


                />
            </Card>

            <Grid item xs={12} style={{ margin: 10 }}>
                <ActionBox>
                    <Button type="button" onClick={accept} role="primary"> تایید</Button>

                </ActionBox>
            </Grid>
        </Box>
    );
};

export default NoticeReject;