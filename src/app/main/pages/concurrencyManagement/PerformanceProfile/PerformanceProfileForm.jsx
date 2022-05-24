import React, { useState } from 'react'
import UserInfoHeader from 'app/main/components/UserInfoHeader';
import { CardContent, CardHeader, Box, Card, Button, Tab, Tabs } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import TabPro from "app/main/components/TabPro";
import { makeStyles } from "@material-ui/core/styles";
import BaseInfo from './tabs/BaseInfo';
import LoginDevice from './tabs/LogInDevice';
import WorkingFactorsList from './tabs/WorkingFactorsList';
import MoveShift from './tabs/MoveShift';
import TimeShit from './tabs/TimeShit';


const tabs = [{
    label:"اطلاعات پایه کارکرد" ,
    panel: <BaseInfo />
},
{
    label:"ثبت در دستگاه",
    panel: <LoginDevice />
},
{
    label: "لیست درخواست های عوامل کاری",
    panel: <WorkingFactorsList />
},
{
    label: "لیست درخواست جابجایی شیفت",
    panel: <MoveShift />
}, {
    label: "تایم شیت",
    panel: <TimeShit />
}
]



const useStyles = makeStyles((theme) => ({
    tabs: {
        width: "100%"
    },
    tabItem: {
        minWidth: "110px"
    }
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={0}>{children}</Box>
            )}
        </div>
    );
}
function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

export default function PerformanceProfileForm() {
    const classes = useStyles();
    const [tabValue, set_tabValue] = React.useState(0);

    return (
        <>
            <FusePageSimple
                content={
                <Box>
                        <UserInfoHeader headerTitle="پروفایل کارکرد" />
                        <TabPro tabs={tabs}/>

                    </Box>
                }
            />
        </>
    )
}