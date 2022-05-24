import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import NeedAssessmentManagerForm from './NeedAssessmentManagerForm';

const needAssessmentManager = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={<CardHeader title={"تعريف  نیازسنجی آموزشی"} />}
            content={<>
                <NeedAssessmentManagerForm/>
            </>}

        />

    </React.Fragment>
    )
};

export default needAssessmentManager;