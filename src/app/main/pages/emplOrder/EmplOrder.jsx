import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import {FusePageSimple} from "../../../../@fuse";
import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import Box from "@material-ui/core/Box";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import EmplOrderContract from "./contract/EmplOrderContract";
import EmplOrderFactors from "./factors/EmplOrderFactors";
import EmplOrderOrders from "./orders/EmplOrderOrders";
import EmplOrderContractsArchive from "./contractsArchive/EmplOrderContractsArchive";
import EmplOrderOrdersArchive from "./ordersArchive/EmplOrderOrdersArchive";
import EmplOrderStructure from "./structure/EmplOrderStructure";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import EmplOrderStartIssuance from "./issuance/EmplOrderStartIssuance";
import MEOStepper from "./modifiedEmplOrder/MEOStepper";

const useStyles = makeStyles(() => ({
    headerTitle: {
        display: "flex",
        alignItems: "center"
    }
}));

function EmplOrder(){
    return <FusePageSimple
        header={ <CardHeader title={"کارگزینی"}/> }
        content={
            <Box p={2}>
                کارگزینی...
            </Box>
        }
    />
}

function SubEmplOrderFrame(props){
    const classes = useStyles();
    const {children, title} = props;
    return <FusePageSimple
        header={
            <CardHeader title={
                <Box className={classes.headerTitle}>
                    <Typography color="textSecondary">کارگزینی </Typography>
                    <KeyboardArrowLeftIcon color="disabled"/>
                    {title}
                </Box>
            }/>
        }
        content={
            <Box p={2}>{children}</Box>
        }
    />
}

export default function EmplOrderRoot(){
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={path}>
                <EmplOrder />
            </Route>
            <Route path={`${path}/contract`}>
                <SubEmplOrderFrame title="قرارداد">
                    <EmplOrderContract />
                </SubEmplOrderFrame>
            </Route>
            <Route path={`${path}/orders`}>
                <SubEmplOrderFrame title="احکام کارگزینی">
                    <EmplOrderOrders/>
                </SubEmplOrderFrame>
            </Route>
            <Route path={`${path}/factors`}>
                <SubEmplOrderFrame title="عوامل حکمی">
                    <EmplOrderFactors/>
                </SubEmplOrderFrame>
            </Route>
            <Route path={`${path}/structure`}>
                <SubEmplOrderFrame title="نسخه احکام کارگزینی">
                    <EmplOrderStructure/>
                </SubEmplOrderFrame>
            </Route>
            <Route path={`${path}/issuance`}>
                <SubEmplOrderFrame title="صدور احکام و تنظیم قرارداد">
                    <EmplOrderStartIssuance/>
                </SubEmplOrderFrame>
            </Route>
            <Route path={`${path}/modifyEmplOrder`}>
                <SubEmplOrderFrame title="صدور احکام اصلاحی">
                    <MEOStepper/>
                </SubEmplOrderFrame>
            </Route>
            <Route path={`${path}/archive/orders`}>
                <SubEmplOrderFrame title="بایگانی احکام کارگزینی">
                    <EmplOrderOrdersArchive/>
                </SubEmplOrderFrame>
            </Route>
            <Route path={`${path}/archive/contracts`}>
                <SubEmplOrderFrame title="بایگانی قراردادها">
                    <EmplOrderContractsArchive/>
                </SubEmplOrderFrame>
            </Route>
            <Route>
                <Redirect to={path} />
            </Route>
        </Switch>
    )
}
