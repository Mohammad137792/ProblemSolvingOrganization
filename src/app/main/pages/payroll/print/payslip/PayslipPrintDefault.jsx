import React from "react";
import {SERVER_URL} from "../../../../../../configs";
import Card from "@material-ui/core/Card";
import {Grid, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import DisplayField from "../../../../components/DisplayField";
import PrintSheet from "../../../../components/PrintSheet";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {makeStyles} from "@material-ui/core/styles";

const empty = ".............."

const useStyles = makeStyles(() => ({
    cellBordered: {
        border: "1px solid rgba(0, 0, 0, 0.12)"
    },
    cellAlignTop: {
        border: "1px solid rgba(0, 0, 0, 0.12)",
        verticalAlign: "top",
        padding: 0
    }
}));

export default function PayslipPrintDefault({data}) {
    return (
        <PrintSheet>
            <SheetHeader data={data}/>
            <SheetContent data={data}/>
        </PrintSheet>
    )
}

function SheetContent({data}) {
    const classes = useStyles()
    return (
        <React.Fragment>
            <Table size="small">
                <TableRow>
                    <TableCell className={classes.cellBordered}><DisplayField label="کد پرسنلی" value={data.person?.pseudoId} variant="display"/></TableCell>
                    <TableCell className={classes.cellBordered}><DisplayField label="نام پرسنل" value={data.person?.fullName} variant="display"/></TableCell>
                    <TableCell className={classes.cellBordered}><DisplayField label="کد ملی" value={data.person?.nationalId} variant="display"/></TableCell>
                    <TableCell className={classes.cellBordered}><DisplayField label="پست سازمانی" valueObject={data.person?.emplPosition} options="Render" render={opt => `${opt?.pseudoId??"-"} ─ ${opt?.description??"-"}`} variant="display"/></TableCell>
                    <TableCell className={classes.cellBordered}><DisplayField label="حکم کارگزینی" valueObject={data.person?.emplOrder} options="Render" render={opt => `${opt?.pseudoId??"-"} ─ ${opt?.description??"-"}`} variant="display"/></TableCell>
                </TableRow>
            </Table>
            <Table size="small">
                <TableRow>
                    <TableCell className={classes.cellAlignTop}>
                        <FactorsTable list={data.factors}/>
                    </TableCell>
                    <TableCell className={classes.cellAlignTop}>
                        <WorkedTable list={data.worked}/>
                    </TableCell>
                    <TableCell className={classes.cellAlignTop} padding="none">
                        <InstallmentsTable list={data.installments}/>
                    </TableCell>
                </TableRow>
            </Table>
            <Table size="small">
                <TableRow>
                    <TableCell className={classes.cellBordered}>خالص دریافتی {data.payslip?.value||'?'} به شماره حساب {data.payslip?.accountNumber||'?'} نزد بانک {data.payslip?.bankName||'?'} واریز شد.</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className={classes.cellBordered}>توضیحات: {data.payslip?.description||'-'}</TableCell>
                </TableRow>
            </Table>
        </React.Fragment>
    )
}

function FactorsTable({list=[]}) {
    const sum = (a,b) => a + b
    const totalBenefits = list.map(i => i.benefit||0).reduce(sum,0)
    const totalDeductions = list.map(i => i.deduction||0).reduce(sum,0)

    return (
        <Table size="small">
            <TableRow>
                <TableCell>شرح</TableCell>
                <TableCell>مزایا</TableCell>
                <TableCell>کسورات</TableCell>
            </TableRow>
            {list.map((item,index) => (
                <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.benefit||'-'}</TableCell>
                    <TableCell>{item.deduction||'-'}</TableCell>
                </TableRow>
            ))}
            <TableRow>
                <TableCell>مجموع</TableCell>
                <TableCell>{totalBenefits}</TableCell>
                <TableCell>{totalDeductions}</TableCell>
            </TableRow>
        </Table>
    )
}

function WorkedTable({list=[]}) {
    return (
        <Table size="small">
            <TableRow>
                <TableCell>کارکرد</TableCell>
            </TableRow>
            {list.map((item,index) => (
                <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                </TableRow>
            ))}
        </Table>
    )
}

function InstallmentsTable({list=[]}) {
    return (
        <Table size="small">
            <TableRow>
                <TableCell>اقساط وام</TableCell>
            </TableRow>
            {list.map((item,index) => (
                <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                </TableRow>
            ))}
        </Table>
    )
}

function SheetHeader({data}) {
    const logo = data.company?.logo
    const code = data.payslip?.code
    const date = data.payslip?.issuanceDate
    return(
        <Card variant="outlined" square style={{padding:'16px', marginBottom:'12px'}}>
            <Grid container>
                <Grid item xs={3}>
                    <img src={(SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + logo)} alt="Logo" style={{maxHeight:'3cm'}}/>
                </Grid>
                <Grid item xs={6}>
                    <Typography align="center">بسمه تعالی</Typography>
                    <Box m={2}/>
                    <Typography variant="h6" align="center">پیش نمایش فیش حقوقی</Typography>
                </Grid>
                <Grid item xs={3} style={{paddingTop:'1cm'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={7}>
                            <Typography align="right">کد فیش :</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography align="left"><b>{code || empty}</b></Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={7}>
                            <Typography align="right">تاریخ صدور :</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography align="left"><b>{date ? (<DisplayField options="Date" format="jYYYY/jM/jD" value={date} />) : empty}</b></Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    )
}
