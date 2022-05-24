import React from "react";
import {Grid, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import DisplayField from "../../../../components/DisplayField";
import PrintSheet from "../../../../components/PrintSheet";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";

export default function OTIListDisc27({data={},printRef}) {
    const formStructure = [
        {
            name    : "id1",
            label   : "شماره لیست",
        },{
            name    : "id2",
            label   : "شماره کارگاه",
        },{
            name    : "id3",
            label   : "ردیف پیمان",
        },{
            name    : "id4",
            label   : "نام کارفرما",
        },{
            name    : "id5",
            label   : "آدرس شرکت",
            col     : 8
        }]

    const tableColumns = [
        {
        name    : "id01",
        label   : "شماره بیمه",
    },{
        name    : "id02",
        label   : "نام و نام خانوادگی",
    },{
        name    : "id03",
        label   : "شغل",
    },{
        name    : "id04",
        label   : "کد ملی",
    },{
        name    : "id05",
        label   : "شماره شناسنامه",
    },{
        name    : "id06",
        label   : "نام پدر",
    },{
        name    : "id07",
        label   : "تاریخ آغاز",
    },{
        name    : "id08",
        label   : "تاریخ ترک کار",
    },{
        name    : "id09",
        label   : "کارکرد",
    },{
        name    : "id10",
        label   : "دستمزد روزانه",
    },{
        name    : "id11",
        label   : "دستمزد ماهانه",
    },{
        name    : "id12",
        label   : "مزایای ماهانه",
    },{
        name    : "id13",
        label   : "دستمزد و مزایا ماهانه مشمول",
    },{
        name    : "id14",
        label   : "مشمول و غیرمشمول",
    },{
        name    : "id15",
        label   : "حق بیمه سهم بیمه شده",
    },{
        name    : "id16",
        label   : "ملاحظات",
    }]

    return (
        <React.Fragment>
            <div ref={printRef}>
                <PrintSheet>
                    <Box align="center" style={{marginBottom:'1cm'}}>
                        <Typography variant="h6" align="center">{"نام کارگاه"}</Typography>
                        <Box m={2}/>
                        <Typography align="center">{"صورت دستمزد و حقوق و مزایا در ماه 02 سال 1400"}</Typography>
                    </Box>
                    <Grid container spacing={2} style={{marginBottom:'1cm'}}>
                        {formStructure.map((field,index) => (
                            <Grid item xs={field.col||4} key={index}>
                                <DisplayField variant="display" value={data[field.name]} {...field}/>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid container spacing={2} justify="flex-end">
                        <Grid item xs={4}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}><DisplayField label="حق بیمه سهم کارفرما" variant="display" value={data.i7}/></Grid>
                                <Grid item xs={12}><DisplayField label="بیمه بیکاری" variant="display" value={data.i8}/></Grid>
                                <Grid item xs={12}><DisplayField label="جمع کل حق بیمه" variant="display" value={data.i9}/></Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </PrintSheet>
            </div>
            <Box m={2}/>
            <Card variant="outlined">
                <TablePro rows={data.i6||[]} columns={tableColumns} showTitleBar={false}/>
            </Card>
        </React.Fragment>
    )
}
