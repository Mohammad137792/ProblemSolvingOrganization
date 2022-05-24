import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import DefineEvaluationTimeForm from "./DefineEvaluationTimeForm"
const DefineEvaluationTime=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"تعریف دوره ی ارزیابی"} />}
            content=
            {
                <DefineEvaluationTimeForm />

            }
            />
        </React.Fragment>
      );
}
export default DefineEvaluationTime;