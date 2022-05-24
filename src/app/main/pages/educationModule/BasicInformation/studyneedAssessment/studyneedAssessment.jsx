import React, { Fragment } from 'react';
import { FusePageSimple } from '@fuse'
import { CardHeader } from '@material-ui/core';
import StudyneedAssessmentForm from './StudyneedAssessmentForm';

const studyneedAssessment = () => {

    return (
        <Fragment>
        <FusePageSimple
            header={<CardHeader title={"ویرایش اطلاعات دوره"} />}
            content={<>
                <StudyneedAssessmentForm />
            </>}

        />

    </Fragment>
    )
};

export default studyneedAssessment;