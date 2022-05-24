import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import NeedAssessmentEmpolyForm from './NeedAssessmentEmpolyForm';

const needAssessmentEmpoly = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={<CardHeader title={"تعريف  نیازسنجی آموزشی"} />}
            content={<>
                {/* <SupplyRequest formValues={formValues} setFormValues={setFormValues}/> */}
                <NeedAssessmentEmpolyForm/>
                {/* <box>hhh</box> */}
            </>}

        />

    </React.Fragment>
    )
};

export default needAssessmentEmpoly;