import React, {useState} from 'react';
import {useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import {Button,Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ActionBox from "../../../../../components/ActionBox";
import DisplayField from "../../../../../components/DisplayField";
import TabPro from "../../../../../components/TabPro";
import CommentPanel from "../../EmplOrder/checking/EOCommentPanel";
import StudyNeedAssessmentOrganizationForm from '../../../../educationModule/BasicInformation/studyneedAssessmentOrganization/StudyNeedAssessmentOrganizationForm';
import FormInput from "../../../../../components/formControls/FormInput";
import CircularProgress from "@material-ui/core/CircularProgress";


export default function NeedAssessmentCorrection (props) {
    const cx = require('classnames');
    const username = useSelector(({ auth }) => auth.user.data.username);
    const {formVariables, submitCallback} = props;
    const verificationList = formVariables.verificationList?.value ?? []
    const index = verificationList.findIndex(i=>(i.username===username ))
    const [formValues, setFormValues] = useState({verificationList});
    const [signData, setSignData] = useState(null);
    const [waiting, set_waiting] = useState(false)

    
    let moment = require('moment-jalaali')
    
    const assessment = formVariables.assessment?.value ?? []

    const profileValues = {
        title: assessment?.title,
        code: assessment?.code,
        resp: assessment?.emplPosition,
        fromDate: moment(assessment?.fromDate).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD'),
    }

    const topFormStructure = [{
        name    : "title",
        label   : "عنوان نیازسنجی ",
    },{
        name    : "code",
        label   : "کد نیازسنجی",
    },{
        name    : "fromDate",
        label   : "تاریخ شروع",
    },{
        name    : "resp",
        label   : "مسئول نیازسنجی",
    }]

    const tabs = verificationList.map((v,i)=>({
        label: <DisplayField value={v.emplPositionId} options="EmplPosition" optionIdField="emplPositionId"/>,
        panel: <CommentPanel data={v} formValues={formValues} setFormValues={setFormValues} currentUser={i===index} setSignData={setSignData}/>
    }))

    function sendtoVerification(){
        const packet = {
            result: "accept",
            api_key: localStorage.getItem('api_key')
        }
        set_waiting(true)
        submitCallback(packet)
    }

    return(
        <>
         <Box p={4} className="card-display">
                <Grid container spacing={2} style={{width: "auto"}}>
                    {topFormStructure.map((input, index) => (
                        <Grid key={index} item xs={input.col || 6}>
                            <FormInput {...input} emptyContext={"─"} type="display" variant="display" grid={false} valueObject={profileValues} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        <Grid container spacing={2}>
           
            <Grid item xs={12}>
                <Card variant="outlined">
                 <StudyNeedAssessmentOrganizationForm curriculumId={formVariables.assessment.value.curriculumId}
                 display={true}/>
                  <ActionBox>
                    <Button type="button" disabled={waiting} endIcon={waiting ?<CircularProgress size={20}/>:null} onClick={sendtoVerification} role="primary">ارسال به مراتب تایید</Button>
                  
                </ActionBox>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card variant="outlined">
                    <TabPro orientation="vertical" tabs={tabs} initialValue={index}/>
                </Card>
            </Grid>

        </Grid>
        </>
    )
}
