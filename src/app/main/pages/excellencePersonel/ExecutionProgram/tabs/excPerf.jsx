import React, {useEffect, useState} from "react";
import {Box, Button, CardContent, CardHeader} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import useListState from "../../../../reducers/listState";
import axios from "../../../../api/axiosRest";
import {useDispatch} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import { SERVER_URL } from "../../../../../../configs";

const formDefaultValues = {}
const defaultAction = {type: "add", payload: ""}
const primaryKeyPerf = "ExcPerformanceId"

export default function ExcPerformance({ dataListPerf, Performance , scrollTop, GetData}) {
    
    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const [PerformanceList, setPerformanceList] = useState([])
    const [table, setTable] = useState([])

    // const dataListPerf = useListState(primaryKeyPerf)
    const parentDetAccounts = dataListPerf.list || []
console.log("Performance : " , Performance)
    function handle_edit(row) {
        set_action({type: "edit", payload: row[primaryKeyPerf]})
    }
    function handle_remove(row) {
        set_action(defaultAction)
        return new Promise((resolve, reject) => {
            resolve()
         })
    }

    // const handleSubmit = () => {
    //     dataListPerf.add([formValues])
    // }

    const handleSubmit = () => {

        axios.post(SERVER_URL + "/rest/s1/exellence/excPerformanceProgram", { formValues: formValues }, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            }
        }).then(res => {
        
            // dataListPerf.add([formValues])
            GetData()
            set_formValues({})
            
        }).catch(err => {
        })
    }

    const formStructure = [{
        name    : "excProgId",
        label   : "?????? ??????????????????",
        type    : "select",
        options: Performance?.excProgDef,
        optionLabelField: "title",
        optionIdField: "excProgId",
        
    },{
        name    : "title",
        label   : "?????????? ",
        type    : "text",
    },{
        name    : "rootExcProgId",
        label   : "???????????? ????????????",
        type    : "select",
        options: Performance?.upperProg,
        optionLabelField: "title",
        optionIdField: "excProgId",
        
    },{
        name    : "excProgResponEmplPositionID",
        label   : "?????????? ??????????????",
        type    : "select",
        options: Performance?.emplComp,
        optionLabelField: "description",
        optionIdField: "emplPositionId",
        required:true,
        
    },{
        name    : "location",
        label   : "???????? ??????????????",
        type    : "text",
        required:true,
        
    },{
        name    : "presenter",
        label   : "?????????? ??????????",
        type    : "text",
        
    },{
        name    : "fromDate",
        label   : "?????????? ????????",
        type    : "date",
        required:true,
        
    },{
        name    : "thruDate",
        label   : "?????????? ??????????",
        type    : "date",
        required:true,
        

    },{
        name    : "transportationEnumId",
        label   : "?????? ?? ??????",
        type    : "select",
        options: Performance?.transport,
        optionLabelField: "description",
        optionIdField: "enumId",
        required:true,

    },{
        name    : "mentorPartyId",
        label   : "????????",
        type    : "select",
        options: Performance?.personUserRel,
        optionLabelField: "userFullName",
        optionIdField: "partyId",
        required:true,

    },{
        name    : "inputFile",
        label   : "???????????????? ?????????????? ????????",
        type    : "inputFile",
        
    },{
        name    : "responsibleDuties",
        label   : "?????? ?????????? ??????????",
        type    : "text",
        required:true,

        
    },{
        name    : "description",
        label   : "??????????????",
        type    : "textarea",
        col : 12,
        
    }]

    const tableColumns = [{
        name    : "excProgPerfId",
        label   : "?????? ??????????????????",
        type    : "select",
        
        options: Performance?.ProgPerformance,
        optionLabelField: "title",
        optionIdField: "excProgPerfId",
    },{
        name    : "title",
        label   : "?????????? ??????????????????",
        type    : "text",
    },{
        name    : "rootExcProgId",
        label   : "???????????? ????????????",
        type    : "select",
        options: Performance?.upperProg ,
        optionLabelField: "title",
        optionIdField: "excProgId",
        
    },{
        name    : "excProgResponEmplPositionID",
        label   : "?????????? ??????????????",
        type    : "select",
        options: Performance?.emplComp,
        optionLabelField: "description",
        optionIdField: "emplPositionId",

    },{
        name    : "mentorPartyId",
        label   : "???????? / ???????????? ??????????",
        type    : "select",
        options: Performance?.personUserRel,
        optionLabelField: "userFullName",
        optionIdField: "partyId",
    },{
        name    : "location",
        label   : "???????? ??????????????",
        type    : "text",
    },{
        name    : "presenter",
        label   : "?????????? ??????????",
        type    : "text",
    },{
        name    : "fromDate",
        label   : "?????????? ????????",
        type    : "date",
    },{
        name    : "thruDate",
        label   : "?????????? ??????????",
        type    : "date",
    },{
        name    : "transportationEnumId ",
        label   : "?????? ?? ??????",
        type    : "select",
        options: Performance?.transport,
        optionLabelField: "description",
        optionIdField: "enumId",

    },{
        name    : "description",
        label   : "??????????????",
        type    : "text",
    }];

    function get_dataListPerf() {
            dataListPerf.set(Performance.ProgPerformance)
    }

    useEffect(() => {
        if(action.type==="edit") {
            get_object(action.payload)
            scrollTop()
        }
    }, [action]);

    useEffect(() => {
            get_dataListPerf()
    }, [Performance]);
    
    function get_object(pk) {
        const object = dataListPerf.list.find(i=>i[primaryKeyPerf]===pk)
        set_formValues(object);
    }

    function handle_submit() {
         if(dataListPerf.list.findIndex(i => i["accountCode"]===formValues["accountCode"] && i[primaryKeyPerf]!==formValues[primaryKeyPerf] )>=0) {
            set_formValidation({
                accountCode: {error: true, helper: "???? ???????? ???????????? ??????!"}
            })
            return false
        }

    }
    function handle_cancel() {
        set_action({type: "add", payload: ""})
    }
    function handle_edit(row) {
        set_action({type: "edit", payload: row[primaryKeyPerf]})
    }
 

    return (
        <Box p={2}>
            <Card>
                {/* <CardHeader title="?????????? ???????? ????????????"/> */}
                <CardContent>
                    <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                             formValidation={formValidation} setformValidation={set_formValidation}
                             prepend={formStructure}
                             actionBox={<ActionBox>
                                 <Button type="submit" role="primary">{action.type==="add"?"????????????":"????????????"}</Button>
                                 <Button type="reset" role="secondary">??????</Button>
                             </ActionBox>}
                             submitCallback={handleSubmit}
                             resetCallback={handle_cancel}
                    />
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <TablePro
                    columns={tableColumns}
                    rows={dataListPerf?.list||[]}
                    setRows={dataListPerf.set}
                    loading={dataListPerf?.list===null}
                    edit="callback"
                    editCallback={handle_edit}
                    removeCallback={handle_remove}
                />
            </Card>
        </Box>
    )
}
