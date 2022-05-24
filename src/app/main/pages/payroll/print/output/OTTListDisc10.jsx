import React from "react";
import {Grid, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import DisplayField from "../../../../components/DisplayField";
import PrintSheet from "../../../../components/PrintSheet";
import Card from "@material-ui/core/Card";
import TabPro from "../../../../components/TabPro";
import TablePro from "../../../../components/TablePro";

export default function OTTListDisc10({data={},printRef}) {
    const formStructure = [
        {
            name    : "id1",
            label   : "سال",
        },{
            name    : "id2",
            label   : "ماه",
        },{
            name    : "id3",
            label   : "بدهی مالیاتی ماه جاری",
        },{
            name    : "id4",
            label   : "بدهی مالیاتی ماه گذشته",
        }, {
            name    : "id1",
            label   : "تاریخ ثبت در دفتر روزنامه (تخصیص /پرداخت)",
        },{
            name    : "id2",
            label   : "نحوه پرداخت",
        },{
            name    : "id3",
            label   : "شماره سریال چک",
        },{
            name    : "id4",
            label   : "تاریخ چک",
            options : "Date"
        }, {
            name    : "id1",
            label   : "کد نام بانک",
        },{
            name    : "id2",
            label   : "نام شعبه",
        }, {
            name    : "id1",
            label   : "شماره حساب",
        },{
            name    : "id2",
            label   : "مبلغ پرداختی / مبلغ چک",
        },{
            name    : "id3",
            label   : "تاریخ پرداخت خزانه",
            options : "Date"
        },{
            name    : "id4",
            label   : "مبلغ پرداخت خزانه",
        }]

    const tableColumns1 = [
        {
        name    : "id01",
        label   : "نوع تابعیت",
    },{
        name    : "id02",
        label   : "نوع اطلاعات",
    },{
        name    : "id03",
        label   : "کد ملی/کد فراگیر",
    },{
        name    : "id04",
        label   : "نام",
    },{
        name    : "id05",
        label   : "نام خانوادگی",
    },{
        name    : "id06",
        label   : "کشور",
    },{
        name    : "id07",
        label   : "شناسه کارمند",
    },{
        name    : "id08",
        label   : "مدرک تخصیلی",
    },{
        name    : "id09",
        label   : "سمت",
    },{
        name    : "id10",
        label   : "نوع بیمه",
    },{
        name    : "id11",
        label   : "شماره بیمه",
    },{
        name    : "id12",
        label   : "کد پستی محل سکونت",
    },{
        name    : "id13",
        label   : "تاریخ استخدام",
    },{
        name    : "id14",
        label   : "نوع استخدام",
    },{
        name    : "id15",
        label   : "محل خدمت",
    },{
        name    : "id16",
        label   : "وضعیت محل خدمت",
    },{
        name    : "id15",
        label   : "نوع قرارداد",
    },{
        name    : "id15",
        label   : "تاریخ پایان کار",
    },{
        name    : "id15",
        label   : "وضعیت کارمند",
    },{
        name    : "id15",
        label   : "شماره تلفن همراه",
    },{
        name    : "id15",
        label   : "پست الکترونیک",
    }]
    const tableColumns2 = [
    {
        name    : "id03",
        label   : "کد ملی/کد فراگیر",
    },{
        name    : "id04",
        label   : "نوع پرداخت",
    },{
        name    : "id05",
        label   : "تعداد ماه های کارکرد واقعی از ابتدای سال جاری",
    },{
        name    : "id06",
        label   : "آیا این ماه آخرین ماه فعالیت کاری حقوق بگیر می باشد؟",
    },{
        name    : "id07",
        label   : "نوع ارز",
    },{
        name    : "id08",
        label   : "نرخ تغییر ارز",
    },{
        name    : "id09",
        label   : "تاریخ شروع به کار",
    },{
        name    : "id10",
        label   : "تاریخ پایان کار",
    },{
        name    : "id11",
        label   : "وضعیت کارمند",
    },{
        name    : "id16",
        label   : "وضعیت محل خدمت",
    },{
        name    : "id12",
        label   : "ناخالص حقوق و دستمزد مستمر نقدی ماه جاری- ریالی",
    },{
        name    : "id13",
        label   : "پرداختهای مستمر معوق که مالیاتی برای آنها محاسبه نشده است- ریالی",
    },{
        name    : "id14",
        label   : "مسکن",
    },{
        name    : "id15",
        label   : "مبلغ کسر شده از حقوق کارمند بابت مسکن ماه جاری - ریالی",
    },{
        name    : "id15",
        label   : "وسیله نفلیه",
    },{
        name    : "id15",
        label   : "مبلغ کسر شده از حقوق کارمند بابت وسیله نقلیه ماه جاری - ریالی",
    },{
        name    : "id15",
        label   : "پرداخت مزایای مستمر غیر نقدی ماه جاری- ریالی",
    },{
        name    : "id15",
        label   : "هزینه های درمانی موضوع ماده 7۳0 ق.م.م.",
    },{
        name    : "id15",
        label   : "حق بیمه پرداختی موضوع ماده 7۳0 ق.م.م.",
    },{
        name    : "id15",
        label   : "تسهیالت اعتباری مسکن از بانکها (موضوع بند الف ماده ۱۳0 قانون برنامه سوم)",
    },{
        name    : "id15",
        label   : "سایر معافیتها",
    },{
        name    : "id15",
        label   : "ناخالص اضافه کاری ماه جاری- ریالی",
    },{
        name    : "id15",
        label   : "سایر پرداختهای غیر مستمر نقدی ماه جاری- ریالی",
    },{
        name    : "id15",
        label   : "پاداشهای موردی ماه جاری- ریالی",
    },{
        name    : "id15",
        label   : "پرداختهای غیر مستمر نقدی معوقه ماه جاری- ریالی",
    },{
        name    : "id15",
        label   : "کسر میشود: معافیتهای غیر مستمر نقدی (شامل بند 6 ماده 0۱)",
    },{
        name    : "id15",
        label   : "پرداخت مزایای غیر مستمر غیر نقدی ماه جاری- ریالی",
    },{
        name    : "id15",
        label   : "عیدی و مزایای پایان سال- ریالی",
    },{
        name    : "id15",
        label   : "بازخرید مرخصی و بازخرید سنوات- ریالی",
    },{
        name    : "id15",
        label   : "کسر میشود: معافیت (فقط برای بند 0 ماده 0۱)",
    },{
        name    : "id15",
        label   : "معافیت مربوط به مناطق آزاد تجاری",
    },{
        name    : "id15",
        label   : "معافیت موضوع قانون اجتناب از اخذ مالیات مضاعف",
    },{
        name    : "id15",
        label   : "جمع خالص مالیات متعلّقه ماه جاری",
    }]

    return (
        <React.Fragment>
            <div ref={printRef}>
                <PrintSheet>
                    <Box style={{marginBottom:'0.5cm'}}>
                        <Typography variant="h6" >{"خلاصه لیست"}</Typography>
                    </Box>
                    <Grid container spacing={2} style={{marginBottom:'1cm'}}>
                        {formStructure.map((field,index) => (
                            <Grid item xs={field.col||4} key={index}>
                                <DisplayField variant="display" value={data[field.name]} {...field}/>
                            </Grid>
                        ))}
                    </Grid>
                </PrintSheet>
            </div>
            <Card variant="outlined">
                <TabPro tabs={[{
                    label: "اطلاعات حقوق بگیران",
                    panel: <TablePro rows={data.tttt1} columns={tableColumns1} showTitleBar={false}/>
                },{
                    label: "مشخصات ریز حقوق بگیران",
                    panel: <TablePro rows={data.tttt2} columns={tableColumns2} showTitleBar={false}/>
                }]}/>
            </Card>
        </React.Fragment>
    )
}
