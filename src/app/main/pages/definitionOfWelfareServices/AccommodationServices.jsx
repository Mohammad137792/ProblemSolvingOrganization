import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import AccommodationServicesFormRoom from "./AccommodationServices/AccommodationServicesFormRoom"
import SupplyRequest from './ticket/SupplyRequest'

const AccommodationServices = () => {
    const [formValues, setFormValues]=useState({})

    return (
        <React.Fragment>
        <FusePageSimple
            header={<CardHeader title={"تعريف خدمات اقامتی"} />}
            content={<>
                {/* <SupplyRequest formValues={formValues} setFormValues={setFormValues}/> */}
                <AccommodationServicesFormRoom/>
            </>}

        />

    </React.Fragment>
    )
};

export default AccommodationServices;