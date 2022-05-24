import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import {useParams} from "react-router-dom";
import React from "react";
import {FusePageSimple} from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import {Tab, Tabs} from "@material-ui/core";
import HelpTable from "../../help/tabs/HelpTable";
import CompetenceModel from "./competenceModel/CompetenceModel";
import Card from "@material-ui/core/Card";
import Skill from "./skill/Skill";

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


export default function GeneralBaseData() {
    const classes = useStyles()
    const [tabValue, setTabValue] = React.useState(0);
    return <FusePageSimple
        header={
            <CardHeader title="مدیریت استعداد ها"/>
        }
        contentToolbar={
            <Tabs indicatorColor="secondary" textColor="secondary"
                  variant="scrollable" scrollButtons="on"
                  value={tabValue} onChange={(e,newValue)=>setTabValue(newValue)}
                  className={classes.tabs}
            >
                <Tab {...a11yProps(0)} label="مدل شایستگی" />
                <Tab {...a11yProps(1)} label="مهارت ها" />
            </Tabs>
        }
        content={
            <Box p={2}>
                <TabPanel value={tabValue} index={0}>
                    <CompetenceModel/>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Skill/>
                </TabPanel>
            </Box>
        }
    />
}
