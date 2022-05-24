import React, {useEffect, useState} from "react";
import TablePro from "../../../../../components/TablePro";
import useListState from "../../../../../reducers/listState";
import FormPro from "../../../../../components/formControls/FormPro";
import ActionBox from "../../../../../components/ActionBox";
import {Button} from "@material-ui/core";
import {useDispatch} from "react-redux";
import axios from "../../../../../api/axiosRest";
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function TaxJurisdictions({parentKey, parentKeyValue}) {
    const primaryKey = "partyRelationshipId"
    const [data, set_data] = useState({
        organs: [],
        branches: [],
    })
    const dataList = useListState(primaryKey)
    const tableColumns = [{
        name    : "relationshipName",
        label   : "عنوان حوزه مالیات",
        type    : "text",
    },{
        name    : "organPartyId",
        label   : "سازمان",
        type    : "select",
        options : data.organs,
        optionIdField: "partyId",
        optionLabelField: "organizationName"
    },{
        name    : "branchPartyId",
        label   : "شعبه",
        type    : "select",
        options : data.branches,
        optionIdField: "partyId",
        optionLabelField: "organizationName",
    }]
    function handle_remove(row) {
        return new Promise((resolve, reject) => {
            axios.delete(`/s1/fadak/deleteFinanceArea?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }
    function get_dataList() {
        axios.get("/s1/fadak/financeList").then(res => {
            dataList.set(res.data.financeList)
        }).catch(() => {
            dataList.set([])
        });
    }

    useEffect(()=>{
        get_dataList()
    },[parentKeyValue])

    useEffect(()=>{
        axios.get("/s1/fadak/financeOrgans").then(res => {
            set_data(prevState => ({...prevState, organs: res.data.organs}) )
        }).catch(() => {});
        axios.get("/s1/fadak/financeBranches").then(res => {
            set_data(prevState => ({...prevState, branches: res.data.branches }) )
        }).catch(() => {});
    },[])

    return (
        <Box p={2}>
            <Card variant="outlined">
                <TablePro
                    title="لیست حوزه های مالیات"
                    columns={tableColumns}
                    rows={dataList.list||[]}
                    setRows={dataList.set}
                    loading={dataList.list===null}
                    add="external"
                    addForm={<TableForm data={data} parentKey={parentKey} parentKeyValue={parentKeyValue}/>}
                    edit="external"
                    editForm={<TableForm data={data} parentKey={parentKey} parentKeyValue={parentKeyValue} editing={true}/>}
                    removeCallback={handle_remove}
                />
            </Card>
        </Box>
    )
}

function TableForm({editing=false, parentKey, parentKeyValue, data,...restProps}) {
    const [formValidation, setFormValidation] = useState({});
    const {formValues, setFormValues, oldData={}, successCallback, failedCallback, handleClose} = restProps;
    const dispatch = useDispatch();
    const [waiting, set_waiting] = useState(false)
    const formDefaultValues = {}
    const formStructure = [{
        name    : "relationshipName",
        label   : "عنوان حوزه مالیات",
        type    : "text",
    },{
        name    : "pseudoId",
        label   : "حوزه حقوق",
        type    : "text",
    },{
        name    : "organPartyId",
        label   : "سازمان",
        type    : "select",
        options : data.organs,
        optionIdField: "partyId",
        optionLabelField: "organizationName",
        changeCallback: () => setFormValues( prev => ({...prev, branchPartyId: null}))
    },{
        name    : "branchPartyId",
        label   : "شعبه و نمایندگی",
        type    : "select",
        options : data.branches,
        optionIdField: "partyId",
        optionLabelField: "organizationName",
        disabled: !formValues["organPartyId"],
        filterOptions: options => options.filter(o=>o["ownerPartyId"]===formValues["organPartyId"]),
        getOptionLabel  : opt => opt ? (`${opt.pseudoId} ─ ${opt.organizationName}` || "؟") : ""
    },{
        name    : "id5",
        label   : "شماره شعبه سازمان",
        type    : "text",
    }]

    const handle_add = ()=>{
        let data = {...formValues , [parentKey]: parentKeyValue }
        axios.post("/s1/fadak/createFinanceArea", { newFinance : data}).then((res) => {
            setFormValues(formDefaultValues)
            successCallback(formValues)
            set_waiting(false)
            successCallback({...formValues, ...res.data})
        }).catch(() => {
            set_waiting(false)
            failedCallback()
        });
    }
    const handle_edit = ()=>{
        axios.put("/s1/fadak/updateFinanceArea", {editedFinance: formValues}).then(() => {
            setFormValues(formDefaultValues)
            set_waiting(false)
            successCallback(formValues)
        }).catch(() => {
            set_waiting(false)
            failedCallback()
        });
    }

    // useEffect(()=>{
    //     if(!editing){
    //         setFormValues(prevState=>({
    //             ...prevState,
    //             ...formDefaultValues
    //         }))
    //     }
    // },[])

    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formDefaultValues={formDefaultValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{
                set_waiting(true)
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
                if(editing){
                    handle_edit()
                }else{
                    handle_add()
                }
            }}
            resetCallback={()=>{handleClose()}}
            actionBox={<ActionBox>
                <Button type="submit" role="primary" disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}>{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary" disabled={waiting}>لغو</Button>
            </ActionBox>}
        />
    )
}
