import React from "react";
import {Redirect, Route, Switch, useLocation, useRouteMatch} from "react-router-dom";
import CompensationProfile from "./userProfile/CompensationProfile";

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

export default function Compensation() {
    const { path } = useRouteMatch();
    // let query = useQuery();

    return (
        <Switch>
            <Route path={`${path}/userProfile`}>
                <CompensationProfile/>
            </Route>
            <Route>
                <Redirect to={`${path}/userProfile`} />
            </Route>
        </Switch>
    )
}
