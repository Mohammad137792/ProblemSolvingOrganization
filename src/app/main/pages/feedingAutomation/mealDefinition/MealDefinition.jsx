import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import MealDefinitionForm from './MealDefinitionForm';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

const MealDefinition = () => {

    return (
        <React.Fragment>
            <FusePageSimple
                header={
                    <CardHeader title={
                        <Box style={{ display: "flex", alignItems: "center" }}>
                            <Typography color="textSecondary">اتوماسیون تغذیه </Typography>
                            <KeyboardArrowLeftIcon color="disabled" />
                            {" وعده غذایی"}
                        </Box>
                    } />
                }
                content={<>
                    <MealDefinitionForm />
                </>}

            />

        </React.Fragment>
    )
};

export default MealDefinition;