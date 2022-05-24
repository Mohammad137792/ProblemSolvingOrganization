import React, {useState} from 'react';
import ActionBox from "../../../../../components/ActionBox";
import {Button , Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SurveyAnalysis from "../../../../survey/analysis/SurveyAnalysis.jsx"
import CardHeader from "@material-ui/core/CardHeader";
import {FusePageSimple} from "@fuse";



export default function ProcessSurveyAnalysis ({formVariables,submitCallback}) {

    const handleSubmit = (order) => (e)=>{
        
        const packet = {
            result: order
        }

        submitCallback(packet)
    }

 
    return(
        <FusePageSimple
            header={
                <CardHeader
                    className="w-full"
                    title={"تحلیل و بررسی نظرسنجی"}
                    
                />
            }
            content={
                <>
                    <SurveyAnalysis questionnaireAppId={formVariables?.questionnaireAppId?.value} code={formVariables?.trackingCode?.value}/>
                    <ActionBox>
                        <Button type="button" onClick={handleSubmit("accept")} role="primary">تایید</Button>
                    </ActionBox>
                </>
            }
        />
        

    )
}
