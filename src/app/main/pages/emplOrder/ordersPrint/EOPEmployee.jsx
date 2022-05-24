import React from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import Card from "@material-ui/core/Card";
import {CardHeader, Divider, Grid, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import DisplayField from "../../../components/DisplayField";
import CardContent from "@material-ui/core/CardContent";
import FormInput from "../../../components/formControls/FormInput";
import TablePro from "../../../components/TablePro";


function FormHeader({emplOrderData, companyPartyId}) {
    const [logo, setLogo] = React.useState(null)
    let moment = require('moment-jalaali')
    const orderDate = emplOrderData.orderDate ? moment(emplOrderData.orderDate).format('jYYYY/jM/jD') : "-"

    React.useEffect(()=>{
        if(companyPartyId) {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/PartyContent?partyId=${companyPartyId}&partyContentTypeEnumId=PcntLogoImage`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setLogo(res.data.result[0].contentLocation)
            }).catch(() => {
            });
        }
    },[companyPartyId])

    return(
        <Card variant="outlined" square style={{padding:'16px'}}>
            <Grid container>
                <Grid item xs={3}>
                    <img src={(SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + logo)} alt="Logo" style={{maxHeight:'3cm'}}/>
                </Grid>
                <Grid item xs={6}>
                    <Typography align="center">بسمه تعالی</Typography>
                    <Box m={2}/>
                    <Typography variant="h6" align="center">حکم کارگزینی</Typography>
                </Grid>
                <Grid item xs={3} style={{paddingTop:'1cm'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={7}>
                            <Typography align="right">شماره حکم :</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography align="left">{emplOrderData.emplOrderCode || "-"}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={7}>
                            <Typography align="right">تاریخ صدور حکم :</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography align="left">{orderDate}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={7}>
                            <Typography align="right">نسخه :</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography align="left">کارمند</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    )
}

function FormInfo({emplOrderData, companyPartyId}) {
    const [orders, setOrders] = React.useState([]);
    const [EntPayGrade,setEntPayGrade] = React.useState([]);
    const formStructure = [
        {
            name    : "pseudoId",
            label   : "کد پرسنلی",
            type    : "display",
            variant : "display",
        },{
            name    : "fullName",
            label   : "نام پرسنل",
            type    : "display",
            variant : "display",
            options : "Render",
            render  : (row) => `${row.firstName || ''} ${row.lastName || ''}`
        },{
            name    : "fatherName",
            label   : "نام پدر",
            type    : "display",
            variant : "display",
        },{
            name    : "nationalId",
            label   : "کد ملی",
            type    : "display",
            variant : "display",
        },{
            name    : "idNumber",
            label   : "شماره شناسنامه",
            type    : "display",
            variant : "display",
        },{
            name    : "birthDate",
            label   : "تاریخ تولد",
            type    : "display",
            variant : "display",
            options : "Date",
        },{
            name    : "birthProvince",
            label   : "محل تولد",
            type    : "display",
            variant : "display",
        },{
            name    : "qualificationTypeEnumId",
            label   : "آخرین مقطع",
            type    : "display",
            variant : "display",
            options : "QualificationType",
        },{
            name    : "fieldEnumId",
            label   : "رشته تحصیلی",
            type    : "display",
            variant : "display",
            options : "UniversityFields",
        },{
            name    : "militaryState",
            label   : "وضعیت نظام وظیفه",
            type    : "display",
            variant : "display",
            options : "MilitaryState",
        },{
            name    : "maritalStatusEnumId",
            label   : "وضعیت تأهل",
            type    : "display",
            variant : "display",
            options : "MaritalStatus",
        },{
            name    : "NumberofKids",
            label   : "تعداد فرزندان",
            type    : "display",
            variant : "display",
        },{
            name    : "personnelGroup",
            label   : "گروه پرسنلی",
            type    : "display",
            variant : "display",
            options : "EmployeeGroups",
            optionIdField   : "partyClassificationId",
        },{
            name    : "personnelSubGroup",
            label   : "زیرگروه پرسنلی",
            type    : "display",
            variant : "display",
            options : "EmployeeSubGroups",
            optionIdField   : "partyClassificationId",
            // filterOptions   : options => options.filter(o=>o.parentClassificationId===formValues.personnelGroup)
        },{
            name    : "ownerPartyId",
            label   : "شرکت",
            type    : "display",
            variant : "display",
            options : "Organization",
            optionLabelField    : "organizationName",
            optionIdField       : "partyId",
        },{
            name    : "personnelArea",
            label   : "منطقه فعالیت",
            type    : "display",
            variant : "display",
            options : "ActivityArea",
            optionIdField   : "partyClassificationId",
        },{
            name    : "personnelSubArea",
            label   : "حوزه کاری",
            type    : "display",
            variant : "display",
            options : "ExpertiseArea",
            optionIdField   : "partyClassificationId",
            col     : 8
        },{
            name    : "agreementCode",/* todo */
            label   : "شماره قرارداد",
            type    : "display",
            variant : "display",
        },{
            name    : "agreementId",
            label   : "نوع قرارداد",
            type    : "display",
            variant : "display",
            options : "Agreement",
            optionIdField       : "agreementId",
        },{
            name    : "employmentDate",
            label   : "تاریخ استخدام",
            type    : "display",
            variant : "display",
            options : "Date",
        },{
            name    : "jobId",
            label   : "کد شغل",
            type    : "display",
            variant : "display",
            options : "Job",
            optionIdField       : "jobId",
            optionLabelField    : "jobCode"
        },{
            name    : "jobId",
            label   : "شغل",
            type    : "display",
            variant : "display",
            options : "Job",
            optionIdField       : "jobId",
            optionLabelField    : "jobTitle",
            col     : 8
        },{
            name    : "emplPositionId",
            label   : "کد پست",
            type    : "display",
            variant : "display",
            options : "EmplPosition",
            optionIdField    : "emplPositionId",
            optionLabelField : "pseudoId"
        },{
            name    : "emplPositionId",
            label   : "پست",
            type    : "display",
            variant : "display",
            options : "EmplPosition",
            optionIdField    : "emplPositionId",
            col     : 8
        },{
            name    : "jobTitle",
            label   : "طبقه شغلی",
            type    : "display",
            variant : "display",
        },{
            name    : "jobGradeId",
            label   : "طبقه",
            type    : "display",
            variant : "display",
            options : "JobGrade"
        },{
            name    : "payGradeId",
            label   : "رتبه",
            type    : "display",
            variant : "display",
            options : EntPayGrade,
            optionIdField   : "payGradeId",
        },{
            name    : "emplOrderSettingId",
            label   : "نوع حکم",
            type    : "display",
            variant : "display",
            options : orders,
            optionIdField       : "settingId",
            optionLabelField    : "title",
            col     : 8
        },{
            name    : "fromDate",
            label   : "تاریخ اجرای حکم",
            type    : "display",
            variant : "display",
            options : "Date",
        }]

    React.useEffect(()=>{
        if(companyPartyId) {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/EmplOrderSetting?companyPartyId=${companyPartyId}&typeEnumId=EostEmplOrder`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setOrders(res.data.result)
            }).catch(() => {
            });
        }
    },[companyPartyId])

    React.useEffect(()=>{
        axios.get(SERVER_URL + `/rest/s1/fadak/entity/PayGrade`, {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            setEntPayGrade(res.data.result)
        }).catch(() => {
        });
    },[])
    
    return(
        <Card variant="outlined" square>
            <CardContent>
                <Grid container spacing={2} >
                    {formStructure.map((input,index)=>(
                        <Grid key={index} item xs={input.col || 4}>
                            <FormInput {...input} grid={false} valueObject={emplOrderData}/>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
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
                setSign(res.data.result[0].contentLocation)
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

function FormSignature({verificationList}) {
    console.log("FormSignature",verificationList)
    return(
        <Grid container direction="row-reverse">
            {verificationList?.map((item, ind) => (
                <Signature key={ind} data={item}/>
            ))}
        </Grid>
    )
}

export default function EOPEmployee({data}) {
    const tableColsFactors = [  /* todo: names? */
        {name: "title", label: "عنوان عامل", type: "text"},
        {name: "scoreValue", label: "امتیاز", type: "number"},
        {name: "payrollFactorValue", label: "مقدار ریالی", type: "number"},
    ]
    const [emplOrderData, setEmplOrderData] = React.useState({
        ...data.emplOrderData,
        idNumber: "...",
        fatherName: "..."
    })

    React.useEffect(()=>{
        axios.get(SERVER_URL + "/rest/s1/fadak/getpartyuserInfo?partyId=" + data.emplOrderData.partyId, {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            const idNumber = res.data.IdentificationList.find(i => i.partyIdTypeEnumId==="idNumber").idValue
            setEmplOrderData(prevState => ({...prevState, idNumber}))
        }).catch(() => {
        });
        axios.get(SERVER_URL + "/rest/s1/fadak/PartyDetail?partyId=" + data.emplOrderData.partyId, {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            const fatherName = res.data.result[0].FatherName
            setEmplOrderData(prevState => ({...prevState, fatherName}))
        }).catch(() => {
        });
    },[])

    return(
        <div className="print">
            <FormHeader emplOrderData={emplOrderData} companyPartyId={data.companyPartyId}/>
            <Box m={3}/>
            <FormInfo emplOrderData={emplOrderData} companyPartyId={data.companyPartyId}/>
            <Box m={2}/>
            <Card variant="outlined" square>
                <Grid container>
                    <Grid item xs>
                        <CardHeader title="شرح حکم"/>
                        <CardContent>
                            <FormInput name="description" type="display" variant="raw" grid={false} valueObject={emplOrderData}/>
                        </CardContent>
                    </Grid>
                    <Divider orientation="vertical" flexItem/>
                    <Grid item xs={8}>
                        <TablePro
                            title="لیست عوامل حکمی"
                            columns={tableColsFactors}
                            rows={data.factorsList}
                            pagination={false}
                        />
                    </Grid>
                </Grid>
            </Card>

            <Box m={2}/>
            <FormSignature verificationList={data.verificationList}/>
        </div>
    )
}
