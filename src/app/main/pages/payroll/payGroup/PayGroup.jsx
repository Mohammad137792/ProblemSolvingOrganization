import React, {createRef, useEffect, useState} from "react";
import {FusePageSimple} from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import {useDispatch, useSelector} from "react-redux";
import useListState from "../../../reducers/listState";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import Card from "@material-ui/core/Card";
import {Button, CardContent, Divider} from "@material-ui/core";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import TablePro from "../../../components/TablePro";
import axios from "../../../api/axiosRest";
import TabPro from "../../../components/TabPro";
import PayGroupFactors from "./tabs/PayGroupFactors";
import LegalDeductions from "./tabs/LegalDeductions";
import PaySlips from "./tabs/PaySlips";
import Actions from "./tabs/Actions";
import VerificationSteps from "./tabs/VerificationSteps";
import WelfareCost from "./tabs/WelfareCost";
import {PayrollCardHeader} from "../Payroll";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "../../../components/CheckPermision";

export default function PayGroup() {
    const datas = useSelector(({ fadak }) => fadak);
    const formDefaultValues = {}
    const primaryKey = "payGroupPartyClassificationId"
    const defaultAction = {type: "add", payload: ""}
    const myScrollElement = createRef();
    const dispatch = useDispatch();
    const [waiting, set_waiting] = useState(false)
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const [data, set_data] = useState({
        financeList: [],
        insuranceList: [],
        confAccountList: [],
    })
    const dataList = useListState(primaryKey)
    const tableColumns = [{
        name    : "standardCode",
        label   : "کد گروه حقوقی",
        type    : "text",
        required: true,
        validator: values => new Promise((resolve) => {
            if( /[^a-z0-9]/i.test(values.standardCode) ){
                resolve({error: true, helper: "کد گروه فقط می تواند شامل اعداد و حروف لاتین باشد!"})
            }
            axios.get(`/s1/payroll/duplicatePayGroup?standardCode=${values.standardCode}&payGroupPartyClassificationId=${values[primaryKey]}`).then(res => {
                if(res.data.isDuplicated)
                    resolve({error: true, helper: "کد گروه تکراری است!"})
                else resolve({error: false, helper: ""})
            }).catch(() => {
                resolve({error: true, helper: ""})
            });
        })
    },{
        name    : "description",
        label   : "عنوان گروه حقوقی",
        type    : "text",
        required: true
    },{
        name    : "payGroupStatusId",
        label   : "وضعیت",
        type    : "select",
        options : "StaPayGroup",
        optionIdField: "statusId",
        required: true
    }]
    const formStructure = [...tableColumns,{
        name    : "taxAreaPartyRelationshipId",
        label   : "حوزه مالیاتی",
        type    : "select",
        options : data.financeList,
        optionIdField: "partyRelationshipId",
        optionLabelField: "relationshipName",
        required: true
    },{
        name    : "insuranceAreaPartyRelationShipId",
        label   : "حوزه بیمه",
        type    : "select",
        options : data.insuranceList,
        optionIdField: "partyRelationshipId",
        optionLabelField: "relationshipName",
        required: true
    },{
        name    : "configAcountingSoftwareId",
        label   : "نوع ارتباط با سیستم حسابداری",
        type    : "select",
        options : data.confAccountList,
        optionIdField: "configId",
        optionLabelField: "title",
        // required: true
    },{
        name    : "displayZero",
        label   : "نمایش عوامل حقوق کمتر از صفر در فیش",
        type    : "indicator",
        col     : 6,
    }]

    function get_dataList() {
        axios.get("/s1/payroll/payGroup").then(res => {
            dataList.set(res.data.payGroupList)
        }).catch(() => {
            dataList.set([])
        });
    }
    function get_object(pk) {
        const object = dataList.list.find(i=>i[primaryKey]===pk)
        set_formValues(object);
    }
    function create_object() {
        axios.post("/s1/payroll/payGroup",formValues).then(res=>{
            dataList.add({
                ...formValues,
                ...res.data
            })
            handle_edit(res.data)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "گروه حقوق و دستمزد جدید با موفقیت اضافه شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function update_object() {
        axios.put("/s1/payroll/payGroup",formValues).then(()=>{
            dataList.update(formValues)
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش گروه با موفقیت انجام شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function handle_submit() {
        // if(dataList.list.findIndex(i => i["standardCode"]===formValues["standardCode"] && i[primaryKey]!==formValues[primaryKey] )>=0) {
        //     set_formValidation({
        //         standardCode: {error: true, helper: "کد گروه تکراری است!"}
        //     })
        //     return false
        // }
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
            axios.delete(`/s1/payroll/payGroup?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }
    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 0;
    }

    useEffect(()=>{
        get_dataList()
        axios.get("/s1/fadak/financeList").then(res => {
            set_data(prevState => ({...prevState, financeList: res.data.financeList }))
        }).catch(() => { });
        axios.get("/s1/fadak/insuranceList").then(res => {
            set_data(prevState => ({...prevState, insuranceList: res.data.insuranceList }))
        }).catch(() => { });
        axios.get("/s1/payroll/allConfAccount").then(res => {
            set_data(prevState => ({...prevState, confAccountList: res.data.confAccountList }))
        }).catch(() => { });
    },[])

    useEffect(() => {
        if(action.type==="edit") {
            get_object(action.payload)
            scroll_to_top()
        }
    }, [action]);

    const tabProps = {
        parentKey: primaryKey,
        parentKeyValue: action.payload
    }

    const tabs = [{
        label: "عوامل حقوق",
        panel: <PayGroupFactors {...tabProps}/>,
        display: checkPermis("payroll/payGroup/payrollFactor", datas)
    },{
        label: "کسورات قانونی",
        panel: <LegalDeductions {...tabProps}/>,
        display: checkPermis("payroll/payGroup/legalDeduct", datas)
    },{
        label: "فیش حقوقی",
        panel: <PaySlips {...tabProps}/>,
        display: checkPermis("payroll/payGroup/payslip", datas)
    },{
        label: "اقدامات حقوق و دستمزد",
        panel: <Actions {...tabProps}/>,
        display: checkPermis("payroll/payGroup/action", datas)
    },{
        label: "مراحل تایید",
        panel: <VerificationSteps {...tabProps}/>,
        display: checkPermis("payroll/payGroup/verificationLevel", datas)
    },{
        label: "هزینه امکانات",
        panel: <WelfareCost {...tabProps}/>,
        display: checkPermis("payroll/payGroup/welfareCost", datas)
    }]


    return checkPermis("payroll/payGroup", datas) && (
        <FusePageSimple
            ref={myScrollElement}
            header={<PayrollCardHeader title={"گروه حقوق و دستمزد"}/>}
            content={
                <Box p={2}>
                    {(checkPermis("payroll/payGroup/add", datas) || action.type==="edit") && (
                        <React.Fragment>
                            <Card>
                                <CardHeader title="تعریف گروه حقوق و دستمزد"/>
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
                                    {action.type==="edit" &&
                                    <React.Fragment>
                                        <Box my={2}>
                                            <Divider variant="fullWidth"/>
                                        </Box>
                                        <Card variant="outlined">
                                            <TabPro tabs={tabs}/>
                                        </Card>
                                    </React.Fragment>
                                    }
                                </CardContent>
                            </Card>
                            <Box m={2}/>
                        </React.Fragment>
                    )}
                    <Card>
                        <TablePro
                            title="لیست گروه های حقوقی"
                            columns={tableColumns}
                            rows={dataList.list||[]}
                            setRows={dataList.set}
                            loading={dataList.list===null}
                            edit={checkPermis("payroll/payGroup/edit", datas) && "callback"}
                            editCallback={handle_edit}
                            removeCallback={checkPermis("payroll/payGroup/delete", datas) ? handle_remove : null}
                        />
                    </Card>
                </Box>
            }
        />
    )
}
