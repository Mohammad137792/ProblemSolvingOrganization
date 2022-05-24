import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import ResultSuggestionForm from './ResultSuggestionForm';

const resultSuggestion = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={<CardHeader title={" مشاهده نتیجه پیشنهاد"} />}
            content={<>
                {/* <SupplyRequest formValues={formValues} setFormValues={setFormValues}/> */}
                <ResultSuggestionForm/>
                {/* <box>hhh</box> */}
            </>}

        />

    </React.Fragment>
    )
};

export default resultSuggestion;