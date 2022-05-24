import React from 'react';
import { Box, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import InsuranceRequestForm from './InsuranceRequestForm';

const InsuranceRequest = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={<CardHeader title={"درخواست بیمه تکمیلی"} />}
            content={
                <Box>
                    <InsuranceRequestForm/>
                </Box>
            }
        />
    </React.Fragment>
    )
};

export default InsuranceRequest;