import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardContent, CardHeader, Grid } from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from "../../../../components/TablePro";
import TabPro from "../../../../components/TabPro";
import ActionBox from "../../../../components/ActionBox";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from 'configs';
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import DefineEvaluationMethod from "../defineEvaluationTime/DefineEvaluationTimeTabs/DefineEvaluationMethod"
import AdjustProtestStructure from "../defineEvaluationTime/DefineEvaluationTimeTabs/AdjustProtestStructure"
import ConfirmDialog, { useDialogReducer } from "../../../../components/ConfirmDialog";
import TransferList from "../../../../components/TransferList";
import FilterEvaluatedList from "./FilterEvaluatedList"
import useListState from "../../../../reducers/listState";

const DefineEvaluationTimeForm = () => {

    const [formValidation, setFormValidation] = useState({});
    const [formValues, setFormValues] = useState([]);
    const [tableContent, setTableContent] = React.useState([]);
    const [fieldInfo, setFieldInfo] = useState({ evaluationMethodEnumId: [], centerEvaluatorRelationshipId: [], evaluatingPersonsInfo: [], positionInfo: [], companyPartyId: "", unitInfo: [] });
    const [verificationId, setVerificationId] = useState({ evaluatorSelectionVerification: "", resultObjectionVerification: "" });
    const [edit, setEdit] = React.useState(false);
    const [selectionStatus, setSelectionStatus,] = React.useState("");
    const [submitClicked, setSubmitClicked] = useState(0);
    const [cancelClicked, setCancelClicked] = useState(0);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [loading, setLoading] = useState(true);
    const personnel = useListState("partyId")
    const audience = useListState("partyId")
    const [allData, setAllData] = useState([]);
    const [filterFormValues, setFilterFormValues] = useState([]);
    const [userInfo,setUserInfo] = useState({}); 


    const submitRef = createRef(0);
    const cancelRef = createRef(0);
    const dispatch = useDispatch();

    const conformDialog = useDialogReducer(handle_nextStep)

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

    const getFieldsInfo = () => {
        axios.get(SERVER_URL + `/rest/s1/evaluation/difineEvaluationTimeFieldsInfo?partyRelationshipId=${partyRelationshipId}`, axiosKey)
            .then((res) => {
                setFieldInfo(res.data.result)
            })
            .catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING, "مشکلی در دریافت اطلاعات رخ داده است."));
            });
    }

    // const filter_audience = (parties) => {
    //     if (audience.list) {
    //         return parties.filter(i => audience.list.findIndex(j => j.partyId === i.partyId) < 0 && i.role && i.role != "")
    //     } else {
    //         return parties.filter(i => i.role && i.role != "")
    //     }
    // }

    const load_personnel = () => {
        if (personnel.list) {
            personnel.set(filter_audience(fieldInfo.evaluatingPersonsInfo))
        } else {
            const getData = ["employees"]
            axios.get(SERVER_URL + "/rest/s1/fadak/getKindOfParties?listMap=" + getData, axiosKey).then(res => { /* todo: rest? */
                personnel.set(filter_audience(res.data.contacts.employees))
            }).catch(() => {
                personnel.set([])
            });
        }
    }



    // const load_personnel = () => {
    //     if (personnel.list != null){
    //         personnel.set(filter_audience(fieldInfo.employeeInfo))
    //         setAllData(filter_audience(fieldInfo.employeeInfo))
    //     }else{
    //         personnel.set(filter_audience(fieldInfo?.employeeInfo))
    //         setAllData(filter_audience(fieldInfo?.employeeInfo))
    // }
    // }


    const filter_audience = (parties) => {
        if(audience.list?.length != 0) {
          if(userInfo.roleOfUser?.roleTypeId == "ChiefExecutiveOfficer" && userInfo.orgOfUser.toPartyId ==  userInfo.organization[0].partyId){
            return parties.filter(i => i.role  && i.role !== "" && audience.list.findIndex(j => j.partyId === i.partyId) < 0)
          }
          if(userInfo.roleOfUser?.roleTypeId == "OrgRManager" && userInfo.orgOfUser.toPartyId == userInfo.organization[0].partyId){
            return parties.filter(i => i.subOrgPartyId == userInfo.orgOfUser.toPartyId && (i.role === "OrgRManager" || i.role === "Employee" ) && audience.list.findIndex(j => j.partyId === i.partyId) < 0)
          }
          if(userInfo.roleOfUser?.roleTypeId == "Employee" && userInfo.orgOfUser.toPartyId == userInfo.organization[0].partyId){
            return parties.filter(i => i.subOrgPartyId == userInfo.orgOfUser.toPartyId &&  i.role === "Employee" && audience.list.findIndex(j => j.partyId === i.partyId) < 0)
          }
          if(userInfo.roleOfUser?.roleTypeId == "ChiefExecutiveOfficer" && userInfo.subOrganization.some(el => el.partyId === userInfo.orgOfUser.toPartyId)){
            return parties.filter(i => i.subOrgPartyId == userInfo.orgOfUser.toPartyId && audience.list.findIndex(j => j.partyId === i.partyId) < 0)
          }
          if(userInfo.roleOfUser?.roleTypeId == "OrgRManager" && userInfo.subOrganization.some(el => el.partyId === userInfo.orgOfUser.toPartyId)){
            return parties.filter(i => i.subOrgPartyId == userInfo.orgOfUser.toPartyId && (i.role === "OrgRManager" || i.role === "Employee" ) && audience.list.findIndex(j => j.partyId === i.partyId) < 0)
          }
          if(userInfo.roleOfUser?.roleTypeId == "Employee" && userInfo.subOrganization.some(el => el.partyId === userInfo.orgOfUser.toPartyId)){
            return parties.filter(i => i.subOrgPartyId == userInfo.orgOfUser.toPartyId &&  i.role === "Employee" && audience.list.findIndex(j => j.partyId === i.partyId) < 0 )
          }
        }else{
            if(userInfo.roleOfUser?.roleTypeId == "ChiefExecutiveOfficer" && userInfo.orgOfUser.toPartyId ==  userInfo.organization[0].partyId){
              return parties.filter(i => i.role  && i.role !== "" )
            }
            if(userInfo.roleOfUser?.roleTypeId == "OrgRManager" && userInfo.orgOfUser.toPartyId == userInfo.organization[0].partyId){
              return parties.filter(i => i.subOrgPartyId == userInfo.orgOfUser.toPartyId && (i.role === "OrgRManager" || i.role === "Employee" ))
            }
            if(userInfo.roleOfUser?.roleTypeId == "Employee" && userInfo.orgOfUser.toPartyId == userInfo.organization[0].partyId){
              return parties.filter(i => i.subOrgPartyId == userInfo.orgOfUser.toPartyId &&  i.role === "Employee" )
            }
            if(userInfo.roleOfUser?.roleTypeId == "ChiefExecutiveOfficer" && userInfo.subOrganization.some(el => el.partyId === userInfo.orgOfUser.toPartyId)){
              return parties.filter(i => i.subOrgPartyId == userInfo.orgOfUser.toPartyId )
            }
            if(userInfo.roleOfUser?.roleTypeId == "OrgRManager" && userInfo.subOrganization.some(el => el.partyId === userInfo.orgOfUser.toPartyId)){
              return parties.filter(i => i.subOrgPartyId == userInfo.orgOfUser.toPartyId && (i.role === "OrgRManager" || i.role === "Employee" ))
            }
            if(userInfo.roleOfUser?.roleTypeId == "Employee" && userInfo.subOrganization.some(el => el.partyId === userInfo.orgOfUser.toPartyId)){
              return parties.filter(i => i.subOrgPartyId == userInfo.orgOfUser.toPartyId &&  i.role === "Employee" )
            }
        }
      }
    

    const load_audience = (rowData) => {
        if (edit) {
            axios.get(SERVER_URL + `/rest/s1/evaluation/getEvaluationParticipators?evaluationPeriodId=${rowData.evaluationPeriodId}`, axiosKey)
                .then((res) => {
                    let tableData = []
                    if (res.data.result.length != 0) {
                        res.data.result.map((item, index) => {
                            const ind = fieldInfo.evaluatingPersonsInfo.findIndex(i => i.partyRelationshipId == item.fromPartyRelationshipId)
                            tableData.push(fieldInfo?.evaluatingPersonsInfo[ind])
                            if (index == res.data.result.length - 1) {
                                audience.set(tableData)
                            }
                        })
                    }
                    else {
                        audience.set(res.data.result)
                    }
                })
        }
        if (!edit) {
            audience.set([])
        }
    }

    useEffect(() => {
        if (partyRelationshipId) {
            getFieldsInfo()
        }
    }, [partyRelationshipId])

    useEffect(() => {
        load_personnel()
    }, [audience?.list])

    useEffect(() => {
        load_audience(formValues)
    }, [edit])

    const handleRemoveDefinition = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + `/rest/s1/evaluation/deleteEvaluation?evaluationPeriodId=${oldData.evaluationPeriodId}`, axiosKey)
                .then((res) => {
                    resolve()
                }).catch(() => {
                    reject()
                })
        })
    }

    const createEvaluation = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات ..."));
        let sendData = {
            ...formValues,
            selectionStatus: selectionStatus,
            evaluatorSelectionVerification: verificationId.evaluatorSelectionVerification,
            resultObjectionVerification: verificationId.resultObjectionVerification,
            evaluatedFormSentDate: formValues?.evaluatedFormDate ? (new Date(formValues?.evaluatedFormDate).getTime() + (86400000 * formValues.evaluatedFormDay)) : "",
            evaluatorFormSentDate: formValues?.evaluatorFormDate ? (new Date(formValues?.evaluatorFormDate).getTime() + (86400000 * formValues.evaluatorFormDay)) : "",
            companyPartyId: fieldInfo.companyPartyId
        }
        let evaluationParticipatorsData = []
        if (audience?.list.length != 0) {
            audience.list.map((e, i) => {
                let rowData = {
                    fromPartyRelationshipId: e.partyRelationshipId,
                    fromEmplpositionId: e.emplPositionIds[0]
                }
                evaluationParticipatorsData.push(rowData)
                if (i == audience.list.length - 1) {
                    axios.post(SERVER_URL + `/rest/s1/evaluation/modifyEvaluation`, { data: sendData, evaluationParticipatorsData: evaluationParticipatorsData }, axiosKey).then((res) => {
                        conformDialog.show()
                        resetCallback()
                    }).catch(() => {
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
                    });
                }
            })
        }
        else {
            axios.post(SERVER_URL + `/rest/s1/evaluation/modifyEvaluation`, { data: sendData, evaluationParticipatorsData: evaluationParticipatorsData }, axiosKey).then((res) => {
                conformDialog.show()
                resetCallback()
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            });
        }
    }

    const tabs = [
        {
            label: "شیوه تعیین ارزیاب",
            panel: <DefineEvaluationMethod verificationId={verificationId} setVerificationId={setVerificationId} fieldInfo={fieldInfo} formValues={formValues} setFormValues={setFormValues} />
        }
        , {
            label: "تنظیم ساختار اعتراض",
            panel: <AdjustProtestStructure verificationId={verificationId} setVerificationId={setVerificationId} fieldInfo={fieldInfo} />
        }
    ]

    function trigerHiddenSubmitBtn() {
        setSubmitClicked(submitClicked + 1);
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

    React.useEffect(() => {
        if (loading && fieldInfo.companyPartyId) {
            axios.get(SERVER_URL + `/rest/s1/evaluation/getCompanyEvaluations?companyPartyId=${fieldInfo.companyPartyId}`, axiosKey)
                .then((tableData) => {
                    setTableContent(tableData.data.result)
                    setLoading(false)
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, "مشکلی در دریافت اطلاعات رخ داده است."));
                });
        }
    }, [loading, fieldInfo?.companyPartyId]);

    const handle_nextStep = () => {

    }

    const editDefinition = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات ..."));
        let sendData = {
            ...formValues,
            selectionStatus: selectionStatus,
            evaluatorSelectionVerification: verificationId.evaluatorSelectionVerification,
            resultObjectionVerification: verificationId.resultObjectionVerification,
            evaluatedFormSentDate: formValues?.evaluatedFormDate ? (new Date(formValues?.evaluatedFormDate).getTime() + (86400000 * formValues.evaluatedFormDay)) : "",
            evaluatorFormSentDate: formValues?.evaluatorFormDate ? (new Date(formValues?.evaluatorFormDate).getTime() + (86400000 * formValues.evaluatorFormDay)) : "",
            companyPartyId: fieldInfo.companyPartyId
        }
        let evaluationParticipatorsData = []
        if (audience?.list.length != 0) {
            audience.list.map((e, i) => {
                let rowData = {
                    fromPartyRelationshipId: e.partyRelationshipId,
                    fromEmplpositionId: e.emplPositionIds[0]
                }
                evaluationParticipatorsData.push(rowData)
                if (i == audience.list.length - 1) {
                    axios.put(SERVER_URL + `/rest/s1/evaluation/updateEvaluation`, { data: sendData, evaluationParticipatorsData: evaluationParticipatorsData }, axiosKey).then((res) => {
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'));
                        resetCallback()
                    }).catch(() => {
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
                    });
                }
            })
        }
        else {
            axios.put(SERVER_URL + `/rest/s1/evaluation/updateEvaluation`, { data: sendData, evaluationParticipatorsData: evaluationParticipatorsData }, axiosKey).then((res) => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'));
                resetCallback()
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            });
        }
    }

    const handleEditData = (rowData) => {
        setFormValues(Object.assign({}, rowData))
        verificationId.evaluatorSelectionVerification = rowData.evaluatorSelectionVerification
        verificationId.resultObjectionVerification = rowData.resultObjectionVerification
        setVerificationId(Object.assign({}, verificationId))
        setEdit(true)
    }

    const resetCallback = () => {
        setLoading(true)
        setFormValues({})
        setEdit(false)
        verificationId.evaluatorSelectionVerification = ""
        verificationId.resultObjectionVerification = ""
        setVerificationId(Object.assign({}, verificationId))
    }

    const handle_add_participant = (parties) => new Promise((resolve, reject) => {
        resolve(parties)
    })

    const handle_delete_participant = (parties) => new Promise((resolve, reject) => {
        resolve(parties)
    })

    const display_name = (item) => `${item.name}`

    const display_org_info = (item) => {
        let info = []
        if (item.emplPosition) info.push(item.emplPosition)
        if (item.unitName[0]) info.push(item.unitName[0])
        if (item.subOrg[0]) info.push(item.subOrg[0])
        return info.join("، ") || "─"
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
                            submitCallback={() =>
                                edit ?
                                    editDefinition()
                                    :
                                    createEvaluation()
                            }
                            resetCallback={resetCallback}
                            actionBox={
                                <ActionBox>
                                    <Button
                                        ref={submitRef}
                                        type="submit"
                                        role="primary"
                                        style={{ display: "none" }}
                                    />
                                    <Button
                                        ref={cancelRef}
                                        type="reset"
                                        role="secondary"
                                        style={{ display: "none" }}
                                    />
                                </ActionBox>
                            }
                        />
                    </CardContent>
                </Card>
                <Box m={2} />
                <Card>
                    <CardContent>
                        <CardHeader title="انتخاب ارزیابی شوندگان" />
                        <TransferList
                            rightTitle="لیست پرسنل"
                            rightContext={personnel}
                            rightItemLabelPrimary={display_name}
                            rightItemLabelSecondary={display_org_info}
                            leftTitle="لیست ارزیابی شوندگان"
                            leftContext={audience}
                            leftItemLabelPrimary={display_name}
                            leftItemLabelSecondary={display_org_info}
                            onMoveLeft={handle_add_participant}
                            onMoveRight={handle_delete_participant}
                            rightFilterForm={
                                <FilterEvaluatedList tableContent={allData} setTableContent={personnel} formValues={filterFormValues} setFormValues={setFilterFormValues} />
                            }
                        />
                    </CardContent>
                </Card>
                <Box m={2} />
                <Card>
                    <CardContent>
                        <TabPro tabs={tabs} />
                    </CardContent>
                </Card>
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
                <Card>
                    <CardContent>
                        <CardHeader title="لیست دوره های ارزیابی" />
                        <TablePro
                            columns={defineEvaluationTableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                            edit="callback"
                            editCallback={handleEditData}
                            removeCallback={handleRemoveDefinition}
                        />
                    </CardContent>
                </Card>
                <ConfirmDialog
                    dialogReducer={conformDialog}
                    title="توجه "
                    confirmButtonText="تایید"
                    cancelButtonText="انصراف"
                    content={
                        "دوره ی ارزیابی ایجاد شد . اگر از ارسال به صفحه ی تایید ارزیاب اطمینان داریددکمه تایید را بفشارید "
                    }
                />
            </CardContent>
        </Card>
    );
};

export default DefineEvaluationTimeForm;
