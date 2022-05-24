import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import ReportPerformanceEvaluationForm from './ReportPerformanceEvaluationForm'

const ReportPerformanceEvaluation=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"گزارش ارزيابي عملکرد"} />}
            content=
            {
                <ReportPerformanceEvaluationForm />

            }
            />
        </React.Fragment>
      );
}
export default ReportPerformanceEvaluation;