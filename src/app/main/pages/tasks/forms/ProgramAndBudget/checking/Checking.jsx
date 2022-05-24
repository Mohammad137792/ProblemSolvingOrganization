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
import CircularProgress from "@material-ui/core/CircularProgress";



export default function ProgramAndBudgetChecking (props) {
    const cx = require('classnames');
    const username = useSelector(({ auth }) => auth.user.data.username);
    const {formVariables, submitCallback} = props;
    const verificationList = formVariables.verificationList?.value ?? []
    const index = verificationList.findIndex(i=>(i?.emplPositionId === formVariables?.verify?.value?.emplPositionId))
    const [formValues, setFormValues] = useState({verificationList});
    const [signData, setSignData] = useState(null);
    const [waiting, set_waiting] = useState({'wait':false,'target':false})


    const tabs = verificationList.map((v,i)=>({
        label: <DisplayField value={v.emplPositionId} options="EmplPosition" optionIdField="emplPositionId"/>,
        panel: <CommentPanel data={v} formValues={formValues} setFormValues={setFormValues} currentUser={i===index} setSignData={setSignData}/>
    }))

    const handleSubmit = (order) => (e)=>{
        let moment = require('moment-jalaali')
        let nextVerificationList = verificationList;
        nextVerificationList[index] = Object.assign({}, nextVerificationList[index],{
            comment: formValues.comment,
            verificationDate:  moment().format("Y-MM-DD"),
            result: order,
        })
        const packet = {
            result: order,
            verificationList: nextVerificationList
        }
        let targ = order == "accept" ? 1 : "modify" ? 2 : 3 

        set_waiting({'wait':true,'target':targ})

        submitCallback(packet)
    }

    return(
        <Grid container spacing={2}>
          {console.log('curriculumId',formVariables.assessment.value.curriculumId)}
            <Grid item xs={12}>
                <Card variant="outlined">
                    <RequiredCoursesTable curriculumId={formVariables.assessment.value.curriculumId} tableCurriculumId={formVariables.assessment.value.curriculumId} handleTable={false} formVariables={formVariables.assessment}/>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card variant="outlined">
                    <TabPro orientation="vertical" tabs={tabs} initialValue={index}/>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <ActionBox>
                    <Button type="button" disabled={waiting.wait} endIcon={waiting.target == 1?<CircularProgress size={20}/>:null}  onClick={handleSubmit("accept")} role="primary">تایید</Button>
                    <Button type="button" disabled={waiting.wait} endIcon={waiting.target == 2?<CircularProgress size={20}/>:null}  onClick={handleSubmit("modify")} role="secondary" className={cx(formVariables.verify.value?.modify!=='Y' && "hidden")}>اصلاح</Button>
                    <Button type="button" disabled={waiting.wait} endIcon={waiting.target == 3?<CircularProgress size={20}/>:null}  onClick={handleSubmit("reject")} role="secondary" className={cx(formVariables.verify.value?.reject!=='Y' && "hidden")}>رد</Button>

                </ActionBox>
            </Grid>

        </Grid>

    )
}
