import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import ReportGoalsForm from './ReportGoalsForm';

const reportGoals = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={<CardHeader title={" گزارش اهداف"} />}
            content={<>
                {/* <SupplyRequest formValues={formValues} setFormValues={setFormValues}/> */}
                <ReportGoalsForm/>
                {/* <box>hhh</box> */}
            </>}

        />

    </React.Fragment>
    )
};

export default reportGoals;