import React from 'react';
import { Box, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import InsuranceRequestCheckForm from './InsuranceRequestCheckForm';

const InsuranceRequestCheck = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={<CardHeader title={"بررسی درخواست بیمه تکمیلی"} />}
            content={
                <Box>
                    <InsuranceRequestCheckForm/>
                </Box>
            }
        />
    </React.Fragment>
    )
};

export default InsuranceRequestCheck;