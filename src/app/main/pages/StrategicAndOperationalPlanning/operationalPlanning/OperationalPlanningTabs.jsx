import React, { useEffect, useState } from 'react'
import { Card } from "@material-ui/core";
import TabPro from './../../../components/TabPro'


//component tabs
import Tasks from './tabs/Tasks'
import Indicator from './tabs/Indicator'
import Documentation from './tabs/Documentation'
import TimePer from './tabs/TimePer'

import { useDispatch, useSelector } from "react-redux";

import checkPermis from "app/main/components/CheckPermision";

export default function OperationalPlanningTabs({actionObject, dataOption}) {

    const datas = useSelector(({ fadak }) => fadak);

    let tabsPermision = []

    if(checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/tasks", datas)){
        tabsPermision.push({
            label: 'اقدامات و وظایف',
            panel: <Tasks actionObject={actionObject} dataOption={dataOption}/>
        })
    }
    
    if(checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/indicator", datas)){
        tabsPermision.push({
            label: 'شاخص',
            panel: <Indicator  actionObject={actionObject} dataOption={dataOption}/>
        })
    }

    if(checkPermis("strategicAndOperationalPlanning/operationalPlanning/tabs/documentation", datas)){
        tabsPermision.push({
            label: 'مستندات',
            panel: <Documentation actionObject={actionObject} dataOption={dataOption} />
        })
    }

    return (
        <Card>
            <TabPro tabs={tabsPermision} />
        </Card>
    )
}