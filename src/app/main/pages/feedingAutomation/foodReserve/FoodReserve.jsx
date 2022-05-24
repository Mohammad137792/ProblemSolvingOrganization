import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import FoodReserveForm from './FoodReserveForm';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

const FoodReserve = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={<CardHeader title={"رزرو غذا"} />}
            header={
                <CardHeader title={
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <Typography color="textSecondary">اتوماسیون تغذیه </Typography>
                        <KeyboardArrowLeftIcon color="disabled" />
                        {"رزرو غذا"}
                    </Box>
                } />
            }
            content={<>
                <FoodReserveForm/>
            </>}

        />

    </React.Fragment>
    )
};

export default FoodReserve;