import React, { createRef, useState } from "react";
import { FusePageSimple } from "../../../../../@fuse";
import TabPro from "../../../components/TabPro";
import ExcPerformance from "./tabs/excPerf";
import ExcCost from "./tabs/excCost";
import PersonnelSelection from "./tabs/PersonnelSelection";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { CardContent, CardHeader, Box, Button, Card , Divider, Grid, Typography } from "@material-ui/core";
import {Image, Visibility, Wallpaper} from "@material-ui/icons";
import UserCompany from "../../../components/formControls/UserCompany";
import UserFullName from "../../../components/formControls/UserFullName";

import TablePro from "app/main/components/TablePro";
import axios from "axios";
import { SERVER_URL } from "../../../../../configs";
import { ALERT_TYPES, setAlertContent, setUser, setUserId } from "../../../../store/actions/fadak";
import { useDispatch } from "react-redux";
import { get } from 'lodash';
import useListState from "../../../reducers/listState";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import CloudUpload from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";


export default function PayrollAccounting() {
    const [formValues, setFormValues] = useState()
    // const handleSubmit = () => { }
    const handleReset = () => {setFormValues({})}
    const myScrollElement = createRef();
    const [Performance, setPerformance] = useState([])
    const PersonnelSelections = useListState("partyRelationshipId",[])
    const Personnel = useListState("partyRelationshipId",[])
    const [cost, setCost] = useState([])
    const [fieldsData, setFieldsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [loading2, setLoading2] = useState(false)
    const primaryKey = "excProgFormId"
    const primaryKeyPerf = "ExcPerformanceId"
    const primaryKeyCost = "excCostId"
    const primaryKeySelected = "selectedPersonnelId"
    const dataListPerf = useListState(primaryKeyPerf)
    const dataListCost = useListState(primaryKeyCost)
    const selectedPersonnel = useListState(primaryKeySelected)

    const handleSubmit = () => {
        console.log("formValues : ", formValues)
        console.log("dataListPerf : ", dataListPerf)
        console.log("dataListCost : ", dataListCost)

        axios.post(SERVER_URL + "/rest/s1/exellence/excProgram", { dataListPerf: dataListPerf, dataListCost: dataListCost, formValues: formValues , selectedPersonnel:selectedPersonnel}, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            }
        }).then(res => {
            setFormValues({})
        }).catch(err => {
        })
    }

    // const handleReset = () => {
    //     setFormValues({})
    // }

    React.useEffect(() => {
        GetData() 
    }, []);

    function GetData () {
        axios.get(SERVER_URL + "/rest/s1/exellence/executionProgram", {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(res => {
            console.log("res", res)
            setFieldsData(res.data)
            Personnel.set(res.data.exProgPersonnelSelection.personUserRel)
            setPerformance(res.data.exProgPerformance)
            setCost(res.data.costCapacity)

            console.log("setPersonnelSelections : ", res.data.exProgPersonnelSelection)

            console.log("res.data.exProgPerformance.ProgPerformance : ", res.data.exProgPerformance)

            setLoading(false)
            // getVerifList()

        }).catch(err => {
            console.log('get org error..', err);
        });
    }


    const formStructure = [
        {
            name: "trackingCode",
            label: " ???? ????????????",
            type: "display",
            required:true,

        }, 
        {
            name: "creatorEmplePositionId",
            type: "component",
            component: <UserFullName label="?????? ?? ?????? ???????????????? ?????????? ??????????" />,
            required:true,
 

        },
        // {
        //     type:   "component",
        //     component: <UserCompany/>
        // }, 
        {
            name: "WetProject",
            label: " ?????????? ???????????? ??????????????",
            type: "select",
            options: fieldsData?.WetProject,
            optionLabelField: "workEffortName",
            optionIdField: "workEffortId",
        },
        {
            name: "operationalActionId",
            label: " ?????????? ???????????? ?????????????? ",
            type: "select",
            options: fieldsData?.WetTask,
            optionLabelField: "workEffortName",
            optionIdField: "workEffortId",
        },
        {
            name: "excProgId",
            label: "?????? ???????????? ???????????? ",
            type: "select",
            required:true,
            options: fieldsData?.excProgDef,
            optionLabelField: "title",
            optionIdField: "excProgId",
        },
        {
            name: "title",
            label: " ?????????? ???????????? ",
            type: "text",
        },
        {
            name: "progResponsibleEmplPositionId",
            label: " ?????????? ?????????????? ",
            type: "select",
            required:true,
            options: fieldsData?.emplComp,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
        },
        {
            name: "location",
            label: "???????? ?????????????? ",
            type: "text",
            required:true,
        },
        {
            label: "?????????? ???????? ",
            name: "fromDate",
            type: "date",
            required:true,

        },
        {
            name: "thruDate",
            label: " ?????????? ?????????? ",
            type: "date",
            required:true,
       
        },

        {
            label: "?????????? ?????????? ",
            name: "presenter",
            type: "text",
        },
        {
            label: "?????? ?? ?????? ",
            name: "transportationEnumId",
            type: "select",
            required:true,

            options: fieldsData?.transport,
            optionLabelField: "description",
            optionIdField: "enumId",
        },
        {
            label: " ?????????? ???????? ??????????????? ",
            name: "enrollmentFromDate",
            type: "date",
        },
        {
            name: "enrollmentThruDate",
            label: " ?????????? ?????????? ??????????????? ",
            type: "date",
        },
        {
            label: "???????? ?????? ?????????????? ?????????? ",
            name: "personelPayment",
            type: "number",
        },
        {
            label: "???????? ?????? ?????????????? ?????????????? ?????????? ",
            name: "organizationPayment",
            type: "number",
        },
        {
            label: "???????? / ???????????? ?????????? ",
            name: "mentorPartyRelId",
            type: "select",
            required:true,

            options: fieldsData?.personUserRel,
            optionLabelField: "userFullName",
            optionIdField: "partyId",
        },
        {
            label: "???????? ???????????? ??????????",
            name: "paymentType",
            type: "select",
            options: fieldsData?.paymentType,
            optionLabelField: "description",
            optionIdField: "enumId",
        }, {
            label: "???????????? ?????? ?????? ???? ????????",
            name: "payslipArre",
            type: "multiselect",
        }, {
            type    : "component",
            col     : {sm: 8, md: 3},
            component   : (
                <Box display="flex" className="outlined-input" >
                    <Box flexGrow={1} style={{padding:"18px 14px"}}>
                        <Typography color="textSecondary">??????????</Typography>
                    </Box>
                    <Box style={{padding:"3px 14px"}}>
                        <input type="file" style={{display: "none"}}/>
                        <Tooltip title="?????????? ????????" >
                            <IconButton >
                                <CloudUpload/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="?????? ???????? ?????????? ??????" >
                            <IconButton>
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="???????????? ???????? ?????????? ??????" >
                            <IconButton>
                                <Visibility/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            )
        }, {
            label: "?????? ?????????? ??????????",
            name: "responsibleDuties",
            type: "textarea",
            col: 6,
            required:true,

        },
        {
            label: "??????????????",
            name: "description",
            type: "textarea",
            col: 6
        }
    ]
    console.log("PersonnelSelections form: " + PersonnelSelections)

    const tabs = [{
        label: "?????????????? ??????????",
        panel: <PersonnelSelection scrollTop={scroll_to_top} PersonnelSelections={PersonnelSelections} personnel={Personnel} selectedPersonnel={selectedPersonnel} />
    }, {
        label: "?????????? ??????????????????",
        panel: <ExcPerformance scrollTop={scroll_to_top} Performance={Performance} GetData={GetData} dataListPerf={dataListPerf} setPerformance={setPerformance} />
    }, {
        label: "?????????? ?? ?????????? ????????????",
        panel: <ExcCost scrollTop={scroll_to_top} cost={cost} dataListCost={dataListCost} setCost={setCost} />
    }
    ]


    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 70;
    }
    return (
        <FusePageSimple
            ref={myScrollElement}
            // header={<CardHeader title={'?????????? ???????????? ??????????'} />}
            header={<Box>
                <CardHeader title={'?????????? ???????????? ????????????'} />
            </Box>}
            content={
                <>
                    <Box p={2}>
                        <Card>

                            <CardContent>

                                <FormPro
                                    prepend={formStructure}
                                    formValues={formValues}
                                    setFormValues={setFormValues}

                                    submitCallback={handleSubmit}
                                    resetCallback={handleReset}
                                />

                            </CardContent>

                        </Card>

                        <Card>

                            <CardContent>
                                <TabPro tabs={tabs} />

                            </CardContent>
                            
                        </Card>
                        <Card >
                        <CardContent>

                            <ActionBox>
                                <Button type="submit" onClick={handleSubmit} role="primary">????????????</Button>
                                <Button type="reset" onClick={handleReset} role="secondary">??????</Button>
                            </ActionBox>
                            </CardContent>

                            </Card>
                    </Box>







                    {/*                    
                   
                    <FormPro
                        prepend={formStructure}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        actionBox={<ActionBox>
                            <Button type="submit" role="primary">????????????</Button>
                            <Button type="reset" role="secondary">??????</Button>
                        </ActionBox>}
                        submitCallback={handleSubmit}
                        resetCallback={handleReset}
                    />

                    <TabPro tabs={tabs}/> */}
                </>
            }
        />
    )
}
