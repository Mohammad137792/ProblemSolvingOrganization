import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import PartyDefinitionForm from './PartyDefinitionForm';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

const PartyDefinition = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={
                <CardHeader title={
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <Typography color="textSecondary">اتوماسیون تغذیه </Typography>
                        <KeyboardArrowLeftIcon color="disabled" />
                        {"گروه غذایی"}
                    </Box>
                } />
            }
            content={<>
                <PartyDefinitionForm/>
            </>}

        />

    </React.Fragment>
    )
};

export default PartyDefinition;