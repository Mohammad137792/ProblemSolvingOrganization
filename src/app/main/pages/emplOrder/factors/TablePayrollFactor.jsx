import React from "react";
import TableProBase from "../../../components/TableProBase";
import {useStyles} from "../../../components/TablePro"
import {withStyles} from "@material-ui/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import {TableRow} from "@material-ui/core";

const groupBy = (array, key) =>
    array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});

class PFTableRaw extends TableProBase{
    constructor() {
        super();
    }
    TBody = ()=>{
        const {rows} = this.props;
        const grouped = groupBy(rows, 'groupName')
        let totalScore = 0
        let totalValue = 0
        let j = 0
        Object.entries(grouped).map(([key,val])=>{
            val.forEach(p => {
                totalScore += Number(p.scoreValue) || 0
                totalValue += Number(p.payrollFactorValue) || 0
            })
        })
        return(
            <TableBody>
                {Object.entries(grouped).map(([key, value],ind) => (
                    <>
                        <TableRow key={ind} className="table-sub-head">
                            <TableCell/>
                            <TableCell colSpan={3}>{key==="null"?"سایر":key}</TableCell>
                        </TableRow>
                        {value.map((payroll)=>(
                            <TableRow key={++j}>
                                <TableCell>{j}</TableCell>
                                <TableCell>{payroll.title}</TableCell>
                                <TableCell>{payroll.scoreValue}</TableCell>
                                <TableCell>{payroll.payrollFactorValue}</TableCell>
                            </TableRow>
                        ))}
                    </>
                ))}
                <TableRow className="table-sub-head">
                    <TableCell/>
                    <TableCell>مجموع :</TableCell>
                    <TableCell>{totalScore}</TableCell>
                    <TableCell>{totalValue}</TableCell>
                </TableRow>
            </TableBody>
        )
    }
    render() {
        return super.render();
    }
}
const PFTable = withStyles(useStyles)(PFTableRaw);

export default function PayrollFactorTable({data,showTitleBar=true}) {
    const tableColsFactors = [
        {name: "title", label: "عنوان عامل", type: "text"},
        {name: "score", label: "امتیاز", type: "number"},
        {name: "value", label: "مقدار ریالی", type: "number"},
    ]
    return (
        <PFTable
            title="لیست عوامل حکمی"
            columns={tableColsFactors}
            rows={data}
            pagination={false}
            showTitleBar={showTitleBar}
        />
    )
}
