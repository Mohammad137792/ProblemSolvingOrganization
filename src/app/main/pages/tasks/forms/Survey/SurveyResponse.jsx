import React, {useState} from 'react';
import {useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import {Button , Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ActionBox from "../../../../components/ActionBox";
import QuestionnaireResponder from "../../../questionnaire/responder/QuestionnaireResponder.jsx"
import FormInput from "../../../../components/formControls/FormInput";



export default function ProgramAndBudgetChecking (props) {
    const cx = require('classnames');
    const username = useSelector(({ auth }) => auth.user.data.username);
    const {formVariables, submitCallback} = props;
    const verificationList = formVariables.verificationList?.value ?? []
    const questionaire = formVariables.questionaire?.value ?? []
    const index = verificationList.findIndex(i=>(i.username===username ))
    const [formValues, setFormValues] = useState({verificationList});
    const [signData, setSignData] = useState(null);
    let moment = require('moment-jalaali')
    const profileValues = {
        title: questionaire?.name,
        code: formVariables?.trackingCode?.value,
        fromDate: moment(questionaire?.fromDate).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD'),
        thruDate: moment(questionaire?.thruDate).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD'),
    }
    const formStructure = [{
        name    : "title",
        label   : "عنوان نظرسنجی ",
    },{
        name    : "code",
        label   : "کد رهگیری",
    },{
        name    : "fromDate",
        label   : "تاریخ شروع",
    },{
        name    : "thruDate",
        label   : "مهلت پاسخ",
    }]
    // const tabs = verificationList.map((v,i)=>({
    //     label: <DisplayField value={v.emplPositionId} options="EmplPosition" optionIdField="emplPositionId"/>,
    //     panel: <CommentPanel data={v} formValues={formValues} setFormValues={setFormValues} currentUser={i===index} setSignData={setSignData}/>
    // }))

    const handleSubmit = (order) => (e)=>{
        
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

        submitCallback(packet)
    }

    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box p={4} className="card-display">
                    <Grid container spacing={2} style={{width: "auto"}}>
                        {formStructure.map((input, index) => (
                            <Grid key={index} item xs={input.col || 6}>
                                <FormInput {...input} emptyContext={"─"} type="display" variant="display" grid={false} valueObject={profileValues} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Card variant="outlined">
                    <QuestionnaireResponder answerId={formVariables?.contact?.value.answerId} processConfirmation={handleSubmit("accept")}/>
                </Card>
            </Grid>

            {/* <Grid item xs={12}>
                <Card variant="outlined">
                    <TabPro orientation="vertical" tabs={tabs} initialValue={index}/>
                </Card>
            </Grid> */}

            {/* <Grid item xs={12}>
                <ActionBox>
                    <Button type="button" onClick={handleSubmit("accept")} role="primary">تایید</Button>
                   
                </ActionBox>
            </Grid> */}

        </Grid>

    )
}
