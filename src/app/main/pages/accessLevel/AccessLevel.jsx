import React, { useState } from 'react'
import { FusePageSimple } from '@fuse'
import { CardHeader, Tabs, Tab, makeStyles, Box } from '@material-ui/core'
import { Access, User, UserGroup } from './tabs'


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

const useStyles = makeStyles((theme) => ({
    tabs: {
        borderBottom: "1px solid #ddd",
        width: "100%"
    }
}));
function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}
function AccessLevel() {
    const [tabValue, setTabValue] = useState(0)
    const classes = useStyles()

    return (
        <FusePageSimple
            header={
                <CardHeader title="مدیریت دسترسی" />
            }
            contentToolbar={
                <Tabs indicatorColor="secondary" textColor="secondary"
                    variant="scrollable" scrollButtons="on"
                    value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}
                    className={classes.tabs}
                >
                    <Tab {...a11yProps(0)} label="کاربران" />
                    <Tab {...a11yProps(1)} label="گروه کاربران" />
                    <Tab {...a11yProps(2)} label="تعیین دسترسی" />
                </Tabs>
            }
            content={
                <Box p={2}>
                    <TabPanel value={tabValue} index={0}>
                        <User />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <UserGroup />
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <Access />
                    </TabPanel>
                </Box>
            }
        />
    )
}

export default AccessLevel