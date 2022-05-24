import React, {useEffect, useState} from "react";
import ActionBox from "../../../../components/ActionBox";
import {Button, CardContent, CardHeader, Grid, Card, box} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import UserFullName from "../../../../components/formControls/UserFullName";
import UserEmplPosition from "../../../../components/formControls/UserEmplPosition";
import TransferList from "../../../../components/TransferList";
import useListState from "../../../../reducers/listState";
import axios from "../../../../api/axiosRest";
import CircularProgress from "@material-ui/core/CircularProgress";
import PersonnelSelectionFilter from "./PersonnelSelectionFilter"
import { useHistory } from "react-router-dom";
import TablePro from "app/main/components/TablePro";
// import FormPro from "app/main/components/formControls/FormPro";
// import ActionBox from 'app/main/components/ActionBox';


export default function PersonnelSelection({nextStep,formVariables,fieldsInfo}) {
    const moment = require("moment-jalaali");
    const formDefaultValues = {
        createDate: moment().format("Y-MM-DD"),
    }


   
    /* ##############################################         table     Registration     ################################################### */
    const tableColsRegistration = [
        {
            name: "a",
            label: "پرسنل",
            type: "text",
        },
        {
            name: "b",
            label: " برنامه فرهنگی  ",
            type: "text",
        },
        
        {
            name: "b",
            label: "همراهان",
            type: "indicator",
        },
    ]


    const primaryKey = "userId"
    const personnel = useListState(primaryKey)
    const selectedPersonnel = useListState(primaryKey)
    const [waiting, set_waiting] = useState(false)
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [filterValues,setFilterValues] = useState({});
    const [timeType,setTimeType] = useState("");

    const history = useHistory();

    const formStructure = [
    {
        name    : "trackingCode",
        label   : "نام مربی",
        type    : "text",
    },{
        name    : "createDate",
        label   : "نوع برنامه فرهنگی",
        type    : "select",
    },{
        name    : "createDate",
        label   : "عنوان برنامه",
        type    : "text",
        col     : 6,
    },{
        name    : "createDate",
        label   : "تاریخ شروع",
        type    : "date",
    },{
        name    : "createDate",
        label   : "تاریخ پایان",
        type    : "date",
    },{
        name    : "createDate",
        label   : "مسئول برگزاری",
        type    : "multiselect",
        value : "[]",
    },{
        name    : "createDate",
        label   : "ارائه دهنده",
        type    : "text",
    }]

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
        set_waiting(true)
        const packet = {
            ...formValues,
            personnel: selectedPersonnel.list
        }
        nextStep(packet)
            set_waiting(false)
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
        if(formVariables){
            set_formValues(formVariables)

        }
        if(personnel?.list?.length > 0 && formVariables?.personnel){
            selectedPersonnel.set(formVariables.personnel)
        }
    },[personnel])

    useEffect(()=>{
        if(formValues?.partyClassificationId && selectedPersonnel?.list?.length == 0) {
            selectedPersonnel.set(selectedPersonnel.list.concat(fieldsInfo?.PersonelPayGroup.result.filter(i=>i.paygroup == formValues?.partyClassificationId)))
            personnel.set(fieldsInfo?.PersonelPayGroup.result.filter(i=>i.paygroup !== formValues?.partyClassificationId))
        }
    },[formValues?.partyClassificationId])

    useEffect(()=>{
        if(formValues?.payslipTypeId) {
            const ind = fieldsInfo?.payslipType.findIndex(i=>i.payslipTypeId == formValues?.payslipTypeId ) 
            setTimeType(fieldsInfo?.payslipType[ind]?.timePeriodTypeId)
        }
        if(!formValues?.payslipTypeId || formValues?.payslipTypeId == "") {
            formValues.timePeriodId = ""
            formValues.fromDate = ""
            formValues.thruDate = ""
            set_formValues(Object.assign({},formValues))
        }
    },[formValues?.payslipTypeId])

    const handle_add_participant = (parties) =>
        new Promise((resolve, reject) => {
            resolve(parties)
    });

    const handle_delete_participant = (parties) =>
        new Promise((resolve, reject) => {
        resolve(parties);
    });

    function handleReset() {
        history.push('/dashboard')
    }
    const [tableContentRegistration, setTableContentRegistration] = useState([])
    const [loadingRegistration, setLoadingRegistration] = useState(true)
    const handleEditRegistration = () => { }
    const handlerRemoveRegistration = () => { }
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

                >

 
                </FormPro>
                <TablePro
                                title="لیست اطلاعات تردد"
                                columns={tableColsRegistration}
                                rows={tableContentRegistration}
                                setRows={setTableContentRegistration}
                                loading={loadingRegistration}
                                edit="callback"
                                editCallback={handleEditRegistration}
                                delete="inline"
                                removeCallback={handlerRemoveRegistration}

                            

                            />

                        <ActionBox>
                            <Button type="submit" role="primary"
                                onClick={nextStep}
                                    // disabled={waiting||selectedPersonnel.length===0}
                                    endIcon={waiting?<CircularProgress size={20}/>:null}>
                                مرحله بعد
                            </Button>
                            <Button type="reset" role="secondary">
                               لغو
                            </Button>
                        </ActionBox>
            </CardContent>
        </React.Fragment>
    )
}
