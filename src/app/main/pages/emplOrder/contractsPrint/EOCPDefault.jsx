import React from "react";
import {SERVER_URL} from "../../../../../configs";
import Card from "@material-ui/core/Card";
import {Grid, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import DisplayField from "../../../components/DisplayField";
import {makeStyles} from "@material-ui/core/styles";
import PrintSheet from "../../../components/PrintSheet";
import PayrollFactorTable from "../factors/TablePayrollFactor";
import axios from "axios";

const empty = ".............."

const useStyles = makeStyles(() => ({
    termTitle: {
        fontSize: "1.5rem",
    },
}));

function FormHeader({agreementData}) {
    const agreementDate = agreementData.agreement?.agreementDate
    return(
        <Card variant="outlined" square style={{padding:'16px'}}>
            <Grid container>
                <Grid item xs={3}>
                    <img src={(SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + agreementData.company.logo)} alt="Logo" style={{maxHeight:'3cm'}}/>
                </Grid>
                <Grid item xs={6}>
                    <Typography align="center">بسمه تعالی</Typography>
                    <Box m={2}/>
                    <Typography variant="h6" align="center">{agreementData.agreementId? agreementData.agreementType : agreementData.agreementType.description}</Typography>
                </Grid>
                <Grid item xs={3} style={{paddingTop:'1cm'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={7}>
                            <Typography align="right">شماره قرارداد :</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography align="left"><b>{agreementData.agreement?.code || empty}</b></Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={7}>
                            <Typography align="right">تاریخ :</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography align="left"><b>{agreementDate ? (<DisplayField options="Date" format="jYYYY/jM/jD" value={agreementDate} />) : empty}</b></Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    )
}

function AgreementTerm({term, agreementData, number,agreementId}) {
    const classes = useStyles()
    const fromDate = agreementData.agreement?.fromDate
    const thruDate = agreementData.agreement?.thruDate
    return(
        <Box mb={2}>
            <Typography variant="h6" className={classes.termTitle}>
                ماده {number}: <DisplayField options="TermType" value={term.termTypeEnumId}/>
            </Typography>
            <Box px={2} pt={1}>
                {!agreementId && term.termTypeEnumId==="TtAgreementSides" &&
                <Typography align="justify">
                    طرفین قرارداد عبارت اند از:<br/>
                    الف) شرکت&nbsp;
                    <b><DisplayField options="Organization" value={agreementData.company.companyPartyId} optionIdField="partyId" optionLabelField="organizationName"/></b>
                    &nbsp;با شماره ثبت&nbsp;
                    <b>{agreementData.company.registrationNumber||empty}</b>
                    &nbsp;به نشانی&nbsp;
                    <b>{agreementData.company.address||empty}</b>
                    &nbsp;با نمایندگی&nbsp;
                    <b>{agreementData.company.representative.fullName||empty}</b>
                    &nbsp;به عنوان مدیر عامل و عضو هیئت مدیره، که در قرارداد به اختصار شرکت نامیده می شود، از یک طرف و<br/>
                    ب)&nbsp;
                    <b>{agreementData.person.fullName||empty}</b>
                    &nbsp;فرزند&nbsp;
                    <b>{agreementData.person.FatherName||empty}</b>
                    &nbsp;دارای شماره شناسنامه&nbsp;
                    <b>{agreementData.person.idNumber||empty}</b>
                    &nbsp;متولد&nbsp;
                    <b>{agreementData.person.PlaceOfBirthGeoID||empty}</b>
                    &nbsp;صادره از&nbsp;
                    {agreementData.person.Cityplaceofissue ? (<b><DisplayField options="Province" value={agreementData.person.Cityplaceofissue} optionIdField="geoId" optionLabelField="geoName"/></b>) : empty}
                    &nbsp;با شماره ملی&nbsp;
                    <b>{agreementData.person.nationalId||empty}</b>
                    &nbsp;به نشانی محل سکونت&nbsp;
                    <b>{agreementData.person.fullAddress||empty}</b>
                    &nbsp;با تلفن&nbsp;
                    <b>{agreementData.person.phoneNumber||empty}</b>
                    &nbsp;و موبایل&nbsp;
                    <b>{agreementData.person.mobileNumber||empty}</b>
                    &nbsp;که در این قرارداد همکار نامیده می شود، از طرف دیگر.
                </Typography>
                }
                {!agreementId && term.termTypeEnumId==="TtAgreementDuration" &&
                <Typography align="justify">
                    مدت این قرارداد از تاریخ&nbsp;
                    {fromDate ? (<b><DisplayField options="Date" format="jYYYY/jM/jD" value={fromDate} /></b>) : empty}
                    &nbsp;تا تاریخ&nbsp;
                    {thruDate ? (<b><DisplayField options="Date" format="jYYYY/jM/jD" value={thruDate} /></b>) : empty}
                    &nbsp;می باشد.
                </Typography>
                }
                {term.termTypeEnumId==="TtAgreementPayroll" &&
                <Box>
                    <Typography align="justify">
                        حقوق و مزایای مربوط به انجام موضوع این قرارداد، به شرح ذیل محاسبه و در پایان هر ماه شمسی، نقدا از سوی شرکت به همکار پرداخت می گردد.
                    </Typography>
                    <Box m={2}/>
                    <Card variant="outlined" square>
                        <PayrollFactorTable data={agreementData.agreementPayrollFactors} showTitleBar={false}/>
                    </Card>
                </Box>
                }
                <div dangerouslySetInnerHTML={{__html: term.termText}}></div>
            </Box>
        </Box>
    )
}

function Signature({data}) {
    const [sign, setSign] = React.useState(null)
    let moment = require('moment-jalaali')
    const date = data.verificationDate ? moment(data.verificationDate).format('jYYYY/jM/jD') : "-"
    React.useEffect(()=>{
        if(data.partyId) {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/PartyContent?partyId=${data.partyId}&partyContentTypeEnumId=signatureImage`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setSign(res.data[0].contentLocation)
            }).catch(() => {
            });
        }
    },[data.partyId])
    return(
        <Grid item xs={3} style={{textAlign:"center"}}>
            <img src={(SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + sign)} alt="Signature" style={{maxHeight:'3cm',maxWidth:'4cm'}}/>
            <div>{`${data.firstName || ''} ${data.lastName || ''} ${data.suffix || ''}`}</div>
            <DisplayField value={data.emplPositionId} variant="raw" options="EmplPosition" optionIdField="emplPositionId"/>
            <div>{date}</div>
        </Grid>
    )
}




export default function EOCPDefault({agreementData,agreementId}) {
    return (
        <PrintSheet
            footer={
                <Grid container>
                    <Grid item xs={12} sm={4}><Box p={4}><Typography>امضا</Typography></Box></Grid>
                </Grid>
            }
            footerHeight="3cm"
        >
            <FormHeader agreementData={agreementData}/>
            <Box m={3}/>
            {console.log('agreementData',agreementData)}
            {agreementData.agreementTerms.map((p,i)=>(
                <AgreementTerm key={i} number={i+1} term={p} agreementData={agreementData} agreementId={agreementId}/>
            ))}

        <Grid container direction="row-reverse">
            {agreementData.verificationList?.map((item, ind) => (
                <Signature key={ind} data={item}/>
            ))}
        </Grid>
        </PrintSheet>
    )
}
