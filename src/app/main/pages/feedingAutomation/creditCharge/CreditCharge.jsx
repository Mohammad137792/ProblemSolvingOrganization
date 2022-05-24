import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import CreditChargeForm from './CreditChargeForm';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

const CreditCharge = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={
                <CardHeader title={
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <Typography color="textSecondary">اتوماسیون تغذیه </Typography>
                        <KeyboardArrowLeftIcon color="disabled" />
                        {"شارژ اعتبار"}
                    </Box>
                } />
            }
            content={<>
                <CreditChargeForm/>
            </>}

        />

    </React.Fragment>
    )
};

export default CreditCharge;