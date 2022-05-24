import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Paper, Tabs, Tab, Typography, CircularProgress, Button } from '@material-ui/core';
import { FusePageSimple } from "@fuse";
import TabPane from "../../components/TabPane";

import SystemBaseInformation from "./steps/systemBaseInformation/systemBaseInformation";
import Skills from "../skills/skills"

// import AddressInfo from "../personnelBaseInformation/tabs/AddressInformation/AddressInfo";
import axios from "axios";
import {SERVER_URL} from "../../../../configs";
import {useSelector} from "react-redux/es/hooks/useSelector";
import OrganizationFormHeader from "../organizationalStructureModule/defineOrganization/DefineOrganization";
// import ContactInfo from "../personnelBaseInformation/tabs/ContactInformation/ContactInfo";
// import ContactInfoCyber from "../personnelBaseInformation/tabs/ContactInformation/ContactInfoCyber";
// import BankingInfoCom from "../personnelBaseInformation/tabs/BankInfo/BankingInfoCom";
// import BankingInfo from "./tabs/BankingInfo";

const SystemBaseData = (props) => {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <FusePageSimple
            header={
                < div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
                    <Typography variant="h6" className="p-10">اطلاعات پایه سیستم </Typography>

                </ div>
            }
            content={
                <>
                    {/*<OrganizationFormHeader*/}
                        {/*// personnelId="2222" personnelName="22222"*/}
                        {/*// personnelNationalId="22222"*/}
                        {/*// personnelOrganizationPost=""*/}
                    {/*/>*/}
                    <Paper>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab label="مدل شایستگی " />
                            <Tab label="مهارت‌ها " />

                        </Tabs>
                        <TabPane value={value} index={0} dir={theme.direction}>
                            <SystemBaseInformation/>
                        </TabPane>
                        <TabPane value={value} index={1} dir={theme.direction}>
                            <Skills />
                        </TabPane>

                    </Paper>
                </>
            } />
    )
}

export default SystemBaseData;