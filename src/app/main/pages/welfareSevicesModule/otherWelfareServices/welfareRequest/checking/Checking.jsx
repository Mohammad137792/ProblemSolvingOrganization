import React, {useState,useEffect} from "react";
import useListState from "../../../../../reducers/listState";
import {Box, Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from "../../../../../components/formControls/FormPro";
import Card from "@material-ui/core/Card";
import CommentBox from "../../../../../components/CommentBox";
import ActionBox from "../../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import ConfirmDialog, {useDialogReducer} from "../../../../../components/ConfirmDialog";
import axios from "../../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
import FormInput from "../../../../../components/formControls/FormInput";
import { makeStyles } from "@material-ui/core/styles";
import Attachment from "../Attachment";
import TablePro from 'app/main/components/TablePro';

const useStyles = makeStyles(() => ({
    headerTitle: {
      display: "flex",
      alignItems: "center",
    },
  }));
export default function Checking({formVariables, set_formVariables, submitCallback, taskId,fieldsInfo}) {
    const dialogCancellation = useDialogReducer(handle_cancel)
    const [waiting, set_waiting] = useState(null)
    const [actions, set_actions] = useState([])
    const dispatch = useDispatch();
    const dataList = useListState("levelId")
    const outputs = useListState()
    const classes = useStyles();
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    console.log("formVariables",formVariables)

    const vouchers = useListState("code",formVariables?.vouchers)
   
    const comments = useListState("id",formVariables?.comments || [])
        
    const [formValues, setFormValues] = React.useState();
    const [attachments, setAttachments] = useState(formValues?.attachments || []);
    const [personsContent,setPersonsContent]=useState([]);

    const profileValues = {
       
    }

    const topFormStructure = [
        {
            name    : "trackingCode",
            label   : "?????????????? ??????????",
            type    : "display",
        },{
            name    : "createDate",
            label   : "?????? ??????????????",
            type    : "display",
            options : "Date",
        },{
            name    : "producerFullName",
            label   : "????????????????",
            type    : "display",
        },{
            name    : "producerEmplPositionId",
            label   : "?????????? ??????????????",
            type    : "display",
            options : "EmplPosition",
            optionIdField: "emplPositionId",
        },{
            name    : "payslipTypeId",
            label   : "?????????? ?????????? ??????????????",
            type    : "display",
            // options : fieldsInfo.payslipType,
            // optionIdField   : "payslipTypeId",
            // optionLabelField: "title",
        },{
            name    : "timePeriodId",
            label   : "???????????? ????????",
            type    : "display",
            // options : fieldsInfo.periodTime,
            // optionIdField   : "timePeriodId",
            // optionLabelField: "periodName",
        },{
            name    : "periodFromDate",
            label   : "?????? ?????????????? ???????????? ????????",
            type    : "display",
            options : "Date",
        },{
            name    : "periodThruDate",
            label   : "???????? ??????????",
            type    : "display",
            options : "Date",
        },{
            name    : "partyClassificationId",
            label   : "???????????? ?????????? ",
            type    : "display",
            // options : fieldsInfo.paygroup,
            // optionIdField   : "partyClassificationId",
            // optionLabelField: "description",
        }]
   
    const formStructure=[
        {
            name    : "jobRequistionId",
            label   : "?????????????? ??????????",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "?????? ??????????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "???? ????????????",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "?????????? ??????????????",
            type    : "date",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "???????????? ????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "?????? ???????????? ????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "???????????? ???????? ??????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "???????????? ???????????? ??????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "???????? ???????????? ??????????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        },{
            name    : "jobRequistionId",
            label   : "?????? ?????? ??????",
            type    : "select",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 4 ,
        }
    ]

    const infoFirstFormStructure=[
     {
            name    : "jobRequistionId",
            label   : "???????? ???????????? ??????????",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 2 ,
        },{
            name    : "jobRequistionId",
            label   : "?????? ?????? ??????",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     :2 ,
        },{
            name    : "jobRequistionId",
            label   : "?????????? ???????????????? ?????????? ????????",
            type    : "date",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 2 ,
        },{
            name    : "jobRequistionId",
            label   : "?????????????? ??????????????",
            type    : "text",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 12 ,
        },
        {
          type: "component",
          label   : "?????????? ??????????????",
          component: (
            <Attachment
              attachments={attachments}
              setAttachments={setAttachments}
              partyContentType={formValues?.partyContentType}
            />
          ),
          col: 12,
        },
    ]

    const infoSecondFormStructure=[
        // {
        //     name    : "jobRequistionId",
        //     label   : "???? ???????? ???????? ????????????",
        //     type    : "text",
        //     // options : fieldsInfo?.CreditInfo ,
        //     // optionIdField   : "paymentMethodId",
        //     // optionLabelField: "bankName",
        //     // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
        //     col     : 4 ,
        // },
        {
            name    : "jobRequistionId",
            label   : "???? ?????????? ?? ????????",
            type    : "date",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     : 3 ,
        },{
            name    : "jobRequistionId",
            label   : "???? ?????????? ?? ????????",
            type    : "date",
            // options : fieldsInfo?.CreditInfo ,
            // optionIdField   : "paymentMethodId",
            // optionLabelField: "bankName",
            // otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
            col     :3 ,
        }
    ]



    const personsCols = [
        { name : "contentTypeEnumId", label: "????????", type: "text"},
        { name : "description", label:"?????? ?? ?????? ????????????????", type: "text" },
        { name : "description", label:"???? ??????", type: "text" },
        { name : "description", label:"?????????? ????????", type: "text" },
        { name : "description", label:"?????????? ????????", type: "text" },
        { name : "description", label:"?????????? ????????????", type: "text" },
        { name : "description", label:"?????????? ??????????????", type: "text" },
        { name : "description", label:"???????? ???????? ???????????? ????????????", type: "text" },
        { name : "description", label:"???????? ???????? ???????????? ??????????????", type: "text" },
    ]

    const personnelPayslips =  formVariables?.personnel || []
    
    // const outputs = formVariables?.outputs ? JSON.parse(formVariables?.outputs) : []


    const getData = () => {
        axios.get(SERVER_URL + `/rest/s1/payroll/getPayrollVerifications?PayslipTypeId=${formVariables?.payslipTypeId}&PayGroup=${formVariables?.partyClassificationId}&outPuts=${formVariables?.outputs}`, axiosKey).then(res => { 
            let actionsAfter = res.data?.actions.filter(x=>{ return x.ActionType == "PCAAfterVerification"})
            set_actions(actionsAfter)
            outputs.set(res.data?.outPutsList)
            dataList.add(res.data?.verifications)
            set_formVariables((prevState)=>{return {...prevState,actionsAfterVerifications:actionsAfter,verificationList:res.data?.verifications}})
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"?????????? ???? ???????????? ?????????????? ???? ???????? ??????."));
        });
    }


    function handle_accept(action) {
        const packet = {
            ...formVariables,
            vouchers: vouchers.list,
            actions,
            vocherCalculationSuccess :action
        }
        console.log("packet",packet)
        set_waiting("accept")
        // setTimeout(()=>set_waiting(null),2000)


        submitCallback(packet)

    }

    function handle_cancel() {
        set_waiting("cancel")
        setTimeout(()=>set_waiting(null),2000)
    }

    
    useEffect(()=>{
        getData()
    },[])
    

    return (
        <React.Fragment>
            <CardHeader title="?????????? ?????????????? ?????????? ??????????"/>
            {

            }
            <CardContent>
                <Box p={4} className="card-display">
                    <Grid container spacing={2} style={{width: "auto"}}>
                        {topFormStructure.map((input, index) => (
                            <Grid key={index} item xs={input.col || 6}>
                                <FormInput {...input} emptyContext={"???"} type="display" variant="display" grid={false} valueObject={profileValues} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Box  m={4}>
                <Card>
                            <CardHeader
                                title={
                                    <Box className={classes.headerTitle}>
                                    ?????????????? ??????????????
                                    </Box>
                                }
                            />
                            <CardContent>
                                {/* <FormPro
                                    prepend={infoFirstFormStructure}
                                    formValues={formValues}
                                    setFormValues={setFormValues}
                                    
                                /> */}
                                 <FormPro
                                    prepend={infoSecondFormStructure}
                                    formValues={formValues}
                                    setFormValues={setFormValues}
                                />
                                <Card mt={2}>
                                <TablePro
                                    title="?????????????? ??????????"
                                    // loading={loading}
                                    columns={personsCols}
                                    rows={personsContent}
                                    setRows={setPersonsContent}
                                />
                                </Card>
                                <Box p={2} />
                                <FormPro
                                    prepend={infoFirstFormStructure}
                                    formValues={formValues}
                                    setFormValues={setFormValues}
                                    
                                />
                                
                            </CardContent>
                        </Card>
                <Card variant="outlined">
                    <CommentBox context={comments}/>
                </Card>
                <Box mt={2}>
                    <ActionBox>
                        <Button role="primary" disabled={waiting} onClick={()=>{handle_accept("confirmed")}} endIcon={waiting==="accept"?<CircularProgress size={20}/>:null}>
                            ??????????
                        </Button>
                        <Button role="secondary" disabled={waiting} onClick={()=>{handle_accept("reOrder")}} >
                            ??????????
                        </Button>
                        <Button role="secondary" disabled={waiting} onClick={()=>{handle_accept("canceled")}} endIcon={waiting==="cancel"?<CircularProgress size={20}/>:null} >
                            ???? ????????????
                        </Button>
                    </ActionBox>
                </Box>
                </Box>
            </CardContent>
            <ConfirmDialog
                dialogReducer={dialogCancellation}
                title="?????? ???? ???? ?????? ???????????? ?????????????? ????????????"
            />
        </React.Fragment>
    )
}
