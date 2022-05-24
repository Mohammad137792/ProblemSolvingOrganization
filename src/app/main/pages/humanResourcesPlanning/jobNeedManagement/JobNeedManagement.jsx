import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import JobNeedManagementForm from "./JobNeedManagementForm"

const JobNeedManagement=()=>{

    return (
        
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"مدیریت نیازمندی شغلی"} />}
            content=
            {
                <JobNeedManagementForm />

            }
            />
        </React.Fragment>
      );
}
export default JobNeedManagement;