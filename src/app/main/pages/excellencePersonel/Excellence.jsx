import React, {createRef} from "react";
import {Redirect, Route, Switch, useLocation, useRouteMatch} from "react-router-dom";
import WaitingRegistrationForm from "./waitingRegistration/WaitingRegistrationForm";
import ExcellencePersonelForm from "./ExcellencePersonel/ExcellencePersonelForm";
import ExecutionProgramForm from "./ExecutionProgram/ExecutionProgramForm";
import ReportsForm from "./Reports/ReportsForm";
import RegistrationForm from "./Registration/RegistrationForm";
import ApproveOffers from "./ApproveOffers/ApproveOffersForm";
import RecordEvents from "./RecordEvents/RecordEventsForm";
import ConfirmationManagers from "./ConfirmationManagers/ConfirmationManagersForm";
import AudienceEvaluation from "./AudienceEvaluation/AudienceEvaluation";
import ProgramEvaluation from "./ProgramEvaluation/ProgramEvaluation";
import Profile from "./Profile/Profile";
import {FusePageSimple} from "../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";


export default function Excelence() {
    const { path } = useRouteMatch();
    // let query = useQuery();

    return (
        <Switch>
            <Route path={`${path}/defineProgram`}>
                <ExcellencePersonelForm/>
            </Route>
            <Route path={`${path}/excellencePersonel`}>
                <ExcellencePersonelForm/>
            </Route>
            <Route path={`${path}/WaitingRegistration`}>
                <WaitingRegistrationForm/>
            </Route>
            <Route path={`${path}/ExecutionProgram`}>
                <ExecutionProgramForm/>
            </Route>
            <Route path={`${path}/Reports`}>
                <ReportsForm/>
            </Route>
            <Route path={`${path}/Registration`}>
                <RegistrationForm/>
            </Route>
            <Route path={`${path}/ApproveOffers`}>
                <ApproveOffers/>
            </Route>
            <Route path={`${path}/ConfirmationManagers`}>
                <ConfirmationManagers/>
            </Route>            
            <Route path={`${path}/RecordEvents`}>
                <RecordEvents/>
            </Route>  
            <Route path={`${path}/AudienceEvaluation`}>
                <AudienceEvaluation/>
            </Route>
            <Route path={`${path}/ProgramEvaluation`}>
                <ProgramEvaluation/>
            </Route>
            <Route path={`${path}/Profile`}>
                <Profile/>
            </Route>
        </Switch>
    )
}
