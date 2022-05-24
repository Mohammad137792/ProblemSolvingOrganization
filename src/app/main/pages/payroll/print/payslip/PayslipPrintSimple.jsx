import React from "react";
import Card from "@material-ui/core/Card";
import {CardContent, Grid} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import DisplayField from "../../../../components/DisplayField";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TablePro from "../../../../components/TablePro";
import {makeStyles} from "@material-ui/core/styles";

const ColStyle = {width: '55px'}

const useStyles = makeStyles(() => ({
    total: {
        '& td': {
            fontWeight: "bold"
        }
    },
}));

export default function PayslipPrintSimple({data}) {
    const formStructure = [
        {
            name    : "fullName",
            label   : "نام پرسنل",
        },{
            name    : "nationalId",
            label   : "کد ملی",
        },{
            name    : "emplPosition",
            label   : "پست سازمانی",
            options : "Render",
            render  : opt => `${opt?.emplPositionCode??"-"} ─ ${opt?.emplPosition??"-"}`,
        },{
            name    : "emplOrder",
            label   : "حکم کارگزینی",
            options : "Render",
            render  : opt => `${opt?.emplOrderCode??"-"} ─ ${opt?.emplOrder??"-"}`,
        }]

    return (
        <Box>
            <Card variant="outlined">
                <CardContent>
                    <Grid container spacing={2}>
                        {formStructure.map((field,index) => (
                            <Grid item xs={12} sm={field.col||4} key={index}>
                                <DisplayField variant="display" value={data.person?data.person[field.name]:null} valueObject={data.person} {...field}/>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
            <Box m={3}/>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                        <FactorsTable list={data.factors}/>
                    </Card>
                    <Box m={2}/>
                    <Card variant="outlined">
                        <TablePro
                            columns={[
                                {name:"description", label: "عنوان"},
                                {name:"value", label: "مقدار", style: ColStyle},
                            ]}
                            rows={data.resultCalc||[]}
                            showTitleBar={false}
                            pagination={false}
                            fixedLayout={true}
                        />
                    </Card>
                    {/* <Card variant="outlined">
                        <TablePro
                            columns={[
                                {name:"description", label: "سایر مزایا و کسورات"},
                                {name:"value", label: "مقدار", style: ColStyle},
                                {name:"unit", label: "واحد", style: ColStyle},
                            ]}
                            rows={data.xxx4||[]}
                            showTitleBar={false}
                            pagination={false}
                            fixedLayout={true}
                        />
                    </Card> */}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                        <TablePro
                            columns={[
                                {name:"description", label: "کسورات قانونی"},
                                {name:"value", label: "مقدار مشمول", style: ColStyle},
                                {name:"employerValue", label: "سهم کارفرما", style: ColStyle},
                                {name:"employeeValue", label: "سهم کارگر", style: ColStyle},
                            ]}
                            rows={data.legalDeducts||[]}
                            showTitleBar={false}
                            pagination={false}
                            fixedLayout={true}
                        />
                    </Card>
                    <Box m={2}/>
                    <Card variant="outlined">
                        <TablePro
                            columns={[
                                {name:"description", label: "عامل کارکرد"},
                                {name:"value", label: "مقدار", style: ColStyle},
                                {name:"unit", label: "واحد", style: ColStyle},
                            ]}
                            rows={data.worked||[]}
                            showTitleBar={false}
                            pagination={false}
                            fixedLayout={true}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                        <TablePro
                            columns={[
                                {name:"description", label: "تراکنش ها"},
                                {name:"type", label: "نوع", style: ColStyle},
                                {name:"value", label: "مقدار", style: ColStyle},
                            ]}
                            rows={data.transactions||[]}
                            showTitleBar={false}
                            pagination={false}
                            fixedLayout={true}
                        />
                    </Card>
                    <Box m={2}/>
                </Grid>
            </Grid>
            <Box m={2}/>
            <Card variant="outlined">
                <TablePro
                    columns={[
                        {name:"title", label: "بازخرید"},
                        {name:"timePeriod", label: "دوره زمانی"},
                        {name:"payslip", label: "فیش حقوق"},
                        {name:"value", label: "مقدار"},
                    ]}
                    rows={data.payback||[]}
                    showTitleBar={false}
                    pagination={false}
                />
            </Card>
            {/* <Card variant="outlined">
                <TablePro
                    columns={[
                        {name:"description", label: "معوقات"},
                        {name:"timePeriod", label: "دوره زمانی"},
                        {name:"payslip", label: "فیش حقوق"},
                        {name:"value", label: "مقدار"},
                    ]}
                    rows={data.xxx1||[]}
                    showTitleBar={false}
                    pagination={false}
                />
            </Card> */}
        </Box>
    )
}

function FactorsTable({list=[]}) {
    const classes = useStyles()
    const sum = (a,b) => a + b
    const totalDebt = list.map(i => i.deduction||0).reduce(sum,0)
    const totalCredit = list.map(i => i.benefit||0).reduce(sum,0)

    return (
        <React.Fragment>
            <TablePro
                columns={[
                    {name:"description", label: "عنوان عامل حقوق و دستمزد"},
                    {name:"deduction", label: "بدهکار", style: ColStyle},
                    {name:"benefit", label: "بستانکار", style: ColStyle},
                ]}
                rows={list}
                showTitleBar={false}
                pagination={false}
                fixedLayout={true}
            />
            <Table className={classes.total}>
                <TableRow>
                    <TableCell>مجموع</TableCell>
                    <TableCell style={ColStyle}>{totalDebt}</TableCell>
                    <TableCell style={ColStyle}>{totalCredit}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>حقوق قابل پرداخت</TableCell>
                    <TableCell colSpan={2}>{totalDebt-totalCredit}</TableCell>
                </TableRow>
            </Table>
        </React.Fragment>

    )
}
