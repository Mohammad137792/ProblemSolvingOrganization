import React from "react";
import {Redirect, Route, Switch, useRouteMatch, useLocation} from "react-router-dom";
import QuestionnaireEditor from "./editor/QuestionnaireEditor";
import QuestionnaireArchive from "./archive/QuestionnaireArchive";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function QuestionnaireRoot() {
    const { path } = useRouteMatch();
    let query = useQuery();

    return (
        <Switch>
            <Route path={`${path}/editor`}>
                <QuestionnaireEditor questionnaireId={query.get("id")} />
            </Route>
            <Route path={`${path}/archive`}>
                <QuestionnaireArchive/>
            </Route>
            <Route>
                <Redirect to={`${path}/editor`} />
            </Route>
        </Switch>
    )
}
