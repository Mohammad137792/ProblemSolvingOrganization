import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card, Tab, Tabs } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple, FusePageCarded } from '@fuse';
import TabPro from "app/main/components/TabPro";
import Calendar from './tabs/Calendar';
import Shift from './tabs/Shift';
import WorkingCalendar from "./tabs/WorkingCalendar"
import checkPermis from "app/main/components/CheckPermision";
import {useSelector , useDispatch} from "react-redux";


export default function WorkingCalendarForm() {

    const datas = useSelector(({ fadak }) => fadak);

    let tabsPermision = []

    if(checkPermis("functionalManagement/workCalendar/shift", datas)){
        tabsPermision.push({
            label: "شیفت کاری",
            panel: <Shift />
        })
    }

    if(checkPermis("functionalManagement/workCalendar/calendar", datas)){
        tabsPermision.push({
            label: "تقویم کاری",
            panel: <Calendar />
        })
    }

    if(checkPermis("functionalManagement/workCalendar/calendarPreview", datas)){
        tabsPermision.push({
            label: "تقویم",
            panel: <WorkingCalendar />
        })
    }

    return (
        <React.Fragment>
            <FusePageSimple 
                header={<CardHeader title={'تقویم کاری'} />}
                content={
                    <Card>
                        <CardContent>
                            <TabPro tabs={tabsPermision}/>
                        </CardContent>
                    </Card>
                }
            />
        </React.Fragment>
    )
}