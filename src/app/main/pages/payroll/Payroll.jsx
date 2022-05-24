import React, {createRef} from "react";
import {Redirect, Route, Switch, useLocation, useRouteMatch} from "react-router-dom";
import PayrollOutputType from "./outputType/PayrollOutputType";
import PayrollSalarySlipType from "./salarySlipType/PayrollSalarySlipType";
import PayrollAccounting from "./accounting/PayrollAccounting";
import PayGroup from "./payGroup/PayGroup";
import PayrollCalculationsList from "./reports/calculations/PayrollCalculationsList";
import PayrollOutputs from "./reports/outputs/PayrollOutputs";
import PayrollBaseData from "./baseData/PayrollBaseData";
import SalaryCalculation from "./salaryCalculation/SalaryCalculation";
import SalaryVerification from "./salaryCalculation/SalaryVerification";
import AfterVerificationActions from "./salaryCalculation/afterVerificationActions/AfterVerificationActions";
import PayrollFactors from "./factors/PayrollFactors";
import {FusePageSimple} from "../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import PayrollCalculationDetails from "./reports/calculationDetails/PayrollCalculationDetails";
import PayrollAuditReport from "./reports/audit/PayrollAuditReport";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles(() => ({
    headerTitle: {
        display: "flex",
        alignItems: "center"
    }
}));

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }
export function PayrollCardHeader({title,hasReturnButton}) {
    const classes = useStyles();
    const history = useHistory();

    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
            <CardHeader
                title={
                    <Box className={classes.headerTitle}>
                        <Typography color="textSecondary">حقوق و دستمزد </Typography>
                        <KeyboardArrowLeftIcon color="disabled"/>
                        {title}
                    </Box>
                }
            />
            {hasReturnButton && 
                <Button variant="contained" style={{ background: "white", color: "black", height: "50px" }} className="ml-10  mt-5" onClick={()=>{history.goBack()}}
            startIcon={<KeyboardBackspaceIcon />}>بازگشت</Button>
            }
        </div>
    )
}

function SalaryCalculationPage() {
    const myScrollElement = createRef();
    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 70;
    }
    return (
        <FusePageSimple
            ref={myScrollElement}
            header={<PayrollCardHeader title="محاسبه حقوق و دستمزد"/>}
            content={
                <Box p={2}>
                    <Card>
                        <SalaryCalculation scrollTop={scroll_to_top}/>
                    </Card>
                </Box>
            }
        />
    )
}

export default function Payroll() {
    const { path } = useRouteMatch();
    // let query = useQuery();

    return (
        <Switch>
            <Route path={`${path}/outputType`}>
                <PayrollOutputType/>
            </Route>
            <Route path={`${path}/factors`}>
                <PayrollFactors/>
            </Route>
            <Route path={`${path}/salarySlipType`}>
                <PayrollSalarySlipType/>
            </Route>
            <Route path={`${path}/accounting`}>
                <PayrollAccounting/>
            </Route>
            <Route path={`${path}/payrollGroup`}>
                <PayGroup/>
            </Route>
            <Route path={`${path}/baseData`}>
                <PayrollBaseData/>
            </Route>
            <Route path={`${path}/salaryCalculation`}>
                <SalaryCalculationPage/>
            </Route>
            <Route path={`${path}/SalaryVerification`}>
                <SalaryVerification/>
            </Route>
            <Route path={`${path}/afterActions`}>
                <AfterVerificationActions/>
            </Route>
            <Route path={`${path}/reports/calculations`} exact>
                <PayrollCalculationsList/>
            </Route>
            <Route path={`${path}/reports/calculations/:id`}>
                <PayrollCalculationDetails/>
            </Route>
            <Route path={`${path}/reports/outputs`}>
                <PayrollOutputs/>
            </Route>
            <Route path={`${path}/reports/audit`}>
                <PayrollAuditReport/>
            </Route>
            <Route>
                <Redirect to={`${path}/outputType`} />
            </Route>
        </Switch>
    )
}
