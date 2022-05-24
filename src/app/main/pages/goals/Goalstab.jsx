import React from "react";
import JobEducation from "../organizationalStructureModule/defineJob/tabs/JobEducation";
import Card from "@material-ui/core/Card";
import TabPro from "../../components/TabPro";
import Documentation from "./Documentation";
import Achievement from './Achievement'
import Feedback from "./Feedback"
import Indicator from './Indicator'
import Actions from './Actions'
export default function DefineJobTabs(props) {  

    const {content,setChangeInTabs,audience}=props;

    const tabs= [
        {
        label: "اقدامات",
        panel: <Actions workEffortId={content} setChangeInTabs={setChangeInTabs} audience={audience} />}
        ,{
        label: "دستاوردها",
        panel: <Achievement workEffortId={content} setChangeInTabs={setChangeInTabs} audience={audience} />
        },{
        label: "بازخوردها",
        panel: <Feedback workEffortId={content} setChangeInTabs={setChangeInTabs} audience={audience} />
        },{
        label: "شاخص ها",
        panel: <Indicator workEffortId={content} setChangeInTabs={setChangeInTabs} audience={audience} />
        },{
        label: "مستندات",
        panel: <Documentation workEffortId={content} setChangeInTabs={setChangeInTabs} audience={audience} />
        }
    ]

    return(
        <Card variant="outlined">
            <TabPro tabs={tabs}/>
        </Card>
    )
}