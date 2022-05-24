import React from "react";
import JobEducation from "./tabs/JobEducation";
import JobCourse from "./tabs/JobCourse";
import JobSkill from "./tabs/JobSkill";
import JobResponsibility from "./tabs/JobResponsibility";
import JobCompetence from "./tabs/JobCompetence";
import JobCondition from "./tabs/JobCondition";
import JobGrade from "./tabs/JobGrade";
import JobCommunication from "./tabs/JobCommunication";
import JobAuthority from "./tabs/JobAuthority";
import JobEquipment from "./tabs/JobEquipment";
import JobQualification from "./tabs/JobQualification";
import Card from "@material-ui/core/Card";
import TabPro from "../../../components/TabPro";

export default function DefineJobTabs({actionObject,data}) {
    const tabs = [{
        label: "تحصیلات",
        panel: <JobEducation jobId={actionObject} data={data}/>
    },{
        label: "نیاز آموزشی",
        panel: <JobCourse jobId={actionObject} data={data}/>
    },{
        label: "مهارت ها",
        panel: <JobSkill jobId={actionObject} data={data}/>
    },{
        label: "مسئولیت ها و وظایف",
        panel: <JobResponsibility jobId={actionObject} data={data}/>
    },{
        label: "شایستگی ها",
        panel: <JobCompetence jobId={actionObject} data={data}/>
    },{
        label: "شرایط کاری",
        panel: <JobCondition jobId={actionObject} data={data}/>
    },{
        label: "طبقه های شغلی",
        panel: <JobGrade jobId={actionObject} data={data}/>
    },{
        label: "ارتباطات",
        panel: <JobCommunication jobId={actionObject} data={data}/>
    },{
        label: "تصمیمات، اختیارات و ابعاد",
        panel: <JobAuthority jobId={actionObject} data={data}/>
    },{
        label: "امکانات و تجهیزات لازم",
        panel: <JobEquipment jobId={actionObject} data={data}/>
    },{
        label: "سایر شرایط احراز",
        panel: <JobQualification jobId={actionObject} data={data}/>
    }]
    return(
        <Card variant="outlined">
            <TabPro tabs={tabs}/>
        </Card>
    )
}
