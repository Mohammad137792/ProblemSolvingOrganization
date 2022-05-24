import React, {useState,useEffect} from "react";
import {Box, Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from "../../../../../components/formControls/FormPro";
import useListState from "../../../../../reducers/listState";
import PersonnelsData from "./taxPaymentTabs/PersonnelsData";
import PersonnelsDetailData from "./taxPaymentTabs/PersonnelsDetailData";
import Card from "@material-ui/core/Card";
import TabPro from "../../../../../components/TabPro";
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from "@material-ui/core/Tooltip";
import axios from "../../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';

export default function TaxPayment({formVariables, submitCallback, taskId , step}) {

    const [personList, setPersonList] = useState([]);

    const personnel = useListState("userId",[])
    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
      }


    console.log('personnel',formVariables)
    console.log('personnel',personnel)
    const comments = useListState("id",[])

    const formStructure = [
    {
        name    : "createDate",
        label   : "تاریخ پرداخت خزانه",
        type    : "display",
        options : "Date",
    },{
        name    : "taxValues",
        label   : "مبلغ پرداخت خزانه",
        type    : "display",
    }]
    
    let tabs = [{
        label: "اطلاعات حقوق بگیران",
        panel: <PersonnelsData personList={personList}/>
    },{
        label: "مشخصات ریز حقوق بگیران",
        panel: <PersonnelsDetailData personList={personList}/>
    }]

    useEffect(()=>{
        if(formVariables?.personnel){
            setPersonList(formVariables?.personnel)
            getData(formVariables?.personnel)
        }
    },[formVariables])

    const getData = (persons) => {
        axios.post(SERVER_URL + `/rest/s1/payroll/createTaxDisket`, {PersonelList:persons}, axiosKey).then(res => { /* todo: rest? */
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    function getTaxDisket(){
        axios.get(SERVER_URL + '/rest/s1/payroll/getPayrollFile?taxFileName='+formVariables?.taxDisketName, axiosKey).then(res => { /* todo: rest? */
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    return (
        <React.Fragment>
            <CardHeader title="دیسکت مالیات"  
            action={<>
                {formVariables?.taxDisketName && <Tooltip title="دانلود دیکست">
                     <SaveIcon fontSize="large" onClick={getTaxDisket}/>
                </Tooltip>}
                </>
            }/>
            <CardContent>
                <Grid m={2} xs={12}>  
                    <CardContent>
                        <FormPro
                            formValues={formVariables}
                            prepend={formStructure}
                        />
                     </CardContent>
                </Grid>
                <Grid m={2} xs={12}>
                    <Card variant="outlined">
                        <TabPro tabs={tabs}/>
                    </Card>
                </Grid>
            </CardContent>
        </React.Fragment>
    )
}
