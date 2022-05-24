import React from "react";
import {Grid, Table, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import DisplayField from "../../../../components/DisplayField";
import PrintSheet from "../../../../components/PrintSheet";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Card from "@material-ui/core/Card";

export default function OTBSaderat({data={},printRef}) {
    const formStructure = [
        {
            name    : "id1",
            label   : "تاریخ پرداخت",
            options : "Date"
        },{
            name    : "id2",
            label   : "شماره سریال",
        },{
            name    : "id3",
            label   : "نام و نام خانوادگی دارنده حساب",
        },{
            name    : "id4",
            label   : "شماره شبا",
        }, {
            name    : "id1",
            label   : "تعداد ردیف ها",
        },{
            name    : "id2",
            label   : "جمع ردیف ها",
        }]

    const tableColumns = [
        {
        name    : "id01",
        label   : "شماره شبا",
    },{
        name    : "id02",
        label   : "نام و نام خانوادگی دارنده حساب",
    },{
        name    : "id03",
        label   : "مقدار (ریال)",
    },{
        name    : "id04",
        label   : "بابت",
    },{
        name    : "id05",
        label   : "شرح تراکنش",
    },{
        name    : "id06",
        label   : "کد ملی",
    },{
        name    : "id07",
        label   : "کد شهاب",
    },{
        name    : "id08",
        label   : "کد پستی",
    },{
        name    : "id09",
        label   : "شناسه واریز",
    }]

    return (
        <div ref={printRef}>
            <PrintSheet>
                <Box style={{marginBottom:'0.5cm'}}>
                    <Typography variant="h6" >{"دستور پرداخت بانک"}</Typography>
                </Box>
                <Grid container spacing={2} style={{marginBottom:'1cm'}}>
                    {formStructure.map((field,index) => (
                        <Grid item xs={field.col||4} key={index}>
                            <DisplayField variant="display" value={data[field.name]} {...field}/>
                        </Grid>
                    ))}
                </Grid>
                <Box style={{marginBottom:'0.5cm',marginTop:'1cm'}}>
                    <Typography variant="h6" >{"لیست پرسنل"}</Typography>
                </Box>
                <TablePrint rows={data.tttt1} columns={tableColumns}/>
            </PrintSheet>
        </div>
    )
}

function TablePrint({columns, rows}) {
    return (
        <Card variant="outlined" style={{marginBottom:'1cm'}} square>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ردیف</TableCell>
                        {columns.map((col,ind)=>(
                            <TableCell key={ind}>{col.label}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows && rows.map((row,ind)=>(
                        <TableRow key={ind}>
                            <TableCell>{ind+1}</TableCell>
                            {columns.map((col,ind)=>(
                                <TableCell key={ind}><DisplayField value={row[col.name]} {...col}/></TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {!rows && (
                        <TableRow>
                            <TableCell align="center" colSpan={columns.length+1}>داده ای وجود ندارد!</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    )
}
