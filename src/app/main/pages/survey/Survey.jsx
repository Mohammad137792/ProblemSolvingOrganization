import React from "react";
import {Redirect, Route, Switch, useHistory, useLocation, useRouteMatch} from "react-router-dom";
import SurveyDefinition from "./definition/SurveyDefinition";
import SurveyAnalysis from "./analysis/SurveyAnalysis";
import SurveyList from "./definition/SurveyList";
import CardHeader from "@material-ui/core/CardHeader";
import {Button} from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import {FusePageSimple} from "../../../../@fuse";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Survey() {
    const { path } = useRouteMatch();
    const history = useHistory();
    let query = useQuery();

    return (
        <Switch>
            <Route path={`${path}/definition`}>
                <SurveyDefinition/>
            </Route>
            <Route path={`${path}/list`}>
                <SurveyList/>
            </Route>
            <Route path={`${path}/analysis`}>
                <FusePageSimple
                    header={
                        <CardHeader
                            className="w-full"
                            title={"تحلیل و بررسی نظرسنجی"}
                            action={
                                <Button variant="outlined" onClick={() => history.goBack()} endIcon={<KeyboardBackspaceIcon />}>بازگشت</Button>
                            }
                        />
                    }
                    content={
                        <SurveyAnalysis questionnaireAppId={query.get("id")} code={query.get("code")}/>
                    }
                />
            </Route>
            <Route>
                <Redirect to={`${path}/list`} />
            </Route>
        </Switch>
    )
}
