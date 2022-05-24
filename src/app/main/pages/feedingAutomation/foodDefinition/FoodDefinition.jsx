import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import FoodDefinitionForm from './FoodDefinitionForm';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

const FoodDefinition = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={
                <CardHeader title={
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <Typography color="textSecondary">اتوماسیون تغذیه </Typography>
                        <KeyboardArrowLeftIcon color="disabled" />
                        {" تغذیه "}
                    </Box>
                } />
            }
            content={<>
                <FoodDefinitionForm/>
            </>}

        />

    </React.Fragment>
    )
};

export default FoodDefinition;