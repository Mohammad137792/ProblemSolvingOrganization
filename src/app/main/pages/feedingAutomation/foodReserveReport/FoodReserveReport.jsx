import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import FoodReserveReportForm from './FoodReserveReportForm';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

const FoodReserveReport = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={
                <CardHeader title={
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <Typography color="textSecondary">اتوماسیون تغذیه </Typography>
                        <KeyboardArrowLeftIcon color="disabled" />
                        {"گزارش رزرو غذا "}
                    </Box>
                } />
            }
            content={<>
                <FoodReserveReportForm/>
            </>}

        />

    </React.Fragment>
    )
};

export default FoodReserveReport;