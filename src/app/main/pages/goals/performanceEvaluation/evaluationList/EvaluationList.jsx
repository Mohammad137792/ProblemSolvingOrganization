import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import EvaluationListForm from './EvaluationListForm';

const EvaluationList = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={<CardHeader title={"لیست دوره های ارزیابی   "} />}
            content={<>
                {/* <SupplyRequest formValues={formValues} setFormValues={setFormValues}/> */}
                <EvaluationListForm/>
                {/* <box>hhh</box> */}
            </>}

        />

    </React.Fragment>
    )
};

export default EvaluationList;