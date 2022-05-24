import React from 'react';
import { Box, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import Ticket from "./ticket/Ticket"
const AccommodationServicesForm = () => {
    return (
        <React.Fragment>
            <FusePageSimple
                header={<CardHeader title={"تعريف بليط سفر"} />}
                content={<>
                    <Ticket/>
                </>}

            />

        </React.Fragment>
    )
};

export default AccommodationServicesForm;