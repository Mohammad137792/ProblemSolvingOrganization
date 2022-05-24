import React, {useEffect, useState} from "react";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import {Button, CardContent, CardHeader, Grid,Box} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import TabPro from "../../../../components/TabPro";
import SettingsInsurance from "./settings/SettingsInsurance";
import Card from "@material-ui/core/Card";
import SettingsTaxation from "./settings/SettingsTaxation";
import SettingsActions from "./settings/SettingsActions";
import SettingsFactors from "./settings/SettingsFactors";
import CommentBox from "../../../../components/CommentBox";
import useListState from "../../../../reducers/listState";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
import axios from "../../../../api/axiosRest";
import { useHistory } from "react-router-dom";

const formDefaultValues = {}

export default function Settings({formVariables, submitCallback, set_formVariables,taskId,goToStep}) {
    const [waiting, set_waiting] = useState(false)
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [fieldsInfo, setFieldsInfo] = useState({});
    const [initData, setInitData] = useState({});
    const [pageState, setPageState] = useState("default");

    const dispatch = useDispatch();
    const history = useHistory();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    console.log('formVariables',formVariables)

    const comments = useListState("id",formVariables?.comments || [])

    const formStructure = [
        {
        name    : "paymentMethodId",
        label   : "حساب بانکی پرداخت حقوق",
        type    : "select",
        options : fieldsInfo?.CreditInfo ,
        optionIdField   : "paymentMethodId",
        optionLabelField: "bankName",
        otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
        {name: "shebaNumber", optionIdField: "shebaNumber"},{name: "routingNumber", optionIdField: "routingNumber"}],
    },{
        name    : "FullName",
        label   : "نام و نام خانوادگی دارنده حساب",
        type    : "display",
    },{
        name    : "routingNumber",
        label   : "شماره حساب",
        type    : "display",
    },{
        name    : "shebaNumber",
        label   : "شماره شبا",
        type    : "display",
    },{
        name    : "paymentDate",
        label   : "تاریخ پرداخت حقوق",
        type    : "date",
    },{
        name    : "paymentDescription",
        label   : "شرح تراکنش",
        type    : "text",
    },{
        name    : "paymentFor",
        label   : "پرداخت بابت",
        type    : "select",
        options : fieldsInfo?.PayForList ,
        optionIdField   : "enumId",
        optionLabelField: "description",
    },{
        name    : "paymentBillImage",
        label   : "تصویر چک پرداخت",
        type    : "inputFile"
    },{
        name    : "outputs",
        label   : "خروجی ها",
        type    : "multiselect",
        options : fieldsInfo?.OutputList ,
        optionIdField   : "outputTypeId",
        optionLabelField: "title",
        getOptionDisabled: option => {
            const selectedIds = JSON.parse(formValues.outputs || "[]")
            const selectedOptions = fieldsInfo?.OutputList.filter(item => selectedIds?.indexOf( item.outputTypeId ) > -1)
            const selectedTypes = selectedOptions.map(item => item.outputTypeEnumId)
            return selectedTypes?.indexOf( option.outputTypeEnumId ) > -1 && selectedIds?.indexOf( option.outputTypeId ) <= -1
        }
    },{
        name    : "payslipSendType",
        label   : "روش های ارسال فیش حقوقی",
        type    : "multiselect",
        options : fieldsInfo?.PayslipSendType ,
        optionIdField   : "enumId",
        optionLabelField: "description",
    },{
        name    : "payslipDescription",
        label   : "توضیحات فیش حقوقی",
        type    : "text",
        col     : {sm: 8, md: 6}
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "textarea",
        col     : 12
    }]

    const sendToProcess = () => {
        const packet = {
            "variables" : {...formValues,...formVariables,comments:comments.list,"processType":"PTCalcPayroll","factorsList":[],actionsBeforeCalculations:formVariables.payslipActionList.filter(x=>x.status == true && x.ActionType == "PCABeforClac")},
            "basicToken" : localStorage.getItem('Authorization'),
            "id":"salaryProcess",
            "taskId":taskId,
            "processInstanceId":formVariables?.processInstanceId
        }
        axios.post(SERVER_URL + `/rest/s1/processes/salarySettingService`, packet ,axiosKey).then(res => { 
            // submitCallback()
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
            setPageState("new")
        }).catch(() => {
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در ارسال اطلاعات رخ داده است."));
        });
    }

    const handle_submit = () => {
        set_waiting(true)
        sendToProcess()
    }

    const tabsProps = {formValues, set_formValues, formValidation, set_formValidation}

    let tabs = [
        {
        label: "تنظیمات عوامل حقوق و دستمزد",
        panel: <SettingsFactors getPagOpt={initData?.GetPagOpt} formVariables={formVariables} set_formVariables={set_formVariables} {...tabsProps}/>
    },{
        label: "اقدامات",
        panel: <SettingsActions actionOpt={initData?.GetActionOpt} formVariables={formVariables} set_formVariables={set_formVariables} {...tabsProps}/>
    },{
        label: "مالیات",
        panel: <SettingsTaxation  getTaxPaymentInfo={initData?.GetTaxPaymentInfo} formVariables={formVariables} {...tabsProps}/>
    },{
        label: "بیمه و معوقات",
        panel: <SettingsInsurance getArrearseInfo={initData?.GetArrearseInfo} formVariables={formVariables} {...tabsProps}/>
    }]

    function setDefaultValues(){
        if(formValues.outputs){
            let selectedOutPuts = JSON.parse(formValues.outputs),
            selectedBankOutput = initData?.GetPagOpt?.OutputList.find(x=> selectedOutPuts.indexOf(x.outputTypeId) >= 0 && x.outputTypeEnumId == "OutTyBanck"),
            selectedTaxOutput = initData?.GetPagOpt?.OutputList.find(x=> selectedOutPuts.indexOf(x.outputTypeId) >= 0 && x.outputTypeEnumId == "OutTyTax"),
            selectedInsOutput = initData?.GetPagOpt?.OutputList.find(x=> selectedOutPuts.indexOf(x.outputTypeId) >= 0 && x.outputTypeEnumId == "OutTyInsurance")


            let defaultPayFor = selectedBankOutput?.PayFor || "",
                defaultPaymentDescription = selectedBankOutput?.TransDescription || "",
                defaultTax = selectedTaxOutput?.TaxPaymentMethod || "",
                defaultIns = selectedInsOutput?.OPTNumberInsurList || "",
                defaultInsDesc = selectedInsOutput?.OPTDicInsurList || ""

            set_formValues({...formValues,"paymentFor":defaultPayFor,"paymentDescription":defaultPaymentDescription,"taxPaymentMethod":defaultTax,"payArrearsinsuranceNumber":defaultIns,"payArrearsDescription":defaultInsDesc})
           
        }
       
    }

    useEffect(()=>{
        let processInstanceId = formVariables?.processInstanceId
        // if(!processInstanceId){
            getData()
        // }
        // else{
        //     setInitData(formVariables)
        // }
        if(formVariables){
            set_formValues(formVariables)
            if(formVariables.comments)
            comments.set(formVariables.comments)
        }
    },[])

    useEffect(()=>{
        setDefaultValues()
    },[formValues.outputs])

    useEffect(()=>{
        let file = formValues.paymentBillImage
        console.log("file",file)
        if(file){
            if(file['type'].split('/')[0] === 'image'){
                if(file.size < 1024000){
                    let bodyFormData = new FormData();
                    bodyFormData.append("file", file)
        
                    axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile",bodyFormData, axiosKey)
                        .then(res => {
                            set_formValues({...formValues,"paymentBillImageName":res.data.name})
                        }).catch(() => {
                        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
                    });
                }
                else{
                    set_formValues({...formValues,"paymentBillImage":""})
                    dispatch(setAlertContent(ALERT_TYPES.ERROR,"حجم فایل نباید بیشتر از 1 مگابایت باشد"));
                }
            }
            else{
                dispatch(setAlertContent(ALERT_TYPES.ERROR,"فقط فایل عکس ارسال شود."));
                set_formValues({...formValues,"paymentBillImage":""})
            }
        }
       
    },[formValues.paymentBillImage])
    
    useEffect(()=>{
        let outpusDesc=""
        let sendTypesDesc=""
        if(formValues.outputs){
            let selectedOutPuts = JSON.parse(formValues.outputs)
            let outpus = initData?.GetPagOpt?.OutputList.filter(x=> {return selectedOutPuts.indexOf(x.outputTypeId) >= 0 }).map(x=>x.title)

            outpusDesc = outpus.join()
        }
        if(formValues.payslipSendType){
            let selectedoutpusDesc = JSON.parse(formValues.payslipSendType)
            let outpus = initData?.GetPagOpt?.PayslipSendType.filter(x=> {return selectedoutpusDesc.indexOf(x.enumId) >= 0 }).map(x=>x.description)

            sendTypesDesc = outpus.join()
        }
        
        set_formVariables({...formVariables,...formValues,outpusDesc:outpusDesc,sendTypesDesc:sendTypesDesc})
    },[formValues])
    
    useEffect(()=>{
        if(initData && formVariables.payslipTypeId){
            if(initData?.GetActionOpt?.ActionOpt){
                initData.GetActionOpt.ActionOpt.forEach(e => e.status = true);
            }
            let defaultOutputs = initData?.GetPagOpt?.OutputList.filter(x=>{
                return x.payslipTypeId.indexOf(formVariables.payslipTypeId) >= 0
            })
            let defaultOutputsIds = defaultOutputs?.map(a => a.outputTypeId),
            stringList = JSON.stringify(defaultOutputsIds),
            defaultSendTypes = initData?.GetPagOpt?.PayslipSendType.filter(x=>{
                return x.defualt == "Yes"
            }),
            defaultSendTypesId = defaultSendTypes?.map(a => a.enumId),
            sendTypeString = JSON.stringify(defaultSendTypesId),
            outputs= stringList || "" ,
            sendTypes = sendTypeString || ""
            
            
            set_formValues({...formValues,"outputs":outputs,"payslipSendType":sendTypes,"taxPaymentMethod":""})
            setDefaultValues()
            setFieldsInfo(initData?.GetPagOpt)
            set_formVariables({...formVariables,'payslipActionList':initData?.GetActionOpt?.ActionOpt || [],'payslipPaygroupList':initData?.GetPagOpt?.PayGroupOpt})
        }

    },[initData])

    const getData = () => {
        axios.get(SERVER_URL + `/rest/s1/payroll/getAllPageInfo?timePeriodId=${formVariables?.timePeriodId}&PayslipTypeId=${formVariables?.payslipTypeId}&PayGroup=${formVariables?.partyClassificationId}`, axiosKey).then(res => { /* todo: rest? */
            setInitData(res.data)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    const newOrder = () => {
        window.location.reload();
    }

    const goBack = () => {
        goToStep();
    }

    return (
        <React.Fragment>
            {pageState == "default" ? 
            <>
            <CardHeader title="تنظیمات حقوق و دستمزد"/>
            <CardContent>
                <FormPro
                    formValues={formValues}
                    setFormValues={set_formValues}
                    formDefaultValues={formDefaultValues}
                    formValidation={formValidation}
                    setFormValidation={set_formValidation}
                    prepend={formStructure}
                    actionBox={
                        <ActionBox>
                            <Button type="submit" role="primary"
                                    disabled={waiting}
                                    endIcon={waiting?<CircularProgress size={20}/>:null}>
                                ارسال
                            </Button>
                            <Button role="secondary"
                                    disabled={waiting}
                                    onClick={goBack}
                                  >
                                صفحه قبل
                            </Button>
                        </ActionBox>
                    }
                    submitCallback={handle_submit}
                >
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <TabPro initData={initData} tabs={tabs}/>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CommentBox context={comments}/>
                        </Card>
                    </Grid>
                </FormPro>
            </CardContent>
            </>
            :
            <>
                 <Box textAlign="center" py={5}>
                    <Button onClick={newOrder} color="secondary" variant="contained">فرایند حقوق و دستمزد جدید</Button>
                </Box>
            </>
            }
           
        </React.Fragment>
    )
}
