import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import SuggestionGuidelineForm from './SuggestionGuidelineForm';

const suggestionGuideline = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={<CardHeader title={"صفحه راهبری پیشنهادات"} />}
            content={<>
                {/* <SupplyRequest formValues={formValues} setFormValues={setFormValues}/> */}
                <SuggestionGuidelineForm/>
                {/* <box>hhh</box> */}
            </>}

        />

    </React.Fragment>
    )
};

export default suggestionGuideline;