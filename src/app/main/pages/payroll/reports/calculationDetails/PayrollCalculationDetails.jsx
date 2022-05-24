import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {PayrollCardHeader} from "../../Payroll";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {FusePageSimple} from "../../../../../../@fuse";
import {CardHeader, Grid} from "@material-ui/core";
import QuickBox from "../../../../components/QuickBox";
import axios from "../../../../api/axiosRest";
import CardContent from "@material-ui/core/CardContent";
import DisplayField from "../../../../components/DisplayField";
import TabPro from "../../../../components/TabPro";
import PCDPayslip from "./PCDPayslip";
import PCDVoucher from "./PCDVoucher";
import PCDOutput from "./PCDOutput";
import OTIListDisc27 from "../../print/output/OTIListDisc27";

export default function PayrollCalculationDetails() {
    const { id } = useParams();
    const [loading, set_loading] = useState(true)
    const [data, set_data] = useState(null)
    const [fieldsInfo, set_fieldsInfo] = useState({
        payslipType: [],
        periodTime: [],
        paygroup: []
    });

    const formStructure = [
        {
            name    : "trackingCodeId",
            label   : "کد رهگیری",
        },{
            name    : "registrationDate",
            label   : "تاریخ صدور",
            options : "Date",
        },{
            name    : "producerFullName",
            label   : "تهیه کننده",
        },{
            name    : "producerEmplPositionId",
            label   : "پست سازمانی تهیه کننده",
            options : "EmplPosition",
            optionIdField: "emplPositionId",
        // },{
        //     name    : "payslipTypeId",
        //     label   : "نوع فیش حقوقی",
        //     options : fieldsInfo.payslipType,
        //     optionIdField   : "payslipTypeId",
        //     optionLabelField: "title",
        },{
            name    : "timePeriodId",
            label   : "دوره زمانی",
            options : fieldsInfo.periodTime,
            optionIdField   : "timePeriodId",
            optionLabelField: "periodName",
        },{
            variant : "raw",
            options : "Render",
            render  : values => {
                const moment = require('moment-jalaali');
                const fromDate = values.fromDate? moment(values.fromDate).format("jD jMMMM jYYYY"): "-"
                const thruDate = values.thruDate? moment(values.thruDate).format("jD jMMMM jYYYY"): "-"
                return <span>از تاریخ <b>{fromDate}</b> تا <b>{thruDate}</b></span>
            }
        },{
            name    : "payGroupPartyClassificationId",
            label   : "گروه حقوقی",
            options : fieldsInfo.paygroup,
            optionIdField   : "partyClassificationId",
            optionLabelField: "description",
        },{
            name    : "payArrearsFromDate",
            variant : "raw",
            options : "Render",
            render  : values => {
                const moment = require('moment-jalaali');
                const fromDate = values.payArrearsFromDate? moment(values.payArrearsFromDate).format("jD jMMMM jYYYY"): "-"
                const thruDate = values.payArrearsThruDate? moment(values.payArrearsThruDate).format("jD jMMMM jYYYY"): "-"
                return <span>پرداخت معوقات از تاریخ <b>{fromDate}</b> تا <b>{thruDate}</b></span>
            }
        },{
            name    : "payArrearsPercent",
            label   : "درصد پرداخت معوقات",
        },{
            name    : "xx1",
            label   : "حساب بانکی پرداخت حقوق",
        },{
            name    : "xx2",
            label   : "تاریخ پرداخت حقوق و دستمزد",
        },{
            name    : "description",
            label   : "توضیحات",
            col     : 12
        }]

    React.useEffect(()=>{
        set_loading(true)
        axios.get("/s1/payroll/allPayrollsData?id="+id).then(res => {
            set_data(res.data)
            // set_data({
            //     permission: true,
            //     main: {
            //         trackingCode: 1278,
            //         producerFullName:  "علی  نقد علی",
            //         producerPartyId: "100319",
            //         timePeriodId: "100630",
            //         producerEmplPositionId: "101390",
            //         fromDate: 1636818678000,
            //         thruDate: 1639497110000,
            //         description: "لورم ایپسوم یا طرح‌نما به متنی آزمایشی و بی‌معنی در صنعت چاپ، صفحه‌آرایی و طراحی گرافیک گفته می‌شود. طراح گرافیک از این متن به عنوان عنصری از ترکیب بندی برای پر کردن صفحه و ارایه اولیه شکل ظاهری و کلی طرح سفارش گرفته شده استفاده می نماید، تا از نظر گرافیکی نشانگر چگونگی نوع و اندازه فونت و ظاهر متن باشد.لورم ایپسوم یا طرح‌نما به متنی آزمایشی و بی‌معنی در صنعت چاپ، صفحه‌آرایی و طراحی گرافیک گفته می‌شود.",
            //     },
            //     payslips: [{
            //         emplPositionId: "101390",
            //         fullName: "مرتضی  فتح آبادی",
            //         pseudoId: "1014",
            //         x3: 120000,
            //     },{
            //         fullName: "پژمان  چائی چی",
            //         pseudoId: "1057",
            //         x3: 231400,
            //     }],
            //     vouchers: [{
            //         code: "12031",
            //         description: "سند حقوق دستمزد پرسنل 10",
            //         date: 1636818678000,
            //         articles: [{
            //             glAccountCode: "حق شعل",
            //             creditor: 1100,
            //         },{
            //             glAccountCode: "حقوق پرداختنی",
            //             debtor: 200,
            //         }]
            //     }],
            //     outputs: [{
            //         title: "خروجی بیمه تامین اجتماعی",
            //         outputTypeEnumId: "OutTyInsurance",
            //         settingId: "OTIListDisc27",
            //     },{
            //         title: "خروجی مالیات",
            //         outputTypeEnumId: "OutTyTax",
            //         settingId: "OTTListDisc10",
            //     },{
            //         title: "خروجی بانک ملت",
            //         outputTypeEnumId: "OutTyBanck",
            //         settingId: "OTBSaderat",
            //     }]
            // })
        }).catch(() => {
            set_data(null)
        }).finally(() => {
            set_loading(false)
        });
    },[id])

    React.useEffect(()=>{
        axios.get("/s1/payroll/PaygroupData").then(res => {
            set_fieldsInfo(res.data)
        })
    },[])

    const tabs = [{
        label: "فیش حقوق و دستمزد",
        panel: <PCDPayslip rows={data?.payslips}/>
    },{
        label: "سند حسابداری",
        panel: <PCDVoucher rows={data?.vouchers}/>
    },{
        label: "خروجی",
        panel: <PCDOutput rows={data?.outputs}/>
    }]

    let content;
    if (loading)
        content = <QuickBox variant="loading" />
    else if (!data)
        content = <QuickBox variant="error" title="خطا در دریافت اطلاعات" description="لطفا مجددا تلاش کنید"/>
    else if (data.permission)
        content = <QuickBox variant="error" title="عدم دسترسی" description="اجازه مشاهده این اطلاعات را ندارید"/>
    else content = (
        <React.Fragment>
            <Grid container spacing={2}>
                {formStructure.map((field,index) => (
                    <Grid item xs={12} sm={field.col||4} key={index}>
                        <DisplayField variant="display" value={data.main[field.name]} valueObject={data.main} {...field}/>
                    </Grid>
                ))}
            </Grid>
            <Box m={3}/>
            <Card variant="outlined">
                <TabPro tabs={tabs}/>
            </Card>
        </React.Fragment>
        )

    return (
        <FusePageSimple
            header={<PayrollCardHeader title="لیست محاسبات حقوق و دستمزد" hasReturnButton={true}/>}
            content={
                <Box p={2}>
                    <Card>
                        <CardHeader title="مشاهده اطلاعات محاسبات حقوق و دستمزد"/>
                        <CardContent>
                            {content}
                        </CardContent>
                    </Card>

                    {/*<Box m={4}/>*/}
                    {/*<Card>*/}
                    {/*    <CardContent>*/}
                    {/*        <OTIListDisc27/>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                </Box>
            }
        />
    )
}
