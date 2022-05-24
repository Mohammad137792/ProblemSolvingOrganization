import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card, Tab, Tabs } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple, FusePageCarded } from '@fuse';
import TabPro from "app/main/components/TabPro";
import { makeStyles } from "@material-ui/core/styles";
import Aggregation from './tabs/Aggregation';
import Performance from './tabs/Performance';

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
export default function PerformanceReportForm() {
    const classes = useStyles();
    const [tabValue, set_tabValue] = React.useState(0);
    return (
        <FusePageCarded
            header={<CardHeader title={' '} />}
            contentToolbar={
                <Box display="flex" style={{ width: "100%" }}>
                    <Box flexGrow={1}>
                        <Tabs indicatorColor="secondary" textColor="secondary"
                            variant="scrollable" scrollButtons="on"
                            value={tabValue} onChange={(e, newValue) => set_tabValue(newValue)}
                            className={classes.tabs}
                        >
                            <Tab {...a11yProps(0)} className={classes.tabItem} label="گزارش کارکرد " />
                            <Tab {...a11yProps(1)} className={classes.tabItem} label=" گزارش تجمیع " />
                        </Tabs>
                    </Box>
                </Box>
            }
            content={
                <Box p={2} >
                    <TabPanel value={tabValue} index={0}>
                        <Performance />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <Aggregation />
                    </TabPanel>

                </Box>

            }
        />
    )
}



