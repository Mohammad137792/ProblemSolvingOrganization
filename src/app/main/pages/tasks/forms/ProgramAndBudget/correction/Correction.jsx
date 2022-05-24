import React, {useState} from 'react';
import {useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import {Button} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ActionBox from "../../../../../components/ActionBox";
import DisplayField from "../../../../../components/DisplayField";
import TabPro from "../../../../../components/TabPro";
import CommentPanel from "../../EmplOrder/checking/EOCommentPanel";
import RequiredCoursesTable from "../../../../educationModule/BasicInformation/requiredCourses/RequiredCourseTable"



export default function ProgramAndBudgetCorrection (props) {
    const cx = require('classnames');
    const username = useSelector(({ auth }) => auth.user.data.username);
    const {formVariables, submitCallback} = props;
    const verificationList = formVariables.verificationList?.value ?? []
    const index = verificationList.findIndex(i=>(i.username===username ))
    const [formValues, setFormValues] = useState({verificationList});
    const [signData, setSignData] = useState(null);


    const tabs = verificationList.map((v,i)=>({
        label: <DisplayField value={v.emplPositionId} options="EmplPosition" optionIdField="emplPositionId"/>,
        panel: <CommentPanel data={v} formValues={formValues} setFormValues={setFormValues} currentUser={i===index} setSignData={setSignData}/>
    }))

    function sendtoVerification(){
        const packet = {
            result: "accept",
            api_key: localStorage.getItem('api_key')
        }
        submitCallback(packet)
    }

    return(
        <Grid container spacing={2}>
          {console.log('curriculumId',formVariables.assessment.value.curriculumId)}
          
            <Grid item xs={12}>
                <Card variant="outlined">
                 <RequiredCoursesTable curriculumId={formVariables.assessment.value.curriculumId} tableCurriculumId={formVariables.assessment.value.curriculumId}
                 display={true} sendtoVerification={sendtoVerification} formVariables={formVariables.assessment}/>
                  {/* <ActionBox>
                    <Button type="button" onClick={sendtoVerification} role="primary">ارسال به مراتب تایید</Button>
                  
                </ActionBox> */}
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card variant="outlined">
                    <TabPro orientation="vertical" tabs={tabs} initialValue={index}/>
                </Card>
            </Grid>

        </Grid>

    )
}
