import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import CommitteeForm from './CommitteeForm';

const committee = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={<CardHeader title={"تعريف کمیته"} />}
            content={<>
                {/* <SupplyRequest formValues={formValues} setFormValues={setFormValues}/> */}
                <CommitteeForm/>
                {/* <box>hhh</box> */}
            </>}

        />

    </React.Fragment>
    )
};

export default committee;