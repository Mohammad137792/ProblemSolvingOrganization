import React, {useState} from 'react';
import {useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import {Button , Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import QuestionnaireResponder from "../../../../questionnaire/responder/QuestionnaireResponder.jsx"
import FormInput from "../../../../../components/formControls/FormInput";



export default function ResponderForm(props) {
    const cx = require('classnames');
    const username = useSelector(({ auth }) => auth.user.data.username);
    const {formVariables, submitCallback} = props;
    const verificationList = formVariables.contactList?.value ?? []
    const index = verificationList.findIndex(i=>(i.username===username ))
    const [formValues, setFormValues] = useState({verificationList});
    const [signData, setSignData] = useState(null);
    let moment = require('moment-jalaali')
    const profileValues = {
        title: formVariables?.title.value,
        // code: formVariables?.code,
        fromDate: moment(formVariables?.fromDate.value).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD'),
        thruDate: moment(formVariables?.thruDate.value).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD'),
    }
    const formStructure = [{
        name    : "title",
        label   : "عنوان دوره آموزشی ",
    }
    // ,{
    //     name    : "code",
    //     label   : "کد نظرسنجی",
    // }
    ,{
        name    : "fromDate",
        label   : "تاریخ شروع",
    },{
        name    : "thruDate",
        label   : "مهلت پاسخ",
    }]

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

        </Grid>

    )
}
