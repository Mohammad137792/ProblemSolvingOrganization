import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import ManagerConformForm from "./ManagerConformForm"
const ManagerConform=()=>{
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"تایید ارزیاب"} />}
            content=
            {
                <ManagerConformForm />

            }
            />
        </React.Fragment>
      );
}
export default ManagerConform;