import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import EvaluatorDeterminationForm from "./EvaluatorDeterminationForm"
const EvaluatorDetermination=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"تعیین ارزیاب"} />}
            content=
            {
                <EvaluatorDeterminationForm />

            }
            />
        </React.Fragment>
      );
}
export default EvaluatorDetermination;