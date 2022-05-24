import React from 'react'
import { Box, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'

import Institutions from './Institutions/Institutions'


function InstitutionsAndlecturers() {


    return (
        <React.Fragment>
            <FusePageSimple
                header={<CardHeader title={"تایید صلاحیت موسسات و مدرسین"} />}
                content={<>
                    <Institutions />
                </>}

            />

        </React.Fragment>
    )
}


export default InstitutionsAndlecturers