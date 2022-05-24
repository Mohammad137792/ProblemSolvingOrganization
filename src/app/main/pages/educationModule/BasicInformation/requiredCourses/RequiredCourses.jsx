import React from 'react';
import { Box,CardContent, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import RequiredCoursesTable from "./RequiredCourseTable"
import { useHistory, useParams } from 'react-router-dom';

const RequiredCourses = () => {
    
    const curriculumId = useParams();

    return (
        <React.Fragment>
            <FusePageSimple
                header={<CardHeader title={"تدوین برنامه آموزشی"} />}
                content={<>
                    <Card variant="outlined">
                        <CardContent>
                            <RequiredCoursesTable curriculumId={curriculumId}/>
                        </CardContent>
                    </Card>
                </>}

            />

        </React.Fragment>
    )
};

export default RequiredCourses;