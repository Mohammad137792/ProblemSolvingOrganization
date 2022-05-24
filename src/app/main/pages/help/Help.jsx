import React from "react";
import {FusePageSimple} from "../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import {Tab, Tabs} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import HelpComponents from "./tabs/HelpComponents";
import HelpRules from "./tabs/HelpRules";
import {Redirect, Route, Switch, useRouteMatch, useParams} from "react-router-dom";
import Test1 from "./subs/Test1";
import Maintenance from "../../components/Maintenance";
import HelpTable from "./tabs/HelpTable";
import HelpForm from "./tabs/HelpForm";
import Test2 from "./subs/Test2";
import HelpReducers from "./tabs/HelpReducers";

const useStyles = makeStyles((theme) => ({
    tabs: {
        borderBottom: "1px solid #ddd",
        width: "100%"
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


function Help() {
    const { tab=0 } = useParams();
    const classes = useStyles()
    const [tabValue, setTabValue] = React.useState(Number(tab));
    return <FusePageSimple
        header={
            <CardHeader title="راهنما"/>
        }
        contentToolbar={
            <Tabs indicatorColor="secondary" textColor="secondary"
                  variant="scrollable" scrollButtons="on"
                  value={tabValue} onChange={(e,newValue)=>setTabValue(newValue)}
                  className={classes.tabs}
            >
                <Tab {...a11yProps(0)} label="دستورات عمومی" />
                <Tab {...a11yProps(1)} label="جدول" />
                <Tab {...a11yProps(2)} label="فرم اطلاعات" />
                <Tab {...a11yProps(3)} label="راهنمای المان ها" />
                <Tab {...a11yProps(4)} label="کاهنده ها" />
            </Tabs>
        }
        content={
            <Box p={2}>
                <TabPanel value={tabValue} index={0}>
                    <HelpRules/>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <HelpTable/>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <HelpForm/>
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                    <HelpComponents/>
                </TabPanel>
                <TabPanel value={tabValue} index={4}>
                    <HelpReducers/>
                </TabPanel>
            </Box>
        }
    />
}

export default function HelpRoot(){
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={path}>
                <Help/>
            </Route>
            <Route path={`${path}/tab/:tab`}>
                <Help/>
            </Route>
            <Route path={`${path}/test1`}>
                <Test1/>
            </Route>
            <Route path={`${path}/test2`}>
                <Test2/>
            </Route>
            <Route path={`${path}/maintenance`}>
                <Maintenance/>
            </Route>
            <Route>
                <Redirect to={path} />
            </Route>
        </Switch>
    )
}
