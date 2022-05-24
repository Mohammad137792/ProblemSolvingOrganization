import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import SeniorManagersConfirmationForm from './SeniorManagersConfirmationForm'

const SeniorManagersConfirmation=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"تایید دوره ارزیابی"} />}
            content=
            {
                <SeniorManagersConfirmationForm />

            }
            />
        </React.Fragment>
      );
}
export default SeniorManagersConfirmation;