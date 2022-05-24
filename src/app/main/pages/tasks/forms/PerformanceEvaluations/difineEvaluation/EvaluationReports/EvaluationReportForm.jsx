import { Box, Button, Card, CardHeader } from '@material-ui/core';
import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import FormPro from 'app/main/components/formControls/FormPro';
import TabPro from 'app/main/components/TabPro';
import { SERVER_URL } from 'configs';
import GeneralReport from './tabs/GeneralReport';
import ComparativeReport from './tabs/ComparativeReport'
import CompletedForms from './tabs/CompletedForms';
import CompletementDocumentation from './tabs/CompletementDocumentation'
import { useSelector } from 'react-redux';
import checkPermis from 'app/main/components/CheckPermision';
import EvaluationInfo from '../../EvaluatorSuugstion/EvaluationInfo';


const EvaluationReportForm = (props) => {
    const { formVariables, submitCallback } = props
    const gertTragingCode = useSelector(({ fadak }) => fadak.workEffort);
    const evaluationPeriodTrackingCode =formVariables?.trackingCode?.value ? formVariables?.trackingCode?.value : gertTragingCode?.evaluationPeriodTrackingCode ? gertTragingCode?.evaluationPeriodTrackingCode  : ""
    const [formValues, setFormValues] = useState([])
    const [loading, setLoading] = useState(true)
    const [evaluationPeriodType, setEvaluationPeriodType] = useState([])
    const [isTestType, setIsTestType] = useState(false)
    const datas = useSelector(({ fadak }) => fadak);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    console.log("vvvvvvvvv", evaluationPeriodType)

    const formStructure = [
        {
            label: "   کد دوره ارزیابی",
            name: "evaluationPeriodTrackingCode",
            type: "text",
            readOnly: true,
            col: 4
        },
        {
            label: "   عنوان دوره ارزیابی",
            name: "evaluationPeriodTitle",
            type: "text",
            readOnly: true,
            col: 4
        },
        {
            label: "   روش ارزیابی",
            name: "evaluationPeriodTypeEnumId",
            type: "select",
            options: evaluationPeriodType,
            optionLabelField: "description",
            optionIdField: "enumId",
            readOnly: true,
            col: 4
        },
        {
            label: "   تاریخ شروع ارزیابی",
            name: "fromDate",
            type: "date",
            readOnly: true,
            col: 4
        },
        {
            label: "   تاریخ پایان ارزیابی",
            name: "thruDate",
            type: "date",
            readOnly: true,
            col: 4
        },
        {
            label: "   توضیحات",
            name: "description",
            type: "textarea",
            readOnly: true,
            col: 4
        }

    ]
    const endTask = () => {
        submitCallback({})
    }
    const tabs = [
        ...(
            checkPermis("reports/evaluationList/evaluationReport/generalReport", datas) ? [{
                label: "   گزارش جامع",
                panel:
                    <Box>
                        <GeneralReport
                            evaluationPeriodTrackingCode={evaluationPeriodTrackingCode}
                            isTestType={isTestType}
                            setIsTestType={setIsTestType}
                        />
                    </Box>
            }] : []
        )
        ,
        ...(
            checkPermis("reports/evaluationList/evaluationReport/comparativeReport", datas) ? [{
                label: "       گزارش مقایسه ای",
                panel:
                    <Box>
                        <ComparativeReport
                            formVariables={formVariables}
                            evaluationPeriodTrackingCode={evaluationPeriodTrackingCode}
                        />
                    </Box>
            }] : []
        ),
        ...(
            checkPermis("reports/evaluationList/evaluationReport/completedForms", datas) ? [{
                label: "     فرم‌های تکمیل شده",
                panel: <CompletedForms
                    evaluationPeriodTrackingCode={evaluationPeriodTrackingCode}
                />
            }] : []
        ),
        ...(
            checkPermis("reports/evaluationList/evaluationReport/completementDocumentation", datas) ? [{
                label: "       مستندات تکمیلی",
                panel: <CompletementDocumentation
                    endTask={endTask}
                    evaluationPeriodTrackingCode={evaluationPeriodTrackingCode}
                />
            }] : []
        )
    ]
    const tabs1 = [
        {
            label: "   گزارش جامع",
            panel:
                <Box>
                    <GeneralReport
                        evaluationPeriodTrackingCode={evaluationPeriodTrackingCode}
                        isTestType={isTestType}
                        setIsTestType={setIsTestType}
                    />
                </Box>
        }
        ,
        {
            label: "       گزارش مقایسه ای",
            panel:
                <Box>
                    <ComparativeReport
                        formVariables={formVariables}
                        evaluationPeriodTrackingCode={evaluationPeriodTrackingCode}
                    />
                </Box>
        },
        {
            label: "     فرم‌های تکمیل شده",
            panel: <CompletedForms
                evaluationPeriodTrackingCode={evaluationPeriodTrackingCode}
            />
        }
        , {
            label: "       مستندات تکمیلی",
            panel: <CompletementDocumentation
                endTask={endTask}
                evaluationPeriodTrackingCode={evaluationPeriodTrackingCode}
            />
        }
    ]
    const Accept = () => {
        endTask()

    }


    const getEvaluationInfo = () => {
        if (evaluationPeriodTrackingCode) {
            axios
                .get(
                    (SERVER_URL + "/rest/s1/evaluation/evaluationInfo?evaluationPeriodTrackingCode=") + evaluationPeriodTrackingCode,
                    axiosKey
                )
                .then((res) => {
                    axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluationMethod", {
                        headers: { 'api_key': localStorage.getItem('api_key') }
                    }).then(response => {
                        setEvaluationPeriodType(res.data.result)
                        setFormValues(prevState => ({
                            code: res.data.data.EvaluationPeriod.evaluationPeriodTrackingCode,
                            evaluationPeriodTitle: res.data.data.EvaluationPeriod.evaluationPeriodTitle,
                            evaluationMethodEnumIdDis: response.data.result.filter(item => item.enumId === res.data.data.EvaluationPeriod.evaluationPeriodTypeEnumId)[0].description,
                            fromDate: new Date(res.data.data.EvaluationPeriod.fromDate).toLocaleDateString('fa-IR'),
                            thruDate: new Date(res.data.data.EvaluationPeriod.thruDate).toLocaleDateString('fa-IR'),
                            description: res.data.data.EvaluationPeriod.description,
                        }))
                        if (res.data.data.EvaluationPeriod?.evaluationPeriodTypeEnumId === "EMTest") {
                            setIsTestType(true)
                        }
                    }).catch(err => {
                    });

                    setLoading(false)
                })
                .catch(() => {
                });
        }
    }

    useEffect(() => {

        getEvaluationInfo()
    }, [evaluationPeriodTrackingCode])

    return (
        <Box>
            <Card style={{ backgroundColor: "#dddd", height: "97%", padding: "0.5%" }}>
                <Card style={{ padding: 1 }}>
                    <Card >
                        <CardHeader title={"گزارش دوره ارزیابی"} />
                        {/* <FormPro
                            append={formStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            loading={loading}
                        /> */}
                        <EvaluationInfo profileValues={formValues} />

                    </Card>
                </Card>

                <Card style={{ height: "97%", padding: "0.5%", "margin-top": "1%" }}>
                    <TabPro tabs={formVariables?.trackingCode?.value ? tabs1 : tabs} />
                </Card>
                < Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", width: "100%" }
                }>

                    {formVariables?.trackingCode?.value ? <Button type="button" role="primary" onClick={Accept} style={{ width: 123, height: 36, backgroundColor: "#039be5", color: 'white' }} variant="contained" className="ml-10  mt-5">
                        تایید
                    </Button> : ""}

                </Box >

            </Card>
        </Box>
    )
}


export default EvaluationReportForm;