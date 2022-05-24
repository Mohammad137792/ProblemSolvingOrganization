import React from "react";
import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import {makeStyles} from "@material-ui/core/styles";
import TrafficInfo from "./trafficInfo/TrafficInfo";
import IntegrationRequest from "./integrationRequest/IntegrationRequest";

const useStyles = makeStyles(() => ({
    headerTitle: {
        display: "flex",
        alignItems: "center"
    }
}));

export function FunctionalManagementCardHeader({title}) {
    const classes = useStyles();
    return (
        <CardHeader
            title={
                <Box className={classes.headerTitle}>
                    <Typography color="textSecondary">مدیریت کارکرد </Typography>
                    <KeyboardArrowLeftIcon color="disabled"/>
                    {title}
                </Box>
            }
        />
    )
}

export default function FunctionalManagement() {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/integrationRequest`}>
                <IntegrationRequest/>
            </Route>
            <Route path={`${path}/trafficInfo`}>
                <TrafficInfo/>
            </Route>
            <Route>
                <Redirect to={`${path}/trafficInfo`} />
            </Route>
        </Switch>
    )
}
