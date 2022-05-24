import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import FoodScheduleForm from './FoodScheduleForm';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

const FoodSchedule = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={
                <CardHeader title={
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <Typography color="textSecondary">اتوماسیون تغذیه </Typography>
                        <KeyboardArrowLeftIcon color="disabled" />
                        {" برنامه غذایی"}
                    </Box>
                } />
            }
            content={<>
                <FoodScheduleForm/>
            </>}

        />

    </React.Fragment>
    )
};

export default FoodSchedule;