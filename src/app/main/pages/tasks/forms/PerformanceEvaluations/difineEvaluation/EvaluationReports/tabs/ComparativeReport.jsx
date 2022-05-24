import React, { useState, useEffect } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button"
import { Accordion, AccordionDetails, AccordionSummary, CardContent, CardHeader, Grid } from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import { SERVER_URL } from 'configs';
import ActionBox from "app/main/components/ActionBox";
import { useDispatch } from "react-redux";
import TransferList from "app/main/components/TransferList";
import { setAlertContent, ALERT_TYPES } from "app/store/actions";
import Chart from 'react-apexcharts';
import useListState from "app/main/reducers/listState";
import EvaluationParticipants from './EvaluationParticipants'


const ComparativeReport = (props) => {
    const { evaluationPeriodTrackingCode, formVariables } = props
    const [partyRelationshipIds, setPartyRelationshipIds] = useState([]);
    const [formValues, setFormValues] = useState({});
    const [reportFormValues, setReportFormValues] = useState({});
    const [expand, setExpand] = useState(false);
    const [evaluationForm, setEvaluationForm] = useState([]);
    const [chartData, setChartData] = useState({});
    const dispatch = useDispatch();
    const [participants, setParticipants] = useState([]);
    const [loadedPersonnel, setLoadedPersonnel] = useState([]);
    const participantsSetter = useListState("partyRelationshipId")
    const personnel = useListState("partyRelationshipId")

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const load_personnel = (filter = {}, old = []) => {
        axios.get((SERVER_URL + "/rest/s1/evaluation/evaluationDetails?evaluationPeriodTrackingCode=") + evaluationPeriodTrackingCode, axiosKey).then(res => {
            let data = res.data.data.Appraisee.filter(function (el) {
                return !old.find(x => x.partyRelationshipId == el.partyRelationshipId);
            })
            personnel.set(data)
            setLoadedPersonnel(data)
        }).catch(() => {
            personnel.set([])
        });
    }




    const display_org_info = (item) => {
        let info = []
        if (item.emplPosition) info.push(item.emplPosition)
        if (item.unitOrganization) info.push(item.unitOrganization)
        if (item.organizationName) info.push(item.organizationName)
        return info.join("، ") || "─"
    }
    const display_name = (item) => `${item.pseudoId} ─ ${item.firstName || '-'} ${item.lastName || '-'} ${item.suffix || ''}`
    const formStructure = [
        {
            label: " فرم ارزیابی",
            name: "evaluationForm",
            options: evaluationForm,
            optionLabelField: "title",
            optionIdField: "questionnaireId",
            type: "select",
            col: 3
        },
        // {
        //     label: " معیار ",
        //     name: "items",
        //     // options: suggestionScope,
        //     // optionLabelField: "description",
        //     // optionIdField: "enumId",
        //     type: "select",
        //     col: 3
        // }, 
        {
            label: "  کلمه کلیدی ",
            name: "keyWord",
            type: "component",
            component:
                <div style={{ padding: 0, width: "100%" }}>
                    <CardHeader title="انتخاب ارزیابی شوندگان" />
                    <EvaluationParticipants personnel={personnel} evaluationPeriodTrackingCode={evaluationPeriodTrackingCode} participants={participantsSetter} participantss={participants} setParticipants={setParticipants} partyRelationshipIds={partyRelationshipIds} setPartyRelationshipIds={setPartyRelationshipIds} />
                </div>,
            col: 12

        }
    ]

    const reportFormStructure = [
        {
            label: "تعداد مخاطبین",
            name: "number",
            type: "text",
            readOnly: true,
            col: 12
        },
        {
            label: "تعداد فرم های تکمیل شده",
            name: "formCount",
            type: "text",
            readOnly: true,
            col: 12
        },
        {
            label: "میانگین امتیازات",
            name: "avgScore",
            type: "text",
            readOnly: true,
            col: 12
        },
        {
            label: "بیشترین امتیاز",
            name: "maxScore",
            readOnly: true,
            type: "text",
            col: 12
        },
        {
            label: "کمترین امتیاز",
            name: "minScore",
            readOnly: true,
            type: "text",
            col: 12
        }
    ]


    useEffect(() => {
        axios.get((SERVER_URL + "/rest/s1/evaluation/evaluationDetailsByForms?evaluationPeriodTrackingCode=") + evaluationPeriodTrackingCode,
            axiosKey)
            .then((res) => {
                setEvaluationForm(res.data.data)
            })
            .catch(() => {
            });
            setParticipants([])
    }, [])

    useEffect(() => {
        setLoadedPersonnel(personnel.list)
        console.log("adasxc", loadedPersonnel)
        if(formValues.evaluationForm != undefined && formValues.evaluationForm != null){
            let evalForm = evaluationForm.find(itm=> itm.questionnaireId == formValues.evaluationForm)
            let appIds = []
            if(evalForm != null){ 
                for(var p in evalForm.participants){
                    appIds.push(evalForm.participants[p].appraiseeId)
                }
            }
            personnel.set(
                loadedPersonnel?.filter(itm=> appIds.includes(itm.appraiseeId))
            )
        }
        else{
            load_personnel()
            participantsSetter.set([])
            setParticipants([])
        }
    }, [formValues.evaluationForm])

    const submitReport = () => {

        if (participants.length > 0) {
            const packet = {

                evaluationPeriodTrackingCode: evaluationPeriodTrackingCode, questionnaireId: formValues.evaluationForm ? formValues.evaluationForm : "", appraiseeList: participants
            }
            axios.post(SERVER_URL + "/rest/s1/evaluation/computeScores", packet, {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then((res) => {

                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                setChartData(res.data.result)
                res.data.result.number = participants?.length
                setReportFormValues(res.data.result)
                setExpand(true)


            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
            });
        }
        else {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'هیچ ارزیابی شونده ای برای ایجاد گزارش انتخاب نشده است!'));
        }
    }

    return (
        <Box >
            <Card style={{ marginTop: "0.5%", padding: "2%" }}>
                <div style={{ marginTop: "0.5%", padding: "2%" }}>
                    <FormPro
                        append={formStructure}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        submitCallback={submitReport}
                        actionBox={
                            <ActionBox>
                                <Button type="submit" role="primary">{"ایجاد گزارش"}</Button>
                            </ActionBox>}
                    />
                </div>

                {expand ?
                    <div style={{ padding: "2%" }}>
                        <Grid container spacing={2}>
                            <Grid xs={3}>
                                <Card style={{ marginTop: "0.5%" }}>
                                    <FormPro
                                        append={reportFormStructure}
                                        formValues={reportFormValues}
                                        setFormValues={setReportFormValues}
                                        style={{ padding: "10%" }}
                                    />
                                </Card>
                            </Grid>

                            <Grid xs={9}>
                                <Card style={{ marginTop: "1%" }}>
                                    <Chart options={{
                                        plotOptions: {
                                            bar: {
                                                horizontal: true,
                                                borderRadius: 4,
                                                dataLabels: {
                                                    position: 'top',
                                                },
                                            }
                                        },
                                        xaxis: {
                                            categories: chartData?.lable,
                                        },
                                        yaxis: {
                                            labels: {
                                                align: 'center',
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            offsetX: -6,
                                            style: {
                                                fontSize: '12px',
                                                colors: ['#fff']
                                            }
                                        },
                                        stroke: {
                                            show: true,
                                            width: 1,
                                            colors: ['#fff']
                                        },
                                        tooltip: {
                                            enabled: false,
                                            shared: true,
                                            intersect: false
                                        },
                                    }} series={chartData.data} type="bar" />

                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                    : []}

            </Card>
        </Box>
    );
};

export default ComparativeReport;