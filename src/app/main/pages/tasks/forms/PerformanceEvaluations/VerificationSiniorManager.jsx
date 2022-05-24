import React, { useState, useEffect } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardHeader, Collapse, Grid, Tooltip, CardContent } from "@material-ui/core";
import TabPro from 'app/main/components/TabPro';
import FormPro from 'app/main/components/formControls/FormPro';
import { SERVER_URL } from 'configs';
import ActionBox from 'app/main/components/ActionBox';
import DisplayField from 'app/main/components/DisplayField';
import CommentPanel from '../EmplOrder/checking/EOCommentPanel';
import { ToggleButton } from '@material-ui/lab';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import ListProAccordion from 'app/main/components/ListProAccordion';
import Typography from "@material-ui/core/Typography";
import TablePro from 'app/main/components/TablePro';
import useListState from 'app/main/reducers/listState';
import { useSelector } from 'react-redux';
import CircularProgress from "@material-ui/core/CircularProgress";
import EvaluationInfo from './EvaluatorSuugstion/EvaluationInfo';




const VerificationSiniorManager = (props) => {
    const { formVariables, submitCallback = true } = props;
    const [formValuesDefineEvaluation, setFormValuesDefineEvaluation] = useState([])
    const [tableContentEvaluator, setTableContentEvaluator] = useState([])
    const [EvaluationMethodEnumId, setEvaluationMethodEnumId] = useState([])
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [formValuesSearch, setFormValuesSearch] = useState([]);
    const [formValues, setFormValues] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const personnel = useListState("partyRelationshipId", [])
    const [applicationType, setApplicationType] = useState([])
    const [applicationForm, setApplicationForm] = useState([])
    const [loading, setLoading] = useState(true);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const [personInfo, setPersonInfo] = useState([]);
    const verificationList = formVariables.VerificationListOfSeniorManager?.value ?? []
    const [waitingA, setWaitingA] = useState(false);
    const [waitingM, setWaitingM] = useState(false);
    const [waitingR, setWaitingR] = useState(false);
    // const index = verificationList.findIndex(i => i.active === true)
    const index = verificationList.findIndex(i => i.sequence === formVariables.verify.value.sequence)

    const tabs = verificationList.map((v, i) => ({
        label: <DisplayField value={v.emplPositionId} options="EmplPosition" optionIdField="emplPositionId" />,
        panel: <CommentPanel data={v} formValues={formValues} setFormValues={setFormValues} currentUser={i === index} setSignData={setSignData} />
    }))
    const [signData, setSignData] = useState(null);
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [
        { name: "unit", type: "select", label: "واحد سازمانی", options: organizationUnit.units, optionLabelField: "unitOrganizationName", optionIdField: "unitPartyId", col: 4, },
        {
            name: "position", type: "select", label: "پست سازمانی", options: organizationUnit.positions, optionLabelField: "description", optionIdField: "emplPositionId", col: 4,
            filterOptions: options => formValuesSearch["unit"] ? options.filter((o) => {
                let list = organizationUnit.units.find(x => x.unitPartyId == formValuesSearch["unit"])
                return list.emplPosition.indexOf(o["emplPositionId"]) >= 0
            }) :
                options,
        },
        {
            name: "fullName", type: "select", label: "نام ارزیابی شونده", options: organizationUnit.employees, optionLabelField: "name", optionIdField: "partyRelationshipId", col: 4,
            filterOptions: options =>
                formValuesSearch["position"] ? options.filter((o) => {
                    let list = organizationUnit.positions.find(x => x.emplPositionId == formValuesSearch["position"])
                    return list.person.indexOf(o["fromPartyId"]) >= 0
                }) :
                    formValuesSearch["unit"] ? options.filter((o) => {
                        let list = organizationUnit.units.find(x => x.unitPartyId == formValuesSearch["unit"])
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

    useEffect(() => {
        let data = {
            partyId: "",
        }
        axios.post(SERVER_URL + "/rest/s1/fadak/personLoginInfo", { data: data }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setPersonInfo(res.data.result)
        }).catch(err => { });
    }, []);

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
    }, []);

    useEffect(() => {
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
            .catch(() => {
            });
    }

    useEffect(() => {
        getEnum();
        getOrgInfo()

    }, []);

    const handleModify = () => {
        setWaitingM(true)
        verificationList[index].active = false
        verificationList[0].active = true
        let moment = require('moment-jalaali')
        let nextVerificationList = verificationList;
        let commentText = formValues.comment ? formValues.comment : ""
        nextVerificationList[index] = Object.assign({}, nextVerificationList[index], {
            comment: " " + "توضیحات" + " " + personInfo[0].name + ": " + commentText,
            personInfo: personInfo,
            verificationDate: moment().format("Y-MM-DD"),

        })

        const packet = {
            VerificationListOfSeniorManager: nextVerificationList,
            NewAppraisee: formVariables.Appraisee.value,
            result: "modify",
            resultB: false
        }
        submitCallback(packet)
    }
    const handleAccept = () => {
        setFormValues([])
        setExpanded(false)
        personnel.set(formVariables.Appraisee.value)
        setWaitingA(true)
        verificationList[index].active = false
        if (verificationList[index + 1])
            verificationList[index + 1].active = true

        let moment = require('moment-jalaali')
        let commentText = formValues.comment ? formValues.comment : ""
        let nextVerificationList = verificationList;
        nextVerificationList[index] = Object.assign({}, nextVerificationList[index], {
            comment: " " + "توضیحات" + " " + personInfo[0]?.name + ": " + commentText,
            personInfo: personInfo,
            verificationDate: moment().format("Y-MM-DD"),
            status: "تایید شده"
        })



        let saveData = {
            EvaluationPeriod: {
                // evaluationPeriodTrackingCode: formVariables.trackingCode?.value,
                evaluationPeriodTitle: formVariables.EvaluationPeriod?.value.evaluationPeriodTitle,
                evaluationPeriodTypeEnumId: formVariables.EvaluationPeriod?.value.evaluationMethodEnumId,
                fromDate: formVariables.EvaluationPeriod?.value.fromDate,
                thruDate: formVariables.EvaluationPeriod?.value.thruDate,
                description: formVariables.EvaluationPeriod?.value.description,
                creatorPartyRelationshipId: formVariables.creatorPartyRelationshipId?.value,
                responsibleExpertEmplPositionId: formVariables.responsibleExpertEmplPositionId?.value,
                // companyPartyId: companyPartyId,
                evaluationPeriodStatusId: "EvPerApproved",
            },
            Appraisee: formVariables.Appraisee.value,
            ManagerConfirmVerificationLevel: formVariables.VerificationListOfSeniorManager.value,
            ObjectionVerificationLevel: formVariables.ObjectionVerificationLevel.value
        }
        const packet = {
            VerificationListOfSeniorManager: nextVerificationList,
            NewAppraisee: formVariables.Appraisee.value,
            resultB: true,
            saveData: saveData,
            modifyData: {
                evaluationPeriodTrackingCode: formVariables.trackingCode?.value

            },
        }
        if(personInfo[0])
        submitCallback(packet)

    }

    const handleReject = () => {
        setWaitingR(true)
        let moment = require('moment-jalaali')
        let nextVerificationList = verificationList;
        nextVerificationList[index] = Object.assign({}, nextVerificationList[index], {
            comment: formValues.comment,
            verificationDate: moment().format("Y-MM-DD"),
            status: "رد شده"

        })
        const packet = {
            VerificationListOfSeniorManager: nextVerificationList,
            NewAppraisee: formVariables.Appraisee.value,
            result: "reject",
            resultB: false

        }
        submitCallback(packet)

    }




    const submitSearch = () => {

        if (formValuesSearch.fullName !== undefined && formValuesSearch.fullName !== null) {
            personnel.set(formVariables.Appraisee.value.filter(item => item.partyRelationshipId === formValuesSearch.fullName))
        }
        else if (formValuesSearch.fullName === undefined || formValuesSearch.fullName === null) {

            if ((formValuesSearch.position !== undefined && formValuesSearch.position !== null) && (formValuesSearch.unit !== undefined && formValuesSearch.unit !== null))
                personnel.set(formVariables.Appraisee.value.filter(item => item.unitOrganizationId === formValuesSearch.unit && item.emplPositionId === formValuesSearch.position))
            if ((formValuesSearch.position === undefined || formValuesSearch.position === null) && (formValuesSearch.unit !== undefined && formValuesSearch.unit !== null))
                personnel.set(formVariables.Appraisee.value.filter(item => item.unitOrganizationId === formValuesSearch.unit))
            if ((formValuesSearch.unitOrganizationId === undefined || formValuesSearch.unitOrganizationId === null) && (formValuesSearch.position !== undefined && formValuesSearch.position !== null))
                personnel.set(formVariables.Appraisee.value.filter(item => item.emplPositionId === formValuesSearch.position))
        }
    }
    const handleReset = () => {
        setFormValuesSearch([])
        setExpanded(false)
        personnel.set(formVariables.Appraisee.value)


    }

    useEffect(() => {

        setFormValuesSearch(prevState => ({
            ...prevState,
            unit: organizationUnit.positions?.find(item => item?.emplPositionId === formValuesSearch["position"])?.unitPartyId,
        }))

    }, [formValuesSearch.position])


    return (

        <Box >
            <CardHeader title="تایید دوره ارزیابی " />
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
                                        formValues={formValuesSearch}
                                        setFormValues={setFormValuesSearch}
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
            <Grid item xs={12}>
                <Card variant="outlined" style={{ marginTop: 5 }}>
                    <TabPro orientation="vertical" tabs={tabs} initialValue={index} />
                </Card>
            </Grid>

            <Grid item xs={12} style={{ margin: 5 }}>
                <ActionBox>
                    <Button type="button" onClick={handleAccept} role="primary" disabled={waitingR ? waitingR : waitingM ? waitingM : waitingA} endIcon={waitingA ? <CircularProgress size={20} /> : null}>تایید</Button>
                    {verificationList[index]?.modify === 'Y' &&
                        <Button type="button" onClick={handleModify} role="secondary" disabled={waitingA ? waitingA : waitingR ? waitingR : waitingM} endIcon={waitingM ? <CircularProgress size={20} /> : null}>اصلاح</Button>
                    }
                    {verificationList[index]?.reject === 'Y' &&
                        <Button type="button" onClick={handleReject} role="secondary" disabled={waitingA ? waitingA : waitingM ? waitingM : waitingR} endIcon={waitingR ? <CircularProgress size={20} /> : null}>رد</Button>
                    }
                </ActionBox>
            </Grid>
        </Box>
    );
};

export default VerificationSiniorManager;