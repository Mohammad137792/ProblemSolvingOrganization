import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import AccessEvaluatorListForm from './AccessEvaluatorListForm'

const AccessEvaluatorList=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"تعیین ارزیاب"} />}
            content=
            {
                <AccessEvaluatorListForm />

            }
            />
        </React.Fragment>
      );
}
export default AccessEvaluatorList;