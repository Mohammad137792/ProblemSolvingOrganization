import React from 'react';
import { Box, Card, CardHeader } from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import PersonalStructureTable from './personalStructure/PersonalStructureTable';
import TabPro from './../../components/TabPro';

const BaseOrganizationStructureInformation = () => {
    const tabs = [{
        label: "ساختار پرسنلی",
        panel: <PersonalStructureTable/>
    }]
    return (
        <React.Fragment>
            <FusePageSimple
                header={<CardHeader title={"اطلاعات پایه ساختار سازمانی"} />}
                content={<>
                    <TabPro tabs={tabs}/>
                </>}

            />

        </React.Fragment>
    )
};

export default BaseOrganizationStructureInformation;