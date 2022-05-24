import React from 'react';
import { Box,CardContent, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import DefinitionOfEducationalTable from './define/DefinitionOfEducationalTable';

const DefinitionOfEducationalTitles = () => {
    return (
        <React.Fragment>
            <FusePageSimple
                header={<CardHeader title={"تعریف دوره آموزشی"} />}
                content={<>
                    <Card variant="outlined">
                        <CardContent>
                            <DefinitionOfEducationalTable/>
                        </CardContent>
                    </Card>
                </>}

            />

        </React.Fragment>
    )
};

export default DefinitionOfEducationalTitles;