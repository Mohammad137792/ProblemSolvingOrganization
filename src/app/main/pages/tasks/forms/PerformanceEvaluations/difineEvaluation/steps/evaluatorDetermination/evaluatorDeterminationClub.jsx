import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardContent, CardHeader, Grid } from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from 'app/main/components/ActionBox';
import Tooltip from "@material-ui/core/Tooltip";

import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from 'configs';
import { setAlertContent, ALERT_TYPES } from 'app/store/actions';
import ConfirmDialog, { useDialogReducer } from 'app/main/components/ConfirmDialog';
import TabPro from 'app/main/components/TabPro';
import TablePro from 'app/main/components/TablePro';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";



const DefineEvaluationTimeForm = () => {

    const [formValidation, setFormValidation] = useState({});
    const [formValues, setFormValues] = useState([]);
    const [tableContent, setTableContent] = React.useState([]);
    const [evaluatingTableContent, setEvaluatingTableContent] = React.useState([]);
    const [fieldInfo, setFieldInfo] = useState({ evaluationMethodEnumId: [], centerEvaluatorRelationshipId: [], evaluatingPersonsInfo: [], positionInfo: [], companyPartyId: "", unitInfo: [] });
    const [verificationId, setVerificationId] = useState({ evaluatorSelectionVerification: "", resultObjectionVerification: "" });
    const [edit, setEdit] = React.useState(false);
    const [selectionStatus, setSelectionStatus,] = React.useState("");
    const [submitClicked, setSubmitClicked] = useState(0);
    const [cancelClicked, setCancelClicked] = useState(0);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [evaluatingLoading, setEvaluatingLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [processDefinitionId, setProcessDefinitionId] = React.useState('');
    const [verificationList, setVerificationList] = useState([]);
    const [resetDefinitionTable, setResetDefinitionTable] = useState(false);
    const [display, setdisplay] = useState(false);
    const [closeDialog, setcloseDialog] = useState(false);
    const [formValuesVerification, setFormValuesVerification] = useState([]);

    const [tableContentVerification, setTableContentVerification] = React.useState([]);
    const [loadingVerificatin, setLoadingVerificatin] = useState(false);
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [levelId, setLevelId] = useState([]);
    const [buttonName, setButtonName] = useState("افزودن");

    


    const submitRef = createRef(0);
    const cancelRef = createRef(0);
    const dispatch = useDispatch();
    const conformDialog = useDialogReducer(handle_nextStep)
    const [state, setState] = React.useState('Default');
    const [evaluationPeriodId, setEvaluationPeriodId] = useState('');



    const [unitNme, setUnitName] = useState([]);
    const [emplPositionId, setEmplPositionIds] = useState([]);
    const [roleTypeId, setRoleTypeId] = useState([]);
    const [employee, setEmployee] = useState([])
    const [lodinggEvaluted, setlodinggEvaluted] = useState(false);

    //////////////camunda config start////////    
    function formatVariables(varObject) {
        let variables = {};
        Object.keys(varObject).map(key => {
            variables[key] = { value: varObject[key] }
        });
        return variables
    }

    function startProcess(processDefinitionId) {
        return new Promise((resolve, reject) => {
            const packet = {
                processDefinitionId: processDefinitionId
            }
            axios.post(SERVER_URL + "/rest/s1/fadak/process/start", packet, {
                headers: { 'api_key': localStorage.getItem('api_key') },
                params: { basicToken: localStorage.getItem('Authorization') }
            }).then((res) => {
                resolve(res.data.id)
            }).catch(() => {
                reject()
            });
        })
    }

    function getTask(id) {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + "/rest/s1/fadak/process/task", {
                headers: { 'api_key': localStorage.getItem('api_key') },
                params: {
                    filterId: "7bbba147-5313-11eb-80ec-0050569142e7",
                    firstResult: 0,
                    maxResults: 15,
                    processInstanceId: id
                },
            }).then(res => {
                resolve(res.data._embedded.task[0].id)
            }).catch(err => {
                reject(err)
            });
        })
    }

    function submitTask(formData, taskId) {
        return new Promise((resolve, reject) => {
            let variables = formatVariables(formData);
            const packet = {
                taskId: taskId,
                variables: variables
            }
            axios.post(SERVER_URL + "/rest/s1/fadak/process/form", packet, {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
        })
    }


    const submitCallback = (formData) => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
        startProcess(processDefinitionId).then(processId =>
            getTask(processId).then(taskId =>
                submitTask(formData, taskId).then(() => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                    setState("StartAnother")
                }))).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
                })
    }


    React.useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/fadak/process/list", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setProcessDefinitionId(res.data.outList.find(i => i.key === "Evaluation").id)
        }).catch(() => {
        });
    }, [])

    //////////////camunda config end////////




    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [
        {
            name: "code",
            label: "کد دوره ارزیابی",
            type: "text",
            col: 4
        }, {
            name: "name",
            label: " عنوان دوره ارزیابی",
            type: "text",
            col: 4
        }, {
            name: "evaluationMethodEnumId",
            label: "روش ارزیابی",
            type: "select",
            options: fieldInfo.evaluationMethodEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 4
        }, {
            name: "startDate",
            label: "تاریخ شروع ارزیابی",
            type: "date",
            col: 4
        }, {
            name: "thruDate",
            label: "تاریخ پایان ارزیابی",
            type: "date",
            col: 4
        }]

    const FormComplexPartyStructure = [
        {
            name: "company",
            label: "شرکت",
            type: "select",
            options: organizationUnit.subOrgans,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            required: true,
            col: 4,
        },
        {
            name: "organizationUnit",
            label: "واحد سازمانی",
            type: "multiselect",
            options: organizationUnit.units,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            col: 4,
            filterOptions: (options) =>
                formValues["company"]
                    ? options.filter((o) => o["parentOrgId"] == formValues["company"])
                    : options,
        },
        {
            name: "role",
            label: "نقش سازمانی",
            type: "multiselect",
            options: organizationUnit.roles,
            optionLabelField: "description",
            optionIdField: "roleTypeId",
            col: 4,

        },
        {
            name: "position",
            label: "پست سازمانی",
            type: "multiselect",
            options: organizationUnit.positions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            col: 4,
            filterOptions: (options) =>
                formValues["role"] && eval(formValues["role"]).length > 0
                    ? options.filter(
                        (item) => item["roleTypeId"] == formValues["role"]
                    )
                    : formValues["organizationUnit"] &&
                        eval(formValues["organizationUnit"]).length > 0
                        ? options.filter(
                            (item) =>
                                formValues["organizationUnit"].indexOf(
                                    item.organizationPartyId
                                ) >= 0
                        )
                        : formValues["company"] && formValues["company"] != ""
                            ? options.filter((o) => o["parentOrgId"] == formValues["company"])
                            : options,
        },
        {
            name: "personnel",
            label: " ارزیابی شوندگان",
            type: "multiselect",
            options: organizationUnit.employees
                ? organizationUnit.employees.filter((a) => a.name)
                : [],
            optionLabelField: "name",
            optionIdField: "partyId",
            required: true,


            // options: personnel ? personnel.filter((a) => a.name) : [],
            // long: true,
            // urlLong : "/rest/s1/fadak/long",
            // changeCallback: (newOption) => {
            //   setPersonnel([newOption]);
            // },
            col: 4,
            filterOptions: (options) =>
                formValues["position"] && eval(formValues["position"]).length > 0
                    ? options.filter((item) =>
                        item.emplPositionIds.some(
                            (r) => formValues["position"].indexOf(r) >= 0
                        )
                    )
                    : formValues["organizationUnit"] &&
                        eval(formValues["organizationUnit"]).length > 0
                        ? options.filter((item) =>
                            item.unitPartyId.some(
                                (r) => formValues["organizationUnit"].indexOf(r) >= 0
                            )
                        )
                        : formValues["company"] && formValues["company"] != ""
                            ? options.filter((item) =>
                                item.subOrgPartyId.some(
                                    (org) => formValues["company"].indexOf(org) >= 0
                                )
                            )
                            : options,
        },
    ];

    const evaluatingTableCols = [
        {
            name: "name",
            label: " نام و نام خانوادگی ",
            type: "text",
            style: { minWidth: "130px" },
        },
        {
            name: "unitName",
            label: "واحد سازمانی ",
            type: "text",
            style: { minWidth: "130px" },
        },
        {
            name: "EmplPositionName",
            label: "پست سازمانی ",

            style: { minWidth: "130px" },
        },
        // {
        //   name: "pseudoId",
        //   label: "کدپرسنلی",
        //   type: "text",
        //   style: { minWidth: "130px" },
        // },
    ];


    const defineEvaluationTableCols = [
        {
            name: "code",
            label: "کد ارزیابی",
            type: "text",
            style: { minWidth: "130px" },
        },
        {
            name: "name",
            label: "عنوان ارزیابی",
            type: "text",
            style: { minWidth: "130px" },
        },
        {
            name: "evaluationMethodEnumId",
            label: "روش ارزیابی",
            type: "select",
            options: fieldInfo.evaluationMethodEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            style: { minWidth: "130px" },
        },
        {
            name: "startDate",
            label: "ناریخ شروع",
            type: "date",
            style: { minWidth: "130px" },
        },
        {
            name: "thruDate",
            label: "تاریخ پایان",
            type: "date",
            style: { minWidth: "130px" },
        }
    ];
    React.useEffect(() => {

        // axios.get(SERVER_URL + `/rest/s1/evaluation/getCompanyEvaluations?companyPartyId=${fieldInfo.companyPartyId}`, axiosKey)
        axios.get(SERVER_URL + "/rest/s1/evaluation/getCompanyEvaluations", axiosKey)

            .then((tableData) => {
                setTableContent(tableData.data.result)
                setLoading(false)
                setResetDefinitionTable(false)
            })

    }, [resetDefinitionTable]);

    const getFieldsInfo = () => {
        axios.get(SERVER_URL + `/rest/s1/evaluation/difineEvaluationTimeFieldsInfo?partyRelationshipId=${partyRelationshipId}`, axiosKey)
            .then((res) => {
                setFieldInfo(res.data.result)
            })
            .catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING, "مشکلی در دریافت اطلاعات رخ داده است."));
            });
    }

    useEffect(() => {
        if (partyRelationshipId) {
            getFieldsInfo()
        }
    }, [partyRelationshipId])

    const handleRemove = (oldData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()

                axios.delete(SERVER_URL + `/rest/s1/evaluation/deleteEvaluated?evalParticipatorId=${oldData.evalParticipatorId}`, {
                    headers: { 'api_key': localStorage.getItem('api_key') },
                }).then(() => {

                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'حذف اطلاعات با موفقیت انجام شد.'));
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در حذف اطلاعات! '));
                });
            }, 200)
        })
    }



    const createEvaluation = () => {

        let data = {
            type: "EvalPeriodData",
            selectionStatus: "EvlPrdInPlanning",
            code: formValues.code,
            name: formValues.name,
            evaluationMethodEnumId: formValues.evaluationMethodEnumId,
            startDate: formValues.startDate ,
            thruDate: formValues.thruDate 


        }


        axios.post(SERVER_URL + "/rest/s1/evaluation/createEvaluation", { data: data }, axiosKey)
            .then((res) => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                setEvaluationPeriodId(res.data.evaluationPeriodId)

            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, '     خطا در ثبت اطلاعات!'));
            });
    }


    useEffect(() => {
    }, [formValuesVerification])

    const submitVerificationLevel = () => {


        let data = {
            type: "verificationData",
            typeVerification: "EvaluatorSelection",
            evaluationPeriodId: evaluationPeriodId,
            sequence: formValuesVerification.sequence,
            reject: formValuesVerification.reject,
            modify: formValuesVerification.modify,
            emplPositionId: formValuesVerification.emplPositionId,
            responsibleEmplpositionId: formValues.responsibleEmplpositionId

        }




        if (!tableContentVerification.find(i => i.sequence == data.sequence)) {

            axios.post(SERVER_URL + "/rest/s1/evaluation/createEvaluation", { data: data }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setLoadingVerificatin(!loadingVerificatin)
                    // setSequence(...data.sequence)


                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, '     خطا در ثبت اطلاعات!'));

                });
        }
        else
            dispatch(setAlertContent(ALERT_TYPES.ERROR, "شماره ترتیب انتخاب شده، تکراری است!"));


    }
    const editeVerificationLevel = () => {

        let data = {
            type: "verificationData",
            typeVerification: "EvaluatorSelection",
            evaluationPeriodId: evaluationPeriodId,
            sequence: formValuesVerification.sequence,
            reject: formValuesVerification.reject,
            modify: formValuesVerification.modify,
            emplPositionId: formValuesVerification.emplPositionId,
            responsibleEmplpositionId: formValues.responsibleEmplpositionId,
            levelId:levelId

        }




        // if (!tableContentVerification.find(i => i.sequence == data.sequence)) {

            axios.put(SERVER_URL + "/rest/s1/fadak/entity/VerificationLevel", { data: data }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setLoadingVerificatin(!loadingVerificatin)
                    // setSequence(...data.sequence)


                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, '     خطا در ثبت اطلاعات!'));

                });
        // }
        // else
        //     dispatch(setAlertContent(ALERT_TYPES.ERROR, "شماره ترتیب انتخاب شده، تکراری است!"));
            setButtonName("افزودن")


    }

    const handle_edit_verification=(row)=>{
        setButtonName("ویرایش")

        setFormValuesVerification(row)
        setLevelId(row.levelId)
        }
        

    


    useEffect(() => {
        if (evaluationPeriodId) {
            axios.get(SERVER_URL + "/rest/s1/evaluation/evaluationApprovals?evaluationPeriodId=" + evaluationPeriodId, {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(res => {
                setTableContentVerification(res.data.verificationList)
                setLoadingVerificatin(false)

                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت دریافت شد'));

            }).catch((err) => {
                setLoadingVerificatin(false)


                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
            });
        }

    }, [loadingVerificatin])

    useEffect(() => {
        getOrgInfo();
    }, []);


    const getOrgInfo = () => {
        let listMap = ["unit", "positions", "employees", "roles"]
        axios
            .get(
                SERVER_URL + "/rest/s1/fadak/getKindOfParties?listMap=" + listMap,
                axiosKey
            )
            .then((res) => {
                const orgMap = {
                    units: res.data.contacts.unit,
                    subOrgans: res.data.contacts.orgs,
                    roles: res.data.contacts.roles,
                    positions: res.data.contacts.positions,
                    employees: res.data.contacts.employees,
                };
                setOrganizationUnit(orgMap);
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

  

    function trigerHiddenSubmitBtn() {
        setdisplay(true)
    }

    function trigerHiddenCancelBtn() {
        setCancelClicked(cancelClicked + 1);
    }

    React.useEffect(() => {
        if (submitRef.current && submitClicked > 0) {
            submitRef.current.click();
        }
    }, [submitClicked]);

    React.useEffect(() => {
        if (cancelRef.current && cancelClicked > 0) {
            cancelRef.current.click();
        }
    }, [cancelClicked]);


    useEffect(() => {
        let str = formValues.personnel?.slice(0, -1);
        var s2 = str?.substring(1)
        var s4 = s2?.replaceAll('"', "")
        var array = s4?.split(',')
        setEmployee(array)

    }, [formValues.personnel]);

    useEffect(() => {
        let str = formValues.role?.slice(0, -1);
        var s2 = str?.substring(1)
        var s4 = s2?.replaceAll('"', "")
        var array = s4?.split(',')
        setRoleTypeId(array)

    }, [formValues.role]);


    useEffect(() => {


        let str = formValues.organizationUnit?.slice(0, -1);
        var s2 = str?.substring(1)
        var s4 = s2?.replaceAll('"', "")
        var array = s4?.split(',')
        setUnitName(array)

    }, [formValues.organizationUnit])

    useEffect(() => {


        let str = formValues.position?.slice(0, -1);
        var s2 = str?.substring(1)
        var s4 = s2?.replaceAll('"', "")
        var array = s4?.split(',')
        setEmplPositionIds(array)
    }, [formValues.position])

    useEffect(() => {

        if (emplPositionId && emplPositionId[0] === "")
            setEmplPositionIds([])

    }, [formValues.position, emplPositionId])

    useEffect(() => {


        if (unitNme && unitNme[0] === "")
            setUnitName([])

    }, [formValues.organizationUnit, unitNme])
    useEffect(() => {


        if (employee && employee[0] === "")
            setEmployee([])

    }, [formValues.personnel, employee])
    useEffect(() => {


        if (roleTypeId && roleTypeId[0] === "")
            setRoleTypeId([])

    }, [formValues.role, roleTypeId])




    const addEvaluating = () => {

        let data = {
            personPartyId: (employee ? employee : []) || (employee && employee[0] === "" ? [] : employee),
            evaluationPeriodId: evaluationPeriodId,
            companyPartyId: formValues.company
            // unitPartyId: (unitNme ? unitNme : []) || (unitNme && unitNme[0] === "" ? [] : unitNme),
            // emplPositionIds: (emplPositionId ? emplPositionId : []) || (emplPositionId && emplPositionId[0] === "" ? [] : emplPositionId),
            // roleTypeId: (roleTypeId ? roleTypeId : []) || (roleTypeId && roleTypeId[0] === "" ? [] : roleTypeId)

        }


        if (evaluationPeriodId) {

            setlodinggEvaluted(true)

            axios.post(SERVER_URL + "/rest/s1/evaluation/addEvaluated", { data: data }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setEvaluatingTableContent(prevState => { return [...prevState, ...res.data.resultEvaluatedD] })
                    setlodinggEvaluted(false)

                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, '     خطا در ثبت اطلاعات!'));

                });
        }
        else

            dispatch(setAlertContent(ALERT_TYPES.ERROR, '        لطفا قبل از افزودن ارزیابی شوندگان یک دوره ثبت کنید!'));




    }
    const handle_nextStep = () => {

    }


    const handleEditData = (rowData) => {
        setFormValues(Object.assign({}, rowData))
        verificationId.evaluatorSelectionVerification = rowData.evaluatorSelectionVerification
        verificationId.resultObjectionVerification = rowData.resultObjectionVerification
        setVerificationId(Object.assign({}, verificationId))
        setEvaluatingLoading(true)
        axios.get(SERVER_URL + `/rest/s1/evaluation/getEvaluationParticipators?evaluationPeriodId=${rowData.evaluationPeriodId}`, axiosKey)
            .then((res) => {
                let tableData = []
                if (res.data.result.length != 0) {
                    res.data.result.map((item, index) => {
                        const ind = fieldInfo.evaluatingPersonsInfo.findIndex(i => i.partyRelationshipId == item.fromPartyRelationshipId)
                        let rowData = {
                            name: fieldInfo?.evaluatingPersonsInfo[ind]?.name,
                            unitName: fieldInfo?.evaluatingPersonsInfo[ind]?.unitName[0] ?? "",
                            pseudoId: fieldInfo?.evaluatingPersonsInfo[ind]?.pseudoId ?? "",
                            emplPositionId: fieldInfo?.evaluatingPersonsInfo[ind]?.emplPositionIds[0] ?? "",
                            partyRelationshipId: fieldInfo?.evaluatingPersonsInfo[ind]?.partyRelationshipId ?? ""
                        }
                        tableData.push(rowData)
                        if (index == res.data.result.length - 1) {
                            setEvaluatingTableContent(tableData)
                            setEvaluatingLoading(false)
                        }
                    })
                }
                else {
                    setEvaluatingTableContent(res.data.result)
                    setEvaluatingLoading(false)
                }
            })
        setEdit(true)
    }




    const setClose = () => {
        // setcloseDialog(true)
        setdisplay(false)

    }

    const start = () => {
        // let EvaluatorList = []
        // EvaluatorList.push(formValues?.responsibleEmplpositionId)

        let statusData = {

            evaluationPeriodId: evaluationPeriodId,
            selectionStatus: "EvlPrdPlanning"

        }


        axios.post(SERVER_URL + "/rest/s1/evaluation/updateEvaluation", { data: statusData }, axiosKey)
            .then((res) => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));


            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, '     خطا در ثبت اطلاعات!'));

            });



        var EvaluatorList = [];
        EvaluatorList.push({ "emplPositionId": formValues?.responsibleEmplpositionId });
        let statusDataSave = {

            evaluationPeriodId: evaluationPeriodId,
            selectionStatus: "EvlPrdApproved"

        }
        let statusDataCancle = {

            evaluationPeriodId: evaluationPeriodId,
            selectionStatus: "EvlPrdRefused"

        }

        let VerList = []



        {
            tableContentVerification.map((item, index) => {
                let element = {}

                element.emplPositionId = item.emplPositionId ?? item.emplPositionId
                element.levelId = item.levelId ?? item.levelId
                element.modify = item.modify ?? item.modify
                element.reject = item.reject ?? item.reject
                element.sequence = item.sequence ?? item.sequence
                element.verificationId = item.verificationId ?? item.verificationId
                element.verificationDate = item.verificationDate ?? item.verificationDate
                element.result = item.result ?? item.result
                element.active = index == 0 ? true : false

                VerList.push(element)
                // setVeriList(VerList)
            }
            )
        }



        let data = {
            "api_key": localStorage.getItem('Authorization'),
            "evaluated": evaluatingTableContent,
            // "evalution":formValues,
            "verificationList": VerList,
            "Evaluator": formValues?.responsibleEmplpositionId,
            "evaluationPeriodId": evaluationPeriodId,
            "statusDataSave": statusDataSave,
            "statusDataCancle": statusDataCancle,


        }
        submitCallback(data)
        setdisplay(false)


    }
    return (
        <Card>
            <CardContent>
                <Card>
                    <CardContent>
                        <CardHeader title="تعریف دوره ارزیابی" />
                        <FormPro
                            formValues={formValues}
                            setFormValues={setFormValues}
                            append={formStructure}
                            formValidation={formValidation}
                            setFormValidation={setFormValidation}
                            submitCallback={createEvaluation}
                            actionBox={
                                <ActionBox>
                                    <Button type="submit" role="primary">افزودن</Button>
                                    <Button type="reset" role="secondary">لغو</Button>
                                </ActionBox>
                            }
                        />
                    </CardContent>
                </Card>
                <Box m={2} />
                <Card>
                    <CardContent>
                        <CardHeader title="انتخاب ارزیابی شوندگان" />

                        <FormPro
                            append={FormComplexPartyStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            setFormValidation={setFormValidation}
                            formValidation={formValidation}
                            submitCallback={addEvaluating}
                            actionBox={
                                <ActionBox>
                                    <Button type="submit" role="primary">افزودن</Button>
                                    <Button type="reset" role="secondary">لغو</Button>
                                </ActionBox>
                            }
                        />
                        <TablePro
                            columns={evaluatingTableCols}
                            rows={evaluatingTableContent}
                            setRows={setEvaluatingTableContent}
                            removeCallback={handleRemove}
                            loading={lodinggEvaluted}

                        />
                    </CardContent>
                </Card>
                <Box m={2} />
             
                <Box m={2}>
                    <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <Button
                            style={{
                                width: "70px",
                                color: "secondary",
                            }}
                            variant="outlined"
                            type="reset"
                            role="secondary"
                            onClick={trigerHiddenCancelBtn}
                        >
                            {" "}لغو{" "}
                        </Button>
                        <Button
                            style={{
                                width: 140,
                                color: "white",
                                backgroundColor: "#039be5",
                                marginRight: "8px",
                            }}
                            variant="outlined"
                            type="submit"
                            role="primary"
                            onClick={trigerHiddenSubmitBtn}
                        >
                            {" "}{edit ? "ویرایش " : " ایجاد دوره ی ارزیابی"}{" "}
                        </Button>
                    </div>
                </Box>
                <Box m={2} />
                <Dialog open={display}
                    onClose={closeDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">توجه</DialogTitle>
                    <DialogContent>"دوره ی ارزیابی ایجاد شد . اگر از ارسال به صفحه ی تایید ارزیاب اطمینان داریددکمه تایید را بفشارید "</DialogContent>
                    <DialogActions>
                        <Button onClick={setClose} color="primary">انصراف</Button>
                        <Button onClick={start} color="primary" autoFocus>تایید</Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default DefineEvaluationTimeForm;