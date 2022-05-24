import React, { Fragment } from 'react';
import { FusePageSimple } from '@fuse'
import { CardHeader } from '@material-ui/core';
import StudyNeedAssessmentOrganizationForm from './StudyNeedAssessmentOrganizationForm';

const studyneedAssessmentOrganization = () => {

    return (
        <Fragment>
        <FusePageSimple
            header={<CardHeader title={"بررسی  نیازسنجی سازمان"} />}
            content={<>
                <StudyNeedAssessmentOrganizationForm />
            </>}

        />

    </Fragment>
    )
};

export default studyneedAssessmentOrganization;