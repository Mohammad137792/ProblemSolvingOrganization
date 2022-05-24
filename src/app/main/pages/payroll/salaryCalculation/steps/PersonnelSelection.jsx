import React, {useEffect, useState} from "react";
import ActionBox from "../../../../components/ActionBox";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import UserFullName from "../../../../components/formControls/UserFullName";
import UserEmplPosition from "../../../../components/formControls/UserEmplPosition";
import TransferList from "../../../../components/TransferList";
import useListState from "../../../../reducers/listState";
import axios from "../../../../api/axiosRest";
import CircularProgress from "@material-ui/core/CircularProgress";
import PersonnelSelectionFilter from "./PersonnelSelectionFilter"
import { useHistory } from "react-router-dom";
import { ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {useDispatch, useSelector} from "react-redux";


export default function PersonnelSelection({goToStep,formVariables,fieldsInfo}) {
    const moment = require("moment-jalaali");
    const formDefaultValues = {
        createDate: moment().format("Y-MM-DD"),
    }
    const primaryKey = "userId"
    const personnel = useListState(primaryKey)
    const selectedPersonnel = useListState(primaryKey)
    const [waiting, set_waiting] = useState(false)
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [filterValues,setFilterValues] = useState({});
    const [timeType,setTimeType] = useState("");

    const history = useHistory();
    const dispatch = useDispatch();

    const formStructure = [
    {
        name    : "trackingCode",
        label   : "کد رهگیری",
        type    : "display",
    },{
        name    : "createDate",
        label   : "تاریخ صدور",
        type    : "display",
        options : "Date",
    },{
        type    : "component",
        component: <UserFullName label="تهیه کننده" name="producerPartyRelationshipId" name2="producerFullName" setValue={set_formValues} valueHandler={set_formValues} />
    },{
        type    : "component",
        component: <UserEmplPosition label="پست سازمانی تهیه کننده" name="producerEmplPositionId" valueObject={formValues} valueHandler={set_formValues}
                                     getOptionLabel={opt => opt ? (`${opt.pseudoId} ─ ${opt.description}` || "؟") : ""}/>
    },{
        name    : "partyClassificationId",
        label   : "گروه حقوقی",
        type    : "select",
        options :  fieldsInfo.paygroup,
        optionIdField   : "partyClassificationId",
        optionLabelField: "description",
        required: true,
        otherOutputs: [{name: "partyClassification", optionIdField: "description"}]
    },{
        name    : "payslipTypeId",
        label   : "نوع فیش حقوقی",
        type    : "select",
        options : fieldsInfo.payslipType ,
        filterOptions: options => options.filter(o=>o["payGroupPartyClassificationId"].indexOf(formValues.partyClassificationId) >= 0) ,
        optionIdField   : "payslipTypeId",
        optionLabelField: "title",
        disabled: !formValues?.partyClassificationId || formValues?.partyClassificationId==="" ,
        required: true,
        otherOutputs: [{name: "payslipType", optionIdField: "title"},
            {name: "timePeriodTypeId", optionIdField: "timePeriodTypeId"}]
    },{
        name    : "timePeriodId",
        label   : "دوره زمانی",
        required: true,
        type    : "select",
        options : fieldsInfo.periodTime,
        filterOptions: options => options.filter(o=> formValues.timePeriodTypeId == o.timePeriodTypeId) ,
        optionIdField   : "timePeriodId",
        optionLabelField: "periodName",
        disabled: !formValues?.payslipTypeId || formValues?.payslipTypeId==="" ,
        otherOutputs    : [{name: "periodName", optionIdField: "periodName"},
            {name: "periodFromDate", optionIdField: "fromDate"},
            {name: "periodThruDate", optionIdField: "thruDate"}],
    },{
        name    : "periodFromDate",
        label   : "از تاریخ",
        type    : "display",
        options : "Date",
    },{
        name    : "periodThruDate",
        label   : "تا تاریخ",
        type    : "display",
        options : "Date",
    },]

    const filter_selected_personnel = (parties) => {
        if(selectedPersonnel.list) {
            return parties.filter(i => selectedPersonnel.list.findIndex(j => j[primaryKey] === i[primaryKey]) < 0)
        }else{
            return parties
        }
    }
    const load_personnel = (filter) => {
        personnel.set(null)
        axios.get("/s1/fadak/searchPersonnelAndEmplOrder",{params: filter}).then(res => { /* todo: rest? */
            personnel.set(filter_selected_personnel(res.data.result))
        }).catch(() => {
            personnel.set([])
        });
    }
    
    const load_audience = () => {
        selectedPersonnel.set([])
    }
    const submitHandler = () => {
        console.log("formValues",formValues)
        
        const packet = {
            ...formValues,
            personnel: selectedPersonnel.list
        }

        let allHaveBankAccounts = true

        for (let i = 0 ; i < packet.personnel.length ; i++ ){
            if(!packet.personnel[i].accountNumber){
                allHaveBankAccounts = false
            }

            if(i == packet.personnel.length-1){
                if(allHaveBankAccounts){
                    set_waiting(true)
                    goToStep(packet)
                    set_waiting(false)
                }
                else{
                    dispatch(setAlertContent(ALERT_TYPES.ERROR,"حداقل برای یکی از افراد انتخاب شده حساب بانکی تعریف نشده است."));

                }
            }
        }
        
           
    }
    const display_org_info = (item) => {
        let info = []
        if(item.emplPosition) info.push(item.emplPosition)
        if(item.unitOrganization) info.push(item.unitOrganization)
        if(item.organizationName) info.push(item.organizationName)
        return info.join("، ") || "─"
    }
    const display_name = (item) => `${item.pseudoId} ─ ${item.firstName||'-'} ${item.lastName||'-'} ${item.suffix||''}`

    useEffect(()=>{
        if(fieldsInfo?.PersonelPayGroup){
            load_audience()
            personnel.set(filter_selected_personnel(fieldsInfo.PersonelPayGroup.result))
        }
    },[fieldsInfo])

    useEffect(()=>{
        if(formVariables && Object.keys(formVariables).length > 0){
            set_formValues(formVariables)
        }
    },[formVariables])

    useEffect(()=>{
        if(formVariables && Object.keys(formVariables).length > 0 && !formValues?.partyClassificationId){
            set_formValues(formVariables)
        }
        if(personnel?.list?.length > 0 && formVariables?.personnel){
            selectedPersonnel.set(formVariables.personnel)
        }
    },[personnel])

    useEffect(()=>{
        let selectedPayslip = fieldsInfo.payslipType.find(x=>x.payslipTypeId == formValues.payslipTypeId) 
        if(selectedPayslip?.payGroupPartyClassificationId?.indexOf(formValues.partyClassificationId) < 0 || !formValues.partyClassificationId || formValues.partyClassificationId == ""){
            formValues.payslipTypeId = ""
        }
            
        let selectedTimePeriod = fieldsInfo.periodTime.find(x=>x.timePeriodId == formValues.timePeriodId) 
        if(timeType == selectedTimePeriod?.timePeriodTypeId || !formValues?.payslipTypeId || formValues?.payslipTypeId == ""){
            formValues.timePeriodId = ""
            formValues.periodFromDate = ""
            formValues.periodThruDate = ""
        }
            
        set_formValues(Object.assign({},formValues))
        if(formValues?.partyClassificationId && selectedPersonnel?.list?.length == 0) {
            let selected = selectedPersonnel?.list?.concat(fieldsInfo?.PersonelPayGroup?.result.filter(i=>i.paygroup.find(x=>x.partyClassificationId == formValues?.partyClassificationId))) ,
            personSelected = (selected && selected.filter(Boolean).length > 0) ? selected.filter(Boolean) : []

            selectedPersonnel.set(personSelected)
            personnel.set(fieldsInfo?.PersonelPayGroup?.result.filter(i=>i.paygroup !== formValues?.partyClassificationId))
        }
        else{
            selectedPersonnel.set([])
            personnel.set(fieldsInfo?.PersonelPayGroup?.result)
        }
        // if(formValues && !formValues?.partyClassificationId || formValues?.partyClassificationId == ""){
            
        // }
    },[formValues?.partyClassificationId])

    useEffect(()=>{
       
        // if(formValues?.payslipTypeId) {
        //     const ind = fieldsInfo?.payslipType.findIndex(i=>i.payslipTypeId == formValues?.payslipTypeId ) 
        //     setTimeType(fieldsInfo?.payslipType[ind]?.timePeriodTypeId)
        // }
        // if(formValues && !formValues?.payslipTypeId || formValues?.payslipTypeId == "") {
            
            let selectedTimePeriod = fieldsInfo.periodTime.find(x=>x.timePeriodId == formValues.timePeriodId) 
            if(timeType == selectedTimePeriod?.timePeriodTypeId || !formValues?.payslipTypeId || formValues?.payslipTypeId == ""){
                formValues.timePeriodId = ""
                formValues.periodFromDate = ""
                formValues.periodThruDate = ""
            }
            set_formValues(Object.assign({},formValues))
        // }
    },[formValues?.payslipTypeId])

    const handle_add_participant = (parties) =>
        new Promise((resolve, reject) => {
            if(formValues.partyClassificationId){
                let solidExist = parties.map(party=> {return !party.paygroup.find(x => x.partyClassificationId == formValues.partyClassificationId)})
                if(solidExist.every(v => v === false)){
                    resolve(parties)
                }
                else{
                    dispatch(setAlertContent(ALERT_TYPES.ERROR,"حداقل یکی از افراد انتخاب شده در گروه حقوقی مورد نظر عضویت ندارد."));
                    reject()
                }
            }
            else{
                dispatch(setAlertContent(ALERT_TYPES.ERROR,"ابتدا گروه حقوقی را انتخاب کنید."));
                reject()
            }
    });

    const handle_delete_participant = (parties) =>
        new Promise((resolve, reject) => {
        resolve(parties);
    });

    function handleReset() {
        history.push('/dashboard')
    }

    return (
        <React.Fragment>
            <CardHeader title="انتخاب پرسنل"/>
            <CardContent>
                <FormPro
                    formValues={formValues}
                    setFormValues={set_formValues}
                    formDefaultValues={formDefaultValues}
                    formValidation={formValidation}
                    setFormValidation={set_formValidation}
                    prepend={formStructure}
                    resetCallback={handleReset}
                    actionBox={
                        <ActionBox>
                            <Button type="submit" role="primary"
                                    disabled={waiting||selectedPersonnel.length===0}
                                    endIcon={waiting?<CircularProgress size={20}/>:null}>
                                مرحله بعد
                            </Button>
                            <Button type="reset" role="secondary">
                               لغو
                            </Button>
                        </ActionBox>
                    }
                    submitCallback={submitHandler}
                >
                    <Grid item xs={12}>
                        <TransferList
                            rightTitle="لیست پرسنل"
                            rightContext={personnel}
                            rightItemLabelPrimary={display_name}
                            rightItemLabelSecondary={display_org_info}
                            leftTitle="لیست پرسنل انتخاب شده"
                            leftContext={selectedPersonnel}
                            leftItemLabelPrimary={display_name}
                            leftItemLabelSecondary={display_org_info}
                            onMoveLeft={handle_add_participant}
                            onMoveRight={handle_delete_participant}
                            rightFilterForm={
                                <PersonnelSelectionFilter
                                    formValues={filterValues}
                                    setFormValues={setFilterValues}
                                    searchFunction={load_personnel}
                                />
                            }
                        />
                    </Grid>
                </FormPro>
            </CardContent>
        </React.Fragment>
    )
}
