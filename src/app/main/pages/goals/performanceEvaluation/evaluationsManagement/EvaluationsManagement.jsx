import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import EvaluationsManagementForm from "./EvaluationsManagementForm"
const EvaluationsManagement=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"راهبری دوره های ارزیابی"} />}
            content=
            {
                <EvaluationsManagementForm />

            }
            />
        </React.Fragment>
      );
}
export default EvaluationsManagement;