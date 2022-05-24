import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import CorrectEvaluatorForm from './CorrectEvaluatorForm'

const CorrectEvaluator=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"اصلاح ارزیاب"} />}
            content=
            {
                <CorrectEvaluatorForm />

            }
            />
        </React.Fragment>
      );
}
export default CorrectEvaluator;