import React, { useState, useEffect, createRef } from 'react';
import { Box, Button, CardContent, CardHeader, Collapse, Tooltip, Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import FormPro from 'app/main/components/formControls/FormPro';
import checkPermis from 'app/main/components/CheckPermision';
import { SERVER_URL } from 'configs';
import { ALERT_TYPES, getWorkEffotr, setAlertContent } from 'app/store/actions';
import { useHistory } from 'react-router-dom';
import AssessmentIcon from '@material-ui/icons/Assessment';


const formDefaultValues = {}

export default function EvaluationListForm(props) {
    const { partyRelationshipId, salaryGroup, partyId } = props

    const [tableContent, setTableContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [evaluationMethod, setEvaluationMethod] = useState([]);
    const [initialForm, setInitialForm] = useState({})
    const sendProfile = useSelector(({ fadak }) => fadak.workEffort);
    const [evaluationPeriodStatus, setEvaluationPeriodStatus] = useState([]);
    const datas = useSelector(({ fadak }) => fadak);
    const [formValues, setFormValues] = useState([])

    let history = useHistory();


    const tableCols = [{
        name: "evaluationPeriodTrackingCode",
        label: "کد رهگیری دوره ارزیابی ",
        type: "text",
    }, {
        name: "evaluationPeriodTitle",
        label: "عنوان ارزیابی",
        type: "text",
    }, {
        name: "evaluationPeriodTypeEnumId",
        label: "روش ارزیابی",
        type: "select",
        options: evaluationMethod,
        optionLabelField: "description",
        optionIdField: "enumId",
    }, {
        name: "fromDate",
        label: "تاریخ شروع",
        type: "date",
    }, {
        name: "thruDate",
        label: "تاریخ پایان",
        type: "date",
    }
        , {
        name: "evaluationPeriodStatusId",
        label: "وضعیت",
        options: evaluationPeriodStatus,
        optionLabelField: "description",
        optionIdField: "statusId",
        type: "select",
    }]
    const axiosKey = {
        headers: {
            api_key: localStorage.getItem("api_key"),
        },
    };

    const dispatch = useDispatch();

    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluationMethod", axiosKey
        ).then(res => {
            setEvaluationMethod(res.data.result)

        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusTypeId=EvaluationPeriodStatus", axiosKey
        ).then(res => {
            setEvaluationPeriodStatus(res.data.status)

        }).catch(err => {
        });

    }

    useEffect(() => {
        getEnum();

    }, []);
    const getEvaluationList = (filterParam) => {
        axios.get(SERVER_URL + "/rest/s1/evaluation/getFilteredEvaluationPeriod", {
            headers: axiosKey.headers,
            params: {
                evaluationPeriodTrackingCode: filterParam.evaluationPeriodTrackingCode ? filterParam.evaluationPeriodTrackingCode : "",
                evaluationPeriodTitle: filterParam.evaluationPeriodTitle ? filterParam.evaluationPeriodTitle : "",
                evaluationPeriodStatusId: filterParam.evaluationPeriodStatusId ? filterParam.evaluationPeriodStatusId : "",
                evaluationPeriodTypeEnumId: filterParam.evaluationPeriodTypeEnumId ? filterParam.evaluationPeriodTypeEnumId : "",
                fromDate: filterParam.fromDate ? filterParam.fromDate : "",
                thruDate: filterParam.thruDate ? filterParam.thruDate : "",
            }
        }).then(res => {
            setTableContent(res.data.list)
            setLoading(false)


        }).catch(err => {
        });

    }

    const submitFilter = () => {
        // setLoading(true)
        getEvaluationList(formValues)
    }

    useEffect(() => {
        getEvaluationList([]);
    }, [loading]);
    const handle_reset = () => {
        setFormValues([])
        getEvaluationList([]);

    }
    return (
        <Box p={2}>
            <Card>
                <TablePro
                    title="لیست دوره های ارزیابی"
                    columns={tableCols}
                    rows={tableContent}
                    loading={loading}

                    rowActions={checkPermis("reports/evaluationList/evaluationReport", datas) ? [


                        {
                            title: "گزارشات ",
                            icon: AssessmentIcon,
                            onClick: (row) => {
                                dispatch(getWorkEffotr(row))
                                history.push(`/EvaluationReport`);
                            }
                        }

                    ] : []}

                    filter="external"
                    exportCsv="لیست دوره های ارزیابی"
                    filterForm={
                        <SearchForm evaluationMethod={evaluationMethod}
                            evaluationPeriodStatus={evaluationPeriodStatus}
                            submitFilter={submitFilter}
                            formValues={formValues} setFormValues={setFormValues} handle_reset={handle_reset} />
                    }
                />
            </Card>
        </Box>
    )
}




function SearchForm(props) {
    const { evaluationMethod, evaluationPeriodStatus, submitFilter, formValues, setFormValues, handle_reset } = props
    const [formValidation, setFormValidation] = useState({});
    const formStructure = [{
        name: "evaluationPeriodTrackingCode",
        label: "کد رهگیری دوره ارزیابی ",
        type: "text",
        col: 4
    }, {
        name: "evaluationPeriodTitle",
        label: "عنوان ارزیابی",
        type: "text",
        col: 4

    }, {
        name: "evaluationPeriodTypeEnumId",
        label: "روش ارزیابی",
        type: "select",
        options: evaluationMethod,
        optionLabelField: "description",
        optionIdField: "enumId",
        col: 4

    }, {
        name: "fromDate",
        label: "تاریخ شروع",
        type: "date",
        col: 4

    }, {
        name: "thruDate",
        label: "تاریخ پایان",
        type: "date",
        col: 4

    }
        , {
        name: "evaluationPeriodStatusId",
        label: "وضعیت",
        type: "select",
        options: evaluationPeriodStatus,
        optionLabelField: "description",
        optionIdField: "statusId",
        col: 4

    }]



    return (
        <FormPro formValues={formValues} setFormValues={setFormValues} formDefaultValues={formDefaultValues}
            formValidation={formValidation} setFormValidation={setFormValidation}
            prepend={formStructure}
            actionBox={<ActionBox>

                {/* { checkPermis("feedingAutomation/foodReserveReport/filter", datas)? <Button type="submit" role="primary">جستجو</Button>:""} */}
                <Button type="submit" role="primary">جستجو</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
            submitCallback={submitFilter} resetCallback={handle_reset}
        />
    )
}