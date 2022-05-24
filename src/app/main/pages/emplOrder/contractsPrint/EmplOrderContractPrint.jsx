import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ReportProblemRoundedIcon from "@material-ui/icons/ReportProblemRounded";
import Box from "@material-ui/core/Box";
import EOCPDefault from "./EOCPDefault";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import CircularProgress from "@material-ui/core/CircularProgress";
import { red } from '@material-ui/core/colors';

function ErrorBox({title, description}) {
    return (
        <Card variant="outlined" square>
            <CardContent>
                <Box textAlign="center" p={4}>
                    <Box textAlign="center">
                        <ReportProblemRoundedIcon style={{fontSize:100, color:red[50]}}/>
                    </Box>
                    <Box mb={1} style={{color: red[700]}}>
                        <Typography variant="body1"><b>{title}</b></Typography>
                    </Box>
                    <Typography variant="body1" color="textSecondary">{description}</Typography>
                </Box>
            </CardContent>
        </Card>
    )
}


export default function EmplOrderContractPrint({type, agreementId, agreementTypeId, data}) {
    const [agreementData, setAgreementData] = useState(null);
    const [resData, setResData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(agreementId || agreementTypeId) {
            setLoading(true)
            axios.get(SERVER_URL + "/rest/s1/emplOrder/agreement/print", {
                headers: {'api_key': localStorage.getItem('api_key')},
                params: {agreementId, agreementTypeId}
            }).then(res => {
            setLoading(false)
                
                setResData(res.data)
            }).catch(() => {
            setLoading(false)

            });
        }
    },[agreementId])

    useEffect(() => {

        if (resData)
            setAgreementData({...resData, ...data})
    },[resData, data])

    if (loading) return (
        <Box textAlign="center" color="text.secondary" p={4}>
            <CircularProgress />
            <Typography variant={"body1"}>در حال دریافت اطلاعات</Typography>
        </Box>
    )

    if (!agreementData) return <ErrorBox title="خطا در نمایش قرارداد" description="اطلاعاتی برای نمایش وجود ندارد!"/>
    switch (type) {
        case "AgreementPrintDefault":
            return <EOCPDefault agreementData={agreementData} agreementId ={agreementId}/>
        default:
            return <ErrorBox title="خطا در نمایش قرارداد" description="این نسخه تعریف نشده است!"/>
    }
}
