import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import RecordCoursesListForm from './RecordCoursesListForm';

const recordCoursesList = () => {

    return (
        <React.Fragment>
        <FusePageSimple
            header={<CardHeader  title={"تعريف  نیازسنجی آموزشی"} />}
            content={<>
                <RecordCoursesListForm/>
            </>}

        />

    </React.Fragment>
    )
};

export default recordCoursesList;