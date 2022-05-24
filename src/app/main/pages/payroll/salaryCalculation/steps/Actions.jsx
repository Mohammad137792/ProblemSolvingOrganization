import React, {createRef, useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import ActionBox from "../../../../components/ActionBox";
import ActionsCheckData from "./actions/ActionsCheckData";
import Box from "@material-ui/core/Box";
import ActionsPersonnelOperation from "./actions/ActionsPersonnelOperation";
import ActionsCheckEmplOrders from "./actions/ActionsCheckEmplOrders";
import ActionsPayrollFactors from "./actions/ActionsPayrollFactors";
import ActionsVerification from "./actions/ActionsVerification";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
import axios from "../../../../api/axiosRest";

export default function Actions({formVariables, set_formVariables, taskId, scrollTop,submitCallback}) {
    const [waiting, set_waiting] = useState(false)
    const [formValues, set_formValues] = useState({})
    const [activeAction, set_activeAction] = useState(0)
    // const actions = ["PCAWorked","PCAEmplOrder","PCAPayrollFactorManual"]
    const actionsDef = {
        "PCAWorked" : <ActionsPersonnelOperation formVariables={formVariables} set_formVariables={set_formVariables}/>,
        "PCAEmplOrder" : <ActionsCheckEmplOrders formVariables={formVariables} set_formVariables={set_formVariables}/>,
        "PCAPayrollFactorManual" : <ActionsPayrollFactors formVariables={formVariables} set_formVariables={set_formVariables}/>,
    }

    console.log("formVariables",formVariables?.payslipAction)
    const actions = formVariables?.payslipAction?.DutyList?.filter(x => {if(actionsDef?.hasOwnProperty(x.actionEnumId)) return true}).map(x=>x.actionEnumId) //?: []
    const isLastAction = activeAction===actions?.length+1
    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
      }

    const sendToProcess = () => {
        set_waiting(true)
        const packet = {
            ...formVariables,
            "taskId":taskId
        }

        submitCallback(packet)
        // axios.post(SERVER_URL + `/rest/s1/processes/submitProcessTask`, packet ,axiosKey).then(res => {
        //     // submitCallback()
        //     dispatch(setAlertContent(ALERT_TYPES.SUCCESS,"اطلاعات با موفقیت ارسال شد."));

        // }).catch(() => {
        //     dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در ارسال اطلاعات رخ داده است."));
        // });
    }

    function handle_next() {
        if(isLastAction){
            sendToProcess()
        }else{
            set_activeAction(activeAction+1)
        }
        scrollTop()
    }
    function handle_back() {
        set_activeAction(activeAction-1)
        scrollTop()
    }

    return (
        <Box>
            {activeAction===0 && <ActionsCheckData formVariables={formVariables}/>}
            {activeAction>0 && !isLastAction && actionsDef[actions[activeAction-1]]}
            {isLastAction && <ActionsVerification formVariables={formVariables}/>}
            <Box p={2}>
                <ActionBox>
                    <Button type="button" role="primary"
                            onClick={handle_next}
                            disabled={waiting}
                            endIcon={waiting?<CircularProgress size={20}/>:null}>
                        {isLastAction?"ارسال":"مرحله بعد"}
                    </Button>
                    <Button type="button" role="secondary"
                            onClick={handle_back}
                            disabled={waiting||activeAction===0}>
                        بازگشت
                    </Button>
                </ActionBox>
            </Box>
        </Box>
    )
}
