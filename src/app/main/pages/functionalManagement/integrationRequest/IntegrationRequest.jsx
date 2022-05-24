import React, {createRef} from "react";
import {FusePageSimple} from "../../../../../@fuse";
import {FunctionalManagementCardHeader} from "../FunctionalManagement";
import {Box} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import IntegrationRequestProcess from "./IntegrationRequestProcess";

export default function IntegrationRequest() {
    const myScrollElement = createRef();

    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 0;
    }

    return (
        <FusePageSimple
            ref={myScrollElement}
            header={<FunctionalManagementCardHeader title="درخواست تجمیع کارکرد"/>}
            content={
                <Box p={2}>
                    <Card>
                        <IntegrationRequestProcess scrollTop={scroll_to_top}/>
                    </Card>
                </Box>
            }
        />
    )
}
