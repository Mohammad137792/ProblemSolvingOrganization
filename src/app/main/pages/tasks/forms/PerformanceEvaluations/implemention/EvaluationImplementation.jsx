import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardHeader, Collapse, Grid, Tooltip, CardContent, Typography } from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import { SERVER_URL } from 'configs';
import ActionBox from 'app/main/components/ActionBox';
import { ToggleButton } from '@material-ui/lab';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import { useDispatch } from 'react-redux';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import ListProAccordion from 'app/main/components/ListProAccordion';
import TablePro from 'app/main/components/TablePro';
import useListState from 'app/main/reducers/listState';
import CircularProgress from "@material-ui/core/CircularProgress";
import EvaluationInfo from '../EvaluatorSuugstion/EvaluationInfo';


const EvaluationImplementation = (props) => {
    const { formVariables, submitCallback = true } = props;
    const [formValuesDefineEvaluation, setFormValuesDefineEvaluation] = useState([])
    const [EvaluationMethodEnumId, setEvaluationMethodEnumId] = useState([])
    const [applicationType, setApplicationType] = useState([])
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [formValues, setFormValues] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [formValuesImplementation, setFormValuesImplementation] = useState([]);
    const [formValidation, setFormValidation] = useState([]);
    const personnel = useListState("partyRelationshipId", [])
    const [applicationForm, setApplicationForm] = useState([])
    const [waitingStart, setWaitingStart] = useState(false);
    const [todayServer, setTodayServer] = useState("");
    const [waitingSave, setWaitingSave] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formValuesAppraisee, setFormValuesAppraisee] = useState([])
    const evaluationList = [{ username: "shire1", Appraisee: { pseudoId: "123", fullName: "mm", organizationName: "bb", emplPosition: "dd" } }, { username: "fadak3", Appraisee: { pseudoId: "456", fullName: "hh", organizationName: "vv", emplPosition: "cc" } }]
    const dispatch = useDispatch()
    const myElement = createRef(0);

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
    function getNowDate() {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + "/rest/s1/evaluation/getNowDateTime", {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(res => {
                // resolve(res.data.nowDateTime)
                setTodayServer(res.data.nowDateTime)

            }).catch(err => {
                reject(err)
            });
        })
    }
    useEffect(() => {
        getNowDate()

    }, [])
