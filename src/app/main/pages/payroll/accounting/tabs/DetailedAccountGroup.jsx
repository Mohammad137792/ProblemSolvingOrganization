import React, {useEffect, useState} from "react";
import {Box, Button, CardContent, CardHeader, Divider} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import useListState from "../../../../reducers/listState";
import axios from "../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "../../../../components/CheckPermision";

const formDefaultValues = {}
const primaryKey = "groupDetailedAccountId"
const defaultAction = {type: "add", payload: ""}

export default function DetailedAccountGroup({scrollTop}) {
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const [waiting, set_waiting] = useState(false)
    const dataList = useListState(primaryKey)
    const tableColumns = [{
        name    : "code",
        label   : "کد گروه حساب",
        type    : "text",
        required: true,
        validator: values => new Promise((resolve) => {
            if( /[^a-z0-9]/i.test(values.code) ){
                resolve({error: true, helper: "این کد فقط می تواند شامل اعداد و حروف لاتین باشد!"})
            }
            resolve({error: false, helper: ""})
        })
    },{
        name    : "title",
        label   : "عنوان گروه حساب",
        type    : "text",
        required: true
    },{
        name    : "gdAccountTypeEnumId",
        label   : "نوع گروه حساب تفصیلی",
        type    : "select",
        options : "GDAccountType",
        required: true,
        disabled: action.type==="edit",
        changeCallback: () => set_formValues(prevState => ({...prevState, classificationTypeEnumId: null}))
    }];
    const formStructure = [
        ...tableColumns,
        {
            name    : "classificationTypeEnumId",
            label   : "نوع ساختار پرسنلی",
            type    : "select",
            options : "PartyClassificationType",
            filterOptions: options => options.filter(o=>o["parentEnumId"]==="PersonnelStructure"),
            display : formValues["gdAccountTypeEnumId"]==="GDATPersonnelStructure",
            required: formValues["gdAccountTypeEnumId"]==="GDATPersonnelStructure",
            disabled: action.type==="edit",
        }
    ]

    function get_dataList() {
        axios.get("/s1/payroll/groupAccount").then(res => {
            dataList.set(res.data.allAccount)
        }).catch(() => {
            dataList.set([])
        });
    }
    function get_object(pk) {
        const object = dataList.list.find(i=>i[primaryKey]===pk)
        set_formValues(object);
    }
    function create_object() {
        axios.post("/s1/payroll/groupAccount", {newGroup: formValues}).then(res=>{
            dataList.add({
                ...formValues,
                ...res.data
            })
            handle_edit(res.data)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "گروه حساب تفصیلی جدید با موفقیت اضافه شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function update_object() {
        axios.put("/s1/payroll/groupAccount", {editedGroup: formValues}).then(()=>{
            dataList.update(formValues)
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش گروه حساب با موفقیت انجام شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function handle_submit() {
        if(dataList.list.findIndex(i => i["code"]===formValues["code"] && i[primaryKey]!==formValues[primaryKey] )>=0) {
            set_formValidation({
                code: {error: true, helper: "کد گروه حساب تکراری است!"}
            })
            return false
        }
        set_waiting(true)
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        if(action.type==="add") {
            create_object()
        } else if(action.type==="edit") {
            update_object()
        }
    }
    function handle_cancel() {
        set_action({type: "add", payload: ""})
    }
    function handle_edit(row) {
        set_action({type: "edit", payload: row[primaryKey]})
    }
    function handle_remove(row) {
        set_action(defaultAction)
        return new Promise((resolve, reject) => {
            axios.delete(`/s1/payroll/groupAccount?${primaryKey}=${row[primaryKey]}`).then( res => {
                if(res.data.deleteRow)
                    resolve()
                reject( "این گروه حساب تفصیلی در سند حسابداری استفاده شده و حذف آن امکانپذیر نیست!")
            }).catch(()=>{
                reject()
            });
        })
    }

    useEffect(()=>{
        get_dataList()
    },[])
    useEffect(() => {
        if(action.type==="edit") {
            get_object(action.payload)
            scrollTop()
        }
    }, [action]);

    return (
        <Box p={2}>
            {(checkPermis("payroll/accounting/groupDetailedAccount/add", datas) || action.type==="edit") && (
                <React.Fragment>
                    <Card>
                        <CardHeader title="تعریف گروه حساب تفصیلی"/>
                        <CardContent>
                            <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                                     formValidation={formValidation} setFormValidation={set_formValidation}
                                     prepend={formStructure}
                                     actionBox={<ActionBox>
                                         <Button type="submit" role="primary" disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}>{action.type==="add"?"افزودن":"ویرایش"}</Button>
                                         <Button type="reset" role="secondary" disabled={waiting}>لغو</Button>
                                     </ActionBox>}
                                     submitCallback={handle_submit} resetCallback={handle_cancel}
                            />
                            {action.type==="edit" && checkPermis("payroll/accounting/groupDetailedAccount/details", datas) &&
                            <React.Fragment>
                                <Box my={2}>
                                    <Divider variant="fullWidth"/>
                                </Box>
                                <DetailedAccountGroupAccounts parentKey={primaryKey} parentKeyValue={action.payload} gdAccountTypeEnumId={formValues.gdAccountTypeEnumId}/>
                            </React.Fragment>
                            }
                        </CardContent>
                    </Card>
                    <Box m={2}/>
                </React.Fragment>
            )}
            <Card>
                <TablePro
                    title="لیست گروه های حساب تفصیلی"
                    columns={tableColumns}
                    rows={dataList.list||[]}
                    setRows={dataList.set}
                    loading={dataList.list===null}
                    edit={checkPermis("payroll/accounting/groupDetailedAccount/edit", datas) && "callback"}
                    editCallback={handle_edit}
                    removeCallback={checkPermis("payroll/accounting/groupDetailedAccount/delete", datas) ? handle_remove : null}
                />
            </Card>
        </Box>
    )
}

function DetailedAccountGroupAccounts({parentKey, parentKeyValue, gdAccountTypeEnumId}) {
    const datas = useSelector(({ fadak }) => fadak);
    const primaryKey = "detailedAccountId"
    const [typeFieldOptions, set_typeFieldOptions] = useState([])
    const dataList = useListState(primaryKey)
    const typeFieldDef = gdAccountTypeEnumId==="GDATOrgUnit" ? {
        name: "partyId",
        optionIdField: "partyId",
        optionLabelField: "orgName",
    } : gdAccountTypeEnumId==="GDATPersonnel" ? {
        name: "partyRelationshipId",
        optionIdField: "partyRelationshipId",
        optionLabelField: "name",
    } : gdAccountTypeEnumId==="GDATPersonnelStructure" ? {
        name: "partyClassificationId",
        optionIdField: "partyClassificationId",
        optionLabelField: "description",
    } : {
        options : []
    }
    const tableColumns = [{
        name    : "accountCode",
        label   : "کد حساب تفصیلی",
        type    : "text",
        required: true,
    },{
        name    : "accountTitle",
        label   : "عنوان حساب تفصیلی",
        type    : "text",
        required: true
    },{
        label   : "نوع حساب تفصیلی",
        type    : "select",
        required: true,
        options : typeFieldOptions,
        ...typeFieldDef
    }];
    function is_code_invalid(values) {
        return /[^a-z0-9]/i.test(values.accountCode)
    }
    function checkDuplicate(accountCode, detailedAccountId) {
        return new Promise((resolve, reject) => {
            axios.get(`/s1/payroll/checkDuplicateDetAccount?detailedAccountId=${detailedAccountId}&accountCode=${accountCode}`).then(res => {
                if(res.data.isDuplicated)
                    reject("کد حساب تکراری است!")
                else
                    resolve()
            }).catch(() => {
                reject()
            });
        })
    }
    function checkDuplicateType(data) {
        return new Promise((resolve, reject) => {
            axios.get("/s1/payroll/checkDuplicateTypeDetAccount",{params: data}).then(res => {
                if(res.data.isDuplicated)
                    reject("نوع حساب تفصیلی تکراری است!")
                else
                    resolve()
            }).catch(() => {
                reject()
            });
        })
    }
    function handle_add(newData) {
        return new Promise((resolve, reject) => {
            let data = {...newData , [parentKey]: parentKeyValue }
            if(is_code_invalid(newData)) {
                reject("کد حساب تفصیلی فقط می تواند شامل اعداد و حروف لاتین باشد!")
            } else checkDuplicate(newData.accountCode).then(()=>{
                checkDuplicateType(data).then(()=>{
                    axios.post("/s1/payroll/groupDetail", {newGroupDetail: data}).then((res) => {
                        resolve({...data, ...res.data})
                    }).catch(() => {
                        reject()
                    });
                }).catch(response=>{
                    reject(response)
                })
            }).catch(response=>{
                reject(response)
            })
        })
    }
    function handle_edit(newData, oldData) {
        return new Promise((resolve, reject) => {
            if(is_code_invalid(newData)) {
                reject("کد حساب تفصیلی فقط می تواند شامل اعداد و حروف لاتین باشد!")
            }else checkDuplicate(newData.accountCode,newData.detailedAccountId).then(()=>{
                checkDuplicateType(newData).then(()=>{
                    axios.put("/s1/payroll/groupDetail", {editedGroupDetail: newData}).then(() => {
                        resolve(newData)
                    }).catch(() => {
                        reject()
                    });
                }).catch(response=>{
                    reject(response)
                })
            }).catch(response=>{
                reject(response)
            })
        })
    }
    function handle_remove(row) {
        return new Promise((resolve, reject) => {
            axios.delete(`/s1/payroll/groupDetail?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }
    function get_dataList() {
        axios.get(`/s1/payroll/groupDetail?${parentKey}=${parentKeyValue}`).then(res => {
            dataList.set(res.data.allAccount)
        }).catch(() => {
            dataList.set([])
        });
    }

    useEffect(()=>{
        get_dataList()
        axios.get(`/s1/payroll/allDetAccounttype?groupDetAccountId=${parentKeyValue}`).then(res => {
            set_typeFieldOptions(res.data.accountTypes)
        }).catch(() => {});
    },[parentKeyValue])

    // useEffect(()=>{
    //     axios.get("/s1/payroll/legalAgentTypes").then(res => {
    //         set_payrollFactors(res.data.legalAgents)
    //     }).catch(() => {});
    // },[])

    return (
        <Card variant="outlined">
            <TablePro
                title="لیست حساب های گروه حساب تفصیلی"
                columns={tableColumns}
                rows={dataList.list||[]}
                setRows={dataList.set}
                loading={dataList.list===null}
                add={checkPermis("payroll/accounting/groupDetailedAccount/details/add", datas) && "inline"}
                addCallback={handle_add}
                edit={checkPermis("payroll/accounting/groupDetailedAccount/details/edit", datas) && "inline"}
                editCallback={handle_edit}
                removeCallback={checkPermis("payroll/accounting/groupDetailedAccount/details/delete", datas) ? handle_remove : null}
            />
        </Card>
    )
}

