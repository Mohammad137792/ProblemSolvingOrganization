import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardContent, CardHeader, Collapse, Tooltip, Grid, Typography } from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import { SERVER_URL } from 'configs';
import { useDispatch, useSelector } from "react-redux";
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import { ToggleButton } from '@material-ui/lab';
import ActionBox from 'app/main/components/ActionBox';
import TabPro from 'app/main/components/TabPro';
import DisplayField from 'app/main/components/DisplayField';
import CommentPanel from '../EmplOrder/checking/EOCommentPanel';
import ListProAccordion from 'app/main/components/ListProAccordion';
import useListState from 'app/main/reducers/listState';
import TablePro from 'app/main/components/TablePro';
import CircularProgress from "@material-ui/core/CircularProgress";
import EvaluationInfo from './EvaluatorSuugstion/EvaluationInfo';



const CorrectByVerifSiniorManager = (props) => {
    const { formVariables, submitCallback = true } = props;
    const [formValuesDefineEvaluation, setFormValuesDefineEvaluation] = useState([])
    const [EvaluationMethodEnumId, setEvaluationMethodEnumId] = useState([])
    const [applicationType, setApplicationType] = useState([])
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [formValues, setFormValues] = useState([]);
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(false);
    const personnel = useListState("partyRelationshipId", [])
    const [applicationForm, setApplicationForm] = useState([])
    const [loading, setLoading] = useState(true);
    const [formValuesAppraisee, setFormValuesAppraisee] = useState([])
    const [dataBase, setDataBase] = useState({})
    const [waiting, setwaiting] = useState(false)
    const [waiting1, setwaiting1] = useState(false)
    const verificationList = formVariables.VerificationListOfSeniorManager?.value ?? []
    const index = 0

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
    const tableColsEvaluator = [
        { name: "fullName", type: "select", label: "نام ارزیاب", options: organizationUnit.employees, optionLabelField: "name", optionIdField: "partyRelationshipId", style: { width: "150px" }, required: true },
        // { name: "unit", type: "select", label: "واحد سازمانی", options: organizationUnit.units, optionLabelField: "organizationName", optionIdField: "partyId", style: { width: "150px" } },
        // { name: "position", type: "select", label: "پست سازمانی", options: organizationUnit.positions, optionLabelField: "description", optionIdField: "enumId", style: { width: "150px" } },
        { name: "applicationType", type: "select", label: "دسته بندی", options: applicationType, optionLabelField: "description", optionIdField: "enumId", style: { width: "150px" }, required: true, disabled: true },
        { name: "appraiserRate", type: "float", label: " ضریب اهمیت", style: { width: "80px" }, required: true },
        { name: "questionnaireId", label: "فرم مربوطه", type: "select", options: applicationForm, optionLabelField: "name", optionIdField: "questionnaireId", style: { width: "200px" }, required: true },

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
            name: "unitOrganization",
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
    const tabs = verificationList.map((v, i) => ({
        label: <DisplayField value={v.emplPositionId} options="EmplPosition" optionIdField="emplPositionId" />,
        panel: <CommentPanel data={v} formValues={formValues} setFormValues={setFormValues} />
    }))



    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluationMethod", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setEvaluationMethodEnumId(res.data.result)

        }).catch(err => {
        });

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

    }

    useEffect(() => {
        getEnum();
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
            .catch(() => {
                dispatch(
                    setAlertContent(
                        ALERT_TYPES.WARNING,
                        "مشکلی در دریافت اطلاعات رخ داده است."
                    )
                );
            });
    }

    useEffect(() => {
        let appraiseeList = []

        appraiseeList = formVariables.Appraisee.value
        // setAppraisee(appraiseeList)
        personnel.set(appraiseeList)
        setDataBase(prevState => ({ ...prevState, Appraisee: appraiseeList }))

    }, []);


    useEffect(() => {
        getEnum();
        getOrgInfo()
        setFormValuesDefineEvaluation(prevState => ({
            ...prevState,
            code: formVariables?.trackingCode?.value,
            evaluationPeriodTitle: formVariables?.EvaluationPeriod?.value.evaluationPeriodTitle,
            evaluationMethodEnumIdDis: formVariables?.EvaluationPeriod?.value.evaluationMethodEnumIdDis,
            fromDate: new Date(formVariables?.EvaluationPeriod?.value.fromDate).toLocaleDateString('fa-IR'),
            thruDate: new Date(formVariables?.EvaluationPeriod?.value.thruDate).toLocaleDateString('fa-IR'),
            description: formVariables?.EvaluationPeriod?.value.description,
        }))

    }, []);

    const goAccept = () => {
        setwaiting(true)
        personnel.set(dataBase?.Appraisee)
        if (personnel.list) {
            let goNext = 0
            personnel.list.map((item, index) => {
                if (item?.newEvalutor) {
                    item.newEvalutor.map((evaluator, j) => {

                        if (!evaluator.questionnaireId || !evaluator.fullName) {
                            goNext = goNext + 1
                        }

                    })
                } else if (item?.Evaluater) {
                    item.Evaluater.map((evaluator, j) => {

                        if (!evaluator.questionnaireId || !evaluator.fullName) {
                            goNext = goNext + 1
                        }

                    })
                }

            })
            if (goNext === 0) {
                let saveData = {
                    EvaluationPeriod: {
                        // evaluationPeriodTrackingCode: formVariables.trackingCode?.value,
                        evaluationPeriodTitle: formVariables.EvaluationPeriod?.value.evaluationPeriodTitle,
                        evaluationPeriodTypeEnumId: formVariables.EvaluationPeriod?.value.evaluationMethodEnumId,
                        fromDate: formVariables.EvaluationPeriod?.value.fromDate,
                        thruDate: formVariables.EvaluationPeriod?.value.thruDate,
                        description: formVariables.EvaluationPeriod?.value.description,
                        creatorPartyRelationshipId: formVariables.creatorPartyRelationshipId?.value,
                        // companyPartyId: companyPartyId,
                        evaluationPeriodStatusId: "EvPerApproved",

                    },
                    Appraisee: dataBase?.Appraisee,
                    ManagerConfirmVerificationLevel: formVariables?.VerificationListOfSeniorManager?.value,
                    ObjectionVerificationLevel: formVariables?.ObjectionVerificationLevel?.value,
                }

                const data = {
                    Appraisee: dataBase?.Appraisee,
                    resultMform: true,
                    saveData: saveData

                }
                submitCallback(data)
            } else if (goNext > 0) {
                setwaiting(false)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, ' به همه ارزیابی شوندگان با توجه به تعداد دسته بندی ها  ارزیاب اختصاص دهید !'));
            }

        }

    }

    const save = () => {
        setwaiting1(true)

        const data = {
            Appraisee: dataBase?.Appraisee,
            resultMform: false
        }
        submitCallback(data)
        setExpanded(false)

    }

    const submitSearch = () => {

        if (formValues.fullName !== undefined && formValues.fullName !== null) {
            personnel.set(dataBase?.Appraisee.filter(item => item.partyRelationshipId === formValues.fullName))
        }
        else if (formValues.fullName === undefined || formValues.fullName === null) {

            if ((formValues.position !== undefined && formValues.position !== null) && (formValues.unit !== undefined && formValues.unit !== null))
                personnel.set(dataBase.Appraisee.filter(item => item.unitOrganizationId === formValues.unit && item.emplPositionId === formValues.position))
            if ((formValues.position === undefined || formValues.position === null) && (formValues.unit !== undefined && formValues.unit !== null))
                personnel.set(dataBase.Appraisee.filter(item => item.unitOrganizationId === formValues.unit))
            if ((formValues.unitOrganizationId === undefined || formValues.unitOrganizationId === null) && (formValues.position !== undefined && formValues.position !== null))
                personnel.set(dataBase.Appraisee.filter(item => item.emplPositionId === formValues.position))
        }
    }

    const handleReset = () => {
        setFormValues([])
        setExpanded(false)
        personnel.set(dataBase?.Appraisee)

    }

    const handle_resolve = (rowData) => new Promise(resolve => resolve(rowData))
    const set_item_operations = (item) => (newOperations) => {
        if (item?.newEvalutor)
            item.newEvalutor = newOperations
        else
            item.Evaluater = newOperations
        personnel.update(item)
        setDataBase(prevState => ({ ...prevState, Appraisee: personnel.list }))

    }

    useEffect(() => {

        setFormValues(prevState => ({
            ...prevState,
            unit: organizationUnit.positions?.find(item => item?.emplPositionId === formValues["position"])?.unitPartyId,
        }))

    }, [formValues.position])
    return (

        <Box >

            <CardHeader title="تعیین ارزیاب" />
            <Card style={{ margin: 5 }}>
                <EvaluationInfo profileValues={formValuesDefineEvaluation} />
            </Card>

            <Card style={{ backgroundColor: "#ddd", padding: 0.5 }}>
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
                                <Box style={{
                                    width: '100%'
                                }}>
                                    <Card style={{ margin: 5, padding: 10 }}>
                                        <FormPro
                                            formValues={item}
                                            setFormValues={setFormValuesAppraisee}
                                            append={formStructureAppraisee}
                                        />
                                    </Card>
                                    <TablePro
                                        title={`لیست ارزیاب ها `}
                                        columns={tableColsEvaluator}
                                        rows={item?.newEvalutor ? item?.newEvalutor : item?.Evaluater}
                                        setRows={set_item_operations(item)}
                                        edit="inline"
                                        editCallback={handle_resolve}
                                        className="w-full"
                                        loading={loading}
                                    />
                                </Box>
                            )
                            }
                        />
                    </Box>
                </Card>
            </Card>
            <Grid item xs={12}>
                <Card variant="outlined" style={{ marginTop: 5 }}>
                    <TabPro orientation="vertical" tabs={tabs} initialValue={index} />
                </Card>
            </Grid>

            <Grid item xs={12} style={{ margin: 10 }}>
                <ActionBox>
                    <Button type="button" onClick={goAccept} role="primary" disabled={waiting1 ? waiting1 : waiting} endIcon={waiting ? <CircularProgress size={20} /> : null}>ارسال جهت تایید</Button>

                    {/* <Button type="button" onClick={save} role="secondary" disabled={waiting ? waiting : waiting1} endIcon={waiting1 ? <CircularProgress size={20} /> : null}>ثبت موقت</Button> */}

                </ActionBox>
            </Grid>
        </Box >
    );
};

export default CorrectByVerifSiniorManager;