console.log("todayServer.....",todayServer)
    const formStructureImplementation = [
        {
            name: "sendDate",
            label: "تاریخ ارسال فرم ارزیابی به ارزیاب ",
            type: "date",
            col: 6,
            required: true,
            minDate: todayServer,
        },
        {
            name: "deadLineDate",
            label: "مهلت تکمیل فرم ارزیابی توسط ارزیاب ",
            type: "date",
            col: 6,
            required: true,
            minDate: formValuesImplementation.sendDate,



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
        if (formVariables?.continue?.value === "false")
            setFormValuesImplementation(prevState => ({
                ...prevState,
                deadLineDate: formVariables?.deadLineDate?.value,
                sendDate: formVariables?.startEvaluationDate?.value,
            }))


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
    const moment = require('moment-jalaali')




    function getNowDateTime() {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + "/rest/s1/evaluation/getNowDateTime", {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(res => {
                resolve(res.data.nowDateTime)
            }).catch(err => {
                reject(err)
            });
        })
    }



    const startEvalution = () => {
        setWaitingStart(true)

        if (formValuesImplementation.deadLineDate === undefined || formValuesImplementation.deadLineDate === null || formValuesImplementation.sendDate === null || formValuesImplementation.sendDate === undefined) {

            myElement.current.click();
            setWaitingStart(false)


        }
        else {


            getNowDateTime().then(res => {
                let nowD = res.split(" ")[0]
                let nowT = res.split(" ")[1]

                // setFormValuesImplementation(prevState => ({
                //     ...prevState,
                //     sendDate: nowD
                // }))

                let startDate = formValuesImplementation.sendDate + "T" + nowT + "+03:30"
                let data = {
                    modifyData: {
                        evaluationPeriodTrackingCode: formVariables.trackingCode?.value

                    },
                    startEvaluationDate: startDate,

                    continue: "true",
                    deadLineDate: formValuesImplementation.deadLineDate + "T" + nowT + "+03:30",
                    deadLineDateM: formValuesImplementation.deadLineDate + " " + nowT,

                    evaluatorList: evaluationList
                }
                let fromDate = formValuesImplementation.sendDate + " " + nowT
                let thruDate = formValuesImplementation.deadLineDate + " " + nowT



                if (formValuesImplementation.deadLineDate <= formValuesImplementation.sendDate) {
                    setWaitingStart(false)
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'تاریخ شروع ارزیابی باید قبل از مهلت پاسخ باشد'));

                }

                else {

                    axios.post(SERVER_URL + "/rest/s1/evaluation/updateQuestionnarAppDate", { evaluationPeriodTrackingCode: formVariables.trackingCode.value, fromDate: fromDate, thruDate: thruDate }, axiosKey)
                        .then(() => {
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                            submitCallback(data)
                        }).catch(() => {
                            dispatch(setAlertContent(ALERT_TYPES.ERROR, '  خطا در ذخیره اطلاعات!'));
                        });
                }





            }).catch(err => {
                setWaitingStart(false)
            })
        }
    }

    const handle_submit = () => { }
    const saveEvalution = () => {
        setWaitingSave(true)

        if (formValuesImplementation.sendDate === undefined || formValuesImplementation.sendDate === null || formValuesImplementation.deadLineDate === undefined || formValuesImplementation.deadLineDate === null) {
            myElement.current.click();
            setWaitingSave(false)


        }
        else {
            getNowDateTime().then(res => {
                let nowD = res.split(" ")[0]
                let nowT = res.split(" ")[1]
                let data = {
                    modifyData: {
                        evaluationPeriodTrackingCode: formVariables.trackingCode?.value

                    },
                    startEvaluationDate: formValuesImplementation.sendDate + "T" + nowT + "+03:30",
                    continue: "false",
                    deadLineDate: formValuesImplementation.deadLineDate + "T" + nowT + "+03:30",
                    deadLineDateM: formValuesImplementation.deadLineDate + " " + nowT,

                }

                if (formValuesImplementation.deadLineDate <= formValuesImplementation.sendDate) {
                    setWaitingSave(false)
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'تاریخ شروع ارزیابی باید قبل از مهلت پاسخ باشد'));

                }
                if (formValuesImplementation.sendDate !== undefined && formValuesImplementation.sendDate !== undefined && formValuesImplementation.deadLineDate > formValuesImplementation.sendDate) {
                    submitCallback(data)

                }


            }).catch(err => { })
        }
    }
    return (

        <Box >

            <CardHeader title="اجرای دوره ارزیابی" />
            <Card style={{ margin: 5 }}>
                <EvaluationInfo profileValues={formValuesDefineEvaluation} />
            </Card>
            <Card style={{ padding: 5, margin: 5 }}>
                <CardHeader title=" اجرای ارزیابی" />
                <FormPro
                    formValues={formValuesImplementation}
                    setFormValues={setFormValuesImplementation}
                    append={formStructureImplementation}
                    formValidation={formValidation}
                    setFormValidation={setFormValidation}
                    actionBox={<ActionBox style={{ display: "none" }}>
                        <Button ref={myElement} type="submit" role="primary">ثبت</Button>
                    </ActionBox>}
                    submitCallback={handle_submit}
                />

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
                            // title="لیست ارزیابی شونده ها"
                            context={personnel}
                            renderAccordionSummary={(item) => <Typography>{`${item.pseudoId} ─ ${item.fullName}`}</Typography>}
                            renderAccordionDetails={(item) => (
                                <Box style={{ width: "100%", marginTop: 0 }}>
                                    <Card style={{ margin: 5, padding: 10 }}>
                                        <FormPro
                                            formValues={item}
                                            setFormValues={setFormValuesAppraisee}
                                            append={formStructureAppraisee}
                                        />
                                    </Card>
                                    <TablePro
                                        title={`لیست ارزیاب ها`}
                                        columns={tableColsEvaluator}
                                        rows={item?.newEvalutor ? item?.newEvalutor : item?.Evaluater}
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
            <Grid item xs={12} style={{ margin: 10 }}>
                <ActionBox>
                    <Button type="button" onClick={startEvalution} role="primary" disabled={waitingSave ? waitingSave : waitingStart} endIcon={waitingStart ? <CircularProgress size={20} /> : null}>ثبت دوره ارزیابی</Button>
                    {/* <Button type="button" role="secondary" onClick={saveEvalution} disabled={waitingStart ? waitingStart : waitingSave} endIcon={waitingSave ? <CircularProgress size={20} /> : null}>ثبت</Button> */}

                </ActionBox>
            </Grid>
        </Box>
    );
};

export default EvaluationImplementation;