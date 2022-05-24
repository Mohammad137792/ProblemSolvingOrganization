import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import DailyReserveForm from './DailyReserveForm';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

const DailyReserve = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={
                <CardHeader title={
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <Typography color="textSecondary">اتوماسیون تغذیه </Typography>
                        <KeyboardArrowLeftIcon color="disabled" />
                        {"رزرو روزانه "}
                    </Box>
                } />
            }
            content={<>
                <DailyReserveForm/>
            </>}

        />

    </React.Fragment>
    )
};

export default DailyReserve;