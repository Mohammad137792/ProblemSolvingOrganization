import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import VolunteerManagementForm from "./VolunteerManagementForm"
const VolunteerManagement=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"مدیریت داوطلبان"} />}
            content=
            {
                <VolunteerManagementForm />

            }
            />
        </React.Fragment>
      );
}
export default VolunteerManagement;