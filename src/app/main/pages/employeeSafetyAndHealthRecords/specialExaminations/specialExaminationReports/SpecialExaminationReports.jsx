import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import SpecialExaminationReportsForm from "./SpecialExaminationReportsForm"


const SpecialExaminationReports=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"گزارشات معاینه خاص"} />}
            content=
            {
                <SpecialExaminationReportsForm />

            }
            />
        </React.Fragment>
      );
}
export default SpecialExaminationReports;