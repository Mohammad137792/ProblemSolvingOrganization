import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import DefineEvaluationForm from "./DefineEvaluationForm"
const DefineEvaluation=()=>{
    return (
          <FusePageSimple 
            header={<CardHeader title={"تعریف دوره ی ارزیابی"} />}
            content=
            {
                <DefineEvaluationForm />

            }
            />
     
      );
}
export default DefineEvaluation;